# Willkommen bei den Hoffnungsradlern Dülmen

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
