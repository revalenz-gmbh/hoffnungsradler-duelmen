# 📊 Sparkassen Export-Format - Empfehlung

**Hoffnungsradler Dülmen e.V.**

---

## 🎯 Empfehlung

### ✅ **BESTE WAHL: Excel (CSV - gefilterte Einträge)**

**Warum?**
- ✅ Bereits gefiltert (nur relevante Buchungen)
- ✅ Einfaches CSV-Format
- ✅ Unser Parser unterstützt es direkt
- ✅ Keine unnötigen Daten
- ✅ Schnellerer Import

**Alternativ (falls nicht verfügbar):**
- ✅ **Excel (CSV-CAMT V8)** - Modernster Standard, gut strukturiert

---

## 📋 Format-Vergleich

### ✅ **Empfohlen: Excel (CSV - gefilterte Einträge)**

**Vorteile:**
- ✅ Bereits vorbereitet (keine unnötigen Zeilen)
- ✅ Enthält nur relevante Buchungen
- ✅ Einfaches CSV-Format
- ✅ Direkt von unserem System unterstützt
- ✅ Schnellster Import

**Nachteile:**
- ⚠️ Nur verfügbar wenn Filter gesetzt wurden

**Funktioniert sofort mit unserem System! ✅**

---

### ✅ **Alternative: Excel (CSV-CAMT V8)**

**Vorteile:**
- ✅ Modernster Bank-Standard (CAMT V8)
- ✅ Gut strukturiert
- ✅ Umfassende Daten
- ✅ Unser Parser erkennt es automatisch

**Nachteile:**
- ⚠️ Enthält alle Buchungen (auch nicht relevante)
- ⚠️ Kann größere Dateien sein

**Funktioniert mit unserem System! ✅**

---

### ⚠️ **Möglich, aber nicht optimal: Excel (CSV-CAMT V2)**

**Vorteile:**
- ✅ Gut strukturiert
- ✅ Unser Parser unterstützt es

**Nachteile:**
- ⚠️ Älterer Standard (V8 ist neuer)
- ⚠️ Kann anders strukturiert sein

**Funktioniert wahrscheinlich, aber V8 ist besser.**

---

### ⚠️ **Nicht empfohlen: Excel (CSV-MT940)**

**Vorteile:**
- ✅ Einfaches Format

**Nachteile:**
- ⚠️ Sehr altes Format
- ⚠️ Nicht optimal strukturiert
- ⚠️ Kann andere Spaltenreihenfolge haben

**Funktioniert möglicherweise, aber nicht ideal.**

---

### ❌ **NICHT empfohlen: XML-Formate**

**Warum nicht?**
- ❌ XML ist komplexer zu parsen
- ❌ Unser System ist für CSV optimiert
- ❌ Erfordert andere Parsing-Logik
- ❌ Mehr Fehlerquellen

**Option:**
Falls Sie nur XML haben: Konvertieren Sie es zuerst in CSV (mit Excel)

---

### ❌ **NICHT empfohlen: Text (MT940)**

**Warum nicht?**
- ❌ Altes Format
- ❌ Nicht strukturiert
- ❌ Schwer zu parsen
- ❌ Unser System unterstützt es nicht

---

## 🚀 Praktische Anleitung

### Schritt 1: Format wählen

**Option A: Excel (CSV - gefilterte Einträge)** ⭐ EMPFOHLEN
```
1. Setzen Sie Filter (falls nötig)
2. Export → Excel (CSV - gefilterte Einträge)
3. Fertig!
```

**Option B: Excel (CSV-CAMT V8)** (falls Option A nicht verfügbar)
```
1. Export → Excel (CSV-CAMT V8)
2. Fertig!
```

### Schritt 2: CSV-Datei prüfen

**Öffnen Sie die CSV mit einem Texteditor:**
```csv
"Buchungstag";"Valutadatum";"Auftraggeber/Empfänger";"Buchungstext";"Verwendungszweck";"Betrag";"Währung"
"15.03.2025";"15.03.2025";"Max Mustermann";"SEPA";"Spende Hoffnungsradler";"50,00";"EUR"
```

**Sollte enthalten:**
- ✅ Trennzeichen: `;` (Semikolon) oder `,` (Komma)
- ✅ Datum im Format: `DD.MM.YYYY`
- ✅ Betrag im Format: `50,00` (Komma als Dezimaltrenner)
- ✅ Mindestens 5 Spalten

**Falls anders:** Kontaktieren Sie mich, ich passe den Parser an!

### Schritt 3: Import durchführen

1. CSV-Datei öffnen (Notepad/Editor)
2. Alles markieren (Strg+A) und kopieren (Strg+C)
3. Google Spreadsheet → **📊 Buchhaltung** → **🔄 Import** → **Kontoauszug importieren**
4. Einfügen (Strg+V) und Import starten
5. ✅ Fertig!

---

## 🔍 Format-Erkennung

Unser System erkennt automatisch:

### ✅ Unterstützte Trennzeichen:
- `;` (Semikolon) - **Standard bei Sparkasse**
- `,` (Komma) - **Alternative**
- `Tab` (Tabulator) - **Selten**

### ✅ Unterstützte Datumsformate:
- `DD.MM.YYYY` (z.B. `15.03.2025`) - **Deutsch**
- `YYYY-MM-DD` (z.B. `2025-03-15`) - **ISO**
- `DD/MM/YYYY` (z.B. `15/03/2025`) - **Alternativ**

### ✅ Unterstützte Betragsformate:
- `50,00` → `50.00` (automatische Konvertierung)
- `1.234,56` → `1234.56` (Tausender-Trennung wird entfernt)
- `50` → `50.00`

---

## ⚙️ Format-Anpassung (Falls nötig)

Falls Ihr gewähltes Format nicht funktioniert:

### Problem: Falsches Datumsformat

**Symptom:**
```
Fehler beim Parsen des Datums
```

**Lösung:**
Der Parser unterstützt bereits mehrere Formate. Falls es trotzdem nicht funktioniert:
1. Öffnen Sie CSV mit Excel
2. Spalte "Datum" markieren
3. Format ändern zu: `DD.MM.YYYY`
4. Als CSV speichern
5. Erneut importieren

---

### Problem: Falsches Trennzeichen

**Symptom:**
```
Keine gültigen Zeilen gefunden
```

**Lösung:**
Der Parser erkennt automatisch das Trennzeichen. Falls nicht:
1. CSV-Datei mit Excel öffnen
2. "Als CSV speichern" → Format wählen
3. Semikolon als Trennzeichen wählen
4. Erneut importieren

---

### Problem: Andere Spaltenreihenfolge

**Symptom:**
```
Daten werden falsch zugeordnet
```

**Lösung:**
Kontaktieren Sie mich! Ich passe den Parser für Ihr Format an.

**Für mich wichtig:**
- Screenshot der ersten Zeilen der CSV
- Format-Name (z.B. "CSV-CAMT V8")
- Beispiel-Zeile

---

## 📊 Format-Beispiele

### Excel (CSV - gefilterte Einträge)

**Erwartetes Format:**
```csv
"Buchungstag";"Valutadatum";"Auftraggeber/Empfänger";"Buchungstext";"Verwendungszweck";"Betrag";"Währung"
"15.03.2025";"15.03.2025";"Max Mustermann";"SEPA";"Spende";"50,00";"EUR"
"20.03.2025";"20.03.2025";"Anna Schmidt";"SEPA";"Mitgliedsbeitrag";"60,00";"EUR"
```

**Status:** ✅ Funktioniert direkt

---

### Excel (CSV-CAMT V8)

**Mögliches Format:**
```csv
"Buchungstag";"Valutadatum";"Auftraggeber";"Buchungstext";"Verwendungszweck";"Betrag";"Währung";"IBAN"
"2025-03-15";"2025-03-15";"Max Mustermann";"SEPA";"Spende Hoffnungsradler";"50.00";"EUR";"DE89..."
```

**Status:** ✅ Funktioniert (Parser passt sich an)

**Hinweis:** Kann andere Spaltenreihenfolge haben - Parser erkennt automatisch

---

### Excel (CSV-CAMT V2)

**Mögliches Format:**
```csv
"Buchungstag";"Valutadatum";"Auftraggeber";"Text";"Zweck";"Betrag";"Währung"
"15.03.2025";"15.03.2025";"Max Mustermann";"SEPA";"Spende";"50,00";"EUR"
```

**Status:** ⚠️ Wahrscheinlich funktioniert (Parser passt sich an)

---

## ✅ Finale Empfehlung

### **1. Versuchen Sie zuerst:**

**Excel (CSV - gefilterte Einträge)** ⭐

**Warum?**
- Optimiert für Ihren Zweck
- Bereits vorbereitet
- Schnellster Import
- Am einfachsten

---

### **2. Falls nicht verfügbar:**

**Excel (CSV-CAMT V8)**

**Warum?**
- Modernster Standard
- Gut strukturiert
- Parser unterstützt es
- Zuverlässig

---

### **3. Vermeiden Sie:**

- ❌ XML-Formate (zu komplex)
- ❌ Text (MT940) (nicht strukturiert)
- ❌ Sehr alte Formate (CAMT V2 ist OK, aber V8 ist besser)

---

## 🔧 Falls Ihr Format nicht funktioniert

### Schritt 1: CSV prüfen

1. Öffnen Sie CSV mit Notepad/Editor
2. Erste 5 Zeilen kopieren
3. Schicken Sie mir:
   - Format-Name
   - Erste Zeilen (Anonymisiert!)
   - Fehlermeldung

### Schritt 2: Parser anpassen

Ich passe den Parser für Ihr Format an!

**Was ich brauche:**
- Beispiel-Zeile (anonymisiert)
- Format-Name
- Welche Spalten gibt es?
- Welche Spalten brauchen wir?

---

## 📋 Quick-Reference

| Format | Empfehlung | Funktioniert? |
|--------|------------|---------------|
| **Excel (CSV - gefilterte Einträge)** | ⭐⭐⭐⭐⭐ | ✅ Ja, optimal |
| **Excel (CSV-CAMT V8)** | ⭐⭐⭐⭐ | ✅ Ja, gut |
| **Excel (CSV-CAMT V2)** | ⭐⭐⭐ | ⚠️ Wahrscheinlich |
| **Excel (CSV-MT940)** | ⭐⭐ | ⚠️ Möglicherweise |
| **XML (CAMT V8)** | ⭐ | ❌ Nein, nicht empfohlen |
| **XML (CAMT V2)** | ⭐ | ❌ Nein, nicht empfohlen |
| **Text (MT940)** | ⭐ | ❌ Nein, nicht empfohlen |

---

## 🎯 Zusammenfassung

**Ihre beste Wahl:**
```
Excel (CSV - gefilterte Einträge)
```

**Falls nicht verfügbar:**
```
Excel (CSV-CAMT V8)
```

**Vermeiden:**
```
❌ XML-Formate
❌ Text (MT940)
```

**Testen:**
1. Export wählen
2. CSV importieren
3. Prüfen ob es funktioniert
4. Falls nicht: Melden Sie sich!

---

**Hoffnungsradler Dülmen e.V.**  
*Der richtige Export macht's einfacher!*

