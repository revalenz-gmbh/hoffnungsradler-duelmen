# 🚀 Installation & Einrichtung

**Hoffnungsradler Dülmen e.V. - Buchhaltungssystem**

Diese Anleitung führt Sie Schritt für Schritt durch die Einrichtung des kompletten Buchhaltungssystems.

---

## Übersicht

Das System besteht aus zwei Hauptkomponenten:

1. **Google Apps Script** (Backend/Buchhaltung)
2. **React Website** (Frontend/Öffentliche Ansicht)

```
┌─────────────────────┐
│  Google Spreadsheet │
│  + Apps Script      │ ← Hier arbeiten Sie
│  (Buchhaltung)      │
└──────────┬──────────┘
           │ API
           ▼
┌─────────────────────┐
│   React Website     │
│   (Öffentlich)      │ ← Das sehen die Besucher
└─────────────────────┘
```

---

## Teil 1: Google Spreadsheet & Apps Script einrichten

### Schritt 1.1: Google Spreadsheet erstellen

1. Öffnen Sie [Google Sheets](https://sheets.google.com)
2. Klicken Sie auf **"Neu"** → **"Leeres Tabellenblatt"**
3. Benennen Sie das Spreadsheet:
   ```
   Buchhaltung 2025 - Hoffnungsradler Dülmen e.V.
   ```

### Schritt 1.2: Apps Script hinzufügen

1. Im Spreadsheet: Menü **Erweiterungen** → **Apps Script**
2. Sie sehen den Apps Script Editor mit einer leeren Datei `Code.gs`
3. Löschen Sie den vorhandenen Code
4. Kopieren Sie den kompletten Inhalt aus:
   ```
   Service-Vereinsverwaltung/google-apps-script/Code.gs
   ```
5. Fügen Sie ihn in den Editor ein
6. Benennen Sie das Projekt:
   - Klicken Sie oben links auf "Unbenanntes Projekt"
   - Name: `Buchhaltung API - Hoffnungsradler`
7. Klicken Sie auf **Speichern** (Disketten-Symbol)

### Schritt 1.3: Erste Ausführung & Autorisierung

1. Wählen Sie im Dropdown oben die Funktion `onOpen`
2. Klicken Sie auf **Ausführen** (Play-Symbol)
3. Es erscheint ein Dialog **"Autorisierung erforderlich"**
   - Klicken Sie auf **"Berechtigungen prüfen"**
4. Wählen Sie Ihr Google-Konto
5. Klicken Sie auf **"Erweitert"**
6. Klicken Sie auf **"Zu Buchhaltung API - Hoffnungsradler wechseln (unsicher)"**
7. Klicken Sie auf **"Zulassen"**
8. ✅ Die Autorisierung ist abgeschlossen

### Schritt 1.4: Tabellen anlegen

1. Schließen Sie den Apps Script Editor
2. Gehen Sie zurück zum Spreadsheet
3. Laden Sie die Seite neu (F5)
4. Sie sehen jetzt ein neues Menü: **📊 Buchhaltung**
5. Klicken Sie auf: **📊 Buchhaltung** → **Alle Tabellen neu anlegen**
6. Warten Sie ein paar Sekunden
7. ✅ Alle Tabellen sind erstellt:
   - Dashboard
   - Zahlungseingänge Konto
   - Bargeldspenden
   - Ausgaben
   - Übergebene Spenden
   - Spendenquittungen

### Schritt 1.5: Als Web-App bereitstellen

1. Öffnen Sie wieder den Apps Script Editor:
   **Erweiterungen** → **Apps Script**
2. Klicken Sie oben rechts auf **Bereitstellen** → **Neue Bereitstellung**
3. Einstellungen:
   - Klicken Sie auf das Zahnrad-Symbol
   - Typ: **Web-App**
   - Beschreibung: `Buchhaltung API v1.0`
   - Ausführen als: **Ich (Ihr Google Account)**
   - Zugriff: **Jeder** (für öffentliche Website)
4. Klicken Sie auf **Bereitstellen**
5. **WICHTIG:** Kopieren Sie die **Web-App-URL**
   ```
   https://script.google.com/macros/s/IHRE_DEPLOYMENT_ID/exec
   ```
6. Speichern Sie diese URL - Sie brauchen sie für Teil 2!

---

## Teil 2: Website-Integration

### Schritt 2.1: Umgebungsvariablen konfigurieren

1. Erstellen Sie eine Datei `.env` im Projekt-Root:
   ```bash
   # Im Projekt-Root-Verzeichnis
   touch .env
   ```

2. Öffnen Sie `.env` und fügen Sie ein:
   ```env
   # Google Apps Script Web-App URL
   VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/IHRE_DEPLOYMENT_ID/exec
   ```

3. Ersetzen Sie `IHRE_DEPLOYMENT_ID` mit der URL aus Schritt 1.5

**Beispiel:**
```env
VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/AKfycbxxx_BEISPIEL_xxx/exec
```

### Schritt 2.2: Abhängigkeiten installieren

```bash
npm install
```

### Schritt 2.3: Entwicklungsserver starten

```bash
npm run dev
```

Die Website läuft jetzt auf: http://localhost:5173

### Schritt 2.4: Testen

1. Öffnen Sie http://localhost:5173
2. Scrollen Sie zur Hero-Section (Fortschrittsbalken)
3. Öffnen Sie die Browser-Konsole (F12)
4. Sie sollten sehen:
   ```
   [API] Fetching: https://script.google.com/macros/s/.../exec?action=getDashboard
   [API] Response: {...}
   ```
5. Falls Sie Fehler sehen:
   - Prüfen Sie die URL in `.env`
   - Prüfen Sie, ob die Web-App öffentlich ist ("Zugriff: Jeder")

---

## Teil 3: Produktion (Vercel Deployment)

### Schritt 3.1: Umgebungsvariablen in Vercel setzen

1. Öffnen Sie Ihr Vercel-Projekt
2. Gehen Sie zu **Settings** → **Environment Variables**
3. Fügen Sie hinzu:
   - **Name:** `VITE_APPS_SCRIPT_URL`
   - **Value:** `https://script.google.com/macros/s/IHRE_DEPLOYMENT_ID/exec`
   - **Environment:** Production, Preview, Development (alle auswählen)
4. Klicken Sie auf **Save**

### Schritt 3.2: Re-Deployment

1. Gehen Sie zu **Deployments**
2. Klicken Sie beim letzten Deployment auf **⋯** → **Redeploy**
3. Warten Sie, bis das Deployment abgeschlossen ist
4. ✅ Die Website ist live mit API-Integration!

---

## Teil 4: Erste Daten eintragen (Test)

### Test 1: Spende eintragen

1. Öffnen Sie das Google Spreadsheet
2. Gehen Sie zu **"Zahlungseingänge Konto"**
3. Tragen Sie eine Test-Spende ein:
   ```
   Datum: [Heute]
   Betrag: 100.00
   Absender: Max Mustermann
   Verwendungszweck: Test-Spende
   Kategorie: Spende
   Quittung: Nein
   ```

### Test 2: Dashboard prüfen

1. Gehen Sie zu **"Dashboard"**
2. Prüfen Sie:
   - Einnahmen Konto: Sollte 100.00 € zeigen
   - Gesamt Einnahmen: 100.00 €
   - Saldo: 100.00 €

### Test 3: Website prüfen

1. Öffnen Sie die Website (lokal oder live)
2. Laden Sie die Seite neu (F5)
3. Der Fortschrittsbalken sollte sich aktualisieren
4. Falls nicht: Warten Sie 1-2 Minuten (Google Cache)

### Test 4: Spenden-Seite prüfen

1. Gehen Sie auf der Website zu **"Spenden"**
2. Scrollen Sie zur Tabelle
3. Die Tabelle sollte geladen werden (Lade-Animation, dann Daten)

---

## Fehlerbehebung

### Problem: API-Fehler "Unknown action"

**Ursache:** Apps Script ist nicht korrekt deployed

**Lösung:**
1. Öffnen Sie den Apps Script Editor
2. Prüfen Sie, ob der Code vollständig ist
3. Neu bereitstellen: **Bereitstellen** → **Bereitstellungen verwalten** → **Bearbeiten** → **Bereitstellen**

---

### Problem: CORS-Fehler in der Browser-Konsole

**Ursache:** Apps Script ist nicht öffentlich zugänglich

**Lösung:**
1. Apps Script Editor öffnen
2. **Bereitstellen** → **Bereitstellungen verwalten**
3. Klicken Sie auf das Stift-Symbol
4. Zugriff: **Jeder** (nicht "Jeder mit Google-Konto")
5. Klicken Sie auf **Bereitstellen**

---

### Problem: Daten werden nicht aktualisiert

**Ursache:** Google Apps Script Cache

**Lösung:**
1. Warten Sie 1-2 Minuten
2. Oder: Erstellen Sie eine neue Bereitstellung (neue Version)
3. Aktualisieren Sie die URL in `.env` bzw. Vercel

---

### Problem: "USE_MOCK_DATA" in der Konsole

**Ursache:** Keine API-URL gesetzt

**Lösung:**
1. Prüfen Sie `.env` Datei
2. Prüfen Sie, ob `VITE_APPS_SCRIPT_URL` gesetzt ist
3. Starten Sie den Dev-Server neu: `npm run dev`

---

## Checkliste: Ist alles richtig eingerichtet?

### Google Spreadsheet ✅

- [ ] Spreadsheet erstellt
- [ ] Apps Script eingefügt
- [ ] Autorisiert
- [ ] Alle Tabellen angelegt
- [ ] Dashboard zeigt Zahlen
- [ ] Als Web-App bereitgestellt
- [ ] Web-App-URL kopiert

### Website ✅

- [ ] `.env` Datei erstellt
- [ ] `VITE_APPS_SCRIPT_URL` gesetzt
- [ ] `npm install` ausgeführt
- [ ] `npm run dev` funktioniert
- [ ] Website lädt
- [ ] API-Anfragen in Konsole sichtbar
- [ ] Daten werden angezeigt

### Vercel (Produktion) ✅

- [ ] Umgebungsvariablen gesetzt
- [ ] Neu deployed
- [ ] Live-Website funktioniert
- [ ] API-Integration funktioniert

---

## Nächste Schritte

Nach der erfolgreichen Einrichtung:

1. **Lesen Sie das Benutzerhandbuch:**
   → `docs/BUCHHALTUNG_HANDBUCH.md`

2. **Lesen Sie die Jahresabschluss-Checkliste:**
   → `docs/JAHRESABSCHLUSS_CHECKLISTE.md`

3. **Beginnen Sie mit der Dateneingabe:**
   - Tragen Sie historische Daten ein (falls vorhanden)
   - Beginnen Sie mit der laufenden Buchhaltung

4. **Schulen Sie weitere Benutzer:**
   - Vergeben Sie Zugriff auf das Spreadsheet
   - Schulen Sie im Umgang mit dem System

5. **Erstellen Sie ein Backup-System:**
   - Regelmäßige Backups des Spreadsheets
   - Automatisieren Sie dies (Google Drive Backup)

---

## Support

Bei Problemen:

- **Dokumentation:** Siehe `docs/` Ordner
- **GitHub Issues:** [Repository-Link]
- **E-Mail:** [Vereins-E-Mail]

---

**Viel Erfolg mit Ihrem neuen Buchhaltungssystem! 🎉**

Hoffnungsradler Dülmen e.V.  
*Gemeinsam bewegen wir mehr.*

