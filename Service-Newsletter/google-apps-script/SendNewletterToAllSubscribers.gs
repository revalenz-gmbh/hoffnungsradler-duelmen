/**
 * Verbesserte Funktion zum Versenden des Newsletters an alle Abonnenten
 * - Unterstützt mehr als 100 Empfänger durch Pagination
 * - Erkennt und markiert ungültige E-Mail-Adressen
 * - Beachtet die Google Apps Script Quota-Limits
 *
 * Zeitgesteuerte Trigger dürfen NICHT sendNewsletterToAllSubscribers aufrufen (UI).
 * Stattdessen: sendNewsletterScheduledContinuation
 */

/**
 * Einstieg für installierbare Zeit-Trigger (Fortsetzung nach Quota-Pause).
 * Kein SpreadsheetApp.getUi / Browser.msgBox – sonst bricht der Lauf ab.
 */
function sendNewsletterScheduledContinuation() {
  runNewsletterSendBatch_({ silent: true });
}

/**
 * Menü: neuen Versand starten oder laufenden Versand fortsetzen.
 */
function sendNewsletterToAllSubscribers() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) {
    Browser.msgBox('Fehler', 'Kein Spreadsheet-Kontext.', Browser.Buttons.OK);
    return;
  }

  const sheet = ss.getSheetByName('Newsletter-Abonnenten');
  if (!sheet) {
    Browser.msgBox('Fehler', "Das Tabellenblatt 'Newsletter-Abonnenten' wurde nicht gefunden.", Browser.Buttons.OK);
    return;
  }

  let data = sheet.getDataRange().getValues();
  const inputSheet = ss.getSheetByName('Newsletter_aktuell');
  if (!inputSheet) {
    Browser.msgBox('Fehler', "Das Blatt 'Newsletter_aktuell' wurde nicht gefunden.", Browser.Buttons.OK);
    return;
  }

  const tourTitle = inputSheet.getRange('B2').getValue();
  const tourDescription = inputSheet.getRange('B3').getValue();
  const tourDateTime = inputSheet.getRange('B4').getValue();
  const meetingPoint = inputSheet.getRange('B5').getValue();

  if (!tourTitle || !tourDescription || !tourDateTime || !meetingPoint) {
    Browser.msgBox('Fehlende Informationen', 'Bitte fülle alle Felder im Newsletter-Blatt aus (B2–B5).', Browser.Buttons.OK);
    return;
  }

  const scriptProperties = PropertiesService.getScriptProperties();
  const sendingInProgress = scriptProperties.getProperty('SENDING_IN_PROGRESS');
  const ui = SpreadsheetApp.getUi();

  if (sendingInProgress === 'true') {
    const resume = ui.alert(
      'Newsletter-Versand',
      'Ein Versand ist noch nicht abgeschlossen (z. B. wegen Tageslimit).\n\nJetzt mit dem nächsten Paket fortfahren?',
      ui.ButtonSet.YES_NO
    );
    if (resume !== ui.Button.YES) {
      return;
    }
    runNewsletterSendBatch_({ silent: false });
    return;
  }

  const activeSubscribers = countActiveSubscribers(data);
  let confirmMessage = 'Möchtest du den Newsletter an ' + activeSubscribers + ' aktive Abonnenten versenden?';
  if (activeSubscribers > 90) {
    confirmMessage += '\n\nHinweis: Google begrenzt den Versand. Bei mehr als 90 Empfängern wird der Versand in mehrere Durchgänge aufgeteilt (Fortsetzung per Zeit-Trigger).';
  }

  const confirmSend = ui.alert('Newsletter versenden', confirmMessage, ui.ButtonSet.YES_NO);
  if (confirmSend !== ui.Button.YES) {
    return;
  }

  scriptProperties.setProperty('SENDING_IN_PROGRESS', 'true');
  scriptProperties.setProperty('LAST_PROCESSED_INDEX', '0');
  scriptProperties.setProperty('SENT_COUNT', '0');
  scriptProperties.setProperty('FAIL_COUNT', '0');
  scriptProperties.setProperty('INVALID_COUNT', '0');

  Browser.msgBox(
    'Versand gestartet',
    'Der Newsletter-Versand wurde gestartet. Bei vielen Empfängern kann das mehrere Minuten dauern.',
    Browser.Buttons.OK
  );

  runNewsletterSendBatch_({ silent: false });
}

/**
 * @param {{ silent?: boolean }} options silent=true: kein UI (Trigger); sonst Meldungen an den Nutzer
 */
function runNewsletterSendBatch_(options) {
  const silent = options && options.silent === true;
  const scriptProperties = PropertiesService.getScriptProperties();

  if (scriptProperties.getProperty('SENDING_IN_PROGRESS') !== 'true') {
    Logger.log('runNewsletterSendBatch_: kein aktiver Versand (SENDING_IN_PROGRESS), Abbruch.');
    return;
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) {
    Logger.log('runNewsletterSendBatch_: SpreadsheetApp.getActiveSpreadsheet() leer.');
    return;
  }

  const sheet = ss.getSheetByName('Newsletter-Abonnenten');
  const inputSheet = ss.getSheetByName('Newsletter_aktuell');
  if (!sheet || !inputSheet) {
    Logger.log('runNewsletterSendBatch_: Pflicht-Blätter fehlen.');
    if (!silent) {
      Browser.msgBox('Fehler', 'Newsletter-Abonnenten oder Newsletter_aktuell fehlt.', Browser.Buttons.OK);
    }
    return;
  }

  const tourTitle = inputSheet.getRange('B2').getValue();
  const tourDescription = inputSheet.getRange('B3').getValue();
  const tourDateTime = inputSheet.getRange('B4').getValue();
  const meetingPoint = inputSheet.getRange('B5').getValue();
  if (!tourTitle || !tourDescription || !tourDateTime || !meetingPoint) {
    Logger.log('runNewsletterSendBatch_: Newsletter-Felder unvollständig.');
    if (!silent) {
      Browser.msgBox('Fehlende Informationen', 'Bitte fülle alle Felder im Newsletter-Blatt aus.', Browser.Buttons.OK);
    }
    return;
  }

  const newsletterSubject = 'Neue Tour-Information: ' + tourTitle;
  const newsletterId = inputSheet.getRange('B15').getValue();

  let data = sheet.getDataRange().getValues();
  ensureStatusColumnExists(sheet, data);
  data = sheet.getDataRange().getValues();

  let sentCount = parseInt(scriptProperties.getProperty('SENT_COUNT') || '0', 10);
  let failCount = parseInt(scriptProperties.getProperty('FAIL_COUNT') || '0', 10);
  let invalidCount = parseInt(scriptProperties.getProperty('INVALID_COUNT') || '0', 10);
  const lastProcessedIndex = parseInt(scriptProperties.getProperty('LAST_PROCESSED_INDEX') || '0', 10);

  const MAX_EMAILS_PER_RUN = 90;
  let processedThisRun = 0;

  try {
    for (let i = Math.max(1, lastProcessedIndex); i < data.length; i++) {
      if (processedThisRun >= MAX_EMAILS_PER_RUN) {
        scriptProperties.setProperty('LAST_PROCESSED_INDEX', String(i));
        scriptProperties.setProperty('SENT_COUNT', String(sentCount));
        scriptProperties.setProperty('FAIL_COUNT', String(failCount));
        scriptProperties.setProperty('INVALID_COUNT', String(invalidCount));

        const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
        try {
          createSafeTrigger('sendNewsletterScheduledContinuation', tomorrow);
          Logger.log('Trigger für Fortsetzung erstellt: ' + tomorrow);
        } catch (triggerError) {
          Logger.log('WARNUNG: Trigger konnte nicht erstellt werden: ' + triggerError.message);
          if (!silent) {
            Browser.msgBox(
              'Trigger-Warnung',
              'Der automatische Trigger für morgen konnte nicht erstellt werden.\n\n' +
                'Fehler: ' +
                triggerError.message +
                '\n\nBitte später: Newsletter → Administration → Versand manuell fortsetzen',
              Browser.Buttons.OK
            );
          }
        }

        const pauseMsg =
          'Es wurden ' +
          processedThisRun +
          ' E-Mails in diesem Durchgang versendet.\n\n' +
          'Gesamt: ' +
          sentCount +
          ' versendet, ' +
          failCount +
          ' Fehler, ' +
          invalidCount +
          ' ungültig.\n\n' +
          'Der Versand wird automatisch fortgesetzt (Zeit-Trigger), sofern installiert.';
        if (!silent) {
          Browser.msgBox('Versand pausiert', pauseMsg, Browser.Buttons.OK);
        } else {
          Logger.log('Versand pausiert (silent): ' + pauseMsg.replace(/\n/g, ' '));
        }
        return;
      }

      const email = data[i][0];
      const unsubscribeLink = data[i][3];
      const status = data[i][4];
      const sendStatus = data[i][6] || '';

      if (status === 'aktiv' && sendStatus !== 'ungültig') {
        try {
          processedThisRun++;

          const newsletterData = {
            tourTitle: tourTitle,
            tourDescription: tourDescription,
            tourDate: tourDateTime,
            meetingPoint: meetingPoint,
            unsubscribeLink: unsubscribeLink,
            email: email
          };

          const newsletter = getNewsletterTemplate(newsletterData);

          GmailApp.sendEmail(email, newsletterSubject, newsletter.plainBody, {
            htmlBody: newsletter.htmlBody,
            name: 'Hoffnungsradler Dülmen',
            replyTo: 'hoffnungsradlerweb@gmail.com',
            attachments: [],
            bcc: '',
            cc: ''
          });
          logNewsletterSendTimestamp();

          sheet.getRange(i + 1, 6).setValue(new Date());
          if (data[0].length >= 7) {
            sheet.getRange(i + 1, 7).setValue('erfolgreich');
          }
          sheet.getRange(i + 1, 8).setValue(newsletterId);

          sentCount++;
          Utilities.sleep(1000);
        } catch (error) {
          failCount++;
          Logger.log('Fehler beim Senden an ' + email + ': ' + error.message);

          if (data[0].length >= 7) {
            sheet.getRange(i + 1, 7).setValue('Fehler: ' + error.message);
          }
          if (isInvalidEmailError(error.message)) {
            if (data[0].length >= 7) {
              sheet.getRange(i + 1, 7).setValue('ungültig');
            }
            invalidCount++;
          }
        }
      }

      scriptProperties.setProperty('LAST_PROCESSED_INDEX', String(i));
      scriptProperties.setProperty('SENT_COUNT', String(sentCount));
      scriptProperties.setProperty('FAIL_COUNT', String(failCount));
      scriptProperties.setProperty('INVALID_COUNT', String(invalidCount));
    }

    scriptProperties.deleteProperty('SENDING_IN_PROGRESS');
    scriptProperties.deleteProperty('LAST_PROCESSED_INDEX');
    scriptProperties.deleteProperty('SENT_COUNT');
    scriptProperties.deleteProperty('FAIL_COUNT');
    scriptProperties.deleteProperty('INVALID_COUNT');

    inputSheet.getRange('B11').setValue(new Date());
    inputSheet.getRange('B12').setValue(sentCount);
    inputSheet.getRange('B13').setValue('Erfolgreich versendet (' + failCount + ' Fehler, ' + invalidCount + ' ungültig)');

    const doneMsg =
      'Der Newsletter wurde an ' +
      sentCount +
      ' Abonnenten versendet.\n' +
      failCount +
      ' Fehler.\n' +
      invalidCount +
      ' Adressen als ungültig markiert.';
    if (!silent) {
      Browser.msgBox('Newsletter vollständig versendet', doneMsg, Browser.Buttons.OK);
    } else {
      Logger.log('Newsletter vollständig versendet (silent): ' + doneMsg.replace(/\n/g, ' '));
    }
  } catch (error) {
    Logger.log('Hauptfehler beim Versand: ' + error.message);
    if (!silent) {
      Browser.msgBox(
        'Fehler beim Versand',
        'Unerwarteter Fehler: ' + error.message + '\n\nDer Versand kann über „Versand manuell fortsetzen“ erneut versucht werden.',
        Browser.Buttons.OK
      );
    }
  }
}

/**
 * Funktion zum Aufräumen ungültiger E-Mail-Adressen
 */
function cleanupInvalidEmails() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Newsletter-Abonnenten');

  if (!sheet) {
    Browser.msgBox('Fehler', "Das Tabellenblatt 'Newsletter-Abonnenten' wurde nicht gefunden.", Browser.Buttons.OK);
    return;
  }

  let data = sheet.getDataRange().getValues();
  ensureStatusColumnExists(sheet, data);
  data = sheet.getDataRange().getValues();

  let deactivatedCount = 0;
  for (let i = 1; i < data.length; i++) {
    const status = data[i][4];
    const sendStatus = data[i][6] || '';
    if (status === 'aktiv' && sendStatus === 'ungültig') {
      sheet.getRange(i + 1, 5).setValue('inaktiv');
      deactivatedCount++;
    }
  }

  Browser.msgBox(
    'Aufräumen abgeschlossen',
    'Es wurden ' + deactivatedCount + " ungültige E-Mail-Adressen auf 'inaktiv' gesetzt.",
    Browser.Buttons.OK
  );
}

/**
 * BEISPIEL-NEWSLETTER FÜR TOUR-ANKÜNDIGUNG
 *
 * Kopiere diesen Text in das "Newsletter_aktuell" Blatt:
 *
 * B2 (Tour-Titel): Frühlingstour nach Weseke
 *
 * B3 (Tour-Beschreibung):
 * Liebe Hoffnungsradler,
 * ...
 * B4 (Datum/Zeit): Samstag, 15. April 2025 - 10:00 Uhr
 * B5 (Treffpunkt): Marktplatz Dülmen
 */
