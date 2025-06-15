/**
 * Zentrale Hilfsfunktionen für den Newsletter-Service
 */

/**
 * Validiert eine E-Mail-Adresse
 * @param {string} email
 * @return {boolean}
 */
function validateEmail(email) {
  // Einheitliche, robuste Regex
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  return emailRegex.test(email);
}

/**
 * Extrahiert eine E-Mail-Adresse aus einem beliebigen Text (z.B. Name <email> oder nur email)
 * @param {string} input
 * @return {string|null}
 */
function extractEmail(input) {
  if (!input) return null;
  // Format: Name <email@example.com>
  const angleRegex = /<([^<>]+)>$/;
  const angleMatch = input.match(angleRegex);
  if (angleMatch && angleMatch[1]) {
    const extractedEmail = angleMatch[1].trim();
    if (validateEmail(extractedEmail)) {
      return extractedEmail;
    }
  }
  // Format: email@example.com
  const simpleRegex = /\b([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})\b/;
  const simpleMatch = input.match(simpleRegex);
  if (simpleMatch && simpleMatch[1]) {
    const extractedEmail = simpleMatch[1].trim();
    if (validateEmail(extractedEmail)) {
      return extractedEmail;
    }
  }
  return null;
}

/**
 * Erstellt das Newsletter-Template (plain & html)
 * @param {Object} data - Muss mindestens tourDescription und unsubscribeLink enthalten
 * @param {string} personalVotingLink - Optionaler Link zur Abstimmung
 * @return {Object} - { plainBody, htmlBody }
 */
function getNewsletterTemplate(data, personalVotingLink) {
  let tourDescriptionHtml = (data.tourDescription || '').replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
  let tourDescriptionPlain = data.tourDescription || '';

  const buttonHtml = `
    <div style="margin: 30px 0 20px 0; text-align: center;">
      <a href="${personalVotingLink}" style="display:inline-block;padding:14px 28px;background:#ff9800;color:#fff;text-decoration:none;border-radius:8px;font-size:18px;font-weight:bold;">Jetzt abstimmen!</a>
    </div>
  `;

  // Platzhalter im HTML-Text ersetzen
  if (personalVotingLink) {
    tourDescriptionHtml = tourDescriptionHtml.replace(/\[abstimmungs_button\]/g, buttonHtml);
    tourDescriptionHtml = tourDescriptionHtml.replace(/\[abstimmungs_link\]/g, personalVotingLink);
  } else {
    // Falls kein Link da ist, die Platzhalter entfernen
    tourDescriptionHtml = tourDescriptionHtml.replace(/\[abstimmungs_button\]/g, '');
    tourDescriptionHtml = tourDescriptionHtml.replace(/\[abstimmungs_link\]/g, '');
  }

  // Platzhalter im Plain-Text ersetzen
  if (personalVotingLink) {
    tourDescriptionPlain = tourDescriptionPlain.replace(/\[abstimmungs_button\]/g, `Zur Abstimmung: ${personalVotingLink}`);
    tourDescriptionPlain = tourDescriptionPlain.replace(/\[abstimmungs_link\]/g, personalVotingLink);
  } else {
    tourDescriptionPlain = tourDescriptionPlain.replace(/\[abstimmungs_button\]/g, '');
    tourDescriptionPlain = tourDescriptionPlain.replace(/\[abstimmungs_link\]/g, '');
  }

  const plainBody =
    `Tour-Newsletter der Hoffnungsradler Dülmen\n\n` +
    `${tourDescriptionPlain}\n\n` +
    (data.signupLink ? `Zur Anmeldung: ${data.signupLink}\n\n` : '') +
    `Wir freuen uns auf deine Teilnahme!\n\n` +
    `Mit sportlichen Grüßen,\n` +
    `Das Team der Hoffnungsradler Dülmen\n\n` +
    `--\n` +
    `Du erhältst diese E-Mail, weil du dich für unseren Tour-Newsletter angemeldet hast.\n` +
    `Um dich abzumelden, besuche: ${data.unsubscribeLink}`;

  const signupButton = data.signupLink ? `
    <div style="margin: 30px 0 20px 0; text-align: center;">
      <a href="${data.signupLink}" style="display:inline-block;padding:14px 28px;background:#2E7D32;color:#fff;text-decoration:none;border-radius:8px;font-size:18px;font-weight:bold;">Hier unverbindlich zur Tour anmelden</a>
    </div>
  ` : '';

  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h1 style="color: #003366; text-align: center; border-bottom: 2px solid #003366; padding-bottom: 10px;">Tour-Newsletter der Hoffnungsradler Dülmen</h1>
      <div style="margin-top: 20px; line-height: 1.6;">
        ${tourDescriptionHtml}
      </div>
      ${signupButton}
      <p style="margin-top: 25px;">Wir freuen uns auf deine Teilnahme!</p>
      <p style="margin-top: 15px;">Mit sportlichen Grüßen,<br>Das Team der Hoffnungsradler Dülmen</p>
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; text-align: center;">
        <p>Du erhältst diese E-Mail, weil du dich für unseren Tour-Newsletter angemeldet hast.</p>
        <p>Um dich abzumelden, <a href="${data.unsubscribeLink}" style="color: #003366; text-decoration: underline;">klicke bitte hier</a>.</p>
      </div>
    </div>
  `;
  return {
    plainBody: plainBody,
    htmlBody: htmlBody
  };
}

/**
 * Listet alle aktuellen Trigger auf (Name, Typ, Zeit)
 */
function listAllTriggers() {
  const triggers = ScriptApp.getProjectTriggers();
  let msg = 'Aktive Trigger:\n';
  if (triggers.length === 0) {
    msg += 'Keine Trigger vorhanden.';
  } else {
    triggers.forEach(t => {
      msg += `Funktion: ${t.getHandlerFunction()} | Typ: ${t.getEventType()} | Nächste Ausführung: ${(t.getTriggerSourceId() || 'n/a')}\n`;
    });
  }
  Logger.log(msg);
  SpreadsheetApp.getUi().alert(msg);
}

/**
 * Gibt den aktuellen Versandstatus für den laufenden Newsletter-Versand zurück
 * (Wie viele E-Mails wurden im aktuellen Lauf bereits versendet?)
 */
function getNewsletterSendStatus() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const inputSheet = ss.getSheetByName('Newsletter_aktuell');
  const sheet = ss.getSheetByName('Newsletter-Abonnenten');
  if (!inputSheet || !sheet) {
    SpreadsheetApp.getUi().alert('Blätter nicht gefunden!');
    return;
  }
  const newsletterId = inputSheet.getRange('B15').getValue();
  const data = sheet.getDataRange().getValues();
  let sentCount = 0;
  for (let i = 1; i < data.length; i++) {
    if (data[i][7] == newsletterId && data[i][6] == 'erfolgreich') {
      sentCount++;
    }
  }
  SpreadsheetApp.getUi().alert(`Im aktuellen Versandlauf (Newsletter-ID: ${newsletterId}) wurden bisher ${sentCount} E-Mails erfolgreich versendet.`);
  Logger.log(`Im aktuellen Versandlauf (Newsletter-ID: ${newsletterId}) wurden bisher ${sentCount} E-Mails erfolgreich versendet.`);
}

/**
 * Prüft, wann der letzte Versandlauf war und ob das 24h-Limit überschritten ist
 */
function checkLastSendTimeAndQuota() {
  const ui = SpreadsheetApp.getUi();
  const scriptProperties = PropertiesService.getScriptProperties();
  let lastSend = scriptProperties.getProperty('LAST_SEND_TIMESTAMP');
  let msg = '';
  if (!lastSend) {
    // Alternativ: Aus dem Sheet lesen
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const inputSheet = ss.getSheetByName('Newsletter_aktuell');
    if (inputSheet) {
      lastSend = inputSheet.getRange('B11').getValue();
    }
  }
  if (lastSend) {
    const lastSendDate = new Date(lastSend);
    const now = new Date();
    const diffMs = now - lastSendDate;
    const diffH = diffMs / (1000 * 60 * 60);
    if (diffH < 24) {
      msg = `Achtung: Der letzte Versand war vor ${diffH.toFixed(1)} Stunden.\nDas Google-Limit erlaubt erst nach 24 Stunden einen neuen Massenversand.\nBitte warte noch ca. ${(24-diffH).toFixed(1)} Stunden.`;
    } else {
      msg = `Der letzte Versand war vor ${diffH.toFixed(1)} Stunden.\nDu kannst jetzt wieder einen neuen Versand starten.`;
    }
  } else {
    msg = 'Es konnte kein letzter Versandzeitpunkt ermittelt werden.';
  }
  ui.alert(msg);
  Logger.log(msg);
}

/**
 * Loggt den Versandzeitpunkt jeder E-Mail in das Blatt 'Versand_Log'
 */
function logNewsletterSendTimestamp() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let logSheet = ss.getSheetByName('Versand_Log');
  if (!logSheet) {
    logSheet = ss.insertSheet('Versand_Log');
    logSheet.appendRow(['Zeitstempel']);
  }
  logSheet.appendRow([new Date()]);
}

/**
 * Zeigt an, wie viele E-Mails in den letzten 24h versendet wurden und wie viele noch möglich sind
 */
function checkQuotaUsage() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const logSheet = ss.getSheetByName('Versand_Log');
  if (!logSheet) {
    SpreadsheetApp.getUi().alert('Kein Versand-Log gefunden.');
    return;
  }
  const data = logSheet.getRange(2, 1, logSheet.getLastRow()-1, 1).getValues();
  const now = new Date();
  const last24h = data.filter(row => {
    const ts = new Date(row[0]);
    return (now - ts) < 24*60*60*1000;
  });
  const quota = 100; // Standard-Limit für private Google-Konten
  const msg = `In den letzten 24 Stunden wurden ${last24h.length} E-Mails versendet.\nDu kannst aktuell noch ${quota - last24h.length} E-Mails verschicken (Limit: ${quota}/24h).`;
  SpreadsheetApp.getUi().alert(msg);
  Logger.log(msg);
}

/**
 * Archiviert das aktuelle Newsletter-Blatt, benennt die Kopie nach Nutzerwunsch und erhöht den Zähler in B15
 */
function archiveCurrentNewsletterSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Newsletter_aktuell');
  if (!sheet) {
    SpreadsheetApp.getUi().alert('Das Blatt "Newsletter_aktuell" wurde nicht gefunden!');
    return;
  }
  const ui = SpreadsheetApp.getUi();
  const response = ui.prompt('Newsletter archivieren', 'Wie soll das Archiv-Blatt heißen?', ui.ButtonSet.OK_CANCEL);
  if (response.getSelectedButton() !== ui.Button.OK) {
    return;
  }
  const archiveName = response.getResponseText().trim();
  if (!archiveName) {
    ui.alert('Bitte gib einen gültigen Namen ein!');
    return;
  }
  // Kopiere das Blatt
  const newSheet = sheet.copyTo(ss);
  newSheet.setName(archiveName);
  // Zähler in B15 erhöhen
  const counterCell = sheet.getRange('B15');
  let counter = parseInt(counterCell.getValue() || '0', 10);
  counterCell.setValue(counter + 1);
  ui.alert(`Das Blatt wurde als "${archiveName}" archiviert und der Zähler in B15 erhöht.`);
} 