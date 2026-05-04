/**
 * Öffnet das Blatt „Newsletter-Abonnenten“ wie bei Anmeldungen: zuerst SHEET_ID, sonst aktives Spreadsheet.
 * @return {GoogleAppsScript.Spreadsheet.Sheet|null}
 */
function getNewsletterSubscribersSheet_() {
  const sheetId = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
  if (sheetId && sheetId !== 'IHRE_SPREADSHEET_ID_HIER_EINFUEGEN') {
    try {
      const sh = SpreadsheetApp.openById(sheetId).getSheetByName('Newsletter-Abonnenten');
      if (sh) {
        return sh;
      }
    } catch (e) {
      Logger.log('getNewsletterSubscribersSheet_ extern: ' + e);
    }
  }
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    return ss ? ss.getSheetByName('Newsletter-Abonnenten') : null;
  } catch (e2) {
    Logger.log('getNewsletterSubscribersSheet_ aktiv: ' + e2);
    return null;
  }
}

/**
 * E-Mail aus Admin-Mail (EmailJS kann leicht abweichende Bezeichner nutzen).
 * @param {string} body
 * @return {string|null}
 */
function extractEmailFromNotificationBody_(body) {
  if (!body) {
    return null;
  }
  const patterns = [
    /E-Mail:\s*([\w.+-]+@[\w.-]+\.\w+)/i,
    /subscriber_email:\s*([\w.+-]+@[\w.-]+\.\w+)/i,
    /E-Mail-Adresse:\s*([\w.+-]+@[\w.-]+\.\w+)/i
  ];
  for (let p = 0; p < patterns.length; p++) {
    const m = body.match(patterns[p]);
    if (m && m[1]) {
      return m[1].trim();
    }
  }
  return null;
}

function processUnsubscriptions() {
  const threads = GmailApp.search('subject:"Newsletter-Abmeldung" is:unread', 0, 20);

  for (let i = 0; i < threads.length; i++) {
    const messages = threads[i].getMessages();

    for (let j = 0; j < messages.length; j++) {
      const message = messages[j];
      const body = message.getPlainBody();
      const email = extractEmailFromNotificationBody_(body);

      if (email) {
        const updated = updateSubscriberStatus(email, 'abgemeldet');
        if (updated) {
          Logger.log('Abmeldung verarbeitet: ' + email);
        } else {
          Logger.log('Abmeldung: E-Mail nicht in Liste: ' + email);
        }
        message.markRead();
      } else {
        Logger.log('Abmeldung: keine E-Mail im Text erkannt, Betreff: ' + message.getSubject());
      }
    }
  }
}

function updateSubscriberStatus(email, status) {
  const sheet = getNewsletterSubscribersSheet_();
  if (!sheet) {
    Logger.log('updateSubscriberStatus: Sheet „Newsletter-Abonnenten“ nicht gefunden.');
    return false;
  }

  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === email) {
      sheet.getRange(i + 1, 5).setValue(status);
      Logger.log('Status von ' + email + ' auf "' + status + '" geändert');
      return true;
    }
  }

  return false;
}
