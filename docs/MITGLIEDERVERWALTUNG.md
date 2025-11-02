# 👥 Mitgliederverwaltung - Automatische Zuordnung

**Hoffnungsradler Dülmen e.V.**

---

## 🎯 Übersicht

Die Mitgliederverwaltung ist vollständig in das Buchhaltungssystem integriert. Das System erkennt automatisch Zahlungseingänge von Mitgliedern und ordnet sie der richtigen Mitgliedsnummer zu!

---

## ✅ Features

- ✅ **Automatische Mitgliedsnummer-Zuordnung** bei Zahlungseingängen
- ✅ **Intelligente Erkennung** per IBAN, Name oder Verwendungszweck
- ✅ **Automatische Kategorisierung** als "Mitgliedsbeitrag"
- ✅ **Beitragsstatus-Tracking** pro Jahr
- ✅ **DSGVO-konforme Verwaltung**

---

## 📋 Tabellenblatt "Mitglieder"

### Spalten-Übersicht

| Spalte | Name | Beschreibung |
|--------|------|-------------|
| A | **Nr.** | Mitgliedsnummer (z.B. 1, 2, 3...) |
| B | **Vorname, Name** | Vollständiger Name |
| C | **Anschrift** | Vollständige Adresse |
| D | **Email** | E-Mail-Adresse |
| E | **Telefon** | Telefonnummer |
| F | **Eintrittsdatum** | Datum des Beitritts |
| G | **Beitragsstatus** | Aktiv / Passiv / Ausgetreten / Verstorben |
| H | **Notizen** | Ihre Notizen |
| I | **DSGVO-Einwilligung** | Ja / Nein / Teilweise |
| J | **Zahlungsart** | Überweisung / Lastschrift / Bar / Sonstiges |
| K | **IBAN (für Lastschrift)** | IBAN für automatische Erkennung |
| L | **Beitrag 2025** | Höhe des Beitrags (z.B. 60.00) |
| M | **Status 2025** | Bezahlt / Offen / Teilweise / Befreit |

---

## 🚀 Erste Einrichtung

### Schritt 1: Mitgliedertabelle anlegen

1. Öffnen Sie Ihr Google Spreadsheet
2. Menü: **📊 Buchhaltung** → **Tabellen anlegen** → **Mitglieder anlegen**
3. ✅ Neue Tabelle "Mitglieder" wurde erstellt

### Schritt 2: Mitglieder eintragen

**Für jedes Mitglied:**

1. Neue Zeile hinzufügen
2. Ausfüllen:
   - **Nr.**: Mitgliedsnummer (z.B. 1, 2, 3...)
   - **Vorname, Name**: z.B. "Max Mustermann"
   - **Anschrift**: Vollständige Adresse
   - **Email**: E-Mail-Adresse
   - **Telefon**: Telefonnummer
   - **Eintrittsdatum**: z.B. 01.01.2024
   - **Beitragsstatus**: Dropdown: "Aktiv"
   - **IBAN**: **WICHTIG für automatische Zuordnung!** z.B. "DE89 3704 0044 0532 0130 00"
   - **Beitrag 2025**: z.B. 60.00
   - **Status 2025**: Dropdown: "Offen" (wird später auf "Bezahlt" geändert)

**Tipp:** Die IBAN ist am wichtigsten für automatische Zuordnung!

---

## 🔄 Automatische Zuordnung

### Wie funktioniert es?

Das System erkennt Zahlungseingänge von Mitgliedern durch:

#### 1. **IBAN-Match** (99% sicher) ⭐

**Wenn:** IBAN im Zahlungseingang = IBAN in Mitgliedertabelle

**Dann:**
- ✅ Automatische Zuordnung
- ✅ Mitgliedsnummer wird eingetragen
- ✅ Kategorie wird auf "Mitgliedsbeitrag" gesetzt
- ✅ Bemerkung: "Mitglied Nr. X"

**Beispiel:**
```
Mitglied Nr. 5 hat IBAN: DE89 3704 0044 0532 0130 00
Zahlungseingang: IBAN = DE89 3704 0044 0532 0130 00
→ Automatisch zugeordnet! ✅
```

#### 2. **Name-Match** (95% sicher)

**Wenn:** Name im Zahlungseingang = Name in Mitgliedertabelle

**Dann:** Gleiche Zuordnung wie bei IBAN-Match

**Funktioniert auch bei:**
- "Max Mustermann" vs "Mustermann, Max"
- Teilweise Übereinstimmungen (Vor- und Nachname)

#### 3. **Verwendungszweck-Match** (85% sicher)

**Wenn:** Verwendungszweck enthält:
- Mitgliedsnummer
- "Mitgliedsbeitrag"
- "Beitrag"
- **UND** Name stimmt teilweise überein

**Dann:** Zuordnung wird durchgeführt

---

## 📊 Workflows

### Workflow 1: CSV-Import mit automatischer Zuordnung

**Szenario:** Sie importieren einen Kontoauszug mit Mitgliedsbeiträgen

1. **CSV-Datei herunterladen**
   - Sparkassen-Export: Excel (CSV - gefilterte Einträge)

2. **Import starten**
   - Menü: **📊 Buchhaltung** → **🔄 Import** → **Kontoauszug importieren**
   - CSV-Inhalt einfügen und Import starten

3. **System erkennt automatisch:**
   - ✅ Mitglieder werden anhand IBAN/Name erkannt
   - ✅ Mitgliedsnummer wird automatisch zugeordnet
   - ✅ Kategorie wird auf "Mitgliedsbeitrag" gesetzt

4. **Prüfen**
   - Öffnen Sie "Zahlungseingänge Konto"
   - Prüfen Sie Spalte **O (Mitgliedsnummer)**
   - Sollte automatisch ausgefüllt sein!

---

### Workflow 2: Copy & Paste mit nachträglicher Zuordnung

**Szenario:** Sie haben Daten per Copy & Paste eingefügt

1. **Daten einfügen**
   - CSV-Daten per Copy & Paste einfügen
   - Mitgliedsnummer (Spalte O) bleibt leer

2. **Automatische Zuordnung starten**
   - Menü: **📊 Buchhaltung** → **Aktionen** → **Mitglieder-Zuordnung aktualisieren**
   - System durchsucht alle Zahlungseingänge
   - Ordnet automatisch zu

3. **Ergebnis:**
   - ✅ Mitgliedsnummern eingetragen
   - ✅ Kategorien aktualisiert
   - ✅ Bemerkungen ergänzt

---

### Workflow 3: Manuelle Nachbearbeitung

**Falls automatische Zuordnung nicht funktioniert:**

1. Öffnen Sie "Zahlungseingänge Konto"
2. Finden Sie die Zeile mit dem Mitgliedsbeitrag
3. Spalte **O (Mitgliedsnummer)** manuell ausfüllen
4. Spalte **L (Kategorie)** auf "Mitgliedsbeitrag" setzen

---

## 💡 Praktische Tipps

### Tipp 1: IBANs vollständig erfassen

**✅ Wichtig:**
- Tragen Sie die vollständige IBAN ein
- Mit oder ohne Leerzeichen - funktioniert beides
- System normalisiert automatisch (entfernt Leerzeichen)

**Beispiel:**
```
DE89 3704 0044 0532 0130 00
→ Wird normalisiert zu: DE89370400440532013000
```

---

### Tipp 2: Namen konsistent erfassen

**✅ Best Practice:**
- Format: "Vorname Nachname" (z.B. "Max Mustermann")
- ODER: "Nachname, Vorname" (z.B. "Mustermann, Max")
- Wichtig: Konsistent bleiben!

**Das System erkennt:**
- "Max Mustermann" = "Mustermann, Max" ✅
- "Max Mustermann" = "Max Mustermann" ✅
- "Max M." = "Max Mustermann" ⚠️ (funktioniert teilweise)

---

### Tipp 3: Verwendungszweck bei Überweisungen

**Empfehlung:** Mitglieder sollten beim Überweisen angeben:
- Ihre Mitgliedsnummer: "Mitgliedsbeitrag 2025, Nr. 5"
- ODER: "Beitrag Hoffnungsradler, Max Mustermann"

**System erkennt:**
- "Mitgliedsbeitrag" → Prüft ob es Mitglied ist
- "Nr. 5" → Findet Mitglied Nr. 5
- Name im Verwendungszweck → Prüft zusätzlich

---

### Tipp 4: Regelmäßig Zuordnung aktualisieren

**Nach jedem Import:**
1. Menü: **📊 Buchhaltung** → **Aktionen** → **Mitglieder-Zuordnung aktualisieren**
2. System findet auch neue Mitglieder

**Oder automatisch:**
- Beim CSV-Import wird automatisch zugeordnet
- Bei Copy & Paste: Manuell ausführen

---

## 📊 Mitgliedsbeiträge verwalten

### Beitragsstatus pro Jahr

**Für jedes Jahr:**
- **Spalte L:** Beitrag 2025 (Betrag)
- **Spalte M:** Status 2025 (Bezahlt / Offen / Teilweise / Befreit)

**Für nächstes Jahr:**
- Neue Spalten hinzufügen (z.B. "Beitrag 2026", "Status 2026")
- Oder Tabelle kopieren und umbenennen

---

### Status automatisch aktualisieren

**Idee für später (optional):**
- Bei Zahlungseingang: Status automatisch auf "Bezahlt" setzen
- Bei teilweisem Zahlungseingang: Status auf "Teilweise"

**Aktuell:** Manuell in Spalte M ändern

---

## 🔍 Zuordnung prüfen

### Wer wurde zugeordnet?

**In "Zahlungseingänge Konto":**
1. Spalte **O (Mitgliedsnummer)** filterbar
2. Filter setzen: "Nicht leer"
3. Alle zugeordneten Beiträge sehen

### Wer wurde NICHT zugeordnet?

**Problem:** Zahlungseingang wurde nicht zugeordnet

**Mögliche Ursachen:**
1. ❌ IBAN fehlt in Mitgliedertabelle
2. ❌ Name stimmt nicht überein
3. ❌ Neue Mitglieder noch nicht eingetragen

**Lösung:**
1. Prüfen Sie die IBAN in "Mitglieder" vs "Zahlungseingänge Konto"
2. Prüfen Sie den Namen
3. Falls Mitglied fehlt: In "Mitglieder" eintragen
4. Zuordnung erneut starten

---

## 📋 Beispiel-Workflow: Jahresbeitrag 2025

### Januar: Mitglieder eintragen

1. Alle 17 Mitglieder in Tabelle "Mitglieder" eintragen
2. IBANs vollständig erfassen
3. Beitrag 2025: 60.00 €
4. Status 2025: "Offen"

### Februar-März: Beiträge eingehen

1. Mitglieder überweisen Beiträge
2. CSV-Export von Sparkasse
3. **Copy & Paste** in "Zahlungseingänge Konto"
4. ODER: **CSV-Import** (automatische Zuordnung)

### Nach Import: Prüfung

1. Menü: **📊 Buchhaltung** → **Aktionen** → **Mitglieder-Zuordnung aktualisieren**
2. System ordnet alle zu
3. In "Zahlungseingänge Konto" prüfen:
   - Spalte O: Mitgliedsnummer eingetragen?
   - Spalte L: Kategorie = "Mitgliedsbeitrag"?

### Status aktualisieren

1. In "Mitglieder" Tabelle öffnen
2. Für jedes Mitglied prüfen:
   - Gibt es Zahlungseingang?
   - Spalte M (Status 2025) auf "Bezahlt" ändern
3. Oder Filter: Status = "Offen" → Prüfen welche noch fehlen

---

## ❓ Häufige Fragen

### Frage: Funktioniert die Zuordnung auch rückwirkend?

**Ja!** Die Funktion "Mitglieder-Zuordnung aktualisieren" durchsucht **alle** Zahlungseingänge, auch alte.

---

### Frage: Was wenn ein Mitglied mehrere Zahlungen macht?

**Antwort:** Jede Zahlung wird einzeln zugeordnet. Eine Mitgliedsnummer kann mehrfach vorkommen.

**Beispiel:**
- Mitglied Nr. 5 zahlt 30€ im Februar
- Mitglied Nr. 5 zahlt 30€ im März (Rest)
- Beide Zahlungen werden als Nr. 5 zugeordnet

---

### Frage: Was wenn IBAN nicht erkannt wird?

**Ursachen:**
1. IBAN fehlt in Mitgliedertabelle
2. IBAN stimmt nicht überein (Tippfehler?)
3. IBAN ist anders formatiert

**Lösung:**
1. Prüfen Sie IBAN in beiden Tabellen
2. Stellen Sie sicher: Beide normalisiert (ohne Leerzeichen)
3. Falls nötig: Manuell zuordnen

---

### Frage: Kann ich Mitgliedsnummern auch manuell ändern?

**Ja!** Sie können Spalte O (Mitgliedsnummer) jederzeit manuell ändern.

**Achtung:** Falls Sie "Mitglieder-Zuordnung aktualisieren" erneut ausführen, werden bereits zugeordnete Einträge übersprungen. Falls Sie neu zuordnen möchten, löschen Sie die Mitgliedsnummer vorher.

---

### Frage: Was passiert mit alten Daten?

**Antwort:** Die Funktion durchsucht **alle** Zeilen, auch alte. Sie können jederzeit die Zuordnung für alle Daten nachholen.

---

## 🎯 Best Practices

### ✅ DO's:

1. **IBANs vollständig erfassen**
   - Möglichst bei allen Mitgliedern
   - Größte Zuordnungs-Sicherheit

2. **Namen konsistent**
   - Ein Format beibehalten
   - "Vorname Nachname" oder "Nachname, Vorname"

3. **Regelmäßig Zuordnung aktualisieren**
   - Nach jedem Import
   - Oder einmal pro Woche

4. **Status manuell pflegen**
   - Nach Zahlungseingang: Status auf "Bezahlt"
   - Übersicht wer noch zahlt

### ❌ DON'Ts:

1. **Nicht IBANs ändern**
   - Falls IBAN sich ändert: Alte und neue beide erfassen
   - Oder manuell zuordnen

2. **Nicht mehrere Mitgliedsnummern für eine Zahlung**
   - Eine Zahlung = Eine Mitgliedsnummer
   - Bei Teilzahlungen: Mehrere Einträge mit gleicher Nummer

---

## 📊 Statistiken

### Mitgliedsbeiträge im Dashboard

Das Dashboard zeigt:
- ✅ Anzahl Zahlungseingänge
- ✅ Summe (inkl. Mitgliedsbeiträge)
- ✅ Aber: Keine Trennung Mitgliedsbeitrag vs. Spende

**Für detaillierte Analyse:**
- Filter in "Zahlungseingänge Konto":
  - Kategorie = "Mitgliedsbeitrag"
  - Summe berechnen

---

## 🔧 Erweiterte Funktionen (Optional)

### Zukünftige Erweiterungen:

- 📧 Automatische E-Mails bei fehlenden Beiträgen
- 📊 Mitgliedsbeitrags-Report
- 💶 Automatischer Status-Update
- 📅 Erinnerungsfunktion

---

## 📞 Support

Bei Fragen zur Mitgliederverwaltung:
- Prüfen Sie diese Dokumentation
- Kontaktieren Sie den Support

---

**Hoffnungsradler Dülmen e.V.**  
*Mitgliederverwaltung leicht gemacht!*

