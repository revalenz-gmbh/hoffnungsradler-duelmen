function processNewSubscriptions() {
  Logger.log("Suche nach neuen Anmeldungen...");
  
  // Betreff angepasst an das tatsächliche Email-Template
  const threads = GmailApp.search('subject:"Neue Tour-Newsletter Anmeldung!" is:unread', 0, 10);
  Logger.log("Gefundene E-Mails: " + threads.length);
  
  if (threads.length === 0) {
    Logger.log("Keine ungelesenen E-Mails mit dem Betreff 'Neue Tour-Newsletter Anmeldung!' gefunden.");
    return;
  }
  
  for (let i = 0; i < threads.length; i++) {
    const messages = threads[i].getMessages();
    
    for (let j = 0; j < messages.length; j++) {
      const message = messages[j];
      Logger.log("Verarbeite E-Mail: " + message.getSubject());
      processSubscriptionEmail(message);
    }
  }
}

function processSubscriptionEmail(message) {
  const body = message.getPlainBody();
  Logger.log("E-Mail-Inhalt: " + body);
  
  // Verbesserte Regex-Ausdrücke, die besser mit dem EmailJS-Format übereinstimmen
  const emailRegex = /E-Mail:\s+([\w.-]+@[\w.-]+\.\w+)/i;
  const linkRegex = /Abmelde-Link:\s+(https:\/\/[^\s\n]+)/i;
  const idRegex = /Abonnenten-ID:\s+([a-f0-9-]+)/i;
  
  const emailMatch = body.match(emailRegex);
  const linkMatch = body.match(linkRegex);
  const idMatch = body.match(idRegex);
  
  if (emailMatch && emailMatch[1]) {
    const subscriberEmail = emailMatch[1].trim();
    const unsubscribeLink = linkMatch && linkMatch[1] ? linkMatch[1].trim() : "";
    const subscriberId = idMatch && idMatch[1] ? idMatch[1].trim() : "unbekannt";
    
    Logger.log("Extrahierte E-Mail: " + subscriberEmail);
    Logger.log("Extrahierter Link: " + unsubscribeLink);
    Logger.log("Extrahierte ID: " + subscriberId);
    
    // Abonnent ins Sheet speichern
    saveSubscriberToSheet(subscriberEmail, subscriberId, unsubscribeLink);
    
    // Bestätigungsmail senden
    try {
      // Verwendung der Template-Funktion
      const emailTemplate = getSubscriptionConfirmationEmail(subscriberEmail, unsubscribeLink);
      
      // Bestätigungs-E-Mail senden mit verbesserter UTF-8-Unterstützung
      GmailApp.sendEmail(
        emailTemplate.to,
        emailTemplate.subject,
        emailTemplate.plainBody,
        { 
          htmlBody: emailTemplate.htmlBody,
          name: "Hoffnungsradler Dülmen",
          replyTo: "hoffnungsradlerweb@gmail.com"
        }
      );
      
      Logger.log("E-Mail erfolgreich gesendet!");
    } catch (error) {
      Logger.log("Fehler beim Senden der E-Mail: " + error.message);
    }
    
    // Als gelesen markieren
    message.markRead();
  } else {
    Logger.log("E-Mail-Informationen konnten nicht extrahiert werden.");
    Logger.log("Email Regex Match: " + JSON.stringify(emailMatch));
  }
}

function saveSubscriberToSheet(email, subscriberId, unsubscribeLink) {
  // Hier musst du deine Sheet-ID einsetzen
  const sheetId = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
  const sheet = SpreadsheetApp.openById(sheetId).getSheetByName('Newsletter-Abonnenten');
  
  // Überprüfen, ob die E-Mail bereits existiert
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === email) {
      Logger.log("E-Mail existiert bereits: " + email);
      return; // E-Mail existiert bereits, nichts tun
    }
  }
  
  // Neue Zeile hinzufügen
  sheet.appendRow([
    email,
    new Date(), // Anmeldedatum
    subscriberId,
    unsubscribeLink,
    'aktiv',
    '', // Letzter Versand - leer für neue Abonnenten
    '', // Sendestatus - leer für neue Abonnenten
    '' // Newsletter-ID - leer für neue Abonnenten  
  ]);
  
  Logger.log("Neuer Abonnent hinzugefügt: " + email);
}

function getSubscriptionConfirmationEmail(email, unsubscribeLink) {
  return {
    to: email,
    subject: "Bestätigung: Tour-Newsletter Anmeldung - Hoffnungsradler Dülmen",
    plainBody: "Vielen Dank für deine Anmeldung zum Tour-Newsletter der Hoffnungsradler Dülmen!\n\n" +
      "Du wirst künftig Informationen zu unseren geplanten Touren erhalten.\n\n" +
      "Falls du den Newsletter abbestellen möchtest, kannst du jederzeit diesen Link verwenden:\n" + 
      unsubscribeLink,
    htmlBody: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2E7D32; font-size: 24px; margin-bottom: 10px;">
              <span style="background-color: #4CAF50; color: white; padding: 5px 10px; border-radius: 15px; font-size: 14px; margin-right: 10px;">RADTOUR</span>
              Hoffnungsradler Dülmen
            </h1>
            <div style="width: 50px; height: 3px; background-color: #4CAF50; margin: 0 auto;"></div>
          </div>
          
          <h2 style="color: #2E7D32; font-size: 20px;">Willkommen bei den Hoffnungsradlern!</h2>
          
          <p>Hallo,</p>
          
          <p>vielen Dank für deine Anmeldung zum Tour-Newsletter der Hoffnungsradler Dülmen!</p>
          
          <p>Du wirst künftig Informationen zu unseren geplanten Touren erhalten.</p>
          
          <p>Mit freundlichen Grüßen,<br>
          Das Team der Hoffnungsradler Dülmen</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 14px; color: #666; text-align: center;">
            <p>Falls du den Newsletter abbestellen möchtest, kannst du jederzeit <a href="${unsubscribeLink}" style="color: #2E7D32; text-decoration: none;">diesen Link verwenden</a>.</p>
          </div>
        </div>
      </div>
    `
  };
}

function createNewsletterSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Erstellen eines Eingabe-Blattes für die Newsletter-Daten
  let inputSheet = ss.getSheetByName('Newsletter_aktuell');
  if (!inputSheet) {
    inputSheet = ss.insertSheet('Newsletter_aktuell');
    
    // Formatieren des Eingabeblattes
    inputSheet.setColumnWidth(1, 150);
    inputSheet.setColumnWidth(2, 600);
    
    // Überschriften
    inputSheet.getRange('A1').setValue("TOUR-NEWSLETTER").setFontWeight('bold');
    inputSheet.getRange('A1:B1').merge().setBackground('#f3f3f3').setHorizontalAlignment('center');
    
    inputSheet.getRange('A2').setValue("Tour-Titel:").setFontWeight('bold');
    
    inputSheet.getRange('A3').setValue("Beschreibung:").setFontWeight('bold');
    inputSheet.getRange('B3').setValue("").setWrap(true);
    inputSheet.setRowHeight(3, 200);  // Höhe für Beschreibung
    
    inputSheet.getRange('A4').setValue("Datum und Uhrzeit:").setFontWeight('bold');
    
    inputSheet.getRange('A5').setValue("Treffpunkt:").setFontWeight('bold');
    
    // Anweisung und Menü-Hinweis
    inputSheet.getRange('A7:B7').merge().setValue("Fülle alle Felder aus und wähle dann 'Erweiterungen > Newsletter > Newsletter versenden'.");
    
    // Statistik-Bereich
    inputSheet.getRange('A10').setValue("STATISTIK").setFontWeight('bold');
    inputSheet.getRange('A10:B10').merge().setBackground('#f3f3f3').setHorizontalAlignment('center');
    
    inputSheet.getRange('A11').setValue("Versanddatum:").setFontWeight('bold');
    inputSheet.getRange('A12').setValue("Anzahl Empfänger:").setFontWeight('bold');
    inputSheet.getRange('A13').setValue("Status:").setFontWeight('bold');
  }
  
  Browser.msgBox("Newsletter erstellen", 
      "Bitte trage alle Tour-Details im Blatt 'Newsletter_aktuell' ein.\n\n" +
      "Wenn du den Newsletter versenden möchtest, wähle 'Erweiterungen > Newsletter > Newsletter versenden'.\n\n" +
      "Um frühere Newsletter zu archivieren, kannst du vor dem Senden das Blatt duplizieren und umbenennen.", 
      Browser.Buttons.OK);
}

/**
 * Stellt sicher, dass alle benötigten Spalten in der Newsletter-Abonnenten Tabelle existieren
 * @param {Sheet} sheet - Das Newsletter-Abonnenten Tabellenblatt
 */
function ensureVotingLinkColumnInSubscriberSheet(sheet) {
  const data = sheet.getDataRange().getValues();
  if (data.length === 0) return; // Leere Tabelle
  
  const headers = data[0];
  const expectedHeaders = [
    'Email', 
    'Anmeldedatum', 
    'SubscriberID', 
    'Abmelde-Link', 
    'Status', 
    'Letzter Versand',
    'Sendestatus',
    'Newsletter-ID'
  ];
  
  let columnAdded = false;
  
  // Prüfe und füge fehlende Header hinzu
  for (let i = 0; i < expectedHeaders.length; i++) {
    const expectedHeader = expectedHeaders[i];
    
    if (i >= headers.length || headers[i] !== expectedHeader) {
      // Header fehlt oder ist an falscher Position
      const columnIndex = i + 1;
      
      // Neue Spalte einfügen
      sheet.insertColumnAfter(Math.max(0, i));
      sheet.getRange(1, columnIndex).setValue(expectedHeader).setFontWeight('bold');
      
      // Spaltenbreite setzen
      if (expectedHeader === 'Abmelde-Link') {
        sheet.setColumnWidth(columnIndex, 300);
      } else if (expectedHeader === 'Email') {
        sheet.setColumnWidth(columnIndex, 200);
      } else {
        sheet.setColumnWidth(columnIndex, 150);
      }
      
      columnAdded = true;
      Logger.log(`Spalte "${expectedHeader}" wurde hinzugefügt.`);
      
      // Aktualisiere headers Array für nächste Iteration
      headers.splice(i, 0, expectedHeader);
    }
  }
  
  if (columnAdded) {
    Logger.log('Newsletter-Abonnenten Tabelle wurde aktualisiert.');
  }
}