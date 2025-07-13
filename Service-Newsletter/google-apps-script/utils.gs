/**
 * Hilfsfunktionen für den Newsletter-Service
 */

/**
 * Zählt die Anzahl der aktiven Abonnenten
 * @param {Array} data - Die Daten aus dem Abonnenten-Sheet
 * @return {number} - Anzahl der aktiven Abonnenten
 */
function countActiveSubscribers(data) {
  let count = 0;
  for (let i = 1; i < data.length; i++) {
    if (data[i][4] === 'aktiv') {
      // Prüfen, ob eine Status-Spalte existiert und der Eintrag als ungültig markiert ist
      const sendStatus = data[i][6] || "";
      if (sendStatus !== 'ungültig') {
        count++;
      }
    }
  }
  return count;
}

/**
 * Stellt sicher, dass eine Spalte für den Sendestatus existiert
 * @param {Sheet} sheet - Das Tabellenblatt
 * @param {Array} data - Die Daten aus dem Tabellenblatt
 */
function ensureStatusColumnExists(sheet, data) {
  if (data[0].length < 7) {
    // Neue Überschrift für die Sendestatus-Spalte hinzufügen
    sheet.getRange(1, 7).setValue("Sendestatus");
  }
}

/**
 * Prüft, ob die Fehlermeldung auf eine ungültige E-Mail-Adresse hinweist
 * @param {string} errorMessage - Die Fehlermeldung
 * @return {boolean} - True, wenn es sich um einen Fehler mit ungültiger E-Mail handelt
 */
function isInvalidEmailError(errorMessage) {
  // Typische Fehlermeldungen bei ungültigen E-Mail-Adressen
  const invalidPatterns = [
    "Address not found",
    "Email address not found",
    "The email address was not found",
    "not a valid email",
    "Invalid email address",
    "Recipient address rejected",
    "User unknown",
    "No such user",
    "User doesn't exist",
    "Mailbox not found",
    "Mailbox unavailable",
    "Mailbox doesn't exist",
    "Domain not found",
    "Domain doesn't exist",
    "Host or domain name not found",
    "Bad destination mailbox address",
    "550"  // Häufiger SMTP-Fehlercode für nicht existierende Adresse
  ];
  
  // Prüfen, ob die Fehlermeldung eine der bekannten Muster enthält
  return invalidPatterns.some(pattern => errorMessage.includes(pattern));
}

/**
 * Erstellt sichere Trigger mit Fehlerbehandlung
 * @param {string} functionName - Name der Funktion, die ausgeführt werden soll
 * @param {Date} triggerTime - Zeitpunkt der Ausführung
 * @return {GoogleAppsScript.Script.Trigger} - Der erstellte Trigger
 */
function createSafeTrigger(functionName, triggerTime) {
  try {
    // Prüfe, ob bereits ein Trigger für diese Funktion existiert
    const triggers = ScriptApp.getProjectTriggers();
    for (let i = 0; i < triggers.length; i++) {
      if (triggers[i].getHandlerFunction() === functionName) {
        // Lösche alten Trigger
        ScriptApp.deleteTrigger(triggers[i]);
        Logger.log(`Alter Trigger für ${functionName} wurde gelöscht`);
      }
    }
    
    // Erstelle neuen Trigger
    const trigger = ScriptApp.newTrigger(functionName)
      .timeBased()
      .at(triggerTime)
      .create();
    
    Logger.log(`Neuer Trigger für ${functionName} erstellt für ${triggerTime}`);
    return trigger;
    
  } catch (error) {
    Logger.log(`Fehler beim Erstellen des Triggers für ${functionName}: ${error.message}`);
    throw error;
  }
}

/**
 * Installiert einen Monitoring-Trigger für die regelmäßige Verarbeitung neuer Anmeldungen
 */
function installMonitoringTrigger() {
  try {
    // Prüfe, ob bereits ein Trigger für processNewSubscriptions existiert
    const triggers = ScriptApp.getProjectTriggers();
    let triggerExists = false;
    
    for (let i = 0; i < triggers.length; i++) {
      if (triggers[i].getHandlerFunction() === 'processNewSubscriptions') {
        triggerExists = true;
        break;
      }
    }
    
    if (!triggerExists) {
      // Erstelle Trigger für alle 10 Minuten
      const trigger = ScriptApp.newTrigger('processNewSubscriptions')
        .timeBased()
        .everyMinutes(10)
        .create();
      
      Logger.log('Monitoring-Trigger für processNewSubscriptions wurde erstellt');
      SpreadsheetApp.getUi().alert(
        'Trigger installiert',
        'Der Monitoring-Trigger wurde erfolgreich installiert. Neue Anmeldungen werden jetzt alle 10 Minuten automatisch verarbeitet.',
        SpreadsheetApp.getUi().ButtonSet.OK
      );
    } else {
      SpreadsheetApp.getUi().alert(
        'Trigger bereits vorhanden',
        'Der Monitoring-Trigger ist bereits installiert und aktiv.',
        SpreadsheetApp.getUi().ButtonSet.OK
      );
    }
    
  } catch (error) {
    Logger.log('Fehler beim Installieren des Monitoring-Triggers: ' + error.message);
    SpreadsheetApp.getUi().alert(
      'Fehler',
      'Fehler beim Installieren des Monitoring-Triggers: ' + error.message,
      SpreadsheetApp.getUi().ButtonSet.OK
    );
  }
}

/**
 * Zeigt detaillierten Trigger-Status an
 */
function showDetailedTriggerStatus() {
  const triggers = ScriptApp.getProjectTriggers();
  let statusMessage = "Aktive Trigger:\n\n";
  
  if (triggers.length === 0) {
    statusMessage += "Keine aktiven Trigger gefunden.";
  } else {
    for (let i = 0; i < triggers.length; i++) {
      const trigger = triggers[i];
      const triggerSource = trigger.getTriggerSource();
      const eventType = trigger.getEventType();
      const handlerFunction = trigger.getHandlerFunction();
      
      statusMessage += `${i + 1}. Funktion: ${handlerFunction}\n`;
      statusMessage += `   Quelle: ${triggerSource}\n`;
      statusMessage += `   Ereignis: ${eventType}\n`;
      statusMessage += `   ID: ${trigger.getUniqueId()}\n\n`;
    }
  }
  
  SpreadsheetApp.getUi().alert(
    'Trigger-Status',
    statusMessage,
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

/**
 * Listet alle Trigger auf (einfache Ansicht)
 */
function listAllTriggers() {
  const triggers = ScriptApp.getProjectTriggers();
  let message = "Aktive Trigger:\n\n";
  
  if (triggers.length === 0) {
    message += "Keine aktiven Trigger gefunden.";
  } else {
    for (let i = 0; i < triggers.length; i++) {
      message += `${i + 1}. ${triggers[i].getHandlerFunction()}\n`;
    }
  }
  
  SpreadsheetApp.getUi().alert('Trigger-Liste', message, SpreadsheetApp.getUi().ButtonSet.OK);
}

/**
 * Loggt den Newsletter-Versand-Zeitstempel
 */
function logNewsletterSendTimestamp() {
  const scriptProperties = PropertiesService.getScriptProperties();
  const currentTime = new Date().toISOString();
  
  // Speichere den aktuellen Versand-Zeitstempel
  scriptProperties.setProperty('LAST_NEWSLETTER_SEND', currentTime);
  
  // Aktualisiere auch den Tageszähler
  const today = new Date().toDateString();
  const lastSendDate = scriptProperties.getProperty('LAST_SEND_DATE');
  
  if (lastSendDate !== today) {
    // Neuer Tag - Counter zurücksetzen
    scriptProperties.setProperty('LAST_SEND_DATE', today);
    scriptProperties.setProperty('DAILY_EMAIL_COUNT', '1');
  } else {
    // Gleicher Tag - Counter erhöhen
    const currentCount = parseInt(scriptProperties.getProperty('DAILY_EMAIL_COUNT') || '0');
    scriptProperties.setProperty('DAILY_EMAIL_COUNT', (currentCount + 1).toString());
  }
  
  Logger.log(`Newsletter-Versand-Zeitstempel geloggt: ${currentTime}`);
}

/**
 * Prüft die Quota-Nutzung der letzten 24 Stunden
 */
function checkQuotaUsage() {
  const scriptProperties = PropertiesService.getScriptProperties();
  const dailyCount = parseInt(scriptProperties.getProperty('DAILY_EMAIL_COUNT') || '0');
  const lastSendDate = scriptProperties.getProperty('LAST_SEND_DATE');
  const today = new Date().toDateString();
  
  let message = "Quota-Status (24h):\n\n";
  
  if (lastSendDate === today) {
    message += `Heute versendete E-Mails: ${dailyCount}\n`;
    message += `Verbleibendes Limit: ${100 - dailyCount}\n\n`;
    
    if (dailyCount >= 90) {
      message += "⚠️ WARNUNG: Quota-Limit fast erreicht!";
    } else if (dailyCount >= 100) {
      message += "🚫 LIMIT ERREICHT: Kein weiterer Versand heute möglich!";
    } else {
      message += "✅ Quota-Status: OK";
    }
  } else {
    message += "Heute noch keine E-Mails versendet.\n";
    message += "Verfügbares Limit: 100 E-Mails\n\n";
    message += "✅ Quota-Status: Verfügbar";
  }
  
  SpreadsheetApp.getUi().alert('Quota-Status', message, SpreadsheetApp.getUi().ButtonSet.OK);
}

/**
 * Prüft den letzten Versand-Zeitpunkt und die Quota
 */
function checkLastSendTimeAndQuota() {
  const scriptProperties = PropertiesService.getScriptProperties();
  const lastSend = scriptProperties.getProperty('LAST_NEWSLETTER_SEND');
  const dailyCount = parseInt(scriptProperties.getProperty('DAILY_EMAIL_COUNT') || '0');
  
  let message = "Versand-Status:\n\n";
  
  if (lastSend) {
    const lastSendDate = new Date(lastSend);
    message += `Letzter Versand: ${lastSendDate.toLocaleDateString()} ${lastSendDate.toLocaleTimeString()}\n\n`;
  } else {
    message += "Noch kein Versand erfolgt.\n\n";
  }
  
  message += `Heute versendete E-Mails: ${dailyCount}\n`;
  message += `Verbleibendes Tageslimit: ${100 - dailyCount}`;
  
  SpreadsheetApp.getUi().alert('Versand-Status', message, SpreadsheetApp.getUi().ButtonSet.OK);
}

/**
 * Erstellt das Newsletter-Template mit personalisierten Links
 * @param {Object} newsletterData - Die Newsletter-Daten
 * @return {Object} - Template mit plainBody und htmlBody
 */
function getNewsletterTemplate(newsletterData) {
  const {
    tourTitle = "",
    tourDescription = "",
    tourDate = "",
    meetingPoint = "",
    unsubscribeLink = "",
    email = ""
  } = newsletterData;
  
  // Basis-Template für Plain-Text
  let plainTemplate = tourDescription;
  
  // Hilfsfunktion für Markdown-zu-HTML-Konvertierung
  function convertMarkdownToHtml(text) {
    let htmlText = text;
    
    // Fettdruck: **text** → <strong>text</strong>
    htmlText = htmlText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Kursiv: *text* → <em>text</em>
    htmlText = htmlText.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Zeilenumbrüche: \n → <br>
    htmlText = htmlText.replace(/\n/g, '<br>');
    
    return htmlText;
  }

  // Basis-Template für HTML mit universeller Kompatibilität
  let htmlTemplate = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
      <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2E7D32; font-size: 24px; margin-bottom: 10px;">
            <span style="background-color: #4CAF50; color: white; padding: 5px 10px; border-radius: 15px; font-size: 14px; margin-right: 10px;">RADTOUR</span>
            Hoffnungsradler Dülmen
          </h1>
          <div style="width: 50px; height: 3px; background-color: #4CAF50; margin: 0 auto;"></div>
        </div>
        
        <div style="line-height: 1.6; color: #333; font-size: 16px;">
          ${convertMarkdownToHtml(tourDescription)}
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 14px; color: #666; text-align: center;">
          <p>Du erhältst diese E-Mail, weil du den Newsletter der Hoffnungsradler Dülmen abonniert hast.</p>
          <p><a href="${unsubscribeLink}" style="color: #2E7D32; text-decoration: none;">Newsletter abbestellen</a></p>
        </div>
      </div>
    </div>
  `;
  
  return {
    plainBody: plainTemplate,
    htmlBody: htmlTemplate
  };
}

/**
 * Funktion zum Aufräumen ungültiger E-Mail-Adressen
 * Kann manuell aufgerufen werden, um ungültige Adressen zu identifizieren/deaktivieren
 */
function cleanupInvalidEmails() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Newsletter-Abonnenten');
  
  if (!sheet) {
    Browser.msgBox("Fehler", "Das Tabellenblatt 'Newsletter-Abonnenten' wurde nicht gefunden.", Browser.Buttons.OK);
    return;
  }
  
  const data = sheet.getDataRange().getValues();
  let deactivatedCount = 0;
  
  // Stelle sicher, dass die Sendestatus-Spalte existiert
  ensureStatusColumnExists(sheet, data);
  
  // Erste Zeile überspringen (Überschriften)
  for (let i = 1; i < data.length; i++) {
    const status = data[i][4];
    const sendStatus = data[i][6] || "";
    
    // Prüfe, ob die E-Mail als ungültig markiert ist
    if (status === 'aktiv' && sendStatus === 'ungültig') {
      // Setze den Status auf 'inaktiv'
      sheet.getRange(i + 1, 5).setValue('inaktiv');
      deactivatedCount++;
    }
  }
  
  Browser.msgBox(
    "Aufräumen abgeschlossen", 
    `Es wurden ${deactivatedCount} ungültige E-Mail-Adressen auf 'inaktiv' gesetzt.`, 
    Browser.Buttons.OK
  );
}

/**
 * Gibt den aktuellen Newsletter-Versand-Status zurück
 */
function getNewsletterSendStatus() {
  const scriptProperties = PropertiesService.getScriptProperties();
  const sendingInProgress = scriptProperties.getProperty('SENDING_IN_PROGRESS');
  const lastProcessedIndex = scriptProperties.getProperty('LAST_PROCESSED_INDEX');
  const sentCount = scriptProperties.getProperty('SENT_COUNT');
  const failCount = scriptProperties.getProperty('FAIL_COUNT');
  
  let message = "Newsletter-Versandstatus:\n\n";
  
  if (sendingInProgress === 'true') {
    message += "🟡 VERSAND LÄUFT\n\n";
    message += `Letzter verarbeiteter Index: ${lastProcessedIndex || 'Unbekannt'}\n`;
    message += `Erfolgreich versendet: ${sentCount || '0'}\n`;
    message += `Fehlgeschlagen: ${failCount || '0'}\n\n`;
    message += "Der Versand kann über 'Versand manuell fortsetzen' fortgesetzt werden.";
  } else {
    message += "🟢 KEIN VERSAND AKTIV\n\n";
    message += "Es läuft derzeit kein Newsletter-Versand.";
  }
  
  SpreadsheetApp.getUi().alert('Versandstatus', message, SpreadsheetApp.getUi().ButtonSet.OK);
}

/**
 * Setzt das Newsletter-System zurück (bei Problemen)
 */
function resetNewsletterSystem() {
  const ui = SpreadsheetApp.getUi();
  const response = ui.alert(
    'Newsletter-System zurücksetzen',
    'Soll das Newsletter-System wirklich zurückgesetzt werden? Alle laufenden Versände werden abgebrochen.',
    ui.ButtonSet.YES_NO
  );
  
  if (response === ui.Button.YES) {
    const scriptProperties = PropertiesService.getScriptProperties();
    
    // Alle versandbezogenen Properties löschen
    scriptProperties.deleteProperty('SENDING_IN_PROGRESS');
    scriptProperties.deleteProperty('LAST_PROCESSED_INDEX');
    scriptProperties.deleteProperty('SENT_COUNT');
    scriptProperties.deleteProperty('FAIL_COUNT');
    scriptProperties.deleteProperty('INVALID_COUNT');
    
    ui.alert('System zurückgesetzt', 'Das Newsletter-System wurde erfolgreich zurückgesetzt.', ui.ButtonSet.OK);
  }
}

/**
 * Setzt den Versand manuell fort (bei Problemen mit Triggern)
 */
function manualContinueNewsletterSend() {
  const scriptProperties = PropertiesService.getScriptProperties();
  const sendingInProgress = scriptProperties.getProperty('SENDING_IN_PROGRESS');
  
  if (sendingInProgress === 'true') {
    // Rufe die Versand-Funktion auf
    sendNewsletterToAllSubscribers();
  } else {
    SpreadsheetApp.getUi().alert(
      'Kein Versand aktiv',
      'Es ist kein Newsletter-Versand aktiv, der fortgesetzt werden könnte.',
      SpreadsheetApp.getUi().ButtonSet.OK
    );
  }
}

/**
 * Hilfsfunktion zur Tourplanung (aus alter utils.gs)
 */
function createTourPlanningSheet(sheetName) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(sheetName);
  
  if (sheet) {
    SpreadsheetApp.getUi().alert('Blatt existiert bereits', 'Ein Blatt mit diesem Namen existiert bereits.', SpreadsheetApp.getUi().ButtonSet.OK);
    return;
  }
  
  sheet = ss.insertSheet(sheetName);
  
  // Überschriften setzen
  const headers = ['Datum', 'Tour-Titel', 'Beschreibung', 'Treffpunkt', 'Dauer', 'Schwierigkeit', 'Anmeldungen'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Formatierung
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#f0f0f0');
  
  // Spaltenbreiten
  sheet.setColumnWidth(1, 100); // Datum
  sheet.setColumnWidth(2, 200); // Tour-Titel
  sheet.setColumnWidth(3, 300); // Beschreibung
  sheet.setColumnWidth(4, 200); // Treffpunkt
  sheet.setColumnWidth(5, 80);  // Dauer
  sheet.setColumnWidth(6, 100); // Schwierigkeit
  sheet.setColumnWidth(7, 120); // Anmeldungen
  
  SpreadsheetApp.getUi().alert('Blatt erstellt', `Das Blatt "${sheetName}" wurde erfolgreich erstellt.`, SpreadsheetApp.getUi().ButtonSet.OK);
}

/**
 * Menü für Tourplanung
 */
function menuCreateTourPlanningSheet() {
  const ui = SpreadsheetApp.getUi();
  const response = ui.prompt('Neues Touren-Blatt anlegen', 'Wie soll das neue Blatt heißen? (z.B. "Touren 2024")', ui.ButtonSet.OK_CANCEL);
  if (response.getSelectedButton() !== ui.Button.OK) {
    return;
  }
  const sheetName = response.getResponseText().trim();
  if (!sheetName) {
    ui.alert('Bitte gib einen gültigen Namen ein!');
    return;
  }
  createTourPlanningSheet(sheetName);
} 