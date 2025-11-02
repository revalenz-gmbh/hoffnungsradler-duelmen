# 🧹 Code-Aufräumen - Veraltete Dateien

**Hoffnungsradler Dülmen e.V.**

---

## Übersicht

Nach der Umstellung auf das neue Buchhaltungssystem gibt es alte Dateien, die nicht mehr verwendet werden. Dieses Dokument erklärt, was gelöscht werden kann.

---

## ❌ Dateien die GELÖSCHT werden können

### 1. Veraltete API-Implementierungen

```bash
src/lib/
├── fetchUebergabeSummen.ts      ❌ LÖSCHEN
├── spenden-apps-script.ts       ❌ LÖSCHEN
├── spenden-core.ts              ❌ LÖSCHEN
├── spenden-example.ts           ❌ LÖSCHEN
└── spenden-google-sheets.ts     ❌ LÖSCHEN
```

**Warum?**
- Diese Dateien sind Teil der alten Architektur
- Werden nirgends mehr importiert
- Neue Implementierung: `buchhaltung-api.ts`

**Wie löschen:**
```bash
# PowerShell / CMD
cd src/lib
del fetchUebergabeSummen.ts
del spenden-apps-script.ts
del spenden-core.ts
del spenden-example.ts
del spenden-google-sheets.ts
```

---

## ✅ Dateien die BEHALTEN werden

```bash
src/lib/
├── api-config.ts           ✅ BEHALTEN (neue Konfiguration)
├── buchhaltung-api.ts      ✅ BEHALTEN (neue API)
└── utils.ts                ✅ BEHALTEN (Hilfsfunktionen)
```

---

## 🔄 .env Migration

### Alte .env (vor Migration):

```bash
# ❌ Veraltete Variablen
VITE_APPS_SCRIPT_SPENDEN_URL=https://script.google.com/...
VITE_GOOGLE_SCRIPT_URL=https://script.google.com/...
```

### Neue .env (nach Migration):

```bash
# ✅ Einzige benötigte Variable
VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/IHRE_ID/exec
```

### Migration durchführen:

1. **Sichern Sie Ihre alte URL:**
   ```bash
   # Kopieren Sie die URL aus VITE_APPS_SCRIPT_SPENDEN_URL oder VITE_GOOGLE_SCRIPT_URL
   ```

2. **Erstellen Sie neue .env:**
   ```bash
   # Löschen Sie alte .env
   # Kopieren Sie .env.example zu .env
   copy .env.example .env
   
   # Tragen Sie Ihre URL ein
   VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/IHRE_ID/exec
   ```

3. **Testen:**
   ```bash
   npm run dev
   # Öffnen Sie http://localhost:5173
   # Prüfen Sie Browser Console (F12)
   ```

---

## 🧪 Test-Checklist

Nach dem Aufräumen testen:

### ✅ Frontend (Website)

- [ ] `npm run dev` startet ohne Fehler
- [ ] Öffnen Sie http://localhost:5173
- [ ] **Hero-Section:** Fortschrittsbalken zeigt Daten
- [ ] **Spenden-Seite:** Tabelle lädt Daten
- [ ] **Browser Console (F12):** Keine Fehler

### ✅ API-Verbindung

Erwartete Console-Ausgabe:
```
[API] Using mock data for dashboard
```

ODER (wenn URL gesetzt):
```
[API] Fetching: https://script.google.com/...
[API] Response: { ... }
```

### ❌ Fehler beheben

**Fehler:** `Module not found: fetchUebergabeSummen`
```bash
# Lösung: Datei wurde bereits gelöscht, gut!
# Falls Fehler: Prüfen Sie ob irgendwo noch importiert
```

**Fehler:** `VITE_APPS_SCRIPT_URL is not defined`
```bash
# Lösung: .env Datei erstellen und URL eintragen
```

---

## 📊 Vorher / Nachher

### Vorher (Alte Architektur):

```
src/lib/
├── fetchUebergabeSummen.ts       (deprecated)
├── spenden-apps-script.ts        (deprecated)
├── spenden-core.ts               (deprecated)
├── spenden-example.ts            (deprecated)
├── spenden-google-sheets.ts      (deprecated)
└── utils.ts

.env:
├── VITE_APPS_SCRIPT_SPENDEN_URL
├── VITE_GOOGLE_SCRIPT_URL
└── (mehrere ungenutzte Variablen)
```

### Nachher (Neue Architektur):

```
src/lib/
├── api-config.ts                 ✅ Konfiguration
├── buchhaltung-api.ts            ✅ API-Funktionen
└── utils.ts                      ✅ Hilfsfunktionen

.env:
└── VITE_APPS_SCRIPT_URL          ✅ Einzige Variable
```

**Ergebnis:**
- 🗑️ 5 Dateien weniger
- 🗑️ 2 Environment-Variablen weniger
- ✅ Klarere Struktur
- ✅ Einfacher zu warten

---

## 🚀 Aufräum-Script

Für die Bequemlichkeit:

```bash
# PowerShell Script zum Aufräumen
# Speichern als: cleanup.ps1

Write-Host "🧹 Räume veraltete Dateien auf..." -ForegroundColor Yellow

# Lösche alte API-Dateien
$filesToDelete = @(
    "src\lib\fetchUebergabeSummen.ts",
    "src\lib\spenden-apps-script.ts",
    "src\lib\spenden-core.ts",
    "src\lib\spenden-example.ts",
    "src\lib\spenden-google-sheets.ts"
)

foreach ($file in $filesToDelete) {
    if (Test-Path $file) {
        Remove-Item $file
        Write-Host "✅ Gelöscht: $file" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Nicht gefunden: $file" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "✅ Aufräumen abgeschlossen!" -ForegroundColor Green
Write-Host ""
Write-Host "Nächste Schritte:" -ForegroundColor Cyan
Write-Host "1. Prüfen Sie .env Datei" -ForegroundColor White
Write-Host "2. Führen Sie 'npm run dev' aus" -ForegroundColor White
Write-Host "3. Testen Sie die Website" -ForegroundColor White
```

**Ausführen:**
```bash
# PowerShell
.\cleanup.ps1

# Oder manuell:
cd src/lib
del fetchUebergabeSummen.ts
del spenden-*.ts
```

---

## ⚠️ Wichtig: Vor dem Löschen

### Backup erstellen!

```bash
# Erstellen Sie ein Backup der alten Dateien
mkdir backup
copy src\lib\*.ts backup\

# Oder mit Git:
git add -A
git commit -m "Backup vor Aufräumen"
```

### Prüfen Sie Git Status

```bash
git status

# Stellen Sie sicher:
# - Alle wichtigen Änderungen sind committed
# - Sie können jederzeit zurückgehen (git revert)
```

---

## 🔄 Rollback (Falls nötig)

Falls etwas schief geht:

```bash
# Mit Git:
git checkout HEAD -- src/lib/

# Oder aus Backup:
copy backup\*.ts src\lib\
```

---

## 📞 Support

Bei Problemen:
- Prüfen Sie diese Anleitung nochmal
- Schauen Sie in die Browser Console (F12)
- Kontaktieren Sie den Support

---

**Hinweis:** Das Löschen dieser Dateien ist **optional**. Sie können sie auch behalten - sie stören nicht, da sie nirgends importiert werden. Das Löschen macht den Code nur aufgeräumter.

---

**Hoffnungsradler Dülmen e.V.**  
*Ordnung muss sein.*

