# Bestandsaufnahme für den Umzug (Vercel → Proxmox1, Google → Nextcloud)

Stand: 18.10.2026, aus dem Code von `main` (Commit `932f5a8`). Gemessen wurde nur, was im Repo steht.
Was in Vercel, bei Google, in EmailJS oder auf Proxmox konfiguriert ist, ist hier **nicht** geprüft.

Aufwand: **S** = Stunden, **M** = 1–3 Tage, **L** = eine Woche oder mehr.

## 1. Überblick

| Bereich | Heute | Ziel | Aufwand |
|---|---|---|---|
| Statische Website (React/Vite) | Vercel, Auto-Deploy bei Push auf `main` | Proxmox1, Build + Reverse Proxy | S–M |
| Serverless-Funktionen (`api/`) | Vercel Functions | Node-Dienst oder Baustein-Container | S–M |
| Vereinsbuchhaltung | Google Sheet + 6.329 Zeilen Apps Script | Nextcloud | **L** |
| Newsletter | Google Sheet + Gmail + Apps Script + EmailJS | Nextcloud/eigener Versand | **L** |
| Tourverwaltung | Google Sheet + Apps Script (1.246 Zeilen) | Nextcloud oder statische Daten | M |
| Formulare (Kontakt, Spontantour) | EmailJS (Drittanbieter) | eigener Mailversand | M |
| Tourdateien (GPX) | Google Drive Links | Nextcloud-Freigaben | S–M |

## 2. Website und Hosting (Vercel)

**Was an Vercel hängt:**
- `vercel.json`: SPA-Fallback (`/(.*)` → `/index.html`), `/api/:path*`, Funktions-Limits für `api/buchhaltung.ts` (1 GB, 60 s).
- `api/buchhaltung.ts` (186 Zeilen): Proxy zum Apps Script mit Action-Whitelist (`getDashboard`, `getUebergabeSummen`, `getAllYearlyData`, `getJahresabschluss`) und 55 s Timeout. Nutzt `@vercel/node`-Typen.
- `api/spendenstand.ts` (55 Zeilen): liest die Nextcloud-JSON (`SPENDENSTAND_URL`), prüft das Format, 10 min CDN-Cache über `s-maxage`.
- `package.json`: `@vercel/node` als Dev-Abhängigkeit. Node >= 24 vorgeschrieben.
- Env-Variablen laut Code: `GOOGLE_APPS_SCRIPT_URL`, `BUCHHALTUNG_FETCH_TIMEOUT_MS`, `SPENDENSTAND_URL` (Server); `VITE_USE_LIVE_API`, `VITE_EMAILJS_*` (Build).
- Vercel-spezifisch ist wenig: Die Handler nutzen `req`/`res` im Express-Stil und lassen sich fast unverändert in einen Node-Dienst übernehmen.

**Beim Umzug zu beachten:**
- Der Cache (`s-maxage`, `stale-while-revalidate`) kommt von Vercels CDN. Im eigenen Reverse Proxy muss er nachgebaut werden, sonst trifft jeder Besucher die Quelle.
- **Kein `api/voting.ts`**, obwohl `CLAUDE.md` es nennt. Die Voting-Funktion ist tot (siehe Tourverwaltung-Review).
- `public/` wiegt 98 MB, das Git-Paket 86 MiB. Das ist für den Build unkritisch, aber die Fotos sind unkomprimiert (einzelne Bilder 5–12 MB). Für ein eigenes Hosting lohnt sich eine Bildoptimierung.
- Es gibt keine CI. Der Deploy-Mechanismus (Webhook oder Pipeline) muss neu entstehen. Zu klären: Wer baut, wo, und wie wird ausgerollt?
- `dist/` und `.env` sind ignoriert, das ist in Ordnung.
- Die Seite `/spenden` und die Spenden-Subdomain laufen bereits auf Proxmox. Die Regel `/api/anmelden` im (zurückgenommenen) Newsletter-Branch zeigt das Muster, wie Rewrites auf die Subdomain im Proxy aussehen.

## 3. Google-Abhängigkeiten im Detail

### 3.1 Vereinsbuchhaltung (`Service-Vereinsverwaltung/`, 6.329 Zeilen)
- **Das größte Stück.** Mehr als nur Zahlen: Kontoauszug-Import (Sparkasse-CSV mit Regeln und Kategorien), Dashboard, Bargeld, Ausgaben, Übergaben, Mitglieder, Spenderadressen, **Spendenquittungen als PDF mit Mailversand und Storno**, Sammelquittungen, Jahresabschluss, Backups, Mitglieder-Rundmail.
- Zugriff von außen nur lesend über `doGet` (`getDashboard`, `getUebergabeSummen`, `getAllYearlyData`, `getJahresabschluss`, `getDonations`). `doPost` lehnt alles mit 403 ab, Schreiben geht nur direkt im Sheet. Wie der Spenden-Baustein ins Sheet schreibt (eigener Zugang über die Sheets-API?), steht nicht in diesem Repo und ist **zu klären**.
- Google-Dienste im Einsatz: SpreadsheetApp, DriveApp (PDFs, Backups), Mailversand (Quittungen, Mitglieder-Rundmail), Zeit-Trigger (Backup), Menüs und Dialoge im Sheet (`onOpen`, `showCSVImportDialog`).
- **Personenbezogene Daten** (Namen, IBANs, Anschriften, Mailadressen) liegen im Sheet. Der Umzug ist deshalb auch eine Datenschutz-Aufgabe (Auftragsverarbeitung, Löschkonzept).
- Die Buchhaltung ist laut früherem Review das ausgereifteste der drei Systeme (Action-Whitelist, keine PII in der API).
- **Bekannte Lücke:** Die Quittung braucht eine Anschrift, die der Spenden-Baustein nicht liefert.
- Der Spenden-Baustein schreibt laut Datenschutzseite in die **Vereinstabelle bei Google**. Er hängt also vom Google-System ab und muss mit umziehen.

**Nextcloud-Optionen:** (a) Tabellen in Nextcloud (Collabora/Tables) mit eigener Logik darum, (b) kleine eigene Anwendung mit Datenbank, die Nextcloud nur für Dateien nutzt (PDFs, Backups, Export). Die Logik (Import, Kategorien, Quittungen) ist nicht in Nextcloud „nachinstallierbar", sie muss neu geschrieben werden. Hier lohnt sich eine Entscheidung vor der Umsetzung.

### 3.2 Newsletter (`Service-Newsletter/`, ca. 1.850 Zeilen)
- **Architektur:** Die Website schickt über EmailJS eine Mail ans Vereinspostfach. Ein Zeit-Trigger (alle 10 Minuten, Anmeldungen und Abmeldungen) durchsucht das Gmail-Postfach nach festem Betreff, parst den Text und trägt die Adresse ins Sheet ein. Versand über Gmail mit Tageslimit (`checkQuotaUsage`).
- Offene Befunde aus dem Review: kein Double-Opt-In, Abmelde-Token, fragile Postfach-Auswertung.
- Frontend: `TourSignup.tsx` und `NewsletterUnsubscribe.tsx` nutzen EmailJS. Der Abmeldelink in alten Mails zeigt auf `/newsletter/abmelden` und muss erhalten bleiben (Postfächer enthalten ihn noch).
- Der fertige Umbau liegt im Branch `feat/newsletter-ueber-baustein` (Anmeldung über den Baustein, Double-Opt-In). Er ist **nicht** in `main`, weil Baustein und `NEWSLETTER_APPS_SCRIPT_URL` fehlen. Das Frontend-Muster (Rewrite `/api/anmelden`, ehrliche Erfolgsmeldung) lässt sich übernehmen.
- Für den Umzug heißt das: Abonnentenliste, Versand mit Limit/Fortsetzung, Double-Opt-In, Abmeldung und Sendestatus brauchen ein neues Zuhause. Der Mailversand braucht SMTP mit sauberem SPF/DKIM, sonst landet der Newsletter im Spam.
- **Hinweis:** Ein Ordner `Newsletter - Service` im Repo-Root ist leer.

### 3.3 Tourverwaltung (`Service-Tourverwaltung/`, 1.246 Zeilen)
- `doGet` liefert die Tourhistorie (`getTours`) und ein Voting (`getVotingTours`).
- **Das Frontend ruft das Apps Script direkt aus dem Browser auf** (`src/pages/UnsereTouren.tsx`), die URL steht hartkodiert im Quelltext. Das widerspricht der Regel in `CLAUDE.md`, nach der alle Aufrufe über den Proxy laufen. Aus dem früheren Review bekannt.
- Das Voting ist tot, Stimmen gehen still verloren.
- Umzug: Die Tourhistorie ändert sich selten. Eine statische JSON-Datei im Repo oder in Nextcloud würde reichen, ohne Backend.

### 3.4 Drive, Maps, Komoot, Fonts im Frontend
- **Google Drive:** 21 Links (`src/data/tours.ts`, `TourDates.tsx`) auf GPX-Dateien, dazu 2 PDF-Links im Footer. Ein Nextcloud-Ordner mit Freigaben ersetzt das. Die Links sind direkte Download-URLs (`uc?export=download`) und müssen einzeln ausgetauscht werden.
- **Google Maps:** 14 Links auf eigene Karten (`google.com/maps/d`). Sind Nutzerinhalte von Google My Maps. Sie bleiben Google, bis eine Alternative (z. B. Komoot oder OpenStreetMap) gewählt ist.
- **Komoot:** 18 Links. Das ist ein externer Dienst, kein Google, und bleibt vorerst.
- **Google Fonts:** `index.html` lädt Anton, Inter, Playfair von `fonts.googleapis.com`. Das überträgt IP-Adressen an Google. Lokal einbinden (die Spendenseite macht es laut Datenschutzseite schon so). Aufwand: S.
- **`cdn.gpteng.co`** in `index.html` (Lovable-Skript). Prüfen, ob es noch gebraucht wird.

## 4. Weitere Drittanbieter

- **EmailJS:** Kontakt (`Kontakt.tsx`), Spontantour (`SpontanTour.tsx`, zwei Templates), Newsletter-Anmeldung und -Abmeldung. Alle Formulare schicken Eingaben an einen US-Dienst. Ersatz: ein kleiner Endpunkt im eigenen Backend mit SMTP. Aufwand: M. Schlüssel (`VITE_EMAILJS_*`) werden ins Bundle gebaut und sind öffentlich sichtbar.
- **OpenWeatherMap:** `SpontanTour.tsx` ruft die Wetter-API direkt im Browser auf, mit einem **im Quelltext stehenden API-Key**. Der Key ist damit öffentlich. Prüfen, ob das Konto eingeschränkt ist, und besser über den eigenen Server leiten oder erneuern.

## 5. Datenschutzerklärung

`src/pages/Datenschutz.tsx` beschreibt den Ist-Stand (Vercel, Google Sheets/Gmail/Apps Script, EmailJS). Jeder Schritt des Umzugs macht Abschnitte falsch: Abschnitt 7 (Hosting), 8 (Google-Dienste), die EmailJS-Passage und die Newsletter-Passage. **Die Erklärung muss in derselben Änderung angepasst werden wie der Umzug**, nicht danach.

## 6. Risiken und Abhängigkeiten

1. **Gemeinsames Sheet als Klammer:** Buchhaltung, Spenden-Baustein und (geplanter) Newsletter-Baustein sind über Google verbunden. Wer eines umzieht, ohne die anderen mitzudenken, bricht die Kette.
2. **Spendenstand:** Hero holt zuerst Nextcloud, dann Sheet (Fallback). Wenn die Buchhaltung umzieht, fällt der Fallback weg. Dann muss die Nextcloud-Datei verlässlich geliefert werden (Frische-Prüfung: 2 Tage).
3. **Alte Links:** Abmeldelinks in versendeten Newslettern, geteilte Drive-Links in Social Media und Presse, `sitemap.xml`. Redirects einplanen.
4. **Apps-Script-Besonderheiten:** Cold-Start bis 55 s, Mail-Tageslimit, Trigger. Beim Umbau verschwinden diese Probleme, andere kommen (Zustellbarkeit, Monitoring, Backups).
5. **Backups und Monitoring:** Google liefert beides nebenbei. Auf Proxmox braucht es Backups für Datenbank/Dateien und eine Überwachung (Ausfall des Spendenstands, Mailzustellung).
6. **Manuelle Handarbeit offen:** Laut Notizen warten Fixes in `utils.gs` (Newsletter) und `Code.gs` (Tourverwaltung) darauf, von Hand in den Apps-Script-Editor kopiert zu werden. Diese Altlasten sollten vor einem Umzug entweder erledigt oder bewusst verworfen werden.

## 7. Vorschlag für die Reihenfolge

1. **Quick Wins (ohne Abhängigkeit):** Google Fonts lokal, Wetter-Key absichern, `UnsereTouren` auf statische Daten oder Proxy, `CLAUDE.md` korrigieren (`voting.ts`, Proxy-Aussage).
2. **Hosting:** Website + `api/` auf Proxmox1 mit Reverse Proxy und Cache. Datenschutz Abschnitt 7 anpassen. Google-Backend bleibt zunächst unverändert.
3. **Formulare:** EmailJS durch eigenen Mailendpunkt ersetzen.
4. **Newsletter:** neues System mit Double-Opt-In, Datenmigration der Abonnenten, Abmeldelinks erhalten.
5. **Buchhaltung zuletzt:** größte Logik und sensibelste Daten. Erst entscheiden, ob Nextcloud nur Speicher oder auch Anwendung ist. Spendenstand und Spenden-Baustein werden hier mit umgestellt. Idealer Zeitpunkt: Jahreswechsel (`docs/JAHRESWECHSEL.md`).

## 8. Offene Fragen an dich

- Soll die Buchhaltung als eigene Anwendung mit Datenbank entstehen, oder in Nextcloud-Tabellen bleiben?
- Wer pflegt das System künftig, und wie viel Bedienung per Sheet-Menü soll erhalten bleiben (CSV-Import, Quittungsdialog)?
- Wie wird `spenden.hoffnungs-radler-duelmen.de` heute gebaut und ausgerollt? Daran könnte die Hauptseite andocken.
- Bleiben Google My Maps und Komoot als Kartenquellen?
