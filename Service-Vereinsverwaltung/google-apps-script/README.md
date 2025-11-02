# 📊 Buchhaltungssystem - Hoffnungsradler Dülmen e.V.

## Übersicht

Dieses Google Apps Script bietet ein vollständiges Buchhaltungssystem für die Vereinsverwaltung mit:

- ✅ Automatisches Dashboard mit Echtzeit-Übersicht
- ✅ Spendenquittungs-System mit fortlaufender Nummerierung
- ✅ Jahresabschluss-Funktion (Einnahmen-Überschuss-Rechnung)
- ✅ API-Endpunkte für die Website
- ✅ Strukturierte Tabellen für alle Buchungen

---

## 🚀 Installation & Einrichtung

### Schritt 1: Google Spreadsheet erstellen

1. Erstellen Sie ein neues Google Spreadsheet
2. Benennen Sie es z.B. "Buchhaltung 2025 - Hoffnungsradler Dülmen"

### Schritt 2: Apps Script hinzufügen

1. In Ihrem Spreadsheet: **Erweiterungen** → **Apps Script**
2. Löschen Sie den Standard-Code
3. Kopieren Sie den Inhalt von `Code.gs` in den Editor
4. Speichern Sie das Projekt (z.B. "Buchhaltung API")

### Schritt 3: Tabellen anlegen

1. Schließen Sie den Apps Script Editor
2. Laden Sie das Spreadsheet neu (F5)
3. Sie sehen jetzt ein neues Menü: **📊 Buchhaltung**
4. Klicken Sie auf **Alle Tabellen neu anlegen**

✅ Fertig! Ihr Buchhaltungssystem ist einsatzbereit.

---

## 📋 Tabellen-Übersicht

### 1. Dashboard
**Zweck:** Echtzeit-Übersicht über alle Finanzen

- Zeigt aktuelle Einnahmen, Ausgaben und Saldo
- Übersicht über ausgestellte Quittungen
- Wird automatisch aktualisiert

**Wichtig:** Jahr kann in Zelle B3 geändert werden

### 2. Zahlungseingänge Konto
**Zweck:** Alle Banküberweisungen dokumentieren

**Spalten:**
- Datum
- Betrag (€)
- Absender/Spender
- IBAN/Kontonummer
- Verwendungszweck
- Kategorie (Spende/Mitgliedsbeitrag/Förderung)
- Mitgliedsnummer
- Quittung ausgestellt (Ja/Nein)
- Quittungsnummer (automatisch)
- Bemerkung

### 3. Bargeldspenden
**Zweck:** Bargeld-Spenden bei Veranstaltungen dokumentieren

**Spalten:**
- Datum
- Betrag (€)
- Spender/Organisation (optional)
- Anlass/Ort
- Quittung ausgestellt (Ja/Nein)
- Quittungsnummer (automatisch)
- Bemerkung

### 4. Ausgaben
**Zweck:** Alle Vereinsausgaben dokumentieren

**Spalten:**
- Datum
- Betrag (€)
- Empfänger
- Zweck
- Kategorie (Verwaltung/Material/Veranstaltung/Werbung/Sonstiges)
- Belegnummer
- Bemerkung

### 5. Übergebene Spenden
**Zweck:** Spenden an Organisationen dokumentieren

**Spalten:**
- Jahr
- Betrag (€)
- Empfängerorganisation
- Datum der Übergabe
- Anlass/Veranstaltung
- Übergeben von
- Kontakt Organisation
- Bemerkung

### 6. Spendenquittungen
**Zweck:** Alle ausgestellten Quittungen verwalten

**Spalten:**
- Quittungsnummer (Format: JAHR-0001)
- Datum Ausstellung
- Jahr der Spende
- Spender Name
- Betrag (€)
- Quelltabelle
- Zeile in Quelltabelle
- Status
- Bemerkung

---

## 🎯 Arbeitsabläufe

### Spende über Bankkonto erhalten

1. Öffnen Sie **Zahlungseingänge Konto**
2. Neue Zeile hinzufügen:
   - Datum der Überweisung
   - Betrag
   - Absender-Name
   - IBAN (optional, für Quittung)
   - Verwendungszweck
   - Kategorie auswählen: "Spende"
   - Quittung ausgestellt: "Nein" (zunächst)
3. Speichern

### Bargeld-Spende bei Tour erhalten

1. Öffnen Sie **Bargeldspenden**
2. Neue Zeile hinzufügen:
   - Datum der Tour
   - Betrag
   - Spender (falls bekannt, sonst leer)
   - Anlass: z.B. "Matjes-Tour 2025"
   - Quittung: "Nein" (zunächst)
3. Speichern

### Spendenquittung ausstellen

**Methode 1: Über Menü**
1. **📊 Buchhaltung** → **Aktionen** → **Quittung ausstellen**
2. Eingabe: `Zahlungseingänge Konto,5` (Beispiel für Zeile 5)
3. System generiert automatisch Quittungsnummer (z.B. 2025-0001)
4. Quittung wird in beiden Tabellen dokumentiert

**Methode 2: Manuell**
1. Öffnen Sie die Quelltabelle
2. Setzen Sie "Quittung ausgestellt" auf "Ja"
3. Tragen Sie Quittungsnummer manuell ein
4. Dokumentieren Sie in **Spendenquittungen**

### Ausgabe dokumentieren

1. Öffnen Sie **Ausgaben**
2. Neue Zeile hinzufügen:
   - Datum
   - Betrag
   - Empfänger
   - Zweck (z.B. "Flyer-Druck")
   - Kategorie auswählen
   - Belegnummer (falls vorhanden)
3. Speichern

### Spende an Organisation übergeben

1. Öffnen Sie **Übergebene Spenden**
2. Neue Zeile hinzufügen:
   - Jahr (z.B. 2025)
   - Betrag
   - Empfängerorganisation (z.B. "Elterninitiative Datteln")
   - Datum der Übergabe
   - Anlass (z.B. "Jahresabschluss 2025")
   - Übergeben von (Name)
   - Kontakt Organisation
3. Speichern

### Jahresabschluss erstellen

1. **📊 Buchhaltung** → **Aktionen** → **Jahresabschluss erstellen**
2. Jahr eingeben (z.B. 2025)
3. System zeigt Zusammenfassung:
   - Alle Einnahmen (Konto + Bargeld)
   - Alle Ausgaben
   - Saldo
   - Anzahl ausgestellter Quittungen
4. Jahresabschluss wird als neues Sheet gespeichert

---

## 🔌 API-Endpunkte

### Für Website-Integration

Nach Deployment als Web-App stehen folgende Endpunkte zur Verfügung:

#### 1. Dashboard-Daten abrufen
```
GET https://script.google.com/macros/s/IHRE_DEPLOYMENT_ID/exec?action=getDashboard
```

**Response:**
```json
{
  "year": 2025,
  "einnahmen": {
    "konto": { "anzahl": 15, "summe": 3500.00, "letzter": "15.03.2025" },
    "bargeld": { "anzahl": 8, "summe": 1500.00, "letzter": "20.03.2025" },
    "gesamt": 5000.00
  },
  "ausgaben": {
    "allgemein": { "anzahl": 3, "summe": 200.00, "letzter": "10.03.2025" },
    "uebergeben": { "anzahl": 0, "summe": 0, "letzter": "" },
    "gesamt": 200.00
  },
  "saldo": 4800.00,
  "quittungen": {
    "konto": { "ausgestellt": 10, "offen": 5 },
    "bargeld": { "ausgestellt": 3, "offen": 5 }
  }
}
```

#### 2. Übergebene Spenden abrufen
```
GET https://script.google.com/macros/s/IHRE_DEPLOYMENT_ID/exec?action=getUebergabeSummen
```

**Response:**
```json
{
  "summen": {
    "2024": 7000,
    "2023": 13000,
    "2022": 4000
  },
  "gesamt": 24000
}
```

#### 3. Alle Jahresdaten abrufen
```
GET https://script.google.com/macros/s/IHRE_DEPLOYMENT_ID/exec?action=getAllYearlyData
```

**Response:**
```json
{
  "donations": [
    { "year": 2025, "amount": 0 },
    { "year": 2024, "amount": 7000 },
    { "year": 2023, "amount": 13000 }
  ],
  "totalDonations": 91055,
  "currentYear": 2025
}
```

#### 4. Jahresabschluss abrufen
```
GET https://script.google.com/macros/s/IHRE_DEPLOYMENT_ID/exec?action=getJahresabschluss&year=2025
```

**Response:**
```json
{
  "jahr": 2025,
  "einnahmen": {
    "konto": 3500,
    "bargeld": 1500,
    "gesamt": 5000
  },
  "ausgaben": {
    "allgemein": 200,
    "uebergabe": 0,
    "gesamt": 200
  },
  "saldo": 4800,
  "quittungen": {
    "konto": 10,
    "bargeld": 3,
    "gesamt": 13
  },
  "erstellt": "2025-03-15T10:30:00.000Z"
}
```

---

## 🚀 Deployment als Web-App

### Schritt 1: Apps Script Editor öffnen
1. In Ihrem Spreadsheet: **Erweiterungen** → **Apps Script**

### Schritt 2: Deployment erstellen
1. Klicken Sie auf **Bereitstellen** → **Neue Bereitstellung**
2. Wählen Sie **Web-App**
3. Einstellungen:
   - **Beschreibung:** "Buchhaltung API v1.0"
   - **Ausführen als:** "Ich"
   - **Zugriff:** "Jeder" (für öffentliche Website) oder "Jeder mit Google-Konto"
4. Klicken Sie auf **Bereitstellen**
5. **Kopieren Sie die Web-App-URL** (Format: `https://script.google.com/macros/s/.../exec`)

### Schritt 3: URL im Frontend verwenden
Die URL verwenden Sie später im Frontend (siehe Frontend-Integration).

---

## 📝 Beispieldaten

### Beispiel-Spende (Zahlungseingänge Konto)

| Datum | Betrag | Absender | IBAN | Verwendungszweck | Kategorie | Quittung | Nummer |
|-------|--------|----------|------|------------------|-----------|----------|--------|
| 15.03.2025 | 50.00 | Max Mustermann | DE89... | Spende Hoffnungsradler | Spende | Ja | 2025-0001 |

### Beispiel-Spende (Bargeld)

| Datum | Betrag | Spender | Anlass | Quittung | Nummer |
|-------|--------|---------|--------|----------|--------|
| 20.03.2025 | 25.00 | - | Matjes-Tour 2025 | Nein | - |

### Beispiel-Ausgabe

| Datum | Betrag | Empfänger | Zweck | Kategorie | Belegnummer |
|-------|--------|-----------|-------|-----------|-------------|
| 10.03.2025 | 150.00 | Druckerei Schmidt | Flyer-Druck | Werbung | R-2025-001 |

### Beispiel-Übergabe

| Jahr | Betrag | Organisation | Datum | Anlass | Übergeben von |
|------|--------|-------------|-------|--------|---------------|
| 2024 | 7000.00 | Elterninitiative Datteln | 15.12.2024 | Jahresabschluss | Martin Stolz |

---

## 🔧 Fehlerbehandlung

### Fehler: "Dashboard-Sheet existiert nicht"
**Lösung:** Führen Sie **Alle Tabellen neu anlegen** aus dem Menü aus.

### Fehler: "Quelltabelle nicht gefunden"
**Lösung:** Überprüfen Sie die Schreibweise der Tabellennamen. Exakte Namen:
- `Zahlungseingänge Konto`
- `Bargeldspenden`
- `Ausgaben`
- `Übergebene Spenden`
- `Spendenquittungen`

### Formeln im Dashboard zeigen #REF! oder #N/A
**Lösung:**
1. Stellen Sie sicher, dass alle Tabellen existieren
2. Führen Sie **Dashboard aktualisieren** aus
3. Prüfen Sie, ob Daten in den Quelltabellen vorhanden sind

---

## 📊 Tipps für die Buchhaltung

### ✅ Best Practices

1. **Regelmäßig pflegen:** Tragen Sie Spenden zeitnah ein
2. **Quittungen sofort:** Stellen Sie Quittungen direkt aus
3. **Belege aufbewahren:** Bewahren Sie alle Belege physisch auf
4. **Monatlicher Check:** Prüfen Sie das Dashboard monatlich
5. **Jahresabschluss:** Erstellen Sie den Jahresabschluss zum 31.12.

### ⚠️ Wichtig für Gemeinnützigkeit

- Alle Spenden ab 300€ benötigen eine Zuwendungsbestätigung
- Dokumentieren Sie den Verwendungszweck genau
- Bewahren Sie Kontoauszüge als Nachweis auf
- Der Jahresabschluss dient als Grundlage für den Jahresbericht

### 📅 Jährliche Aufgaben

1. **Januar:** Dashboard auf neues Jahr umstellen (Zelle B3)
2. **Dezember:** Jahresabschluss erstellen
3. **Dezember:** Alle offenen Quittungen ausstellen
4. **Januar:** Neues Spreadsheet für neues Jahr anlegen (optional)
5. **Januar:** Jahresabschluss an Vorstand/Steuerberater senden

---

## 🆘 Support & Kontakt

Bei Fragen oder Problemen:
- **GitHub Issues:** [Repository-Link]
- **E-Mail:** [Vereins-E-Mail]
- **Dokumentation:** Diese README-Datei

---

## 📄 Lizenz

Dieses System wurde speziell für die Hoffnungsradler Dülmen e.V. entwickelt.
Die Nutzung durch andere gemeinnützige Vereine ist erwünscht und kostenlos.

---

**Version:** 2.0  
**Letzte Aktualisierung:** März 2025  
**Entwickelt für:** Hoffnungsradler Dülmen e.V.

