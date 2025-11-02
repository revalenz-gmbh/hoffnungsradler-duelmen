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
    .addItem('Zahlungseingänge Konto anlegen', 'createKontoSheet')
    .addItem('Bargeldspenden anlegen', 'createBargeldSheet')
    .addItem('Ausgaben anlegen', 'createAusgabenSheet')
    .addItem('Übergebene Spenden anlegen', 'createUebergabeSheet')
      .addItem('Spendenquittungen anlegen', 'createQuittungenSheet')
      .addItem('Import-Regeln anlegen', 'createImportRulesSheet'))
    .addSeparator()
    .addSubMenu(ui.createMenu('Aktionen')
      .addItem('Dashboard aktualisieren', 'updateDashboard')
      .addItem('Jahresabschluss erstellen', 'showJahresabschlussDialog')
      .addItem('Quittung ausstellen', 'showQuittungDialog'))
    .addSeparator()
    .addSubMenu(ui.createMenu('🔄 Import')
      .addItem('Kontoauszug importieren', 'showImportDialog')
      .addItem('Import-Regeln bearbeiten', 'openImportRulesSheet')
      .addItem('Bekannte Spender anzeigen', 'showKnownDonorsDialog'))
    .addSeparator()
    .addItem('Alle Tabellen neu anlegen', 'createAllSheets')
    .addToUi();
}

function createAllSheets() {
  createDashboardSheet();
  createKontoSheet();
  createBargeldSheet();
  createAusgabenSheet();
  createUebergabeSheet();
  createQuittungenSheet();
  createImportRulesSheet();
  updateDashboard();
  SpreadsheetApp.getUi().alert('✅ Alle Tabellen wurden erfolgreich angelegt!\n\nSie können jetzt mit der Buchhaltung beginnen oder Kontoauszüge importieren.');
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
  
  // Einnahmen-Bereich
  sheet.getRange('A5').setValue('💰 EINNAHMEN');
  sheet.getRange('A5:E5').merge().setBackground('#e8f5e9').setFontWeight('bold').setFontSize(14);
  
  var einnahmenHeaders = ['Kategorie', 'Anzahl', 'Summe (€)', 'Letzter Eintrag', 'Status'];
  sheet.getRange('A6:E6').setValues([einnahmenHeaders])
    .setFontWeight('bold')
    .setBackground('#c8e6c9')
    .setHorizontalAlignment('center');
  
  // Zeilen für Einnahmen
  var einnahmenRows = [
    ['Zahlungseingänge Konto', '=COUNTA(FILTER(\'Zahlungseingänge Konto\'!A:A, YEAR(\'Zahlungseingänge Konto\'!A:A)=B3, \'Zahlungseingänge Konto\'!A:A<>""))-1', '=SUMIF(YEAR(\'Zahlungseingänge Konto\'!A:A), B3, \'Zahlungseingänge Konto\'!B:B)', '=TEXT(MAX(FILTER(\'Zahlungseingänge Konto\'!A:A, YEAR(\'Zahlungseingänge Konto\'!A:A)=B3, \'Zahlungseingänge Konto\'!A:A<>"")), "DD.MM.YYYY")', '✅'],
    ['Bargeldspenden', '=COUNTA(FILTER(Bargeldspenden!A:A, YEAR(Bargeldspenden!A:A)=B3, Bargeldspenden!A:A<>""))-1', '=SUMIF(YEAR(Bargeldspenden!A:A), B3, Bargeldspenden!B:B)', '=TEXT(MAX(FILTER(Bargeldspenden!A:A, YEAR(Bargeldspenden!A:A)=B3, Bargeldspenden!A:A<>"")), "DD.MM.YYYY")', '✅'],
    ['Gesamt Einnahmen', '=SUM(B7:B8)', '=SUM(C7:C8)', '', '']
  ];
  sheet.getRange('A7:E9').setValues(einnahmenRows);
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
    ['Ausgaben', '=COUNTA(FILTER(Ausgaben!A:A, YEAR(Ausgaben!A:A)=B3, Ausgaben!A:A<>""))-1', '=SUMIF(YEAR(Ausgaben!A:A), B3, Ausgaben!B:B)', '=TEXT(MAX(FILTER(Ausgaben!A:A, YEAR(Ausgaben!A:A)=B3, Ausgaben!A:A<>"")), "DD.MM.YYYY")', '✅'],
    ['Übergebene Spenden', '=COUNTIF(\'Übergebene Spenden\'!A:A, B3)', '=SUMIF(\'Übergebene Spenden\'!A:A, B3, \'Übergebene Spenden\'!B:B)', '=TEXT(MAX(FILTER(\'Übergebene Spenden\'!D:D, \'Übergebene Spenden\'!A:A=B3)), "DD.MM.YYYY")', '✅'],
    ['Gesamt Ausgaben', '=SUM(B13:B14)', '=SUM(C13:C14)', '', '']
  ];
  sheet.getRange('A13:E15').setValues(ausgabenRows);
  sheet.getRange('A15:E15').setBackground('#ef9a9a').setFontWeight('bold');
  
  // Saldo-Bereich
  sheet.getRange('A17').setValue('💵 SALDO');
  sheet.getRange('A17:E17').merge().setBackground('#e3f2fd').setFontWeight('bold').setFontSize(14);
  
  sheet.getRange('A18').setValue('Einnahmen - Ausgaben');
  sheet.getRange('C18').setValue('=C9-C15');
  sheet.getRange('A18:C18').setBackground('#bbdefb').setFontWeight('bold').setFontSize(12);
  
  // Quittungen-Bereich
  sheet.getRange('A20').setValue('📄 SPENDENQUITTUNGEN');
  sheet.getRange('A20:E20').merge().setBackground('#fff3e0').setFontWeight('bold').setFontSize(14);
  
  var quittungHeaders = ['Kategorie', 'Ausgestellt', 'Offen', 'Letzte Nr.', 'Status'];
  sheet.getRange('A21:E21').setValues([quittungHeaders])
    .setFontWeight('bold')
    .setBackground('#ffe0b2')
    .setHorizontalAlignment('center');
  
  var quittungRows = [
    ['Konto-Quittungen', '=COUNTIF(\'Zahlungseingänge Konto\'!H:H, "Ja")', '=COUNTIF(\'Zahlungseingänge Konto\'!H:H, "Nein")', '=MAX(\'Zahlungseingänge Konto\'!I:I)', '✅'],
    ['Bargeld-Quittungen', '=COUNTIF(Bargeldspenden!E:E, "Ja")', '=COUNTIF(Bargeldspenden!E:E, "Nein")', '=MAX(Bargeldspenden!F:F)', '✅'],
    ['Gesamt', '=SUM(B22:B23)', '=SUM(C22:C23)', '', '']
  ];
  sheet.getRange('A22:E24').setValues(quittungRows);
  sheet.getRange('A24:E24').setBackground('#ffcc80').setFontWeight('bold');
  
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

function createKontoSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Zahlungseingänge Konto');
  if (!sheet) {
    sheet = ss.insertSheet('Zahlungseingänge Konto');
  } else {
    sheet.clear();
  }
  var headers = [
    'Datum',
    'Betrag (€)',
    'Absender/Spender',
    'IBAN/Kontonummer',
    'Verwendungszweck',
    'Kategorie',
    'Mitgliedsnummer',
    'Quittung ausgestellt',
    'Quittungsnummer',
    'Bemerkung'
  ];
  sheet.appendRow(headers);
  var headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#e8f5e9');
  headerRange.setFontSize(12);
  headerRange.setHorizontalAlignment('center');
  var widths = [110, 100, 180, 180, 200, 150, 120, 140, 140, 200];
  for (var i = 0; i < widths.length; i++) {
    sheet.setColumnWidth(i + 1, widths[i]);
  }
  
  // Dropdown für Kategorie
  var kategorieRange = sheet.getRange('F2:F1000');
  var kategorieRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Spende', 'Mitgliedsbeitrag', 'Förderung', 'Sonstiges'], true)
    .build();
  kategorieRange.setDataValidation(kategorieRule);
  
  // Dropdown für Quittung
  var quittungRange = sheet.getRange('H2:H1000');
  var quittungRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Ja', 'Nein'], true)
    .build();
  quittungRange.setDataValidation(quittungRule);
  
  // Standardwert "Nein" für Quittung
  sheet.getRange('H2').setValue('Nein');
  
  sheet.setFrozenRows(1);
  SpreadsheetApp.getUi().alert('✅ Tabellenblatt "Zahlungseingänge Konto" wurde angelegt.');
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
    'Bemerkung'
  ];
  sheet.appendRow(headers);
  var headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#b2dfdb');
  headerRange.setFontSize(12);
  headerRange.setHorizontalAlignment('center');
  var widths = [140, 120, 100, 200, 100, 150, 150, 100, 200];
  for (var i = 0; i < widths.length; i++) {
    sheet.setColumnWidth(i + 1, widths[i]);
  }
  sheet.setFrozenRows(1);
  SpreadsheetApp.getUi().alert('✅ Tabellenblatt "Spendenquittungen" wurde angelegt.');
}

// =============================================================================
// SPENDENQUITTUNGEN
// =============================================================================

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
  var datum = data[0];
  var betrag = data[1];
  var spenderName = data[2];
  var year = new Date(datum).getFullYear();
  
  var receiptNumber = generateReceiptNumber(year);
  
  // Eintrag in Quittungen-Tabelle
  quittungenSheet.appendRow([
    receiptNumber,
    new Date(),
    year,
    spenderName,
    betrag,
    sheetName,
    rowIndex,
    'Ausgestellt',
    ''
  ]);
  
  // Aktualisiere Quelltabelle
  if (sheetName === 'Zahlungseingänge Konto') {
    sourceSheet.getRange(rowIndex, 8).setValue('Ja'); // Spalte H
    sourceSheet.getRange(rowIndex, 9).setValue(receiptNumber); // Spalte I
  } else if (sheetName === 'Bargeldspenden') {
    sourceSheet.getRange(rowIndex, 5).setValue('Ja'); // Spalte E
    sourceSheet.getRange(rowIndex, 6).setValue(receiptNumber); // Spalte F
  }
  
  return receiptNumber;
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
        var receiptNumber = issueReceipt(rowIndex, sheetName);
        ui.alert('✅ Quittung erfolgreich ausgestellt!\n\nQuittungsnummer: ' + receiptNumber);
      } catch(error) {
        ui.alert('❌ Fehler: ' + error.message);
      }
    } else {
      ui.alert('❌ Ungültiges Format. Bitte verwenden Sie: Tabellenname,Zeile');
    }
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
  
  var einnahmenKonto = sumByYear(kontoSheet, year, 1, 2); // Spalte A=Datum, B=Betrag
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
  
  // Quittungen
  var quittungenKonto = countReceiptsIssued(kontoSheet, year, 1, 8);
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
  sheet.getRange(hinweisStartRow, 1, hinweise.length, 6).merge(false, true);
  
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
function categorizeTransaction(row) {
  var rules = getImportRules();
  var verwendungszweck = row.verwendungszweck.toLowerCase();
  var absender = row.absender.toLowerCase();
  
  // Prüfe bekannte Spender
  var knownDonor = findKnownDonor(row.absender, row.iban);
  
  // Standardwerte
  var result = {
    datum: row.datum,
    betrag: row.betrag,
    absender: row.absender,
    iban: row.iban,
    verwendungszweck: row.verwendungszweck,
    kategorie: 'Spende', // Standard
    quittung: 'Nein',
    quittungNummer: '',
    bemerkung: '',
    confidence: 0 // 0-100, wie sicher ist die Zuordnung
  };
  
  // Wenn bekannter Spender: Übernehme dessen Kategorie
  if (knownDonor) {
    result.kategorie = knownDonor.kategorie;
    result.bemerkung = 'Bekannter Spender';
    result.confidence = 90;
    
    // Bei Spenden über 50€ Quittung vorschlagen
    if (result.kategorie === 'Spende' && row.betrag >= 50) {
      result.quittung = 'Nein'; // Noch nicht ausgestellt, aber vorgeschlagen
    }
    
    return result;
  }
  
  // Wende Regeln an (nach Priorität sortiert)
  for (var i = 0; i < rules.length; i++) {
    var rule = rules[i];
    var pattern = rule.pattern.toLowerCase();
    
    if (verwendungszweck.indexOf(pattern) !== -1 || absender.indexOf(pattern) !== -1) {
      result.kategorie = rule.kategorie;
      result.bemerkung = rule.bemerkung;
      result.confidence = rule.prioritaet;
      
      // Quittung vorschlagen?
      if (rule.quittungVorschlagen === 'Ja' && row.betrag >= 50) {
        result.quittung = 'Nein'; // Noch nicht ausgestellt
      }
      
      break; // Erste passende Regel gewinnt
    }
  }
  
  // Wenn keine Regel passt: Niedriges Vertrauen
  if (result.confidence === 0) {
    result.confidence = 30;
    result.bemerkung = 'Automatisch zugeordnet';
  }
  
  return result;
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
 * Sucht bekannten Spender
 */
function findKnownDonor(name, iban) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Zahlungseingänge Konto');
  
  if (!sheet) return null;
  
  var values = sheet.getDataRange().getValues();
  
  // Durchsuche Historie (überspringe Header)
  for (var i = 1; i < values.length; i++) {
    var row = values[i];
    var histName = row[2]; // Spalte C: Absender
    var histIBAN = row[3]; // Spalte D: IBAN
    var histKategorie = row[5]; // Spalte F: Kategorie
    
    // Match bei IBAN (stärkster Match) oder Name (ähnlich)
    if (iban && histIBAN === iban) {
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
 */
function importToKontoSheet(rows) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Zahlungseingänge Konto');
  
  if (!sheet) {
    createKontoSheet();
    sheet = ss.getSheetByName('Zahlungseingänge Konto');
  }
  
  // Bereite Daten vor
  var dataToInsert = rows.map(function(row) {
    return [
      row.datum,
      row.betrag,
      row.absender,
      row.iban,
      row.verwendungszweck,
      row.kategorie,
      '', // Mitgliedsnummer
      row.quittung,
      row.quittungNummer,
      row.bemerkung
    ];
  });
  
  // Füge am Ende ein
  var lastRow = sheet.getLastRow();
  sheet.getRange(lastRow + 1, 1, dataToInsert.length, 10).setValues(dataToInsert);
  
  // Formatiere Datum
  sheet.getRange(lastRow + 1, 1, dataToInsert.length, 1).setNumberFormat('dd.mm.yyyy');
  
  // Formatiere Betrag
  sheet.getRange(lastRow + 1, 2, dataToInsert.length, 1).setNumberFormat('#,##0.00 €');
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
  for (var i = 1; i < values.length; i++) {
    var row = values[i];
    var name = row[2];
    var kategorie = row[5];
    
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
