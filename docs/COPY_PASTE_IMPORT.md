# 📋 Copy & Paste Import - Sparkassen-Daten direkt einfügen

**Hoffnungsradler Dülmen e.V.**

---

## 🎯 Übersicht

Sie können jetzt Sparkassen-Kontoauszüge **direkt per Copy & Paste** in die Tabelle "Zahlungseingänge Konto" einfügen!

**Kein CSV-Import-Dialog nötig** - einfach kopieren und einfügen! ✅

---

## ✅ Vorteile

- ✅ **Schneller:** Copy & Paste ist sofort
- ✅ **Einfacher:** Kein Dialog, keine Umwege
- ✅ **Direkt:** Daten landen genau dort, wo sie sollen
- ✅ **Flexibel:** Sie können einzelne Zeilen oder viele auf einmal einfügen

---

## 🚀 Schritt-für-Schritt Anleitung

### Schritt 1: CSV-Datei herunterladen

1. Öffnen Sie Ihr Sparkassen-Online-Banking
2. Gehen Sie zu **Umsätze** oder **Kontoauszüge**
3. Wählen Sie den Zeitraum (z.B. letzter Monat)
4. Klicken Sie auf **Exportieren**
5. Wählen Sie: **Excel (CSV - gefilterte Einträge)** ⭐
6. Speichern Sie die Datei

---

### Schritt 2: CSV-Datei öffnen

**Option A: Mit Excel**
1. Öffnen Sie die CSV-Datei mit Excel
2. Markieren Sie **alle Datenzeilen** (nicht die Kopfzeile!)
3. **Strg+C** zum Kopieren

**Option B: Mit Texteditor**
1. Öffnen Sie die CSV-Datei mit Notepad/Editor
2. Markieren Sie **alle Zeilen ab der zweiten** (nicht die Kopfzeile!)
3. **Strg+C** zum Kopieren

---

### Schritt 3: In Spreadsheet einfügen

1. Öffnen Sie Ihr Google Spreadsheet
2. Gehen Sie zur Tabelle **"Zahlungseingänge Konto"**
3. Klicken Sie auf die **erste freie Zeile** (unter dem letzten Eintrag)
4. **Strg+V** zum Einfügen
5. ✅ **Fertig!**

### Schritt 4: Mitglieder-Zuordnung (Optional)

**Falls Sie Mitglieder haben:**
1. Menü: **📊 Buchhaltung** → **Aktionen** → **Mitglieder-Zuordnung aktualisieren**
2. System ordnet automatisch Zahlungseingänge Mitgliedern zu
3. Mitgliedsnummern werden in Spalte **O** eingetragen
4. ✅ **Fertig!**

📖 **Detaillierte Anleitung:** [MITGLIEDERVERWALTUNG.md](./MITGLIEDERVERWALTUNG.md)

---

## 📊 Spalten-Übersicht

Die Tabelle hat **exakt die gleiche Struktur** wie der Sparkassen-Export:

### CSV-Spalten (1-12):

| Spalte | Name | Beschreibung |
|--------|------|-------------|
| A | Auftragskonto | Ihr Vereinskonto |
| B | Buchungstag | Datum der Buchung |
| C | Valutadatum | Wertstellungsdatum |
| D | Buchungstext | z.B. "SEPA-Überweisung" |
| E | Verwendungszweck | Verwendungszweck der Überweisung |
| F | Begünstigter | Name des Spenders |
| G | Kontonummer | IBAN/Kontonummer |
| H | BIC (SWIFT) | BIC-Code |
| I | Betrag | Betrag in Euro |
| J | Waehrung | z.B. "EUR" |
| K | Info | Zusatzinformationen |
| L | Kategorie | **Wird automatisch befüllt oder Sie tragen ein** |

### Zusätzliche Spalten (13-16):

| Spalte | Name | Beschreibung |
|--------|------|-------------|
| M | Quittung ausgestellt | Ja/Nein |
| N | Quittungsnummer | z.B. "2025-0001" |
| O | Mitgliedsnummer | Falls zutreffend |
| P | Bemerkung | Ihre Notizen |

---

## 💡 Praktische Tipps

### Tipp 1: Kopfzeile NICHT kopieren

**❌ Falsch:**
```
✅ Kopfzeile + Daten kopieren
→ Kopfzeile wird als Daten eingefügt
```

**✅ Richtig:**
```
✅ Nur Datenzeilen kopieren
→ Keine Kopfzeile
```

**In Excel:**
- Kopfzeile markieren: **Zelle A1** (nicht inkludieren!)
- Dann **Shift+End+↓** um alle Daten zu markieren
- **Strg+C** kopieren

---

### Tipp 2: Mehrere Zeilen auf einmal

**✅ Funktioniert:**
```
CSV-Datei öffnen
→ Alle Zeilen markieren (Strg+A)
→ Kopfzeile manuell de-selektieren
→ Kopieren
→ In Spreadsheet einfügen
→ Alle Buchungen auf einmal! 🎉
```

---

### Tipp 3: Formatierung wird automatisch übernommen

Nach dem Einfügen:
- ✅ Datum wird als Datum erkannt
- ✅ Betrag wird als Währung formatiert
- ✅ Währung wird auf "EUR" gesetzt (falls leer)
- ✅ Dropdowns funktionieren (Kategorie, Quittung)

---

### Tipp 4: Kategorie nachfüllen

**Automatisch:**
- Die Spalte **L (Kategorie)** kann leer bleiben
- Sie füllen sie später per Dropdown aus

**ODER:**
- Verwenden Sie Import-Regeln (siehe unten)

---

## 🔄 Import-Regeln nutzen (Optional)

Falls Sie die Kategorie **automatisch** befüllen möchten:

1. Nach dem Einfügen: **📊 Buchhaltung** → **🔄 Import** → **Import-Regeln bearbeiten**
2. Regeln anpassen (z.B. "spende" → Spende)
3. **ODER:** Nutzen Sie die CSV-Import-Funktion für automatische Kategorisierung

**Beide Methoden funktionieren!**
- Copy & Paste = schnell & manuell
- CSV-Import = automatisch & intelligent

---

## ⚠️ Wichtige Hinweise

### Nur Eingänge einfügen

**✅ Richtig:**
- Nur **positive Beträge** (Eingänge)
- Aussortieren Sie Ausgaben vorher

**❌ Falsch:**
- Ausgaben mit einfügen
- Negative Beträge

**Tipp:** In Excel können Sie vorher filtern:
1. Filter auf Spalte "Betrag" setzen
2. Nur positive Werte anzeigen
3. Dann kopieren

---

### Dubletten vermeiden

**Problem:** Sie haben die gleichen Daten zweimal eingefügt

**Lösung:**
1. Google Sheets → **Daten** → **Dubletten entfernen**
2. Oder manuell: Sortieren nach Datum und doppelte Zeilen löschen

**Tipp:** Importieren Sie immer nur **neue** Daten

---

### Format prüfen

Nach dem Einfügen sollten Sie sehen:

✅ **Datum** (Spalte B): Formatiert als `DD.MM.YYYY`
✅ **Betrag** (Spalte I): Formatiert als `1.234,56 €`
✅ **Währung** (Spalte J): "EUR"

**Falls nicht:**
1. Spalte markieren
2. **Format** → **Zahl** → **Datum** bzw. **Währung**

---

## 📋 Quick-Reference

### Copy & Paste Workflow:

```
1. Sparkasse: Export als CSV
2. Excel/Editor öffnen
3. Daten markieren (ohne Kopfzeile)
4. Strg+C kopieren
5. Spreadsheet öffnen
6. Erste freie Zeile anklicken
7. Strg+V einfügen
8. ✅ Fertig!
```

### Zeitaufwand:

- **Export:** 1 Minute
- **Öffnen & Kopieren:** 30 Sekunden
- **Einfügen:** 5 Sekunden
- **Gesamt:** ~2 Minuten für 50 Buchungen! 🎉

---

## 🆚 Copy & Paste vs. CSV-Import

### Copy & Paste ⭐ EMPFOHLEN

**Vorteile:**
- ✅ Schneller
- ✅ Einfacher
- ✅ Direkt

**Nachteile:**
- ⚠️ Keine automatische Kategorisierung
- ⚠️ Keine Spender-Erkennung
- ⚠️ Manuell

**Für:** Schnelle, direkte Eingabe

---

### CSV-Import

**Vorteile:**
- ✅ Automatische Kategorisierung
- ✅ Bekannte Spender-Erkennung
- ✅ Intelligente Zuordnung

**Nachteile:**
- ⚠️ Dialog nötig
- ⚠️ Ein Extra-Schritt

**Für:** Automatische Zuordnung gewünscht

---

## 💡 Best Practice

### Empfehlung: Kombinieren Sie beide!

**Workflow:**
1. **Copy & Paste** für schnelle Eingabe
2. Später: **Kategorie per Dropdown** ausfüllen (Spalte L)
3. **ODER:** Für viele Buchungen: CSV-Import nutzen

**Oder:**
1. CSV-Import für automatische Zuordnung
2. Copy & Paste für einzelne Nachträge

---

## ❓ Häufige Fragen

### Kann ich auch einzelne Zeilen einfügen?

**Ja!** Funktioniert genauso:
1. Eine Zeile im CSV markieren
2. Kopieren
3. In Spreadsheet einfügen

---

### Was passiert mit den zusätzlichen Spalten (M-P)?

**Sie bleiben leer** beim Copy & Paste. Sie können sie später manuell ausfüllen:
- **Quittung ausgestellt** (M): Dropdown: "Ja" oder "Nein"
- **Quittungsnummer** (N): Wird automatisch vergeben bei Quittung
- **Mitgliedsnummer** (O): Falls zutreffend
- **Bemerkung** (P): Ihre Notizen

---

### Kann ich auch alte Daten im CSV-Format nachträglich einfügen?

**Ja!** Funktioniert mit jedem CSV-Export im Sparkassen-Format.

**Vorsicht:** Prüfen Sie auf Dubletten!

---

### Was wenn das CSV-Format anders ist?

**Dann:** Verwenden Sie den CSV-Import-Dialog (📊 Buchhaltung → 🔄 Import → Kontoauszug importieren)

Der Dialog-Parser passt sich automatisch an verschiedene Formate an.

---

## 🎯 Beispiel-Workflow

### Monatsabschluss:

**Szenario:** März 2025 abschließen

1. **Sparkasse:**
   - Export → März 2025
   - Format: Excel (CSV - gefilterte Einträge)

2. **Excel:**
   - CSV öffnen
   - Daten markieren (ohne Kopfzeile)
   - Strg+C

3. **Spreadsheet:**
   - "Zahlungseingänge Konto" öffnen
   - Erste freie Zeile (z.B. Zeile 15)
   - Strg+V
   - ✅ 25 Buchungen eingefügt!

4. **Nachbearbeitung:**
   - Kategorien prüfen (Spalte L)
   - Korrigieren falls nötig
   - Quittungen ausstellen (für Spenden über 50€)

5. **Dashboard prüfen:**
   - Öffnen Sie "Dashboard"
   - Zahlen sollten automatisch aktualisiert sein
   - ✅ März: 1.250 €

**Zeitaufwand:** 5 Minuten statt 30 Minuten! 🎉

---

**Viel Erfolg mit Copy & Paste! 📋**

Hoffnungsradler Dülmen e.V.  
*Einfach und effizient.*

