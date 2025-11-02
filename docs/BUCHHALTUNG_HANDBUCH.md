# 📚 Benutzerhandbuch Buchhaltung

**Hoffnungsradler Dülmen e.V.**  
Version 1.0 | März 2025

---

## Inhaltsverzeichnis

1. [Überblick](#überblick)
2. [Erste Schritte](#erste-schritte)
3. [Tägliche Aufgaben](#tägliche-aufgaben)
4. [Monatliche Aufgaben](#monatliche-aufgaben)
5. [Jährliche Aufgaben](#jährliche-aufgaben)
6. [Häufige Fragen](#häufige-fragen)
7. [Fehlerbehebung](#fehlerbehebung)

---

## Überblick

Das Buchhaltungssystem der Hoffnungsradler Dülmen besteht aus einem Google Spreadsheet mit automatisierten Funktionen. Es dokumentiert:

- ✅ Alle Spendeneinnahmen (Konto & Bargeld)
- ✅ Alle Vereinsausgaben
- ✅ Übergebene Spenden an Organisationen
- ✅ Ausgestellte Spendenquittungen
- ✅ Jahresabschlüsse

**Zugriff:** [Link zum Google Spreadsheet]

---

## Erste Schritte

### Zugang erhalten

1. Sie benötigen Zugriff auf das Google Spreadsheet
2. Kontaktieren Sie den Vorstand für die Freigabe
3. Nach Freigabe: Öffnen Sie das Spreadsheet in Google Sheets

### Navigation im Spreadsheet

Das Spreadsheet besteht aus mehreren Tabellenblättern:

| Tabellenblatt | Zweck | Farbe |
|--------------|-------|-------|
| **Dashboard** | Übersicht & Kennzahlen | Blau |
| **Zahlungseingänge Konto** | Bankeinnahmen | Grün |
| **Bargeldspenden** | Bar-Einnahmen | Gelb |
| **Ausgaben** | Alle Ausgaben | Rosa |
| **Übergebene Spenden** | Spendenübergaben | Lila |
| **Spendenquittungen** | Quittungsverwaltung | Türkis |
| **Jahresabschluss 202X** | Jahresberichte | Blau |

### Menü "📊 Buchhaltung"

Nach dem Öffnen des Spreadsheets finden Sie oben ein Menü **"📊 Buchhaltung"** mit folgenden Funktionen:

- **Tabellen anlegen**: Erstellt fehlende Tabellenblätter
- **Aktionen**:
  - Dashboard aktualisieren
  - Jahresabschluss erstellen
  - Quittung ausstellen
- **Alle Tabellen neu anlegen**: Setzt das komplette System auf

---

## Tägliche Aufgaben

### Spende über Bankkonto erhalten

**Schritt 1: Kontoauszug prüfen**
- Öffnen Sie Ihr Online-Banking
- Prüfen Sie neue Zahlungseingänge

**Schritt 2: In Spreadsheet eintragen**
1. Öffnen Sie das Tabellenblatt **"Zahlungseingänge Konto"**
2. Neue Zeile am Ende hinzufügen
3. Ausfüllen:
   - **Datum**: Datum der Überweisung (z.B. 15.03.2025)
   - **Betrag**: Betrag in Euro (z.B. 50.00)
   - **Absender/Spender**: Vollständiger Name des Spenders
   - **IBAN**: IBAN des Spenders (falls auf Kontoauszug ersichtlich)
   - **Verwendungszweck**: Text aus Überweisung
   - **Kategorie**: Auswahl aus Dropdown:
     - **Spende** (Standard für Spenden)
     - Mitgliedsbeitrag
     - Förderung
     - Sonstiges
   - **Mitgliedsnummer**: Falls zutreffend
   - **Quittung ausgestellt**: "Nein" (zunächst)
   - **Quittungsnummer**: Leer lassen
   - **Bemerkung**: Optional

**Beispiel:**
```
Datum: 15.03.2025
Betrag: 50.00
Absender: Max Mustermann
IBAN: DE89370400440532013000
Verwendungszweck: Spende Hoffnungsradler
Kategorie: Spende
Quittung: Nein
```

---

### Bargeld-Spende bei Tour erhalten

**Schritt 1: Bargeld zählen**
- Zählen Sie die Bargeldspenden nach der Tour
- Notieren Sie den Gesamtbetrag

**Schritt 2: In Spreadsheet eintragen**
1. Öffnen Sie **"Bargeldspenden"**
2. Neue Zeile hinzufügen
3. Ausfüllen:
   - **Datum**: Datum der Tour (z.B. 20.03.2025)
   - **Betrag**: Gesamtbetrag (z.B. 156.50)
   - **Spender/Organisation**: Falls bekannt, sonst leer lassen
   - **Anlass/Ort**: Tour-Name (z.B. "Matjes-Tour 2025")
   - **Quittung**: "Nein" (zunächst)
   - **Quittungsnummer**: Leer lassen
   - **Bemerkung**: Optional (z.B. "18 Teilnehmer")

**Beispiel:**
```
Datum: 20.03.2025
Betrag: 156.50
Spender: -
Anlass: Matjes-Tour 2025
Quittung: Nein
Bemerkung: 18 Teilnehmer
```

**Wichtig:** Bewahren Sie das Bargeld sicher auf und überweisen Sie es zeitnah auf das Vereinskonto!

---

### Ausgabe dokumentieren

**Schritt 1: Beleg aufbewahren**
- Bewahren Sie den Beleg (Rechnung, Quittung) auf
- Vergeben Sie eine Belegnummer (z.B. R-2025-001)

**Schritt 2: In Spreadsheet eintragen**
1. Öffnen Sie **"Ausgaben"**
2. Neue Zeile hinzufügen
3. Ausfüllen:
   - **Datum**: Datum der Zahlung
   - **Betrag**: Betrag in Euro
   - **Empfänger**: Name des Empfängers
   - **Zweck**: Beschreibung (z.B. "Flyer-Druck für Mai-Touren")
   - **Kategorie**: Auswahl aus Dropdown:
     - Verwaltung
     - Material
     - Veranstaltung
     - Werbung
     - Sonstiges
   - **Belegnummer**: Ihre vergebene Nummer (z.B. R-2025-001)
   - **Bemerkung**: Optional

**Beispiel:**
```
Datum: 10.03.2025
Betrag: 150.00
Empfänger: Druckerei Schmidt
Zweck: Flyer-Druck für Mai-Touren
Kategorie: Werbung
Belegnummer: R-2025-001
```

---

## Monatliche Aufgaben

### Dashboard-Check (jeden Monat)

**Durchführung: Letzter Tag des Monats**

1. Öffnen Sie das **Dashboard**
2. Prüfen Sie die Zahlen:
   - Stimmen die Einnahmen?
   - Stimmen die Ausgaben?
   - Ist der Saldo plausibel?
3. Falls nötig: **📊 Buchhaltung** → **Aktionen** → **Dashboard aktualisieren**

**Checkliste:**
- [ ] Einnahmen Konto korrekt?
- [ ] Bargeldspenden korrekt?
- [ ] Ausgaben vollständig?
- [ ] Saldo plausibel?
- [ ] Offene Quittungen bearbeiten

---

### Spendenquittungen ausstellen

**Durchführung: Monatlich oder bei Bedarf**

**Wichtig:** Spenden ab 300 € benötigen eine Zuwendungsbestätigung!

**Methode 1: Über Menü (empfohlen)**

1. **📊 Buchhaltung** → **Aktionen** → **Quittung ausstellen**
2. Im Dialog eingeben: `Zahlungseingänge Konto,5`
   - Format: `Tabellenname,Zeilennummer`
3. System generiert automatisch eine Quittungsnummer (z.B. 2025-0001)
4. Beide Tabellen werden automatisch aktualisiert

**Methode 2: Manuell**

1. Öffnen Sie die Quelltabelle (z.B. **Zahlungseingänge Konto**)
2. Finden Sie die Zeile des Spenders
3. Setzen Sie **"Quittung ausgestellt"** auf **"Ja"**
4. Tragen Sie eine Quittungsnummer ein (Format: JAHR-XXXX, z.B. 2025-0012)
5. Öffnen Sie **Spendenquittungen**
6. Fügen Sie manuell einen Eintrag hinzu:
   - Quittungsnummer: 2025-0012
   - Datum Ausstellung: Heute
   - Jahr der Spende: 2025
   - Spender Name: [Name]
   - Betrag: [Betrag]
   - Quelltabelle: Zahlungseingänge Konto
   - Zeile: [Zeilennummer]
   - Status: Ausgestellt

**Wichtig:**
- Bewahren Sie eine Kopie der Quittung auf
- Versenden Sie die Quittung per Post an den Spender
- Bei Spenden unter 300 €: Vereinfachter Nachweis genügt

---

## Jährliche Aufgaben

### Januar: Neues Jahr vorbereiten

**Schritt 1: Dashboard aktualisieren**
1. Öffnen Sie **Dashboard**
2. Ändern Sie Zelle **B3** auf das neue Jahr (z.B. 2026)
3. Dashboard zeigt jetzt Daten für das neue Jahr

**Schritt 2: Neue Jahres-Spalte in Übersicht (optional)**
1. Bei Bedarf: Neues Spreadsheet für neues Jahr anlegen
2. Altes Spreadsheet umbenennen (z.B. "Buchhaltung 2025 - Archiv")

---

### Dezember: Jahresabschluss erstellen

**Durchführung: Ende Dezember / Anfang Januar**

**Schritt 1: Alle Daten vervollständigen**
- [ ] Alle Spenden eingetragen?
- [ ] Alle Ausgaben dokumentiert?
- [ ] Alle Belege vorhanden?
- [ ] Alle Quittungen ausgestellt?

**Schritt 2: Jahresabschluss generieren**
1. **📊 Buchhaltung** → **Aktionen** → **Jahresabschluss erstellen**
2. Jahr eingeben (z.B. 2025)
3. System zeigt Zusammenfassung:
   - Einnahmen (Konto + Bargeld)
   - Ausgaben (Allgemein + Übergebene Spenden)
   - Saldo
   - Anzahl Quittungen
4. Bestätigen

**Schritt 3: Jahresabschluss-Blatt prüfen**
1. Ein neues Blatt wurde erstellt: **"Jahresabschluss 2025"**
2. Prüfen Sie alle Zahlen
3. Exportieren als PDF: **Datei** → **Herunterladen** → **PDF-Dokument**

**Schritt 4: Archivierung**
- Speichern Sie den PDF-Jahresabschluss sicher ab
- Bewahren Sie alle Belege auf (10 Jahre!)
- Senden Sie den Jahresabschluss an Vorstand/Steuerberater

---

### Spenden an Organisationen übergeben

**Durchführung: Nach Saisonende oder bei Bedarf**

**Schritt 1: Betrag festlegen**
- Prüfen Sie den Saldo im Dashboard
- Besprechen Sie mit dem Vorstand, welcher Betrag übergeben wird

**Schritt 2: Organisation kontaktieren**
- Vereinbaren Sie einen Übergabe-Termin
- Klären Sie die Details (Pressetermin? Fotos?)

**Schritt 3: Überweisung durchführen**
- Überweisen Sie den Betrag an die Organisation

**Schritt 4: In Spreadsheet dokumentieren**
1. Öffnen Sie **"Übergebene Spenden"**
2. Neue Zeile hinzufügen:
   - **Jahr**: Jahr der Spende (z.B. 2025)
   - **Betrag**: Übergebener Betrag
   - **Empfängerorganisation**: Voller Name (z.B. "Elterninitiative krebskranker Kinder Datteln e.V.")
   - **Datum der Übergabe**: Datum des Events
   - **Anlass/Veranstaltung**: Beschreibung (z.B. "Jahresabschluss 2025")
   - **Übergeben von**: Namen der Personen
   - **Kontakt Organisation**: Ansprechpartner
   - **Bemerkung**: Optional (z.B. "Pressetermin mit Foto")

**Beispiel:**
```
Jahr: 2025
Betrag: 5000.00
Empfängerorganisation: Elterninitiative krebskranker Kinder Datteln e.V.
Datum: 15.12.2025
Anlass: Jahresabschluss 2025
Übergeben von: Martin Stolz, Gregor Horstmann
Kontakt: Maria Schmidt (Vorstand)
Bemerkung: Pressetermin mit Foto, Artikel in Dülmen+
```

**Schritt 5: Bestätigung einholen**
- Bitten Sie die Organisation um eine schriftliche Spendenbestätigung
- Bewahren Sie diese auf

---

## Häufige Fragen

### Wie stelle ich eine Spendenquittung aus?

**Antwort:** Nutzen Sie das Menü **📊 Buchhaltung → Aktionen → Quittung ausstellen**. Geben Sie Tabellenname und Zeile an (z.B. `Zahlungseingänge Konto,5`). Das System generiert automatisch die Quittungsnummer.

---

### Muss ich für jede Spende eine Quittung ausstellen?

**Antwort:** Nein. Quittungen sind nur auf Wunsch des Spenders erforderlich. Bei Spenden unter 300 € genügt ein vereinfachter Nachweis (z.B. Kontoauszug). Ab 300 € ist eine ordnungsgemäße Zuwendungsbestätigung erforderlich.

---

### Was ist der Unterschied zwischen "Ausgaben" und "Übergebene Spenden"?

**Antwort:**
- **Ausgaben**: Vereinsinterne Kosten (z.B. Flyer, Material, Verwaltung)
- **Übergebene Spenden**: Weitergeleitete Spenden an gemeinnützige Organisationen (Hauptzweck des Vereins)

---

### Wie ändere ich das Jahr im Dashboard?

**Antwort:** Öffnen Sie das Dashboard und ändern Sie die Zelle **B3** auf das gewünschte Jahr. Alle Berechnungen aktualisieren sich automatisch.

---

### Was mache ich bei einem Fehler in einer Zeile?

**Antwort:** Korrigieren Sie die Daten direkt in der Zelle. Bei größeren Fehlern können Sie die Zeile löschen und neu eintragen. Wichtig: Löschen Sie niemals die Kopfzeile!

---

### Kann ich gelöschte Daten wiederherstellen?

**Antwort:** Ja! Google Sheets speichert automatisch alle Änderungen.
1. **Datei** → **Versionsverlauf** → **Versionsverlauf ansehen**
2. Wählen Sie eine frühere Version
3. Klicken Sie auf **Diese Version wiederherstellen**

---

### Wie exportiere ich Daten für den Steuerberater?

**Antwort:**
1. Öffnen Sie das gewünschte Tabellenblatt
2. **Datei** → **Herunterladen** → **Microsoft Excel (.xlsx)** oder **PDF**
3. Senden Sie die Datei an den Steuerberater

---

## Fehlerbehebung

### Problem: Formeln zeigen #REF! oder #N/A

**Lösung:**
1. Prüfen Sie, ob alle Tabellenblätter existieren
2. **📊 Buchhaltung** → **Dashboard aktualisieren**
3. Falls weiterhin Fehler: **Alle Tabellen neu anlegen** (Vorsicht: Backup erstellen!)

---

### Problem: Dashboard zeigt falsche Zahlen

**Lösung:**
1. Prüfen Sie das Jahr in Zelle B3
2. **📊 Buchhaltung** → **Aktionen** → **Dashboard aktualisieren**
3. Prüfen Sie, ob alle Daten korrekt eingetragen sind (Datum, Betrag)

---

### Problem: Quittungsnummer wird nicht generiert

**Lösung:**
1. Prüfen Sie, ob das Tabellenblatt **"Spendenquittungen"** existiert
2. Falls nicht: **📊 Buchhaltung** → **Tabellen anlegen** → **Spendenquittungen anlegen**
3. Versuchen Sie erneut

---

### Problem: Menü "📊 Buchhaltung" wird nicht angezeigt

**Lösung:**
1. Laden Sie die Seite neu (F5)
2. Warten Sie 5-10 Sekunden (Scripts werden geladen)
3. Falls weiterhin nicht sichtbar: Prüfen Sie, ob Sie Bearbeitungsrechte haben

---

## Support

Bei Fragen oder Problemen:

- **E-Mail:** [Vereins-E-Mail]
- **Telefon:** [Telefonnummer]
- **Technischer Support:** [GitHub Repository / Issues]

---

## Versionshistorie

- **Version 1.0** (März 2025): Erste Version des Handbuchs

---

**Hoffnungsradler Dülmen e.V.**  
*Gemeinsam bewegen wir mehr.*

