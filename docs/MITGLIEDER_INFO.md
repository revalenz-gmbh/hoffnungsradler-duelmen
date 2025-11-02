# 👥 Mitglieder-Info Versand

## Übersicht

Das Mitglieder-Info-System ermöglicht es, E-Mails an alle aktiven Mitglieder zu versenden. Dies ist ideal für:
- Vereinsnachrichten
- Terminankündigungen
- Informationen zu Veranstaltungen
- Wichtige Bekanntmachungen

## Funktionen

### 📧 Mitglieder-Info erstellen

1. **Menü öffnen**: `📊 Buchhaltung → 👥 Mitglieder → Mitglieder-Info erstellen`

2. **Blatt wird erstellt** (`Mitglieder_Info_aktuell`) mit:
   - **Betreff-Feld**: E-Mail-Betreff
   - **Inhalt-Feld**: E-Mail-Inhalt (mehrzeilig)

3. **Felder ausfüllen**:
   - Betreff: z.B. "Neue Tour-Anmeldungen möglich"
   - Inhalt: Vollständiger Text der Mitteilung

### 📧 Test-E-Mail senden (Empfohlen!)

**Wichtig**: Vor dem Versand an alle Mitglieder sollte immer eine Test-E-Mail gesendet werden!

1. **Blatt vorbereiten**: Stelle sicher, dass Betreff und Inhalt ausgefüllt sind.

2. **Testversand starten**: `📊 Buchhaltung → 👥 Mitglieder → 📧 Test-E-Mail senden`

3. **Test-E-Mail prüfen**:
   - Eine E-Mail wird an deine eigene E-Mail-Adresse gesendet
   - Betreff beginnt mit `[TEST]` zur Kennzeichnung
   - Im HTML-Text erscheint eine gelbe Warnung, dass es sich um einen Test handelt
   - Die E-Mail ist identisch mit der, die alle Mitglieder erhalten würden

4. **Anpassungen vornehmen**:
   - Falls Betreff oder Inhalt angepasst werden müssen, einfach im Blatt ändern
   - Erneut Test-E-Mail senden, bis alles korrekt ist

5. **Versand an alle**: Wenn alles korrekt aussieht, den finalen Versand starten.

### 📤 Mitglieder-Info versenden

1. **Blatt vorbereiten**: Stelle sicher, dass Betreff und Inhalt ausgefüllt sind.

2. **✅ Testversand durchgeführt**: Wichtig: Vorher immer eine Test-E-Mail senden!

3. **Versand starten**: `📊 Buchhaltung → 👥 Mitglieder → Mitglieder-Info versenden`

4. **Bestätigung**: Das System zeigt:
   - Anzahl der Empfänger
   - Betreff der E-Mail
   - Fordert Bestätigung

5. **Versand durchführen**: 
   - E-Mails werden an alle aktiven Mitglieder gesendet
   - Nur Mitglieder mit E-Mail-Adresse werden berücksichtigt
   - Mitglieder mit Status "Ausgetreten" oder "Verstorben" werden ausgeschlossen

6. **Statistik**: Nach dem Versand wird automatisch aktualisiert:
   - Versanddatum
   - Anzahl der versendeten E-Mails
   - Status (Erfolgreich / Fehler)

## E-Mail-Template

Die E-Mails werden automatisch im Format der Hoffnungsradler versendet:

```
Mitteilung der Hoffnungsradler Dülmen e.V.

Liebe Hoffnungsradler,

[Ihr Inhalt hier]

Mit radsportlichen Grüßen,
Martin Stolz
im Namen des Vorstandes der Hoffnungsradler Dülmen e.V.
```

**HTML-Version**: Enthält professionelles Design mit Logo-Farben (#2E7D32) und strukturierter Formatierung.

## Archivierung

**💡 TIPP**: Vor dem Versand:

1. **Blatt duplizieren**: Rechtsklick auf `Mitglieder_Info_aktuell` → "Blatt kopieren"
2. **Umbenennen**: z.B. `Info_März_2025` oder `Info_Touranmeldung_2025`
3. **Versenden**: Dann die ursprüngliche Info versenden

Dies ermöglicht eine einfache Archivierung aller versendeten Infos.

## Empfänger-Filterung

Das System berücksichtigt nur:
- ✅ Aktive Mitglieder (aus Tabelle "Mitglieder")
- ✅ Mitglieder mit gültiger E-Mail-Adresse
- ❌ Ausgeschlossen: Status "Ausgetreten" oder "Verstorben"

## Fehlerbehandlung

### Keine Empfänger gefunden
- **Prüfe**: Sind Mitglieder in der Tabelle "Mitglieder" eingetragen?
- **Prüfe**: Haben Mitglieder E-Mail-Adressen?
- **Prüfe**: Sind Mitglieder als "Aktiv" markiert?

### Versand-Fehler
- Einzelne Fehler beim Versand werden protokolliert
- Die Statistik zeigt Anzahl erfolgreicher/fehlgeschlagener Versendungen
- Fehlerhafte E-Mail-Adressen werden im Ergebnis-Dialog angezeigt

## Gmail-Limits

⚠️ **WICHTIG**: Gmail hat tägliche Versand-Limits:
- **Max. 100 E-Mails pro Tag** für kostenlose Google-Konten
- Das System pausiert 1 Sekunde zwischen E-Mails, um Rate-Limits zu vermeiden

**Empfehlung**: Bei mehr als 100 Mitgliedern:
- Versand in kleineren Gruppen
- Oder Google Workspace-Account nutzen (höhere Limits)

## Best Practices

1. **Vor dem Versand prüfen**:
   - Betreff korrekt?
   - Inhalt vollständig und fehlerfrei?
   - Empfängerliste plausibel?

2. **Testversand** ⭐ **EMPFEHLUNG**: 
   - **IMMER** zuerst eine Test-E-Mail senden (`📧 Test-E-Mail senden`)
   - E-Mail im eigenen Postfach prüfen
   - Formatierung, Rechtschreibung und Inhalt kontrollieren
   - Bei Bedarf Anpassungen vornehmen und erneut testen
   - Erst dann den finalen Versand an alle Mitglieder starten

3. **Archivierung**: Immer das Blatt vor dem Versand duplizieren.

4. **Persönlicher Kontakt**: Für sensible oder persönliche Themen besser direkt kontaktieren.

## Technische Details

- **Sender-Name**: "Hoffnungsradler Dülmen e.V."
- **Reply-To**: E-Mail-Adresse des aktiven Benutzers
- **Format**: Plain Text + HTML
- **Personalisiert**: Anrede kann mit Mitgliedsname personalisiert werden (optional)

