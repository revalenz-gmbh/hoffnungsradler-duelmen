/**
 * Verbesserte Funktion zum manuellen Hinzufügen neuer E-Mail-Adressen zum Newsletter
 * Verwendet das GLEICHE Link-Format wie die Website-Anmeldungen
 */
function addManualSubscribers() {
  // Hier musst du deine Sheet-ID einsetzen
  const sheetId = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
  const ss = SpreadsheetApp.openById(sheetId);
  
  // Eingabeblatt für manuelle E-Mail-Adressen erstellen oder öffnen
  let manualInputSheet = ss.getSheetByName('Manuelle_Anmeldungen');
  if (!manualInputSheet) {
    manualInputSheet = ss.insertSheet('Manuelle_Anmeldungen');
    
    // Formatierung des Blattes
    manualInputSheet.setColumnWidth(1, 400); // Breitere Spalte für verschiedene E-Mail-Formate
    manualInputSheet.setColumnWidth(2, 200); // Spalte für extrahierte E-Mail
    manualInputSheet.setColumnWidth(3, 150); // Status-Spalte
    
    // Überschriften
    manualInputSheet.getRange('A1').setValue("Eingabe (Name <email> oder nur email)").setFontWeight('bold');
    manualInputSheet.getRange('B1').setValue("Extrahierte E-Mail").setFontWeight('bold');
    manualInputSheet.getRange('C1').setValue("Status").setFontWeight('bold');
    
    // Anweisungen
    manualInputSheet.getRange('A2:C2').merge()
      .setValue("Bitte trage E-Mail-Adressen in beliebigem Format ein (z.B. 'Max Mustermann <max@example.com>' oder einfach 'max@example.com'). " + 
                "Wähle dann 'Erweiterungen > Newsletter > Manuelle Adressen hinzufügen'.")
      .setWrap(true);
      
    manualInputSheet.setRowHeight(2, 40);
    
    // Ein paar leere Zeilen vorbereiten
    for (let i = 3; i < 13; i++) {
      manualInputSheet.getRange(`C${i}`).setValue("hinzufügen");
    }
  }
  
  // Frage nach Bestätigung
  const ui = SpreadsheetApp.getUi();
  const response = ui.alert(
    'Manuelle E-Mail-Adressen hinzufügen',
    'Möchtest du die im Blatt "Manuelle_Anmeldungen" eingetragenen E-Mail-Adressen zum Newsletter hinzufügen?\n\n' +
    'Diese werden automatisch in die Abonnentenliste übernommen und erhalten einen Abmelde-Link.',
    ui.ButtonSet.YES_NO
  );
  
  // Abbrechen, wenn der Benutzer nicht zustimmt
  if (response !== ui.Button.YES) {
    return;
  }
  
  // Daten aus dem Eingabeblatt lesen
  const emailData = manualInputSheet.getDataRange().getValues();
  const sheet = ss.getSheetByName('Newsletter-Abonnenten');
  
  // Prüfen, ob das Abonnenten-Blatt existiert
  if (!sheet) {
    ui.alert('Fehler', 'Das Blatt "Newsletter-Abonnenten" wurde nicht gefunden.', ui.ButtonSet.OK);
    return;
  }
  
  // Existierende E-Mail-Adressen laden, um Duplikate zu vermeiden
  const existingData = sheet.getDataRange().getValues();
  const existingEmails = existingData.map(row => row[0].toLowerCase());
  
  let addedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;
  
  // Durch alle Zeilen im Eingabeblatt iterieren (ab Zeile 3, nach den Anweisungen)
  for (let i = 3; i < emailData.length; i++) {
    const inputText = emailData[i][0];
    const status = emailData[i][2]; // Status jetzt in Spalte C
    
    // Nur fortfahren, wenn Eingabetext vorhanden ist und der Status "hinzufügen" ist
    if (inputText && status === "hinzufügen") {
      try {
        // E-Mail-Adresse aus dem Eingabetext extrahieren
        const cleanEmail = extractEmail(inputText);
        
        if (!cleanEmail) {
          manualInputSheet.getRange(i+1, 3).setValue("Fehler: Keine gültige E-Mail gefunden");
          errorCount++;
          continue;
        }
        
        // Extrahierte E-Mail in Spalte B anzeigen
        manualInputSheet.getRange(i+1, 2).setValue(cleanEmail);
        
        // Prüfen, ob die E-Mail bereits existiert
        if (existingEmails.includes(cleanEmail.toLowerCase())) {
          Logger.log(`E-Mail existiert bereits: ${cleanEmail}`);
          // Status auf "existiert bereits" setzen
          manualInputSheet.getRange(i+1, 3).setValue("existiert bereits");
          skippedCount++;
          continue;
        }
        
        // Eine eindeutige UUID generieren
        const subscriberId = Utilities.getUuid();
        
        // Abmelde-Link erstellen - JETZT IM GLEICHEN FORMAT WIE DIE WEBSITE
        // URL-Encoding der E-Mail-Adresse
        const encodedEmail = encodeURIComponent(cleanEmail);
        const unsubscribeLink = `https://www.hoffnungs-radler-duelmen.de/newsletter/abmelden?id=${subscriberId}&email=${encodedEmail}`;
        
        // Neuen Abonnenten hinzufügen
        sheet.appendRow([
          cleanEmail,
          new Date(), // Anmeldedatum
          subscriberId,
          unsubscribeLink,
          'aktiv',
          '' // Letzter Versand - leer für neue Abonnenten
        ]);
        
        // Status auf "hinzugefügt" setzen
        manualInputSheet.getRange(i+1, 3).setValue("hinzugefügt");
        
        Logger.log(`Neuer Abonnent hinzugefügt: ${cleanEmail}`);
        addedCount++;
        
      } catch (error) {
        Logger.log(`Fehler beim Hinzufügen von ${inputText}: ${error.message}`);
        // Status auf "Fehler" setzen
        manualInputSheet.getRange(i+1, 3).setValue("Fehler: " + error.message);
        errorCount++;
      }
    }
  }
  
  // Bestätigungs-Nachricht anzeigen
  ui.alert(
    'Vorgang abgeschlossen',
    `Ergebnis:\n${addedCount} E-Mail-Adressen hinzugefügt\n${skippedCount} übersprungen (bereits vorhanden)\n${errorCount} Fehler aufgetreten`,
    ui.ButtonSet.OK
  );
}

/**
 * Funktion zum Extrahieren einer E-Mail-Adresse aus verschiedenen Formaten
 * Unterstützt Formate wie "Name <email@example.com>" oder einfach "email@example.com"
 * 
 * @param {string} input - Der Eingabetext, der eine E-Mail-Adresse enthält
 * @return {string|null} - Die extrahierte E-Mail-Adresse oder null, wenn keine gefunden wurde
 */
function extractEmail(input) {
  if (!input) return null;
  
  // Verschiedene Formate überprüfen
  
  // Format: "Name <email@example.com>"
  const angleRegex = /<([^<>]+)>$/;
  const angleMatch = input.match(angleRegex);
  if (angleMatch && angleMatch[1]) {
    const extractedEmail = angleMatch[1].trim();
    return extractedEmail;
  }
  
  // Format: "email@example.com"
  const simpleRegex = /\b([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})\b/;
  const simpleMatch = input.match(simpleRegex);
  if (simpleMatch && simpleMatch[1]) {
    const extractedEmail = simpleMatch[1].trim();
    return extractedEmail;
  }
  
  // Wenn keine gültige E-Mail gefunden wurde
  return null;
}