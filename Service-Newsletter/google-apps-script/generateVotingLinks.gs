//==============================================================
// FUNKTION ZUM ERSTELLEN VON ABSTIMMUNGS-LINKS (INTEGRATION MIT TOURVERWALTUNG)
//==============================================================

function generateVotingLinks() {
  const ui = SpreadsheetApp.getUi();
  
  // Zuerst frage nach der Tourverwaltungs-Spreadsheet ID
  const tourMgmtIdResult = ui.prompt(
    'Integration mit Tourverwaltung',
    'Bitte geben Sie die ID des Tourverwaltungs-Spreadsheets ein.\n\n' +
    'Das Google Forms für die Abstimmung muss zuerst dort erstellt werden über:\n' +
    '"Tourverwaltung → Google Forms für Abstimmung erstellen"',
    ui.ButtonSet.OK_CANCEL
  );

  if (tourMgmtIdResult.getSelectedButton() !== ui.Button.OK || !tourMgmtIdResult.getResponseText()) return;
  
  const tourMgmtId = tourMgmtIdResult.getResponseText().trim();
  
  try {
    // Versuche auf das Tourverwaltungs-Spreadsheet zuzugreifen
    const tourMgmtSheet = SpreadsheetApp.openById(tourMgmtId);
    const settingsSheet = tourMgmtSheet.getSheetByName('Einstellungen');
    
    if (!settingsSheet) {
      throw new Error('Das Blatt "Einstellungen" wurde im Tourverwaltungs-Spreadsheet nicht gefunden.');
    }
    
    // Suche nach der Forms-URL
    const settingsData = settingsSheet.getDataRange().getValues();
    let formsUrl = null;
    
    for (let i = 0; i < settingsData.length; i++) {
      if (settingsData[i][0] === 'Abstimmungs-Forms-URL') {
        formsUrl = settingsData[i][1];
        break;
      }
    }
    
    if (!formsUrl) {
      throw new Error('Keine Abstimmungs-Forms-URL in der Tourverwaltung gefunden.\n\nBitte erstelle zuerst über "Tourverwaltung → Google Forms für Abstimmung erstellen" ein Formular.');
    }
    
    ui.alert('Forms-URL gefunden', `Gefundene Forms-URL:\n${formsUrl}\n\nGeneriere jetzt personalisierte Links...`, ui.ButtonSet.OK);
    
  } catch (error) {
    ui.alert('Fehler', `Fehler beim Zugriff auf das Tourverwaltungs-Spreadsheet:\n\n${error.message}`, ui.ButtonSet.OK);
    return;
  }
  
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Newsletter-Abonnenten');
  if (!sheet) {
    ui.alert('Fehler', 'Das Blatt "Newsletter-Abonnenten" wurde nicht gefunden.', ui.ButtonSet.OK);
    return;
  }
  
  // Stelle sicher, dass die Abstimmungs-Link Spalte existiert
  ensureVotingLinkColumn(sheet);
  
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  const emailIndex = headers.indexOf('Email') !== -1 ? headers.indexOf('Email') : 0;
  const subscriberIdIndex = headers.indexOf('SubscriberID') !== -1 ? headers.indexOf('SubscriberID') : 2;
  const votingLinkIndex = headers.indexOf('Abstimmungs-Link');

  if (votingLinkIndex === -1) {
    ui.alert('Fehler', 'Die Spalte "Abstimmungs-Link" konnte nicht gefunden werden.', ui.ButtonSet.OK);
    return;
  }
  
  let updatedCount = 0;
  
  // Starte bei 1, um Header zu überspringen
  for (let i = 1; i < data.length; i++) { 
    const row = data[i];
    const email = row[emailIndex];
    const subscriberId = row[subscriberIdIndex];
    
    if (email && subscriberId) {
      // Erstelle personalisierten Google Forms Link
      const personalFormsLink = createPersonalizedFormsLink(formsUrl, subscriberId, email);
      
      // Schreibe den Link in die entsprechende Zelle
      sheet.getRange(i + 1, votingLinkIndex + 1).setValue(personalFormsLink);
      updatedCount++;
    }
  }
  
  // Lösche das alte "Abstimmungs-Links" Blatt falls es existiert
  const oldSheet = ss.getSheetByName('Abstimmungs-Links');
  if (oldSheet) {
    const deleteResult = ui.alert(
      'Altes Blatt gefunden',
      'Es wurde ein altes "Abstimmungs-Links" Blatt gefunden.\n\n' +
      'Soll dieses gelöscht werden, da die Links jetzt direkt in der\n' +
      '"Newsletter-Abonnenten" Tabelle gespeichert werden?',
      ui.ButtonSet.YES_NO
    );
    
    if (deleteResult === ui.Button.YES) {
      ss.deleteSheet(oldSheet);
      ui.alert('Info', 'Das alte "Abstimmungs-Links" Blatt wurde gelöscht.', ui.ButtonSet.OK);
    }
  }
  
  ui.alert('Erfolg!', 
    `${updatedCount} personalisierte Abstimmungs-Links wurden erstellt!\n\n` +
    'Diese verweisen auf das Google Forms der Tourverwaltung und\n' +
    'vermeiden CORS-Probleme komplett.\n\n' +
    'Die Abstimmungsergebnisse werden automatisch in der\n' +
    'Tourverwaltung gesammelt und ausgewertet.', 
    ui.ButtonSet.OK);
  
  // Speichere die Tourverwaltungs-ID für zukünftige Verwendung
  const scriptProperties = PropertiesService.getScriptProperties();
  scriptProperties.setProperty('TOUR_MGMT_SPREADSHEET_ID', tourMgmtId);
  scriptProperties.setProperty('VOTING_FORMS_URL', formsUrl);
}

/**
 * Erstellt einen personalisierten Google Forms Link für die Tourverwaltung
 * @param {string} baseFormsUrl - Die Basis Google Forms URL aus der Tourverwaltung
 * @param {string} subscriberId - Die Abonnenten-ID
 * @param {string} email - Die E-Mail-Adresse (optional für Vorabfüllung)
 * @return {string} - Der personalisierte Forms Link
 */
function createPersonalizedFormsLink(baseFormsUrl, subscriberId, email) {
  try {
    // Entferne mögliche bestehende Parameter
    const cleanUrl = baseFormsUrl.split('?')[0];
    
    // Google Forms Parameter für Vorabfüllung
    // WICHTIG: Diese entry.XXX IDs müssen aus dem echten Formular ermittelt werden
    const params = new URLSearchParams();
    params.set('usp', 'pp_url');
    
    // TODO: Diese Entry-IDs müssen aus dem echten Formular ermittelt werden!
    // ANLEITUNG:
    // 1. Gehe zum Google Forms in der Tourverwaltung
    // 2. Klicke "Antworten" → "Antworten vorab ausfüllen" 
    // 3. Fülle Testdaten ein (z.B. "test123" für ID, "test@example.com" für E-Mail)
    // 4. Klicke "Link erstellen"
    // 5. Kopiere die entry.XXXXXXXXX Parameter aus der generierten URL
    // 6. Ersetze die Werte unten:
    
    // DIESE MÜSSEN ANGEPASST WERDEN:
    params.set('entry.123456789', subscriberId); // ← ECHTE Entry-ID für Abonnenten-ID eintragen
    params.set('entry.987654321', email);        // ← ECHTE Entry-ID für E-Mail eintragen
    
    return `${cleanUrl}?${params.toString()}`;
  } catch (error) {
    Logger.log(`Fehler beim Erstellen des Forms-Links: ${error.message}`);
    // Fallback: Basis-URL mit einfachem Parameter
    return `${baseFormsUrl}${baseFormsUrl.includes('?') ? '&' : '?'}subscriber_id=${subscriberId}`;
  }
}

/**
 * Hilfsfunktion um die richtigen Google Forms Entry-IDs zu ermitteln
 */
function getFormsEntryIds() {
  const ui = SpreadsheetApp.getUi();
  ui.alert(
    'Google Forms Entry-IDs ermitteln',
    'Um die korrekten Entry-IDs für die Vorabfüllung zu ermitteln:\n\n' +
    '1. Öffne das Google Forms in der Tourverwaltung\n' +
    '2. Klicke auf "Antworten" → "Antworten vorab ausfüllen"\n' +
    '3. Fülle Testdaten ein\n' +
    '4. Klicke "Link erstellen"\n' +
    '5. Kopiere aus der URL die "entry.XXXXXXXXX" Parameter\n' +
    '6. Ersetze diese in der createPersonalizedFormsLink Funktion\n\n' +
    'Beispiel-URL:\n' +
    'https://docs.google.com/forms/d/e/.../viewform?usp=pp_url&entry.123456789=test_id&entry.987654321=test@email.com',
    ui.ButtonSet.OK
  );
}

/**
 * Stellt sicher, dass eine Spalte "Abstimmungs-Link" in der Newsletter-Abonnenten Tabelle existiert
 * @param {Sheet} sheet - Das Newsletter-Abonnenten Tabellenblatt
 */
function ensureVotingLinkColumn(sheet) {
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  // Prüfe, ob die Spalte bereits existiert
  if (headers.indexOf('Abstimmungs-Link') === -1) {
    // Spalte existiert nicht - füge sie hinzu
    const newColumnIndex = headers.length + 1; // Nach der letzten vorhandenen Spalte
    
    // Setze den Header
    sheet.getRange(1, newColumnIndex).setValue('Abstimmungs-Link').setFontWeight('bold');
    
    // Setze Spaltenbreite für bessere Lesbarkeit
    sheet.setColumnWidth(newColumnIndex, 300);
    
    Logger.log('Spalte "Abstimmungs-Link" wurde zur Newsletter-Abonnenten Tabelle hinzugefügt.');
  }
}

/**
 * Migriert bestehende Abstimmungs-Links vom alten "Abstimmungs-Links" Blatt
 * in die "Newsletter-Abonnenten" Tabelle
 */
function migrateVotingLinksToMainTable() {
  const ui = SpreadsheetApp.getUi();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  const oldSheet = ss.getSheetByName('Abstimmungs-Links');
  const mainSheet = ss.getSheetByName('Newsletter-Abonnenten');
  
  if (!oldSheet) {
    ui.alert('Info', 'Kein "Abstimmungs-Links" Blatt gefunden - nichts zu migrieren.', ui.ButtonSet.OK);
    return;
  }
  
  if (!mainSheet) {
    ui.alert('Fehler', 'Das Blatt "Newsletter-Abonnenten" wurde nicht gefunden.', ui.ButtonSet.OK);
    return;
  }
  
  // Stelle sicher, dass die Abstimmungs-Link Spalte existiert
  ensureVotingLinkColumn(mainSheet);
  
  const oldData = oldSheet.getDataRange().getValues();
  const mainData = mainSheet.getDataRange().getValues();
  const mainHeaders = mainData[0];
  
  const emailIndex = mainHeaders.indexOf('Email') !== -1 ? mainHeaders.indexOf('Email') : 0;
  const votingLinkIndex = mainHeaders.indexOf('Abstimmungs-Link');
  
  let migratedCount = 0;
  
  // Überspringe Header-Zeile
  for (let i = 1; i < oldData.length; i++) {
    const oldEmail = oldData[i][0];
    const oldLink = oldData[i][1];
    
    if (!oldEmail || !oldLink) continue;
    
    // Finde entsprechende Zeile in der Haupttabelle
    for (let j = 1; j < mainData.length; j++) {
      const mainEmail = mainData[j][emailIndex];
      
      if (mainEmail === oldEmail) {
        // Gefunden - übertrage den Link
        mainSheet.getRange(j + 1, votingLinkIndex + 1).setValue(oldLink);
        migratedCount++;
        break;
      }
    }
  }
  
  ui.alert('Migration abgeschlossen', 
    `${migratedCount} Abstimmungs-Links wurden erfolgreich von "Abstimmungs-Links"\n` +
    'in die "Newsletter-Abonnenten" Tabelle migriert.\n\n' +
    'Das alte Blatt kann jetzt gelöscht werden.',
    ui.ButtonSet.OK);
}

/**
 * Test-Funktion die direkt im Apps Script Editor ausgeführt werden kann
 * Ruft generateVotingLinks auf mit vordefinierten Werten
 */
function testGenerateVotingLinks() {
  // Direkte Ausführung ohne UI-Prompts für Testzwecke
  const TOUR_MGMT_ID = 'HIER_DEINE_TOURVERWALTUNGS_ID_EINTRAGEN'; // ← Hier deine Tourverwaltungs-ID eintragen
  
  if (TOUR_MGMT_ID === 'HIER_DEINE_TOURVERWALTUNGS_ID_EINTRAGEN') {
    console.log('FEHLER: Bitte trage zuerst deine Tourverwaltungs-Spreadsheet-ID in Zeile 6 ein!');
    return;
  }
  
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Newsletter-Abonnenten');
    
    if (!sheet) {
      console.log('FEHLER: Newsletter-Abonnenten Blatt nicht gefunden');
      return;
    }
    
    // Tourverwaltung öffnen
    const tourMgmtSs = SpreadsheetApp.openById(TOUR_MGMT_ID);
    const settingsSheet = tourMgmtSs.getSheetByName('Einstellungen');
    
    if (!settingsSheet) {
      console.log('FEHLER: Einstellungen-Blatt in Tourverwaltung nicht gefunden');
      return;
    }
    
    // Forms-URL suchen
    const settingsData = settingsSheet.getDataRange().getValues();
    let formsUrl = null;
    
    for (let i = 0; i < settingsData.length; i++) {
      if (settingsData[i][0] === 'Abstimmungs-Forms-URL') {
        formsUrl = settingsData[i][1];
        break;
      }
    }
    
    if (!formsUrl) {
      console.log('FEHLER: Keine Abstimmungs-Forms-URL in der Tourverwaltung gefunden. Bitte erstelle zuerst ein Google Forms.');
      return;
    }
    
    console.log(`Forms-URL gefunden: ${formsUrl}`);
    
    // Abstimmungs-Link Spalte sicherstellen
    ensureVotingLinkColumn(sheet);
    
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    
    const emailIndex = headers.indexOf('Email') !== -1 ? headers.indexOf('Email') : 0;
    const subscriberIdIndex = headers.indexOf('SubscriberID') !== -1 ? headers.indexOf('SubscriberID') : 2;
    const votingLinkIndex = headers.indexOf('Abstimmungs-Link');
    
    if (votingLinkIndex === -1) {
      console.log('FEHLER: Abstimmungs-Link Spalte konnte nicht erstellt werden');
      return;
    }
    
    let updatedCount = 0;
    
    // Links erstellen für alle Abonnenten
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const email = row[emailIndex];
      const subscriberId = row[subscriberIdIndex];
      
      if (email && subscriberId) {
        const personalFormsLink = createPersonalizedFormsLink(formsUrl, subscriberId, email);
        sheet.getRange(i + 1, votingLinkIndex + 1).setValue(personalFormsLink);
        updatedCount++;
      }
    }
    
    console.log(`ERFOLG: ${updatedCount} personalisierte Links erstellt!`);
    console.log('Die Links wurden in der Newsletter-Abonnenten Tabelle gespeichert.');
    
  } catch (error) {
    console.log(`FEHLER: ${error.message}`);
  }
} 