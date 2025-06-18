/**
 * Verbesserte Funktion zum Versenden des Newsletters an alle Abonnenten
 * - Unterstützt mehr als 100 Empfänger durch Pagination
 * - Erkennt und markiert ungültige E-Mail-Adressen
 * - Beachtet die Google Apps Script Quota-Limits
 */
function sendNewsletterToAllSubscribers() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Newsletter-Abonnenten');
  
  if (!sheet) {
    Browser.msgBox("Fehler", "Das Tabellenblatt 'Newsletter-Abonnenten' wurde nicht gefunden.", Browser.Buttons.OK);
    return;
  }
  
  const data = sheet.getDataRange().getValues();
  const inputSheet = ss.getSheetByName('Newsletter_aktuell');
  
  if (!inputSheet) {
    Browser.msgBox("Fehler", "Das Blatt 'Newsletter_aktuell' wurde nicht gefunden.", Browser.Buttons.OK);
    return;
  }
  
  // Daten aus dem Eingabe-Blatt lesen
  const tourTitle = inputSheet.getRange('B2').getValue();
  const tourDescription = inputSheet.getRange('B3').getValue();
  const tourDateTime = inputSheet.getRange('B4').getValue();
  const meetingPoint = inputSheet.getRange('B5').getValue();
  
  // Prüfen, ob alle notwendigen Informationen vorhanden sind
  if (!tourTitle || !tourDescription || !tourDateTime || !meetingPoint) {
    Browser.msgBox("Fehlende Informationen", 
        "Bitte fülle alle Felder im Newsletter-Blatt aus.", 
        Browser.Buttons.OK);
    return;
  }
  
  const newsletterSubject = "Neue Tour-Information: " + tourTitle;
  
  // Vor dem Versand: Newsletter-ID aus B15 lesen
  const newsletterId = inputSheet.getRange('B15').getValue();
  
  // Zähle aktive Abonnenten
  const activeSubscribers = countActiveSubscribers(data);
  
  // Warnhinweis, wenn viele Empfänger
  let confirmMessage = `Möchtest du den Newsletter an ${activeSubscribers} aktive Abonnenten versenden?`;
  
  if (activeSubscribers > 90) {
    confirmMessage += "\n\nHinweis: Google Apps Script hat ein Limit von 100 E-Mails pro Tag. " +
                     "Bei mehr als 90 Empfängern wird der Versand in mehrere Durchgänge aufgeteilt.";
  }
  
  const ui = SpreadsheetApp.getUi();
  const confirmSend = ui.alert(
    "Newsletter versenden",
    confirmMessage,
    ui.ButtonSet.YES_NO
  );
  
  if (confirmSend !== ui.Button.YES) {
    return; // Benutzer hat abgebrochen
  }
  
  // Prüfe, ob bereits ein Versand im Gange ist
  const scriptProperties = PropertiesService.getScriptProperties();
  const sendingInProgress = scriptProperties.getProperty('SENDING_IN_PROGRESS');
  const lastProcessedIndex = parseInt(scriptProperties.getProperty('LAST_PROCESSED_INDEX') || "0");
  
  // Optionale Spalte für den Status hinzufügen, falls noch nicht vorhanden
  ensureStatusColumnExists(sheet, data);
  
  // Vorbereitung für die Statistik
  let sentCount = parseInt(scriptProperties.getProperty('SENT_COUNT') || "0");
  let failCount = parseInt(scriptProperties.getProperty('FAIL_COUNT') || "0");
  let invalidCount = parseInt(scriptProperties.getProperty('INVALID_COUNT') || "0");
  
  try {
    // Neuen Versand starten oder vorhandenen fortsetzen
    if (sendingInProgress !== "true") {
      // Neuer Versand - Status zurücksetzen
      scriptProperties.setProperty('SENDING_IN_PROGRESS', 'true');
      scriptProperties.setProperty('LAST_PROCESSED_INDEX', '0');
      scriptProperties.setProperty('SENT_COUNT', '0');
      scriptProperties.setProperty('FAIL_COUNT', '0');
      scriptProperties.setProperty('INVALID_COUNT', '0');
      
      sentCount = 0;
      failCount = 0;
      invalidCount = 0;
      
      // Informiere den Nutzer
      Browser.msgBox("Versand gestartet", 
          "Der Newsletter-Versand wurde gestartet. Dies kann einige Zeit dauern, besonders bei vielen Empfängern.", 
          Browser.Buttons.OK);
    }
    
    // Maximale Anzahl von E-Mails pro Lauf (wegen Quota-Limits)
    const MAX_EMAILS_PER_RUN = 90;
    
    // Erste Zeile überspringen (Überschriften) und ab dem letzten verarbeiteten Index fortfahren
    let processedThisRun = 0;
    
    for (let i = Math.max(1, lastProcessedIndex); i < data.length; i++) {
      // Prüfen, ob wir das Limit für diesen Lauf erreicht haben
      if (processedThisRun >= MAX_EMAILS_PER_RUN) {
        // Speichern des aktuellen Index für den nächsten Lauf
        scriptProperties.setProperty('LAST_PROCESSED_INDEX', i.toString());
        scriptProperties.setProperty('SENT_COUNT', sentCount.toString());
        scriptProperties.setProperty('FAIL_COUNT', failCount.toString());
        scriptProperties.setProperty('INVALID_COUNT', invalidCount.toString());
        
        // Trigger für den nächsten Lauf in 24 Stunden einrichten (wegen Quota-Limits)
        const now = new Date();
        const tomorrow = new Date(now.getTime() + (24 * 60 * 60 * 1000));
        
        try {
          // Verwende die neue sichere Trigger-Erstellung
          createSafeTrigger('sendNewsletterToAllSubscribers', tomorrow);
          Logger.log(`Trigger erfolgreich für ${tomorrow} erstellt`);
        } catch (triggerError) {
          Logger.log(`WARNUNG: Trigger konnte nicht erstellt werden: ${triggerError.message}`);
          // Fallback: Benutzer informieren, dass manueller Versand nötig ist
          Browser.msgBox("Trigger-Warnung", 
              `Der automatische Trigger für morgen konnte nicht erstellt werden.\n\n` +
              `Fehler: ${triggerError.message}\n\n` +
              `Bitte setze den Versand morgen manuell über das Menü fort:\n` +
              `Newsletter → Administration → Versand manuell fortsetzen`,
              Browser.Buttons.OK);
        }
        
        // Informiere den Nutzer
        Browser.msgBox("Versand pausiert", 
            `Es wurden ${processedThisRun} E-Mails in diesem Durchgang versendet.\n\n` +
            `Gesamtstatus: ${sentCount} versendet, ${failCount} fehlgeschlagen, ${invalidCount} ungültig.\n\n` +
            `Der Versand wird automatisch morgen fortgesetzt, um das tägliche Limit von Google nicht zu überschreiten.`,
            Browser.Buttons.OK);
        
        return;
      }
      
      const email = data[i][0];
      const subscriberId = data[i][2];
      const unsubscribeLink = data[i][3];
      const status = data[i][4];
      
      // Prüfe zusätzliche Statusspalte, falls vorhanden
      const sendStatus = data[i][6] || "";
      
      // Lese Abstimmungs-Link direkt aus der Zeile (Spalte 9 = Index 8)
      const personalVotingLink = data[i][8] || '';
      
      // Nur an aktive Abonnenten senden, die nicht als ungültig markiert sind
      if (status === 'aktiv' && sendStatus !== 'ungültig') {
        try {
          processedThisRun++;
          
          // ==========================================================
          // Personalisierter Abstimmungs-Link direkt aus der Tabelle
          // ==========================================================
          
          // Platzhalter im Text ersetzen. Funktioniert für Plain-Text und HTML.
          // ==========================================================
          
          const newsletterData = {
            tourTitle: tourTitle,
            tourDescription: tourDescription, // HIER wieder den ORIGINAL-Text übergeben
            tourDate: tourDateTime,
            meetingPoint: meetingPoint,
            unsubscribeLink: unsubscribeLink,
            email: email
          };
          
          // NEU: Der persönliche Link wird als zweiter Parameter übergeben
          const newsletter = getNewsletterTemplate(newsletterData, personalVotingLink);
          
          // E-Mail senden
          GmailApp.sendEmail(
            email,
            newsletterSubject,
            newsletter.plainBody,
            { 
              htmlBody: newsletter.htmlBody,
              name: "Hoffnungsradler Dülmen" 
            }
          );
          logNewsletterSendTimestamp();
          
          // Letzten Versand aktualisieren
          sheet.getRange(i + 1, 6).setValue(new Date());
          
          // Sendestatus aktualisieren, falls die Spalte existiert
          if (data[0].length >= 7) {
            sheet.getRange(i + 1, 7).setValue("erfolgreich");
          }
          
          // Im Versand-Loop, nach erfolgreichem Versand:
          sheet.getRange(i + 1, 8).setValue(newsletterId); // Spalte 8 = Newsletter-ID
          
          sentCount++;
          
          // Pause, um Quota-Limits nicht zu überschreiten
          Utilities.sleep(1000);
        } catch (error) {
          failCount++;
          Logger.log("Fehler beim Senden an " + email + ": " + error.message);
          
          // Sendestatus aktualisieren, falls die Spalte existiert
          if (data[0].length >= 7) {
            sheet.getRange(i + 1, 7).setValue("Fehler: " + error.message);
          }
          
          // Prüfen, ob die E-Mail ungültig ist (basierend auf der Fehlermeldung)
          if (isInvalidEmailError(error.message)) {
            // Als ungültig markieren
            if (data[0].length >= 7) {
              sheet.getRange(i + 1, 7).setValue("ungültig");
            }
            invalidCount++;
          }
        }
      }
      
      // Aktuellen Fortschritt speichern
      scriptProperties.setProperty('LAST_PROCESSED_INDEX', i.toString());
      scriptProperties.setProperty('SENT_COUNT', sentCount.toString());
      scriptProperties.setProperty('FAIL_COUNT', failCount.toString());
      scriptProperties.setProperty('INVALID_COUNT', invalidCount.toString());
    }
    
    // Wenn wir hier ankommen, wurde der Versand komplett abgeschlossen
    scriptProperties.deleteProperty('SENDING_IN_PROGRESS');
    scriptProperties.deleteProperty('LAST_PROCESSED_INDEX');
    scriptProperties.deleteProperty('SENT_COUNT');
    scriptProperties.deleteProperty('FAIL_COUNT');
    scriptProperties.deleteProperty('INVALID_COUNT');
    
    // Statistik aktualisieren
    inputSheet.getRange('B11').setValue(new Date());
    inputSheet.getRange('B12').setValue(sentCount);
    inputSheet.getRange('B13').setValue(`Erfolgreich versendet (${failCount} Fehler, ${invalidCount} ungültig)`);
    
    Browser.msgBox(
      "Newsletter vollständig versendet", 
      `Der Newsletter wurde an ${sentCount} Abonnenten versendet.\n${failCount} Fehler sind aufgetreten.\n${invalidCount} E-Mail-Adressen wurden als ungültig markiert.`, 
      Browser.Buttons.OK
    );
    
  } catch (error) {
    // Hauptfehlerbehandlung
    Logger.log("Hauptfehler beim Versand: " + error.message);
    Browser.msgBox(
      "Fehler beim Versand", 
      `Es ist ein unerwarteter Fehler aufgetreten: ${error.message}\n\nDer Versand wird beim nächsten Aufruf fortgesetzt.`, 
      Browser.Buttons.OK
    );
  }
}

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

function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Newsletter')
      .addItem('Newsletter-Blatt erstellen/öffnen', 'createNewsletterSheet')
      .addItem('Manuelle Adressen hinzufügen', 'addManualSubscribers')
      .addSeparator()
      .addItem('Newsletter-Testversand', 'sendNewsletterTest')
      .addItem('Newsletter versenden', 'sendNewsletterToAllSubscribers')
      .addSeparator()
      .addItem('Ungültige E-Mails deaktivieren', 'cleanupInvalidEmails')
      .addToUi();
  // Neuen Menüpunkt für Tourplanung ergänzen
  ui.createMenu('Tourplanung')
    .addItem('Neues Blatt für Tourplanung anlegen', 'menuCreateTourPlanningSheet')
    .addToUi();
}

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