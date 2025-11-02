# 🔍 Browser Console Check - Fehleranalyse

**Hoffnungsradler Dülmen e.V.**

---

## Übersicht

Diese Anleitung hilft Ihnen, die Browser Console zu überprüfen und häufige Fehler zu beheben.

---

## 🚀 Schritt 1: Dev-Server starten

```bash
npm run dev
```

**Erwartete Ausgabe:**
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

**Falls Fehler:**
```bash
# Fehler: "command not found: npm"
# Lösung: Node.js installieren

# Fehler: "Cannot find module..."
# Lösung: npm install ausführen
```

---

## 🔍 Schritt 2: Browser Console öffnen

1. Öffnen Sie http://localhost:5173
2. Drücken Sie **F12** (oder Rechtsklick → "Untersuchen")
3. Wechseln Sie zum Tab **"Console"**

---

## ✅ Erwartete Console-Ausgabe

### Szenario A: Ohne .env (Entwicklungsmodus)

```javascript
[API] Using mock data for dashboard
[API] Using mock data for Übergabe-Summen
[API] Using mock data for yearly donations
```

**Status:** ✅ Normal  
**Bedeutung:** System nutzt Mock-Daten, da keine API-URL konfiguriert

---

### Szenario B: Mit .env (API verbunden)

```javascript
[API] Fetching: https://script.google.com/macros/s/.../exec?action=getDashboard
[API] Response: { year: 2025, einnahmen: {...}, ... }

[API] Fetching: https://script.google.com/macros/s/.../exec?action=getUebergabeSummen
[API] Response: { summen: {...}, gesamt: 91055 }
```

**Status:** ✅ Normal  
**Bedeutung:** System lädt Daten erfolgreich von Google Sheets

---

## ❌ Häufige Fehler & Lösungen

### Fehler 1: Module not found

```javascript
❌ Error: Cannot find module 'fetchUebergabeSummen'
```

**Ursache:** Alte Dateien werden noch importiert

**Lösung:**
1. Suchen Sie nach `import.*fetchUebergabeSummen` in allen Dateien
2. Entfernen Sie die Imports
3. Ersetzen Sie durch: `import { getUebergabeSummen } from '@/lib/buchhaltung-api'`

---

### Fehler 2: CORS Error

```javascript
❌ Access to fetch at 'https://script.google.com/...' from origin 'http://localhost:5173' 
   has been blocked by CORS policy
```

**Ursache:** Apps Script ist nicht als öffentliche Web-App deployed

**Lösung:**
1. Apps Script Editor öffnen
2. Bereitstellen → Bereitstellungen verwalten
3. Zugriff: **"Jeder"** (nicht "Jeder mit Google-Konto")
4. Neu bereitstellen

---

### Fehler 3: 403 Forbidden

```javascript
❌ GET https://script.google.com/.../exec?action=getDonations 403 (Forbidden)
Response: { error: "Dieser Endpunkt ist aus Datenschutzgründen nicht öffentlich verfügbar." }
```

**Status:** ✅ Normal (Erwartetes Verhalten!)  
**Bedeutung:** Sensible Endpunkte sind korrekt blockiert

**Nur relevant wenn:**
- Sie versuchen `getDonations` aufzurufen
- Alte Code-Teile nutzen blockierte Endpunkte

**Lösung:**
- Prüfen Sie ob alte Dateien noch verwendet werden
- Nutzen Sie die neue `buchhaltung-api.ts`

---

### Fehler 4: Network Error

```javascript
❌ TypeError: Failed to fetch
```

**Mögliche Ursachen:**

**a) Falsche URL in .env**
```bash
# Prüfen Sie .env
VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/IHRE_ID/exec
#                    ^^^^^^^^^ Muss https sein!
```

**b) Apps Script nicht deployed**
```
Lösung: Apps Script als Web-App bereitstellen
```

**c) Keine Internetverbindung**
```
Lösung: Internetverbindung prüfen
```

---

### Fehler 5: Undefined is not an object

```javascript
❌ TypeError: Cannot read property 'einnahmen' of undefined
```

**Ursache:** API gibt leere/fehlerhafte Daten zurück

**Lösung:**
1. Prüfen Sie die API-Response in der Console:
   ```javascript
   // Schauen Sie nach: [API] Response: ...
   ```

2. Falls Response leer:
   - Google Spreadsheet prüfen (existiert?)
   - Apps Script prüfen (Code korrekt?)
   - Dashboard-Tabelle angelegt?

---

## 🧪 Manuelle API-Tests

### Test 1: Dashboard abrufen

```javascript
// In Browser Console einfügen:
fetch('https://script.google.com/macros/s/IHRE_ID/exec?action=getDashboard')
  .then(r => r.json())
  .then(data => console.log('Dashboard:', data))
  .catch(e => console.error('Fehler:', e))
```

**Erwartete Ausgabe:**
```javascript
Dashboard: {
  year: 2025,
  einnahmen: { gesamt: 5000 },
  ausgaben: { gesamt: 200 },
  saldo: 4800
}
```

---

### Test 2: Übergebene Spenden abrufen

```javascript
// In Browser Console:
fetch('https://script.google.com/macros/s/IHRE_ID/exec?action=getUebergabeSummen')
  .then(r => r.json())
  .then(data => console.log('Spenden:', data))
  .catch(e => console.error('Fehler:', e))
```

**Erwartete Ausgabe:**
```javascript
Spenden: {
  summen: { "2024": 7000, "2023": 13000 },
  gesamt: 91055
}
```

---

### Test 3: Blockierter Endpunkt (sollte 403 geben)

```javascript
// In Browser Console:
fetch('https://script.google.com/macros/s/IHRE_ID/exec?action=getDonations')
  .then(r => r.json())
  .then(data => console.log('Response:', data))
  .catch(e => console.error('Fehler:', e))
```

**Erwartete Ausgabe:**
```javascript
Response: {
  error: "Dieser Endpunkt ist aus Datenschutzgründen nicht öffentlich verfügbar."
}
```

**Status:** ✅ Korrekt - Sensible Daten sind geschützt!

---

## 📊 Console Output Checkliste

Nach dem Laden der Seite sollten Sie sehen:

### ✅ Keine roten Fehler
- [ ] Keine `Error` Meldungen in rot
- [ ] Keine `Failed to fetch` Meldungen
- [ ] Keine `Module not found` Meldungen

### ✅ API-Calls erfolgreich
- [ ] `[API] Fetching: ...` wird angezeigt
- [ ] `[API] Response: {...}` wird angezeigt
- [ ] Response enthält Daten (nicht `undefined`)

### ✅ Website lädt korrekt
- [ ] Hero-Section zeigt Fortschrittsbalken
- [ ] Fortschrittsbalken zeigt Betrag (z.B. "4.982 €")
- [ ] "Insgesamt übergeben" zeigt Betrag
- [ ] Keine weißen/leeren Bereiche

### ✅ Spenden-Seite funktioniert
- [ ] Navigieren Sie zu `/spenden`
- [ ] Tabelle zeigt übergebene Spenden
- [ ] Keine Lade-Animation bleibt hängen

---

## 🔧 Debug-Modus aktivieren

Für detaillierte Logs:

```bash
# In .env hinzufügen:
VITE_DEBUG_API=true
```

**Erwartete zusätzliche Ausgabe:**
```javascript
[API] Config: { url: "...", useMockData: false }
[API] Request params: { action: "getDashboard" }
[API] Response status: 200
[API] Response headers: { ... }
```

---

## 📱 Network Tab prüfen

1. Browser DevTools öffnen (F12)
2. Tab **"Network"** oder **"Netzwerk"**
3. Seite neu laden (Strg+R)

### ✅ Erwartete Requests

```
localhost:5173/                     200 OK
localhost:5173/assets/index.js      200 OK
script.google.com/.../exec?action=getDashboard    200 OK
script.google.com/.../exec?action=getUebergabeSummen    200 OK
```

### ❌ Problematische Requests

```
script.google.com/.../exec?action=getDonations    403 Forbidden
→ ✅ Normal! Endpunkt ist blockiert.

script.google.com/.../exec?action=getDashboard    CORS Error
→ ❌ Apps Script Deployment prüfen!

script.google.com/.../exec?action=getDashboard    404 Not Found
→ ❌ URL in .env ist falsch!
```

---

## 🎯 Vollständiger Test-Durchlauf

### Schritt 1: Vorbereitung
```bash
# Terminal
npm install
npm run dev
```

### Schritt 2: Browser
1. http://localhost:5173 öffnen
2. F12 drücken → Console
3. Seite laden (Strg+R)

### Schritt 3: Prüfungen
- [ ] Console: Keine roten Fehler
- [ ] Console: API-Calls sichtbar
- [ ] Fortschrittsbalken zeigt Daten
- [ ] Dashboard zeigt aktuelle Summe

### Schritt 4: Spenden-Seite
1. Navigieren zu: http://localhost:5173/spenden
2. Tabelle sollte Daten zeigen
3. Keine Fehler in Console

### Schritt 5: API-Test (manual)
```javascript
// In Browser Console:
fetch(window.location.origin + '/api/test')
```

---

## 📞 Fehlerbericht erstellen

Falls Sie einen Fehler finden:

### Informationen sammeln:

1. **Console Output:**
   - Screenshot der Console
   - Komplette Fehlermeldung

2. **Network Tab:**
   - Welche Requests schlagen fehl?
   - Status Code? (200, 403, 404, 500?)

3. **Umgebung:**
   - Browser: Chrome / Firefox / Edge?
   - Version: Dev (npm run dev) oder Production?
   - .env konfiguriert? Ja / Nein?

4. **Schritte zur Reproduktion:**
   - Was haben Sie getan?
   - Was war das Ergebnis?
   - Was hätten Sie erwartet?

---

## ✅ Erfolgreiche Installation

Wenn Sie folgendes sehen, ist alles korrekt:

**Console:**
```
[API] Fetching: https://script.google.com/...
[API] Response: { year: 2025, ... }
```

**Website:**
- Fortschrittsbalken mit Betrag
- "Insgesamt übergeben: 91.055 €"
- Spenden-Tabelle lädt Daten

**Keine Fehler in rot**

---

**🎉 Glückwunsch! Ihr System läuft!**

**Hoffnungsradler Dülmen e.V.**  
*Technik, die funktioniert.*

