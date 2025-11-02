# 📊 Buchhaltungssystem - Dokumentation

**Hoffnungsradler Dülmen e.V.**

---

## 🎯 Übersicht

Das Buchhaltungssystem für die Hoffnungsradler Dülmen e.V. ist eine vollständige Lösung zur Verwaltung von Spenden, Ausgaben und Jahresabschlüssen.

### Features

✅ **Automatisches Dashboard** mit Echtzeit-Übersicht über alle Finanzen  
✅ **CSV-Import** für Kontoauszüge mit intelligenter Kategorisierung  
✅ **Copy & Paste Import** für Sparkassen-Exporte (direkt aus Excel)  
✅ **Regelbasierte Zuordnung** mit Lern-Effekt (bekannte Spender)  
✅ **Spendenquittungs-System** mit fortlaufender Nummerierung  
✅ **Jahresabschluss-Funktion** (Einnahmen-Überschuss-Rechnung)  
✅ **Mitglieder-Info-Versand** per E-Mail an alle aktiven Mitglieder  
✅ **Backup-System** mit automatischen täglichen Backups  
✅ **API-Integration** für die Website  
✅ **Strukturierte Tabellen** für alle Buchungen  
✅ **Gemeinnützigkeits-konform**  

---

## 📚 Verfügbare Dokumentation

### 1. [INSTALLATION.md](./INSTALLATION.md)
**Für: Administratoren & Techniker**

Schritt-für-Schritt Anleitung zur Einrichtung des kompletten Systems:
- Google Spreadsheet & Apps Script Setup
- Website-Integration
- Vercel Deployment
- Fehlerbehebung

📖 **Lesen Sie diese Anleitung zuerst, wenn Sie das System neu einrichten!**

---

### 2. [CSV_IMPORT.md](./CSV_IMPORT.md) ⭐ NEU!
**Für: Schatzmeister & Buchhalter**

Kontoauszüge automatisch importieren und kategorisieren:
- CSV von Sparkasse hochladen
- Automatische Kategorisierung
- Bekannte Spender-Erkennung
- Regelbasiertes System
- 90% Zeitersparnis!

📖 **Pflichtlektüre für alle, die Kontoauszüge erfassen!**

---

### 3. [BUCHHALTUNG_HANDBUCH.md](./BUCHHALTUNG_HANDBUCH.md)
**Für: Schatzmeister & Buchhalter**

Umfassendes Handbuch für die tägliche Arbeit mit dem System:
- Spenden dokumentieren
- Ausgaben erfassen
- Spendenquittungen ausstellen
- Monatliche & jährliche Aufgaben
- Häufige Fragen & Fehlerbehebung

📖 **Ihr täglicher Begleiter für die Buchhaltung!**

---

### 4. [JAHRESABSCHLUSS_CHECKLISTE.md](./JAHRESABSCHLUSS_CHECKLISTE.md)
**Für: Schatzmeister & Vorstand**

Detaillierte Checkliste für den Jahresabschluss:
- Zeitplan & Phasen
- Datenprüfung
- Belege zusammenstellen
- Export & Archivierung
- Finanzamt & Steuerberater

📖 **Nutzen Sie diese Checkliste Ende Dezember / Anfang Januar!**

---

### 5. [SICHERHEIT.md](./SICHERHEIT.md) 🔒
**Für: Alle Administratoren**

Sicherheits-Dokumentation und Best Practices:
- Öffentliche vs. private API-Endpunkte
- Datenschutz & DSGVO
- Zugriffskontrolle
- Risiken & Gegenmaßnahmen
- Notfall-Maßnahmen

📖 **Wichtig: Bitte lesen Sie dies für sicheren Betrieb!**

---

### 6. [MITGLIEDERVERWALTUNG.md](./MITGLIEDERVERWALTUNG.md) 👥
**Für: Schatzmeister & Vorstand**

Mitgliederverwaltung mit automatischer Zuordnung:
- Mitgliedertabelle verwalten
- Automatische Mitgliedsnummer-Zuordnung
- IBAN/Name-basierte Erkennung
- Beitragsstatus-Tracking
- Workflows & Best Practices

📖 **Für Vereine mit Mitgliedern - automatische Zuordnung!**

---

### 7. [MITGLIEDER_INFO.md](./MITGLIEDER_INFO.md) 📧
**Für: Vorstand & Kommunikationsverantwortliche**

Mitglieder-Info-Versand per E-Mail:
- E-Mails an alle aktiven Mitglieder versenden
- Professionelle E-Mail-Templates
- Automatische Empfänger-Filterung
- Versand-Statistiken
- Archivierung

📖 **Für wichtige Vereinsmitteilungen!**

---

### 8. [BACKUP_SYSTEM.md](./BACKUP_SYSTEM.md) 💾
**Für: Alle Administratoren**

Backup-System für Datensicherung:
- Manuelle Backups erstellen
- Automatische tägliche Backups
- E-Mail-Benachrichtigungen
- Backup-Verwaltung & Wiederherstellung
- Best Practices

📖 **Wichtig: Schützen Sie Ihre Daten mit regelmäßigen Backups!**

---

### 9. [SPENDENQUITTUNGEN_EMAIL.md](./SPENDENQUITTUNGEN_EMAIL.md) 📧
**Für: Schatzmeister & Buchhalter**

Automatischer Versand von Spendenquittungen per E-Mail:
- Automatischer Versand beim Ausstellen
- Professionelle HTML-E-Mails
- Manueller Nachversand
- E-Mail-Adressen aus Mitglieder-Tabelle
- Versand-Status Dokumentation

📖 **Zeit sparen mit automatischem Quittungsversand!**

---

## 🚀 Quick Start

### Für Neue Benutzer

1. ✅ Lesen Sie **[INSTALLATION.md](./INSTALLATION.md)** für die Einrichtung
2. ✅ Lesen Sie **[BUCHHALTUNG_HANDBUCH.md](./BUCHHALTUNG_HANDBUCH.md)** Kapitel "Erste Schritte"
3. ✅ Öffnen Sie das Google Spreadsheet
4. ✅ Beginnen Sie mit der ersten Spenden-Eingabe

### Für Erfahrene Benutzer

- **Tägliche Arbeit:** Siehe [Tägliche Aufgaben](./BUCHHALTUNG_HANDBUCH.md#tägliche-aufgaben)
- **Monatliche Prüfung:** Siehe [Monatliche Aufgaben](./BUCHHALTUNG_HANDBUCH.md#monatliche-aufgaben)
- **Jahresabschluss:** Siehe [JAHRESABSCHLUSS_CHECKLISTE.md](./JAHRESABSCHLUSS_CHECKLISTE.md)

---

## 📁 Dateien-Übersicht

### Backend (Google Apps Script)

```
Service-Vereinsverwaltung/
└── google-apps-script/
    ├── Code.gs           ← Haupt-Script (in Google Sheets einfügen)
    └── README.md         ← Technische Dokumentation
```

### Frontend (React Website)

```
src/
├── lib/
│   ├── api-config.ts          ← API-Konfiguration
│   ├── buchhaltung-api.ts     ← API-Funktionen
│   └── fetchUebergabeSummen.ts
├── components/
│   └── Hero.tsx               ← Zeigt Spenden-Fortschritt
├── pages/
│   └── Spenden.tsx            ← Spenden-Übersicht
└── data/
    └── donations.ts           ← Fallback-Daten
```

### Dokumentation

```
docs/
├── README.md                       ← Diese Datei
├── INSTALLATION.md                 ← Setup-Anleitung
├── BUCHHALTUNG_HANDBUCH.md        ← Benutzerhandbuch
└── JAHRESABSCHLUSS_CHECKLISTE.md  ← Jahresabschluss
```

---

## 🎓 Schulungsmaterial

### Video-Tutorials (TODO)

Geplante Tutorials:
- [ ] Einrichtung des Systems (10 Min)
- [ ] Erste Spende eintragen (5 Min)
- [ ] Spendenquittung ausstellen (5 Min)
- [ ] Jahresabschluss erstellen (15 Min)

### Workshop-Folien (TODO)

Geplante Workshops:
- [ ] Einführung in das Buchhaltungssystem (60 Min)
- [ ] Jahresabschluss-Workshop (90 Min)

---

## 🔧 Technische Details

### Architektur

```
┌─────────────────────────────────────────────┐
│         Google Spreadsheet                  │
│  ┌──────────────────────────────────────┐  │
│  │ Tabellenblätter:                      │  │
│  │ - Dashboard                           │  │
│  │ - Zahlungseingänge Konto             │  │
│  │ - Bargeldspenden                      │  │
│  │ - Ausgaben                            │  │
│  │ - Übergebene Spenden                  │  │
│  │ - Spendenquittungen                   │  │
│  └──────────────────────────────────────┘  │
│                                              │
│  ┌──────────────────────────────────────┐  │
│  │ Google Apps Script (Backend)          │  │
│  │ - API-Endpunkte (doGet/doPost)       │  │
│  │ - Dashboard-Logik                     │  │
│  │ - Quittungs-Generator                 │  │
│  │ - Jahresabschluss-Funktion           │  │
│  └──────────────────────────────────────┘  │
└────────────────┬────────────────────────────┘
                 │ HTTPS/JSON
                 │ API-Aufrufe
                 ▼
┌─────────────────────────────────────────────┐
│          React Website (Frontend)            │
│  ┌──────────────────────────────────────┐  │
│  │ Components:                           │  │
│  │ - Hero (Fortschrittsbalken)          │  │
│  │ - Spenden (Tabelle)                  │  │
│  └──────────────────────────────────────┘  │
│                                              │
│  ┌──────────────────────────────────────┐  │
│  │ API-Client:                           │  │
│  │ - buchhaltung-api.ts                 │  │
│  │ - Fallback zu Mock-Daten             │  │
│  └──────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

### API-Endpunkte

| Endpunkt | Methode | Beschreibung |
|----------|---------|-------------|
| `?action=getDashboard` | GET | Dashboard-Daten |
| `?action=getUebergabeSummen` | GET | Übergebene Spenden |
| `?action=getAllYearlyData` | GET | Alle Jahres-Daten |
| `?action=getJahresabschluss&year=2025` | GET | Jahresabschluss |
| `?action=addDonation` | POST | Spende hinzufügen |
| `?action=issueReceipt` | POST | Quittung ausstellen |

### Technologie-Stack

**Backend:**
- Google Apps Script (JavaScript)
- Google Sheets als Datenbank

**Frontend:**
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Shadcn/ui

**Hosting:**
- Vercel (Frontend)
- Google (Backend/Datenbank)

---

## 🔐 Sicherheit & Datenschutz

### Zugriffsrechte

**Google Spreadsheet:**
- **Lesen:** Nur autorisierte Vereinsmitglieder
- **Schreiben:** Nur Schatzmeister & Vorstand
- **Löschen:** Nur Vorstand

**Apps Script:**
- Ausführen als: Spreadsheet-Besitzer
- Zugriff: Öffentlich (nur API-Endpunkte)

### Datenschutz (DSGVO)

- ✅ Spenderdaten nur für berechtigte Zwecke
- ✅ Keine öffentliche Anzeige von Spendernamen
- ✅ Zugriff nur für autorisierte Personen
- ✅ Recht auf Auskunft & Löschung gewährleistet

### Backup-Strategie

**Empfohlen:**
- 📅 **Täglich:** Automatisches Google Drive Backup
- 📅 **Wöchentlich:** Manueller Excel-Export
- 📅 **Monatlich:** Vollständiges Backup (inkl. Belege)
- 📅 **Jährlich:** Archivierung des Jahresabschlusses

---

## 📞 Support & Hilfe

### Bei technischen Problemen

1. **Dokumentation prüfen:**
   - [INSTALLATION.md](./INSTALLATION.md) → Fehlerbehebung
   - [BUCHHALTUNG_HANDBUCH.md](./BUCHHALTUNG_HANDBUCH.md) → Häufige Fragen

2. **Google Apps Script Logs prüfen:**
   - Apps Script Editor öffnen
   - **Ausführung** → **Letzte Ausführung**

3. **Browser-Konsole prüfen:**
   - F12 drücken
   - Tab "Console" öffnen
   - Fehler ablesen

4. **Support kontaktieren:**
   - GitHub Issues: [Repository]
   - E-Mail: [Vereins-E-Mail]
   - Telefon: [Vorstand]

### Bei Buchhaltungsfragen

1. **Handbuch konsultieren:**
   - [BUCHHALTUNG_HANDBUCH.md](./BUCHHALTUNG_HANDBUCH.md)

2. **Steuerberater fragen:**
   - Bei rechtlichen Fragen
   - Bei Gemeinnützigkeits-Fragen

3. **Vorstand kontaktieren:**
   - Bei Freigaben
   - Bei Unsicherheiten

---

## 🛠️ Wartung & Updates

### Regelmäßige Wartung

**Monatlich:**
- [ ] Dashboard-Check
- [ ] Backup erstellen
- [ ] Offene Quittungen prüfen

**Jährlich:**
- [ ] Jahresabschluss erstellen
- [ ] Archivierung
- [ ] System auf Updates prüfen

### Updates einspielen

**Apps Script:**
1. Backup erstellen!
2. Code in `Service-Vereinsverwaltung/google-apps-script/Code.gs` aktualisieren
3. In Apps Script Editor einfügen
4. Speichern
5. Neue Bereitstellung erstellen

**Frontend:**
1. Git Pull
2. `npm install`
3. Testen: `npm run dev`
4. Deployen: Git Push (automatisches Vercel Deployment)

---

## 📈 Roadmap

### Geplante Features (v2.0)

- [ ] Mitgliederverwaltung integrieren
- [ ] Automatische E-Mail-Benachrichtigungen
- [ ] PDF-Export von Spendenquittungen
- [ ] Automatische Kontoauszugs-Import
- [ ] Mobile App für Bargeld-Erfassung
- [ ] Statistiken & Reports

### Verbesserungsvorschläge

Haben Sie Ideen? Öffnen Sie ein GitHub Issue oder kontaktieren Sie den Vorstand!

---

## 📜 Lizenz & Copyright

**Entwickelt für:** Hoffnungsradler Dülmen e.V.  
**Entwickelt von:** [Name/Team]  
**Version:** 1.0  
**Datum:** März 2025  

**Nutzung durch andere Vereine:**
Die Nutzung und Anpassung durch andere gemeinnützige Vereine ist ausdrücklich erwünscht und kostenlos. Bei Fragen kontaktieren Sie uns gerne!

---

## 🙏 Danksagung

Dieses System wurde entwickelt, um die ehrenamtliche Arbeit der Hoffnungsradler Dülmen zu unterstützen. Unser Dank gilt:

- Allen Spendern und Sponsoren
- Allen ehrenamtlichen Helfern
- Der Open-Source-Community

---

## 📧 Kontakt

**Hoffnungsradler Dülmen e.V.**

- **Website:** https://www.hoffnungs-radler-duelmen.de
- **E-Mail:** [Vereins-E-Mail]
- **Vorstand:**
  - Martin Stolz
  - Gregor Horstmann

---

**Gemeinsam bewegen wir mehr! 🚴‍♂️💙**

