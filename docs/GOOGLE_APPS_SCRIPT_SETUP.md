# Google Apps Script Web-App Einrichtung

Diese Anleitung erklärt, wie du die Google Apps Script Web-App deployst, damit die Website die Spendendaten direkt aus dem Google Sheet laden kann.

## Warum Web-App?

Das Google Sheet enthält persönliche Daten und kann nicht öffentlich freigegeben werden. Die Web-App fungiert als sichere API-Schicht:
- ✅ Gibt nur aggregierte Spendensummen zurück (keine Namen, IBANs, etc.)
- ✅ Das Sheet bleibt privat
- ✅ Keine CORS-Probleme

## Schritt 1: Apps Script Editor öffnen

1. Öffne das Google Sheet: https://docs.google.com/spreadsheets/d/1rfP-sM38RYmwY9PKEDQQ7Hb28qY_kXUmsl92rpyc3Yg/
2. Gehe zu **Erweiterungen** → **Apps Script**

## Schritt 2: Code aktualisieren

Stelle sicher, dass der aktuelle `Code.gs` aus dem Repository im Apps Script Editor ist.
Der Code befindet sich unter: `Service-Vereinsverwaltung/google-apps-script/Code.gs`

## Schritt 3: Web-App bereitstellen

1. Klicke im Apps Script Editor auf **Bereitstellen** → **Neue Bereitstellung**
2. Klicke auf das ⚙️ Zahnrad neben "Typ auswählen"
3. Wähle **Web-App**
4. Konfiguriere:
   - **Beschreibung:** `Hoffnungsradler API v1`
   - **Ausführen als:** `Ich (deine E-Mail)`
   - **Zugriff:** `Jeder` ⚠️ Wichtig!
5. Klicke auf **Bereitstellen**
6. Bei der ersten Bereitstellung: Berechtigungen genehmigen
7. **Kopiere die Web-App-URL**

Die URL sieht so aus:
```
https://script.google.com/macros/s/AKfycbxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx/exec
```

## Schritt 4: URL in der Website konfigurieren

### Option A: Umgebungsvariable (empfohlen)

1. Erstelle eine `.env` Datei im Projektroot:
```bash
VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/DEINE_DEPLOYMENT_ID/exec
```

2. Starte den Dev-Server neu

### Option B: Direkt in api-config.ts

Bearbeite `src/lib/api-config.ts`:
```typescript
export const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/DEINE_DEPLOYMENT_ID/exec';
```

## Schritt 5: Testen

1. Rufe die API-URL im Browser auf mit `?action=getUebergabeSummen`:
   ```
   https://script.google.com/macros/s/DEINE_ID/exec?action=getUebergabeSummen
   ```

2. Du solltest eine JSON-Antwort erhalten:
   ```json
   {
     "summen": {
       "2025": 5000,
       "2024": 7000,
       "2023": 13000
       // ...
     },
     "gesamt": 96055
   }
   ```

## API-Endpunkte

| Aktion | Beschreibung |
|--------|--------------|
| `getUebergabeSummen` | Übergebene Spenden pro Jahr |
| `getDashboard` | Aktuelle Dashboard-Daten |
| `getAllYearlyData` | Alle Jahres-Spendendaten |
| `getJahresabschluss&year=2024` | Jahresabschluss für ein Jahr |

## Bei Änderungen

Wenn du den `Code.gs` änderst:
1. Gehe zu **Bereitstellen** → **Bereitstellungen verwalten**
2. Klicke auf das ✏️ Stift-Symbol
3. Wähle bei "Version" → **Neue Version**
4. Klicke auf **Bereitstellen**

Die URL bleibt gleich, aber der neue Code wird verwendet.

## Fehlerbehandlung

Falls die API nicht funktioniert:
1. Prüfe die Logs: Apps Script Editor → **Ausführung** (linke Seite)
2. Stelle sicher, dass das Sheet die erwarteten Tabellen hat
3. Teste die `getUebergabeSummen()` Funktion direkt im Editor (▶️ Ausführen)

