# 💾 Backup-System

## Übersicht

Das Backup-System schützt Ihre Vereinsdaten durch regelmäßige Sicherungen. Sie können Backups manuell erstellen oder automatisch einrichten.

## Funktionen

### 💾 Backup jetzt erstellen

**Manuelles Backup sofort erstellen**:

1. **Menü**: `📊 Buchhaltung → 💾 Backup → Backup jetzt erstellen`
2. **Backup wird erstellt** mit Namen: `[Name Ihrer Tabelle] - Backup YYYY-MM-DD_HH-mm`
3. **Speicherort**: Im gleichen Ordner wie das Original (oder im "Backups"-Ordner, falls vorhanden)

**Beispiel**: 
- Original: `Hoffnungsradler Buchhaltung`
- Backup: `Hoffnungsradler Buchhaltung - Backup 2025-01-15_14-30`

### 🤖 Automatisches Backup einrichten

**Tägliche automatische Backups**:

1. **Menü**: `📊 Buchhaltung → 💾 Backup → Automatisches Backup einrichten`
2. **Trigger wird erstellt**: Täglich um 2:00 Uhr wird automatisch ein Backup erstellt
3. **E-Mail-Benachrichtigung**: Bei erfolgreichem oder fehlgeschlagenem Backup erhalten Sie eine E-Mail

**Hinweis**: Benötigt Berechtigung für Zeitgesteuerte Trigger.

## Backup-Struktur

### Dateiname
- **Manuell**: `[Originalname] - Backup YYYY-MM-DD_HH-mm`
- **Automatisch**: `[Originalname] - Auto-Backup YYYY-MM-DD`

### Speicherort
1. **Primär**: Ordner "Backups" (wird automatisch erstellt, falls nicht vorhanden)
2. **Fallback**: Gleicher Ordner wie das Original

### Duplikate
- **Automatische Backups**: Wenn bereits ein Backup für denselben Tag existiert, wird kein neues erstellt (verhindert Duplikate)

## Backup-Inhalt

Das Backup enthält **alles** aus der Original-Tabelle:
- ✅ Alle Blätter (Dashboard, Mitglieder, Zahlungseingänge, etc.)
- ✅ Alle Daten
- ✅ Alle Formeln
- ✅ Formatierungen
- ✅ Import-Regeln
- ❌ **NICHT enthalten**: Zeitgesteuerte Trigger (müssen ggf. neu eingerichtet werden)

## E-Mail-Benachrichtigungen

### Erfolgreiches Backup
```
Betreff: Backup erstellt - Hoffnungsradler Buchhaltung

Automatisches Backup wurde erfolgreich erstellt:

Name: Hoffnungsradler Buchhaltung - Auto-Backup 2025-01-15
Datum: 15.01.2025 02:00
```

### Backup-Fehler
```
Betreff: ⚠️ Backup-Fehler - Hoffnungsradler Buchhaltung

Das automatische Backup konnte nicht erstellt werden:

Fehler: [Fehlerbeschreibung]
Datum: 15.01.2025 02:00
```

## Backup-Verwaltung

### Backup-Ordner organisieren

1. **Manuell erstellen**: In Google Drive einen Ordner "Backups" erstellen
2. **Automatisch**: Das System erstellt den Ordner beim ersten Backup

### Backup aufräumen

**Empfehlung**: Regelmäßig alte Backups löschen:
- **Tägliche Backups**: Älter als 30 Tage können gelöscht werden
- **Monatliche Backups**: Wichtige Backups (z.B. Jahresabschluss) dauerhaft behalten

### Backup wiederherstellen

1. **Backup öffnen**: In Google Drive zum Backup navigieren
2. **Rückbenennen**: Falls das Original beschädigt ist, kann das Backup als neues Original genutzt werden
3. **Daten kopieren**: Einzelne Blätter oder Daten aus dem Backup ins Original kopieren

## Wartung

### Trigger prüfen

**Wo einsehen**:
1. `Erweiterungen → Apps Script`
2. Im Editor: Uhr-Symbol (⚙️) → "Trigger"

**Wann prüfen**:
- Nach Änderungen am System
- Bei Problemen mit automatischen Backups
- Regelmäßig (z.B. monatlich)

### Trigger entfernen

Falls automatisches Backup nicht mehr gewünscht:
1. `Erweiterungen → Apps Script → Trigger`
2. Trigger für `createScheduledBackup` löschen

### Trigger neu einrichten

Falls automatisches Backup nicht funktioniert:
1. Alten Trigger entfernen (siehe oben)
2. `📊 Buchhaltung → 💾 Backup → Automatisches Backup einrichten`

## Fehlerbehandlung

### "Keine Berechtigung für Trigger"
- **Ursache**: Google-Konto hat keine Berechtigung für Zeitgesteuerte Trigger
- **Lösung**: Manuelles Backup nutzen

### "Backup konnte nicht erstellt werden"
- **Ursache**: Zu wenig Speicherplatz, Berechtigungsfehler, etc.
- **Lösung**: Prüfe Google Drive-Speicherplatz, Berechtigungen

### "Backup-Ordner konnte nicht erstellt werden"
- **Ursache**: Keine Berechtigung zum Erstellen von Ordnern
- **Lösung**: Backup wird trotzdem erstellt, bleibt im Original-Ordner

## Best Practices

### Regelmäßige Backups
✅ **Empfohlen**: 
- **Täglich**: Automatisches Backup (2:00 Uhr)
- **Vor wichtigen Aktionen**: Manuelles Backup (z.B. vor Jahresabschluss)
- **Nach großen Änderungen**: Manuelles Backup

### Backup-Strategie
1. **Tägliche Backups**: Automatisch, für aktuelle Sicherheit
2. **Monatliche Backups**: Wichtige Meilensteine (z.B. Monatsabschluss)
3. **Jahresabschluss-Backup**: Einmalig jährlich, dauerhaft behalten

### Testen
- **Regelmäßig**: Backup öffnen und prüfen, ob alles vorhanden ist
- **Wiederherstellung testen**: Einmal jährlich ein Backup vollständig öffnen und prüfen

### Dokumentation
- **Notieren**: Wichtige Backups markieren (z.B. "Jahresabschluss 2024")
- **Löschung planen**: Alte Backups regelmäßig aufräumen (aber wichtige behalten)

## Technische Details

### Trigger-Typ
- **Zeitgesteuert**: Täglich um 2:00 Uhr
- **Funktion**: `createScheduledBackup()`
- **Berechtigungen**: Benötigt Zugriff auf DriveApp, SpreadsheetApp, MailApp

### Backup-Erstellung
- **Methode**: `ss.copy()` - Erstellt vollständige Kopie
- **Zeitstempel**: Format `YYYY-MM-DD_HH-mm` oder `YYYY-MM-DD`
- **Größe**: Identisch mit Original (alle Daten werden kopiert)

### Speicherplatz
- **Backup-Größe**: Abhängig von Original-Größe
- **Google Drive**: Kostenlos 15 GB (ausreichend für viele Backups)
- **Empfehlung**: Regelmäßig alte Backups löschen

## Sicherheit

### Zugriff auf Backups
- **Berechtigungen**: Identisch mit Original
- **Freigabe**: Backups haben gleiche Freigabe-Einstellungen wie Original
- **Empfehlung**: Backups in separatem Ordner mit eingeschränkter Freigabe

### Datenschutz
- **DSGVO**: Backups enthalten dieselben sensiblen Daten wie Original
- **Löschung**: Backups sollten bei Löschung von Original auch gelöscht werden
- **Archivierung**: Wichtige Backups langfristig sichern (z.B. externe Festplatte)

