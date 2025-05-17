function processUnsubscriptions() {
  const threads = GmailApp.search('subject:"Newsletter-Abmeldung" is:unread', 0, 10);
  
  for (let i = 0; i < threads.length; i++) {
    const messages = threads[i].getMessages();
    
    for (let j = 0; j < messages.length; j++) {
      const message = messages[j];
      const body = message.getPlainBody();
      
      // E-Mail extrahieren
      const emailRegex = /E-Mail: ([\w.-]+@[\w.-]+\.\w+)/;
      const emailMatch = body.match(emailRegex);
      
      if (emailMatch && emailMatch[1]) {
        const email = emailMatch[1];
        updateSubscriberStatus(email, 'abgemeldet');
        message.markRead();
      }
    }
  }
}

function updateSubscriberStatus(email, status) {
  const sheetId = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
  const sheet = SpreadsheetApp.openById(sheetId).getSheetByName('Newsletter-Abonnenten');
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === email) {
      sheet.getRange(i + 1, 5).setValue(status);
      Logger.log(`Status von ${email} auf "${status}" geändert`);
      return true;
    }
  }
  
  return false;
}