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

Die einzige Voraussetzung ist die Installation von Node.js & npm - [Installation mit nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

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
