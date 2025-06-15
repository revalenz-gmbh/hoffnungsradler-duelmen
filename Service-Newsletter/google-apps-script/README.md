# Google Apps Script – Newsletter-Service für Hoffnungsradler Dülmen

**Hinweis:** Dieses Verzeichnis wurde umbenannt zu `Service-Newsletter/google-app-script`, um die Struktur analog zu weiteren Bereichen wie Vereinsverwaltung und Spenden zu halten. Diese konsistente Benennung erleichtert die Wartung und spätere Erweiterung des Projekts.

Dieses Verzeichnis enthält alle Google Apps Script-Dateien, die den Newsletter-Versand und die Verwaltung der Abonnenten für die Hoffnungsradler-Webseite automatisieren.

## Benutzeranleitung für Vereinsmitglieder

### 1. Touren planen und dokumentieren

- Wähle im Menü **Tourplanung → Neues Blatt für Tourplanung anlegen**.
- Gib z.B. „Touren 2024“ als Namen ein. Es wird ein neues Tabellenblatt mit allen wichtigen Spalten erstellt:
  - **Datum, Wochentag, Uhrzeit, Titel, Treffpunkt, Geschwindigkeit, Beschreibung, Google Maps Link, Komoot Link, GPS Link, Tour Guide, Bemerkung, Teilnehmer, Bar-Spenden, Bilder-Link(s), Anmelde-Link**
- Trage jede geplante Tour als neue Zeile ein. Pflege nach der Tour die Teilnehmerzahl, Spendensumme und ggf. den Link zu den Bildern und zur Anmeldung nach.

### 2. Newsletter vorbereiten

- Öffne das Blatt **Newsletter_aktuell** (oder erstelle es über **Newsletter → Newsletter-Blatt erstellen/öffnen**).
- Trage in **B2** den Titel der Tour ein.
- Trage in **B3** die vollständige Beschreibung ein (inkl. Datum, Uhrzeit, Treffpunkt, Besonderheiten etc.).
- In **B15** steht die aktuelle Newsletter-ID (wird automatisch erhöht, wenn du den Newsletter archivierst).

### 3. Newsletter archivieren

- Vor dem Versand (oder nach dem Versand) wähle im Menü **Newsletter → Newsletter archivieren**.
- Gib einen Namen für das Archiv-Blatt ein (z.B. „Tour nach Weseke“). Das aktuelle Blatt wird kopiert und der Zähler in B15 erhöht.
- Du kannst jetzt „Newsletter_aktuell“ für den nächsten Newsletter überschreiben.

### 4. Newsletter versenden

- Wähle im Menü **Newsletter → Newsletter versenden**.
- Das System verschickt die E-Mails an alle aktiven Abonnenten (Quota-Limit beachten!).
- Der Versandstatus und die Newsletter-ID werden automatisch in der Tabelle „Newsletter-Abonnenten“ gepflegt.
- Über **Newsletter → Versandstatus anzeigen** siehst du, wie viele E-Mails im aktuellen Lauf erfolgreich versendet wurden.

### 5. Quota und Trigger überwachen

- Über **Newsletter → Quota-Status (24h) anzeigen** siehst du, wie viele E-Mails du im aktuellen 24h-Fenster noch versenden kannst.
- Über **Newsletter → Trigger anzeigen** kannst du prüfen, ob automatische Trigger für den nächsten Versandlauf gesetzt sind.

### 6. Anmelde-Link, Bilder und Spenden

- Trage im Touren-Blatt in die Spalte **Anmelde-Link** die URL zum Anmeldeformular ein (sobald vorhanden). Im Newsletter erscheint dann automatisch ein Anmelde-Button.
- In **Bilder-Link(s)** kannst du einen oder mehrere Links zu Fotos der Tour eintragen (z.B. Google Fotos, Nextcloud, Vereinswebseite).
- Die Spalte **Bar-Spenden** dient zur Dokumentation der bei der Tour gesammelten Spenden.

### 7. Tour-Abstimmung vorbereiten

Dieser Prozess besteht aus zwei Schritten: Zuerst werden die Links generiert, danach werden sie im Newsletter-Text verwendet.

**Schritt 1: Links generieren**
- Wähle im Menü **Newsletter → Personalisierte Abstimmungs-Links erstellen**.
- Du wirst aufgefordert, die vollständige URL zur Abstimmungsseite auf eurer Webseite zu bestätigen.
- Das Skript liest alle aktiven Abonnenten aus dem Blatt `Newsletter-Abonnenten` und erstellt ein neues Blatt namens `Abstimmungs-Links`. Dieses Blatt dient als Datenquelle für den Versand.

**Schritt 2: Platzhalter im Newsletter verwenden**
- Gehe zum Blatt `Newsletter_aktuell` und schreibe deinen Newsletter-Text in Zelle `B3`.
- Um den personalisierten Abstimmungs-Link einzufügen, hast du zwei Möglichkeiten:

  - **Als klickbaren Button (empfohlen):**
    Schreibe den Platzhalter `[abstimmungs_button]` genau an die Stelle, an der der Button erscheinen soll. Das Skript ersetzt diesen Text automatisch durch einen schön formatierten HTML-Button.

  - **Als reinen Text-Link:**
    Schreibe den Platzhalter `[abstimmungs_link]` in deinen Text. Dieser wird durch die klickbare URL ersetzt (z.B. `https://...`).

- Nach dem Versand wird für jeden Empfänger der Platzhalter durch seinen einzigartigen Link ersetzt.

### 8. Tipps & Hinweise

- Archiviere jeden Newsletter vor dem nächsten Versand, damit die Historie erhalten bleibt und der Zähler korrekt ist.
- Pflege die Touren-Tabelle möglichst vollständig – so können später Statistiken und die Webseite automatisiert daraus erstellt werden.
- Bei Fragen oder Problemen findest du weitere Hinweise in dieser README oder kannst dich an den Administrator wenden.

---

## Hauptfunktionen

- **Newsletter versenden** (Quota-sicher, mit Status und Fehlerbehandlung)
- **Testversand** (an beliebige E-Mail-Adresse)
- **Manuelles Hinzufügen von Abonnenten** (inkl. Abmelde-Link)
- **Automatische Verarbeitung von Anmeldungen per E-Mail**
- **Abmelde- und Fehler-Handling**
- **Menü-Integration in Google Sheets**
- **Generierung von personalisierten Abstimmungs-Links**

## Zentrale Dateien

- `onOpen.gs` – Erstellt das Menü in der Google Sheets Oberfläche.
- `SendNewletterToAllSubscribers.gs` – Hauptversandfunktion, Quota-Handling.
- `sendNewsletterTest.gs` – Testversand-Funktion.
- `addManualSubscribers.gs` – Manuelles Hinzufügen von Abonnenten.
- `code.gs` – Automatische Verarbeitung neuer Anmeldungen via E-Mail.
- `utils.gs` – Zentrale Hilfsfunktionen (E-Mail-Validierung, Template, Extraktion).
- `generateVotingLinks.gs` – Erstellt personalisierte Links für Umfragen/Abstimmungen.

## Bedienung

1. **Google Sheet öffnen** (mit den relevanten Blättern, z.B. `Newsletter-Abonnenten` und `Newsletter_aktuell`)
2. Über das Menü `Newsletter` folgende Aktionen nutzen:
   - Newsletter-Blatt erstellen/öffnen
   - Newsletter archivieren
   - Manuelle Adressen hinzufügen
   - Newsletter-Testversand
   - Newsletter versenden (Quota-sicher)
   - Personalisierte Abstimmungs-Links erstellen
   - Versandstatus anzeigen
   - Quota-Status (24h) anzeigen
   - Trigger anzeigen
   - Versand-24h-Check
   - Ungültige E-Mails deaktivieren

## Hinweise zur Anpassung

- Die Sheet-ID wird über die Script Properties verwaltet (`SHEET_ID`).
- Die zentrale E-Mail-Validierung und das Template befinden sich in `utils.gs` und sollten überall verwendet werden.
- Für eigene Anpassungen (z.B. Layout, Text) bitte nur die zentrale Template-Funktion in `utils.gs` anpassen.

## Fehlerbehandlung & Quota

- Das System erkennt und markiert ungültige E-Mail-Adressen automatisch.
- Bei Überschreitung des Google Quota-Limits wird der Versand automatisch am nächsten Tag fortgesetzt.

## Support & Weiterentwicklung

Für Fragen oder Erweiterungen bitte an den Entwickler wenden oder Issues im Hauptrepo anlegen.

## Zukunft / Weiterentwicklung

**Geplantes Entwicklungsziel:**

- Die geplanten Touren und alle relevanten Links (z.B. Google Maps, Komoot, GPS-Daten, Anmeldung, Bilder) sollen zentral in einem eigenen Tabellenblatt im Google Spreadsheet gepflegt werden.
- Der Newsletter (und perspektivisch auch die Webseite) liest diese Informationen automatisiert aus und stellt sie als übersichtliche Karten/Buttons dar.
- Damit greifen alle Systeme auf eine gemeinsame, stets aktuelle Datenbasis zu und die Pflege wird deutlich vereinfacht. 