# Newsletter-Service für Hoffnungsradler Dülmen

## 🚨 System-Update: Wichtige Reparaturen durchgeführt

Das Newsletter-System wurde komplett überarbeitet und kritische Probleme behoben:

### ✅ Behobene Probleme:
- **Doppelte Funktionen entfernt** - Konflikte zwischen utils.gs und anderen Dateien behoben
- **Fehlende Funktionen implementiert** - Alle referenzierten Funktionen sind jetzt verfügbar
- **Trigger-System repariert** - Automatische Verarbeitung und Versand funktionieren wieder
- **Quota-Management verbessert** - Bessere Behandlung des 100-Email-Limits
- **Fehlerbehandlung erweitert** - Robustere Verarbeitung von Fehlern
- **Abstimmungs-Code entfernt** - Alle Abstimmungs-bezogenen Funktionen wurden in das Service-Tourverwaltung System verschoben

## 🔧 Erste Schritte nach dem Update

### 0. Manifest `appsscript.json` (wichtig bei Trigger-Fehlern)

Falls beim **Monitoring-Trigger installieren** eine Meldung zu fehlenden Rechten für `ScriptApp.getProjectTriggers` erscheint, fehlt meist der OAuth-Scope **`script.scriptapp`** im Apps-Script-Projekt.

1. Im Apps-Script-Editor: **Projekteinstellungen** (Zahnrad) → **„appsscript.json“-Manifestdatei im Editor anzeigen** aktivieren.
2. Die Datei **`appsscript.json`** aus diesem Ordner (`Service-Newsletter/google-apps-script/`) in den Editor übernehmen bzw. den Eintrag **`https://www.googleapis.com/auth/script.scriptapp`** in eure bestehende `oauthScopes`-Liste **ergänzen** (nicht doppelt eintragen).
3. Skript **speichern**, danach eine beliebige Menüfunktion erneut ausführen und die **Berechtigungsabfrage** vollständig durchklicken (ggf. „Zugriff prüfen“ / erweiterte Ansicht).

Ohne diesen Scope dürfen `ScriptApp.getProjectTriggers`, `ScriptApp.newTrigger` und `ScriptApp.deleteTrigger` nicht laufen.

### 1. Trigger-System installieren
```
1. Öffne das Google Sheets mit dem Newsletter-Service
2. Gehe zu: Erweiterungen > Newsletter > Administration > Monitoring-Trigger installieren
3. Bestätige die Installation
```

### 2. System-Test durchführen
```
1. Gehe zu: Erweiterungen > Newsletter > Administration > Trigger-Status (detailliert)
2. Überprüfe, ob Trigger aktiv sind
3. Teste mit: Erweiterungen > Newsletter > Test-Newsletter senden
```

## 📧 Newsletter-Versand-Funktionen

### Automatischer Versand bei mehr als 100 Empfängern
Das System teilt den Versand automatisch auf:
- **Limit**: 90 E-Mails pro Durchgang (unter dem Google-Limit)
- **Pause**: 24 Stunden zwischen den Durchgängen
- **Fortsetzung**: Automatisch durch Trigger oder manuell

### Versand-Status überwachen
```
Erweiterungen > Newsletter > Administration > Versandstatus anzeigen
```

### Quota-Überwachung
```
Erweiterungen > Newsletter > Administration > Quota-Status (24h) anzeigen
```

## 🔄 Trigger-System

### Automatische Verarbeitung von An- und Abmeldungen
- **Frequenz**: Alle 10 Minuten
- **Funktion**: `processInboxNewsletterTasks` (ruft Anmeldungen und Abmeldungen auf)
- **Betreff Anmeldung**: "Neue Tour-Newsletter Anmeldung!"
- **Betreff Abmeldung**: "Newsletter-Abmeldung"

### Versand-Trigger für große Listen
- **Automatisch**: Bei mehr als 90 Empfängern wird ein Zeit-Trigger auf `sendNewsletterScheduledContinuation` gelegt (ohne UI, lauffähig im Hintergrund)
- **Fallback**: „Versand manuell fortsetzen“ im Menü
- **Monitoring**: Detaillierte Status-Anzeige

## 📋 Verfügbare Menü-Funktionen

### Newsletter-Menü
- **Vorlage erstellen/öffnen**: Neues Newsletter-Blatt
- **Newsletter archivieren**: Aktuelles Blatt mit Zeitstempel archivieren
- **Test-Newsletter senden**: Testversand an eigene E-Mail
- **Newsletter an alle senden**: Hauptversand-Funktion
- **Anmeldungen & Abmeldungen verarbeiten**: Manuelle Gmail-Verarbeitung (wie der Monitoring-Trigger)
- **Manuelle Abonnenten hinzufügen**: Bulk-Import von E-Mail-Adressen
- **Ungültige E-Mails deaktivieren**: Cleanup-Funktion

### Administration-Untermenü
- **Trigger-Status (detailliert)**: Zeigt alle aktiven Trigger
- **Versand manuell fortsetzen**: Bei Trigger-Problemen
- **Newsletter-System zurücksetzen**: Bei schwerwiegenden Problemen
- **Monitoring-Trigger installieren**: Automatische Anmeldungs-Verarbeitung
- **Quota-Status anzeigen**: 24h E-Mail-Limit überwachen

## 🛠️ Fehlerbehebung

### Problem: Trigger funktionieren nicht
**Lösung:**
1. `Administration > Trigger-Status (detailliert)` prüfen
2. `Administration > Monitoring-Trigger installieren` ausführen
3. Bei Fehlern: `Administration > Newsletter-System zurücksetzen`

### Problem: „Berechtigungen reichen nicht aus … script.scriptapp“
**Ursache:** Im Projekt fehlt der OAuth-Scope für die Trigger-API.

**Lösung:** Abschnitt **„0. Manifest appsscript.json“** oben befolgen, dann erneut **Monitoring-Trigger installieren**. In **Google Workspace** kann ein Admin zusätzlich den Zugriff auf den Scope für interne Skripte freigeben müssen.

### Problem: Versand bleibt hängen
**Lösung:**
1. `Administration > Versandstatus anzeigen` prüfen
2. `Administration > Versand manuell fortsetzen` verwenden
3. Bei Problemen: `Administration > Newsletter-System zurücksetzen`

### Problem: Quota-Limit erreicht
**Lösung:**
1. `Administration > Quota-Status (24h) anzeigen` prüfen
2. 24 Stunden warten
3. System setzt automatisch fort oder manuell fortsetzen

### Problem: Neue Anmeldungen werden nicht verarbeitet
**Lösung:**
1. E-Mail-Betreff prüfen: "Neue Tour-Newsletter Anmeldung!"
2. `Anmeldungen & Abmeldungen verarbeiten` manuell ausführen
3. `Monitoring-Trigger installieren` erneut ausführen

## 📊 Newsletter-Erstellung

### Newsletter-Spreadsheet (Referenz)
- **Welches Dokument:** die `SHEET_ID` aus den Script Properties des Projekts
  (Projekteinstellungen → Script-Properties). Sie steht bewusst **nicht** hier und
  nicht in `settings.gs` — das Repo ist einsehbar, das Abonnentenblatt enthält
  E-Mail-Adressen.
- **Blatt:** `Newsletter_aktuell`
- **Felder:**
  - `B2` – Tour-Titel
  - `B3` – Beschreibung (Fließtext für die E-Mail)
  - `B4` – Datum und Uhrzeit
  - `B5` – Treffpunkt

Tour-Texte können aus `src/components/TourDates.tsx` und der Website abgeleitet werden; nach dem Eintragen: **Newsletter → Test-Newsletter senden** oder **Newsletter an alle senden**.

### 1. Neuen Newsletter erstellen
```
1. Erweiterungen > Newsletter > Vorlage erstellen/öffnen
2. Blatt "Newsletter_aktuell" wird erstellt/geöffnet
3. Alle Felder ausfüllen
```

### 2. Archivierung
```
1. Erweiterungen > Newsletter > Newsletter archivieren
2. Aktuelles Blatt wird mit Zeitstempel archiviert
3. Neues leeres Blatt für nächsten Newsletter
```

## 📈 Monitoring und Statistiken

### Versand-Protokoll
Jeder Versand wird protokolliert:
- **Versanddatum**: Zeitstempel des Versands
- **Anzahl Empfänger**: Erfolgreich versendete E-Mails
- **Status**: Erfolgreich/Fehler-Anzahl/Ungültige E-Mails

### Abonnenten-Verwaltung
Das System verwaltet automatisch:
- **Aktive Abonnenten**: Status "aktiv"
- **Ungültige E-Mails**: Automatische Erkennung
- **Sendestatus**: Erfolg/Fehler/Ungültig pro Versand

## 🔐 Sicherheit und Backup

### Automatische Backups
```
Erweiterungen > Newsletter > Administration > Backup erstellen
```

### Datenintegrität
- Automatische Spalten-Erstellung
- Validierung von E-Mail-Adressen
- Schutz vor Datenverlusten

## 📞 Support

### Bei Problemen:
1. **Trigger-Status** prüfen
2. **Versandstatus** kontrollieren
3. **Quota-Status** überprüfen
4. **Newsletter-System zurücksetzen** (als letztes Mittel)

### Häufige Fehler und Lösungen:
- **"Funktion nicht gefunden"**: System-Update durchführen
- **"Trigger nicht aktiv"**: Monitoring-Trigger installieren
- **"Quota erreicht"**: 24h warten oder Status prüfen
- **"E-Mail-Fehler"**: Ungültige E-Mails deaktivieren

## 🎯 Beste Praktiken

### Newsletter-Versand:
1. Immer zuerst **Test-Newsletter** senden
2. **Quota-Status** vor großen Versänden prüfen
3. **Trigger-Status** regelmäßig kontrollieren
4. Newsletter vor Versand **archivieren**

### Abonnenten-Verwaltung:
1. Regelmäßig **ungültige E-Mails deaktivieren**
2. **Backup** vor größeren Änderungen erstellen

### Monitoring:
1. **Monitoring-Trigger** aktiv halten
2. **Versandstatus** nach großen Versänden prüfen
3. **Quota-Status** täglich kontrollieren

## 📝 Integrationen

### Tour-Abstimmungen
Die Abstimmungs-Funktionalität wurde in das **Service-Tourverwaltung System** verschoben:
- Abstimmungen werden über das Tourverwaltung-System erstellt
- Newsletter können weiterhin Links zu Abstimmungen enthalten
- Abstimmungs-Ergebnisse werden in der Tourverwaltung ausgewertet

---

**Version:** 2.1 (Abstimmungs-Code entfernt)
**Letzte Aktualisierung:** Juli 2025
**Status:** ✅ Vollständig funktionsfähig 