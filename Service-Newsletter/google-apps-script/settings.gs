/**
 * Diese Datei enthält Funktionen zur Verwaltung von Skript-Einstellungen.
 * 
 * HINWEIS: @OnlyCurrentDoc wurde entfernt, damit das Script auf andere Spreadsheets zugreifen kann.
 */

/**
 * WICHTIG: Führen Sie diese Funktion einmalig aus, um alle notwendigen Einstellungen zu konfigurieren
 */
function setupNewsletterSettings() {
  const properties = PropertiesService.getScriptProperties();
  
  // ACHTUNG: Ersetzen Sie diese IDs durch Ihre eigenen!
  const settings = {
    // ID des Google Sheets für Newsletter-Abonnenten
    // Format: https://docs.google.com/spreadsheets/d/[DIESE_ID]/edit
    'SHEET_ID': 'IHRE_SPREADSHEET_ID_HIER_EINFUEGEN',
    
    // Gmail Label für Newsletter-Anmeldungen
    'NEWSLETTER_LABEL': 'Newsletter-Anmeldungen',
    
    // Test-E-Mail für Newsletter-Tests
    'TEST_EMAIL': 'ihre.test@email.de',
    
    // Name des Absenders
    'SENDER_NAME': 'Hoffnungsradler Dülmen e.V.',
    
    // Website URL
    'WEBSITE_URL': 'https://www.hoffnungs-radler-duelmen.de'
  };
  
  // Alle Einstellungen setzen
  for (const [key, value] of Object.entries(settings)) {
    properties.setProperty(key, value);
    Logger.log(`Einstellung gesetzt: ${key} = ${value}`);
  }
  
  Logger.log('Setup abgeschlossen! Bitte überprüfen Sie alle IDs und passen Sie sie an.');
  Logger.log('WICHTIG: Vergessen Sie nicht, die SHEET_ID durch Ihre echte Spreadsheet-ID zu ersetzen!');
}

/**
 * Funktion zum Abrufen einer Einstellung
 */
function getSetting(key) {
  return PropertiesService.getScriptProperties().getProperty(key);
}

/**
 * Funktion zum Setzen einer einzelnen Einstellung
 */
function setSetting(key, value) {
  PropertiesService.getScriptProperties().setProperty(key, value);
  Logger.log(`Einstellung aktualisiert: ${key} = ${value}`);
}

/**
 * Alle aktuellen Einstellungen anzeigen
 */
function showCurrentSettings() {
  const properties = PropertiesService.getScriptProperties().getProperties();
  Logger.log('=== AKTUELLE EINSTELLUNGEN ===');
  for (const [key, value] of Object.entries(properties)) {
    Logger.log(`${key}: ${value}`);
  }
}

/**
 * Überprüfung, ob alle notwendigen Einstellungen gesetzt sind
 */
function validateSettings() {
  const requiredSettings = ['SHEET_ID', 'NEWSLETTER_LABEL', 'SENDER_NAME'];
  const properties = PropertiesService.getScriptProperties();
  const missing = [];
  
  for (const setting of requiredSettings) {
    const value = properties.getProperty(setting);
    if (!value || value === 'IHRE_SPREADSHEET_ID_HIER_EINFUEGEN') {
      missing.push(setting);
    }
  }
  
  if (missing.length > 0) {
    Logger.log('❌ FEHLENDE EINSTELLUNGEN: ' + missing.join(', '));
    Logger.log('Führen Sie setupNewsletterSettings() aus und passen Sie die Werte an!');
    return false;
  } else {
    Logger.log('✅ Alle Einstellungen sind konfiguriert');
    return true;
  }
} 

/**
 * Wechselt zwischen lokalem und externem Spreadsheet-Modus
 */
function switchToLocalMode() {
  // Backup der processSubscriptionEmail Funktion mit lokalem Modus
  const ui = SpreadsheetApp.getUi();
  const result = ui.alert(
    'Lokaler Modus aktivieren?',
    'Möchten Sie das Newsletter-System so konfigurieren, dass es das aktuelle Spreadsheet verwendet?\n\n' +
    'Dies ist sicherer und benötigt weniger Berechtigungen.\n\n' +
    'ACHTUNG: Das Sheet "Newsletter-Abonnenten" muss im aktuellen Spreadsheet existieren!',
    ui.ButtonSet.YES_NO
  );
  
  if (result === ui.Button.YES) {
    // Code.gs modifizieren um lokale Funktion zu verwenden
    Logger.log('✅ Lokaler Modus wird aktiviert...');
    Logger.log('HINWEIS: Sie müssen in Code.gs die Zeile ändern:');
    Logger.log('Von: saveSubscriberToSheet(email, subscriberId, unsubscribeLink);');
    Logger.log('Zu:   saveSubscriberToSheetLocal(email, subscriberId, unsubscribeLink);');
    
    // Setting für lokalen Modus setzen
    PropertiesService.getScriptProperties().setProperty('USE_LOCAL_SHEET', 'true');
    
    ui.alert('Lokaler Modus aktiviert', 
      'Das System wurde auf lokalen Modus umgestellt.\n\n' +
      'Erstellen Sie jetzt ein Sheet "Newsletter-Abonnenten" in diesem Spreadsheet falls noch nicht vorhanden.',
      ui.ButtonSet.OK);
  }
}

/**
 * Erstellt das Newsletter-Abonnenten Sheet im aktuellen Spreadsheet
 */
function createLocalNewsletterSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  
  // Prüfen ob Sheet bereits existiert
  if (spreadsheet.getSheetByName('Newsletter-Abonnenten')) {
    Logger.log('Sheet "Newsletter-Abonnenten" existiert bereits');
    SpreadsheetApp.getUi().alert('Sheet existiert bereits', 'Das Sheet "Newsletter-Abonnenten" ist bereits vorhanden.', SpreadsheetApp.getUi().ButtonSet.OK);
    return;
  }
  
  // Neues Sheet erstellen
  const sheet = spreadsheet.insertSheet('Newsletter-Abonnenten');
  
  // Header hinzufügen
  const headers = ['E-Mail', 'Anmeldedatum', 'Abonnenten-ID', 'Abmelde-Link', 'Status'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Formatierung
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  sheet.autoResizeColumns(1, headers.length);
  
  Logger.log('✅ Newsletter-Abonnenten Sheet wurde erstellt');
  SpreadsheetApp.getUi().alert('Sheet erstellt', 'Das Sheet "Newsletter-Abonnenten" wurde erfolgreich erstellt.', SpreadsheetApp.getUi().ButtonSet.OK);
} 