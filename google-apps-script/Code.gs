// Google Apps Script: Spendenverwaltung API

function doGet(e) {
  if (e.parameter.action === 'getDonations') {
    return ContentService.createTextOutput(JSON.stringify(getDonations()))
      .setMimeType(ContentService.MimeType.JSON);
  }
  if (e.parameter.action === 'getUebergabeSummen') {
    return ContentService.createTextOutput(JSON.stringify(getUebergabeSummen()))
      .setMimeType(ContentService.MimeType.JSON);
  }
  return ContentService.createTextOutput('Unknown action');
}

function doPost(e) {
  var data = JSON.parse(e.postData.contents);
  if (data.action === 'addDonation') {
    addDonation(data.donation);
    return ContentService.createTextOutput('OK');
  }
  return ContentService.createTextOutput('Unknown action');
}

function getDonations() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Spenden');
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
  sheet.appendRow([
    donation.id,
    donation.year,
    donation.amount,
    donation.name,
    donation.email,
    donation.date,
    donation.receiptIssued,
    donation.receiptNumber || '',
    donation.note || ''
  ]);
}

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Spendenverwaltung')
    .addItem('Spenden-Tabelle anlegen', 'createSpendenSheet')
    .addItem('Zahlungseingänge Konto anlegen', 'createKontoSheet')
    .addItem('Bargeldspenden anlegen', 'createBargeldSheet')
    .addItem('Ausgaben anlegen', 'createAusgabenSheet')
    .addItem('Übergebene Spenden anlegen', 'createUebergabeSheet')
    .addToUi();
}

function createSpendenSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Spenden');
  if (!sheet) {
    sheet = ss.insertSheet('Spenden');
  } else {
    sheet.clear();
  }
  // Deutsche Spaltenüberschriften
  var headers = [
    'ID',
    'Jahr',
    'Betrag (€)',
    'Name',
    'E-Mail',
    'Datum',
    'Quittung ausgestellt',
    'Quittungsnummer',
    'Bemerkung'
  ];
  sheet.appendRow(headers);

  // Design: Kopfzeile fett, Hintergrundfarbe, zentriert
  var headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#e3f2fd'); // hellblau
  headerRange.setFontSize(12);
  headerRange.setHorizontalAlignment('center');

  // Spaltenbreiten setzen
  var widths = [60, 60, 100, 180, 200, 110, 140, 120, 200];
  for (var i = 0; i < widths.length; i++) {
    sheet.setColumnWidth(i + 1, widths[i]);
  }

  // Freeze der Kopfzeile
  sheet.setFrozenRows(1);

  SpreadsheetApp.getUi().alert('Spenden-Tabelle wurde auf Deutsch angelegt und gestaltet.');
}

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
    'Kategorie (Spende/Mitgliedsbeitrag/Förderung)',
    'Mitgliedsnummer',
    'Quittung ausgestellt',
    'Quittungsnummer',
    'Bemerkung'
  ];
  sheet.appendRow(headers);
  var headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#e8f5e9'); // hellgrün
  headerRange.setFontSize(12);
  headerRange.setHorizontalAlignment('center');
  var widths = [110, 100, 180, 180, 200, 180, 120, 140, 120, 200];
  for (var i = 0; i < widths.length; i++) {
    sheet.setColumnWidth(i + 1, widths[i]);
  }
  sheet.setFrozenRows(1);
  SpreadsheetApp.getUi().alert('Tabellenblatt "Zahlungseingänge Konto" wurde angelegt oder zurückgesetzt.');
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
  headerRange.setBackground('#fffde7'); // hellgelb
  headerRange.setFontSize(12);
  headerRange.setHorizontalAlignment('center');
  var widths = [110, 100, 200, 180, 140, 120, 200];
  for (var i = 0; i < widths.length; i++) {
    sheet.setColumnWidth(i + 1, widths[i]);
  }
  sheet.setFrozenRows(1);
  SpreadsheetApp.getUi().alert('Tabellenblatt "Bargeldspenden" wurde angelegt oder zurückgesetzt.');
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
  headerRange.setBackground('#fce4ec'); // hellrosa
  headerRange.setFontSize(12);
  headerRange.setHorizontalAlignment('center');
  var widths = [110, 100, 180, 200, 140, 120, 200];
  for (var i = 0; i < widths.length; i++) {
    sheet.setColumnWidth(i + 1, widths[i]);
  }
  sheet.setFrozenRows(1);
  SpreadsheetApp.getUi().alert('Tabellenblatt "Ausgaben" wurde angelegt oder zurückgesetzt.');
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
  headerRange.setBackground('#e1bee7'); // helllila
  headerRange.setFontSize(12);
  headerRange.setHorizontalAlignment('center');
  var widths = [60, 100, 220, 120, 180, 140, 180, 200];
  for (var i = 0; i < widths.length; i++) {
    sheet.setColumnWidth(i + 1, widths[i]);
  }
  sheet.setFrozenRows(1);
  SpreadsheetApp.getUi().alert('Tabellenblatt "Übergebene Spenden" wurde angelegt oder zurückgesetzt.');
}

function getUebergabeSummen() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Übergebene Spenden');
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
  // Optional: Gesamtsumme berechnen
  var gesamt = Object.values(summen).reduce(function(a, b) { return a + b; }, 0);
  return { summen, gesamt };
} 