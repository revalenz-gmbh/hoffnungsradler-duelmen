# 🔄 Jahreswechsel-Anleitung

**Hoffnungsradler Dülmen e.V.**
Version 1.0 | Januar 2026

---

## Übersicht

Diese Anleitung beschreibt den vollständigen Prozess für den Jahreswechsel der Buchhaltung und Website. Sie umfasst sowohl den Abschluss des vergangenen Jahres als auch die Vorbereitung für das neue Jahr.

**Zeitaufwand:** ca. 2-3 Stunden
**Häufigkeit:** Einmal jährlich (Anfang Januar)
**Voraussetzungen:** Zugriff auf Google Spreadsheet, Git-Repository, Vercel

---

## Inhaltsverzeichnis

1. [Vorbereitung](#vorbereitung)
2. [Phase 1: Jahresabschluss erstellen](#phase-1-jahresabschluss-erstellen)
3. [Phase 2: Spreadsheet für neues Jahr vorbereiten](#phase-2-spreadsheet-für-neues-jahr-vorbereiten)
4. [Phase 3: Website-Code aktualisieren](#phase-3-website-code-aktualisieren)
5. [Phase 4: Testing & Deployment](#phase-4-testing--deployment)
6. [Checkliste](#checkliste)
7. [Troubleshooting](#troubleshooting)

---

## Vorbereitung

### Was du brauchst

- [ ] Zugriff auf Google Spreadsheet "Buchhaltung Hoffnungsradler"
- [ ] Zugriff auf Git-Repository (GitHub)
- [ ] Alle Buchungsdaten für das abgelaufene Jahr vollständig erfasst
- [ ] Betrag der Spendenübergaben für das abgelaufene Jahr
- [ ] Neues Spendenziel für das kommende Jahr festgelegt

### Wichtige Informationen sammeln

Notiere dir vor dem Start:

```
Jahr (abgeschlossen): _________ (z.B. 2025)
Jahr (neu): _________ (z.B. 2026)

Spendenübergaben [Jahr]:
- Organisation 1: _________ €
- Organisation 2: _________ €
- Gesamt: _________ €

Spendenziel [neues Jahr]: _________ €
```

**Beispiel für 2025 → 2026:**
```
Jahr (abgeschlossen): 2025
Jahr (neu): 2026

Spendenübergaben 2025:
- Kinderkrebshilfe Münster: 5.000 €
- Elterninitiative Datteln: 5.000 €
- Gesamt: 10.000 €

Spendenziel 2026: 5.000 €
```

---

## Phase 1: Jahresabschluss erstellen

### Schritt 1.1: Daten vervollständigen

1. Öffne das Google Spreadsheet "Buchhaltung Hoffnungsradler"
2. Prüfe, dass alle Daten für das abgelaufene Jahr vollständig sind:
   - [ ] Alle Kontoauszüge eingetragen (Zahlungseingänge Konto)
   - [ ] Alle Bargeldspenden dokumentiert (Bargeldspenden)
   - [ ] Alle Ausgaben erfasst (Ausgaben)
   - [ ] Alle Spendenquittungen ausgestellt
   - [ ] Spendenübergaben dokumentiert (Übergebene Spenden)

### Schritt 1.2: Jahresabschluss generieren

1. Im Spreadsheet: Stelle sicher, dass im **Dashboard** (Zelle B3) das **abgelaufene Jahr** steht (z.B. 2025)
2. Klicke auf **📊 Buchhaltung** → **Aktionen** → **Jahresabschluss erstellen**
3. Gib das Jahr ein (z.B. **2025**)
4. Prüfe die Zusammenfassung:
   - Einnahmen korrekt?
   - Ausgaben korrekt?
   - Saldo plausibel?
5. Bestätige

### Schritt 1.3: Jahresabschluss exportieren

1. Das neue Tabellenblatt **"Jahresabschluss 2025"** wurde erstellt
2. Prüfe alle Zahlen sorgfältig
3. Exportiere als PDF:
   - **Datei** → **Herunterladen** → **PDF-Dokument**
   - Speichern als: `Jahresabschluss_2025_Hoffnungsradler_Duelmen.pdf`
4. Speichere das PDF sicher ab (für Steuerberater/Vorstand)

### Schritt 1.4: Notiere wichtige Zahlen

Dokumentiere diese Zahlen aus dem Jahresabschluss (brauchst du später für den Code):

```
Jahr: _________
Einnahmen Gesamt: _________ €
Ausgaben Gesamt: _________ €
Übergebene Spenden: _________ €  ← WICHTIG für Code-Update!
Saldo: _________ €
```

---

## Phase 2: Spreadsheet für neues Jahr vorbereiten

### Strategie: Ein Spreadsheet über Jahre fortführen

Wir verwenden **eine Strategie**, bei der das Haupt-Spreadsheet über Jahre hinweg weitergeführt wird und nur die Buchungszeilen gelöscht werden. Das hat folgende Vorteile:

✅ **Apps Script URL bleibt konstant** → Keine Änderungen an Vercel nötig
✅ **Spendenquittungen fortlaufend** → Nummerierung bleibt konsistent (2025-0001, 2026-0001...)
✅ **Historische Übergaben sichtbar** → Kompletter Überblick seit Vereinsgründung
✅ **Einfacher Workflow** → Jedes Jahr gleicher Prozess

### Schritt 2.1: Archiv-Kopie erstellen

1. Im aktuellen Spreadsheet "Buchhaltung Hoffnungsradler":
   - **Datei** → **Kopie erstellen**
   - Name: **Buchhaltung 2025 - Hoffnungsradler Dülmen e.V. [ARCHIV]**
2. Diese Archiv-Kopie:
   - In einen Ordner "Archive" in Google Drive verschieben
   - Optional: Schreibschutz aktivieren
3. **Wichtig:** Diese Kopie NICHT mehr verändern - sie ist dein historisches Archiv!

### Schritt 2.2: Original-Spreadsheet für neues Jahr vorbereiten

Im **Original-Spreadsheet "Buchhaltung Hoffnungsradler"**:

**A) Dashboard aktualisieren:**
1. Öffne das Tabellenblatt **Dashboard**
2. Ändere Zelle **B3** von `2025` auf `2026`
3. Dashboard sollte jetzt alle Werte auf 0 € zeigen

**B) Buchungstabellen leeren (nur aktuelle Jahresbuchungen):**

Lösche in folgenden Tabellen **alle Datenzeilen** (Kopfzeile BEHALTEN!):
- **Zahlungseingänge Konto** → Alle Zeilen ab Zeile 2 löschen
- **Bargeldspenden** → Alle Zeilen ab Zeile 2 löschen
- **Ausgaben** → Alle Zeilen ab Zeile 2 löschen

**C) Historische Tabellen NICHT leeren (bleiben erhalten!):**

Diese Tabellen NICHT verändern - sie sammeln Daten über Jahre:
- **Übergebene Spenden** → BEHALTEN (historische Übersicht)
- **Spendenquittungen** → BEHALTEN (fortlaufende Nummerierung)
- **Jahresabschluss 2025** → BEHALTEN (historisches Dokument)
- **Dashboard** → BEHALTEN
- **Mitglieder** (falls vorhanden) → BEHALTEN

**D) Optional: Alte Jahresabschluss-Sheets entfernen:**
- Die Jahresabschluss-Tabellenblätter (z.B. "Jahresabschluss 2024", "Jahresabschluss 2025") kannst du:
  - Behalten (wenn du sie schnell verfügbar haben willst)
  - Oder löschen (da sie im Archiv-Spreadsheet sind)

### Schritt 2.3: Testen

1. Prüfe das **Dashboard**:
   - Jahr: 2026 ✓
   - Einnahmen: 0 € ✓
   - Ausgaben: 0 € ✓
   - Saldo: 0 € ✓
2. Test-Buchung eintragen:
   ```
   Zahlungseingänge Konto:
   Datum: 01.01.2026
   Betrag: 1.00
   Absender: Test
   Kategorie: Spende
   ```
3. Dashboard prüfen → sollte 1.00 € Einnahmen zeigen
4. Test-Buchung wieder löschen

---

## Phase 3: Website-Code aktualisieren

### Schritt 3.1: Repository klonen / pullen

```bash
cd hoffnungsradler-duelmen
git pull origin main
```

### Schritt 3.2: Datei 1 - Historische Spenden aktualisieren

Öffne: `src/data/donations.ts`

**A) Füge das abgeschlossene Jahr zu den historischen Spenden hinzu:**

```typescript
export const historicalDonations: YearlyDonation[] = [
  { year: 2025, amount: 10000 }, // NEU: 5000 (Kinderkrebshilfe) + 5000 (Elterninitiative)
  { year: 2024, amount: 7000 },
  { year: 2023, amount: 13000 },
  // ... rest bleibt gleich
];
```

**B) Aktualisiere die Kommentare:**

```typescript
/**
 * Single Source of Truth für historische Spendendaten (2004-2025)  ← Jahr anpassen!
 *
 * Das aktuelle Jahr (2026) wird dynamisch aus der Google Apps Script API geladen.  ← Jahr anpassen!
 *
 * Stand: 10.01.2026  ← Datum anpassen!
 */
```

**C) Aktualisiere den HISTORICAL_TOTAL Kommentar:**

```typescript
/**
 * Berechnet die Gesamtsumme aller historischen Spenden (2004-2025)  ← Jahr anpassen!
 */
export const HISTORICAL_TOTAL = historicalDonations.reduce(
  (sum, donation) => sum + donation.amount,
  0
); // = 101.055 €  ← Betrag wird automatisch berechnet, Kommentar anpassen!
```

**D) Aktualisiere TOTAL_DONATIONS:**

```typescript
/**
 * GESAMTSUMME ALLER ÜBERGEBENEN SPENDEN (2004-2025)  ← Jahr anpassen!
 *
 * Stand: 10.01.2026  ← Datum anpassen!
 *
 * Berechnung:
 * - Historische Spenden (2004-2025): 101.055 €  ← Betrag + Jahr anpassen!
 * = GESAMT: 101.055 €  ← Betrag anpassen!
 */
export const TOTAL_DONATIONS = 101055;  ← Betrag anpassen!
```

**E) Aktualisiere das aktuelle Jahr:**

```typescript
/**
 * Fallback-Wert für aktuelles Jahr (2026) - wird durch API überschrieben  ← Jahr anpassen!
 */
export const currentYearDonations = 0;

/**
 * Spendenziel für das aktuelle Jahr (2026)  ← Jahr anpassen!
 */
export const donationGoal = 5000;  ← Ziel anpassen!

/**
 * Aktuelles Jahr
 */
export const donationYear = 2026;  ← Jahr anpassen!
```

### Schritt 3.3: Datei 2 - Fallback-Dashboard aktualisieren

Öffne: `src/lib/google-sheets-api.ts`

```typescript
/**
 * Fallback-Werte falls die API nicht erreichbar ist
 * Stand: 10.01.2026 (Jahreswechsel - neues Jahr)  ← Datum anpassen!
 *
 * Diese Werte werden nur verwendet wenn:
 * - Die Google Apps Script API nicht erreichbar ist
 * - Im Development-Modus (USE_MOCK_DATA=true)
 */
export const FALLBACK_DASHBOARD: DashboardValues = {
  einnahmenKonto: 0,
  einnahmenBargeld: 0,
  einnahmenGesamt: 0,
  ausgabenKonto: 0,
  ausgabenBargeld: 0,
  ausgabenUebergeben: 0,  // Noch keine Übergaben in 2026  ← Jahr anpassen!
  ausgabenGesamt: 0,
  saldo: 0,
  jahr: 2026,  ← Jahr anpassen!
  lastUpdated: '2026-01-10',  ← Datum anpassen!
};
```

### Schritt 3.4: Datei 3 - Empfänger-Organisationen (optional)

Wenn im abgelaufenen Jahr **mehrere Spendenübergaben** stattfanden, aktualisiere:

Öffne: `src/pages/Spenden.tsx`

Füge die Organisationen für das abgelaufene Jahr hinzu:

```typescript
const recipientMapping: { [year: number]: string | Array<{ recipient: string; amount: number }> } = {
  2025: [  // NEU hinzufügen für abgelaufenes Jahr
    { recipient: "Elterninitiative krebskranker Kinder Datteln", amount: 5000 },
    { recipient: "Kinderkrebshilfe Münster", amount: 5000 },
  ],
  2024: "Datteln Elterninitiative krebskranker Kinder",
  2023: "Datteln Elterninitiative krebskranker Kinder",
  // ... rest bleibt gleich
};
```

**Hinweis:** Wenn es nur EINE Übergabe gab, verwende String-Format:
```typescript
2025: "Name der Organisation",
```

### Schritt 3.5: Zusammenfassung der Änderungen prüfen

Checke, ob du alle Dateien angepasst hast:

- [ ] `src/data/donations.ts` - Historische Spenden + neues Jahr
- [ ] `src/lib/google-sheets-api.ts` - Fallback-Dashboard
- [ ] `src/pages/Spenden.tsx` - Empfänger-Mapping (optional)

---

## Phase 4: Testing & Deployment

### Schritt 4.1: Lokaler Test

```bash
# Abhängigkeiten installieren (falls nötig)
npm install

# Dev-Server starten
npm run dev
```

Öffne: http://localhost:5173

**Teste folgende Seiten:**

**A) Startseite (/):**
- [ ] Fortschrittsbalken zeigt: "2026 – Spendenziel 5.000 €"
- [ ] Aktueller Betrag: 0 € (oder aktueller Saldo minus 300€)
- [ ] "Insgesamt übergeben: 101.055 €"

**B) Spenden-Seite (/spenden):**
- [ ] Tabelle zeigt Jahre 2004-2025
- [ ] 2025 wird mit 10.000 € angezeigt
- [ ] Bei mehreren Übergaben: 2 Zeilen für 2025 sichtbar
- [ ] Gesamtsumme unten: 101.055 €

**C) Browser-Konsole (F12):**
- [ ] Keine Fehler im Console-Log
- [ ] API-Calls erfolgreich (oder Fallback-Daten)

### Schritt 4.2: Git Commit

Wenn alles funktioniert:

```bash
# Status prüfen
git status

# Alle Änderungen stagen
git add .

# Commit erstellen
git commit -m "Jahreswechsel 2025→2026: Historische Spenden aktualisiert, neues Jahr vorbereitet

- 2025 mit 10.000€ zu historischen Spenden hinzugefügt (5.000€ Kinderkrebshilfe + 5.000€ Elterninitiative)
- Aktuelles Jahr auf 2026 gesetzt
- Spendenziel 2026: 5.000€
- Fallback-Daten für 2026 aktualisiert
- Mock-Daten bereinigt
- Fortschrittsbalken: Saldo minus 300€ Reserve"

# Pushen
git push origin main
```

### Schritt 4.3: Vercel Deployment

1. Vercel deployed automatisch nach dem Push
2. Warte 1-2 Minuten
3. Öffne die Live-Website: https://www.hoffnungs-radler-duelmen.de
4. Teste die gleichen Punkte wie beim lokalen Test

### Schritt 4.4: Cache leeren (falls nötig)

Falls alte Daten angezeigt werden:

**Browser-Cache leeren:**
- Chrome: Strg + Shift + R (Hard Reload)
- Firefox: Strg + Shift + R
- Safari: Cmd + Option + R

**LocalStorage leeren:**
1. F12 → Console
2. Eingeben: `localStorage.clear()`
3. Enter
4. Seite neu laden (F5)

---

## Checkliste

### ✅ Phase 1: Jahresabschluss

- [ ] Alle Buchungen für das abgelaufene Jahr vollständig
- [ ] Jahresabschluss im Spreadsheet erstellt
- [ ] PDF exportiert und gespeichert
- [ ] Wichtige Zahlen notiert (Übergebene Spenden!)

### ✅ Phase 2: Spreadsheet vorbereiten

- [ ] Archiv-Kopie erstellt (z.B. "Buchhaltung 2025 - ARCHIV")
- [ ] Archiv in Ordner verschoben
- [ ] Dashboard-Jahr auf neues Jahr geändert (z.B. 2026)
- [ ] Buchungstabellen geleert (Konto, Bargeld, Ausgaben)
- [ ] Historische Tabellen behalten (Übergaben, Quittungen)
- [ ] Test-Buchung erfolgreich
- [ ] Backup des Original-Spreadsheets erstellt

### ✅ Phase 3: Website-Code

- [ ] `src/data/donations.ts` aktualisiert
  - [ ] Historische Spenden erweitert (z.B. 2025)
  - [ ] TOTAL_DONATIONS angepasst
  - [ ] Aktuelles Jahr geändert (z.B. 2026)
  - [ ] Spendenziel gesetzt
- [ ] `src/lib/google-sheets-api.ts` aktualisiert
  - [ ] FALLBACK_DASHBOARD auf neues Jahr
- [ ] `src/pages/Spenden.tsx` aktualisiert (optional)
  - [ ] Empfänger-Organisationen für abgelaufenes Jahr

### ✅ Phase 4: Testing & Deployment

- [ ] Lokaler Test erfolgreich
  - [ ] Startseite korrekt
  - [ ] Spenden-Seite korrekt
  - [ ] Keine Fehler in Console
- [ ] Git Commit erstellt
- [ ] Pushed zu GitHub
- [ ] Vercel Deployment erfolgreich
- [ ] Live-Website getestet

---

## Troubleshooting

### Problem: Spenden-Tabelle zeigt kein 2025

**Ursache:** `recipientMapping` in `src/pages/Spenden.tsx` fehlt der Eintrag für 2025

**Lösung:**
```typescript
const recipientMapping = {
  2025: [
    { recipient: "Organisation 1", amount: 5000 },
    { recipient: "Organisation 2", amount: 5000 },
  ],
  // ...
};
```

### Problem: Gesamtsumme stimmt nicht

**Ursache:** `TOTAL_DONATIONS` in `src/data/donations.ts` nicht aktualisiert

**Lösung:**
1. Addiere alle historischen Spenden: 91.055 € (2004-2024) + 10.000 € (2025) = 101.055 €
2. Setze: `export const TOTAL_DONATIONS = 101055;`

### Problem: Fortschrittsbalken zeigt falsches Jahr

**Ursache:** `donationYear` in `src/data/donations.ts` nicht aktualisiert

**Lösung:**
```typescript
export const donationYear = 2026;
```

### Problem: Dashboard zeigt alte Daten

**Ursache:** Browser-Cache oder LocalStorage-Cache

**Lösung:**
1. Strg + Shift + R (Hard Reload)
2. Falls nicht hilft: LocalStorage leeren (F12 → Console → `localStorage.clear()`)

### Problem: API gibt Fehler zurück

**Ursache:** Google Apps Script URL nicht mehr gültig

**Lösung:**
1. Prüfe: Apps Script ist als Web-App deployed
2. Prüfe: Zugriff ist auf "Jeder" gesetzt
3. Falls neue Deployment-ID: Umgebungsvariable in Vercel aktualisieren

---

## Wichtige Hinweise

### Aufbewahrungspflicht

⚠️ **10 Jahre Aufbewahrungspflicht** für:
- Jahresabschlüsse (PDF)
- Kontoauszüge
- Belege
- Spendenquittungen

→ Archiv-Spreadsheet NICHT löschen!
→ PDFs sicher archivieren!

### Single Source of Truth

Die Gesamtsumme aller Spenden (`TOTAL_DONATIONS`) ist die **einzige Quelle der Wahrheit**:
- Wird einmal pro Jahr manuell aktualisiert (nach Spendenübergabe)
- Wird NICHT dynamisch berechnet
- Grund: Vermeidung von Rundungsfehlern, klare Nachvollziehbarkeit

### Apps Script URL bleibt konstant

✅ **Vorteil unserer Strategie:**
Die Apps Script URL ändert sich NICHT beim Jahreswechsel, da wir das gleiche Spreadsheet weiterverwenden.

→ Keine Änderungen in Vercel nötig!
→ Keine Änderungen im Code nötig (außer historische Daten)!

---

## Zeitplan für zukünftige Jahreswechsel

### Ende Dezember
- [ ] Letzte Buchungen eintragen
- [ ] Spendenquittungen ausstellen
- [ ] Alle Belege zusammentragen

### Anfang Januar (1.-10.)
- [ ] Jahresabschluss erstellen
- [ ] Spreadsheet vorbereiten
- [ ] Website-Code aktualisieren
- [ ] Deployment

### Mitte Januar
- [ ] Jahresabschluss an Steuerberater senden
- [ ] Vorstand informieren
- [ ] Backup-Check

---

## Support

Bei Fragen oder Problemen:

- **Dokumentation:** Siehe `docs/` Ordner
- **GitHub Issues:** [Repository-Link]
- **E-Mail:** [Vereins-E-Mail]

---

**Hoffnungsradler Dülmen e.V.**
*Gemeinsam bewegen wir mehr.*

---

## Anhang: Beispiel-Workflow 2025 → 2026

### Ausgangslage
- Jahr 2025 ist abgeschlossen
- Spendenübergaben: 5.000 € + 5.000 € = 10.000 €
- Spendenziel 2026: 5.000 €

### Schritt-für-Schritt

1. ✅ Jahresabschluss 2025 erstellt → PDF gespeichert
2. ✅ Archiv-Kopie "Buchhaltung 2025 - ARCHIV" erstellt
3. ✅ Dashboard auf 2026 umgestellt
4. ✅ Buchungstabellen geleert
5. ✅ Code aktualisiert:
   - 2025 mit 10.000 € hinzugefügt
   - Jahr auf 2026 gesetzt
   - Spendenziel: 5.000 €
6. ✅ Getestet → Deployed
7. ✅ Website zeigt:
   - "2026 – Spendenziel 5.000 €"
   - "Insgesamt übergeben: 101.055 €"
   - Tabelle mit 2025: 2 Zeilen (je 5.000 €)

### Ergebnis
✅ Buchhaltung bereit für 2026
✅ Website aktualisiert
✅ Historische Daten korrekt
✅ Keine technischen Änderungen nötig (Apps Script URL bleibt)

---

**Version:** 1.0
**Letzte Aktualisierung:** Januar 2026
**Basierend auf:** Jahreswechsel 2025 → 2026
