# Google Apps Script – Newsletter-Service für Hoffnungsradler Dülmen

Dieses Verzeichnis enthält alle Google Apps Script-Dateien, die den Newsletter-Versand und die Verwaltung der Abonnenten für die Hoffnungsradler-Webseite automatisieren.

## Hauptfunktionen

- **Newsletter versenden** (Quota-sicher, mit Status und Fehlerbehandlung)
- **Testversand** (an beliebige E-Mail-Adresse)
- **Manuelles Hinzufügen von Abonnenten** (inkl. Abmelde-Link)
- **Automatische Verarbeitung von Anmeldungen per E-Mail**
- **Abmelde- und Fehler-Handling**
- **Menü-Integration in Google Sheets**

## Zentrale Dateien

- `SendNewletterToAllSubscribers.gs` – Hauptversandfunktion, Menü, Quota-Handling
- `sendNewsletterTest.gs` – Testversand-Funktion
- `addManualSubscribers.gs` – Manuelles Hinzufügen von Abonnenten
- `code.gs` – Automatische Verarbeitung neuer Anmeldungen
- `utils.gs` – Zentrale Hilfsfunktionen (E-Mail-Validierung, Template, Extraktion)

## Bedienung

1. **Google Sheet öffnen** (mit den relevanten Blättern, z.B. `Newsletter-Abonnenten` und `Newsletter_aktuell`)
2. Über das Menü `Newsletter` folgende Aktionen nutzen:
   - Newsletter-Blatt erstellen/öffnen
   - Manuelle Adressen hinzufügen
   - Newsletter-Testversand
   - Newsletter versenden (Quota-sicher)
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

- Die geplanten Touren und alle relevanten Links (z.B. Google Maps, Komoot, GPS-Daten) sollen zentral in einem eigenen Tabellenblatt im Google Spreadsheet gepflegt werden.
- Der Newsletter (und perspektivisch auch die Webseite) liest diese Informationen automatisiert aus und stellt sie als übersichtliche Karten/Buttons dar.
- Damit greifen alle Systeme auf eine gemeinsame, stets aktuelle Datenbasis zu und die Pflege wird deutlich vereinfacht. 