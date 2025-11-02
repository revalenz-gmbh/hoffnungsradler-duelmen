# 🔄 CSV-Import - Kontoauszüge automatisch importieren

**Hoffnungsradler Dülmen e.V.**

---

## Übersicht

Mit dem CSV-Import können Sie Kontoauszüge von der Sparkasse (oder anderen Banken) in wenigen Sekunden importieren. Das System:

✅ Erkennt automatisch das Format  
✅ Kategorisiert Buchungen basierend auf Regeln  
✅ Erkennt bekannte Spender  
✅ Schlägt Quittungen vor  
✅ Spart 90% Zeit!

---

## 🚀 Quick Start

### Schritt 1: Kontoauszug herunterladen

1. Loggen Sie sich in Ihr Sparkassen-Online-Banking ein
2. Wählen Sie das Vereinskonto
3. Gehen Sie zu **Umsätze** oder **Kontoauszüge**
4. Wählen Sie den Zeitraum (z.B. letzter Monat)
5. Klicken Sie auf **Export** → **CSV-Datei**
6. Speichern Sie die Datei

### Schritt 2: CSV-Datei öffnen

1. Öffnen Sie die heruntergeladene CSV-Datei mit **Notepad** oder **Editor**
2. Markieren Sie alles: **Strg+A**
3. Kopieren Sie alles: **Strg+C**

### Schritt 3: Import starten

1. Öffnen Sie Ihr Google Spreadsheet
2. Menü: **📊 Buchhaltung** → **🔄 Import** → **Kontoauszug importieren**
3. Ein Dialog öffnet sich
4. Fügen Sie den CSV-Inhalt ein: **Strg+V**
5. Klicken Sie auf **🚀 Import starten**
6. Warten Sie 3-5 Sekunden
7. ✅ Fertig!

### Schritt 4: Ergebnis prüfen

1. Öffnen Sie **Zahlungseingänge Konto**
2. Prüfen Sie die neuen Einträge (ganz unten)
3. Korrigieren Sie falls nötig
4. Dashboard wird automatisch aktualisiert

---

## 📋 Import-Regeln

### Was sind Import-Regeln?

Import-Regeln sind Muster, die das System verwendet, um Buchungen automatisch zu kategorisieren.

**Beispiel:**
- Verwendungszweck enthält "spende" → Kategorie: Spende
- Verwendungszweck enthält "mitgliedsbeitrag" → Kategorie: Mitgliedsbeitrag

### Regeln bearbeiten

1. Menü: **📊 Buchhaltung** → **🔄 Import** → **Import-Regeln bearbeiten**
2. Ein neues Tabellenblatt öffnet sich: **Import-Regeln**
3. Hier sehen Sie alle aktiven Regeln

### Standard-Regeln

Das System kommt mit folgenden Standard-Regeln:

| Aktiv | Muster | Kategorie | Priorität | Quittung? |
|-------|--------|-----------|-----------|-----------|
| ✓ | spende | Spende | 100 | Ja |
| ✓ | hoffnungsradler | Spende | 100 | Ja |
| ✓ | mitgliedsbeitrag | Mitgliedsbeitrag | 90 | Nein |
| ✓ | tour | Spende | 70 | Ja |
| ✓ | matjes | Spende | 70 | Ja |
| ✓ | alpin | Spende | 70 | Ja |
| ✓ | förderung | Förderung | 60 | Nein |

### Eigene Regel hinzufügen

1. Gehen Sie zur letzten Zeile in **Import-Regeln**
2. Neue Zeile:
   - **Aktiv:** ✓
   - **Muster:** z.B. "sponsor"
   - **Kategorie:** z.B. "Förderung"
   - **Priorität:** 70
   - **Quittung:** Nein
   - **Bemerkung:** "Sponsoring-Beitrag"
3. Speichern (automatisch)

### Regel deaktivieren

- Entfernen Sie das ✓ in der Spalte "Aktiv"
- Die Regel wird beim nächsten Import ignoriert

### Priorität verstehen

- **Höhere Zahl = höhere Priorität**
- Das System prüft Regeln von oben nach unten
- Die erste passende Regel gewinnt
- Empfehlung:
  - Sehr spezifische Regeln: 100
  - Normale Regeln: 50-80
  - Allgemeine Regeln: 30-50

---

## 🧠 Intelligente Spender-Erkennung

### Bekannte Spender

Das System **merkt sich** alle Spender, die Sie bereits eingetragen haben!

**Wie es funktioniert:**
1. Sie importieren einen Kontoauszug
2. System prüft: Kenne ich diese IBAN?
3. Falls Ja: Übernimmt automatisch die Kategorie vom letzten Mal
4. Falls Nein: Wendet Import-Regeln an

### Beispiel

**Erste Spende von Max Mustermann:**
- Verwendungszweck: "Spende"
- System kategorisiert → Spende ✓

**Zweite Spende von Max Mustermann:**
- Verwendungszweck: "Überweisung" (unklar!)
- System erkennt IBAN → Bekannter Spender
- Kategorisiert automatisch als "Spende" ✓

### Bekannte Spender anzeigen

1. Menü: **📊 Buchhaltung** → **🔄 Import** → **Bekannte Spender anzeigen**
2. Ein Dialog zeigt alle bekannten Spender mit:
   - Name
   - Anzahl Spenden
   - Zuletzt verwendete Kategorie

---

## 📊 Unterstützte Formate

### Sparkasse (Standard)

**Format:**
```csv
"Buchungstag";"Valutadatum";"Auftraggeber/Empfänger";"Buchungstext";"Verwendungszweck";"Betrag";"Währung"
"15.03.2025";"15.03.2025";"Max Mustermann";"SEPA-Überweisung";"Spende Hoffnungsradler";"50,00";"EUR"
```

✅ Wird automatisch erkannt

### Andere Banken

Das System versucht automatisch:
- Trennzeichen zu erkennen (`;` oder `,` oder Tab)
- Datumsformat zu erkennen (DD.MM.YYYY oder YYYY-MM-DD)
- Betragsformat zu konvertieren (50,00 → 50.00)

**Falls Probleme:**
1. Öffnen Sie die CSV mit Excel
2. Exportieren Sie im Sparkassen-Format
3. Oder kontaktieren Sie den Support

---

## ⚙️ Erweiterte Funktionen

### Nur Eingänge werden importiert

Das System filtert automatisch:
- ✅ Positive Beträge (Eingänge) → werden importiert
- ❌ Negative Beträge (Ausgaben) → werden ignoriert

**Warum?**
- Der Import ist für **Spenden-Eingänge** optimiert
- Ausgaben erfassen Sie separat in **Ausgaben**

### IBAN-Erkennung

Das System erkennt IBANs automatisch:
- Format: DE89 3704 0044 0532 0130 00
- Auch mit/ohne Leerzeichen
- Wird für Spender-Wiedererkennung verwendet

### Datums-Parsing

Unterstützte Formate:
- `15.03.2025` (Deutsch)
- `2025-03-15` (ISO)
- `15/03/2025` (Alternativ)

### Betrags-Konvertierung

Automatische Konvertierung:
- `50,00` → `50.00`
- `1.234,56` → `1234.56`
- `50` → `50.00`

---

## 🔍 Fehlerbehandlung

### Problem: "Keine gültigen Zeilen gefunden"

**Ursache:** CSV-Format wird nicht erkannt

**Lösung:**
1. Prüfen Sie, ob die Datei Daten enthält
2. Prüfen Sie, ob es eine Kopfzeile gibt
3. Öffnen Sie die CSV mit Excel und prüfen Sie das Format
4. Kontaktieren Sie den Support

### Problem: Buchungen werden falsch kategorisiert

**Lösung:**
1. Öffnen Sie **Import-Regeln**
2. Fügen Sie eine spezifischere Regel hinzu
3. Setzen Sie die Priorität höher
4. Importieren Sie erneut (löschen Sie vorher die falschen Einträge)

### Problem: Bekannter Spender wird nicht erkannt

**Ursache:** IBAN oder Name stimmen nicht überein

**Lösung:**
1. Prüfen Sie **Zahlungseingänge Konto**
2. Suchen Sie nach dem Spender
3. Vergleichen Sie IBAN und Name mit dem neuen Import
4. Falls nötig: Manuell korrigieren

### Problem: Dubletten

**Ursache:** Sie haben die gleichen Daten zweimal importiert

**Lösung:**
1. Sortieren Sie **Zahlungseingänge Konto** nach Datum
2. Löschen Sie die doppelten Zeilen manuell
3. Tipp: Importieren Sie immer nur neue Daten

---

## 💡 Best Practices

### 1. Regelmäßig importieren

**Empfehlung:** Einmal pro Woche oder Monat

**Vorteil:**
- Aktuelle Daten
- Keine großen Import-Massen
- Übersichtlicher

### 2. Immer prüfen

**Nach jedem Import:**
- [ ] Öffnen Sie **Zahlungseingänge Konto**
- [ ] Scrollen Sie nach unten (neue Einträge)
- [ ] Prüfen Sie Kategorien
- [ ] Korrigieren Sie falls nötig
- [ ] Öffnen Sie **Dashboard** → Zahlen plausibel?

### 3. Regeln pflegen

**Monatlich:**
- Schauen Sie sich an, welche Buchungen manuell kategorisiert wurden
- Erstellen Sie Regeln für häufige Muster
- System wird mit der Zeit immer besser!

### 4. Kontoauszüge archivieren

**Nach Import:**
- Speichern Sie die CSV-Datei
- Ordner: z.B. "Kontoauszüge 2025"
- Falls Sie später etwas nachprüfen müssen

---

## 📊 Beispiel-Workflow

### Monatsabschluss

**Szenario:** Es ist der 1. April, Sie möchten März importieren

1. **Kontoauszug herunterladen**
   - Online-Banking → März 2025
   - Export → CSV

2. **Import durchführen**
   - Spreadsheet öffnen
   - Import-Dialog → CSV einfügen
   - Import starten

3. **Ergebnis: 25 Buchungen importiert**
   - Davon 20x automatisch als "Spende" kategorisiert
   - 3x als "Mitgliedsbeitrag"
   - 2x als "Förderung"

4. **Prüfung**
   - Alle Kategorien korrekt ✓
   - 5 Spenden über 50€ → Quittungen ausstellen

5. **Dashboard-Check**
   - Einnahmen März: 1.250 €
   - Gesamt 2025: 3.450 €
   - Saldo: 3.200 €

**Zeitaufwand:** 5 Minuten statt 30 Minuten! 🎉

---

## 🆘 Häufige Fragen

### Kann ich mehrere Monate auf einmal importieren?

**Ja!** Laden Sie einfach einen größeren Zeitraum herunter (z.B. Januar-März) und importieren Sie alles auf einmal.

### Was passiert, wenn ich die gleichen Daten zweimal importiere?

Das System erkennt **keine Dubletten** automatisch. Sie müssen doppelte Einträge manuell löschen.

**Tipp:** Notieren Sie sich, welchen Zeitraum Sie bereits importiert haben.

### Kann ich den Import rückgängig machen?

**Ja, mit Google Sheets Versionsverlauf:**
1. **Datei** → **Versionsverlauf** → **Versionsverlauf ansehen**
2. Wählen Sie die Version vor dem Import
3. Klicken Sie auf **Diese Version wiederherstellen**

### Werden auch Ausgaben importiert?

**Nein.** Das System importiert nur **positive Beträge** (Eingänge). Ausgaben erfassen Sie separat im Blatt **Ausgaben**.

### Funktioniert der Import mit meiner Bank?

Das System ist für Sparkassen optimiert, aber:
- ✅ Die meisten deutschen Banken nutzen ähnliche CSV-Formate
- ✅ System erkennt automatisch Trennzeichen und Format
- ❌ Falls es nicht funktioniert: CSV-Datei mit Excel öffnen und im Sparkassen-Format exportieren

### Kann ich Regeln für bestimmte Namen erstellen?

**Ja!** Erstellen Sie eine Regel mit dem Namen als Muster:
- Muster: "Max Mustermann"
- Kategorie: Spende
- Priorität: 100

### Was bedeutet "Quittung vorschlagen"?

Das System schlägt vor, ob eine Quittung ausgestellt werden sollte:
- **Ja:** Bei Spenden über 50€
- **Nein:** Bei Mitgliedsbeiträgen, Förderungen

Die Quittung wird **nicht automatisch** ausgestellt, sondern nur vorgeschlagen!

---

## 🔧 Technische Details

### CSV-Parser

Das System:
- Erkennt automatisch Trennzeichen (`;`, `,`, Tab)
- Berücksichtigt Anführungszeichen
- Überspringt Kopfzeile
- Filtert leere Zeilen

### Kategorisierungs-Logik

**Ablauf:**
1. Prüfe bekannte Spender (IBAN-Match) → 95% Vertrauen
2. Prüfe bekannte Spender (Name-Match) → 80% Vertrauen
3. Wende Import-Regeln an → Variabel
4. Fallback: Kategorie "Spende" → 30% Vertrauen

### Performance

- Import von 100 Buchungen: ~5 Sekunden
- Regel-Matching: ~0.05 Sekunden pro Buchung
- Spender-Erkennung: ~0.1 Sekunden pro Buchung

**Gesamt:** Sehr schnell! ⚡

---

## 📞 Support

Bei Fragen zum CSV-Import:

1. **Lesen Sie diese Anleitung** nochmal
2. **Prüfen Sie die Import-Regeln**
3. **Schauen Sie sich bekannte Spender an**
4. **Kontaktieren Sie den Support:**
   - E-Mail: [Vereins-E-Mail]
   - GitHub Issues: [Repository]

---

## 🎉 Beispiele

### Beispiel 1: Normale Spende

**CSV-Zeile:**
```
"15.03.2025";"15.03.2025";"Max Mustermann";"SEPA";"Spende Hoffnungsradler";"50,00";"EUR"
```

**Ergebnis:**
- Datum: 15.03.2025
- Betrag: 50.00 €
- Absender: Max Mustermann
- Kategorie: Spende (Regel: "spende")
- Quittung: Nein (vorgeschlagen)

### Beispiel 2: Bekannter Spender

**CSV-Zeile:**
```
"20.03.2025";"20.03.2025";"Max Mustermann";"SEPA";"Überweisung";"25,00";"EUR"
```

**Ergebnis:**
- Datum: 20.03.2025
- Betrag: 25.00 €
- Absender: Max Mustermann
- Kategorie: Spende (Bekannter Spender!)
- Bemerkung: "Bekannter Spender"

### Beispiel 3: Mitgliedsbeitrag

**CSV-Zeile:**
```
"01.03.2025";"01.03.2025";"Anna Schmidt";"SEPA";"Mitgliedsbeitrag 2025";"60,00";"EUR"
```

**Ergebnis:**
- Datum: 01.03.2025
- Betrag: 60.00 €
- Absender: Anna Schmidt
- Kategorie: Mitgliedsbeitrag (Regel: "mitgliedsbeitrag")
- Quittung: Nein

---

**Viel Erfolg mit dem CSV-Import! 🚀**

Hoffnungsradler Dülmen e.V.  
*Gemeinsam bewegen wir mehr.*

