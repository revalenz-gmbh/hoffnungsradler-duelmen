// Google Apps Script: Spendenverwaltung API - Erweiterte Version
// Hoffnungsradler Dülmen e.V.
// Version 2.0 - Vollständige Buchhaltung

// =============================================================================
// API ENDPOINTS (doGet & doPost)
// =============================================================================

function doGet(e) {
  var action = e.parameter.action;
  
  try {
    // Öffentliche API-Endpunkte (nur aggregierte, nicht-personenbezogene Daten)
    switch(action) {
      case 'getUebergabeSummen':
        return createJsonResponse(getUebergabeSummen());
      case 'getDashboard':
        return createJsonResponse(getDashboardData());
      case 'getJahresabschluss':
        var year = e.parameter.year || new Date().getFullYear();
        return createJsonResponse(getJahresabschluss(year));
      case 'getAllYearlyData':
        return createJsonResponse(getAllYearlyDonationData());
      
      // Sensible Endpunkte blockiert (Datenschutz)
      case 'getDonations':
        return createJsonResponse({ 
          error: 'Dieser Endpunkt ist aus Datenschutzgründen nicht öffentlich verfügbar.' 
        }, 403);
      
      default:
        return createJsonResponse({ error: 'Unknown action: ' + action }, 400);
    }
  } catch(error) {
    return createJsonResponse({ error: error.toString() }, 500);
  }
}

function doPost(e) {
  try {
  var data = JSON.parse(e.postData.contents);
    
    // POST-Endpunkte sind derzeit NICHT öffentlich verfügbar
    // Alle Schreib-Operationen erfolgen direkt im Spreadsheet
    return createJsonResponse({ 
      error: 'POST-Operationen sind aus Sicherheitsgründen nicht über die öffentliche API verfügbar.' 
    }, 403);
    
  } catch(error) {
    return createJsonResponse({ error: error.toString() }, 500);
  }
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function createJsonResponse(data, statusCode) {
  statusCode = statusCode || 200;
  var output = ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
  
  // CORS Headers
  if (statusCode !== 200) {
    Logger.log('Error response: ' + JSON.stringify(data));
  }
  
  return output;
}

// =============================================================================
// MENÜ & SETUP
// =============================================================================

function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('📊 Buchhaltung')
    .addSubMenu(ui.createMenu('Tabellen anlegen')
      .addItem('Dashboard anlegen', 'createDashboardSheet')
      .addItem('Mitglieder anlegen', 'createMitgliederSheet')
      .addItem('Zahlungseingänge Konto anlegen', 'createKontoSheet')
      .addItem('Bargeldspenden anlegen', 'createBargeldSheet')
      .addItem('Ausgaben anlegen', 'createAusgabenSheet')
      .addItem('Übergebene Spenden anlegen', 'createUebergabeSheet')
      .addItem('Spendenquittungen anlegen', 'createQuittungenSheet')
      .addItem('Import-Regeln anlegen', 'createImportRulesSheet'))
    .addSeparator()
    .addSubMenu(ui.createMenu('Aktionen')
      .addItem('Dashboard aktualisieren', 'updateDashboard')
      .addItem('📥 Kontoauszug importieren (CSV)', 'showCSVImportDialog')
      .addItem('🔧 Datumsspalten korrigieren', 'fixDateColumns')
      .addItem('📊 Alle Tabellen sortieren (neueste zuerst)', 'sortAllSheetsByDate')
      .addItem('Jahresabschluss erstellen', 'showJahresabschlussDialog')
      .addItem('Quittung ausstellen', 'showQuittungDialog')
      .addItem('📧 Quittung per E-Mail versenden', 'sendReceiptEmailManual')
      .addItem('Mitglieder-Zuordnung aktualisieren', 'matchAllPaymentsToMembers'))
    .addSeparator()
    .addSubMenu(ui.createMenu('👥 Mitglieder')
      .addItem('Mitglieder-Info erstellen', 'createMemberInfoSheet')
      .addItem('📧 Test-E-Mail senden', 'sendInfoTest')
      .addItem('Mitglieder-Info versenden', 'sendInfoToAllMembers'))
    .addSeparator()
    .addSubMenu(ui.createMenu('🔄 Import')
      .addItem('Import-Regeln bearbeiten', 'openImportRulesSheet')
      .addItem('Bekannte Spender anzeigen', 'showKnownDonorsDialog'))
    .addSeparator()
    .addSubMenu(ui.createMenu('💾 Backup')
      .addItem('Backup jetzt erstellen', 'createBackupNow')
      .addItem('Automatisches Backup einrichten', 'setupAutomaticBackup'))
    .addSeparator()
    .addItem('Alle Tabellen neu anlegen', 'createAllSheets')
    .addToUi();
}

function createAllSheets() {
  createDashboardSheet();
  createMitgliederSheet();
  createKontoSheet();
  createBargeldSheet();
  createAusgabenSheet();
  createUebergabeSheet();
  createQuittungenSheet();
  createImportRulesSheet();
  updateDashboard();
  SpreadsheetApp.getUi().alert('✅ Alle Tabellen wurden erfolgreich angelegt!\n\nSie können jetzt mit der Buchhaltung beginnen.\n\n💡 TIPP: Verwenden Sie Copy & Paste, um Kontoauszüge direkt aus Excel einzufügen.');
}

// =============================================================================
// DASHBOARD
// =============================================================================

function createDashboardSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Dashboard');
  
  if (!sheet) {
    sheet = ss.insertSheet('Dashboard', 0); // Als erstes Blatt
  } else {
    sheet.clear();
  }
  
  // Überschrift
  sheet.getRange('A1').setValue('📊 BUCHHALTUNGS-DASHBOARD');
  sheet.getRange('A1').setFontSize(18).setFontWeight('bold').setBackground('#1a73e8').setFontColor('#ffffff');
  sheet.getRange('A1:E1').merge();
  
  // Jahr-Auswahl
  var currentYear = new Date().getFullYear();
  sheet.getRange('A3').setValue('Jahr:');
  sheet.getRange('B3').setValue(currentYear);
  sheet.getRange('A3:B3').setFontWeight('bold').setBackground('#f3f3f3');
  
  // Anfangsbestand für das Jahr
  sheet.getRange('D3').setValue('Anfangsbestand:');
  sheet.getRange('E3').setValue(0);
  sheet.getRange('E3').setNumberFormat('#,##0.00 €');
  sheet.getRange('D3:E3').setFontWeight('bold').setBackground('#fff3e0');
  sheet.getRange('D3').setNote('Tragen Sie hier den Kontostand vom 01.01. des ausgewählten Jahres ein.');
  
  // Einnahmen-Bereich
  sheet.getRange('A5').setValue('💰 EINNAHMEN');
  sheet.getRange('A5:E5').merge().setBackground('#e8f5e9').setFontWeight('bold').setFontSize(14);
  
  var einnahmenHeaders = ['Kategorie', 'Anzahl', 'Summe (€)', 'Letzter Eintrag', 'Status'];
  sheet.getRange('A6:E6').setValues([einnahmenHeaders])
    .setFontWeight('bold')
    .setBackground('#c8e6c9')
    .setHorizontalAlignment('center');
  
  // Zeilen für Einnahmen
  // ACHTUNG: Neue Spaltenstruktur - Betrag ist jetzt Spalte I (9), Datum ist Spalte B (2), Kategorie ist Spalte L (12)
  // WICHTIG: "Bargeldeinzahlung (intern)" wird NICHT gezählt, um Doppelzählung zu vermeiden!
  var einnahmenRows = [
    ['Zahlungseingänge Konto', '=SUMPRODUCT((YEAR(\'Zahlungseingänge Konto\'!B2:B1000)=B3)*(\'Zahlungseingänge Konto\'!L2:L1000<>"Bargeldeinzahlung (intern)"))', '=SUMPRODUCT((YEAR(\'Zahlungseingänge Konto\'!B2:B1000)=B3)*(\'Zahlungseingänge Konto\'!L2:L1000<>"Bargeldeinzahlung (intern)")*(\'Zahlungseingänge Konto\'!I2:I1000))', '=IFERROR(TEXT(\'Zahlungseingänge Konto\'!B2, "DD.MM.YYYY"), "-")', '✅'],
    ['Bargeldspenden', '=SUMPRODUCT((YEAR(Bargeldspenden!A2:A1000)=B3)*1)', '=SUMPRODUCT((YEAR(Bargeldspenden!A2:A1000)=B3)*(Bargeldspenden!B2:B1000))', '=IFERROR(TEXT(Bargeldspenden!A2, "DD.MM.YYYY"), "-")', '✅'],
    ['Gesamt Einnahmen', '=B7+B8', '=C7+C8', '', '']
  ];
  sheet.getRange('A7:E9').setValues(einnahmenRows);
  sheet.getRange('A7:E8').setBackground('#ffffff'); // Weißer Hintergrund für Datenzeilen
  sheet.getRange('A9:E9').setBackground('#a5d6a7').setFontWeight('bold');
  
  // Ausgaben-Bereich
  sheet.getRange('A11').setValue('💳 AUSGABEN');
  sheet.getRange('A11:E11').merge().setBackground('#ffebee').setFontWeight('bold').setFontSize(14);
  
  var ausgabenHeaders = ['Kategorie', 'Anzahl', 'Summe (€)', 'Letzter Eintrag', 'Status'];
  sheet.getRange('A12:E12').setValues([ausgabenHeaders])
    .setFontWeight('bold')
    .setBackground('#ffcdd2')
    .setHorizontalAlignment('center');
  
  var ausgabenRows = [
    ['Ausgaben', '=SUMPRODUCT((YEAR(Ausgaben!A2:A1000)=B3)*1)', '=SUMPRODUCT((YEAR(Ausgaben!A2:A1000)=B3)*(Ausgaben!B2:B1000))', '=IFERROR(TEXT(Ausgaben!A2, "DD.MM.YYYY"), "-")', '✅'],
    ['Übergebene Spenden', '=COUNTIF(\'Übergebene Spenden\'!A2:A100, B3)', '=SUMIF(\'Übergebene Spenden\'!A2:A100, B3, \'Übergebene Spenden\'!B2:B100)', '=IFERROR(TEXT(\'Übergebene Spenden\'!D2, "DD.MM.YYYY"), "-")', '✅'],
    ['Gesamt Ausgaben', '=B13+B14', '=C13+C14', '', '']
  ];
  sheet.getRange('A13:E15').setValues(ausgabenRows);
  sheet.getRange('A13:E14').setBackground('#ffffff'); // Weißer Hintergrund für Datenzeilen
  sheet.getRange('A15:E15').setBackground('#ef9a9a').setFontWeight('bold');
  
  // Saldo-Bereich
  sheet.getRange('A17').setValue('💵 SALDO');
  sheet.getRange('A17:E17').merge().setBackground('#e3f2fd').setFontWeight('bold').setFontSize(14);
  
  sheet.getRange('A18').setValue('Anfangsbestand');
  sheet.getRange('C18').setValue('=E3');
  sheet.getRange('A18:C18').setBackground('#e3f2fd').setFontSize(11);
  
  sheet.getRange('A19').setValue('Einnahmen - Ausgaben');
  sheet.getRange('C19').setValue('=C9-C15');
  sheet.getRange('A19:C19').setBackground('#e3f2fd').setFontSize(11);
  
  sheet.getRange('A20').setValue('Endbestand');
  sheet.getRange('C20').setValue('=C18+C19');
  sheet.getRange('A20:C20').setBackground('#90caf9').setFontWeight('bold').setFontSize(12);
  
  // Quittungen-Bereich
  sheet.getRange('A22').setValue('📄 SPENDENQUITTUNGEN');
  sheet.getRange('A22:E22').merge().setBackground('#fff3e0').setFontWeight('bold').setFontSize(14);
  
  var quittungHeaders = ['Kategorie', 'Ausgestellt', 'Offen', 'Letzte Nr.', 'Status'];
  sheet.getRange('A23:E23').setValues([quittungHeaders])
    .setFontWeight('bold')
    .setBackground('#ffe0b2')
    .setHorizontalAlignment('center');
  
  // ACHTUNG: Neue Spaltenstruktur - Quittung ist jetzt Spalte M (13), Quittungsnummer ist Spalte N (14)
  var quittungRows = [
    ['Konto-Quittungen', '=IFERROR(COUNTIF(\'Zahlungseingänge Konto\'!M2:M1000, "Ja"), 0)', '=IFERROR(COUNTIFS(\'Zahlungseingänge Konto\'!M2:M1000, "<>Ja", \'Zahlungseingänge Konto\'!M2:M1000, "<>"), 0)', '=IFERROR(MAX(\'Zahlungseingänge Konto\'!N2:N1000), "-")', '✅'],
    ['Bargeld-Quittungen', '=IFERROR(COUNTIF(Bargeldspenden!E2:E1000, "Ja"), 0)', '=IFERROR(COUNTIFS(Bargeldspenden!E2:E1000, "<>Ja", Bargeldspenden!E2:E1000, "<>"), 0)', '=IFERROR(MAX(Bargeldspenden!F2:F1000), "-")', '✅'],
    ['Gesamt', '=B24+B25', '=C24+C25', '', '']
  ];
  sheet.getRange('A24:E26').setValues(quittungRows);
  sheet.getRange('A26:E26').setBackground('#ffcc80').setFontWeight('bold');
  
  // Spaltenbreiten
  sheet.setColumnWidth(1, 220);
  sheet.setColumnWidth(2, 100);
  sheet.setColumnWidth(3, 120);
  sheet.setColumnWidth(4, 120);
  sheet.setColumnWidth(5, 80);
  
  // Zahlenformatierung
  sheet.getRange('C7:C18').setNumberFormat('#,##0.00 €');
  
  // Freeze
  sheet.setFrozenRows(1);

  SpreadsheetApp.getUi().alert('✅ Dashboard wurde erfolgreich angelegt!\n\nDas Dashboard wird automatisch aktualisiert, wenn Sie Daten in den anderen Tabellen ändern.');
}

function updateDashboard() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Dashboard');
  if (!sheet) {
    createDashboardSheet();
    return;
  }
  
  // Aktuelles Jahr setzen
  var currentYear = new Date().getFullYear();
  sheet.getRange('B3').setValue(currentYear);
  
  SpreadsheetApp.flush();
  SpreadsheetApp.getUi().alert('✅ Dashboard wurde aktualisiert!');
}

function getDashboardData() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var dashboardSheet = ss.getSheetByName('Dashboard');
  
  if (!dashboardSheet) {
    throw new Error('Dashboard-Sheet existiert nicht. Bitte zuerst anlegen.');
  }
  
  var currentYear = dashboardSheet.getRange('B3').getValue();
  
  return {
    year: currentYear,
    einnahmen: {
      konto: {
        anzahl: dashboardSheet.getRange('B7').getValue(),
        summe: dashboardSheet.getRange('C7').getValue(),
        letzter: dashboardSheet.getRange('D7').getValue()
      },
      bargeld: {
        anzahl: dashboardSheet.getRange('B8').getValue(),
        summe: dashboardSheet.getRange('C8').getValue(),
        letzter: dashboardSheet.getRange('D8').getValue()
      },
      gesamt: dashboardSheet.getRange('C9').getValue()
    },
    ausgaben: {
      allgemein: {
        anzahl: dashboardSheet.getRange('B13').getValue(),
        summe: dashboardSheet.getRange('C13').getValue(),
        letzter: dashboardSheet.getRange('D13').getValue()
      },
      uebergeben: {
        anzahl: dashboardSheet.getRange('B14').getValue(),
        summe: dashboardSheet.getRange('C14').getValue(),
        letzter: dashboardSheet.getRange('D14').getValue()
      },
      gesamt: dashboardSheet.getRange('C15').getValue()
    },
    saldo: dashboardSheet.getRange('C18').getValue(),
    quittungen: {
      konto: {
        ausgestellt: dashboardSheet.getRange('B22').getValue(),
        offen: dashboardSheet.getRange('C22').getValue()
      },
      bargeld: {
        ausgestellt: dashboardSheet.getRange('B23').getValue(),
        offen: dashboardSheet.getRange('C23').getValue()
      }
    }
  };
}

// =============================================================================
// TABELLEN ERSTELLEN
// =============================================================================

function createMitgliederSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Mitglieder');
  if (!sheet) {
    sheet = ss.insertSheet('Mitglieder');
  } else {
    sheet.clear();
  }
  
  // Spaltenüberschriften
  var headers = [
    'Nr.',
    'Vorname, Name',
    'Anschrift',
    'Email',
    'Telefon',
    'Eintrittsdatum',
    'Beitragsstatus',
    'Notizen',
    'DSGVO-Einwilligung',
    'Zahlungsart',
    'IBAN (für Lastschrift)',
    'Beitrag 2025',
    'Status 2025'
  ];
  
  sheet.appendRow(headers);
  var headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#e3f2fd'); // Hellblau
  headerRange.setFontSize(12);
  headerRange.setHorizontalAlignment('center');
  
  // Spaltenbreiten
  var widths = [
    60,   // Nr.
    200,  // Vorname, Name
    250,  // Anschrift
    200,  // Email
    120,  // Telefon
    110,  // Eintrittsdatum
    150,  // Beitragsstatus
    200,  // Notizen
    140,  // DSGVO-Einwilligung
    120,  // Zahlungsart
    200,  // IBAN
    100,  // Beitrag 2025
    120   // Status 2025
  ];
  for (var i = 0; i < widths.length; i++) {
    sheet.setColumnWidth(i + 1, widths[i]);
  }
  
  // Formatierung
  // Eintrittsdatum
  sheet.getRange('F2:F1000').setNumberFormat('dd.mm.yyyy');
  
  // IBAN: Großbuchstaben und ohne Leerzeichen speichern (für Matching)
  // Aber Formatierung mit Leerzeichen anzeigen
  
  // Dropdown für Beitragsstatus
  var statusRange = sheet.getRange('G2:G1000');
  var statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Aktiv', 'Passiv', 'Ausgetreten', 'Verstorben'], true)
    .build();
  statusRange.setDataValidation(statusRule);
  
  // Dropdown für DSGVO-Einwilligung
  var dsgvoRange = sheet.getRange('I2:I1000');
  var dsgvoRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Ja', 'Nein', 'Teilweise'], true)
    .build();
  dsgvoRange.setDataValidation(dsgvoRule);
  
  // Dropdown für Zahlungsart
  var zahlungsartRange = sheet.getRange('J2:J1000');
  var zahlungsartRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Überweisung', 'Lastschrift', 'Bar', 'Sonstiges'], true)
    .build();
  zahlungsartRange.setDataValidation(zahlungsartRule);
  
  // Dropdown für Status 2025
  var status2025Range = sheet.getRange('M2:M1000');
  var status2025Rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Bezahlt', 'Offen', 'Teilweise', 'Befreit'], true)
    .build();
  status2025Range.setDataValidation(status2025Rule);
  
  // Formatierung Beitrag 2025
  sheet.getRange('L2:L1000').setNumberFormat('#,##0.00 €');
  
  // Hinweis-Zeile
  sheet.getRange('A2').setValue('Beispiel:');
  sheet.getRange('B2').setValue('Max Mustermann');
  sheet.getRange('K2').setValue('DE89370400440532013000');
  sheet.getRange('M2').setValue('Offen');
  sheet.getRange('A2:M2').setFontStyle('italic').setBackground('#f5f5f5');
  
  sheet.setFrozenRows(1);
  
  SpreadsheetApp.getUi().alert(
    '✅ Tabellenblatt "Mitglieder" wurde angelegt!\n\n' +
    '💡 TIPP: Tragen Sie alle Mitglieder ein. Das System erkennt automatisch Zahlungseingänge von Mitgliedern\n' +
    'und ordnet sie der richtigen Mitgliedsnummer zu!'
  );
}

function createKontoSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Zahlungseingänge Konto');
  if (!sheet) {
    sheet = ss.insertSheet('Zahlungseingänge Konto');
  } else {
    sheet.clear();
  }
  
  // CSV-Format: Sparkassen Export-Struktur
  // Zuerst die CSV-Spalten (können direkt per Copy-Paste importiert werden)
  var csvHeaders = [
    'Auftragskonto',
    'Buchungstag',
    'Valutadatum',
    'Buchungstext',
    'Verwendungszweck',
    'Begünstigter',
    'Kontonummer',
    'BIC (SWIFT)',
    'Betrag',
    'Waehrung',
    'Info',
    'Kategorie'
  ];
  
  // Zusätzliche Spalten für Vereinsverwaltung
  var additionalHeaders = [
    'Quittung ausgestellt',
    'Quittungsnummer',
    'Mitgliedsnummer',
    'Bemerkung'
  ];
  
  // Zusammenführen
  var headers = csvHeaders.concat(additionalHeaders);
  
  sheet.appendRow(headers);
  var headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#e8f5e9');
  headerRange.setFontSize(12);
  headerRange.setHorizontalAlignment('center');
  
  // Spaltenbreiten anpassen
  var widths = [
    120,  // Auftragskonto
    110,  // Buchungstag
    110,  // Valutadatum
    150,  // Buchungstext
    200,  // Verwendungszweck
    180,  // Begünstigter
    150,  // Kontonummer
    120,  // BIC (SWIFT)
    100,  // Betrag
    80,   // Waehrung
    150,  // Info
    150,  // Kategorie (CSV)
    140,  // Quittung ausgestellt
    140,  // Quittungsnummer
    120,  // Mitgliedsnummer
    200   // Bemerkung
  ];
  for (var i = 0; i < widths.length; i++) {
    sheet.setColumnWidth(i + 1, widths[i]);
  }
  
  // Formatierung
  // Betrag (Spalte I = 9)
  var betragRange = sheet.getRange('I2:I1000');
  betragRange.setNumberFormat('#,##0.00 €');
  
  // Datum (Spalte B = 2, Buchungstag)
  var datumRange = sheet.getRange('B2:B1000');
  datumRange.setNumberFormat('dd.mm.yyyy');
  
  // Valutadatum (Spalte C = 3)
  var valutaRange = sheet.getRange('C2:C1000');
  valutaRange.setNumberFormat('dd.mm.yyyy');
  
  // Dropdown für Kategorie (Spalte L = 12)
  var kategorieRange = sheet.getRange('L2:L1000');
  var kategorieRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Spende', 'Mitgliedsbeitrag', 'Förderung', 'Bargeldeinzahlung (intern)', 'Sonstiges'], true)
    .build();
  kategorieRange.setDataValidation(kategorieRule);
  
  // Dropdown für Quittung (Spalte M = 13)
  var quittungRange = sheet.getRange('M2:M1000');
  var quittungRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Ja', 'Nein'], true)
    .build();
  quittungRange.setDataValidation(quittungRule);
  
  // Standardwert "Nein" für Quittung
  sheet.getRange('M2').setValue('Nein');
  
  // Währung Standard (Spalte J = 10)
  var waehrungRange = sheet.getRange('J2:J1000');
  var waehrungRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['EUR', 'USD', 'GBP'], true)
    .build();
  waehrungRange.setDataValidation(waehrungRule);
  sheet.getRange('J2').setValue('EUR');
  
  sheet.setFrozenRows(1);
  
  SpreadsheetApp.getUi().alert(
    '✅ Tabellenblatt "Zahlungseingänge Konto" wurde angelegt!\n\n' +
    '💡 TIPP: Sie können jetzt CSV-Daten direkt per Copy & Paste einfügen.\n' +
    'Die ersten 12 Spalten entsprechen dem Sparkassen-Export-Format.'
  );
}

function createBargeldSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Bargeldspenden');
  if (!sheet) {
    sheet = ss.insertSheet('Bargeldspenden');
  } else {
    sheet.clear();
  }
  var headers = [
    'Datum',
    'Betrag (€)',
    'Spender/Organisation (optional)',
    'Anlass/Ort',
    'Quittung ausgestellt',
    'Quittungsnummer',
    'Bemerkung'
  ];
  sheet.appendRow(headers);
  var headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#fffde7');
  headerRange.setFontSize(12);
  headerRange.setHorizontalAlignment('center');
  var widths = [110, 100, 200, 180, 140, 140, 200];
  for (var i = 0; i < widths.length; i++) {
    sheet.setColumnWidth(i + 1, widths[i]);
  }
  
  // Dropdown für Quittung
  var quittungRange = sheet.getRange('E2:E1000');
  var quittungRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Ja', 'Nein'], true)
    .build();
  quittungRange.setDataValidation(quittungRule);
  
  sheet.setFrozenRows(1);
  SpreadsheetApp.getUi().alert('✅ Tabellenblatt "Bargeldspenden" wurde angelegt.');
}

function createAusgabenSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Ausgaben');
  if (!sheet) {
    sheet = ss.insertSheet('Ausgaben');
  } else {
    sheet.clear();
  }
  var headers = [
    'Datum',
    'Betrag (€)',
    'Empfänger',
    'Zweck',
    'Kategorie',
    'Belegnummer',
    'Bemerkung'
  ];
  sheet.appendRow(headers);
  var headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#fce4ec');
  headerRange.setFontSize(12);
  headerRange.setHorizontalAlignment('center');
  var widths = [110, 100, 180, 200, 150, 120, 200];
  for (var i = 0; i < widths.length; i++) {
    sheet.setColumnWidth(i + 1, widths[i]);
  }
  
  // Dropdown für Kategorie
  var kategorieRange = sheet.getRange('E2:E1000');
  var kategorieRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Verwaltung', 'Material', 'Veranstaltung', 'Werbung', 'Sonstiges'], true)
    .build();
  kategorieRange.setDataValidation(kategorieRule);
  
  sheet.setFrozenRows(1);
  SpreadsheetApp.getUi().alert('✅ Tabellenblatt "Ausgaben" wurde angelegt.');
}

function createUebergabeSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Übergebene Spenden');
  if (!sheet) {
    sheet = ss.insertSheet('Übergebene Spenden');
  } else {
    sheet.clear();
  }
  var headers = [
    'Jahr',
    'Betrag (€)',
    'Empfängerorganisation',
    'Datum der Übergabe',
    'Anlass/Veranstaltung',
    'Übergeben von',
    'Kontakt Organisation',
    'Bemerkung'
  ];
  sheet.appendRow(headers);
  var headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#e1bee7');
  headerRange.setFontSize(12);
  headerRange.setHorizontalAlignment('center');
  var widths = [60, 100, 220, 120, 180, 140, 180, 200];
  for (var i = 0; i < widths.length; i++) {
    sheet.setColumnWidth(i + 1, widths[i]);
  }
  sheet.setFrozenRows(1);
  SpreadsheetApp.getUi().alert('✅ Tabellenblatt "Übergebene Spenden" wurde angelegt.');
}

function createQuittungenSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Spendenquittungen');
  if (!sheet) {
    sheet = ss.insertSheet('Spendenquittungen');
  } else {
    sheet.clear();
  }
  
  var headers = [
    'Quittungsnummer',
    'Datum Ausstellung',
    'Jahr der Spende',
    'Spender Name',
    'Betrag (€)',
    'Quelltabelle',
    'Zeile in Quelltabelle',
    'Status',
    'E-Mail versendet',
    'E-Mail-Adresse',
    'Versanddatum',
    'Bemerkung'
  ];
  sheet.appendRow(headers);
  var headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#b2dfdb');
  headerRange.setFontSize(12);
  headerRange.setHorizontalAlignment('center');
  var widths = [140, 120, 100, 200, 100, 150, 150, 100, 120, 200, 120, 200];
  for (var i = 0; i < widths.length; i++) {
    sheet.setColumnWidth(i + 1, widths[i]);
  }
  sheet.setFrozenRows(1);
  SpreadsheetApp.getUi().alert('✅ Tabellenblatt "Spendenquittungen" wurde angelegt.');
}

// =============================================================================
// SPENDENQUITTUNGEN
// =============================================================================

/**
 * Findet E-Mail-Adresse für Spender
 */
function findSpenderEmail(spenderName) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 1. Versuche in Mitglieder-Tabelle zu finden
  var mitgliederSheet = ss.getSheetByName('Mitglieder');
  if (mitgliederSheet) {
    var mitgliederValues = mitgliederSheet.getDataRange().getValues();
    for (var i = 1; i < mitgliederValues.length; i++) {
      var row = mitgliederValues[i];
      var name = row[1]; // Spalte B: Vorname, Name
      var email = row[3]; // Spalte D: Email
      
      // Prüfe ob Name übereinstimmt (Normalisiert)
      if (name && email && normalizeName(name).includes(normalizeName(spenderName))) {
        return email.trim();
      }
    }
  }
  
  // 2. Versuche in Zahlungseingängen Konto zu finden (falls IBAN bekannt)
  // Hier könnte man später noch erweitern mit IBAN-basierter Suche
  
  return null;
}

/**
 * Normalisiert Namen für Vergleich
 */
function normalizeName(name) {
  if (!name) return '';
  return name.toLowerCase()
    .replace(/[äÄ]/g, 'ae')
    .replace(/[öÖ]/g, 'oe')
    .replace(/[üÜ]/g, 'ue')
    .replace(/ß/g, 'ss')
    .trim();
}

/**
 * Generiert Quittungs-PDF mit Logo
 */
function generateReceiptPDF(receiptNumber, spenderName, betrag, spendenDatum, quittungsDatum) {
  var formattedBetrag = parseFloat(betrag).toFixed(2).replace('.', ',') + ' €';
  var formattedSpendenDatum = Utilities.formatDate(new Date(spendenDatum), Session.getScriptTimeZone(), 'dd.MM.yyyy');
  var formattedQuittungsDatum = Utilities.formatDate(new Date(quittungsDatum), Session.getScriptTimeZone(), 'dd.MM.yyyy');
  
  // Logo-URL (von der Website) - wird als Bild eingebunden
  var logoUrl = 'https://hoffnungsradler-duelmen.de/logos/aa82fed0-d01b-4922-b10c-c9a4b9dedb38.png';
  
  // Erstelle temporäres Google Docs-Dokument
  var tempDoc = DocumentApp.create('Temp_Receipt_' + receiptNumber);
  var body = tempDoc.getBody();
  
  // Setze Dokumenten-Formatierung
  body.setMarginTop(60);
  body.setMarginBottom(60);
  body.setMarginLeft(60);
  body.setMarginRight(60);
  
  // Header mit Logo und Titel
  var headerParagraph = body.appendParagraph('');
  headerParagraph.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  headerParagraph.setSpacingAfter(20);
  
  try {
    // Lade Logo von URL
    var logoResponse = UrlFetchApp.fetch(logoUrl);
    var logoBlob = logoResponse.getBlob();
    var logoImage = headerParagraph.appendInlineImage(logoBlob);
    logoImage.setWidth(150);
    logoImage.setHeight(150 * (logoBlob.getHeight() / logoBlob.getWidth())); // Behält Seitenverhältnis
    headerParagraph.appendText('\n');
  } catch (e) {
    // Falls Logo nicht geladen werden kann, nur Text
    Logger.log('Logo konnte nicht geladen werden: ' + e.toString());
  }
  
  // Titel
  var titleParagraph = body.appendParagraph('Hoffnungsradler Dülmen e.V.');
  titleParagraph.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  titleParagraph.setHeading(DocumentApp.ParagraphHeading.HEADING1);
  titleParagraph.setFontSize(24);
  titleParagraph.setForegroundColor('#2E7D32');
  titleParagraph.setBold(true);
  titleParagraph.setSpacingAfter(5);
  
  var subtitleParagraph = body.appendParagraph('Spendenquittung');
  subtitleParagraph.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  subtitleParagraph.setFontSize(16);
  subtitleParagraph.setForegroundColor('#666666');
  subtitleParagraph.setSpacingAfter(30);
  
  // Trennlinie
  body.appendHorizontalRule();
  body.appendParagraph('').setSpacingAfter(20);
  
  // Quittungsinformationen
  var infoTable = body.appendTable();
  infoTable.setColumnWidth(0, 240);
  infoTable.setColumnWidth(1, 300);
  
  var row1 = infoTable.appendTableRow();
  row1.appendTableCell('Quittungsnummer:').setFontWeight(true).setFontSize(11);
  row1.appendTableCell(receiptNumber).setFontSize(11).setHorizontalAlignment(DocumentApp.HorizontalAlignment.RIGHT);
  
  var row2 = infoTable.appendTableRow();
  row2.appendTableCell('Ausgestellt am:').setFontWeight(true).setFontSize(11);
  row2.appendTableCell(formattedQuittungsDatum).setFontSize(11).setHorizontalAlignment(DocumentApp.HorizontalAlignment.RIGHT);
  
  body.appendParagraph('').setSpacingAfter(20);
  
  // Highlight-Box (Spender-Info)
  var highlightTable = body.appendTable();
  highlightTable.setColumnWidth(0, 240);
  highlightTable.setColumnWidth(1, 300);
  highlightTable.setBorderColor('#2E7D32');
  highlightTable.setBorderWidth(3);
  
  var highlightRow = highlightTable.appendTableRow();
  highlightRow.setBackgroundColor('#e8f5e9');
  
  var highlightRow1 = highlightTable.appendTableRow();
  highlightRow1.appendTableCell('Spender:').setFontWeight(true).setFontSize(12).setBackgroundColor('#e8f5e9');
  highlightRow1.appendTableCell(spenderName).setFontSize(14).setHorizontalAlignment(DocumentApp.HorizontalAlignment.RIGHT).setBackgroundColor('#e8f5e9');
  
  var highlightRow2 = highlightTable.appendTableRow();
  highlightRow2.appendTableCell('Spendenbetrag:').setFontWeight(true).setFontSize(12).setBackgroundColor('#e8f5e9');
  var amountCell = highlightRow2.appendTableCell(formattedBetrag);
  amountCell.setFontSize(18).setForegroundColor('#2E7D32').setFontWeight(true).setHorizontalAlignment(DocumentApp.HorizontalAlignment.RIGHT).setBackgroundColor('#e8f5e9');
  
  var highlightRow3 = highlightTable.appendTableRow();
  highlightRow3.appendTableCell('Spendendatum:').setFontWeight(true).setFontSize(12).setBackgroundColor('#e8f5e9');
  highlightRow3.appendTableCell(formattedSpendenDatum).setFontSize(12).setHorizontalAlignment(DocumentApp.HorizontalAlignment.RIGHT).setBackgroundColor('#e8f5e9');
  
  body.appendParagraph('').setSpacingAfter(25);
  
  // Inhaltstext
  var contentParagraph = body.appendParagraph('Vielen Dank für Ihre großzügige Spende! Ihre Unterstützung hilft uns, krebskranke Kinder und ihre Familien zu unterstützen.');
  contentParagraph.setFontSize(11);
  contentParagraph.setForegroundColor('#666666');
  contentParagraph.setLineSpacing(1.8);
  contentParagraph.setSpacingAfter(40);
  
  // Trennlinie
  body.appendHorizontalRule();
  body.appendParagraph('').setSpacingAfter(20);
  
  // Footer
  var footerParagraph1 = body.appendParagraph('Mit freundlichen Grüßen,');
  footerParagraph1.setFontSize(11);
  footerParagraph1.setForegroundColor('#666666');
  footerParagraph1.setSpacingAfter(5);
  
  var footerParagraph2 = body.appendParagraph('Hoffnungsradler Dülmen e.V.');
  footerParagraph2.setFontSize(12);
  footerParagraph2.setForegroundColor('#333333');
  footerParagraph2.setBold(true);
  footerParagraph2.setSpacingAfter(5);
  
  var footerParagraph3 = body.appendParagraph('im Namen des Vorstandes');
  footerParagraph3.setFontSize(11);
  footerParagraph3.setForegroundColor('#666666');
  footerParagraph3.setSpacingAfter(40);
  
  // Disclaimer
  var disclaimerParagraph = body.appendParagraph('Diese Quittung kann als Nachweis für die Steuererklärung verwendet werden.');
  disclaimerParagraph.setFontSize(9);
  disclaimerParagraph.setForegroundColor('#999999');
  disclaimerParagraph.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  disclaimerParagraph.setSpacingBefore(30);
  
  // Exportiere als PDF
  var pdfBlob = tempDoc.getAs('application/pdf');
  pdfBlob.setName('Spendenquittung_' + receiptNumber + '.pdf');
  
  // Lösche temporäres Dokument
  DocumentApp.getFileById(tempDoc.getId()).setTrashed(true);
  
  return pdfBlob;
}

/**
 * Generiert Quittungs-E-Mail Template (für Plain Text)
 */
function generateReceiptEmail(receiptNumber, spenderName, betrag, spendenDatum, quittungsDatum) {
  var formattedBetrag = parseFloat(betrag).toFixed(2).replace('.', ',') + ' €';
  var formattedSpendenDatum = Utilities.formatDate(new Date(spendenDatum), Session.getScriptTimeZone(), 'dd.MM.yyyy');
  var formattedQuittungsDatum = Utilities.formatDate(new Date(quittungsDatum), Session.getScriptTimeZone(), 'dd.MM.yyyy');
  
  var plainBody = 
    'Hoffnungsradler Dülmen e.V.\n' +
    'Spendenquittung\n\n' +
    'Quittungsnummer: ' + receiptNumber + '\n' +
    'Ausgestellt am: ' + formattedQuittungsDatum + '\n\n' +
    'Spender: ' + spenderName + '\n' +
    'Spendenbetrag: ' + formattedBetrag + '\n' +
    'Spendendatum: ' + formattedSpendenDatum + '\n\n' +
    'Vielen Dank für Ihre Spende!\n\n' +
    'Mit freundlichen Grüßen,\n' +
    'Hoffnungsradler Dülmen e.V.\n' +
    'im Namen des Vorstandes\n\n' +
    'Die Spendenquittung finden Sie als PDF-Anhang.';
  
  return {
    plainBody: plainBody
  };
}

/**
 * Sendet Quittung per E-Mail mit PDF-Anhang
 */
function sendReceiptByEmail(receiptNumber, spenderName, betrag, spendenDatum, quittungsDatum, recipientEmail) {
  try {
    // Generiere PDF
    var pdfBlob = generateReceiptPDF(receiptNumber, spenderName, betrag, spendenDatum, quittungsDatum);
    
    // Generiere E-Mail-Text
    var emailTemplate = generateReceiptEmail(receiptNumber, spenderName, betrag, spendenDatum, quittungsDatum);
    
    var subject = 'Spendenquittung ' + receiptNumber + ' - Hoffnungsradler Dülmen e.V.';
    
    // Sende E-Mail mit PDF-Anhang
    GmailApp.sendEmail(
      recipientEmail,
      subject,
      emailTemplate.plainBody,
      {
        attachments: [pdfBlob],
        name: 'Hoffnungsradler Dülmen e.V.',
        replyTo: Session.getActiveUser().getEmail()
      }
    );
    
    return true;
  } catch (error) {
    Logger.log('Fehler beim Versenden der Quittung per E-Mail: ' + error.toString());
    return false;
  }
}

function generateReceiptNumber(year) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Spendenquittungen');
  
  if (!sheet) {
    createQuittungenSheet();
    sheet = ss.getSheetByName('Spendenquittungen');
  }
  
  var values = sheet.getDataRange().getValues();
  var maxNumber = 0;
  
  // Finde die höchste Nummer für das gegebene Jahr
  for (var i = 1; i < values.length; i++) {
    var quittungNr = values[i][0]; // Spalte A
    if (quittungNr && typeof quittungNr === 'string') {
      var parts = quittungNr.split('-');
      if (parts.length === 2 && parts[0] == year) {
        var num = parseInt(parts[1]);
        if (num > maxNumber) {
          maxNumber = num;
        }
      }
    }
  }
  
  var nextNumber = maxNumber + 1;
  var receiptNumber = year + '-' + String(nextNumber).padStart(4, '0');
  
  return receiptNumber;
}

function issueReceipt(rowIndex, sheetName) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sourceSheet = ss.getSheetByName(sheetName);
  var quittungenSheet = ss.getSheetByName('Spendenquittungen');
  
  if (!sourceSheet) {
    throw new Error('Quelltabelle "' + sheetName + '" nicht gefunden');
  }
  
  if (!quittungenSheet) {
    createQuittungenSheet();
    quittungenSheet = ss.getSheetByName('Spendenquittungen');
  }
  
  var data = sourceSheet.getRange(rowIndex, 1, 1, sourceSheet.getLastColumn()).getValues()[0];
  
  // ACHTUNG: Neue Spaltenstruktur für "Zahlungseingänge Konto"
  var datum, betrag, spenderName;
  
  if (sheetName === 'Zahlungseingänge Konto') {
    datum = data[1]; // Spalte B: Buchungstag
    betrag = data[8]; // Spalte I: Betrag
    spenderName = data[5]; // Spalte F: Begünstigter
  } else if (sheetName === 'Bargeldspenden') {
    datum = data[0]; // Spalte A: Datum
    betrag = data[1]; // Spalte B: Betrag
    spenderName = data[2]; // Spalte C: Spender
  } else {
    datum = data[0];
    betrag = data[1];
    spenderName = data[2];
  }
  
  var year = new Date(datum).getFullYear();
  
  var receiptNumber = generateReceiptNumber(year);
  var quittungsDatum = new Date();
  
  // Versuche E-Mail-Adresse zu finden
  var spenderEmail = findSpenderEmail(spenderName);
  var emailVersendet = 'Nein';
  var versanddatum = '';
  
  // Wenn E-Mail gefunden, automatisch versenden
  if (spenderEmail) {
    var emailErfolg = sendReceiptByEmail(receiptNumber, spenderName, betrag, datum, quittungsDatum, spenderEmail);
    if (emailErfolg) {
      emailVersendet = 'Ja';
      versanddatum = Utilities.formatDate(quittungsDatum, Session.getScriptTimeZone(), 'dd.MM.yyyy HH:mm');
    }
  }
  
  // Eintrag in Quittungen-Tabelle
  // ACHTUNG: Neue Spaltenstruktur mit E-Mail-Feldern
  quittungenSheet.appendRow([
    receiptNumber,
    quittungsDatum,
    year,
    spenderName,
    betrag,
    sheetName,
    rowIndex,
    'Ausgestellt',
    emailVersendet,
    spenderEmail || '',
    versanddatum,
    ''
  ]);
  
  // Aktualisiere Quelltabelle
  if (sheetName === 'Zahlungseingänge Konto') {
    // ACHTUNG: Neue Spaltenstruktur - Quittung ist Spalte M (13), Quittungsnummer ist Spalte N (14)
    sourceSheet.getRange(rowIndex, 13).setValue('Ja'); // Spalte M: Quittung ausgestellt
    sourceSheet.getRange(rowIndex, 14).setValue(receiptNumber); // Spalte N: Quittungsnummer
  } else if (sheetName === 'Bargeldspenden') {
    sourceSheet.getRange(rowIndex, 5).setValue('Ja'); // Spalte E
    sourceSheet.getRange(rowIndex, 6).setValue(receiptNumber); // Spalte F
  }
  
  return {
    receiptNumber: receiptNumber,
    emailSent: emailVersendet === 'Ja',
    emailAddress: spenderEmail
  };
}

function showQuittungDialog() {
  var ui = SpreadsheetApp.getUi();
  var response = ui.prompt(
    'Spendenquittung ausstellen',
    'Bitte geben Sie die Zeile an, für die eine Quittung ausgestellt werden soll:\nFormat: Tabellenname,Zeile\nBeispiel: Zahlungseingänge Konto,5',
    ui.ButtonSet.OK_CANCEL
  );
  
  if (response.getSelectedButton() == ui.Button.OK) {
    var input = response.getResponseText().split(',');
    if (input.length === 2) {
      var sheetName = input[0].trim();
      var rowIndex = parseInt(input[1].trim());
      
      try {
        var result = issueReceipt(rowIndex, sheetName);
        var message = '✅ Quittung erfolgreich ausgestellt!\n\nQuittungsnummer: ' + result.receiptNumber;
        
        if (result.emailSent) {
          message += '\n\n📧 E-Mail wurde automatisch versendet an:\n' + result.emailAddress;
        } else if (result.emailAddress) {
          message += '\n\n⚠️ E-Mail-Adresse gefunden, aber Versand fehlgeschlagen:\n' + result.emailAddress;
        } else {
          message += '\n\nℹ️ Keine E-Mail-Adresse gefunden.\nQuittung kann manuell per E-Mail versendet werden.';
        }
        
        ui.alert(message);
      } catch(error) {
        ui.alert('❌ Fehler: ' + error.message);
      }
    } else {
      ui.alert('❌ Ungültiges Format. Bitte verwenden Sie: Tabellenname,Zeile');
    }
  }
}

/**
 * Sendet Quittung manuell per E-Mail (Nachversand)
 */
function sendReceiptEmailManual() {
  var ui = SpreadsheetApp.getUi();
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var quittungenSheet = ss.getSheetByName('Spendenquittungen');
  
  if (!quittungenSheet) {
    ui.alert('❌ Fehler: Tabelle "Spendenquittungen" nicht gefunden!');
    return;
  }
  
  // Frage nach Quittungsnummer
  var response = ui.prompt(
    'Quittung per E-Mail versenden',
    'Bitte geben Sie die Quittungsnummer ein, die versendet werden soll:\nBeispiel: 2025-0001',
    ui.ButtonSet.OK_CANCEL
  );
  
  if (response.getSelectedButton() !== ui.Button.OK) {
    return;
  }
  
  var receiptNumber = response.getResponseText().trim();
  
  // Finde Quittung in Tabelle
  var values = quittungenSheet.getDataRange().getValues();
  var receiptRow = null;
  var receiptRowIndex = -1;
  
  for (var i = 1; i < values.length; i++) {
    if (values[i][0] === receiptNumber) {
      receiptRow = values[i];
      receiptRowIndex = i + 1;
      break;
    }
  }
  
  if (!receiptRow) {
    ui.alert('❌ Quittungsnummer "' + receiptNumber + '" nicht gefunden!');
    return;
  }
  
  // Lese Quittungsdaten
  var quittungsDatum = receiptRow[1]; // Spalte B
  var year = receiptRow[2]; // Spalte C
  var spenderName = receiptRow[3]; // Spalte D
  var betrag = receiptRow[4]; // Spalte E
  var spendeDatum = quittungsDatum; // Fallback, könnte auch aus Quelltabelle kommen
  
  // Frage nach E-Mail-Adresse
  var emailResponse = ui.prompt(
    'E-Mail-Adresse',
    'Bitte geben Sie die E-Mail-Adresse des Spenders ein:\nSpender: ' + spenderName,
    ui.ButtonSet.OK_CANCEL
  );
  
  if (emailResponse.getSelectedButton() !== ui.Button.OK) {
    return;
  }
  
  var recipientEmail = emailResponse.getResponseText().trim();
  
  if (!recipientEmail || recipientEmail.indexOf('@') === -1) {
    ui.alert('❌ Ungültige E-Mail-Adresse!');
    return;
  }
  
  // Bestätigung
  var confirmSend = ui.alert(
    'Quittung per E-Mail versenden',
    'Möchten Sie die Quittung ' + receiptNumber + ' an folgende E-Mail-Adresse versenden?\n\n' +
    recipientEmail + '\n\nSpender: ' + spenderName + '\nBetrag: ' + betrag + ' €',
    ui.ButtonSet.YES_NO
  );
  
  if (confirmSend !== ui.Button.YES) {
    return;
  }
  
  try {
    // Sende E-Mail
    var emailErfolg = sendReceiptByEmail(receiptNumber, spenderName, betrag, spendeDatum, quittungsDatum, recipientEmail);
    
    if (emailErfolg) {
      // Aktualisiere Quittungen-Tabelle
      quittungenSheet.getRange(receiptRowIndex, 9).setValue('Ja'); // Spalte I: E-Mail versendet
      quittungenSheet.getRange(receiptRowIndex, 10).setValue(recipientEmail); // Spalte J: E-Mail-Adresse
      quittungenSheet.getRange(receiptRowIndex, 11).setValue(Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd.MM.yyyy HH:mm')); // Spalte K: Versanddatum
      
      ui.alert('✅ Quittung erfolgreich per E-Mail versendet!\n\nEmpfänger: ' + recipientEmail);
    } else {
      ui.alert('❌ Fehler beim Versenden der E-Mail. Bitte prüfen Sie die E-Mail-Adresse und versuchen Sie es erneut.');
    }
  } catch (error) {
    ui.alert('❌ Fehler beim Versenden der E-Mail:\n\n' + error.toString());
  }
}

// =============================================================================
// JAHRESABSCHLUSS
// =============================================================================

function getJahresabschluss(year) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Einnahmen
  var kontoSheet = ss.getSheetByName('Zahlungseingänge Konto');
  var bargeldSheet = ss.getSheetByName('Bargeldspenden');
  
  // ACHTUNG: Neue Spaltenstruktur - Konto: Datum=B(2), Betrag=I(9)
  var einnahmenKonto = sumByYear(kontoSheet, year, 2, 9); // Spalte B=Buchungstag, I=Betrag
  var einnahmenBargeld = sumByYear(bargeldSheet, year, 1, 2);
  var gesamtEinnahmen = einnahmenKonto + einnahmenBargeld;
  
  // Ausgaben
  var ausgabenSheet = ss.getSheetByName('Ausgaben');
  var uebergabeSheet = ss.getSheetByName('Übergebene Spenden');
  
  var ausgabenAllgemein = sumByYear(ausgabenSheet, year, 1, 2);
  var ausgabenUebergabe = sumByYearColumn(uebergabeSheet, year, 1, 2); // Spalte A=Jahr direkt
  var gesamtAusgaben = ausgabenAllgemein + ausgabenUebergabe;
  
  // Saldo
  var saldo = gesamtEinnahmen - gesamtAusgaben;
  
  // Quittungen - ACHTUNG: Neue Spaltenstruktur - Konto: Datum=B(2), Quittung=M(13)
  var quittungenKonto = countReceiptsIssued(kontoSheet, year, 2, 13); // Spalte B=Buchungstag, M=Quittung
  var quittungenBargeld = countReceiptsIssued(bargeldSheet, year, 1, 5);
  
  return {
    jahr: year,
    einnahmen: {
      konto: einnahmenKonto,
      bargeld: einnahmenBargeld,
      gesamt: gesamtEinnahmen
    },
    ausgaben: {
      allgemein: ausgabenAllgemein,
      uebergabe: ausgabenUebergabe,
      gesamt: gesamtAusgaben
    },
    saldo: saldo,
    quittungen: {
      konto: quittungenKonto,
      bargeld: quittungenBargeld,
      gesamt: quittungenKonto + quittungenBargeld
    },
    erstellt: new Date()
  };
}

function sumByYear(sheet, year, dateCol, amountCol) {
  if (!sheet) return 0;
  
  var data = sheet.getDataRange().getValues();
  var sum = 0;
  
  for (var i = 1; i < data.length; i++) {
    var datum = data[i][dateCol - 1];
    var betrag = data[i][amountCol - 1];
    
    if (datum && betrag && new Date(datum).getFullYear() == year) {
      sum += parseFloat(betrag) || 0;
    }
  }
  
  return sum;
}

function sumByYearColumn(sheet, year, yearCol, amountCol) {
  if (!sheet) return 0;
  
  var data = sheet.getDataRange().getValues();
  var sum = 0;
  
  for (var i = 1; i < data.length; i++) {
    var jahrValue = data[i][yearCol - 1];
    var betrag = data[i][amountCol - 1];
    
    if (jahrValue == year && betrag) {
      sum += parseFloat(betrag) || 0;
    }
  }
  
  return sum;
}

function countReceiptsIssued(sheet, year, dateCol, receiptCol) {
  if (!sheet) return 0;
  
  var data = sheet.getDataRange().getValues();
  var count = 0;
  
  for (var i = 1; i < data.length; i++) {
    var datum = data[i][dateCol - 1];
    var quittung = data[i][receiptCol - 1];
    
    if (datum && new Date(datum).getFullYear() == year && quittung === 'Ja') {
      count++;
    }
  }
  
  return count;
}

function showJahresabschlussDialog() {
  var ui = SpreadsheetApp.getUi();
  var currentYear = new Date().getFullYear();
  var response = ui.prompt(
    'Jahresabschluss erstellen',
    'Für welches Jahr soll der Jahresabschluss erstellt werden?',
    ui.ButtonSet.OK_CANCEL
  );
  
  if (response.getSelectedButton() == ui.Button.OK) {
    var year = parseInt(response.getResponseText());
    
    if (year && year >= 2000 && year <= currentYear) {
      var abschluss = getJahresabschluss(year);
      
      var message = '📊 JAHRESABSCHLUSS ' + year + '\n\n' +
        '💰 EINNAHMEN\n' +
        'Zahlungseingänge Konto: ' + abschluss.einnahmen.konto.toFixed(2) + ' €\n' +
        'Bargeldspenden: ' + abschluss.einnahmen.bargeld.toFixed(2) + ' €\n' +
        'Gesamt Einnahmen: ' + abschluss.einnahmen.gesamt.toFixed(2) + ' €\n\n' +
        '💳 AUSGABEN\n' +
        'Allgemeine Ausgaben: ' + abschluss.ausgaben.allgemein.toFixed(2) + ' €\n' +
        'Übergebene Spenden: ' + abschluss.ausgaben.uebergabe.toFixed(2) + ' €\n' +
        'Gesamt Ausgaben: ' + abschluss.ausgaben.gesamt.toFixed(2) + ' €\n\n' +
        '💵 SALDO: ' + abschluss.saldo.toFixed(2) + ' €\n\n' +
        '📄 QUITTUNGEN\n' +
        'Konto: ' + abschluss.quittungen.konto + '\n' +
        'Bargeld: ' + abschluss.quittungen.bargeld + '\n' +
        'Gesamt: ' + abschluss.quittungen.gesamt;
      
      ui.alert(message);
      
      // Optional: Speichern als neues Sheet
      createJahresabschlussSheet(year, abschluss);
    } else {
      ui.alert('❌ Ungültiges Jahr. Bitte geben Sie ein Jahr zwischen 2000 und ' + currentYear + ' ein.');
    }
  }
}

function createJahresabschlussSheet(year, abschluss) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheetName = 'Jahresabschluss ' + year;
  var sheet = ss.getSheetByName(sheetName);
  
  if (sheet) {
    sheet.clear();
  } else {
    sheet = ss.insertSheet(sheetName);
  }
  
  // Überschrift
  sheet.getRange('A1').setValue('📊 JAHRESABSCHLUSS ' + year);
  sheet.getRange('A1:D1').merge().setFontSize(18).setFontWeight('bold').setBackground('#1a73e8').setFontColor('#ffffff');
  
  sheet.getRange('A2').setValue('Erstellt am: ' + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd.MM.yyyy HH:mm'));
  sheet.getRange('A2:D2').merge().setFontStyle('italic');
  
  // Einnahmen
  sheet.getRange('A4').setValue('💰 EINNAHMEN');
  sheet.getRange('A4:D4').merge().setBackground('#e8f5e9').setFontWeight('bold').setFontSize(14);
  
  var einnahmenData = [
    ['Kategorie', 'Betrag (€)', '', ''],
    ['Zahlungseingänge Konto', abschluss.einnahmen.konto, '', ''],
    ['Bargeldspenden', abschluss.einnahmen.bargeld, '', ''],
    ['Gesamt Einnahmen', abschluss.einnahmen.gesamt, '', '']
  ];
  sheet.getRange('A5:D8').setValues(einnahmenData);
  sheet.getRange('A8:D8').setBackground('#a5d6a7').setFontWeight('bold');
  
  // Ausgaben
  sheet.getRange('A10').setValue('💳 AUSGABEN');
  sheet.getRange('A10:D10').merge().setBackground('#ffebee').setFontWeight('bold').setFontSize(14);
  
  var ausgabenData = [
    ['Kategorie', 'Betrag (€)', '', ''],
    ['Allgemeine Ausgaben', abschluss.ausgaben.allgemein, '', ''],
    ['Übergebene Spenden', abschluss.ausgaben.uebergabe, '', ''],
    ['Gesamt Ausgaben', abschluss.ausgaben.gesamt, '', '']
  ];
  sheet.getRange('A11:D14').setValues(ausgabenData);
  sheet.getRange('A14:D14').setBackground('#ef9a9a').setFontWeight('bold');
  
  // Saldo
  sheet.getRange('A16').setValue('💵 SALDO');
  sheet.getRange('A16:D16').merge().setBackground('#e3f2fd').setFontWeight('bold').setFontSize(14);
  
  sheet.getRange('A17').setValue('Einnahmen - Ausgaben');
  sheet.getRange('B17').setValue(abschluss.saldo);
  sheet.getRange('A17:B17').setBackground('#bbdefb').setFontWeight('bold').setFontSize(12);
  
  // Quittungen
  sheet.getRange('A19').setValue('📄 SPENDENQUITTUNGEN');
  sheet.getRange('A19:D19').merge().setBackground('#fff3e0').setFontWeight('bold').setFontSize(14);
  
  var quittungData = [
    ['Kategorie', 'Anzahl', '', ''],
    ['Konto-Quittungen', abschluss.quittungen.konto, '', ''],
    ['Bargeld-Quittungen', abschluss.quittungen.bargeld, '', ''],
    ['Gesamt Quittungen', abschluss.quittungen.gesamt, '', '']
  ];
  sheet.getRange('A20:D23').setValues(quittungData);
  sheet.getRange('A23:D23').setBackground('#ffcc80').setFontWeight('bold');
  
  // Formatierung
  sheet.setColumnWidth(1, 220);
  sheet.setColumnWidth(2, 150);
  sheet.getRange('B5:B17').setNumberFormat('#,##0.00 €');
  
  SpreadsheetApp.getUi().alert('✅ Jahresabschluss wurde als separates Blatt "' + sheetName + '" gespeichert!');
}

// =============================================================================
// DATEN-FUNKTIONEN FÜR WEBSITE
// =============================================================================

function getDonations() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Spenden');
  if (!sheet) return [];
  
  var values = sheet.getDataRange().getValues();
  var headers = values.shift();
  return values.map(function(row) {
    var obj = {};
    headers.forEach(function(key, i) { obj[key] = row[i]; });
    return obj;
  });
}

function addDonation(donation) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Spenden');
  if (!sheet) {
    throw new Error('Spenden-Sheet existiert nicht');
  }
  
  sheet.appendRow([
    donation.id,
    donation.year,
    donation.amount,
    donation.name,
    donation.email,
    donation.date,
    donation.receiptIssued || 'Nein',
    donation.receiptNumber || '',
    donation.note || ''
  ]);
}

function getUebergabeSummen() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Übergebene Spenden');
  if (!sheet) return { summen: {}, gesamt: 0 };
  
  var values = sheet.getDataRange().getValues();
  var headers = values.shift();
  var jahrIndex = headers.indexOf('Jahr');
  var betragIndex = headers.indexOf('Betrag (€)');
  var summen = {};
  
  values.forEach(function(row) {
    var jahr = row[jahrIndex];
    var betrag = parseFloat(row[betragIndex]) || 0;
    if (!summen[jahr]) summen[jahr] = 0;
    summen[jahr] += betrag;
  });
  
  var gesamt = Object.values(summen).reduce(function(a, b) { return a + b; }, 0);
  return { summen: summen, gesamt: gesamt };
}

function getAllYearlyDonationData() {
  var uebergabeSummen = getUebergabeSummen();
  var years = Object.keys(uebergabeSummen.summen).sort().reverse();
  
  var donations = years.map(function(year) {
    return {
      year: parseInt(year),
      amount: uebergabeSummen.summen[year]
    };
  });
  
  return {
    donations: donations,
    totalDonations: uebergabeSummen.gesamt,
    currentYear: new Date().getFullYear()
  };
}

// =============================================================================
// CSV-IMPORT SYSTEM
// =============================================================================

/**
 * Erstellt das Tabellenblatt für Import-Regeln
 */
function createImportRulesSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Import-Regeln');
  
  if (!sheet) {
    sheet = ss.insertSheet('Import-Regeln');
  } else {
    sheet.clear();
  }
  
  // Überschrift
  sheet.getRange('A1').setValue('📋 IMPORT-REGELN FÜR KONTOAUSZÜGE');
  sheet.getRange('A1:F1').merge().setFontSize(16).setFontWeight('bold').setBackground('#1a73e8').setFontColor('#ffffff');
  
  // Beschreibung
  sheet.getRange('A2').setValue('Diese Regeln werden beim Import von Kontoauszügen angewendet, um Buchungen automatisch zu kategorisieren.');
  sheet.getRange('A2:F2').merge().setFontStyle('italic').setWrap(true);
  sheet.setRowHeight(2, 40);
  
  // Header
  var headers = [
    'Aktiv',
    'Muster (im Verwendungszweck)',
    'Kategorie',
    'Priorität',
    'Quittung vorschlagen',
    'Bemerkung'
  ];
  sheet.getRange('A4:F4').setValues([headers])
    .setFontWeight('bold')
    .setBackground('#e3f2fd')
    .setHorizontalAlignment('center');
  
  // Standard-Regeln
  var defaultRules = [
    ['✓', 'spende', 'Spende', 100, 'Ja', 'Allgemeine Spende'],
    ['✓', 'hoffnungsradler', 'Spende', 100, 'Ja', 'Spende für Hoffnungsradler'],
    ['✓', 'mitgliedsbeitrag', 'Mitgliedsbeitrag', 90, 'Nein', 'Mitgliedsbeitrag'],
    ['✓', 'beitrag', 'Mitgliedsbeitrag', 80, 'Nein', 'Beitrag (allgemein)'],
    ['✓', 'tour', 'Spende', 70, 'Ja', 'Spende für Tour'],
    ['✓', 'matjes', 'Spende', 70, 'Ja', 'Matjes-Tour Spende'],
    ['✓', 'alpin', 'Spende', 70, 'Ja', 'Alpin-Tour Spende'],
    ['✓', 'förderung', 'Förderung', 60, 'Nein', 'Förderung/Zuschuss'],
    ['✓', 'sponsoring', 'Förderung', 60, 'Nein', 'Sponsoring'],
    ['', 'beispiel', 'Spende', 50, 'Ja', 'Weitere Regel hinzufügen']
  ];
  
  sheet.getRange(5, 1, defaultRules.length, 6).setValues(defaultRules);
  
  // Formatierung
  sheet.setColumnWidth(1, 60);
  sheet.setColumnWidth(2, 250);
  sheet.setColumnWidth(3, 150);
  sheet.setColumnWidth(4, 80);
  sheet.setColumnWidth(5, 140);
  sheet.setColumnWidth(6, 200);
  
  // Dropdown für Aktiv
  var aktivRange = sheet.getRange('A5:A100');
  var aktivRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['✓', ''], true)
    .build();
  aktivRange.setDataValidation(aktivRule);
  
  // Dropdown für Kategorie
  var kategorieRange = sheet.getRange('C5:C100');
  var kategorieRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Spende', 'Mitgliedsbeitrag', 'Förderung', 'Sonstiges'], true)
    .build();
  kategorieRange.setDataValidation(kategorieRule);
  
  // Dropdown für Quittung
  var quittungRange = sheet.getRange('E5:E100');
  var quittungRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Ja', 'Nein'], true)
    .build();
  quittungRange.setDataValidation(quittungRule);
  
  // Hinweise unten
  sheet.getRange('A' + (5 + defaultRules.length + 2)).setValue('💡 HINWEISE:');
  sheet.getRange('A' + (5 + defaultRules.length + 2) + ':F' + (5 + defaultRules.length + 2))
    .merge().setFontWeight('bold').setBackground('#fff3e0');
  
  var hinweise = [
    ['• Aktiv: ✓ = Regel wird angewendet | Leer = Regel deaktiviert'],
    ['• Muster: Groß-/Kleinschreibung wird ignoriert. Mehrere Wörter möglich.'],
    ['• Priorität: Höhere Zahl = wird zuerst geprüft (100 = höchste Priorität)'],
    ['• Quittung vorschlagen: System schlägt vor, ob Quittung ausgestellt werden soll']
  ];
  
  var hinweisStartRow = 5 + defaultRules.length + 3;
  sheet.getRange(hinweisStartRow, 1, hinweise.length, 1).setValues(hinweise);
  sheet.getRange(hinweisStartRow, 1, hinweise.length, 6).merge();
  
  sheet.setFrozenRows(4);
  
  SpreadsheetApp.getUi().alert('✅ Tabellenblatt "Import-Regeln" wurde angelegt!\n\nSie können jetzt eigene Regeln hinzufügen oder bestehende anpassen.');
}

/**
 * Öffnet das Import-Regeln-Sheet
 */
function openImportRulesSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Import-Regeln');
  
  if (!sheet) {
    createImportRulesSheet();
    sheet = ss.getSheetByName('Import-Regeln');
  }
  
  ss.setActiveSheet(sheet);
}

/**
 * Zeigt den Import-Dialog
 */
function showImportDialog() {
  var ui = SpreadsheetApp.getUi();
  
  var html = HtmlService.createHtmlOutput(getImportDialogHtml())
    .setWidth(600)
    .setHeight(500);
  
  ui.showModalDialog(html, '🔄 Kontoauszug importieren');
}

/**
 * HTML für Import-Dialog
 */
function getImportDialogHtml() {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <base target="_top">
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            margin: 0;
          }
          h2 {
            color: #1a73e8;
            margin-top: 0;
          }
          .info-box {
            background: #e3f2fd;
            border-left: 4px solid #1a73e8;
            padding: 15px;
            margin: 20px 0;
          }
          .step {
            margin: 15px 0;
            padding: 10px;
            background: #f5f5f5;
            border-radius: 5px;
          }
          .step-number {
            display: inline-block;
            width: 30px;
            height: 30px;
            background: #1a73e8;
            color: white;
            border-radius: 50%;
            text-align: center;
            line-height: 30px;
            margin-right: 10px;
            font-weight: bold;
          }
          textarea {
            width: 100%;
            min-height: 200px;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-family: monospace;
            font-size: 12px;
            box-sizing: border-box;
          }
          button {
            background: #1a73e8;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            margin-top: 10px;
          }
          button:hover {
            background: #1557b0;
          }
          button:disabled {
            background: #ccc;
            cursor: not-allowed;
          }
          #result {
            margin-top: 20px;
            padding: 15px;
            border-radius: 4px;
            display: none;
          }
          .success {
            background: #e8f5e9;
            border-left: 4px solid #4caf50;
          }
          .error {
            background: #ffebee;
            border-left: 4px solid #f44336;
          }
        </style>
      </head>
      <body>
        <h2>🔄 Kontoauszug importieren</h2>
        
        <div class="info-box">
          <strong>📋 So funktioniert's:</strong><br>
          Kopieren Sie den CSV-Inhalt aus Ihrem Sparkassen-Kontoauszug und fügen Sie ihn unten ein.
          Das System erkennt automatisch das Format und ordnet die Buchungen zu.
        </div>
        
        <div class="step">
          <span class="step-number">1</span>
          <strong>CSV-Datei öffnen</strong><br>
          <small>Öffnen Sie die CSV-Datei von der Sparkasse mit einem Texteditor oder Excel</small>
        </div>
        
        <div class="step">
          <span class="step-number">2</span>
          <strong>Inhalt kopieren</strong><br>
          <small>Markieren Sie alles (Strg+A) und kopieren Sie es (Strg+C)</small>
        </div>
        
        <div class="step">
          <span class="step-number">3</span>
          <strong>Hier einfügen</strong><br>
          <textarea id="csvInput" placeholder="CSV-Inhalt hier einfügen..."></textarea>
        </div>
        
        <button onclick="importCSV()" id="importBtn">
          🚀 Import starten
        </button>
        
        <div id="result"></div>
        
        <script>
          function importCSV() {
            var csv = document.getElementById('csvInput').value;
            var btn = document.getElementById('importBtn');
            var result = document.getElementById('result');
            
            if (!csv.trim()) {
              result.className = 'error';
              result.innerHTML = '<strong>❌ Fehler:</strong> Bitte CSV-Inhalt einfügen!';
              result.style.display = 'block';
              return;
            }
            
            btn.disabled = true;
            btn.innerHTML = '⏳ Importiere...';
            result.style.display = 'none';
            
            google.script.run
              .withSuccessHandler(function(response) {
                btn.disabled = false;
                btn.innerHTML = '🚀 Import starten';
                result.className = 'success';
                result.innerHTML = '<strong>✅ Erfolgreich!</strong><br>' + response;
                result.style.display = 'block';
              })
              .withFailureHandler(function(error) {
                btn.disabled = false;
                btn.innerHTML = '🚀 Import starten';
                result.className = 'error';
                result.innerHTML = '<strong>❌ Fehler:</strong><br>' + error;
                result.style.display = 'block';
              })
              .processCSVImport(csv);
          }
        </script>
      </body>
    </html>
  `;
}

/**
 * Verarbeitet den CSV-Import
 */
function processCSVImport(csvContent) {
  try {
    // Parse CSV
    var rows = parseSparkassenCSV(csvContent);
    
    if (rows.length === 0) {
      throw new Error('Keine gültigen Zeilen gefunden. Bitte prüfen Sie das CSV-Format.');
    }
    
    // Kategorisiere jede Zeile
    var categorizedRows = [];
    var stats = {
      total: rows.length,
      imported: 0,
      skipped: 0,
      errors: 0
    };
    
    for (var i = 0; i < rows.length; i++) {
      try {
        var row = rows[i];
        var categorized = categorizeTransaction(row);
        categorizedRows.push(categorized);
        stats.imported++;
      } catch (e) {
        stats.errors++;
        Logger.log('Fehler bei Zeile ' + i + ': ' + e.toString());
      }
    }
    
    // Importiere in Sheet
    importToKontoSheet(categorizedRows);
    
    // Zusammenfassung
    var summary = stats.imported + ' Buchungen importiert';
    if (stats.errors > 0) {
      summary += ', ' + stats.errors + ' Fehler';
    }
    
    // Dashboard aktualisieren
    updateDashboard();
    
    return summary;
    
  } catch (error) {
    throw new Error('Import fehlgeschlagen: ' + error.toString());
  }
}

/**
 * Parst Sparkassen-CSV
 * Unterstützt verschiedene Formate
 */
function parseSparkassenCSV(csvContent) {
  var lines = csvContent.split('\n');
  var rows = [];
  var delimiter = detectDelimiter(lines[0]);
  
  // Überspringe Kopfzeile
  for (var i = 1; i < lines.length; i++) {
    var line = lines[i].trim();
    if (!line) continue;
    
    var fields = parseCSVLine(line, delimiter);
    
    if (fields.length < 5) continue; // Zu wenige Felder
    
    // Sparkassen-Standard-Format:
    // Buchungstag, Valuta, Auftraggeber/Empfänger, Buchungstext, Verwendungszweck, Betrag, Währung
    
    var row = {
      datum: parseDate(fields[0]),
      betrag: parseBetrag(fields[5] || fields[4]), // Betrag kann an Position 5 oder 4 sein
      absender: cleanString(fields[2]),
      iban: extractIBAN(line),
      verwendungszweck: cleanString(fields[4] || fields[3]),
      rawLine: line
    };
    
    // Nur positive Beträge (Eingänge)
    if (row.betrag > 0) {
      rows.push(row);
    }
  }
  
  return rows;
}

/**
 * Erkennt das Trennzeichen (;, Komma, Tab)
 */
function detectDelimiter(line) {
  var delimiters = [';', ',', '\t'];
  var counts = delimiters.map(function(d) {
    return (line.match(new RegExp('\\' + d, 'g')) || []).length;
  });
  var maxIndex = counts.indexOf(Math.max.apply(Math, counts));
  return delimiters[maxIndex];
}

/**
 * Parst eine CSV-Zeile mit Berücksichtigung von Anführungszeichen
 */
function parseCSVLine(line, delimiter) {
  var fields = [];
  var field = '';
  var inQuotes = false;
  
  for (var i = 0; i < line.length; i++) {
    var char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === delimiter && !inQuotes) {
      fields.push(field);
      field = '';
    } else {
      field += char;
    }
  }
  
  fields.push(field); // Letztes Feld
  
  return fields;
}

/**
 * Parst Datum aus verschiedenen Formaten
 */
function parseDate(dateStr) {
  dateStr = dateStr.replace(/["']/g, '').trim();
  
  // Format: DD.MM.YYYY
  var parts = dateStr.split('.');
  if (parts.length === 3) {
    return new Date(parts[2], parts[1] - 1, parts[0]);
  }
  
  // Format: YYYY-MM-DD
  parts = dateStr.split('-');
  if (parts.length === 3) {
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }
  
  return new Date(dateStr);
}

/**
 * Parst Betrag (50,00 -> 50.00)
 */
function parseBetrag(betragStr) {
  betragStr = betragStr.replace(/["']/g, '').trim();
  betragStr = betragStr.replace('.', ''); // Tausender-Trennzeichen entfernen
  betragStr = betragStr.replace(',', '.'); // Komma zu Punkt
  betragStr = betragStr.replace(/[^\d.-]/g, ''); // Nur Zahlen, Punkt, Minus
  return parseFloat(betragStr) || 0;
}

/**
 * Extrahiert IBAN aus Text
 */
function extractIBAN(text) {
  var match = text.match(/DE\d{2}\s?\d{4}\s?\d{4}\s?\d{4}\s?\d{4}\s?\d{2}/i);
  if (match) {
    return match[0].replace(/\s/g, '');
  }
  return '';
}

/**
 * Bereinigt String
 */
function cleanString(str) {
  return str.replace(/["']/g, '').trim();
}

/**
 * Kategorisiert eine Transaktion basierend auf Regeln
 */
function categorizeTransaction(row, betrag) {
  var rules = getImportRules();
  
  // Sichere Zugriffe mit Fallback auf leere Strings
  var verwendungszweck = (row['Verwendungszweck'] || '').toLowerCase();
  var beguenstigter = (row['Beguenstigter/Zahlungspflichtiger'] || row['Begünstigter'] || '').toLowerCase();
  var buchungstext = (row['Buchungstext'] || '').toLowerCase();
  
  // Prüfe Regeln (sortiert nach Priorität)
  for (var i = 0; i < rules.length; i++) {
    var rule = rules[i];
    if (!rule || !rule.pattern) continue;
    
    var pattern = rule.pattern.toLowerCase();
    
    // Prüfe ob Muster in Verwendungszweck, Begünstigter oder Buchungstext vorkommt
    if (verwendungszweck.indexOf(pattern) !== -1 || 
        beguenstigter.indexOf(pattern) !== -1 || 
        buchungstext.indexOf(pattern) !== -1) {
      
      Logger.log('Kategorisierungsregel gefunden: ' + rule.pattern + ' → ' + rule.kategorie);
      return rule.kategorie || '';
    }
  }
  
  // FALLBACK: Betrag-basiert
  if (betrag !== undefined && betrag !== null) {
    if (betrag > 0 && betrag >= 10) {
      return 'Spende';
    } else if (betrag < 0) {
      return 'Sonstiges'; // Ausgaben werden separat behandelt
    }
  }
  
  // Standard: Leer lassen (manuell kategorisieren)
  return '';
}

/**
 * Lädt Import-Regeln
 */
function getImportRules() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Import-Regeln');
  
  if (!sheet) {
    createImportRulesSheet();
    sheet = ss.getSheetByName('Import-Regeln');
  }
  
  var values = sheet.getRange('A5:F100').getValues();
  var rules = [];
  
  for (var i = 0; i < values.length; i++) {
    var row = values[i];
    if (row[0] === '✓' && row[1]) { // Aktiv und Muster vorhanden
      rules.push({
        pattern: row[1],
        kategorie: row[2],
        prioritaet: row[3] || 50,
        quittungVorschlagen: row[4],
        bemerkung: row[5]
      });
    }
  }
  
  // Sortiere nach Priorität (höchste zuerst)
  rules.sort(function(a, b) {
    return b.prioritaet - a.prioritaet;
  });
  
  return rules;
}

/**
 * Sucht Mitglied anhand von Name, IBAN oder Verwendungszweck
 */
function findMember(name, iban, verwendungszweck) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Mitglieder');
  
  if (!sheet) return null;
  
  var values = sheet.getDataRange().getValues();
  
  // Normalisiere IBAN (ohne Leerzeichen, Großbuchstaben)
  var normalizedIBAN = '';
  if (iban) {
    normalizedIBAN = iban.replace(/\s/g, '').toUpperCase();
  }
  
  // Normalisiere Name (Kleinschreibung, trimmen)
  var normalizedName = '';
  if (name) {
    normalizedName = name.toLowerCase().trim();
  }
  
  // Normalisiere Verwendungszweck
  var normalizedZweck = '';
  if (verwendungszweck) {
    normalizedZweck = verwendungszweck.toLowerCase();
  }
  
  // Durchsuche Mitglieder (überspringe Header)
  // Spalte A (Index 0): Nr.
  // Spalte B (Index 1): Vorname, Name
  // Spalte K (Index 10): IBAN
  for (var i = 1; i < values.length; i++) {
    var row = values[i];
    var mitgliedsNr = row[0]; // Spalte A: Nr.
    var mitgliedsName = row[1]; // Spalte B: Vorname, Name
    var mitgliedsIBAN = row[10]; // Spalte K: IBAN
    
    if (!mitgliedsNr && !mitgliedsName) continue; // Leere Zeile überspringen
    
    // IBAN-Match (stärkster Match - 99% sicher)
    if (normalizedIBAN && mitgliedsIBAN) {
      var normalizedMitgliedsIBAN = mitgliedsIBAN.replace(/\s/g, '').toUpperCase();
      if (normalizedIBAN === normalizedMitgliedsIBAN) {
        return {
          nr: mitgliedsNr,
          name: mitgliedsName,
          confidence: 99
        };
      }
    }
    
    // Name-Match (95% sicher)
    if (normalizedName && mitgliedsName) {
      var normalizedMitgliedsName = mitgliedsName.toLowerCase().trim();
      // Exakter Match
      if (normalizedName === normalizedMitgliedsName) {
        return {
          nr: mitgliedsNr,
          name: mitgliedsName,
          confidence: 95
        };
      }
      // Teilweise Match (z.B. "Max Mustermann" vs "Mustermann, Max")
      var nameParts = normalizedName.split(/[\s,]+/);
      var mitgliedsNameParts = normalizedMitgliedsName.split(/[\s,]+/);
      var matchCount = 0;
      for (var j = 0; j < nameParts.length; j++) {
        if (mitgliedsNameParts.indexOf(nameParts[j]) !== -1) {
          matchCount++;
        }
      }
      // Wenn mindestens 2 Teile übereinstimmen (z.B. Vor- und Nachname)
      if (matchCount >= 2 && nameParts.length >= 2) {
        return {
          nr: mitgliedsNr,
          name: mitgliedsName,
          confidence: 90
        };
      }
    }
    
    // Verwendungszweck-Match: Mitgliedsnummer im Verwendungszweck
    if (normalizedZweck && mitgliedsNr) {
      var nrString = String(mitgliedsNr);
      if (normalizedZweck.indexOf(nrString) !== -1 || 
          normalizedZweck.indexOf('mitgliedsbeitrag') !== -1 ||
          normalizedZweck.indexOf('beitrag') !== -1) {
        // Zusätzlich Name oder IBAN prüfen
        if (normalizedName && mitgliedsName) {
          var normalizedMitgliedsName = mitgliedsName.toLowerCase().trim();
          if (normalizedName.indexOf(normalizedMitgliedsName.split(' ')[0]) !== -1 ||
              normalizedMitgliedsName.indexOf(normalizedName.split(' ')[0]) !== -1) {
            return {
              nr: mitgliedsNr,
              name: mitgliedsName,
              confidence: 85
            };
          }
        }
      }
    }
  }
  
  return null;
}

/**
 * Sucht bekannten Spender (NICHT-Mitglied)
 */
function findKnownDonor(name, iban) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Zahlungseingänge Konto');
  
  if (!sheet) return null;
  
  var values = sheet.getDataRange().getValues();
  
  // Durchsuche Historie (überspringe Header)
  // ACHTUNG: Neue Spaltenstruktur
  // Spalte F (Index 5): Begünstigter
  // Spalte G (Index 6): Kontonummer
  // Spalte L (Index 11): Kategorie
  // Spalte O (Index 14): Mitgliedsnummer
  for (var i = 1; i < values.length; i++) {
    var row = values[i];
    var histName = row[5]; // Spalte F: Begünstigter
    var histIBAN = row[6]; // Spalte G: Kontonummer (kann IBAN enthalten)
    var histKategorie = row[11]; // Spalte L: Kategorie
    var histMitgliedsNr = row[14]; // Spalte O: Mitgliedsnummer
    
    // Nur als Spender zählen, wenn NICHT Mitglied ist
    if (histMitgliedsNr && histMitgliedsNr !== '') {
      continue; // Überspringe Mitglieder
    }
    
    // Match bei IBAN/Kontonummer (stärkster Match)
    if (iban && histIBAN && histIBAN.indexOf(iban.replace(/\s/g, '')) !== -1) {
      return {
        kategorie: histKategorie || 'Spende',
        confidence: 95
      };
    }
    
    // Name-Match (einfach)
    if (name && histName && name.toLowerCase() === histName.toLowerCase()) {
      return {
        kategorie: histKategorie || 'Spende',
        confidence: 80
      };
    }
  }
  
  return null;
}

/**
 * Importiert kategorisierte Zeilen ins Konto-Sheet
 * Neue Struktur: CSV-Spalten direkt übernommen + zusätzliche Spalten
 */
function importToKontoSheet(rows) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Zahlungseingänge Konto');
  
  if (!sheet) {
    createKontoSheet();
    sheet = ss.getSheetByName('Zahlungseingänge Konto');
  }
  
  // Bereite Daten vor - Neue CSV-Struktur:
  // Spalten 1-12: CSV-Format (Auftragskonto, Buchungstag, Valutadatum, Buchungstext, Verwendungszweck, Begünstigter, Kontonummer, BIC, Betrag, Waehrung, Info, Kategorie)
  // Spalten 13-16: Zusätzlich (Quittung, Quittungsnummer, Mitgliedsnummer, Bemerkung)
  var dataToInsert = rows.map(function(row) {
    return [
      '', // A: Auftragskonto (wird später ausgefüllt oder leer gelassen)
      row.datum, // B: Buchungstag
      row.datum, // C: Valutadatum (gleiche wie Buchungstag)
      '', // D: Buchungstext (z.B. "SEPA-Überweisung")
      row.verwendungszweck, // E: Verwendungszweck
      row.absender, // F: Begünstigter
      row.iban, // G: Kontonummer (enthält IBAN)
      '', // H: BIC (SWIFT) - leer wenn nicht verfügbar
      row.betrag, // I: Betrag
      'EUR', // J: Waehrung
      '', // K: Info
      row.kategorie, // L: Kategorie
      row.quittung, // M: Quittung ausgestellt
      row.quittungNummer, // N: Quittungsnummer
      row.mitgliedsnummer || '', // O: Mitgliedsnummer (automatisch zugeordnet!)
      row.bemerkung // P: Bemerkung
    ];
  });
  
  // Füge am Ende ein
  var lastRow = sheet.getLastRow();
  sheet.getRange(lastRow + 1, 1, dataToInsert.length, 16).setValues(dataToInsert);
  
  // Formatiere Datum (Spalte B: Buchungstag)
  sheet.getRange(lastRow + 1, 2, dataToInsert.length, 1).setNumberFormat('dd.mm.yyyy');
  
  // Formatiere Valutadatum (Spalte C)
  sheet.getRange(lastRow + 1, 3, dataToInsert.length, 1).setNumberFormat('dd.mm.yyyy');
  
  // Formatiere Betrag (Spalte I)
  sheet.getRange(lastRow + 1, 9, dataToInsert.length, 1).setNumberFormat('#,##0.00 €');
}

/**
 * Ordnet alle Zahlungseingänge automatisch Mitgliedern zu
 */
function matchAllPaymentsToMembers() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var kontoSheet = ss.getSheetByName('Zahlungseingänge Konto');
  var mitgliederSheet = ss.getSheetByName('Mitglieder');
  
  if (!kontoSheet) {
    SpreadsheetApp.getUi().alert('❌ Tabelle "Zahlungseingänge Konto" nicht gefunden!');
    return;
  }
  
  if (!mitgliederSheet) {
    SpreadsheetApp.getUi().alert('❌ Tabelle "Mitglieder" nicht gefunden!\n\nBitte zuerst anlegen: 📊 Buchhaltung → Tabellen anlegen → Mitglieder anlegen');
    return;
  }
  
  var kontoValues = kontoSheet.getDataRange().getValues();
  var mitgliederValues = mitgliederSheet.getDataRange().getValues();
  
  // Erstelle Mitglieds-Index für schnelle Suche
  var mitgliederIndex = {};
  for (var i = 1; i < mitgliederValues.length; i++) {
    var row = mitgliederValues[i];
    var nr = row[0]; // Spalte A: Nr.
    var name = row[1]; // Spalte B: Name
    var iban = row[10]; // Spalte K: IBAN
    
    if (!nr && !name) continue;
    
    // Normalisiere Daten für Index
    var normalizedIBAN = '';
    if (iban) {
      normalizedIBAN = iban.replace(/\s/g, '').toUpperCase();
      if (normalizedIBAN) {
        mitgliederIndex['iban:' + normalizedIBAN] = nr;
      }
    }
    
    if (name) {
      var normalizedName = name.toLowerCase().trim();
      mitgliederIndex['name:' + normalizedName] = nr;
      
      // Auch einzelne Name-Teile indexieren
      var nameParts = normalizedName.split(/[\s,]+/);
      if (nameParts.length >= 2) {
        mitgliederIndex['name:' + nameParts[0]] = nr; // Vorname
        mitgliederIndex['name:' + nameParts[nameParts.length - 1]] = nr; // Nachname
      }
    }
    
    mitgliederIndex['nr:' + nr] = nr;
  }
  
  // Durchsuche alle Zahlungseingänge (überspringe Header)
  var matched = 0;
  var updated = 0;
  
  for (var i = 1; i < kontoValues.length; i++) {
    var row = kontoValues[i];
    var beguenstigter = row[5]; // Spalte F: Begünstigter
    var kontonummer = row[6]; // Spalte G: Kontonummer
    var verwendungszweck = row[4]; // Spalte E: Verwendungszweck
    var aktuelleMitgliedsNr = row[14]; // Spalte O: Mitgliedsnummer
    
    // Wenn bereits zugeordnet: Überspringen (außer wenn explizit neu zuordnen)
    if (aktuelleMitgliedsNr && aktuelleMitgliedsNr !== '') {
      continue;
    }
    
    // Suche Mitglied
    var member = findMember(beguenstigter, kontonummer, verwendungszweck);
    
    if (member) {
      // Setze Mitgliedsnummer
      kontoSheet.getRange(i + 1, 15).setValue(member.nr); // Spalte O (Index 14)
      
      // Aktualisiere Kategorie auf "Mitgliedsbeitrag" falls noch nicht gesetzt
      var aktuelleKategorie = row[11]; // Spalte L: Kategorie
      if (!aktuelleKategorie || aktuelleKategorie === '' || aktuelleKategorie === 'Spende') {
        kontoSheet.getRange(i + 1, 12).setValue('Mitgliedsbeitrag'); // Spalte L (Index 11)
      }
      
      // Aktualisiere Bemerkung
      var aktuelleBemerkung = row[15]; // Spalte P: Bemerkung
      if (!aktuelleBemerkung || aktuelleBemerkung === '') {
        kontoSheet.getRange(i + 1, 16).setValue('Mitglied Nr. ' + member.nr); // Spalte P (Index 15)
      }
      
      matched++;
      updated++;
    }
  }
  
  // Dashboard aktualisieren
  updateDashboard();
  
  SpreadsheetApp.getUi().alert(
    '✅ Mitglieder-Zuordnung abgeschlossen!\n\n' +
    'Zugeordnet: ' + matched + ' Zahlungseingänge\n' +
    'Aktualisiert: ' + updated + ' Einträge\n\n' +
    'Das Dashboard wurde automatisch aktualisiert.'
  );
}

/**
 * Zeigt bekannte Spender
 */
function showKnownDonorsDialog() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Zahlungseingänge Konto');
  
  if (!sheet) {
    SpreadsheetApp.getUi().alert('Keine Daten vorhanden. Bitte zuerst Zahlungseingänge erfassen.');
    return;
  }
  
  var values = sheet.getDataRange().getValues();
  var donors = {};
  
  // Sammle Spender
  // ACHTUNG: Neue Spaltenstruktur - Begünstigter ist Spalte F (Index 5), Kategorie ist Spalte L (Index 11)
  for (var i = 1; i < values.length; i++) {
    var row = values[i];
    var name = row[5]; // Spalte F: Begünstigter
    var kategorie = row[11]; // Spalte L: Kategorie
    
    if (name) {
      if (!donors[name]) {
        donors[name] = {
          count: 0,
          kategorie: kategorie
        };
      }
      donors[name].count++;
    }
  }
  
  // Erstelle Liste
  var list = [];
  for (var name in donors) {
    list.push(name + ' (' + donors[name].count + 'x, ' + donors[name].kategorie + ')');
  }
  
  list.sort();
  
  var message = '📋 BEKANNTE SPENDER (' + list.length + '):\n\n' + list.join('\n');
  
  SpreadsheetApp.getUi().alert(message);
}

// =============================================================================
// MITGLIEDER-INFO (E-Mail-Versand)
// =============================================================================

/**
 * Erstellt das Blatt für Mitglieder-Info
 */
function createMemberInfoSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var inputSheet = ss.getSheetByName('Mitglieder_Info_aktuell');
  
  if (!inputSheet) {
    inputSheet = ss.insertSheet('Mitglieder_Info_aktuell');
    
    // Formatierung
    inputSheet.setColumnWidth(1, 150);
    inputSheet.setColumnWidth(2, 600);
    
    // Überschriften
    inputSheet.getRange('A1').setValue('📧 MITGLIEDER-INFO');
    inputSheet.getRange('A1:B1').merge()
      .setFontWeight('bold')
      .setFontSize(16)
      .setBackground('#e3f2fd')
      .setHorizontalAlignment('center');
    
    inputSheet.getRange('A2').setValue('Betreff:').setFontWeight('bold');
    inputSheet.getRange('B2').setValue('');
    
    inputSheet.getRange('A3').setValue('Inhalt:').setFontWeight('bold');
    inputSheet.getRange('B3').setValue('').setWrap(true);
    inputSheet.setRowHeight(3, 300);
    
    // Formatierung für Inhaltsfeld
    inputSheet.getRange('B3').setFontSize(12);
    
    // Anweisung
    inputSheet.getRange('A5').setValue('💡 ANLEITUNG:');
    inputSheet.getRange('A5:B5').merge().setFontWeight('bold').setBackground('#fff3e0');
    
    inputSheet.getRange('A6').setValue('1. Fülle Betreff und Inhalt aus');
    inputSheet.getRange('A6:B6').merge();
    
    inputSheet.getRange('A7').setValue('2. Wähle: 📊 Buchhaltung → 👥 Mitglieder → Mitglieder-Info versenden');
    inputSheet.getRange('A7:B7').merge();
    
    inputSheet.getRange('A8').setValue('3. Bestätige den Versand');
    inputSheet.getRange('A8:B8').merge();
    
    inputSheet.getRange('A9').setValue('💡 TIPP: Vor dem Versand das Blatt duplizieren und umbenennen (z.B. "Info_März_2025") für Archivierung.');
    inputSheet.getRange('A9:B9').merge().setFontStyle('italic').setBackground('#f5f5f5');
    
    // Statistik-Bereich
    inputSheet.getRange('A11').setValue('📊 STATISTIK');
    inputSheet.getRange('A11:B11').merge()
      .setFontWeight('bold')
      .setBackground('#e3f2fd')
      .setHorizontalAlignment('center');
    
    inputSheet.getRange('A12').setValue('Versanddatum:').setFontWeight('bold');
    inputSheet.getRange('B12').setValue('');
    
    inputSheet.getRange('A13').setValue('Anzahl Empfänger:').setFontWeight('bold');
    inputSheet.getRange('B13').setValue('');
    
    inputSheet.getRange('A14').setValue('Status:').setFontWeight('bold');
    inputSheet.getRange('B14').setValue('');
  }
  
  ss.setActiveSheet(inputSheet);
  
  SpreadsheetApp.getUi().alert(
    '✅ Mitglieder-Info-Blatt wurde erstellt!\n\n' +
    'Bitte trage Betreff und Inhalt ein.\n\n' +
    'Zum Versenden: 📊 Buchhaltung → 👥 Mitglieder → Mitglieder-Info versenden'
  );
}

/**
 * Sendet Test-E-Mail an aktuellen Benutzer
 */
function sendInfoTest() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var inputSheet = ss.getSheetByName('Mitglieder_Info_aktuell');
  
  // Prüfe ob Info-Blatt existiert
  if (!inputSheet) {
    SpreadsheetApp.getUi().alert(
      '❌ Fehler: Mitglieder-Info-Blatt nicht gefunden!\n\n' +
      'Bitte zuerst erstellen: 📊 Buchhaltung → 👥 Mitglieder → Mitglieder-Info erstellen'
    );
    return;
  }
  
  // Lese Daten aus Info-Blatt
  var subject = inputSheet.getRange('B2').getValue();
  var content = inputSheet.getRange('B3').getValue();
  
  // Prüfe ob alle Felder ausgefüllt sind
  if (!subject || !content || !subject.trim() || !content.trim()) {
    SpreadsheetApp.getUi().alert(
      '❌ Fehlende Informationen!\n\n' +
      'Bitte fülle alle Felder im Mitglieder-Info-Blatt aus:\n' +
      '- Betreff\n' +
      '- Inhalt'
    );
    ss.setActiveSheet(inputSheet);
    return;
  }
  
  // Hole E-Mail-Adresse des aktuellen Benutzers
  var userEmail = Session.getActiveUser().getEmail();
  
  if (!userEmail) {
    SpreadsheetApp.getUi().alert(
      '❌ Fehler: E-Mail-Adresse des aktuellen Benutzers konnte nicht ermittelt werden.'
    );
    return;
  }
  
  // Bestätigung einholen
  var confirmSend = SpreadsheetApp.getUi().alert(
    '📧 Test-E-Mail senden',
    'Möchtest du eine Test-E-Mail an dich selbst senden?\n\n' +
    'Empfänger: ' + userEmail + '\n' +
    'Betreff: ' + subject + '\n\n' +
    'Dies ist identisch mit der E-Mail, die alle Mitglieder erhalten würden.',
    SpreadsheetApp.getUi().ButtonSet.YES_NO
  );
  
  if (confirmSend !== SpreadsheetApp.getUi().Button.YES) {
    return; // Benutzer hat abgebrochen
  }
  
  try {
    // Erstelle E-Mail-Template
    var emailTemplate = getMemberInfoTemplate(subject, content);
    
    // Sende Test-E-Mail
    GmailApp.sendEmail(
      userEmail,
      '[TEST] ' + subject,
      '⚠️ TEST-VERSAND\n\n' +
      'Dies ist eine Test-E-Mail für die Mitglieder-Info.\n\n' +
      '---\n\n' +
      emailTemplate.plainBody,
      {
        htmlBody: '<div style="background-color: #fff3cd; padding: 15px; border: 2px solid #ffc107; border-radius: 5px; margin-bottom: 20px;">' +
                  '<strong>⚠️ TEST-VERSAND</strong><br>' +
                  'Dies ist eine Test-E-Mail für die Mitglieder-Info. Sie zeigt, wie die E-Mail für alle Mitglieder aussehen wird.' +
                  '</div>' +
                  emailTemplate.htmlBody,
        name: 'Hoffnungsradler Dülmen e.V.',
        replyTo: Session.getActiveUser().getEmail()
      }
    );
    
    SpreadsheetApp.getUi().alert(
      '✅ Test-E-Mail erfolgreich versendet!\n\n' +
      'Empfänger: ' + userEmail + '\n\n' +
      'Bitte prüfe dein Postfach und passe bei Bedarf Betreff oder Inhalt an.\n\n' +
      'Wenn alles korrekt aussieht, kannst du die Mitglieder-Info an alle Mitglieder versenden.'
    );
    
  } catch (error) {
    SpreadsheetApp.getUi().alert(
      '❌ Fehler beim Versenden der Test-E-Mail:\n\n' +
      error.toString() + '\n\n' +
      'Bitte prüfe deine E-Mail-Berechtigungen in Google Apps Script.'
    );
  }
}

/**
 * Sendet Mitglieder-Info an alle Mitglieder
 */
function sendInfoToAllMembers() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var mitgliederSheet = ss.getSheetByName('Mitglieder');
  var inputSheet = ss.getSheetByName('Mitglieder_Info_aktuell');
  
  // Prüfe ob Mitgliedertabelle existiert
  if (!mitgliederSheet) {
    SpreadsheetApp.getUi().alert(
      '❌ Fehler: Tabelle "Mitglieder" nicht gefunden!\n\n' +
      'Bitte zuerst anlegen: 📊 Buchhaltung → Tabellen anlegen → Mitglieder anlegen'
    );
    return;
  }
  
  // Prüfe ob Info-Blatt existiert
  if (!inputSheet) {
    createMemberInfoSheet();
    inputSheet = ss.getSheetByName('Mitglieder_Info_aktuell');
  }
  
  // Lese Daten aus Info-Blatt
  var subject = inputSheet.getRange('B2').getValue();
  var content = inputSheet.getRange('B3').getValue();
  
  // Prüfe ob alle Felder ausgefüllt sind
  if (!subject || !content || !subject.trim() || !content.trim()) {
    SpreadsheetApp.getUi().alert(
      '❌ Fehlende Informationen!\n\n' +
      'Bitte fülle alle Felder im Mitglieder-Info-Blatt aus:\n' +
      '- Betreff\n' +
      '- Inhalt'
    );
    ss.setActiveSheet(inputSheet);
    return;
  }
  
  // Lese Mitgliederdaten
  var mitgliederValues = mitgliederSheet.getDataRange().getValues();
  
  // Zähle aktive Mitglieder mit E-Mail
  var activeMembersWithEmail = [];
  for (var i = 1; i < mitgliederValues.length; i++) {
    var row = mitgliederValues[i];
    var nr = row[0]; // Spalte A: Nr.
    var name = row[1]; // Spalte B: Name
    var email = row[3]; // Spalte D: Email
    var status = row[6]; // Spalte G: Beitragsstatus
    
    // Nur aktive Mitglieder mit E-Mail
    if (email && email.trim() && status !== 'Ausgetreten' && status !== 'Verstorben') {
      activeMembersWithEmail.push({
        nr: nr,
        name: name,
        email: email.trim()
      });
    }
  }
  
  if (activeMembersWithEmail.length === 0) {
    SpreadsheetApp.getUi().alert(
      '❌ Keine Empfänger gefunden!\n\n' +
      'Bitte prüfe:\n' +
      '- Sind Mitglieder eingetragen?\n' +
      '- Haben Mitglieder E-Mail-Adressen?\n' +
      '- Sind Mitglieder als "Aktiv" markiert?'
    );
    return;
  }
  
  // Bestätigung einholen
  var confirmSend = SpreadsheetApp.getUi().alert(
    '📧 Mitglieder-Info versenden',
    'Möchtest du die Mitglieder-Info an ' + activeMembersWithEmail.length + ' Mitglieder versenden?\n\n' +
    'Betreff: ' + subject + '\n\n' +
    'Die E-Mails werden im Namen von "Hoffnungsradler Dülmen" versendet.',
    SpreadsheetApp.getUi().ButtonSet.YES_NO
  );
  
  if (confirmSend !== SpreadsheetApp.getUi().Button.YES) {
    return; // Benutzer hat abgebrochen
  }
  
  // Versand durchführen
  var sentCount = 0;
  var failCount = 0;
  var failedEmails = [];
  
  var emailTemplate = getMemberInfoTemplate(subject, content);
  
  for (var i = 0; i < activeMembersWithEmail.length; i++) {
    var member = activeMembersWithEmail[i];
    
    try {
      // Personalisierte Anrede
      var personalizedContent = content.replace(/Liebe Hoffnungsradler/g, 'Liebe/r ' + (member.name || 'Hoffnungsradler'));
      
      var personalizedTemplate = getMemberInfoTemplate(subject, personalizedContent);
      
      // E-Mail senden
      GmailApp.sendEmail(
        member.email,
        subject,
        personalizedTemplate.plainBody,
        {
          htmlBody: personalizedTemplate.htmlBody,
          name: 'Hoffnungsradler Dülmen e.V.',
          replyTo: Session.getActiveUser().getEmail()
        }
      );
      
      sentCount++;
      
      // Pause zwischen E-Mails (Gmail-Limit: max 100 E-Mails pro Tag)
      // 1 Sekunde Pause verhindert Rate-Limits
      Utilities.sleep(1000);
      
    } catch (error) {
      Logger.log('Fehler beim Senden an ' + member.email + ' (Mitglied Nr. ' + member.nr + '): ' + error.toString());
      failCount++;
      failedEmails.push(member.email);
    }
  }
  
  // Statistik aktualisieren
  inputSheet.getRange('B12').setValue(Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd.MM.yyyy HH:mm'));
  inputSheet.getRange('B13').setValue(sentCount + ' / ' + activeMembersWithEmail.length);
  
  if (failCount === 0) {
    inputSheet.getRange('B14').setValue('✅ Erfolgreich versendet');
  } else {
    inputSheet.getRange('B14').setValue('⚠️ ' + sentCount + ' versendet, ' + failCount + ' Fehler');
  }
  
  // Ergebnis-Dialog
  var resultMessage = '✅ Mitglieder-Info versendet!\n\n' +
    'Versendet: ' + sentCount + ' / ' + activeMembersWithEmail.length + '\n' +
    'Fehler: ' + failCount;
  
  if (failCount > 0) {
    resultMessage += '\n\nFehlerhafte E-Mails:\n' + failedEmails.join('\n');
  }
  
  SpreadsheetApp.getUi().alert(resultMessage);
}

/**
 * Erstellt E-Mail-Template für Mitglieder-Info
 */
function getMemberInfoTemplate(subject, content) {
  var plainBody = 
    'Mitteilung der Hoffnungsradler Dülmen e.V.\n\n' +
    'Liebe Hoffnungsradler,\n\n' +
    content + '\n\n' +
    'Mit radsportlichen Grüßen,\n' +
    'Martin Stolz\n' +
    'im Namen des Vorstandes der Hoffnungsradler Dülmen e.V.';
  
  var htmlBody = 
    '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">' +
    '<h1 style="color: #2E7D32; margin-bottom: 10px;">Hoffnungsradler Dülmen e.V.</h1>' +
    '<hr style="border: none; border-top: 2px solid #2E7D32; margin: 20px 0;">' +
    '<p style="font-size: 16px; line-height: 1.6;">Liebe Hoffnungsradler,</p>' +
    '<div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2E7D32;">' +
    content.replace(/\n/g, '<br>') +
    '</div>' +
    '<p style="font-size: 16px; line-height: 1.6;">Mit radsportlichen Grüßen,</p>' +
    '<p style="font-size: 16px; line-height: 1.6;"><strong>Martin Stolz</strong><br>' +
    'im Namen des Vorstandes der Hoffnungsradler Dülmen e.V.</p>' +
    '<hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">' +
    '<p style="font-size: 12px; color: #666; text-align: center;">' +
    'Hoffnungsradler Dülmen e.V. | Gemeinsam bewegen wir mehr.' +
    '</p>' +
    '</div>';
  
  return {
    plainBody: plainBody,
    htmlBody: htmlBody
  };
}

// =============================================================================
// BACKUP SYSTEM
// =============================================================================

/**
 * Erstellt sofort ein Backup des Spreadsheets
 */
function createBackupNow() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var ssName = ss.getName();
  var dateString = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd_HH-mm');
  var backupName = ssName + ' - Backup ' + dateString;
  
  try {
    // Erstelle Kopie
    var backupFile = ss.copy(backupName);
    
    // Verschiebe in Backup-Ordner (optional - falls Ordner existiert)
    try {
      var folder = DriveApp.getFolderById(ss.getParents()[0].getId());
      var backupFolder = getOrCreateBackupFolder(folder);
      var file = DriveApp.getFileById(backupFile.getId());
      backupFolder.addFile(file);
      DriveApp.getRootFolder().removeFile(file);
    } catch (e) {
      // Backup-Ordner existiert nicht oder Fehler - Backup bleibt im gleichen Ordner
      Logger.log('Backup-Ordner konnte nicht erstellt werden: ' + e.toString());
    }
    
    var backupUrl = 'https://docs.google.com/spreadsheets/d/' + backupFile.getId();
    
    SpreadsheetApp.getUi().alert(
      '✅ Backup erfolgreich erstellt!\n\n' +
      'Name: ' + backupName + '\n\n' +
      'Das Backup wurde im gleichen Ordner wie das Original gespeichert.\n\n' +
      'Link: ' + backupUrl
    );
    
  } catch (error) {
    SpreadsheetApp.getUi().alert(
      '❌ Fehler beim Erstellen des Backups:\n\n' + error.toString()
    );
  }
}

/**
 * Erstellt oder findet Backup-Ordner
 */
function getOrCreateBackupFolder(parentFolder) {
  var folders = parentFolder.getFoldersByName('Backups');
  
  if (folders.hasNext()) {
    return folders.next();
  } else {
    return parentFolder.createFolder('Backups');
  }
}

/**
 * Richtet automatisches Backup ein
 */
function setupAutomaticBackup() {
  var ui = SpreadsheetApp.getUi();
  
  var response = ui.alert(
    '💾 Automatisches Backup einrichten',
    'Das System kann automatisch regelmäßig Backups erstellen.\n\n' +
    'Wie oft soll ein Backup erstellt werden?\n\n' +
    '⚠️ HINWEIS: Sie benötigen die Berechtigung zum Erstellen von Zeitgesteuerten Triggern.',
    ui.ButtonSet.OK_CANCEL
  );
  
  if (response !== ui.Button.OK) {
    return;
  }
  
  // Prüfe ob Trigger bereits existiert
  var triggers = ScriptApp.getProjectTriggers();
  var backupTriggerExists = false;
  
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === 'createScheduledBackup') {
      backupTriggerExists = true;
      break;
    }
  }
  
  if (backupTriggerExists) {
    ui.alert(
      '⚠️ Automatisches Backup ist bereits eingerichtet!\n\n' +
      'Um es zu ändern, entfernen Sie zuerst den bestehenden Trigger.'
    );
    return;
  }
  
  // Erstelle täglichen Trigger (um 2 Uhr nachts)
  try {
    ScriptApp.newTrigger('createScheduledBackup')
      .timeBased()
      .everyDays(1)
      .atHour(2)
      .create();
    
    ui.alert(
      '✅ Automatisches Backup eingerichtet!\n\n' +
      'Ein Backup wird täglich um 2:00 Uhr erstellt.\n\n' +
      'Die Backups werden im Ordner "Backups" gespeichert (falls vorhanden).'
    );
    
  } catch (error) {
    ui.alert(
      '❌ Fehler beim Einrichten des automatischen Backups:\n\n' +
      error.toString() + '\n\n' +
      'Mögliche Ursachen:\n' +
      '- Sie haben keine Berechtigung für Zeitgesteuerte Trigger\n' +
      '- Die App benötigt zusätzliche Berechtigungen\n\n' +
      'Lösung: Manuelles Backup nutzen (💾 Backup → Backup jetzt erstellen)'
    );
  }
}

/**
 * Wird automatisch vom Trigger aufgerufen
 */
function createScheduledBackup() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var ssName = ss.getName();
    var dateString = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');
    var backupName = ssName + ' - Auto-Backup ' + dateString;
    
    // Prüfe ob Backup für heute bereits existiert
    var existingBackups = DriveApp.getFilesByName(backupName);
    if (existingBackups.hasNext()) {
      Logger.log('Backup für ' + dateString + ' existiert bereits. Überspringe.');
      return;
    }
    
    // Erstelle Backup
    var backupFile = ss.copy(backupName);
    
    // Verschiebe in Backup-Ordner (falls möglich)
    try {
      var folder = DriveApp.getFolderById(ss.getParents()[0].getId());
      var backupFolder = getOrCreateBackupFolder(folder);
      var file = DriveApp.getFileById(backupFile.getId());
      backupFolder.addFile(file);
      DriveApp.getRootFolder().removeFile(file);
    } catch (e) {
      // Backup bleibt im gleichen Ordner
      Logger.log('Backup-Ordner konnte nicht verwendet werden: ' + e.toString());
    }
    
    Logger.log('Automatisches Backup erstellt: ' + backupName);
    
    // Optional: E-Mail-Benachrichtigung an Besitzer
    try {
      var ownerEmail = Session.getEffectiveUser().getEmail();
      MailApp.sendEmail(
        ownerEmail,
        'Backup erstellt - Hoffnungsradler Buchhaltung',
        'Automatisches Backup wurde erfolgreich erstellt:\n\n' +
        'Name: ' + backupName + '\n' +
        'Datum: ' + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd.MM.yyyy HH:mm')
      );
    } catch (e) {
      Logger.log('E-Mail-Benachrichtigung konnte nicht gesendet werden: ' + e.toString());
    }
    
  } catch (error) {
    Logger.log('Fehler beim automatischen Backup: ' + error.toString());
    
    // Fehler per E-Mail melden
    try {
      var ownerEmail = Session.getEffectiveUser().getEmail();
      MailApp.sendEmail(
        ownerEmail,
        '⚠️ Backup-Fehler - Hoffnungsradler Buchhaltung',
        'Das automatische Backup konnte nicht erstellt werden:\n\n' +
        'Fehler: ' + error.toString() + '\n' +
        'Datum: ' + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd.MM.yyyy HH:mm')
      );
    } catch (e) {
      Logger.log('Fehler-E-Mail konnte nicht gesendet werden: ' + e.toString());
    }
  }
}

// =============================================================================
// DATUMS-KORREKTUR
// =============================================================================

/**
 * Konvertiert Text-Datumswerte in echte Datumswerte in allen Buchhaltungstabellen
 * Löst Probleme mit Copy & Paste aus CSV/Excel
 */
function fixDateColumns() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var ui = SpreadsheetApp.getUi();
  
  var result = ui.alert(
    '🔧 Datumsspalten korrigieren',
    'Diese Funktion konvertiert alle Text-Datumswerte in echte Datumswerte.\n\n' +
    'Dies behebt Probleme bei der Anzeige des "Letzten Eintrags" im Dashboard.\n\n' +
    'Möchten Sie fortfahren?',
    ui.ButtonSet.YES_NO
  );
  
  if (result !== ui.Button.YES) {
    return;
  }
  
  var fixedCount = 0;
  
  // 1. Zahlungseingänge Konto: Spalte B (Buchungstag) und C (Valutadatum)
  var kontoSheet = ss.getSheetByName('Zahlungseingänge Konto');
  if (kontoSheet) {
    fixedCount += fixDateColumn(kontoSheet, 2, 'Buchungstag'); // Spalte B
    fixedCount += fixDateColumn(kontoSheet, 3, 'Valutadatum'); // Spalte C
  }
  
  // 2. Bargeldspenden: Spalte A (Datum)
  var bargeldSheet = ss.getSheetByName('Bargeldspenden');
  if (bargeldSheet) {
    fixedCount += fixDateColumn(bargeldSheet, 1, 'Datum');
  }
  
  // 3. Ausgaben: Spalte A (Datum)
  var ausgabenSheet = ss.getSheetByName('Ausgaben');
  if (ausgabenSheet) {
    fixedCount += fixDateColumn(ausgabenSheet, 1, 'Datum');
  }
  
  // 4. Übergebene Spenden: Spalte D (Datum)
  var uebergabeSheet = ss.getSheetByName('Übergebene Spenden');
  if (uebergabeSheet) {
    fixedCount += fixDateColumn(uebergabeSheet, 4, 'Datum');
  }
  
  ui.alert('✅ Datums-Korrektur abgeschlossen!\n\n' +
           fixedCount + ' Datumswerte wurden konvertiert.\n\n' +
           'Das Dashboard sollte jetzt die korrekten "Letzten Einträge" anzeigen.');
}

/**
 * Hilfs-Funktion: Konvertiert Text-Datumswerte in einer Spalte zu echten Datumswerten
 */
function fixDateColumn(sheet, columnNumber, columnName) {
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return 0; // Keine Daten
  
  var range = sheet.getRange(2, columnNumber, lastRow - 1, 1);
  var values = range.getValues();
  var fixedCount = 0;
  
  for (var i = 0; i < values.length; i++) {
    var cell = values[i][0];
    
    // Prüfe ob Zelle leer ist
    if (!cell || cell === '') continue;
    
    // Prüfe ob bereits ein Datum-Objekt
    if (cell instanceof Date) continue;
    
    // Versuche Text zu parsen
    var dateValue = parseDateValue(cell);
    if (dateValue) {
      values[i][0] = dateValue;
      fixedCount++;
    }
  }
  
  // Schreibe konvertierte Werte zurück
  if (fixedCount > 0) {
    range.setValues(values);
    Logger.log(sheet.getName() + ' - ' + columnName + ': ' + fixedCount + ' Werte konvertiert');
  }
  
  return fixedCount;
}

/**
 * Hilfs-Funktion: Parst verschiedene Datumsformate
 */
function parseDateValue(value) {
  if (!value) return null;
  
  // Wenn bereits Date-Objekt, zurückgeben
  if (value instanceof Date) return value;
  
  var str = value.toString().trim();
  if (!str) return null;
  
  // Format: DD.MM.YYYY oder DD.MM.YY
  var match = str.match(/^(\d{1,2})\.(\d{1,2})\.(\d{2,4})$/);
  if (match) {
    var day = parseInt(match[1]);
    var month = parseInt(match[2]) - 1; // Monat ist 0-basiert
    var year = parseInt(match[3]);
    
    // Zweistelliges Jahr zu vierstellig
    if (year < 100) {
      year += (year < 50) ? 2000 : 1900;
    }
    
    return new Date(year, month, day);
  }
  
  // Format: YYYY-MM-DD
  match = str.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (match) {
    var year = parseInt(match[1]);
    var month = parseInt(match[2]) - 1;
    var day = parseInt(match[3]);
    return new Date(year, month, day);
  }
  
  // Versuche Standard-Parsing
  try {
    var date = new Date(str);
    if (!isNaN(date.getTime())) {
      return date;
    }
  } catch (e) {
    // Ignoriere Fehler
  }
  
  return null;
}

// =============================================================================
// CSV-IMPORT (ROBUST)
// =============================================================================

/**
 * Zeigt Dialog für CSV-Import
 */
function showCSVImportDialog() {
  var html = HtmlService.createHtmlOutput(getCSVImportHTML())
    .setWidth(700)
    .setHeight(500);
  SpreadsheetApp.getUi().showModalDialog(html, '📥 Sparkassen-CSV importieren');
}

/**
 * HTML für CSV-Import-Dialog
 */
function getCSVImportHTML() {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <base target="_top">
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #333;
          }
          .container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          }
          h2 {
            color: #667eea;
            margin-top: 0;
          }
          .info {
            background: #e3f2fd;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
            border-left: 4px solid #2196F3;
          }
          .warning {
            background: #fff3e0;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
            border-left: 4px solid #ff9800;
          }
          textarea {
            width: 100%;
            height: 200px;
            padding: 10px;
            border: 2px solid #ddd;
            border-radius: 5px;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            box-sizing: border-box;
          }
          button {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 12px 30px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            margin-top: 20px;
            transition: transform 0.2s;
          }
          button:hover {
            transform: scale(1.05);
          }
          button:disabled {
            background: #ccc;
            cursor: not-allowed;
            transform: none;
          }
          .success {
            color: #4CAF50;
            font-weight: bold;
            display: none;
          }
          .error {
            color: #f44336;
            font-weight: bold;
            display: none;
          }
          .step {
            margin: 15px 0;
            padding-left: 30px;
            position: relative;
          }
          .step::before {
            content: "→";
            position: absolute;
            left: 0;
            color: #667eea;
            font-weight: bold;
            font-size: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>📥 Sparkassen-CSV importieren</h2>
          
          <div class="info">
            <strong>📋 Anleitung:</strong>
            <div class="step">Öffne deine Sparkassen-CSV-Datei mit einem Texteditor (z.B. Notepad)</div>
            <div class="step">Kopiere den <strong>kompletten Inhalt</strong> (Strg+A, Strg+C)</div>
            <div class="step">Füge ihn unten in das Textfeld ein (Strg+V)</div>
            <div class="step">Klicke auf "Importieren"</div>
          </div>
          
          <div class="warning">
            <strong>⚠️ Wichtig:</strong> Die CSV-Datei muss im Sparkassen-Format vorliegen 
            (mit Spalten: Auftragskonto, Buchungstag, Valutadatum, etc.)
          </div>
          
          <label for="csvData"><strong>CSV-Daten:</strong></label>
          <textarea id="csvData" placeholder="Füge hier den kompletten CSV-Inhalt ein..."></textarea>
          
          <button onclick="importCSV()" id="importBtn">🚀 Importieren</button>
          
          <div id="result"></div>
        </div>
        
        <script>
          function importCSV() {
            const csvData = document.getElementById('csvData').value;
            const btn = document.getElementById('importBtn');
            const result = document.getElementById('result');
            
            if (!csvData.trim()) {
              result.innerHTML = '<p class="error" style="display:block;">❌ Bitte CSV-Daten einfügen!</p>';
              return;
            }
            
            btn.disabled = true;
            btn.textContent = '⏳ Importiere...';
            result.innerHTML = '<p style="color: #666;">Verarbeite CSV-Daten...</p>';
            
            google.script.run
              .withSuccessHandler(function(response) {
                result.innerHTML = '<p class="success" style="display:block;">' + response + '</p>';
                btn.textContent = '✅ Import abgeschlossen';
                setTimeout(function() {
                  google.script.host.close();
                }, 2000);
              })
              .withFailureHandler(function(error) {
                result.innerHTML = '<p class="error" style="display:block;">❌ Fehler: ' + error.message + '</p>';
                btn.disabled = false;
                btn.textContent = '🚀 Importieren';
              })
              .processCSVImportRobust(csvData);
          }
        </script>
      </body>
    </html>
  `;
}

/**
 * Robuste CSV-Import-Funktion mit korrekter Datums-Konvertierung
 */
function processCSVImportRobust(csvData) {
  if (!csvData || csvData.trim() === '') {
    throw new Error('Keine CSV-Daten vorhanden');
  }
  
  // Parse CSV
  var lines = csvData.split(/\r?\n/);
  Logger.log('Anzahl Zeilen: ' + lines.length);
  
  if (lines.length < 2) {
    throw new Error('CSV-Datei enthält zu wenige Zeilen (mindestens 2 benötigt: Header + Daten)');
  }
  
  // Erkenne Delimiter (Semikolon oder Komma)
  var delimiter = detectDelimiter(lines[0]);
  Logger.log('Erkannter Delimiter: ' + delimiter);
  
  // Parse Header
  var headerLine = lines[0];
  var headers = parseCSVLine(headerLine, delimiter);
  Logger.log('Header: ' + headers.join(', '));
  Logger.log('Anzahl Header-Spalten: ' + headers.length);
  
  // Validiere Header (Prüfe ob mindestens Buchungstag ODER Betrag vorhanden)
  var hasBuchungstag = headers.includes('Buchungstag');
  var hasBetrag = headers.includes('Betrag');
  
  if (!hasBuchungstag || !hasBetrag) {
    throw new Error('Ungültiges CSV-Format. Gefundene Spalten: ' + headers.join(', ') + '\\n\\nBenötigt werden: Buchungstag UND Betrag');
  }
  
  // Parse Datenzeilen
  var rows = [];
  var skippedLines = 0;
  
  for (var i = 1; i < lines.length; i++) {
    var line = lines[i].trim();
    if (line === '') {
      skippedLines++;
      continue;
    }
    
    var fields = parseCSVLine(line, delimiter);
    
    // Flexibleres Matching: Akzeptiere auch Zeilen mit +/- 1 Feld
    if (Math.abs(fields.length - headers.length) <= 1) {
      // Fülle fehlende Felder mit leeren Strings auf
      while (fields.length < headers.length) {
        fields.push('');
      }
      // Schneide überzählige Felder ab
      fields = fields.slice(0, headers.length);
      
      var rowData = {};
      for (var j = 0; j < headers.length; j++) {
        rowData[headers[j]] = fields[j];
      }
      rows.push(rowData);
    } else {
      Logger.log('Zeile ' + (i+1) + ' übersprungen: ' + fields.length + ' Felder (erwartet: ' + headers.length + ')');
      skippedLines++;
    }
  }
  
  Logger.log('Geparste Zeilen: ' + rows.length);
  Logger.log('Übersprungene Zeilen: ' + skippedLines);
  
  if (rows.length === 0) {
    throw new Error('Keine gültigen Datenzeilen gefunden.\\n\\n' +
                    'Zeilen insgesamt: ' + lines.length + '\\n' +
                    'Erwartete Spalten: ' + headers.length + '\\n' +
                    'Übersprungene Zeilen: ' + skippedLines + '\\n\\n' +
                    'Tipp: Überprüfe, ob die CSV-Datei im korrekten Sparkassen-Format vorliegt.');
  }
  
  // Importiere in Sheet mit Kategorisierung
  var result = importRowsToKontoSheet(rows);
  var importedCount = result.imported || result;
  var skippedCount = result.skipped || 0;
  
  var message = '✅ Erfolgreich ' + importedCount + ' neue Buchungen importiert und kategorisiert!';
  if (skippedCount > 0) {
    message += '\\n\\n(' + skippedCount + ' Duplikate übersprungen)';
  }
  if (skippedLines > 0) {
    message += '\\n(' + skippedLines + ' ungültige Zeilen übersprungen)';
  }
  
  return message;
}

/**
 * Importiert Zeilen in "Zahlungseingänge Konto" mit automatischer Kategorisierung
 * Neue Buchungen werden OBEN eingefügt, Duplikate werden übersprungen
 */
function importRowsToKontoSheet(rows) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Zahlungseingänge Konto');
  
  if (!sheet) {
    throw new Error('Tabelle "Zahlungseingänge Konto" nicht gefunden. Bitte zuerst anlegen.');
  }
  
  // Lade alle existierenden Buchungen für Duplikat-Prüfung
  var lastRow = sheet.getLastRow();
  var existingKeys = {};
  
  if (lastRow > 1) {
    var existingData = sheet.getRange(2, 1, lastRow - 1, 16).getValues();
    
    // Erstelle Objekt mit eindeutigen Identifikatoren bestehender Buchungen
    for (var i = 0; i < existingData.length; i++) {
      var row = existingData[i];
      var buchungstag = row[1]; // Spalte B
      var betrag = row[8]; // Spalte I
      var beguenstigter = (row[5] || '').toString().trim(); // Spalte F
      
      // Erstelle eindeutigen Key: Datum + Betrag + Begünstigter
      if (buchungstag && betrag !== null && betrag !== undefined && betrag !== '') {
        var key = formatDateForKey(buchungstag) + '|' + parseFloat(betrag).toFixed(2) + '|' + beguenstigter.toLowerCase();
        existingKeys[key] = true;
      }
    }
  }
  
  var importedCount = 0;
  var skippedCount = 0;
  var newRows = [];
  
  for (var i = 0; i < rows.length; i++) {
    var row = rows[i];
    
    // Konvertiere Datum zu Date-Objekt
    var buchungstag = parseSparkassenDate(row['Buchungstag']);
    var valutadatum = parseSparkassenDate(row['Valutadatum']);
    
    // Konvertiere Betrag zu Zahl
    var betrag = parseSparkassenBetrag(row['Betrag']);
    
    // Flexible Spaltennamen (mit/ohne Umlaute)
    var beguenstigter = (row['Beguenstigter/Zahlungspflichtiger'] || row['Begünstigter/Zahlungspflichtiger'] || row['Begünstigter'] || '').toString().trim();
    var kontonummer = row['Kontonummer/IBAN'] || row['Kontonummer'] || '';
    var bic = row['BIC (SWIFT-Code)'] || row['BIC (SWIFT)'] || '';
    var waehrung = row['Waehrung'] || row['Währung'] || 'EUR';
    
    // Prüfe auf Duplikat
    if (buchungstag && betrag !== null && betrag !== undefined && betrag !== 0) {
      var key = formatDateForKey(buchungstag) + '|' + betrag.toFixed(2) + '|' + beguenstigter.toLowerCase();
      if (existingKeys[key]) {
        skippedCount++;
        Logger.log('Duplikat übersprungen: ' + formatDateForKey(buchungstag) + ' | ' + betrag + ' | ' + beguenstigter);
        continue;
      }
    }
    
    // Extrahiere IBAN
    var iban = extractIBAN(kontonummer);
    
    // Automatische Kategorisierung
    var kategorie = categorizeTransaction(row, betrag);
    var mitgliedsnummer = '';
    
    // Suche Mitglied (falls relevant)
    if (kategorie === 'Mitgliedsbeitrag' || betrag > 0) {
      var member = findMember(beguenstigter, iban, row['Verwendungszweck'] || '');
      if (member) {
        mitgliedsnummer = member.nummer;
        if (kategorie === '') {
          kategorie = 'Mitgliedsbeitrag';
        }
      }
    }
    
    // Erstelle Zeile
    var newRow = [
      row['Auftragskonto'] || '',
      buchungstag,
      valutadatum,
      row['Buchungstext'] || '',
      row['Verwendungszweck'] || '',
      beguenstigter,
      kontonummer,
      bic,
      betrag,
      waehrung,
      row['Info'] || '',
      kategorie,
      '', // Quittung ausgestellt
      '', // Quittungsnummer
      mitgliedsnummer,
      ''  // Bemerkung
    ];
    
    newRows.push(newRow);
    importedCount++;
  }
  
  // Füge neue Zeilen OBEN ein (nach Header-Zeile)
  if (newRows.length > 0) {
    // Sortiere nach Datum (neueste zuerst)
    newRows.sort(function(a, b) {
      var dateA = a[1] instanceof Date ? a[1].getTime() : 0;
      var dateB = b[1] instanceof Date ? b[1].getTime() : 0;
      return dateB - dateA; // Absteigend (neueste zuerst)
    });
    
    // Füge alle neuen Zeilen auf einmal ein (nach Zeile 1, also oben)
    var insertRow = 2; // Nach Header-Zeile
    sheet.insertRowsAfter(1, newRows.length);
    var range = sheet.getRange(insertRow, 1, newRows.length, 16);
    range.setValues(newRows);
    
    // Formatierung: Weißer Hintergrund für Datenzeilen (nicht Header-Format!)
    range.setBackground('#ffffff');
    
    // Datumsspalten
    sheet.getRange(insertRow, 2, newRows.length, 1).setNumberFormat('dd.mm.yyyy'); // Buchungstag
    sheet.getRange(insertRow, 3, newRows.length, 1).setNumberFormat('dd.mm.yyyy'); // Valutadatum
    
    // Betragsspalte
    sheet.getRange(insertRow, 9, newRows.length, 1).setNumberFormat('#,##0.00 €');
  }
  
  Logger.log('Import abgeschlossen: ' + importedCount + ' neue Buchungen, ' + skippedCount + ' Duplikate übersprungen');
  
  // Sortiere die Tabelle nach Datum (neueste zuerst)
  sortSheetByDate(sheet, 2, 1); // Spalte B (Buchungstag), Start bei Zeile 2
  
  return {
    imported: importedCount,
    skipped: skippedCount
  };
}

/**
 * Formatiert ein Datum für den Duplikat-Key
 */
function formatDateForKey(date) {
  if (!date) return '';
  if (date instanceof Date) {
    return Utilities.formatDate(date, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  }
  // Falls String, versuche zu parsen
  var match = date.toString().match(/(\d{1,2})\.(\d{1,2})\.(\d{4})/);
  if (match) {
    var day = match[1].length === 1 ? '0' + match[1] : match[1];
    var month = match[2].length === 1 ? '0' + match[2] : match[2];
    return match[3] + '-' + month + '-' + day;
  }
  return date.toString();
}

// =============================================================================
// TABELLEN-SORTIERUNG
// =============================================================================

/**
 * Sortiert alle Buchhaltungstabellen nach Datum (neueste zuerst)
 */
function sortAllSheetsByDate() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var ui = SpreadsheetApp.getUi();
  
  try {
    // Zahlungseingänge Konto: Spalte B (Buchungstag)
    var kontoSheet = ss.getSheetByName('Zahlungseingänge Konto');
    if (kontoSheet && kontoSheet.getLastRow() > 1) {
      sortSheetByDate(kontoSheet, 2, 1); // Spalte B, Start Zeile 2
    }
    
    // Bargeldspenden: Spalte A (Datum)
    var bargeldSheet = ss.getSheetByName('Bargeldspenden');
    if (bargeldSheet && bargeldSheet.getLastRow() > 1) {
      sortSheetByDate(bargeldSheet, 1, 1); // Spalte A, Start Zeile 2
    }
    
    // Ausgaben: Spalte A (Datum)
    var ausgabenSheet = ss.getSheetByName('Ausgaben');
    if (ausgabenSheet && ausgabenSheet.getLastRow() > 1) {
      sortSheetByDate(ausgabenSheet, 1, 1); // Spalte A, Start Zeile 2
    }
    
    // Übergebene Spenden: Spalte D (Datum)
    var uebergabeSheet = ss.getSheetByName('Übergebene Spenden');
    if (uebergabeSheet && uebergabeSheet.getLastRow() > 1) {
      sortSheetByDate(uebergabeSheet, 4, 1); // Spalte D, Start Zeile 2
    }
    
    ui.alert('✅ Alle Tabellen wurden nach Datum sortiert (neueste zuerst)!');
  } catch (error) {
    ui.alert('❌ Fehler beim Sortieren: ' + error.toString());
  }
}

/**
 * Sortiert ein Sheet nach Datum in einer bestimmten Spalte (absteigend = neueste zuerst)
 * @param {Sheet} sheet - Das zu sortierende Sheet
 * @param {number} dateColumn - Spaltennummer mit dem Datum (1 = A, 2 = B, etc.)
 * @param {number} headerRows - Anzahl der Header-Zeilen (normalerweise 1)
 */
function sortSheetByDate(sheet, dateColumn, headerRows) {
  var lastRow = sheet.getLastRow();
  
  // Keine Daten außer Header
  if (lastRow <= headerRows) {
    return;
  }
  
  // Sortiere Datenbereich (ab Zeile headerRows + 1)
  var dataRange = sheet.getRange(headerRows + 1, 1, lastRow - headerRows, sheet.getLastColumn());
  
  // Sortiere nach Datumsspalte, absteigend (neueste zuerst)
  dataRange.sort([{
    column: dateColumn,
    ascending: false // false = absteigend (neueste zuerst)
  }]);
  
  Logger.log(sheet.getName() + ' wurde nach Spalte ' + dateColumn + ' sortiert (neueste zuerst)');
}

/**
 * Parst Sparkassen-Datum (DD.MM.YYYY) zu Date-Objekt
 */
function parseSparkassenDate(dateStr) {
  if (!dateStr || dateStr === '') return '';
  
  var match = dateStr.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  if (match) {
    var day = parseInt(match[1]);
    var month = parseInt(match[2]) - 1; // Monat ist 0-basiert
    var year = parseInt(match[3]);
    return new Date(year, month, day);
  }
  
  return '';
}

/**
 * Parst Sparkassen-Betrag (z.B. "1.234,56" oder "-1.234,56")
 */
function parseSparkassenBetrag(betragStr) {
  if (!betragStr || betragStr === '') return 0;
  
  // Entferne Währungssymbole und Leerzeichen
  var cleaned = betragStr.replace(/[^\d,.-]/g, '');
  
  // Ersetze deutsches Format: Punkt als Tausender, Komma als Dezimal
  cleaned = cleaned.replace(/\./g, ''); // Entferne Tausender-Punkte
  cleaned = cleaned.replace(',', '.'); // Komma zu Punkt
  
  var value = parseFloat(cleaned);
  return isNaN(value) ? 0 : value;
}

/**
 * Erkennt den Delimiter einer CSV-Zeile (Tab, Semikolon oder Komma)
 */
function detectDelimiter(line) {
  var tabCount = (line.match(/\t/g) || []).length;
  var semicolonCount = (line.match(/;/g) || []).length;
  var commaCount = (line.match(/,/g) || []).length;
  
  // Tab hat höchste Priorität (häufig bei Sparkasse)
  if (tabCount > 0 && tabCount >= semicolonCount && tabCount >= commaCount) {
    return '\t';
  }
  
  // Semikolon hat zweite Priorität
  if (semicolonCount > commaCount) {
    return ';';
  }
  
  return ',';
}

/**
 * Parst eine CSV-Zeile unter Berücksichtigung von Anführungszeichen
 */
function parseCSVLine(line, delimiter) {
  var fields = [];
  var field = '';
  var inQuotes = false;
  
  for (var i = 0; i < line.length; i++) {
    var char = line[i];
    var nextChar = (i + 1 < line.length) ? line[i + 1] : '';
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        field += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote mode
        inQuotes = !inQuotes;
      }
    } else if (char === delimiter && !inQuotes) {
      // End of field
      fields.push(field.trim());
      field = '';
    } else {
      field += char;
    }
  }
  
  // Add last field
  fields.push(field.trim());
  
  return fields;
}
