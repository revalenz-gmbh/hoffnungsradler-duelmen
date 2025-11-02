# 📧 Spendenquittungen per E-Mail versenden

## Übersicht

Das System kann Spendenquittungen automatisch per E-Mail versenden. Dies spart Zeit, reduziert Papierkram und ist DSGVO-konform.

## Funktionen

### ✅ Automatischer Versand beim Ausstellen

**Beim Ausstellen einer Quittung**:

1. Das System sucht automatisch nach einer E-Mail-Adresse für den Spender:
   - Zuerst in der **Mitglieder-Tabelle** (Name-basierte Suche)
   - Später erweiterbar (z.B. IBAN-basierte Suche)

2. **Wenn E-Mail gefunden**: 
   - Quittung wird automatisch per E-Mail versendet
   - Versand-Status wird in der Quittungstabelle dokumentiert
   - Bestätigung wird angezeigt

3. **Wenn keine E-Mail gefunden**:
   - Quittung wird trotzdem ausgestellt
   - Hinweis wird angezeigt
   - Manueller Nachversand ist möglich

### 📧 Manueller Nachversand

**Für bereits ausgestellte Quittungen**:

1. **Menü**: `📊 Buchhaltung → Aktionen → 📧 Quittung per E-Mail versenden`

2. **Quittungsnummer eingeben**: z.B. `2025-0001`

3. **E-Mail-Adresse eingeben**: Die E-Mail-Adresse des Spenders

4. **Bestätigen**: System sendet E-Mail und aktualisiert Quittungstabelle

## PDF-Quittung

Die versendeten E-Mails enthalten eine **PDF-Datei** als Anhang:

### Betreff
```
Spendenquittung 2025-0001 - Hoffnungsradler Dülmen e.V.
```

### E-Mail-Inhalt
- ✅ **Plain Text E-Mail** mit Quittungsdetails
- ✅ **PDF-Anhang**: Professionelle Spendenquittung als PDF

### PDF-Inhalt
- ✅ **Hoffnungsradler Logo** (oben im Dokument)
- ✅ **Professionelles Design** mit Logo-Farben (#2E7D32)
- ✅ **Alle Quittungsdetails**:
  - Quittungsnummer
  - Ausstellungsdatum
  - Spender-Name
  - Spendenbetrag (hervorgehoben)
  - Spendendatum
- ✅ **Dankes-Text**
- ✅ **Footer**: Hoffnungsradler Dülmen e.V. im Namen des Vorstandes
- ✅ **Disclaimer**: Hinweis für Steuererklärung

### PDF-Format
- **Format**: A4
- **Dateiname**: `Spendenquittung_2025-0001.pdf`
- **Druckbar**: Kann direkt ausgedruckt werden
- **Steuerlich anerkannt**: Kann als Nachweis für Steuererklärung verwendet werden

### Beispiel-E-Mail

```
Hoffnungsradler Dülmen e.V.
Spendenquittung

Quittungsnummer: 2025-0001
Ausgestellt am: 15.01.2025

Spender: Max Mustermann
Spendenbetrag: 50,00 €
Spendendatum: 10.01.2025

Vielen Dank für Ihre Spende!

Mit freundlichen Grüßen,
Hoffnungsradler Dülmen e.V.
im Namen des Vorstandes

Die Spendenquittung finden Sie als PDF-Anhang.
```

## Quittungstabelle

Die Tabelle "Spendenquittungen" wurde erweitert um:

| Spalte | Inhalt | Beispiel |
|--------|--------|----------|
| **E-Mail versendet** | Ja/Nein | Ja |
| **E-Mail-Adresse** | E-Mail des Spenders | max@example.com |
| **Versanddatum** | Datum & Uhrzeit | 15.01.2025 14:30 |

### Versand-Status prüfen

1. Öffne Tabelle **"Spendenquittungen"**
2. Prüfe Spalte **"E-Mail versendet"**:
   - ✅ **"Ja"**: E-Mail wurde versendet
   - ❌ **"Nein"**: Noch nicht versendet (manuell versenden möglich)

## Automatische E-Mail-Suche

### Wie funktioniert die Suche?

1. **Name-basierte Suche in Mitglieder-Tabelle**:
   - Spender-Name wird mit Namen in Mitglieder-Tabelle verglichen
   - Normalisierung: Umlaute, Groß-/Kleinschreibung werden ignoriert
   - Bei Übereinstimmung: E-Mail-Adresse wird verwendet

2. **Erweiterbar** (künftig möglich):
   - IBAN-basierte Suche
   - Suche in externen Spender-Datenbanken

### E-Mail-Adressen pflegen

**Wichtig**: Damit automatischer Versand funktioniert, müssen Spender in der **Mitglieder-Tabelle** eingetragen sein:

1. Öffne Tabelle **"Mitglieder"**
2. Stelle sicher, dass Spender eingetragen sind:
   - **Spalte B**: Vorname, Name (muss mit Spender-Name übereinstimmen)
   - **Spalte D**: Email (muss ausgefüllt sein)

3. **Tipp**: Bei ähnlichen Namen (z.B. "Max Mustermann" vs. "Mustermann, Max"):
   - System findet trotzdem Übereinstimmungen
   - Normalisierung erkennt ähnliche Namen

## Workflow

### Typischer Ablauf

1. **Spende erhalten** → In "Zahlungseingänge Konto" oder "Bargeldspenden" eintragen

2. **Quittung ausstellen**:
   - `📊 Buchhaltung → Aktionen → Quittung ausstellen`
   - Format: `Zahlungseingänge Konto,5`

3. **Automatischer Versand**:
   - ✅ System sucht E-Mail-Adresse
   - ✅ Wenn gefunden: E-Mail wird automatisch versendet
   - ✅ Bestätigung wird angezeigt

4. **Prüfen**:
   - In Tabelle "Spendenquittungen" Versand-Status prüfen
   - Falls nicht versendet: Manuell nachversenden

### Manueller Nachversand

**Wann nötig**:
- Keine E-Mail-Adresse gefunden beim Ausstellen
- E-Mail-Adresse wurde nachträglich hinzugefügt
- Fehler beim automatischen Versand

**Vorgehen**:
1. `📊 Buchhaltung → Aktionen → 📧 Quittung per E-Mail versenden`
2. Quittungsnummer eingeben
3. E-Mail-Adresse eingeben
4. Bestätigen

## Fehlerbehandlung

### "E-Mail-Adresse nicht gefunden"

**Ursache**: Spender nicht in Mitglieder-Tabelle oder Name stimmt nicht überein.

**Lösung**:
1. Prüfe Mitglieder-Tabelle
2. Stelle sicher, dass Name übereinstimmt
3. Falls nicht vorhanden: Spender zur Mitglieder-Tabelle hinzufügen
4. Manuell nachversenden

### "Fehler beim Versenden der E-Mail"

**Ursache**: Ungültige E-Mail-Adresse, Netzwerkfehler, etc.

**Lösung**:
1. E-Mail-Adresse prüfen (korrekt formatierte E-Mail?)
2. Erneut versuchen
3. Bei wiederholten Fehlern: Kontakt mit Spender aufnehmen

### "E-Mail wurde nicht versendet, aber Adresse gefunden"

**Ursache**: Technischer Fehler beim Versenden.

**Lösung**:
1. Manuell nachversenden
2. Prüfe Gmail-Limits (max. 100 E-Mails/Tag)

## Best Practices

### 1. Mitglieder-Tabelle aktuell halten
✅ **Regelmäßig prüfen**: Sind alle Spender in der Mitglieder-Tabelle?
✅ **E-Mail-Adressen aktualisieren**: Bei Adressänderungen Tabelle aktualisieren

### 2. Versand-Status prüfen
✅ **Nach Quittungsausstellung**: In Tabelle "Spendenquittungen" Versand-Status prüfen
✅ **Regelmäßig prüfen**: Monatlich prüfen, ob alle Quittungen versendet wurden

### 3. Manueller Nachversand
✅ **Bei Bedarf**: Wenn automatischer Versand fehlschlägt, manuell nachversenden
✅ **Dokumentation**: Versand-Status immer in Tabelle dokumentiert

### 4. Testen
✅ **Erst testen**: Bei ersten Versuchen Test-E-Mail an sich selbst senden
✅ **Prüfen**: E-Mail-Format und Inhalt prüfen vor dem ersten Versand

## DSGVO & Datenschutz

### ✅ DSGVO-konform

- **E-Mail-Versand**: Nur mit gültiger E-Mail-Adresse
- **Opt-in**: Spender müssen E-Mail-Adresse freiwillig angegeben haben
- **Datenverarbeitung**: E-Mail-Adressen werden nur für Quittungsversand verwendet
- **Speicherung**: E-Mail-Adressen werden in Quittungstabelle dokumentiert

### ⚠️ Wichtige Hinweise

- **Einwilligung**: Stellen Sie sicher, dass Spender der E-Mail-Speicherung zugestimmt haben
- **Datenschutz**: E-Mail-Adressen sind sensible Daten - Zugriff beschränken
- **Löschung**: Bei Löschungsanfragen E-Mail-Adressen entfernen

## Gmail-Limits

⚠️ **WICHTIG**: Gmail hat tägliche Versand-Limits:

- **Kostenlose Google-Konten**: Max. 100 E-Mails pro Tag
- **Google Workspace**: Höhere Limits verfügbar

**Empfehlung**: Bei vielen Quittungen:
- Versand über mehrere Tage verteilen
- Oder Google Workspace-Account nutzen

## Technische Details

### E-Mail-Format
- **Plain Text**: E-Mail-Text ohne HTML
- **PDF-Anhang**: Professionelle Quittung als PDF-Datei
- **Logo**: Hoffnungsradler Logo im PDF eingebunden
- **Encoding**: UTF-8 für Umlaute

### Versand
- **Methode**: GmailApp.sendEmail()
- **Absender-Name**: "Hoffnungsradler Dülmen e.V."
- **Reply-To**: E-Mail-Adresse des aktiven Benutzers

### Name-Normalisierung
- Umlaute werden normalisiert (ä→ae, ö→oe, ü→ue)
- Groß-/Kleinschreibung wird ignoriert
- Leerzeichen werden normalisiert

## Häufige Fragen

### Q: Funktioniert automatischer Versand für alle Spender?

**A**: Nein, nur wenn Spender in der Mitglieder-Tabelle eingetragen sind und eine E-Mail-Adresse haben.

### Q: Kann ich E-Mail-Adressen nachträglich hinzufügen?

**A**: Ja, fügen Sie den Spender zur Mitglieder-Tabelle hinzu und versenden Sie die Quittung manuell nach.

### Q: Werden E-Mails automatisch versendet für alte Quittungen?

**A**: Nein, nur für neu ausgestellte Quittungen. Für alte Quittungen manuell nachversenden.

### Q: Kann ich die PDF-Vorlage anpassen?

**A**: Ja, die Funktion `generateReceiptPDF()` in `Code.gs` kann angepasst werden. Sie verwendet Google Docs API zum Erstellen des PDFs mit Logo.

### Q: Werden E-Mails für alle Spender versendet?

**A**: Nein, nur wenn eine E-Mail-Adresse gefunden wird. Für andere Spender muss Quittung manuell versendet werden (z.B. per Post).

