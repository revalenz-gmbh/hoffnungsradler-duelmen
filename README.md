# Willkommen bei den Hoffnungsradlern Dülmen e.V.

Dies ist die offizielle Webseite des Hoffnungsradler Dülmen e.V. Hier finden Sie Informationen über unsere Fahrradtouren, Aktivitäten und wie Sie sich beteiligen können.

## Schnellstart

```bash
npm install    # Installiert alle Abhängigkeiten
npm run dev    # Startet den Entwicklungsserver
```

Öffnen Sie dann http://localhost:5173 in Ihrem Browser.

## Projektstruktur

Das Projekt ist wie folgt aufgebaut:

### `/src` - Hauptquellcode

- `App.tsx` & `App.css` - Hauptkomponente der Anwendung
- `main.tsx` - Einstiegspunkt der Anwendung
- `index.css` - Globale Styles
- `/components` - Wiederverwendbare React-Komponenten
- `/pages` - Seitenkomponenten
- `/hooks` - Custom React Hooks
- `/lib` - Hilfsfunktionen und Utilities

### `/public` - Statische Dateien

- `favicon.ico` - Browser-Tab-Icon
- `og-image.png` - Open Graph Vorschaubild für Social Media
- `placeholder.svg` - Platzhalter-Bild für noch nicht geladene Inhalte
- `/lovable-uploads` - Ordner für hochgeladene Medien

## Wie kann ich diesen Code bearbeiten?

Es gibt verschiedene Möglichkeiten, die Anwendung zu bearbeiten.

**Verwendung einer IDE**

Wenn Sie lokal mit Ihrer bevorzugten IDE arbeiten möchten, können Sie dieses Repository klonen und Änderungen pushen. Die gepushten Änderungen werden auch in Lovable angezeigt.

Die einzige Voraussetzung ist die Installation von Node.js 24.x LTS & npm - [Installation mit nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

**Wichtig:** Dieses Projekt erfordert Node.js Version 24.0.0 oder höher. Wenn Sie nvm verwenden, führen Sie `nvm use` aus, um automatisch die richtige Version zu aktivieren (siehe `.nvmrc` Datei).

Folgen Sie diesen Schritten:

```sh
# Schritt 1: Klonen Sie das Repository
git clone https://github.com/nsalewski/hoffnungsradler-duelmen

# Schritt 2: Wechseln Sie in das Projektverzeichnis
cd hoffnungsradler-duelmen

# Schritt 3: Installieren Sie die notwendigen Abhängigkeiten
npm i

# Schritt 4: Starten Sie den Entwicklungsserver mit automatischem Neuladen und Sofortvorschau
npm run dev
```

**Verwendung von Lovable**

Besuchen Sie einfach das [Lovable Projekt](https://lovable.dev/projects/4ddb9728-827f-457a-8cc3-d033e6dc1719) und beginnen Sie mit der Eingabe von Prompts.

Änderungen, die über Lovable vorgenommen werden, können automatisch in dieses Repository übernommen werden.

**Direkte Bearbeitung in GitHub**

- Navigieren Sie zu den gewünschten Dateien.
- Klicken Sie auf die Schaltfläche "Bearbeiten" (Stift-Symbol) oben rechts in der Dateiansicht.
- Nehmen Sie Ihre Änderungen vor und committen Sie diese.

**Verwendung von GitHub Codespaces**

- Navigieren Sie zur Hauptseite Ihres Repositories.
- Klicken Sie auf die Schaltfläche "Code" (grüne Schaltfläche) oben rechts.
- Wählen Sie den Tab "Codespaces".
- Klicken Sie auf "New codespace", um eine neue Codespace-Umgebung zu starten.
- Bearbeiten Sie Dateien direkt im Codespace und committen und pushen Sie Ihre Änderungen, wenn Sie fertig sind.

## Welche Technologien wurden in diesem Projekt verwendet?

Das Projekt wurde mit folgenden modernen Webtechnologien entwickelt:

- [Vite](https://vite.dev/) - Schneller Build-Tool und Entwicklungsserver
- [TypeScript](https://www.typescriptlang.org/) - Typsicheres JavaScript
- [React](https://react.dev/) - Frontend Framework
- [shadcn-ui](https://ui.shadcn.com/) - Moderne UI-Komponenten
- [Tailwind CSS](https://tailwindcss.com/) - Utility-First CSS Framework

## Wie kann ich dieses Projekt deployen?

Das Projekt wird automatisch über [Vercel](https://vercel.com/) gehostet. Jeder Push auf den main-Branch führt automatisch zu einem neuen Deployment.

Die Live-Version ist unter [URL-HIER] erreichbar.

## Integration von Google Spreadsheet (Übergebene Spenden) ins Frontend

### 1. Google Apps Script als Web-API

Das Apps Script stellt eine Web-API bereit, z.B.:

```
https://script.google.com/macros/s/DEINE_WEBAPP_ID/exec?action=getUebergabeSummen
```

Diese URL liefert ein JSON mit den Summen pro Jahr und der Gesamtsumme:

```
{
  "summen": { "2023": 13000, "2024": 1930 },
  "gesamt": 14930
}
```

### 2. Funktion zum Abrufen der Summen im Frontend

In `src/lib/fetchUebergabeSummen.ts` befindet sich eine Funktion:

```ts
export async function fetchUebergabeSummen(apiUrl: string) {
  const res = await fetch(`${apiUrl}?action=getUebergabeSummen`);
  if (!res.ok) throw new Error("Fehler beim Laden der Spendensummen");
  return await res.json();
}
```

### 3. Verwendung in einer React-Komponente

```tsx
import { useEffect, useState } from "react";
import { fetchUebergabeSummen } from "../lib/fetchUebergabeSummen";

const API_URL = "https://script.google.com/macros/s/DEINE_WEBAPP_ID/exec";

export default function UebergabeSummen() {
  const [summen, setSummen] = useState<{ [jahr: string]: number }>({});
  const [gesamt, setGesamt] = useState<number>(0);

  useEffect(() => {
    fetchUebergabeSummen(API_URL).then(data => {
      setSummen(data.summen);
      setGesamt(data.gesamt);
    });
  }, []);

  return (
    <div>
      <h2>Übergebene Spenden</h2>
      <ul>
        {Object.entries(summen).map(([jahr, betrag]) => (
          <li key={jahr}>
            {jahr}: {betrag.toLocaleString("de-DE")} €
          </li>
        ))}
      </ul>
      <strong>Gesamtsumme: {gesamt.toLocaleString("de-DE")} €</strong>
    </div>
  );
}
```

### 4. Wofür sind die Dateien in `src/lib`?

- **spenden-core.ts**: Datenmodell und Interface für verschiedene Datenquellen.
- **spenden-apps-script.ts**: Adapter für die Kommunikation mit der Apps Script Web-API.
- **spenden-google-sheets.ts**: (Platzhalter für direkten Zugriff auf Google Sheets per API.)
- **spenden-example.ts**: Beispiel für die Nutzung eines Providers.
- **fetchUebergabeSummen.ts**: Funktion zum Abrufen der Summen aus dem Apps Script.
- **utils.ts**: Hilfsfunktionen.

**Vorteil:**
Du kannst die Datenquelle später wechseln, ohne das Frontend neu zu schreiben. Die Logik für das Laden, Hinzufügen oder Aktualisieren von Spenden ist gekapselt und wiederverwendbar.

# Hinweise zur Pflege der Webseite Hoffnungsradler Dülmen

## 1. Spendensumme aktualisieren

- Die Spendensummen für das Balkendiagramm und die Gesamtsumme werden in der Datei `src/data/donations.ts` gepflegt.
- Um die aktuelle Spendensumme für das laufende Jahr zu ändern, passe den Wert im Array für das entsprechende Jahr an:

```js
export const donations = [
  { year: 2025, amount: 2220 }, // Beispiel: Jahr 2025, aktuelle Summe
  // ... weitere Jahre ...
];
```
- Nach dem Speichern und einem Neustart des Dev-Servers (`npm run dev`) wird die neue Summe auf der Webseite angezeigt.

---

## 2. Neue Zeitungsartikel einfügen

- Zeitungsartikel werden in der Datei `src/pages/Presse.tsx` gepflegt.
- Jeder Artikel ist ein Objekt im Array `pressArticles`:

```js
const pressArticles = [
  {
    date: "17.05.2025",
    title: "Hoffnungsradler auch am 24. Mai unterwegs",
    source: "Dülmenplus",
    excerpt: "...",
    image: "/zeitungsartikel/duelmenplus-250517.png"
  },
  // ... weitere Artikel ...
];
```
- Das Bild zum Artikel muss im Ordner `/public/zeitungsartikel/` liegen und der Pfad entsprechend gesetzt werden.
- Die neuesten Artikel stehen oben (Sortierung erfolgt automatisch nach Datum).

---

## 3. Tourplanung für das aktuelle Jahr anpassen

- Die geplanten Touren werden in der Datei `src/components/TourDates.tsx` im Array `tours` gepflegt:

```js
const tours = [
  {
    date: "22.06.2025",
    day: "Sonntag",
    name: "Tour nach Rhade-Dorsten",
    distance: "74 km",
    speed: "25-27 km/h",
    time: "10:00 Uhr",
    location: "Sportzentrum Süd",
    address: "Kapellenweg, Dülmen",
    gpxUrl: "...",
    mapUrl: "...",
    komootUrl: "..."
  },
  // ... weitere Touren ...
];
```
- Neue Touren können einfach als neues Objekt ergänzt werden.
- Für abgesagte Touren kann ein Hinweistext im Feld `name` oder `description` ergänzt werden.

---

**Tipp:**
- Bilder für Zeitungsartikel: `/public/zeitungsartikel/`
- Fotos: `/public/photos/`
- Logos: `/public/logos/`

Für weitere Fragen oder Anpassungen einfach im Code nachsehen oder im Team nachfragen!

## Tourpflege

### Aktuelle Touren (TourDates.tsx)
Die aktuellen Touren werden direkt in der Datei `src/components/TourDates.tsx` gepflegt. Um eine Tour zu ändern oder hinzuzufügen:

1. Öffne die Datei `src/components/TourDates.tsx`
2. Suche das Array `tours`
3. Füge eine neue Tour hinzu oder bearbeite eine bestehende:

```typescript
{
  date: "15.06.2025",      // Datum im Format TT.MM.JJJJ
  day: "Sonntag",          // Optional: Wochentag oder besonderer Tag
  name: "Tour-Name",       // Name der Tour
  distance: "65 km",       // Distanz
  time: "10:00 Uhr",       // Startzeit
  location: "Treffpunkt",  // Treffpunkt
  address: "Adresse",      // Adresse des Treffpunkts
  speed: "25-27 km/h",     // Optional: Geschwindigkeit
  gpxUrl: "...",          // Optional: Link zur GPX-Datei
  mapUrl: "...",          // Optional: Link zu Google Maps
  komootUrl: "..."        // Optional: Link zu Komoot
}
```

### Historische Touren (Google Spreadsheet)
Die historischen Touren werden in einem Google Spreadsheet gepflegt und über Google Apps Script automatisch in die Webseite importiert.

1. Öffne das [Touren-Spreadsheet](https://docs.google.com/spreadsheets/d/...)
2. Füge neue Touren in der Tabelle "Historische Touren" hinzu
3. Die Änderungen werden automatisch in die Webseite übernommen

### Touren-Abstimmung (Neues System)
Die Abstimmung über zukünftige Touren wurde neu konzipiert, um sie direkt in die Webseite zu integrieren und fairer zu gestalten. Das System besteht aus drei Komponenten:

Das Herzstück des Systems ist ein Google Apps Script, das als Backend fungiert. Es wird direkt in einem Google Sheet entwickelt und bereitgestellt.

- **`doGet(e)`**: Diese Funktion dient als API-Endpunkt für GET-Anfragen. Sie kann verschiedene Aktionen ausführen, z.B. das Abrufen der zur Abstimmung stehenden Touren (`action=getVotingTours`) oder das gesamte Touren-Archiv.
- **`doPost(e)`**: Diese Funktion empfängt POST-Anfragen, um Daten zu speichern. Im aktuellen Fall wird sie verwendet, um die abgegebenen Stimmen zu verarbeiten. Sie prüft, ob ein Nutzer bereits abgestimmt hat und zählt dann die neuen Stimmen.
- **`setupVoting()`**: Eine Menü-Funktion im Spreadsheet, um eine neue Abstimmungsrunde zu konfigurieren. Sie fragt nach den relevanten Tour-Zeilen und bereitet das `Abstimmung`-Blatt vor.
- **LockService**: Um konkurrierende Schreibzugriffe zu verhindern (z.B. wenn zwei Nutzer exakt gleichzeitig abstimmen), wird der `LockService` von Google verwendet, der den Zugriff auf den Code-Abschnitt für kurze Zeit sperrt.

### Frontend-Anbindung

Die React-Webseite (speziell die `AbstimmungPage.tsx`) kommuniziert direkt mit der bereitgestellten Web-App-URL des Google Apps Scripts.

- **Daten abrufen (GET)**: Beim Laden der Seite wird eine `fetch`-Anfrage an die Script-URL mit dem Parameter `?action=getVotingTours` gesendet, um die Liste der Touren zu erhalten.
- **Stimme abgeben (POST)**: Wenn der Nutzer auf "Abstimmen" klickt, wird eine `POST`-Anfrage mit den ausgewählten Touren und der `subscriberId` im Body an die Script-URL gesendet.

Damit die domainübergreifende Anfrage vom Frontend zum Google-Server funktioniert (Stichwort: CORS), sendet das Google Apps Script bei jeder Antwort den `Access-Control-Allow-Origin: *` Header mit. Dies wird in der `createJsonResponse`-Funktion zentral gesteuert.

## Buchhaltung & Spenden-Verwaltung

Das Projekt verfügt über ein vollständiges Buchhaltungssystem basierend auf Google Spreadsheets mit automatisierten Funktionen:

### Features
- ✅ **Automatisches Dashboard** mit Echtzeit-Übersicht über Einnahmen, Ausgaben und Saldo
- ✅ **CSV-Import & Copy & Paste** für Kontoauszüge mit intelligenter Kategorisierung
- ✅ **Spendenquittungs-System** mit automatischer fortlaufender Nummerierung
- ✅ **Automatischer E-Mail-Versand von Spendenquittungen** (wenn E-Mail-Adresse vorhanden)
- ✅ **Jahresabschluss-Funktion** (Einnahmen-Überschuss-Rechnung)
- ✅ **Mitglieder-Info-Versand** per E-Mail an alle aktiven Mitglieder
- ✅ **Backup-System** mit automatischen täglichen Backups
- ✅ **API-Integration** für dynamische Anzeige auf der Website
- ✅ **Strukturierte Tabellen** für:
  - Zahlungseingänge (Konto)
  - Bargeldspenden
  - Ausgaben
  - Übergebene Spenden
  - Spendenquittungen

### Dokumentation
Die komplette Dokumentation finden Sie unter:

- **📖 [Buchhaltung Übersicht](docs/README.md)** - Gesamtübersicht & Navigation
- **🚀 [Installation](docs/INSTALLATION.md)** - Schritt-für-Schritt Setup-Anleitung
- **📚 [Benutzerhandbuch](docs/BUCHHALTUNG_HANDBUCH.md)** - Tägliche Arbeit mit dem System
- **📧 [Mitglieder-Info](docs/MITGLIEDER_INFO.md)** - E-Mail-Versand an Mitglieder
- **📧 [Spendenquittungen E-Mail](docs/SPENDENQUITTUNGEN_EMAIL.md)** - Automatischer Quittungsversand per E-Mail
- **💾 [Backup-System](docs/BACKUP_SYSTEM.md)** - Datensicherung & Wiederherstellung
- **✅ [Jahresabschluss-Checkliste](docs/JAHRESABSCHLUSS_CHECKLISTE.md)** - Kompletter Workflow für Jahresende

### Schnellstart
1. Lesen Sie die [Installation](docs/INSTALLATION.md)
2. Richten Sie das Google Spreadsheet mit Apps Script ein
3. Konfigurieren Sie die Website-Integration
4. Beginnen Sie mit der Datenpflege

### Technische Integration
Das System besteht aus zwei Komponenten:

**Backend (Google Apps Script):**
- Liegt in `Service-Vereinsverwaltung/google-apps-script/Code.gs`
- Stellt REST-API bereit (nur aggregierte, nicht-personenbezogene Daten)
- Verwaltet alle Buchhaltungsdaten
- 🔒 Sensible Endpunkte blockiert (Datenschutz)

**Frontend (React):**
- `src/lib/buchhaltung-api.ts` - API-Client
- `src/lib/api-config.ts` - Konfiguration
- `src/components/Hero.tsx` - Zeigt Spenden-Fortschritt
- `src/pages/Spenden.tsx` - Zeigt übergebene Spenden

Die Website lädt die Daten automatisch aus dem Google Spreadsheet und zeigt sie in Echtzeit an.

**Sicherheit:**
- ✅ Nur aggregierte Daten über API verfügbar
- ✅ Keine personenbezogenen Daten (Namen, IBANs) öffentlich
- ✅ Schreib-Operationen nur im Spreadsheet
- 📖 Siehe [docs/SICHERHEIT.md](docs/SICHERHEIT.md) für Details

## Technische Details

### CORS-Proxy für die Abstimmung
Um Browser-Sicherheitsbeschränkungen (CORS-Policy) zu umgehen, kommuniziert die Webseite nicht direkt mit dem Google Apps Script. Stattdessen wird ein API-Proxy verwendet:
- **API-Route:** In der Webseite existiert eine API-Route unter `/api/voting`.
- **Ablauf:** Die Abstimmungs-Seite sendet ihre Anfragen (Touren abrufen, Stimme abgeben) an diesen internen Proxy. Der Proxy leitet die Anfrage dann serverseitig sicher an das Google Apps Script weiter und gibt die Antwort zurück an die Webseite.
- **Vorteil:** Dies ist eine robuste, fehlerfreie und moderne Architektur, die zuverlässiges Feedback (z.B. "Du hast bereits abgestimmt") ermöglicht.

### Google Apps Script
Die Integration mit Google Sheets wird über folgende Apps Scripts realisiert:

1. **Service-Tourverwaltung:** Aktualisiert die historischen Touren, berechnet GPX-Daten und verwaltet die Abstimmung (Backend).
2. **Service-Newsletter:** Sendet den Newsletter und erstellt die personalisierten Links für die Abstimmung.

### Newsletter-Integration
Der Newsletter enthält:
- Aktuelle Touren des Monats
- Abstimmungsergebnisse für historische Touren
- Link zum Abstimmungsformular
- GPX-Downloads für geplante Touren

## Support
Bei Fragen zur Tourpflege oder technischen Problemen:
- E-Mail: [E-Mail-Adresse]
- Telefon: [Telefonnummer]
- WhatsApp-Gruppe: [Link]

## Tourverwaltung (aktuelle Termine + Varianten & automatische GPX-Links)

Dieser Abschnitt beschreibt, wie die Touren gepflegt werden und wie die Webseite automatisch GPX-Links je Streckenvariante anzeigt.

### Bausteine
- `src/components/TourDates.tsx`: Anzeige der aktuellen Termine des Jahres (Tabelle auf der Seite „Tour-Termine“).
- `src/pages/UnsereTouren.tsx`: Archivseite. Lädt per Google Apps Script Endpoint eine Liste historischer Touren inkl. direktem `downloadUrl`.
- Google Apps Script (Service-Tourverwaltung): Pflegt/ermittelt die Daten für das Tour-Archiv (u. a. GPX-Downloads) und stellt sie als JSON bereit.

### Datenmodell (vereinfacht)
```ts
interface TourVariant {
  label: string;        // „48 km“, „78 km“, „106 km“
  gpxUrl?: string;      // Direktdownload-URL einer GPX-Datei
  mapUrl?: string;      // optional
  komootUrl?: string;   // optional
}

interface TourDate {
  date: string;         // TT.MM.JJJJ
  day?: string;         // optional
  name: string;
  distance: string;     // Anzeige in der Tabelle (z. B. „48/78/106km“)
  time: string;
  location: string;
  address: string;
  speed?: string;
  gpxUrl?: string;      // für einfache Touren ohne Varianten
  mapUrl?: string;
  komootUrl?: string;
  variants?: TourVariant[]; // für Touren mit mehreren Streckenvarianten
}
```

### Ablauf für Varianten (Beispiel: 28.09.2025 – Baumberger Alpin‑Tour)
1. In `tours2025` ist die Tour mit `variants` vordefiniert (Labels „48 km“, „78 km“, „106 km“).
2. Beim Laden der Seite „Tour‑Termine“ ruft ein `useEffect` in `TourDates.tsx` den gleichen Endpoint ab wie die Seite „Unsere Touren“.
3. Alle Archiv‑Einträge, deren Name (normalisiert) „baumbergealpintour“ bzw. „baumbergeralpintour“ enthält, werden gefiltert.
4. Aus Name oder Distance wird die Zahl (48/78/106) extrahiert und pro Label die `downloadUrl` als `gpxUrl` hinterlegt.
5. Ergebnis: In der Tabelle erscheinen pro Variante automatisch die GPX‑Download‑Buttons, sobald die Daten im Service verfügbar sind.

### Pflege‑Workflow
- Neue/aktualisierte GPX‑Dateien im Service (Google Apps Script / Spreadsheet) pflegen.
- Darauf achten, dass im Archiv‑Datensatz
  - der Name die Zeichenkette „BaumbergeAlpintour“ (oder „Baumberger Alpin‑Tour“) enthält, und
  - die Distanzzahl (48/78/106) entweder im Namen oder im Distance‑Feld vorkommt.
- `downloadUrl` sollte ein Direktdownload sein (z. B. Google Drive: `https://drive.google.com/uc?export=download&id=DATEI_ID`) und öffentlich zugänglich.
- Optional können künftig `mapUrl`/`komootUrl` je Variante ergänzt werden. Die Tabelle zeigt dann zusätzlich Buttons für Maps/Komoot an.

### Einfache Tour ohne Varianten
- Für alle anderen Termine reicht `gpxUrl` direkt am Terminobjekt (kein `variants`).
- Buttons erscheinen automatisch, wenn `gpxUrl`/`mapUrl`/`komootUrl` gesetzt sind.

### Neue Tour mit Varianten anlegen
1. In `tours2025` eine Tour mit `variants: [{ label: "XX km" }, ...]` anlegen.
2. Im Service drei Archiv‑Einträge mit passendem Namen (enthält „BaumbergeAlpintour“) und den Distanzen (z. B. 48/78/106) pflegen.
3. Nach dem Deployment/Reload werden die GPX‑Buttons je Variante automatisch sichtbar.

> Vorteil: Inhalte werden zentral im Service gepflegt. Das Frontend übernimmt sie dynamisch – weniger Pflegeaufwand und konsistente Daten.