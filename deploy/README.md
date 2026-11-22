# Website auf Proxmox1 betreiben (statt Vercel)

Auftrag für den Einrichter (Mensch oder Agent auf proxmox2): Die Website
`www.hoffnungs-radler-duelmen.de` läuft heute auf Vercel. Sie soll in einem eigenen
LXC-Container auf **proxmox1** laufen und sich bei jedem Merge auf `main` selbst
aktualisieren. Optional zeigt eine zweite Instanz einen Entwicklungs-Branch als Vorschau.

Alles, was dafür im Repo nötig ist, liegt hier in `deploy/` und in `server/server.mjs`.
Bitte **nichts an Vercel ändern**, bis die neue Seite geprüft ist (siehe „Umschalten“).

## 1. Was im Repo bereitsteht

| Datei | Zweck |
|---|---|
| `server/server.mjs` | Node-Server ohne Zusatzpakete. Liefert `dist/` aus (Brotli/Gzip, Cache-Header, Range für Videos, SPA-Fallback), bindet `api/spendenstand.ts` und `api/buchhaltung.ts` unverändert ein, bildet den Vercel-CDN-Cache nach (`s-maxage`, `stale-while-revalidate`), `/healthz` für Prüfungen. Start: `npm start`. |
| `deploy/aktualisieren.sh` | Holt neuen Commit, `npm ci`, `npm run build`, Rauchtest auf Nebenport, schaltet per Symlink um, startet neu, prüft `/healthz`, rollt bei Fehler zurück, behält 3 Stände. Tut nichts ohne neuen Commit. |
| `deploy/hoffnungsradler-web@.service` | systemd-Dienst je Instanz (`live`, `vorschau`). |
| `deploy/hoffnungsradler-update@.service` + `.timer` | Prüft alle 2 Minuten auf neue Commits und ruft das Skript auf. |
| `deploy/beispiel.env` | Vorlage der Umgebungsvariablen (nur Namen, keine Werte). |

Anforderungen: **Node.js 24** (lädt die `.ts`-Dateien in `api/` direkt; ältere Versionen
können das nicht), `git`, `curl`, `util-linux` (`flock`, `runuser`). Build braucht ca.
1 GB RAM, die Releases je ca. 400 MB Platte (Fotos + `node_modules`).

## 2. Container einrichten

1. LXC auf proxmox1 anlegen (Debian 12/13, unprivilegiert, 1–2 CPU, 1 GB RAM, 8 GB Platte).
2. Node 24 installieren (NodeSource oder offizielles Binary), dazu `git curl`.
3. Benutzer und Verzeichnisse:
   ```bash
   useradd --system --create-home --shell /usr/sbin/nologin hoffnungsradler
   install -d -o hoffnungsradler -g hoffnungsradler /opt/hoffnungsradler/live/releases
   install -d -m 750 -o root -g hoffnungsradler /etc/hoffnungsradler
   ```
4. Repo klonen (öffentlich lesbar über HTTPS; sonst einen Deploy-Key mit Nur-Lese-Recht):
   ```bash
   runuser -u hoffnungsradler -- git clone https://github.com/revalenz-gmbh/hoffnungsradler-duelmen.git /opt/hoffnungsradler/live/repo
   ```
5. Umgebung: `deploy/beispiel.env` nach `/etc/hoffnungsradler/live.env` kopieren,
   `chmod 640`, `chown root:hoffnungsradler`, Werte eintragen. **Die Werte stehen in den
   Vercel-Umgebungsvariablen**, Martin muss sie dort ablesen und übergeben. Die
   Apps-Script-URL ist geheim: nicht ins Repo, nicht in Logs, nicht in Chats.
6. Skript und Units installieren (aus dem Klon, nicht aus einem Release):
   ```bash
   install -m 755 /opt/hoffnungsradler/live/repo/deploy/aktualisieren.sh /usr/local/sbin/hoffnungsradler-aktualisieren
   cp /opt/hoffnungsradler/live/repo/deploy/hoffnungsradler-*@.* /etc/systemd/system/
   systemctl daemon-reload
   ERZWINGEN=1 /usr/local/sbin/hoffnungsradler-aktualisieren live   # erster Build, legt current an
   systemctl enable --now hoffnungsradler-web@live.service hoffnungsradler-update@live.timer
   curl -s localhost:3000/healthz   # → ok
   ```
   Ändert sich später `deploy/aktualisieren.sh` oder eine Unit im Repo, muss sie von Hand
   neu installiert werden (bewusst: ein Commit soll den Ausrollweg nicht selbst umbauen).

Protokolle: `journalctl -u hoffnungsradler-update@live -u hoffnungsradler-web@live -f`

**Speicherdauer der Logs: höchstens 14 Tage** – so steht es in der Datenschutzerklärung.
Im Container `MaxRetentionSec=14day` in `/etc/systemd/journald.conf` setzen und
`systemctl restart systemd-journald`. Dasselbe gilt für die Zugriffslogs des Reverse
Proxys (dort stehen IP-Adressen): Rotation täglich, 14 Stück behalten, oder kürzer.
Der Node-Server selbst protokolliert nur Methode, Pfad (ohne Parameter), Status und Dauer.

## 3. Reverse Proxy und TLS

Die Website kommt hinter den vorhandenen Reverse Proxy, über den schon
`spenden.hoffnungs-radler-duelmen.de` läuft (gleiches Muster verwenden).

- `www.hoffnungs-radler-duelmen.de` → `http://<container>:3000`;
  `hoffnungs-radler-duelmen.de` (ohne www) → dauerhafte Weiterleitung (heute 308) auf `https://www.…`.
- TLS am Proxy, dort auch `Strict-Transport-Security: max-age=31536000`.
- `X-Forwarded-For` aus der echten Client-Adresse setzen (`$remote_addr`), nicht durchreichen.
- **Proxy-Timeout mindestens 65 s** für `/api/buchhaltung`: Das Apps Script braucht beim
  Kaltstart bis zu 55 s.
- Im Proxy **nicht** zusätzlich cachen und nicht komprimieren, das erledigt der Node-Server
  (sonst doppelt komprimiert oder veralteter Spendenstand).
- Firewall: Die Spendenseite hatte schon einmal das Bild „https verbindet, aber keine
  Antwort“. Ursache war eine von selbst aktivierte Firewall. Bei diesem Bild zuerst dort schauen.

## 4. Vorschau-Instanz (optional)

Zweite Instanz `vorschau` mit gleichem Aufbau, z. B. für einen Branch `develop`:

- `/opt/hoffnungsradler/vorschau/{repo,releases}`, eigene `/etc/hoffnungsradler/vorschau.env`
  mit `BRANCH=develop`, `PORT=3001`, `VORSCHAU=1` (setzt `X-Robots-Tag: noindex`).
- `systemctl enable --now hoffnungsradler-web@vorschau hoffnungsradler-update@vorschau.timer`
- Subdomain z. B. `vorschau.hoffnungs-radler-duelmen.de`, **mit Basic-Auth im Proxy**
  (die Vorschau ruft echte Daten ab und soll nicht öffentlich auffindbar sein).
- Der Branch `develop` muss auf GitHub existieren. Workflow: Feature-Branch → `develop`
  (Vorschau prüfen) → `main` (live).

## 5. Prüfen vor dem Umschalten

**Auf der Vorschau-Instanz prüfen** (Branch `develop`). Dort liegt schon alles, was mit dem
Umzug live gehen soll (u. a. `/api/touren`). `main` bekommt diese Stände erst beim
Umschalten, weil Vercel `main` bis dahin weiter ausliefert und dort
`TOUREN_APPS_SCRIPT_URL` bewusst nicht gesetzt ist. Die `live`-Instanz zeigt bis zum
Umschalten also noch den älteren Stand; `/api/touren` gibt es dort erst danach.

Gegen den neuen Server, z. B. mit `curl --resolve …:443:<proxy-ip>` oder einem Hosts-Eintrag:

- [ ] `/` lädt, Startbild und Spendenbalken mit Zeile „Stand: …“ erscheinen
- [ ] `/api/spendenstand` → 200 JSON; zweiter Aufruf mit Header `X-Cache: HIT`
- [ ] `/api/buchhaltung?action=getDashboard` → 200 JSON (kann beim ersten Mal bis 55 s dauern)
- [ ] Unterseite direkt aufrufen, z. B. `/sponsoren`, `/newsletter/abmelden?id=x&email=y` → Seite (kein 404)
- [ ] `/gibtsnicht` → React-Seite „nicht gefunden“; `/photos/gibtsnicht.jpg` → 404
- [ ] `/sitemap.xml`, `/robots.txt`, `/Archivuebersicht.html` erreichbar
- [ ] Video auf der Startseite spielt auf dem iPhone (Range-Anfragen)
- [ ] Kontaktformular schickt ab (EmailJS-Werte im Build vorhanden)
- [ ] Ein Test-Commit auf `main` ist nach ≤ 5 Minuten live (`journalctl` zeigt „live: …“)

## 6. Umschalten und Rückweg

1. DNS-TTL von `www` und Apex vorher auf 300 s senken (wenn möglich einen Tag vorher).
2. **Code für den Umzug nach `main` bringen** (macht Martin bzw. Claude im Website-Repo):
   `develop` nach `main` mergen, dann den Branch `docs/datenschutz-eigenes-hosting`
   mit echtem Stand-Datum statt `UMZUGSDATUM`. Warten, bis die `live`-Instanz im Journal
   „live: <commit>“ meldet, und `/api/touren` sowie `/datenschutz` auf `live` prüfen.
   (Vercel baut `main` dabei auch; dort fehlt bis zum DNS-Wechsel nur das Tourarchiv.)
3. DNS auf die öffentliche Adresse des Proxys umstellen. Zertifikat muss vorher ausgestellt
   sein (HTTP-01 klappt erst nach DNS-Wechsel → ggf. DNS-01 oder kurz akzeptieren).
4. Vercel-Projekt **noch nicht löschen**. Rückweg = DNS zurück auf Vercel. Erst nach
   einigen Wochen stabilem Betrieb Auto-Deploy dort abschalten.
5. Auf Vercel läuft außerdem der **Ticketservice** (eigenes Projekt). Den nicht anfassen.

## 7. Was danach im Repo noch zu tun ist

- **Datenschutzerklärung** (`src/pages/Datenschutz.tsx`, Abschnitt Hosting) nennt Vercel. Der neue Text liegt im Branch `docs/datenschutz-eigenes-hosting` (Platzhalter `UMZUGSDATUM` beim Stand-Datum ersetzen).
  Muss **mit dem Umschalten** auf den eigenen Server geändert werden, nicht später.
- `vercel.json` und der Vercel-Hinweis in `CLAUDE.md` können nach der Abschaltung weg.
- Backups: Der Container ist reproduzierbar aus Git + `/etc/hoffnungsradler/*.env`.
  Nur die env-Dateien gehören ins Backup (vertraulich behandeln).
- Überwachung: `/healthz` und `/api/spendenstand` von außen prüfen (z. B. Uptime Kuma),
  damit ein Ausfall auffällt. Google/Vercel haben das bisher nebenbei erledigt.
