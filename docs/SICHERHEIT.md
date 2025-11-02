# 🔒 Sicherheits-Dokumentation

**Hoffnungsradler Dülmen e.V. - Buchhaltungssystem**

---

## Übersicht

Dieses Dokument beschreibt die Sicherheitsarchitektur des Buchhaltungssystems und erklärt, welche Daten öffentlich zugänglich sind und welche nicht.

---

## 🛡️ Sicherheitsarchitektur

### Zwei-Schichten-Modell

```
┌─────────────────────────────────────────────────┐
│  ÖFFENTLICHE EBENE (Website API)                │
│  ✅ Nur aggregierte, nicht-personenbezogene Daten│
│  ✅ Nur Lesezugriff                             │
│  ✅ Für Website-Besucher                        │
└─────────────────────────────────────────────────┘
                       ▲
                       │ HTTPS
                       │ Read-Only
                       │
┌─────────────────────────────────────────────────┐
│  PRIVATE EBENE (Google Spreadsheet)             │
│  🔒 Personenbezogene Daten (IBANs, Namen)       │
│  🔒 Vollzugriff (Lesen, Schreiben, Löschen)     │
│  🔒 Nur für autorisierte Vereinsmitglieder      │
└─────────────────────────────────────────────────┘
```

---

## 📊 Öffentliche API-Endpunkte

Diese Endpunkte sind für die Website und können von jedem abgerufen werden:

### ✅ `getDashboard`
**Zweck:** Zeigt aktuelle Finanzkennzahlen für das Dashboard

**Response:**
```json
{
  "year": 2025,
  "einnahmen": {
    "konto": { "anzahl": 15, "summe": 3500.00 },
    "bargeld": { "anzahl": 8, "summe": 1500.00 },
    "gesamt": 5000.00
  },
  "ausgaben": {
    "allgemein": { "anzahl": 3, "summe": 200.00 },
    "uebergeben": { "anzahl": 0, "summe": 0 },
    "gesamt": 200.00
  },
  "saldo": 4800.00
}
```

**Sicherheit:** ✅ Sicher - Keine personenbezogenen Daten

---

### ✅ `getUebergabeSummen`
**Zweck:** Zeigt übergebene Spenden pro Jahr für die Website

**Response:**
```json
{
  "summen": {
    "2024": 7000,
    "2023": 13000,
    "2022": 4000
  },
  "gesamt": 91055
}
```

**Sicherheit:** ✅ Sicher - Nur aggregierte Jahreszahlen

---

### ✅ `getAllYearlyData`
**Zweck:** Zeigt alle Jahres-Spendendaten für Diagramme

**Response:**
```json
{
  "donations": [
    { "year": 2025, "amount": 4982 },
    { "year": 2024, "amount": 7000 }
  ],
  "totalDonations": 91055,
  "currentYear": 2025
}
```

**Sicherheit:** ✅ Sicher - Nur Jahreszahlen, öffentlich auf Website

---

### ⚠️ `getJahresabschluss`
**Zweck:** Zeigt Jahresabschluss für ein bestimmtes Jahr

**Response:**
```json
{
  "jahr": 2025,
  "einnahmen": { "gesamt": 5000 },
  "ausgaben": { "gesamt": 200 },
  "saldo": 4800,
  "quittungen": { "gesamt": 13 }
}
```

**Sicherheit:** ⚠️ Teilweise sensibel - Zeigt finanzielle Details
**Empfehlung:** Könnte später durch API-Key geschützt werden

---

## 🚫 Blockierte Endpunkte

Diese Endpunkte sind **NICHT** öffentlich verfügbar:

### ❌ `getDonations` (BLOCKIERT)
**Warum blockiert?**
Würde personenbezogene Daten zurückgeben:
- Namen der Spender
- IBANs
- E-Mail-Adressen
- Einzelbeträge mit Zuordnung zu Personen

**Response:**
```json
{
  "error": "Dieser Endpunkt ist aus Datenschutzgründen nicht öffentlich verfügbar."
}
```

**Status Code:** 403 Forbidden

---

### ❌ Alle POST-Endpunkte (BLOCKIERT)
**Warum blockiert?**
Schreib-Operationen über öffentliche API sind zu riskant:
- Manipulation von Daten möglich
- Keine Authentifizierung
- Audit-Trail fehlt

**Betroffene Operationen:**
- `addDonation` - Spende hinzufügen
- `issueReceipt` - Quittung ausstellen
- Alle anderen Schreib-Operationen

**Response:**
```json
{
  "error": "POST-Operationen sind aus Sicherheitsgründen nicht über die öffentliche API verfügbar."
}
```

**Status Code:** 403 Forbidden

**Alternative:** Alle Schreib-Operationen erfolgen direkt im Google Spreadsheet

---

## 🔐 Datenschutz & DSGVO

### Personenbezogene Daten

Das System verarbeitet folgende personenbezogene Daten:

**Im Spreadsheet (PRIVAT):**
- ✅ Namen von Spendern
- ✅ IBANs
- ✅ E-Mail-Adressen (optional)
- ✅ Beträge mit Zuordnung zu Personen
- ✅ Verwendungszwecke

**Über öffentliche API (NIEMALS):**
- ❌ Keine Namen
- ❌ Keine IBANs
- ❌ Keine E-Mail-Adressen
- ❌ Keine Zuordnung Betrag ↔ Person

**Nur aggregierte Daten:**
- ✅ Gesamtsummen
- ✅ Anzahl Spenden (ohne Namen)
- ✅ Jahreszahlen

---

## 🛡️ Zugriffskontrolle

### Google Spreadsheet

**Wer hat Zugriff?**
- ✅ Schatzmeister (Voll-Zugriff)
- ✅ Vorstand (Lese-Zugriff oder Voll-Zugriff)
- ❌ Niemand sonst

**Wie wird Zugriff gewährt?**
1. Google Sheets → Freigeben
2. E-Mail des Nutzers eingeben
3. Berechtigung festlegen:
   - **Bearbeiter** - Kann alles ändern
   - **Kommentator** - Kann nur kommentieren
   - **Betrachter** - Kann nur lesen

**Empfehlung:**
- Schatzmeister: Bearbeiter
- Vorstand: Betrachter oder Bearbeiter
- Kassenprüfer: Betrachter

---

### Google Apps Script

**Wer kann das Script ändern?**
- Nur der Besitzer des Spreadsheets
- Andere Nutzer können es NICHT ändern, auch wenn sie Spreadsheet-Zugriff haben

**Deployment:**
- **Ausführen als:** "Ich" (Besitzer)
- **Zugriff:** "Jeder" (für öffentliche API-Endpunkte)

**Bedeutung:**
- Script läuft immer unter dem Account des Besitzers
- Andere können nur die freigegebenen API-Endpunkte nutzen
- Spreadsheet-Daten bleiben geschützt

---

## 🔒 Best Practices

### Für Administratoren

1. **Starke Passwörter**
   - ✅ Google-Account mit starkem Passwort schützen
   - ✅ Mindestens 12 Zeichen
   - ✅ Groß-/Kleinbuchstaben, Zahlen, Sonderzeichen

2. **2-Faktor-Authentifizierung**
   - ✅ Unbedingt aktivieren!
   - ✅ Google Authenticator App nutzen
   - ✅ Backup-Codes sicher aufbewahren

3. **Regelmäßige Überprüfung**
   - ✅ Monatlich prüfen: Wer hat Zugriff auf Spreadsheet?
   - ✅ Alte Zugriffe entfernen
   - ✅ Bei Vorstandswechsel: Neue Berechtigungen vergeben

4. **Backups**
   - ✅ Wöchentlich: Export als Excel
   - ✅ Monatlich: Vollständiges Backup
   - ✅ Backups verschlüsselt speichern

5. **Audit-Trail**
   - ✅ Versionsverlauf nutzen (Google Sheets)
   - ✅ Bei wichtigen Änderungen: Kommentar hinzufügen
   - ✅ Änderungen dokumentieren

---

### Für Nutzer

1. **Google-Account sichern**
   - ✅ Starkes Passwort
   - ✅ 2FA aktivieren
   - ✅ Verdächtige Aktivitäten melden

2. **Vorsicht bei Freigaben**
   - ❌ Nie Spreadsheet öffentlich machen
   - ❌ Nie Links per E-Mail weitergeben
   - ✅ Nur an vertrauenswürdige Personen

3. **DSGVO beachten**
   - ✅ Nur notwendige Daten erfassen
   - ✅ Daten nach Zweck löschen
   - ✅ Bei Anfragen: Auskunft erteilen

4. **Physische Sicherheit**
   - ✅ Computer sperren bei Abwesenheit
   - ✅ Nicht in öffentlichen WLANs ohne VPN
   - ✅ Keine Screenshots von sensiblen Daten

---

## ⚠️ Risiken & Gegenmaßnahmen

### Risiko 1: Unbefugter Zugriff auf Spreadsheet

**Wie könnte es passieren?**
- Passwort wurde gestohlen
- Account wurde gehackt
- Jemand hat Computer unbeaufsichtigt genutzt

**Gegenmaßnahmen:**
- ✅ 2FA aktivieren (verhindert 99% der Angriffe)
- ✅ Starkes Passwort
- ✅ Computer immer sperren
- ✅ Regelmäßig Zugriffe prüfen

**Im Notfall:**
1. Google-Passwort sofort ändern
2. Alle aktiven Sitzungen beenden
3. Spreadsheet-Freigaben prüfen
4. Bei Bedarf: Neues Spreadsheet erstellen

---

### Risiko 2: API-URL wird öffentlich bekannt

**Wie könnte es passieren?**
- URL wurde versehentlich geteilt
- URL ist in öffentlichem GitHub-Repo
- Jemand hat die URL erraten

**Auswirkung:**
- ⚠️ Geringe Auswirkung
- Nur aggregierte Daten sind abrufbar
- Keine personenbezogenen Daten

**Gegenmaßnahmen:**
- ✅ URL nicht öffentlich teilen
- ✅ Nur in privaten Repos oder .env-Dateien
- ✅ Bei Bedarf: Neue Deployment erstellen (neue URL)

**Im Notfall:**
1. Apps Script Editor öffnen
2. Neue Bereitstellung erstellen
3. Alte Bereitstellung deaktivieren
4. Neue URL in Website aktualisieren

---

### Risiko 3: CSV-Import mit falschen Daten

**Wie könnte es passieren?**
- Falsche CSV-Datei importiert
- Daten wurden manipuliert
- Versehentliche Duplikate

**Auswirkung:**
- ⚠️ Mittlere Auswirkung
- Falsche Zahlen im Dashboard
- Mögliche Fehler bei Jahresabschluss

**Gegenmaßnahmen:**
- ✅ Immer CSV-Datei vor Import prüfen
- ✅ Nach Import: Daten überprüfen
- ✅ Versionsverlauf nutzen (Wiederherstellung möglich)

**Im Notfall:**
1. Datei → Versionsverlauf
2. Version vor Import auswählen
3. Wiederherstellen
4. Korrekten Import durchführen

---

## 📋 Sicherheits-Checkliste

### Bei Einrichtung

- [ ] Google-Account mit starkem Passwort gesichert
- [ ] 2-Faktor-Authentifizierung aktiviert
- [ ] Spreadsheet nur für autorisierte Personen freigegeben
- [ ] Apps Script deployed als Web-App
- [ ] API-URL in .env gespeichert (nicht öffentlich)
- [ ] Erste Backups erstellt

### Monatlich

- [ ] Spreadsheet-Zugriffe überprüft
- [ ] Backup erstellt
- [ ] Daten auf Plausibilität geprüft
- [ ] Keine ungewöhnlichen Aktivitäten

### Jährlich

- [ ] Passwort geändert
- [ ] Alle Zugriffe neu bewertet
- [ ] Alte Daten archiviert
- [ ] Sicherheitsrichtlinien aktualisiert

### Bei Vorstandswechsel

- [ ] Neue Vorstandsmitglieder: Zugriff gewähren
- [ ] Alte Vorstandsmitglieder: Zugriff entziehen
- [ ] Passwörter ändern (falls nötig)
- [ ] Übergabe dokumentieren

---

## 🆘 Notfall-Kontakte

### Bei Sicherheitsvorfall

1. **Sofort:** Google-Passwort ändern
2. **Kontaktieren:**
   - Vorstand
   - IT-Verantwortlicher (falls vorhanden)
   - Bei Datenleck: Datenschutzbeauftragter

3. **Dokumentieren:**
   - Was ist passiert?
   - Wann ist es passiert?
   - Welche Daten betroffen?
   - Welche Maßnahmen ergriffen?

---

## 📞 Support

Bei Sicherheitsfragen:
- **E-Mail:** [Vereins-E-Mail]
- **Telefon:** [Vorstand]
- **Notfall:** Sofort Vorstand kontaktieren

---

## 🔄 Changelog

### Version 1.0 (März 2025)
- Initial release
- `getDonations` blockiert
- POST-Endpunkte blockiert
- Dokumentation erstellt

---

**Hoffnungsradler Dülmen e.V.**  
*Sicherheit hat Priorität.*

