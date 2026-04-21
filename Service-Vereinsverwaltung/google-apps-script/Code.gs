// Google Apps Script: Spendenverwaltung API - Erweiterte Version
// Hoffnungsradler Dülmen e.V.
// Version 2.3 - Vollständige Buchhaltung

// =============================================================================
// KONSTANTEN
// =============================================================================

// Sheet-Namen
var SHEET_DASHBOARD = 'Dashboard';
var SHEET_MITGLIEDER = 'Mitglieder';
var SHEET_KONTO = 'Kontobewegungen';
var SHEET_BARGELD = 'Bar- und Sachspenden';
var SHEET_AUSGABEN = 'Barausgaben';
var SHEET_UEBERGABE = 'Übergebene Spenden';
var SHEET_QUITTUNGEN = 'Spendenquittungen';
var SHEET_QUITTUNGSPROTOKOLL = 'Quittungsprotokoll';
var SHEET_IMPORT_REGELN = 'Import-Regeln';
var SHEET_MITGLIEDER_INFO = 'Mitglieder_Info_aktuell';
var SHEET_SPENDERADRESSEN = 'Spenderadressen';

// Vereinsdaten für Spendenbescheinigungen
var VEREIN_NAME = 'Hoffnungsradler Dülmen e.V.';
var VEREIN_STRASSE = 'Königsberger Str.';
var VEREIN_HAUSNUMMER = '26';
var VEREIN_PLZ = '48249';
var VEREIN_ORT = 'Dülmen';
var VEREIN_EMAIL = 'hoffnungsradlerinfo@gmail.com';
var VEREIN_STEUERNUMMER = '312/5838/1207';
var VEREIN_FINANZAMT = 'Finanzamt Coesfeld';
var VEREIN_VEREINSREGISTER = 'Amtsgericht Coesfeld, VR 7924';
var VEREIN_FESTSTELLUNGSBESCHEID_DATUM = '12.06.2025'; // Feststellungsbescheid nach § 60a Abs. 1 AO
var VEREIN_SATZUNG_FASSUNG_VOM = '30.01.2025';
var VEREIN_FESTSTELLUNGSBESCHEID_GUELTIG_BIS = '12.06.2028'; // 3 Jahre taggenau ab Bescheid-Datum
var VEREIN_SATZUNGSZWECK = 'Förderung des öffentlichen Gesundheitswesens und der öffentlichen Gesundheitspflege';
var VEREIN_SATZUNGSPARAGRAPHEN = '§ 52 Abs. 2 Satz 1 Nr. 3 AO';

// Unterzeichner für Spendenbescheinigungen
var UNTERZEICHNER_NAME = 'Martin Stolz';
var UNTERZEICHNER_FUNKTION = '1. Vorsitzender';
var UNTERZEICHNER_UNTERSCHRIFT_DRIVE_ID = '1bv2OuuTh0NcCrwCxR7gTzRH5O1W2PKkt'; // Unterschrift aus Google Drive (privat & sicher)

// Vereinslogo aus Google Drive (privat & sicher)
var VEREIN_LOGO_DRIVE_ID = '1TicglZ0oYXaxXvLQDAwyU9Rz1WK7NLap'; // Hoffnungsradler Logo
var VEREIN_LOGO_URL = 'https://hoffnungsradler-duelmen.de/logos/aa82fed0-d01b-4922-b10c-c9a4b9dedb38.png'; // Fallback für Website

// Spaltenindizes für "Kontobewegungen" (0-basiert)
var KONTO_COL_AUFTRAGSKONTO = 0;      // Spalte A
var KONTO_COL_BUCHUNGSTAG = 1;        // Spalte B
var KONTO_COL_VALUTADATUM = 2;        // Spalte C
var KONTO_COL_BUCHUNGSTEXT = 3;       // Spalte D
var KONTO_COL_VERWENDUNGSZWECK = 4;   // Spalte E
var KONTO_COL_BEGUENSTIGTER = 5;      // Spalte F
var KONTO_COL_KONTONUMMER = 6;        // Spalte G
var KONTO_COL_BIC = 7;                // Spalte H
var KONTO_COL_BETRAG = 8;             // Spalte I
var KONTO_COL_WAEHRUNG = 9;           // Spalte J
var KONTO_COL_INFO = 10;              // Spalte K
var KONTO_COL_KATEGORIE = 11;         // Spalte L
var KONTO_COL_QUITTUNG = 12;          // Spalte M
var KONTO_COL_QUITTUNGSNUMMER = 13;   // Spalte N
var KONTO_COL_MITGLIEDSNUMMER = 14;   // Spalte O
var KONTO_COL_BEMERKUNG = 15;         // Spalte P

// Spaltenindizes für "Mitglieder" (0-basiert)
var MITGLIEDER_COL_NR = 0;            // Spalte A: Nr.
var MITGLIEDER_COL_NAME = 1;          // Spalte B: Vorname, Name
var MITGLIEDER_COL_ANSCHRIFT = 2;     // Spalte C: Anschrift
var MITGLIEDER_COL_EMAIL = 3;         // Spalte D: Email
var MITGLIEDER_COL_TELEFON = 4;       // Spalte E: Telefon
var MITGLIEDER_COL_EINTRITTSDATUM = 5;// Spalte F: Eintrittsdatum
var MITGLIEDER_COL_STATUS = 6;        // Spalte G: Beitragsstatus
var MITGLIEDER_COL_NOTIZEN = 7;       // Spalte H: Notizen
var MITGLIEDER_COL_DSGVO = 8;         // Spalte I: DSGVO-Einwilligung
var MITGLIEDER_COL_ZAHLUNGSART = 9;   // Spalte J: Zahlungsart
var MITGLIEDER_COL_IBAN = 10;         // Spalte K: IBAN

// =============================================================================
// API ENDPOINTS (doGet & doPost)
// =============================================================================

function doGet(e) {
  try {
    // Validiere Eingabeparameter
    if (!e || !e.parameter) {
      return createJsonResponse({ error: 'Ungültige Anfrage: Parameter fehlen' }, 400);
    }
    
  var action = e.parameter.action;
  
    // Validiere, dass action vorhanden ist
    if (!action || typeof action !== 'string') {
      return createJsonResponse({ error: 'Ungültige Anfrage: Parameter "action" fehlt oder ist ungültig' }, 400);
    }
    
    // Öffentliche API-Endpunkte (nur aggregierte, nicht-personenbezogene Daten)
    switch(action) {
      case 'getUebergabeSummen':
        return createJsonResponse(getUebergabeSummen());
        
      case 'getDashboard':
        return createJsonResponse(getDashboardData());
        
      case 'getJahresabschluss':
        // Validiere Jahr-Parameter
        var yearParam = e.parameter.year;
        var year;
        if (yearParam) {
          year = parseInt(yearParam);
          if (isNaN(year) || year < 2000 || year > new Date().getFullYear() + 1) {
            return createJsonResponse({ 
              error: 'Ungültiges Jahr: ' + yearParam + '. Bitte geben Sie ein Jahr zwischen 2000 und ' + (new Date().getFullYear() + 1) + ' ein.' 
            }, 400);
          }
        } else {
          year = new Date().getFullYear();
        }
        return createJsonResponse(getJahresabschluss(year));
        
      case 'getAllYearlyData':
        return createJsonResponse(getAllYearlyDonationData());
      
      // Sensible Endpunkte blockiert (Datenschutz)
      case 'getDonations':
        return createJsonResponse({ 
          error: 'Dieser Endpunkt ist aus Datenschutzgründen nicht öffentlich verfügbar.' 
        }, 403);
      
      default:
        return createJsonResponse({ 
          error: 'Unbekannte Aktion: ' + action + '. Verfügbare Aktionen: getUebergabeSummen, getDashboard, getJahresabschluss, getAllYearlyData' 
        }, 400);
    }
  } catch(error) {
    Logger.log('Fehler in doGet(): ' + error.toString());
    return createJsonResponse({ 
      error: 'Interner Serverfehler: ' + error.toString() 
    }, 500);
  }
}

function doPost(e) {
  try {
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
      .addItem('Spenderadressen anlegen', 'createSpenderadressenSheet')
      .addItem('Kontobewegungen anlegen', 'createKontoSheet')
      .addItem('Bar- und Sachspenden anlegen', 'createBargeldSheet')
      .addItem('Barausgaben anlegen', 'createAusgabenSheet')
      .addItem('Übergebene Spenden anlegen', 'createUebergabeSheet')
      .addItem('Spendenquittungen anlegen', 'createQuittungenSheet')
      .addItem('Quittungsprotokoll anlegen', 'createQuittungsprotokollSheet')
      .addItem('Import-Regeln anlegen', 'createImportRulesSheet'))
    .addSeparator()
    .addSubMenu(ui.createMenu('Aktionen')
      .addItem('Dashboard aktualisieren', 'updateDashboard')
      .addItem('📥 Kontoauszug importieren (CSV)', 'showCSVImportDialog')
      .addItem('🔧 Datumsspalten korrigieren', 'fixDateColumns')
      .addItem('📊 Alle Tabellen sortieren (neueste zuerst)', 'sortAllSheetsByDate')
      .addItem('Jahresabschluss erstellen', 'showJahresabschlussDialog')
      .addItem('Mitglieder-Zuordnung aktualisieren', 'matchAllPaymentsToMembers'))
    .addSeparator()
    .addSubMenu(ui.createMenu('📄 Spendenquittungen')
      .addItem('✏️ Quittung ausstellen', 'showQuittungDialog')
      .addItem('📊 Sammelquittung erstellen', 'showSammelquittungDialog')
      .addSeparator()
      .addItem('❌ Quittung stornieren', 'showStornierungDialog')
      .addItem('📧 Quittung per E-Mail versenden', 'sendReceiptEmailManual'))
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
  createSpenderadressenSheet();
  createKontoSheet();
  createBargeldSheet();
  createAusgabenSheet();
  createUebergabeSheet();
  createQuittungenSheet();
  createQuittungsprotokollSheet();
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
  // NEUE LOGIK: Nur positive Beträge aus Kontobewegungen sind Einnahmen
  // Spalte I (9) = Betrag, nur positive Werte (>0) zählen
  // "Intern" wird NICHT gezählt, um Doppelzählung zu vermeiden (Bargeldeinzahlungen auf das Konto)
  // WICHTIG: Nur BARGELD-Spenden zählen zu Einnahmen, Sachspenden werden separat ausgewiesen
  // Custom Functions (z.B. EINNAHMEN_KONTO_JAHR) ermöglichen robuste Berechnungen über dynamische Bereiche
  // WICHTIG: Deutsche Formel-Syntax mit Semikolon statt Komma!
  // HINWEIS: WENNFEHLER weggelassen, da es bei leeren Tabellen automatisch 0 zurückgibt
  var einnahmenRows = [
    ['Einnahmen (Konto)', '=ANZAHL_EINNAHMEN_KONTO_JAHR(B3)', '=EINNAHMEN_KONTO_JAHR(B3)', '=LETZTES_DATUM_KONTO()', '✅'],
    ['Bargeldspenden', '=ANZAHL_BARGELDSPENDEN_JAHR(B3)', '=BARGELDSPENDEN_JAHR(B3)', '=LETZTES_DATUM_BARGELD()', '✅'],
    ['Gesamt Einnahmen (Geld)', '=B7+B8', '=C7+C8', '', '']
  ];
  sheet.getRange('A7:E9').setValues(einnahmenRows);
  sheet.getRange('A7:E8').setBackground('#ffffff'); // Weißer Hintergrund für Datenzeilen
  sheet.getRange('A9:E9').setBackground('#a5d6a7').setFontWeight('bold');
  // Formatierung für "Letzter Eintrag" (Spalte D) als Datum
  sheet.getRange('D7:D8').setNumberFormat('dd.mm.yyyy');
  
  // Sachspenden-Info (separat, nicht in Gesamteinnahmen)
  sheet.getRange('A10').setValue('ℹ️ SACHSPENDEN-NACHWEIS');
  sheet.getRange('A10:E10').merge().setBackground('#fff9c4').setFontWeight('bold').setFontSize(12);
  
  var sachspendenRow = [
    ['Sachspenden (direkt verwendet)', '=ANZAHL_SACHSPENDEN_JAHR(B3)', '=SACHSPENDEN_JAHR(B3)', '=LETZTES_DATUM_BARGELD()', 'ℹ️']
  ];
  sheet.getRange('A11:E11').setValues(sachspendenRow);
  sheet.getRange('A11:E11').setBackground('#fffde7').setFontStyle('italic');
  sheet.getRange('D11').setNumberFormat('dd.mm.yyyy');
  sheet.getRange('A11').setNote('Sachspenden werden direkt für satzungsgemäße Zwecke verwendet und fließen nicht in die Geldbilanz ein.');
  
  // Ausgaben-Bereich
  sheet.getRange('A13').setValue('💳 AUSGABEN');
  sheet.getRange('A13:E13').merge().setBackground('#ffebee').setFontWeight('bold').setFontSize(14);
  
  var ausgabenHeaders = ['Kategorie', 'Anzahl', 'Summe (€)', 'Letzter Eintrag', 'Status'];
  sheet.getRange('A14:E14').setValues([ausgabenHeaders])
    .setFontWeight('bold')
    .setBackground('#ffcdd2')
    .setHorizontalAlignment('center');
  
  var ausgabenRows = [
    ['Ausgaben (Konto)', '=ANZAHL_AUSGABEN_KONTO_JAHR(B3)', '=AUSGABEN_KONTO_JAHR(B3)', '=LETZTES_DATUM_KONTO()', '✅'],
    ['Barausgaben', '=ANZAHL_BARAUSGABEN_JAHR(B3)', '=BARAUSGABEN_JAHR(B3)', '=LETZTES_DATUM_BARAUSGABEN()', '✅'],
    ['Übergebene Spenden', '=ANZAHL_UEBERGABE_JAHR(B3)', '=UEBERGABE_JAHR(B3)', '=LETZTES_DATUM_UEBERGABE()', '✅'],
    ['Gesamt Ausgaben (Geld)', '=B15+B16+B17', '=C15+C16+C17', '', '']
  ];
  sheet.getRange('A15:E18').setValues(ausgabenRows);
  sheet.getRange('A15:E17').setBackground('#ffffff'); // Weißer Hintergrund für Datenzeilen
  sheet.getRange('A18:E18').setBackground('#ef9a9a').setFontWeight('bold');
  // Formatierung für "Letzter Eintrag" (Spalte D) als Datum
  sheet.getRange('D15:D17').setNumberFormat('dd.mm.yyyy');
  
  // Saldo-Bereich
  sheet.getRange('A20').setValue('💵 SALDO (GELDMITTEL)');
  sheet.getRange('A20:E20').merge().setBackground('#e3f2fd').setFontWeight('bold').setFontSize(14);
  
  sheet.getRange('A21').setValue('Anfangsbestand');
  sheet.getRange('C21').setValue('=E3');
  sheet.getRange('A21:C21').setBackground('#e3f2fd').setFontSize(11);
  
  sheet.getRange('A22').setValue('Einnahmen - Ausgaben');
  sheet.getRange('C22').setValue('=C9-C18');
  sheet.getRange('A22:C22').setBackground('#e3f2fd').setFontSize(11);
  
  sheet.getRange('A23').setValue('Endbestand (Geldmittel)');
  sheet.getRange('C23').setValue('=C21+C22');
  sheet.getRange('A23:C23').setBackground('#90caf9').setFontWeight('bold').setFontSize(12);
  
  // Quittungen-Bereich
  sheet.getRange('A25').setValue('📄 SPENDENQUITTUNGEN');
  sheet.getRange('A25:E25').merge().setBackground('#fff3e0').setFontWeight('bold').setFontSize(14);
  
  var quittungHeaders = ['Kategorie', 'Ausgestellt', 'Offen', 'Letzte Nr.', 'Status'];
  sheet.getRange('A26:E26').setValues([quittungHeaders])
    .setFontWeight('bold')
    .setBackground('#ffe0b2')
    .setHorizontalAlignment('center');
  
  // ACHTUNG: Neue Spaltenstruktur - Quittung ist jetzt Spalte M (13), Quittungsnummer ist Spalte N (14)
  // Dynamische Bereiche (z.B. M2:M) beziehen sich automatisch auf alle Daten ohne feste Zeilenanzahl
  var quittungRows = [
    ['Konto-Quittungen', '=ZÄHLENWENN(Kontobewegungen!M2:M;"Ja")', '=ZÄHLENWENNS(Kontobewegungen!M2:M;"<>Ja";Kontobewegungen!M2:M;"<>")', '=MAX(Kontobewegungen!N2:N)', '✅'],
    ['Bar-/Sachspenden-Quittungen', '=ZÄHLENWENN(' + "'Bar- und Sachspenden'!F2:F" + ';"Ja")', '=ZÄHLENWENNS(' + "'Bar- und Sachspenden'!F2:F" + ';"<>Ja";' + "'Bar- und Sachspenden'!F2:F" + ';"<>")', '=MAX(' + "'Bar- und Sachspenden'!G2:G" + ')', '✅'],
    ['Gesamt', '=B27+B28', '=C27+C28', '', '']
  ];
  sheet.getRange('A27:E29').setValues(quittungRows);
  sheet.getRange('A29:E29').setBackground('#ffcc80').setFontWeight('bold');
  
  // Spaltenbreiten
  sheet.setColumnWidth(1, 220);
  sheet.setColumnWidth(2, 100);
  sheet.setColumnWidth(3, 120);
  sheet.setColumnWidth(4, 120);
  sheet.setColumnWidth(5, 80);
  
  // Zahlenformatierung
  sheet.getRange('C7:C23').setNumberFormat('#,##0.00 €');
  
  // Freeze
  sheet.setFrozenRows(1);

  SpreadsheetApp.getUi().alert(
    '✅ Dashboard wurde erfolgreich angelegt!\n\n' +
    '📋 WICHTIGE HINWEISE:\n\n' +
    '💰 EINNAHMEN: Nur Geldmittel (Konto + Bargeld)\n' +
    'ℹ️ SACHSPENDEN: Werden separat ausgewiesen, fließen NICHT in Geldbilanz ein\n' +
    '💳 AUSGABEN: Nur Geldausgaben (Konto + Bar + Übergebene Spenden)\n' +
    '💵 SALDO: Zeigt nur tatsächlich verfügbare Geldmittel\n\n' +
    '⚖️ Dies entspricht den Empfehlungen für gemeinnützige Vereine (§ 63 AO):\n' +
    'Sachspenden werden für satzungsgemäße Zwecke direkt verwendet.'
  );
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
  try {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) {
      throw new Error('Spreadsheet konnte nicht geöffnet werden.');
    }
  
    var dashboardSheet = ss.getSheetByName(SHEET_DASHBOARD);
  if (!dashboardSheet) {
      throw new Error('Dashboard-Sheet existiert nicht. Bitte zuerst anlegen über: 📊 Buchhaltung → Alle Tabellen neu anlegen');
  }
  
    // Versuche Jahr zu lesen, falls leer: aktuelles Jahr verwenden
  var currentYear = dashboardSheet.getRange('B3').getValue();
    if (!currentYear || currentYear === '') {
      currentYear = new Date().getFullYear();
    }
  
    // Lese Werte mit Fehlerbehandlung
    try {
  return {
    year: currentYear,
    einnahmen: {
      konto: {
            anzahl: dashboardSheet.getRange('B7').getValue() || 0,
            summe: dashboardSheet.getRange('C7').getValue() || 0,
            letzter: dashboardSheet.getRange('D7').getValue() || '-'
      },
      bargeld: {
            anzahl: dashboardSheet.getRange('B8').getValue() || 0,
            summe: dashboardSheet.getRange('C8').getValue() || 0,
            letzter: dashboardSheet.getRange('D8').getValue() || '-'
          },
          gesamt: dashboardSheet.getRange('C9').getValue() || 0
        },
        sachspenden: {
          anzahl: dashboardSheet.getRange('B11').getValue() || 0,
          summe: dashboardSheet.getRange('C11').getValue() || 0,
          letzter: dashboardSheet.getRange('D11').getValue() || '-'
    },
    ausgaben: {
      allgemein: {
            anzahl: dashboardSheet.getRange('B15').getValue() || 0,
            summe: dashboardSheet.getRange('C15').getValue() || 0,
            letzter: dashboardSheet.getRange('D15').getValue() || '-'
          },
      barausgaben: {
        anzahl: dashboardSheet.getRange('B16').getValue() || 0,
        summe: dashboardSheet.getRange('C16').getValue() || 0,
        letzter: dashboardSheet.getRange('D16').getValue() || '-'
      },
      uebergeben: {
        anzahl: dashboardSheet.getRange('B17').getValue() || 0,
        summe: dashboardSheet.getRange('C17').getValue() || 0,
        letzter: dashboardSheet.getRange('D17').getValue() || '-'
      },
      gesamt: dashboardSheet.getRange('C18').getValue() || 0
        },
        saldo: dashboardSheet.getRange('C23').getValue() || 0,
    quittungen: {
      konto: {
            ausgestellt: dashboardSheet.getRange('B27').getValue() || 0,
            offen: dashboardSheet.getRange('C27').getValue() || 0
      },
      bargeld: {
            ausgestellt: dashboardSheet.getRange('B28').getValue() || 0,
            offen: dashboardSheet.getRange('C28').getValue() || 0
          }
        }
      };
    } catch (readError) {
      Logger.log('Fehler beim Lesen der Dashboard-Daten: ' + readError.toString());
      throw new Error('Fehler beim Lesen der Dashboard-Daten. Bitte prüfen Sie, ob das Dashboard korrekt angelegt wurde.');
    }
  } catch (error) {
    Logger.log('Fehler in getDashboardData(): ' + error.toString());
    throw error;
  }
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

/**
 * Erstellt Tabelle für Spenderadressen (Nicht-Mitglieder)
 * Für rechtskonforme Spendenbescheinigungen benötigt
 */
function createSpenderadressenSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Spenderadressen');
  if (!sheet) {
    sheet = ss.insertSheet('Spenderadressen');
  } else {
    sheet.clear();
  }
  
  // Spaltenüberschriften
  var headers = [
    'Nr.',
    'Anrede',
    'Vorname',
    'Nachname',
    'Straße',
    'Hausnummer',
    'PLZ',
    'Ort',
    'Email',
    'Telefon',
    'IBAN',
    'Zugehörige Kontonamen',  // NEU: Für Familien/Mehrfachspender (komma-getrennt)
    'Notizen',
    'Erstellt am'
  ];
  
  sheet.appendRow(headers);
  var headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#fff3e0'); // Orange
  headerRange.setFontSize(12);
  headerRange.setHorizontalAlignment('center');
  
  // Spaltenbreiten
  var widths = [
    60,   // Nr.
    80,   // Anrede
    150,  // Vorname
    150,  // Nachname
    200,  // Straße
    80,   // Hausnummer
    80,   // PLZ
    150,  // Ort
    200,  // Email
    120,  // Telefon
    200,  // IBAN
    250,  // Zugehörige Kontonamen (z.B. "Hans Müller, Maria Müller")
    250,  // Notizen
    120   // Erstellt am
  ];
  for (var i = 0; i < widths.length; i++) {
    sheet.setColumnWidth(i + 1, widths[i]);
  }
  
  // Formatierung
  // Datum
  sheet.getRange('M2:M1000').setNumberFormat('dd.mm.yyyy');
  
  // Dropdown für Anrede
  var anredeRange = sheet.getRange('B2:B1000');
  var anredeRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Herr', 'Frau', 'Ehepaar', 'Familie', 'Firma', ''], true)
    .build();
  anredeRange.setDataValidation(anredeRule);
  
  // Beispielzeile (zur Orientierung)
  sheet.getRange('A2').setValue(1);
  sheet.getRange('B2').setValue('Herr');
  sheet.getRange('C2').setValue('Max');
  sheet.getRange('D2').setValue('Mustermann');
  sheet.getRange('E2').setValue('Musterstraße');
  sheet.getRange('F2').setValue('123');
  sheet.getRange('G2').setValue('48249');
  sheet.getRange('H2').setValue('Dülmen');
  sheet.getRange('I2').setValue('max.mustermann@beispiel.de');
  sheet.getRange('J2').setValue('+49 123 456789');
  sheet.getRange('K2').setValue('DE89370400440532013000');
  sheet.getRange('M2').setValue(new Date());
  sheet.getRange('A2:M2').setFontStyle('italic').setBackground('#fffde7');
  
  sheet.setFrozenRows(1);
  
  SpreadsheetApp.getUi().alert(
    '✅ Tabellenblatt "Spenderadressen" wurde angelegt!\n\n' +
    '💡 VERWENDUNG: Tragen Sie hier alle Spender ein, die KEINE Mitglieder sind.\n\n' +
    '📄 WICHTIG: Diese vollständigen Adressdaten werden für rechtskonforme\n' +
    'Spendenbescheinigungen benötigt (§ 10b EStG).\n\n' +
    '✅ Für Mitglieder werden automatisch die Daten aus der "Mitglieder"-Tabelle verwendet.'
  );
}

/**
 * Erstellt oder aktualisiert die "Quittungsprotokoll" Tabelle
 */
function createQuittungsprotokollSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_QUITTUNGSPROTOKOLL);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_QUITTUNGSPROTOKOLL);
  } else {
    sheet.clear();
  }
  
  // Spaltenüberschriften
  var headers = [
    'Quittungs-Nr.',
    'Ausstellungsdatum',
    'Spendendatum',
    'Spender',
    'Betrag (€)',
    'Status',
    'PDF-Link',
    'Bemerkung',
    'Erstellt am',
    'Storniert am',
    'Ersetzt durch',
    'Quelle (Tabelle)',
    'Quelle (Zeile)'
  ];
  
  sheet.appendRow(headers);
  var headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#e1f5fe'); // Hellblau
  headerRange.setFontSize(12);
  headerRange.setHorizontalAlignment('center');
  
  // Spaltenbreiten
  var widths = [
    120,  // Quittungs-Nr.
    120,  // Ausstellungsdatum
    120,  // Spendendatum
    200,  // Spender
    100,  // Betrag
    100,  // Status
    400,  // PDF-Link
    300,  // Bemerkung
    140,  // Erstellt am
    140,  // Storniert am
    120,  // Ersetzt durch
    150,  // Quelle (Tabelle)
    80    // Quelle (Zeile)
  ];
  for (var i = 0; i < widths.length; i++) {
    sheet.setColumnWidth(i + 1, widths[i]);
  }
  
  // Formatierung
  // Datumsfelder
  sheet.getRange('B2:B1000').setNumberFormat('dd.mm.yyyy');
  sheet.getRange('C2:C1000').setNumberFormat('dd.mm.yyyy');
  sheet.getRange('I2:I1000').setNumberFormat('dd.mm.yyyy hh:mm:ss');
  sheet.getRange('J2:J1000').setNumberFormat('dd.mm.yyyy hh:mm:ss');
  
  // Betrag
  sheet.getRange('E2:E1000').setNumberFormat('#,##0.00 €');
  
  // Dropdown für Status
  var statusRange = sheet.getRange('F2:F1000');
  var statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Gültig', 'Storniert', 'Korrigiert'], true)
    .build();
  statusRange.setDataValidation(statusRule);
  
  // Bedingte Formatierung für Status
  // Stornierte Quittungen = rot
  var storniertRule = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('Storniert')
    .setBackground('#ffcdd2')
    .setRanges([sheet.getRange('A2:M1000')])
    .build();
  
  // Gültige Quittungen = grün
  var gueltigRule = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('Gültig')
    .setBackground('#c8e6c9')
    .setRanges([sheet.getRange('A2:M1000')])
    .build();
  
  var rules = sheet.getConditionalFormatRules();
  rules.push(storniertRule);
  rules.push(gueltigRule);
  sheet.setConditionalFormatRules(rules);
  
  sheet.setFrozenRows(1);
  
  SpreadsheetApp.getUi().alert(
    '✅ Tabelle "Quittungsprotokoll" erstellt!\n\n' +
    'Diese Tabelle dokumentiert automatisch alle ausgestellten Spendenquittungen:\n\n' +
    '• Gültige Quittungen = grün markiert\n' +
    '• Stornierte Quittungen = rot markiert\n' +
    '• Lückenlose Nummerierung für Steuerprüfung\n' +
    '• Vollständiger Prüfpfad bei Korrekturen\n\n' +
    'Das Protokoll wird automatisch bei jeder Quittungserstellung aktualisiert.'
  );
}

function createKontoSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_KONTO);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_KONTO);
  } else {
    sheet.clear();
  }
  
  // CSV-Format: Sparkassen Export-Struktur
  // Zuerst die CSV-Spalten (können direkt per Copy-Paste importiert werden)
  // WICHTIG: Diese Tabelle enthält ALLE Kontobewegungen (Einnahmen UND Ausgaben)
  // Positive Beträge = Einnahmen, Negative Beträge = Ausgaben
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
    .requireValueInList(['Spende', 'Mitgliedsbeitrag', 'Förderung', 'Intern', 'Spendenübergabe', 'Sonstiges'], true)
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
    '✅ Tabellenblatt "Kontobewegungen" wurde angelegt!\n\n' +
    '💡 TIPP: Sie können jetzt CSV-Daten direkt per Copy & Paste einfügen.\n' +
    'Die ersten 12 Spalten entsprechen dem Sparkassen-Export-Format.\n\n' +
    '📋 WICHTIG: Diese Tabelle enthält ALLE Kontobewegungen:\n' +
    '   • Positive Beträge = Einnahmen\n' +
    '   • Negative Beträge = Ausgaben\n\n' +
    '⚠️ KATEGORIEN für Doppelzählungs-Vermeidung:\n' +
    '   • "Intern": Bargeldeinzahlungen auf das Konto\n' +
    '   • "Spendenübergabe": Überweisungen an Hilfsorganisationen\n' +
    '     (werden separat in "Übergebene Spenden" erfasst)'
  );
}

function createBargeldSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_BARGELD);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_BARGELD);
  } else {
    sheet.clear();
  }
  var headers = [
    'Datum',
    'Betrag (€)',
    'Art',
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
  var widths = [110, 100, 120, 200, 180, 140, 140, 200];
  for (var i = 0; i < widths.length; i++) {
    sheet.setColumnWidth(i + 1, widths[i]);
  }
  
  // Dropdown für Art (Spalte C)
  var artRange = sheet.getRange('C2:C1000');
  var artRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Bargeld', 'Sachspende'], true)
    .build();
  artRange.setDataValidation(artRule);
  
  // Dropdown für Quittung (Spalte F - verschoben durch neue Spalte)
  var quittungRange = sheet.getRange('F2:F1000');
  var quittungRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Ja', 'Nein'], true)
    .build();
  quittungRange.setDataValidation(quittungRule);
  
  sheet.setFrozenRows(1);
  SpreadsheetApp.getUi().alert(
    '✅ Tabellenblatt "Bar- und Sachspenden" wurde angelegt!\n\n' +
    '💡 TIPP: In der Spalte "Art" wählen Sie "Bargeld" oder "Sachspende".\n' +
    '   Bei Sachspenden tragen Sie den geschätzten Wert in € ein.'
  );
}

function createAusgabenSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_AUSGABEN);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_AUSGABEN);
  } else {
    sheet.clear();
  }
  
  // WICHTIG: Diese Tabelle ist nur für Barausgaben
  // Alle Kontoausgaben werden automatisch aus "Kontobewegungen" erfasst
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
  SpreadsheetApp.getUi().alert(
    '✅ Tabellenblatt "Barausgaben" wurde angelegt!\n\n' +
    '💡 HINWEIS: Diese Tabelle ist nur für Barausgaben.\n' +
    'Alle Kontoausgaben werden automatisch aus "Kontobewegungen" erfasst.'
  );
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
/**
 * Generiert Spendenbescheinigung als PDF (NEUE VERSION - Template-basiert)
 * Basierend auf dem Rotary Club Beispiel, angepasst für Hoffnungsradler Dülmen e.V.
 */
function generateReceiptPDF(receiptNumber, spenderName, betrag, spendenDatum, quittungsDatum, istSachspende) {
  Logger.log('=== NEUE PDF-Generierung gestartet ===');
  Logger.log('Quittungsnummer: ' + receiptNumber);
  Logger.log('Spender: ' + spenderName);
  Logger.log('Betrag: ' + betrag);
  Logger.log('Sachspende: ' + (istSachspende ? 'JA' : 'NEIN'));
  
  // WICHTIG: Prüfe Gültigkeit des Feststellungsbescheids
  var gueltigBis = new Date(VEREIN_FESTSTELLUNGSBESCHEID_GUELTIG_BIS.split('.').reverse().join('-'));
  var heute = new Date();
  var tageVerbleibend = Math.ceil((gueltigBis - heute) / (1000 * 60 * 60 * 24));
  
  if (heute > gueltigBis) {
    throw new Error('⚠️ ACHTUNG: Der Feststellungsbescheid ist abgelaufen!\n\nGültig bis: ' + VEREIN_FESTSTELLUNGSBESCHEID_GUELTIG_BIS + '\n\nBitte beantragen Sie einen neuen Feststellungsbescheid beim Finanzamt, bevor Sie weitere Spendenbescheinigungen ausstellen.');
  }
  
  if (tageVerbleibend < 90) {
    Logger.log('⚠️ WARNUNG: Feststellungsbescheid läuft in ' + tageVerbleibend + ' Tagen ab! Bitte rechtzeitig neuen Bescheid beantragen.');
  }
  
  // Spenderadresse abrufen
  var spenderAdresse = getSpenderAdresse(spenderName);
  if (!spenderAdresse) {
    throw new Error('Keine Adresse gefunden für Spender: ' + spenderName + '\n\nBitte tragen Sie den Spender in die "Mitglieder" oder "Spenderadressen" Tabelle ein.');
  }
  
  Logger.log('Adresse gefunden (Quelle: ' + spenderAdresse.quelle + ')');
  
  // Formatierungen
  var formattedBetrag = parseFloat(betrag).toFixed(2).replace('.', ',') + ' €';
  var betragInWort = betragInWorten(betrag);
  var formattedSpendenDatum = Utilities.formatDate(new Date(spendenDatum), Session.getScriptTimeZone(), 'dd.MM.yyyy');
  var formattedQuittungsDatum = Utilities.formatDate(new Date(quittungsDatum), Session.getScriptTimeZone(), 'dd.MM.yyyy');
  
  // Erstelle temporäres Google Docs-Dokument
  var tempDoc = DocumentApp.create('Temp_Receipt_' + receiptNumber);
  var body = tempDoc.getBody();
  body.clear(); // Lösche alle Inhalte
  
  // Setze Dokumenten-Formatierung
  body.setMarginTop(50);
  body.setMarginBottom(50);
  body.setMarginLeft(70);
  body.setMarginRight(70);
  
  // === HEADER MIT LOGO RECHTS UND AUSSTELLER LINKS (nebeneinander) ===
  var headerTable = body.appendTable();
  var headerRow = headerTable.appendTableRow();
  
  // Linke Spalte: Aussteller-Informationen + Titel + Bescheinigungsnummer
  var leftCell = headerRow.appendTableCell();
  leftCell.appendParagraph('Aussteller (Bezeichnung und Anschrift der steuerbegünstigten Einrichtung):')
    .setFontSize(8).setBold(false).setSpacingBefore(0).setSpacingAfter(3);
  leftCell.appendParagraph(VEREIN_NAME)
    .setFontSize(11).setBold(true).setSpacingAfter(2);
  leftCell.appendParagraph(VEREIN_STRASSE + ' ' + VEREIN_HAUSNUMMER + ', ' + VEREIN_PLZ + ' ' + VEREIN_ORT)
    .setFontSize(10).setBold(true).setSpacingAfter(8);
  
  // Trennlinie in der Zelle
  leftCell.appendParagraph('─────────────────────────────────────')
    .setFontSize(8).setSpacingAfter(8);
  
  // Titel in der linken Zelle (dynamisch je nach Art der Spende)
  var titel = istSachspende ? 'Bestätigung über Sachzuwendungen' : 'Bestätigung über Geldzuwendungen/Spende';
  leftCell.appendParagraph(titel)
    .setFontSize(12).setBold(true).setSpacingAfter(3);
  
  // Bescheinigungsnummer in der linken Zelle
  leftCell.appendParagraph('(Bescheinigung Nr. ' + receiptNumber + ')')
    .setFontSize(9).setSpacingAfter(0);
  
  leftCell.setWidth(350);
  leftCell.setPaddingTop(0).setPaddingBottom(5);
  
  // Rechte Spalte: Logo
  var rightCell = headerRow.appendTableCell();
  rightCell.setVerticalAlignment(DocumentApp.VerticalAlignment.CENTER);
  rightCell.setWidth(120);
  rightCell.setPaddingTop(0).setPaddingBottom(5);
  
  try {
    if (VEREIN_LOGO_DRIVE_ID && VEREIN_LOGO_DRIVE_ID.length > 0) {
      var logoFile = DriveApp.getFileById(VEREIN_LOGO_DRIVE_ID);
      var logoBlob = logoFile.getBlob();
      var logoPara = rightCell.appendParagraph('');
      var logoImg = logoPara.appendInlineImage(logoBlob);
      
      // WICHTIG: Seitenverhältnis beibehalten, keine Verzerrung!
      // Zuerst Originalgröße auslesen (vom eingefügten Image-Objekt)
      var originalWidth = logoImg.getWidth();
      var originalHeight = logoImg.getHeight();
      var aspectRatio = originalHeight / originalWidth;
      
      // Auf Zielbreite skalieren (100px) mit korrektem Seitenverhältnis
      var targetWidth = 100;
      var targetHeight = targetWidth * aspectRatio;
      
      logoImg.setWidth(targetWidth);
      logoImg.setHeight(targetHeight);
      logoPara.setAlignment(DocumentApp.HorizontalAlignment.RIGHT);
      Logger.log('✅ Logo geladen: ' + originalWidth + 'x' + originalHeight + ' → ' + targetWidth + 'x' + Math.round(targetHeight) + ' (Verhältnis beibehalten)');
    } else {
      rightCell.appendParagraph('').setFontSize(1); // Leere Zelle bei fehlender ID
      Logger.log('⚠️ Keine Logo-ID konfiguriert');
    }
  } catch (e) {
    rightCell.appendParagraph('').setFontSize(1); // Leere Zelle bei Fehler
    Logger.log('⚠️ Logo konnte nicht geladen werden: ' + e.toString());
  }
  
  // Tabelle ohne Rahmen (unsichtbar)
  headerTable.setBorderWidth(0);
  headerTable.setAttributes({
    [DocumentApp.Attribute.SPACING_AFTER]: 15
  });
  
  // === RECHTLICHE GRUNDLAGE (wie amtliches Muster) ===
  body.appendParagraph('im Sinne des § 10b des Einkommensteuergesetzes an eine der in § 5 Abs. 1 Nr. 9 des Körperschaftsteuergesetzes bezeichneten Körperschaften, Personenvereinigungen oder Vermögensmassen')
    .setFontSize(8).setLineSpacing(1.15).setSpacingAfter(12);
  
  // === NAME UND ANSCHRIFT DES ZUWENDENDEN (gemäß amtlichem Muster) ===
  body.appendParagraph('Name und Anschrift des Zuwendenden:')
    .setFontSize(8).setBold(false).setSpacingAfter(3);
  
  var spenderAdresseText = (spenderAdresse.anrede ? spenderAdresse.anrede + ' ' : '') + 
                           spenderAdresse.vollstaendigerName + ', ' + 
                           spenderAdresse.strasse + ' ' + spenderAdresse.hausnummer + ', ' + 
                           spenderAdresse.plz + ' ' + spenderAdresse.ort;
  
  body.appendParagraph(spenderAdresseText)
    .setFontSize(10).setBold(true).setSpacingAfter(12);
  
  // === BETRAG UND DATUM (gemäß amtlichem Muster) ===
  body.appendParagraph('Betrag der Zuwendung:')
    .setFontSize(8).setBold(false).setSpacingAfter(3);
  
  body.appendParagraph('- in Ziffern: ' + formattedBetrag)
    .setFontSize(10).setBold(true).setSpacingAfter(2);
  
  body.appendParagraph('- in Buchstaben: ' + betragInWort)
    .setFontSize(10).setSpacingAfter(8);
  
  body.appendParagraph('Tag der Zuwendung: ' + formattedSpendenDatum)
    .setFontSize(10).setSpacingAfter(12);
  
  // === VERZICHT AUF ERSTATTUNG (gemäß amtlichem Muster) ===
  body.appendParagraph('Es handelt sich um den Verzicht auf Erstattung von Aufwendungen:    ☐ Ja    ☒ Nein')
    .setFontSize(9).setSpacingAfter(15);
  
  // === GEMEINNÜTZIGKEIT (gemäß amtlichem Muster) ===
  body.appendParagraph('Wir sind wegen Förderung (Angabe des begünstigten Zwecks / der begünstigten Zwecke):')
    .setFontSize(8).setBold(false).setSpacingAfter(3);
  
  body.appendParagraph(VEREIN_SATZUNGSZWECK)
    .setFontSize(9).setItalic(true).setSpacingAfter(10);
  
  body.appendParagraph('nach dem letzten uns zugegangenen Bescheid nach § 60a Abs. 1 AO über die gesonderte Feststellung der Einhaltung der satzungsmäßigen Voraussetzungen nach den §§ 51, 59, 60 und 61 AO vom ' + VEREIN_FESTSTELLUNGSBESCHEID_DATUM + ' (Steuernummer ' + VEREIN_STEUERNUMMER + ') für die Satzung in der Fassung vom ' + VEREIN_SATZUNG_FASSUNG_VOM + ' als steuerbegünstigt anerkannt.')
    .setFontSize(8).setLineSpacing(1.15).setSpacingAfter(10);
  
  body.appendParagraph('Es wird bestätigt, dass die Zuwendung nur zur Förderung ' + VEREIN_SATZUNGSPARAGRAPHEN + ' verwendet wird.')
    .setFontSize(8).setSpacingAfter(15);
  
  // === TRENNLINIE ===
  body.appendParagraph('─────────────────────────────────────────────────────────────')
    .setFontSize(8).setAlignment(DocumentApp.HorizontalAlignment.CENTER).setSpacingAfter(15);
  
  // === ORT, DATUM, UNTERSCHRIFT (gemäß amtlichem Muster) ===
  body.appendParagraph(VEREIN_ORT + ', den ' + formattedQuittungsDatum)
    .setFontSize(9).setSpacingBefore(10).setSpacingAfter(15);
  
  // Unterschrift als Bild einfügen (falls vorhanden)
  // SICHERHEIT: Die Unterschrift wird aus Google Drive geladen (PRIVAT, keine öffentliche Freigabe nötig!)
  try {
    if (UNTERZEICHNER_UNTERSCHRIFT_DRIVE_ID && UNTERZEICHNER_UNTERSCHRIFT_DRIVE_ID.length > 0) {
      var unterschriftFile = DriveApp.getFileById(UNTERZEICHNER_UNTERSCHRIFT_DRIVE_ID);
      var unterschriftBlob = unterschriftFile.getBlob();
      var unterschriftPara = body.appendParagraph('');
      var unterschriftImg = unterschriftPara.appendInlineImage(unterschriftBlob);
      
      // WICHTIG: Seitenverhältnis beibehalten, keine Verzerrung!
      // Zuerst Originalgröße auslesen (vom eingefügten Image-Objekt)
      var originalWidth = unterschriftImg.getWidth();
      var originalHeight = unterschriftImg.getHeight();
      var aspectRatio = originalWidth / originalHeight;
      
      // Auf Zielhöhe skalieren (80px) mit korrektem Seitenverhältnis
      var targetHeight = 80;
      var targetWidth = targetHeight * aspectRatio;
      
      unterschriftImg.setWidth(targetWidth);
      unterschriftImg.setHeight(targetHeight);
      unterschriftPara.setSpacingAfter(5);
      Logger.log('✅ Unterschrift geladen: ' + originalWidth + 'x' + originalHeight + ' → ' + Math.round(targetWidth) + 'x' + targetHeight + ' (Verhältnis beibehalten)');
    } else {
      // Fallback: Trennlinie wenn keine Unterschrift-ID konfiguriert
      body.appendParagraph('_______________________________________')
        .setFontSize(9).setSpacingAfter(5);
      Logger.log('⚠️ Keine Unterschrift-ID konfiguriert - verwende Trennlinie');
    }
  } catch (e) {
    // Fallback: Trennlinie bei Fehler
    body.appendParagraph('_______________________________________')
      .setFontSize(9).setSpacingAfter(5);
    Logger.log('⚠️ Unterschrift konnte nicht geladen werden: ' + e.toString() + ' - verwende Trennlinie');
  }
  
  body.appendParagraph('Unterschrift des Zuwendungsempfängers')
    .setFontSize(7).setSpacingAfter(2);
  
  body.appendParagraph(UNTERZEICHNER_NAME + ', ' + UNTERZEICHNER_FUNKTION)
    .setFontSize(9).setSpacingAfter(20);
  
  // === HINWEISE (gemäß amtlichem Muster) ===
  body.appendParagraph('─────────────────────────────────────────────────────────────')
    .setFontSize(8).setAlignment(DocumentApp.HorizontalAlignment.CENTER).setSpacingAfter(6);
  
  body.appendParagraph('Hinweis:')
    .setFontSize(6).setBold(false).setSpacingAfter(2);
  
  body.appendParagraph('Wer vorsätzlich oder grob fahrlässig eine unrichtige Zuwendungsbestätigung erstellt oder wer veranlasst, dass Zuwendungen nicht zu den in der Zuwendungsbestätigung angegebenen steuerbegünstigten Zwecken verwendet werden, haftet für die entgangene Steuer (§ 10b Abs. 4 EStG, § 9 Abs. 3 KStG, § 9 Nr. 5 GewStG).')
    .setFontSize(5).setLineSpacing(1.1).setSpacingAfter(4);
  
  body.appendParagraph('Diese Bestätigung wird nicht als Nachweis für die steuerliche Berücksichtigung der Zuwendung anerkannt, wenn das Datum des Freistellungsbescheides länger als 5 Jahre bzw. das Datum der Feststellung der Einhaltung der satzungsmäßigen Voraussetzungen nach § 60a Abs. 1 AO (Datum: ' + VEREIN_FESTSTELLUNGSBESCHEID_DATUM + ') länger als 3 Jahre seit Ausstellung der Bestätigung zurückliegt (§ 63 Abs. 5 AO).')
    .setFontSize(5).setLineSpacing(1.1).setSpacingAfter(0);
  
  // Speichere PDF und gib File-Objekt zurück (verwendet gemeinsame Hilfsfunktion)
  return savePDFToDrive(tempDoc, 'Spendenquittung_' + receiptNumber + '.pdf');
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
function sendReceiptByEmail(receiptNumber, spenderName, betrag, spendenDatum, quittungsDatum, recipientEmail, pdfFile, istSachspende) {
  try {
    // Verwende vorhandenes PDF oder erstelle neues
    var pdfBlob;
    if (pdfFile) {
      Logger.log('Verwende bereits erstelltes PDF: ' + pdfFile.getName());
      pdfBlob = pdfFile.getBlob();
    } else {
      Logger.log('Erstelle neues PDF für E-Mail-Versand');
      var newPdfFile = generateReceiptPDF(receiptNumber, spenderName, betrag, spendenDatum, quittungsDatum, istSachspende || false);
      pdfBlob = newPdfFile.getBlob();
    }
    
    // Generiere E-Mail-Text
    var emailTemplate = generateReceiptEmail(receiptNumber, spenderName, betrag, spendenDatum, quittungsDatum);
    
    var subject = 'Spendenquittung ' + receiptNumber + ' - Hoffnungsradler Dülmen e.V.';
    
    Logger.log('Sende E-Mail an: ' + recipientEmail);
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
    
    Logger.log('E-Mail erfolgreich versendet');
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
  
  // Validiere Zeilen-Index
  var lastRow = sourceSheet.getLastRow();
  if (rowIndex < 2 || rowIndex > lastRow) {
    throw new Error('Ungültige Zeilennummer: ' + rowIndex + '. Die Tabelle "' + sheetName + '" hat ' + lastRow + ' Zeilen (Zeile 1 ist die Kopfzeile).');
  }
  
  Logger.log('Lese Daten aus Zeile ' + rowIndex + ' von Tabelle "' + sheetName + '"');
  var dataRange = sourceSheet.getRange(rowIndex, 1, 1, sourceSheet.getLastColumn());
  var dataValues = dataRange.getValues();
  
  if (!dataValues || dataValues.length === 0 || !dataValues[0]) {
    throw new Error('Konnte keine Daten aus Zeile ' + rowIndex + ' lesen.');
  }
  
  var data = dataValues[0];
  Logger.log('Daten erfolgreich gelesen: ' + data.length + ' Spalten');
  
  // ACHTUNG: Neue Spaltenstruktur für "Kontobewegungen"
  var datum, betrag, spenderName, istSachspende;
  
  if (sheetName === SHEET_KONTO) {
    datum = data[1]; // Spalte B: Buchungstag
    betrag = data[8]; // Spalte I: Betrag
    spenderName = data[5]; // Spalte F: Begünstigter
    istSachspende = false; // Kontobewegungen sind immer Geldzuwendungen
    Logger.log('Kontobewegungen - Datum: ' + datum + ', Betrag: ' + betrag + ', Spender: ' + spenderName);
  } else if (sheetName === SHEET_BARGELD) {
    datum = data[0]; // Spalte A: Datum
    betrag = data[1]; // Spalte B: Betrag
    var art = data[2]; // Spalte C: Art (Bargeld/Sachspende)
    spenderName = data[3]; // Spalte D: Spender
    istSachspende = (art === 'Sachspende'); // Prüfe ob es sich um eine Sachspende handelt
    Logger.log('Bar-/Sachspenden - Datum: ' + datum + ', Betrag: ' + betrag + ', Art: ' + art + ', Spender: ' + spenderName + ', Sachspende: ' + istSachspende);
  } else {
    datum = data[0];
    betrag = data[1];
    spenderName = data[3]; // Angepasst an neue Struktur
    istSachspende = false; // Default: Geldzuwendung
    Logger.log('Andere Tabelle - Datum: ' + datum + ', Betrag: ' + betrag + ', Spender: ' + spenderName);
  }
  
  // Validiere extrahierte Daten
  if (!datum) {
    throw new Error('Kein Datum in der ausgewählten Zeile gefunden. Bitte stellen Sie sicher, dass die Zeile gültige Daten enthält.');
  }
  
  if (!betrag || betrag === 0) {
    throw new Error('Kein gültiger Betrag in der ausgewählten Zeile gefunden.');
  }
  
  if (!spenderName || spenderName.trim() === '') {
    throw new Error('Kein Spendername in der ausgewählten Zeile gefunden.');
  }
  
  var year = getBuchungstagJahr(datum);
  if (year === null) {
    year = new Date().getFullYear();
  }
  
  var receiptNumber = generateReceiptNumber(year);
  var quittungsDatum = new Date();
  
  // WICHTIG: PDF IMMER erstellen und speichern
  Logger.log('Erstelle PDF für Quittung: ' + receiptNumber);
  var pdfFile = generateReceiptPDF(receiptNumber, spenderName, betrag, datum, quittungsDatum, istSachspende);
  Logger.log('PDF erstellt: ' + pdfFile.getName() + ' (ID: ' + pdfFile.getId() + ')');
  
  // Versuche E-Mail-Adresse zu finden
  var spenderEmail = findSpenderEmail(spenderName);
  var emailVersendet = 'Nein';
  var versanddatum = '';
  
  // Wenn E-Mail gefunden, automatisch versenden (PDF als Anhang)
  if (spenderEmail) {
    Logger.log('E-Mail gefunden für ' + spenderName + ': ' + spenderEmail);
    var emailErfolg = sendReceiptByEmail(receiptNumber, spenderName, betrag, datum, quittungsDatum, spenderEmail, pdfFile, istSachspende);
    if (emailErfolg) {
      emailVersendet = 'Ja';
      versanddatum = Utilities.formatDate(quittungsDatum, Session.getScriptTimeZone(), 'dd.MM.yyyy HH:mm');
      Logger.log('E-Mail erfolgreich versendet');
    } else {
      Logger.log('E-Mail-Versand fehlgeschlagen');
    }
  } else {
    Logger.log('Keine E-Mail-Adresse gefunden für: ' + spenderName);
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
  if (sheetName === SHEET_KONTO) {
    // ACHTUNG: Neue Spaltenstruktur - Quittung ist Spalte M (13), Quittungsnummer ist Spalte N (14)
    sourceSheet.getRange(rowIndex, 13).setValue('Ja'); // Spalte M: Quittung ausgestellt
    sourceSheet.getRange(rowIndex, 14).setValue(receiptNumber); // Spalte N: Quittungsnummer
  } else if (sheetName === SHEET_BARGELD) {
    // Neue Struktur mit "Art"-Spalte: Quittung ist Spalte F (6), Quittungsnummer ist Spalte G (7)
    sourceSheet.getRange(rowIndex, 6).setValue('Ja'); // Spalte F: Quittung ausgestellt
    sourceSheet.getRange(rowIndex, 7).setValue(receiptNumber); // Spalte G: Quittungsnummer
  }
  
  // Protokolliere Quittung im Quittungsprotokoll
  logQuittungToProtokoll({
    quittungsNummer: receiptNumber,
    ausstellungsDatum: quittungsDatum,
    spendenDatum: datum,
    spender: spenderName,
    betrag: betrag,
    status: 'Gültig',
    pdfUrl: pdfFile.getUrl(),
    bemerkung: '',
    quelleTabelle: sheetName,
    quelleZeile: rowIndex
  });
  
  Logger.log('Quittung erfolgreich ausgestellt: ' + receiptNumber);
  
  return {
    receiptNumber: receiptNumber,
    pdfFileId: pdfFile.getId(),
    pdfFileName: pdfFile.getName(),
    pdfUrl: pdfFile.getUrl(),
    emailSent: emailVersendet === 'Ja',
    emailAddress: spenderEmail
  };
}

/**
 * Protokolliert eine ausgestellte Quittung im Quittungsprotokoll
 * 
 * @param {Object} quittung - Objekt mit Quittungsdaten
 * @param {string} quittung.quittungsNummer - Quittungsnummer (z.B. "2025-0001")
 * @param {Date} quittung.ausstellungsDatum - Ausstellungsdatum
 * @param {Date} quittung.spendenDatum - Spendendatum
 * @param {string} quittung.spender - Name des Spenders
 * @param {number} quittung.betrag - Spendenbetrag
 * @param {string} quittung.status - Status (Gültig, Storniert, Korrigiert)
 * @param {string} quittung.pdfUrl - URL zum PDF in Google Drive
 * @param {string} quittung.bemerkung - Optional: Bemerkung
 * @param {string} quittung.quelleTabelle - Quelltabelle (z.B. "Kontobewegungen")
 * @param {number} quittung.quelleZeile - Zeile in der Quelltabelle
 * @param {string} quittung.storniertAm - Optional: Stornierungszeitpunkt
 * @param {string} quittung.ersetztDurch - Optional: Quittungsnummer der Ersatzquittung
 */
function logQuittungToProtokoll(quittung) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var protokollSheet = ss.getSheetByName(SHEET_QUITTUNGSPROTOKOLL);
  
  // Erstelle Protokoll-Sheet falls nicht vorhanden
  if (!protokollSheet) {
    createQuittungsprotokollSheet();
    protokollSheet = ss.getSheetByName(SHEET_QUITTUNGSPROTOKOLL);
  }
  
  // Prüfe ob Eintrag bereits existiert (bei Updates)
  var data = protokollSheet.getDataRange().getValues();
  var existingRow = -1;
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === quittung.quittungsNummer) {
      existingRow = i + 1; // 1-basiert
      break;
    }
  }
  
  var jetzt = new Date();
  
  if (existingRow > 0) {
    // Update existierenden Eintrag (z.B. bei Stornierung)
    Logger.log('Aktualisiere Protokolleintrag für Quittung: ' + quittung.quittungsNummer);
    
    // Spalte F (6): Status
    if (quittung.status) {
      protokollSheet.getRange(existingRow, 6).setValue(quittung.status);
    }
    
    // Spalte H (8): Bemerkung
    if (quittung.bemerkung) {
      protokollSheet.getRange(existingRow, 8).setValue(quittung.bemerkung);
    }
    
    // Spalte J (10): Storniert am
    if (quittung.storniertAm) {
      protokollSheet.getRange(existingRow, 10).setValue(quittung.storniertAm);
    } else if (quittung.status === 'Storniert') {
      protokollSheet.getRange(existingRow, 10).setValue(jetzt);
    }
    
    // Spalte K (11): Ersetzt durch
    if (quittung.ersetztDurch) {
      protokollSheet.getRange(existingRow, 11).setValue(quittung.ersetztDurch);
    }
    
  } else {
    // Neuer Eintrag
    Logger.log('Erstelle Protokolleintrag für Quittung: ' + quittung.quittungsNummer);
    
    protokollSheet.appendRow([
      quittung.quittungsNummer,              // A: Quittungs-Nr.
      quittung.ausstellungsDatum,            // B: Ausstellungsdatum
      quittung.spendenDatum,                 // C: Spendendatum
      quittung.spender,                      // D: Spender
      quittung.betrag,                       // E: Betrag
      quittung.status || 'Gültig',           // F: Status
      quittung.pdfUrl || '',                 // G: PDF-Link
      quittung.bemerkung || '',              // H: Bemerkung
      jetzt,                                 // I: Erstellt am
      quittung.storniertAm || '',            // J: Storniert am
      quittung.ersetztDurch || '',           // K: Ersetzt durch
      quittung.quelleTabelle || '',          // L: Quelle (Tabelle)
      quittung.quelleZeile || ''             // M: Quelle (Zeile)
    ]);
  }
  
  Logger.log('Quittungsprotokoll aktualisiert');
}

/**
 * Erstellt ein storniertes PDF mit Wasserzeichen
 * Basiert auf dem Original-PDF, aber mit rotem "STORNIERT" Wasserzeichen
 */
function generateStorniertePDF(receiptNumber, spenderName, betrag, spendenDatum, quittungsDatum, stornierungsGrund, istSachspende) {
  Logger.log('=== Erstelle STORNIERTES PDF ===');
  Logger.log('Quittungsnummer: ' + receiptNumber);
  Logger.log('Sachspende: ' + (istSachspende ? 'JA' : 'NEIN'));
  
  // Spenderadresse abrufen
  var spenderAdresse = getSpenderAdresse(spenderName);
  if (!spenderAdresse) {
    throw new Error('Keine Adresse gefunden für Spender: ' + spenderName);
  }
  
  // Formatierungen
  var formattedBetrag = parseFloat(betrag).toFixed(2).replace('.', ',') + ' €';
  var betragInWort = betragInWorten(betrag);
  var formattedSpendenDatum = Utilities.formatDate(new Date(spendenDatum), Session.getScriptTimeZone(), 'dd.MM.yyyy');
  var formattedQuittungsDatum = Utilities.formatDate(new Date(quittungsDatum), Session.getScriptTimeZone(), 'dd.MM.yyyy');
  var stornierungsDatum = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd.MM.yyyy');
  
  // Erstelle temporäres Google Docs-Dokument
  var tempDoc = DocumentApp.create('Temp_Storniert_' + receiptNumber);
  var body = tempDoc.getBody();
  body.clear();
  
  // Setze Dokumenten-Formatierung
  body.setMarginTop(50);
  body.setMarginBottom(50);
  body.setMarginLeft(70);
  body.setMarginRight(70);
  
  // === HEADER MIT LOGO RECHTS (analog zur normalen Quittung) ===
  var headerTable = body.appendTable();
  var headerRow = headerTable.appendTableRow();
  
  // Linke Spalte: Aussteller-Informationen (ausgegraut)
  var leftCell = headerRow.appendTableCell();
  leftCell.appendParagraph('Aussteller (Bezeichnung und Anschrift der steuerbegünstigten Einrichtung):')
    .setFontSize(8).setBold(false).setForegroundColor('#9e9e9e').setSpacingBefore(0).setSpacingAfter(3);
  leftCell.appendParagraph(VEREIN_NAME)
    .setFontSize(11).setBold(true).setForegroundColor('#9e9e9e').setSpacingAfter(2);
  leftCell.appendParagraph(VEREIN_STRASSE + ' ' + VEREIN_HAUSNUMMER + ', ' + VEREIN_PLZ + ' ' + VEREIN_ORT)
    .setFontSize(10).setBold(true).setForegroundColor('#9e9e9e').setSpacingAfter(0);
  leftCell.setWidth(350);
  leftCell.setPaddingTop(0).setPaddingBottom(5);
  
  // Rechte Spalte: Logo
  var rightCell = headerRow.appendTableCell();
  rightCell.setVerticalAlignment(DocumentApp.VerticalAlignment.CENTER);
  rightCell.setWidth(120);
  rightCell.setPaddingTop(0).setPaddingBottom(5);
  
  try {
    if (VEREIN_LOGO_DRIVE_ID && VEREIN_LOGO_DRIVE_ID.length > 0) {
      var logoFile = DriveApp.getFileById(VEREIN_LOGO_DRIVE_ID);
      var logoBlob = logoFile.getBlob();
      var logoPara = rightCell.appendParagraph('');
      var logoImg = logoPara.appendInlineImage(logoBlob);
      
      // WICHTIG: Seitenverhältnis beibehalten, keine Verzerrung!
      var originalWidth = logoImg.getWidth();
      var originalHeight = logoImg.getHeight();
      var aspectRatio = originalHeight / originalWidth;
      var targetWidth = 100;
      var targetHeight = targetWidth * aspectRatio;
      
      logoImg.setWidth(targetWidth);
      logoImg.setHeight(targetHeight);
      logoPara.setAlignment(DocumentApp.HorizontalAlignment.RIGHT);
    } else {
      rightCell.appendParagraph('').setFontSize(1);
    }
  } catch (e) {
    rightCell.appendParagraph('').setFontSize(1);
    Logger.log('⚠️ Logo konnte nicht geladen werden');
  }
  
  // Tabelle ohne Rahmen (unsichtbar)
  headerTable.setBorderWidth(0);
  headerTable.setAttributes({
    [DocumentApp.Attribute.SPACING_AFTER]: 10
  });
  
  // === STORNIERUNGSVERMERK (GROSS UND ROT) ===
  var storniertPara = body.appendParagraph('═══════════════════════════════════════════');
  storniertPara.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  storniertPara.setFontSize(10).setForegroundColor('#d32f2f');
  
  var storniertTitel = body.appendParagraph('⚠️ STORNIERT ⚠️');
  storniertTitel.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  storniertTitel.setFontSize(24).setBold(true).setForegroundColor('#d32f2f');
  storniertTitel.setSpacingAfter(5);
  
  var storniertDatum = body.appendParagraph('Storniert am: ' + stornierungsDatum);
  storniertDatum.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  storniertDatum.setFontSize(10).setBold(true).setForegroundColor('#d32f2f');
  
  if (stornierungsGrund) {
    var grund = body.appendParagraph('Grund: ' + stornierungsGrund);
    grund.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
    grund.setFontSize(9).setForegroundColor('#d32f2f');
  }
  
  var storniertPara2 = body.appendParagraph('═══════════════════════════════════════════');
  storniertPara2.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  storniertPara2.setFontSize(10).setForegroundColor('#d32f2f').setSpacingAfter(20);
  
  // === ORIGINALE QUITTUNG (ausgegraut, Aussteller ist bereits oben in Tabelle) ===
  body.appendParagraph('─────────────────────────────────────────────────────────────')
    .setFontSize(8).setAlignment(DocumentApp.HorizontalAlignment.CENTER).setForegroundColor('#9e9e9e').setSpacingAfter(10);
  
  // Titel (dynamisch je nach Art der Spende, ausgegraut)
  var titelStorniert = istSachspende ? 'Bestätigung über Sachzuwendungen' : 'Bestätigung über Geldzuwendungen/Spende';
  body.appendParagraph(titelStorniert)
    .setFontSize(12).setBold(true).setAlignment(DocumentApp.HorizontalAlignment.CENTER).setForegroundColor('#9e9e9e').setSpacingAfter(3);
  
  body.appendParagraph('(Bescheinigung Nr. ' + receiptNumber + ')')
    .setFontSize(9).setAlignment(DocumentApp.HorizontalAlignment.CENTER).setForegroundColor('#9e9e9e').setSpacingAfter(10);
  
  body.appendParagraph('Name und Anschrift des Zuwendenden:')
    .setFontSize(8).setForegroundColor('#9e9e9e').setSpacingAfter(3);
  
  var spenderAdresseText = (spenderAdresse.anrede ? spenderAdresse.anrede + ' ' : '') + 
                           spenderAdresse.vollstaendigerName + ', ' + 
                           spenderAdresse.strasse + ' ' + spenderAdresse.hausnummer + ', ' + 
                           spenderAdresse.plz + ' ' + spenderAdresse.ort;
  
  body.appendParagraph(spenderAdresseText)
    .setFontSize(10).setBold(true).setForegroundColor('#9e9e9e').setSpacingAfter(12);
  
  body.appendParagraph('Betrag der Zuwendung:')
    .setFontSize(8).setForegroundColor('#9e9e9e').setSpacingAfter(3);
  
  body.appendParagraph('- in Ziffern: ' + formattedBetrag)
    .setFontSize(10).setBold(true).setForegroundColor('#9e9e9e').setSpacingAfter(2);
  
  body.appendParagraph('- in Buchstaben: ' + betragInWort)
    .setFontSize(10).setForegroundColor('#9e9e9e').setSpacingAfter(8);
  
  body.appendParagraph('Tag der Zuwendung: ' + formattedSpendenDatum)
    .setFontSize(10).setForegroundColor('#9e9e9e').setSpacingAfter(12);
  
  body.appendParagraph('Diese Bescheinigung ist UNGÜLTIG und darf nicht für steuerliche Zwecke verwendet werden.')
    .setFontSize(9).setBold(true).setAlignment(DocumentApp.HorizontalAlignment.CENTER).setForegroundColor('#d32f2f').setSpacingAfter(0);
  
  // Speichere PDF und gib File-Objekt zurück (verwendet gemeinsame Hilfsfunktion)
  return savePDFToDrive(tempDoc, 'Spendenquittung_' + receiptNumber + '_STORNIERT.pdf');
}

/**
 * Storniert eine ausgestellte Quittung
 * 
 * @param {string} quittungsNummer - Quittungsnummer (z.B. "2025-0001")
 * @param {string} stornierungsGrund - Grund für die Stornierung
 * @param {boolean} neueQuittungErstellen - Optional: Soll eine neue Quittung erstellt werden?
 * @return {Object} Ergebnisobjekt mit Status und Details
 */
function stornierQuittung(quittungsNummer, stornierungsGrund, neueQuittungErstellen) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var protokollSheet = ss.getSheetByName(SHEET_QUITTUNGSPROTOKOLL);
  var quittungenSheet = ss.getSheetByName('Spendenquittungen');
  
  if (!protokollSheet) {
    throw new Error('Quittungsprotokoll nicht gefunden. Bitte erstellen Sie zuerst die Tabelle.');
  }
  
  // Suche Quittung im Protokoll
  var data = protokollSheet.getDataRange().getValues();
  var quittungRow = -1;
  var quittungData = null;
  
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === quittungsNummer) {
      quittungRow = i + 1; // 1-basiert
      quittungData = data[i];
      break;
    }
  }
  
  if (quittungRow === -1) {
    throw new Error('Quittung "' + quittungsNummer + '" nicht im Protokoll gefunden.');
  }
  
  // Prüfe ob bereits storniert
  if (quittungData[5] === 'Storniert') {
    throw new Error('Quittung "' + quittungsNummer + '" ist bereits storniert.');
  }
  
  Logger.log('Storniere Quittung: ' + quittungsNummer);
  Logger.log('Grund: ' + stornierungsGrund);
  
  // Extrahiere Daten für storniertes PDF
  var spender = quittungData[3];
  var betrag = quittungData[4];
  var spendenDatum = quittungData[2];
  var quittungsDatum = quittungData[1];
  var quelleTabelle = quittungData[11];
  var quelleZeile = quittungData[12];
  
  // Ermittle ob es eine Sachspende war (aus Quelltabelle)
  var istSachspende = false;
  if (quelleTabelle === SHEET_BARGELD && quelleZeile) {
    var sourceSheet = ss.getSheetByName(quelleTabelle);
    if (sourceSheet && quelleZeile > 1 && quelleZeile <= sourceSheet.getLastRow()) {
      var artValue = sourceSheet.getRange(quelleZeile, 3).getValue(); // Spalte C: Art
      istSachspende = (artValue === 'Sachspende');
      Logger.log('Quelle: ' + quelleTabelle + ', Zeile: ' + quelleZeile + ', Art: ' + artValue + ', Sachspende: ' + istSachspende);
    }
  }
  
  // Erstelle storniertes PDF
  var storniertePDF = generateStorniertePDF(
    quittungsNummer,
    spender,
    betrag,
    spendenDatum,
    quittungsDatum,
    stornierungsGrund,
    istSachspende
  );
  
  // Aktualisiere Protokoll
  logQuittungToProtokoll({
    quittungsNummer: quittungsNummer,
    status: 'Storniert',
    bemerkung: stornierungsGrund,
    storniertAm: new Date()
  });
  
  // Aktualisiere Quittungen-Tabelle
  if (quittungenSheet) {
    var quittData = quittungenSheet.getDataRange().getValues();
    for (var i = 1; i < quittData.length; i++) {
      if (quittData[i][0] === quittungsNummer) {
        quittungenSheet.getRange(i + 1, 8).setValue('Storniert: ' + stornierungsGrund); // Spalte H: Status
        break;
      }
    }
  }
  
  // Aktualisiere Quelltabelle (markiere Quittung als ungültig)
  var quelleTabelle = quittungData[11];
  var quelleZeile = quittungData[12];
  
  if (quelleTabelle && quelleZeile) {
    var sourceSheet = ss.getSheetByName(quelleTabelle);
    if (sourceSheet) {
      if (quelleTabelle === SHEET_KONTO) {
        // Spalte M: Quittung ausgestellt = "Storniert"
        sourceSheet.getRange(quelleZeile, 13).setValue('Storniert');
      } else if (quelleTabelle === SHEET_BARGELD) {
        // Spalte F: Quittung ausgestellt = "Storniert"
        sourceSheet.getRange(quelleZeile, 6).setValue('Storniert');
      }
    }
  }
  
  Logger.log('✅ Quittung erfolgreich storniert');
  
  return {
    success: true,
    quittungsNummer: quittungsNummer,
    storniertePDFUrl: storniertePDF.getUrl(),
    storniertePDFName: storniertePDF.getName()
  };
}

/**
 * UI-Dialog für Quittungsstornierung
 */
function showStornierungDialog() {
  var ui = SpreadsheetApp.getUi();
  
  // Schritt 1: Quittungsnummer eingeben
  var response1 = ui.prompt(
    'Quittung stornieren - Schritt 1/2',
    'Bitte geben Sie die Quittungsnummer ein, die storniert werden soll:\n\nBeispiel: 2025-0001',
    ui.ButtonSet.OK_CANCEL
  );
  
  if (response1.getSelectedButton() !== ui.Button.OK) {
    return;
  }
  
  var quittungsNummer = response1.getResponseText().trim();
  
  if (!quittungsNummer) {
    ui.alert('❌ Fehler', 'Bitte geben Sie eine gültige Quittungsnummer ein.', ui.ButtonSet.OK);
    return;
  }
  
  // Schritt 2: Stornierungsgrund eingeben
  var response2 = ui.prompt(
    'Quittung stornieren - Schritt 2/2',
    'Bitte geben Sie den Grund für die Stornierung ein:\n\n' +
    'Beispiele:\n' +
    '- Falsche Adresse\n' +
    '- Betrag korrigiert\n' +
    '- Spender-Wunsch\n\n' +
    'Grund:',
    ui.ButtonSet.OK_CANCEL
  );
  
  if (response2.getSelectedButton() !== ui.Button.OK) {
    return;
  }
  
  var grund = response2.getResponseText().trim();
  
  if (!grund) {
    ui.alert('❌ Fehler', 'Bitte geben Sie einen Stornierungsgrund ein.', ui.ButtonSet.OK);
    return;
  }
  
  // Bestätigung
  var confirm = ui.alert(
    '⚠️ Stornierung bestätigen',
    'Möchten Sie die Quittung "' + quittungsNummer + '" wirklich stornieren?\n\n' +
    'Grund: ' + grund + '\n\n' +
    'WICHTIG:\n' +
    '• Die Quittung wird als UNGÜLTIG markiert\n' +
    '• Ein storniertes PDF wird erstellt\n' +
    '• Die Nummerierung bleibt lückenlos erhalten\n' +
    '• Sie können danach eine neue Quittung ausstellen',
    ui.ButtonSet.YES_NO
  );
  
  if (confirm !== ui.Button.YES) {
    ui.alert('Stornierung abgebrochen.');
    return;
  }
  
  // Stornierung durchführen
  try {
    var result = stornierQuittung(quittungsNummer, grund, false);
    
    ui.alert(
      '✅ Quittung erfolgreich storniert!\n\n' +
      'Quittungsnummer: ' + result.quittungsNummer + '\n\n' +
      '📄 Storniertes PDF wurde erstellt:\n' +
      result.storniertePDFName + '\n\n' +
      '🔗 Link zum PDF:\n' + result.storniertePDFUrl + '\n\n' +
      '💡 NÄCHSTER SCHRITT:\n' +
      'Wenn Sie eine korrigierte Quittung ausstellen möchten, verwenden Sie:\n' +
      'Aktionen → Quittung ausstellen'
    );
    
  } catch (error) {
    ui.alert(
      '❌ Fehler beim Stornieren der Quittung:\n\n' + error.toString() + '\n\n' +
      'Details siehe Logs (Erweiterungen → Apps Script → Ausführungen)'
    );
    Logger.log('Fehler beim Stornieren: ' + error.toString());
  }
}

function showQuittungDialog() {
  var ui = SpreadsheetApp.getUi();
  var response = ui.prompt(
    'Spendenquittung ausstellen',
    'Bitte geben Sie die Zeile an, für die eine Quittung ausgestellt werden soll:\nFormat: Tabellenname,Zeile\nBeispiel: Kontobewegungen,5',
    ui.ButtonSet.OK_CANCEL
  );
  
  if (response.getSelectedButton() == ui.Button.OK) {
    var input = response.getResponseText().split(',');
    if (input.length === 2) {
      var sheetName = input[0].trim();
      var rowIndex = parseInt(input[1].trim());
      
      try {
        var result = issueReceipt(rowIndex, sheetName);
        var message = '✅ Quittung erfolgreich ausgestellt!\n\n' +
          'Quittungsnummer: ' + result.receiptNumber + '\n' +
          'PDF-Datei: ' + result.pdfFileName + '\n\n' +
          '📄 Das PDF wurde in Google Drive gespeichert.\n' +
          '🔗 Link zum PDF:\n' + result.pdfUrl;
        
        if (result.emailSent) {
          message += '\n\n📧 E-Mail wurde automatisch versendet an:\n' + result.emailAddress;
        } else if (result.emailAddress) {
          message += '\n\n⚠️ E-Mail-Adresse gefunden, aber Versand fehlgeschlagen:\n' + result.emailAddress;
        } else {
          message += '\n\nℹ️ Keine E-Mail-Adresse gefunden.\nQuittung kann manuell per E-Mail versendet werden.';
        }
        
        ui.alert('Quittung erstellt', message, ui.ButtonSet.OK);
      } catch(error) {
        Logger.log('Fehler beim Ausstellen der Quittung: ' + error.toString());
        ui.alert('❌ Fehler: ' + error.message + '\n\nDetails siehe Logs (Erweiterungen → Apps Script → Ausführungen)');
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
  try {
    // Validiere Jahr (Query-Parameter kommen ggf. als String)
    var yearNum = parseInt(String(year), 10);
    if (!yearNum || isNaN(yearNum) || yearNum < 2000 || yearNum > new Date().getFullYear() + 1) {
      throw new Error('Ungültiges Jahr: ' + year + '. Bitte geben Sie ein gültiges Jahr zwischen 2000 und ' + (new Date().getFullYear() + 1) + ' ein.');
    }
    year = yearNum;

  var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) {
      throw new Error('Spreadsheet konnte nicht geöffnet werden.');
    }
  
  // Einnahmen / Ausgaben: dieselbe Logik wie Dashboard-Zellen C7–C18
  // (Custom Functions schließen z. B. "Intern" bzw. doppelte Spendenübergaben korrekt aus)
    var einnahmenKonto = EINNAHMEN_KONTO_JAHR(year) || 0;
    var einnahmenBargeld = BARGELDSPENDEN_JAHR(year) || 0;
    var gesamtEinnahmen = einnahmenKonto + einnahmenBargeld;

    // Sachspenden separat erfassen (nicht in Geldeinnahmen)
    var sachspenden = SACHSPENDEN_JAHR(year) || 0;

    var ausgabenKonto = AUSGABEN_KONTO_JAHR(year) || 0;
    var barausgaben = BARAUSGABEN_JAHR(year) || 0;
    // SINGLE SOURCE OF TRUTH wie UEBERGABE_JAHR: nur Konto "Spendenübergabe", nicht Extra-Tabelle
    var ausgabenUebergabe = UEBERGABE_JAHR(year) || 0;
    var gesamtAusgaben = ausgabenKonto + barausgaben + ausgabenUebergabe;

    // Anfangsbestand (Dashboard E3) – wie Formel C23 = C21 + (C9 - C18)
    var anfangsbestand = 0;
    var dashboardSheet = ss.getSheetByName(SHEET_DASHBOARD);
    if (dashboardSheet) {
      var dashboardJahrRaw = dashboardSheet.getRange('B3').getValue();
      var dashboardJahr = extractJahr(dashboardJahrRaw);
      if (dashboardJahr === year) {
        var abRaw = dashboardSheet.getRange('E3').getValue();
        if (typeof abRaw === 'number' && !isNaN(abRaw)) {
          anfangsbestand = abRaw;
        }
      }
    }

    // Saldo = Anfangsbestand + Einnahmen - Ausgaben (entspricht Dashboard C23)
    var saldo = anfangsbestand + gesamtEinnahmen - gesamtAusgaben;
  
    // Quittungen - NEUE LOGIK: Verwende Quittungsprotokoll statt einzelne Sheets
    // Zähle nur GÜLTIGE Quittungen, stornierte separat
    var protokollSheet = ss.getSheetByName(SHEET_QUITTUNGSPROTOKOLL);
    var quittungenGueltig = countGueltigeQuittungen(protokollSheet, year) || 0;
    var quittungenStorniert = countStornierteQuittungen(protokollSheet, year) || 0;
    var quittungenGesamt = quittungenGueltig + quittungenStorniert;
  
  return {
    jahr: year,
    // Dokumentationshilfe: explizit ausgeben, damit die Saldo-Berechnung transparent ist
    anfangsbestand: anfangsbestand,
    einnahmen: {
        konto: einnahmenKonto || 0,
        bargeld: einnahmenBargeld || 0,
      gesamt: gesamtEinnahmen
    },
      sachspenden: {
        wert: sachspenden,
        hinweis: 'Sachspenden wurden direkt für satzungsgemäße Zwecke verwendet'
    },
    ausgaben: {
        konto: ausgabenKonto || 0,
        bar: barausgaben,
      uebergabe: ausgabenUebergabe,
      gesamt: gesamtAusgaben
    },
    saldo: saldo,
    quittungen: {
      gueltig: quittungenGueltig,
      storniert: quittungenStorniert,
      gesamt: quittungenGesamt,
      hinweis: quittungenStorniert > 0 ? '(' + quittungenStorniert + ' storniert)' : ''
    },
    erstellt: new Date()
  };
  } catch (error) {
    Logger.log('Fehler in getJahresabschluss(' + year + '): ' + error.toString());
    throw error;
  }
}

/**
 * Zählt gültige (nicht stornierte) Quittungen aus dem Quittungsprotokoll für ein Jahr
 * 
 * @param {Sheet} protokollSheet - Das Quittungsprotokoll-Sheet
 * @param {number} year - Das Jahr
 * @return {number} Anzahl der gültigen Quittungen
 */
function countGueltigeQuittungen(protokollSheet, year) {
  if (!protokollSheet) return 0;
  
  var data = protokollSheet.getDataRange().getValues();
  var count = 0;
  
  // Spalte A (0): Quittungs-Nr., Spalte B (1): Ausstellungsdatum, Spalte F (5): Status
  for (var i = 1; i < data.length; i++) {
    var quittungsNr = data[i][0];
    var ausstellungsDatum = data[i][1];
    var status = data[i][5];
    
    if (quittungsNr && ausstellungsDatum && status === 'Gültig') {
      var jahrQuittung = getBuchungstagJahr(ausstellungsDatum);
      if (jahrQuittung !== null && jahrQuittung == year) {
        count++;
      }
    }
  }
  
  return count;
}

/**
 * Zählt stornierte Quittungen aus dem Quittungsprotokoll für ein Jahr
 * 
 * @param {Sheet} protokollSheet - Das Quittungsprotokoll-Sheet
 * @param {number} year - Das Jahr
 * @return {number} Anzahl der stornierten Quittungen
 */
function countStornierteQuittungen(protokollSheet, year) {
  if (!protokollSheet) return 0;
  
  var data = protokollSheet.getDataRange().getValues();
  var count = 0;
  
  // Spalte A (0): Quittungs-Nr., Spalte B (1): Ausstellungsdatum, Spalte F (5): Status
  for (var i = 1; i < data.length; i++) {
    var quittungsNr = data[i][0];
    var ausstellungsDatum = data[i][1];
    var status = data[i][5];
    
    if (quittungsNr && ausstellungsDatum && status === 'Storniert') {
      var jahrQuittung = getBuchungstagJahr(ausstellungsDatum);
      if (jahrQuittung !== null && jahrQuittung == year) {
        count++;
      }
    }
  }
  
  return count;
}

function sumByYear(sheet, year, dateCol, amountCol) {
  if (!sheet) return 0;
  
  var data = sheet.getDataRange().getValues();
  var sum = 0;
  
  for (var i = 1; i < data.length; i++) {
    var datum = data[i][dateCol - 1];
    var betrag = data[i][amountCol - 1];
    var rowYear = getBuchungstagJahr(datum);
    var bNum = normalizeKontoBetrag(betrag);
    if (rowYear !== null && !isNaN(bNum) && rowYear == year) {
      sum += bNum;
    }
  }
  
  return sum;
}

/**
 * Summiert nur POSITIVE Beträge eines Jahres (für Einnahmen aus Kontobewegungen)
 */
function sumPositiveByYear(sheet, year, dateCol, amountCol) {
  if (!sheet) return 0;
  
  var data = sheet.getDataRange().getValues();
  var sum = 0;
  
  for (var i = 1; i < data.length; i++) {
    var datum = data[i][dateCol - 1];
    var betrag = normalizeKontoBetrag(data[i][amountCol - 1]);
    var rowYear = getBuchungstagJahr(datum);
    
    if (rowYear !== null && !isNaN(betrag) && betrag > 0 && rowYear == year) {
      sum += betrag;
    }
  }
  
  return sum;
}

/**
 * Summiert nur NEGATIVE Beträge eines Jahres (für Ausgaben aus Kontobewegungen)
 * Gibt den absoluten Betrag zurück (positiv)
 */
function sumNegativeByYear(sheet, year, dateCol, amountCol) {
  if (!sheet) return 0;
  
  var data = sheet.getDataRange().getValues();
  var sum = 0;
  
  for (var i = 1; i < data.length; i++) {
    var datum = data[i][dateCol - 1];
    var betrag = normalizeKontoBetrag(data[i][amountCol - 1]);
    var rowYear = getBuchungstagJahr(datum);
    
    if (rowYear !== null && !isNaN(betrag) && betrag < 0 && rowYear == year) {
      sum += Math.abs(betrag);
    }
  }
  
  return sum;
}

/**
 * Summiert nur BARGELD-Spenden für ein bestimmtes Jahr (nicht Sachspenden)
 * Spalte A = Datum, Spalte B = Betrag, Spalte C = Art
 */
function sumBargeldByYear(sheet, year) {
  if (!sheet) return 0;
  
  var data = sheet.getDataRange().getValues();
  var sum = 0;
  
  for (var i = 1; i < data.length; i++) {
    var datum = data[i][0]; // Spalte A: Datum
    var betrag = data[i][1]; // Spalte B: Betrag
    var art = data[i][2];    // Spalte C: Art
    
    var rowYear = getBuchungstagJahr(datum);
    var bNum = normalizeKontoBetrag(betrag);
    if (rowYear !== null && !isNaN(bNum) && art === 'Bargeld' && rowYear == year) {
      sum += bNum;
    }
  }
  
  return sum;
}

/**
 * Summiert nur Sachspenden für ein bestimmtes Jahr
 * Spalte A = Datum, Spalte B = Betrag, Spalte C = Art
 */
function sumSachspendenByYear(sheet, year) {
  if (!sheet) return 0;
  
  var data = sheet.getDataRange().getValues();
  var sum = 0;
  
  for (var i = 1; i < data.length; i++) {
    var datum = data[i][0]; // Spalte A: Datum
    var betrag = data[i][1]; // Spalte B: Betrag
    var art = data[i][2];    // Spalte C: Art
    
    var rowYear = getBuchungstagJahr(datum);
    var bNum = normalizeKontoBetrag(betrag);
    if (rowYear !== null && !isNaN(bNum) && art === 'Sachspende' && rowYear == year) {
      sum += bNum;
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
    
    var rowYear = getBuchungstagJahr(datum);
    if (rowYear !== null && rowYear == year && quittung === 'Ja') {
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
        '💰 EINNAHMEN (Geldmittel)\n' +
        'Einnahmen (Konto): ' + abschluss.einnahmen.konto.toFixed(2) + ' €\n' +
        'Bargeldspenden: ' + abschluss.einnahmen.bargeld.toFixed(2) + ' €\n' +
        'Gesamt Einnahmen: ' + abschluss.einnahmen.gesamt.toFixed(2) + ' €\n\n' +
        'ℹ️ SACHSPENDEN\n' +
        'Wert (direkt verwendet): ' + abschluss.sachspenden.wert.toFixed(2) + ' €\n' +
        'Hinweis: ' + abschluss.sachspenden.hinweis + '\n\n' +
        '💳 AUSGABEN (Geldmittel)\n' +
        'Ausgaben (Konto): ' + abschluss.ausgaben.konto.toFixed(2) + ' €\n' +
        'Barausgaben: ' + abschluss.ausgaben.bar.toFixed(2) + ' €\n' +
        'Übergebene Spenden: ' + abschluss.ausgaben.uebergabe.toFixed(2) + ' €\n' +
        'Gesamt Ausgaben: ' + abschluss.ausgaben.gesamt.toFixed(2) + ' €\n\n' +
        '💵 SALDO (Geldmittel): ' + abschluss.saldo.toFixed(2) + ' €\n\n' +
        '📄 SPENDENQUITTUNGEN\n' +
        'Gültige Quittungen: ' + abschluss.quittungen.gueltig + '\n' +
        'Stornierte Quittungen: ' + abschluss.quittungen.storniert + '\n' +
        'Gesamt ausgestellt: ' + abschluss.quittungen.gesamt + '\n' +
        (abschluss.quittungen.hinweis ? 'Hinweis: ' + abschluss.quittungen.hinweis : '');
      
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
  sheet.getRange('A4').setValue('💰 EINNAHMEN (Geldmittel)');
  sheet.getRange('A4:D4').merge().setBackground('#e8f5e9').setFontWeight('bold').setFontSize(14);
  
  var einnahmenData = [
    ['Kategorie', 'Betrag (€)', '', ''],
    ['Einnahmen (Konto)', abschluss.einnahmen.konto, '', ''],
    ['Bargeldspenden', abschluss.einnahmen.bargeld, '', ''],
    ['Gesamt Einnahmen (Geld)', abschluss.einnahmen.gesamt, '', '']
  ];
  sheet.getRange('A5:D8').setValues(einnahmenData);
  sheet.getRange('A8:D8').setBackground('#a5d6a7').setFontWeight('bold');
  
  // Sachspenden-Nachweis (separat)
  sheet.getRange('A9').setValue('ℹ️ SACHSPENDEN-NACHWEIS');
  sheet.getRange('A9:D9').merge().setBackground('#fff9c4').setFontWeight('bold').setFontSize(12);
  
  var sachspendenData = [
    ['Sachspenden (direkt verwendet)', abschluss.sachspenden.wert, '', '']
  ];
  sheet.getRange('A10:D10').setValues(sachspendenData);
  sheet.getRange('A10:D10').setBackground('#fffde7').setFontStyle('italic');
  
  // Ausgaben
  sheet.getRange('A12').setValue('💳 AUSGABEN (Geldmittel)');
  sheet.getRange('A12:D12').merge().setBackground('#ffebee').setFontWeight('bold').setFontSize(14);
  
  var ausgabenData = [
    ['Kategorie', 'Betrag (€)', '', ''],
    ['Ausgaben (Konto)', abschluss.ausgaben.konto, '', ''],
    ['Barausgaben', abschluss.ausgaben.bar, '', ''],
    ['Übergebene Spenden', abschluss.ausgaben.uebergabe, '', ''],
    ['Gesamt Ausgaben (Geld)', abschluss.ausgaben.gesamt, '', '']
  ];
  sheet.getRange('A13:D17').setValues(ausgabenData);
  sheet.getRange('A17:D17').setBackground('#ef9a9a').setFontWeight('bold');
  
  // Saldo
  sheet.getRange('A19').setValue('💵 SALDO (Geldmittel)');
  sheet.getRange('A19:D19').merge().setBackground('#e3f2fd').setFontWeight('bold').setFontSize(14);
  
  sheet.getRange('A20').setValue('Einnahmen - Ausgaben');
  sheet.getRange('B20').setValue(abschluss.saldo);
  sheet.getRange('A20:B20').setBackground('#bbdefb').setFontWeight('bold').setFontSize(12);
  
  // Quittungen
  sheet.getRange('A22').setValue('📄 SPENDENQUITTUNGEN');
  sheet.getRange('A22:D22').merge().setBackground('#fff3e0').setFontWeight('bold').setFontSize(14);
  
  var quittungData = [
    ['Status', 'Anzahl', '', ''],
    ['✅ Gültige Quittungen', abschluss.quittungen.gueltig, '', ''],
    ['❌ Stornierte Quittungen', abschluss.quittungen.storniert, '', ''],
    ['📊 Gesamt ausgestellt', abschluss.quittungen.gesamt, '', '']
  ];
  sheet.getRange('A23:D26').setValues(quittungData);
  sheet.getRange('A23:D23').setBackground('#e0e0e0').setFontWeight('bold');
  sheet.getRange('A24:D24').setBackground('#c8e6c9'); // Grün für gültig
  sheet.getRange('A25:D25').setBackground('#ffcdd2'); // Rot für storniert
  sheet.getRange('A26:D26').setBackground('#ffcc80').setFontWeight('bold');
  
  // Hinweis für Stornierungen (falls vorhanden)
  if (abschluss.quittungen.storniert > 0) {
    sheet.getRange('A27').setValue('⚠️ Hinweis: Stornierte Quittungen bleiben für die Steuerprüfung dokumentiert');
    sheet.getRange('A27:D27').merge().setFontStyle('italic').setFontSize(9).setBackground('#fff9c4');
  }
  
  // Formatierung
  sheet.setColumnWidth(1, 220);
  sheet.setColumnWidth(2, 150);
  sheet.getRange('B5:B20').setNumberFormat('#,##0.00 €');
  
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

/**
 * Gibt die Summen der übergebenen Spenden pro Jahr zurück.
 * 
 * SINGLE SOURCE OF TRUTH: Kontobewegungen mit Kategorie "Spendenübergabe"
 * 
 * Diese Funktion wird von der Website über die Web-App API abgerufen.
 * Sie gibt nur aggregierte, nicht-personenbezogene Daten zurück.
 * 
 * @returns {Object} { summen: { "2024": 7000, "2025": 5000, ... }, gesamt: 96055 }
 */
function getUebergabeSummen() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) {
      Logger.log('Warnung: Spreadsheet konnte nicht geöffnet werden.');
      return { summen: {}, gesamt: 0 };
    }
    
    var summen = {};
    
    // === QUELLE: Kontobewegungen mit Kategorie "Spendenübergabe" ===
    var kontoSheet = ss.getSheetByName(SHEET_KONTO);
    if (kontoSheet) {
      var data = kontoSheet.getDataRange().getValues();
      
      for (var i = 1; i < data.length; i++) {
        try {
          var datum = data[i][KONTO_COL_BUCHUNGSTAG];
          var betrag = data[i][KONTO_COL_BETRAG];
          var kategorie = data[i][KONTO_COL_KATEGORIE];
          
          // Nur negative Beträge (Ausgaben) mit Kategorie "Spendenübergabe"
          var bNum = normalizeKontoBetrag(betrag);
          var jahr = getBuchungstagJahr(datum);
          if (jahr !== null && !isNaN(bNum) && bNum < 0 && kategorie === 'Spendenübergabe') {
            var positiverBetrag = Math.abs(bNum);
            if (!summen[jahr]) summen[jahr] = 0;
            summen[jahr] += positiverBetrag;
          }
        } catch (rowError) {
          Logger.log('Fehler beim Verarbeiten einer Zeile: ' + rowError.toString());
        }
      }
    } else {
      Logger.log('Warnung: Sheet "' + SHEET_KONTO + '" nicht gefunden.');
    }
    
    // Gesamt berechnen
    var gesamt = Object.values(summen).reduce(function(a, b) { return a + b; }, 0);
    
    Logger.log('getUebergabeSummen(): ' + JSON.stringify({ summen: summen, gesamt: gesamt }));
    
    return { summen: summen, gesamt: gesamt };
  } catch (error) {
    Logger.log('Fehler in getUebergabeSummen(): ' + error.toString());
    return { summen: {}, gesamt: 0 };
  }
}

function getAllYearlyDonationData() {
  try {
  var uebergabeSummen = getUebergabeSummen();
    
    if (!uebergabeSummen || !uebergabeSummen.summen) {
      Logger.log('Warnung: getUebergabeSummen() gab ungültige Daten zurück.');
      return {
        donations: [],
        totalDonations: 0,
        currentYear: new Date().getFullYear()
      };
    }
    
  var years = Object.keys(uebergabeSummen.summen).sort().reverse();
  
  var donations = years.map(function(year) {
      try {
        var yearInt = parseInt(year);
        var amount = parseFloat(uebergabeSummen.summen[year]) || 0;
        
        if (!isNaN(yearInt) && !isNaN(amount)) {
    return {
            year: yearInt,
            amount: amount
          };
        }
        return null;
      } catch (yearError) {
        Logger.log('Fehler beim Verarbeiten des Jahres ' + year + ': ' + yearError.toString());
        return null;
      }
    }).filter(function(item) { return item !== null; }); // Entferne null-Werte
  
  return {
    donations: donations,
      totalDonations: uebergabeSummen.gesamt || 0,
      currentYear: new Date().getFullYear()
    };
  } catch (error) {
    Logger.log('Fehler in getAllYearlyDonationData(): ' + error.toString());
    return {
      donations: [],
      totalDonations: 0,
    currentYear: new Date().getFullYear()
  };
  }
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
  var sheet = ss.getSheetByName(SHEET_KONTO);
  
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
  var sheet = ss.getSheetByName(SHEET_KONTO);
  
  if (!sheet) {
    createKontoSheet();
    sheet = ss.getSheetByName(SHEET_KONTO);
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
  var startRow = lastRow + 1;
  sheet.getRange(startRow, 1, dataToInsert.length, 16).setValues(dataToInsert);
  
  // Formatiere Datum (Spalte B: Buchungstag)
  sheet.getRange(startRow, 2, dataToInsert.length, 1).setNumberFormat('dd.mm.yyyy');
  
  // Formatiere Valutadatum (Spalte C)
  sheet.getRange(startRow, 3, dataToInsert.length, 1).setNumberFormat('dd.mm.yyyy');
  
  // Formatiere Betrag (Spalte I)
  sheet.getRange(startRow, 9, dataToInsert.length, 1).setNumberFormat('#,##0.00 €');
  
  // Dropdown für Kategorie (Spalte L) auf neue Zeilen anwenden
  var kategorieRange = sheet.getRange(startRow, 12, dataToInsert.length, 1);
  var kategorieRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Spende', 'Mitgliedsbeitrag', 'Förderung', 'Intern', 'Spendenübergabe', 'Sonstiges'], true)
    .build();
  kategorieRange.setDataValidation(kategorieRule);
  
  // Dropdown für Quittung (Spalte M) auf neue Zeilen anwenden
  var quittungRange = sheet.getRange(startRow, 13, dataToInsert.length, 1);
  var quittungRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Ja', 'Nein'], true)
    .build();
  quittungRange.setDataValidation(quittungRule);
  
  // Dropdown für Währung (Spalte J) auf neue Zeilen anwenden
  var waehrungRange = sheet.getRange(startRow, 10, dataToInsert.length, 1);
  var waehrungRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['EUR', 'USD', 'GBP'], true)
    .build();
  waehrungRange.setDataValidation(waehrungRule);
}

/**
 * Ordnet alle Zahlungseingänge automatisch Mitgliedern zu
 */
function matchAllPaymentsToMembers() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var kontoSheet = ss.getSheetByName(SHEET_KONTO);
  var mitgliederSheet = ss.getSheetByName('Mitglieder');
  
  if (!kontoSheet) {
    SpreadsheetApp.getUi().alert('❌ Tabelle "' + SHEET_KONTO + '" nicht gefunden!');
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
  var sheet = ss.getSheetByName(SHEET_KONTO);
  
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
  
  // 1. Kontobewegungen: Spalte B (Buchungstag) und C (Valutadatum)
  var kontoSheet = ss.getSheetByName(SHEET_KONTO);
  if (kontoSheet) {
    fixedCount += fixDateColumn(kontoSheet, 2, 'Buchungstag'); // Spalte B
    fixedCount += fixDateColumn(kontoSheet, 3, 'Valutadatum'); // Spalte C
  }
  
  // 2. Bar- und Sachspenden: Spalte A (Datum)
  var bargeldSheet = ss.getSheetByName(SHEET_BARGELD);
  if (bargeldSheet) {
    fixedCount += fixDateColumn(bargeldSheet, 1, 'Datum');
  }
  
  // 3. Barausgaben: Spalte A (Datum)
  var ausgabenSheet = ss.getSheetByName(SHEET_AUSGABEN);
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
 * Importiert Zeilen in "Kontobewegungen" mit automatischer Kategorisierung
 * Neue Buchungen werden OBEN eingefügt, Duplikate werden übersprungen
 */
function importRowsToKontoSheet(rows) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_KONTO);
  
  if (!sheet) {
    throw new Error('Tabelle "' + SHEET_KONTO + '" nicht gefunden. Bitte zuerst anlegen.');
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
    
    // Dropdown für Kategorie (Spalte L) auf neue Zeilen anwenden
    var kategorieRange = sheet.getRange(insertRow, 12, newRows.length, 1);
    var kategorieRule = SpreadsheetApp.newDataValidation()
      .requireValueInList(['Spende', 'Mitgliedsbeitrag', 'Förderung', 'Intern', 'Spendenübergabe', 'Sonstiges'], true)
      .build();
    kategorieRange.setDataValidation(kategorieRule);
    
    // Dropdown für Quittung (Spalte M) auf neue Zeilen anwenden
    var quittungRange = sheet.getRange(insertRow, 13, newRows.length, 1);
    var quittungRule = SpreadsheetApp.newDataValidation()
      .requireValueInList(['Ja', 'Nein'], true)
      .build();
    quittungRange.setDataValidation(quittungRule);
    
    // Dropdown für Währung (Spalte J) auf neue Zeilen anwenden
    var waehrungRange = sheet.getRange(insertRow, 10, newRows.length, 1);
    var waehrungRule = SpreadsheetApp.newDataValidation()
      .requireValueInList(['EUR', 'USD', 'GBP'], true)
      .build();
    waehrungRange.setDataValidation(waehrungRule);
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
    // Kontobewegungen: Spalte B (Buchungstag)
    var kontoSheet = ss.getSheetByName(SHEET_KONTO);
    if (kontoSheet && kontoSheet.getLastRow() > 1) {
      sortSheetByDate(kontoSheet, 2, 1); // Spalte B, Start Zeile 2
    }
    
    // Bar- und Sachspenden: Spalte A (Datum)
    var bargeldSheet = ss.getSheetByName(SHEET_BARGELD);
    if (bargeldSheet && bargeldSheet.getLastRow() > 1) {
      sortSheetByDate(bargeldSheet, 1, 1); // Spalte A, Start Zeile 2
    }
    
    // Barausgaben: Spalte A (Datum)
    var ausgabenSheet = ss.getSheetByName(SHEET_AUSGABEN);
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
  
  if (Object.prototype.toString.call(dateStr) === '[object Date]' && !isNaN(dateStr.getTime())) {
    return dateStr;
  }
  
  var s = String(dateStr).trim();
  
  var match = s.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  if (match) {
    var day = parseInt(match[1], 10);
    var month = parseInt(match[2], 10) - 1;
    var year = parseInt(match[3], 10);
    return new Date(year, month, day);
  }
  
  // Sparkassen-CSV / FinTS teils als ISO (YYYY-MM-DD)
  var iso = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) {
    var y = parseInt(iso[1], 10);
    var mo = parseInt(iso[2], 10) - 1;
    var d = parseInt(iso[3], 10);
    return new Date(y, mo, d);
  }
  
  var parsed = new Date(s);
  if (!isNaN(parsed.getTime())) {
    return parsed;
  }
  
  return '';
}

/**
 * Parst Sparkassen-Betrag (z.B. "1.234,56" oder "-1.234,56")
 */
function parseSparkassenBetrag(betragStr) {
  if (betragStr === null || betragStr === undefined || betragStr === '') return 0;
  if (typeof betragStr === 'number') {
    return isNaN(betragStr) ? 0 : betragStr;
  }
  
  var s = String(betragStr).trim();
  var neg = /^[\s(]*-/.test(s) || /^\(.+\)$/.test(s);
  
  // Entferne Währungssymbole und Leerzeichen (Minus/Klammern separat)
  var cleaned = s.replace(/[^\d,.-]/g, '').replace(/-/g, '');
  
  if (cleaned.indexOf(',') !== -1) {
    // Deutsch: Punkt = Tausender, Komma = Dezimal
    cleaned = cleaned.replace(/\./g, '').replace(',', '.');
  }
  
  var value = parseFloat(cleaned);
  if (isNaN(value)) return 0;
  if (neg) value = -Math.abs(value);
  return value;
}

/**
 * Buchungstag aus Sheet-Zelle → Kalenderjahr (für Dashboard-Custom-Functions).
 * Unterstützt Date, Zahl (Excel-Serientag), Strings dd.mm.yyyy und yyyy-mm-dd.
 *
 * @param {*} datum Zellenwert Buchungstag (Spalte B)
 * @return {number|null} Jahr oder null
 */
function getBuchungstagJahr(datum) {
  if (datum === null || datum === undefined || datum === '') return null;
  if (Object.prototype.toString.call(datum) === '[object Date]' && !isNaN(datum.getTime())) {
    return datum.getFullYear();
  }
  if (typeof datum === 'number') {
    if (datum > 20000 && datum < 80000) {
      var epoch = new Date(Date.UTC(1899, 11, 30));
      var fromSerial = new Date(epoch.getTime() + datum * 86400000);
      if (!isNaN(fromSerial.getTime())) return fromSerial.getFullYear();
    }
    if (datum >= 1900 && datum <= 2100) return Math.floor(datum);
  }
  if (typeof datum === 'string') {
    var t = datum.trim();
    var m = t.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})/);
    if (m) return parseInt(m[3], 10);
    m = t.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (m) return parseInt(m[1], 10);
  }
  var d = new Date(datum);
  if (!isNaN(d.getTime())) return d.getFullYear();
  return null;
}

/**
 * Buchungstag → Date (für LETZTES_DATUM_* in Formeln).
 *
 * @param {*} datum Zellenwert
 * @return {Date|null}
 */
function parseBuchungstagToDate(datum) {
  if (datum === null || datum === undefined || datum === '') return null;
  if (Object.prototype.toString.call(datum) === '[object Date]' && !isNaN(datum.getTime())) {
    return datum;
  }
  if (typeof datum === 'number' && datum > 20000 && datum < 80000) {
    var epoch = new Date(Date.UTC(1899, 11, 30));
    var fromSerial = new Date(epoch.getTime() + datum * 86400000);
    return isNaN(fromSerial.getTime()) ? null : fromSerial;
  }
  if (typeof datum === 'string') {
    var t = datum.trim();
    var m = t.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})/);
    if (m) return new Date(parseInt(m[3], 10), parseInt(m[2], 10) - 1, parseInt(m[1], 10));
    m = t.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (m) return new Date(parseInt(m[1], 10), parseInt(m[2], 10) - 1, parseInt(m[3], 10));
  }
  var d = new Date(datum);
  return isNaN(d.getTime()) ? null : d;
}

/**
 * Betrag aus Kontobewegungen-Spalte I als Zahl (auch Text aus Import/Paste).
 *
 * @param {*} betrag Zellenwert
 * @return {number} Zahl oder NaN bei nicht interpretierbar
 */
function normalizeKontoBetrag(betrag) {
  if (betrag === null || betrag === undefined || betrag === '') return NaN;
  if (typeof betrag === 'number' && !isNaN(betrag)) return betrag;
  var n = parseSparkassenBetrag(betrag);
  return n;
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

/**
 * Hilfsfunktion: Extrahiert das Jahr aus verschiedenen Eingabetypen
 * Akzeptiert: Zahl (z.B. 2025), Datum-Objekt, oder String
 * 
 * @param {*} input - Jahr als Zahl, Datum oder String
 * @return {number} Jahr als Zahl
 */
function extractJahr(input) {
  if (!input && input !== 0) return new Date().getFullYear(); // Fallback: aktuelles Jahr
  
  // Wenn es bereits eine Zahl ist
  if (typeof input === 'number') {
    return Math.floor(input);
  }
  
  // Wenn es ein Datum-Objekt ist
  if (input instanceof Date) {
    return input.getFullYear();
  }
  
  // Wenn es ein String ist, versuche es zu konvertieren
  if (typeof input === 'string') {
    // Versuche direkt als Zahl zu parsen
    var num = parseFloat(input);
    if (!isNaN(num) && num > 1900 && num < 2100) {
      return Math.floor(num);
    }
    // Versuche als Datum zu parsen
    var date = new Date(input);
    if (!isNaN(date.getTime())) {
      return date.getFullYear();
    }
  }
  
  // Fallback: aktuelles Jahr
  return new Date().getFullYear();
}

/**
 * Custom Function: Summiert positive Beträge (Einnahmen) aus Kontobewegungen für ein bestimmtes Jahr,
 * OHNE "Intern"-Kategorie (um Doppelzählungen zu vermeiden)
 * 
 * @param {number|Date|string} jahr - Das Jahr für die Filterung (Zahl, Datum oder String)
 * @return {number} Summe der Einnahmen (ohne Intern)
 * @customfunction
 */
function EINNAHMEN_KONTO_JAHR(jahr) {
  var targetYear = extractJahr(jahr);
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_KONTO);
  if (!sheet) return 0;
  
  var data = sheet.getDataRange().getValues();
  var summe = 0;
  
  // Spaltenindizes (0-basiert): B=1 (Datum), I=8 (Betrag), L=11 (Kategorie)
  for (var i = 1; i < data.length; i++) {
    var datum = data[i][1]; // Spalte B
    var betrag = data[i][8]; // Spalte I
    var kategorie = data[i][11]; // Spalte L
    var rowYear = getBuchungstagJahr(datum);
    var bNum = normalizeKontoBetrag(betrag);
    
    if (rowYear !== null && !isNaN(bNum) && bNum > 0 && kategorie !== 'Intern') {
      if (rowYear == targetYear) {
        summe += bNum;
      }
    }
  }
  
  return summe;
}

/**
 * Custom Function: Zählt positive Einträge aus Kontobewegungen für ein bestimmtes Jahr,
 * OHNE "Intern"-Kategorie (um Doppelzählungen zu vermeiden)
 * 
 * @param {number} jahr - Das Jahr für die Filterung
 * @return {number} Anzahl der positiven Einträge (ohne Intern)
 * @customfunction
 */
/**
 * Custom Function: Zählt positive Einträge aus Kontobewegungen für ein bestimmtes Jahr,
 * OHNE "Intern"-Kategorie (um Doppelzählungen zu vermeiden)
 * 
 * @param {number|Date|string} jahr - Das Jahr für die Filterung (Zahl, Datum oder String)
 * @return {number} Anzahl der positiven Einträge (ohne Intern)
 * @customfunction
 */
function ANZAHL_EINNAHMEN_KONTO_JAHR(jahr) {
  var targetYear = extractJahr(jahr);
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_KONTO);
  if (!sheet) return 0;
  
  var data = sheet.getDataRange().getValues();
  var anzahl = 0;
  
  // Spaltenindizes (0-basiert): B=1 (Datum), I=8 (Betrag), L=11 (Kategorie)
  for (var i = 1; i < data.length; i++) {
    var datum = data[i][1]; // Spalte B
    var betrag = data[i][8]; // Spalte I
    var kategorie = data[i][11]; // Spalte L
    var rowYear = getBuchungstagJahr(datum);
    var bNum = normalizeKontoBetrag(betrag);
    
    if (rowYear !== null && !isNaN(bNum) && bNum > 0 && kategorie !== 'Intern') {
      if (rowYear == targetYear) {
        anzahl++;
      }
    }
  }
  
  return anzahl;
}

/**
 * Custom Function: Summiert Bargeldspenden für ein bestimmtes Jahr
 * 
 * @param {number|Date|string} jahr - Das Jahr für die Filterung (Zahl, Datum oder String)
 * @return {number} Summe der Bargeldspenden
 * @customfunction
 */
function BARGELDSPENDEN_JAHR(jahr) {
  var targetYear = extractJahr(jahr);
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_BARGELD);
  if (!sheet) return 0;
  
  var data = sheet.getDataRange().getValues();
  var summe = 0;
  
  // Spaltenindizes (0-basiert): A=0 (Datum), B=1 (Betrag), C=2 (Art)
  for (var i = 1; i < data.length; i++) {
    var datum = data[i][0]; // Spalte A
    var betrag = data[i][1]; // Spalte B
    var art = data[i][2];    // Spalte C
    var rowYear = getBuchungstagJahr(datum);
    var bNum = normalizeKontoBetrag(betrag);
    
    if (rowYear !== null && !isNaN(bNum) && art === 'Bargeld') {
      if (rowYear == targetYear) {
        summe += bNum;
      }
    }
  }
  
  return summe;
}

/**
 * Custom Function: Zählt Bargeldspenden für ein bestimmtes Jahr
 * 
 * @param {number|Date|string} jahr - Das Jahr für die Filterung (Zahl, Datum oder String)
 * @return {number} Anzahl der Bargeldspenden
 * @customfunction
 */
function ANZAHL_BARGELDSPENDEN_JAHR(jahr) {
  var targetYear = extractJahr(jahr);
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_BARGELD);
  if (!sheet) return 0;
  
  var data = sheet.getDataRange().getValues();
  var anzahl = 0;
  
  // Spaltenindizes (0-basiert): A=0 (Datum), B=1 (Betrag), C=2 (Art)
  for (var i = 1; i < data.length; i++) {
    var datum = data[i][0]; // Spalte A
    var betrag = data[i][1]; // Spalte B
    var art = data[i][2];    // Spalte C
    var rowYear = getBuchungstagJahr(datum);
    var bNum = normalizeKontoBetrag(betrag);
    
    if (rowYear !== null && !isNaN(bNum) && art === 'Bargeld') {
      if (rowYear == targetYear) {
        anzahl++;
      }
    }
  }
  
  return anzahl;
}

/**
 * Custom Function: Summiert Sachspenden für ein bestimmtes Jahr
 * 
 * @param {number|Date|string} jahr - Das Jahr für die Filterung (Zahl, Datum oder String)
 * @return {number} Summe der Sachspenden
 * @customfunction
 */
function SACHSPENDEN_JAHR(jahr) {
  var targetYear = extractJahr(jahr);
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_BARGELD);
  if (!sheet) return 0;
  
  var data = sheet.getDataRange().getValues();
  var summe = 0;
  
  // Spaltenindizes (0-basiert): A=0 (Datum), B=1 (Betrag), C=2 (Art)
  for (var i = 1; i < data.length; i++) {
    var datum = data[i][0]; // Spalte A
    var betrag = data[i][1]; // Spalte B
    var art = data[i][2];    // Spalte C
    var rowYear = getBuchungstagJahr(datum);
    var bNum = normalizeKontoBetrag(betrag);
    
    if (rowYear !== null && !isNaN(bNum) && art === 'Sachspende') {
      if (rowYear == targetYear) {
        summe += bNum;
      }
    }
  }
  
  return summe;
}

/**
 * Custom Function: Zählt Sachspenden für ein bestimmtes Jahr
 * 
 * @param {number|Date|string} jahr - Das Jahr für die Filterung (Zahl, Datum oder String)
 * @return {number} Anzahl der Sachspenden
 * @customfunction
 */
function ANZAHL_SACHSPENDEN_JAHR(jahr) {
  var targetYear = extractJahr(jahr);
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_BARGELD);
  if (!sheet) return 0;
  
  var data = sheet.getDataRange().getValues();
  var anzahl = 0;
  
  // Spaltenindizes (0-basiert): A=0 (Datum), B=1 (Betrag), C=2 (Art)
  for (var i = 1; i < data.length; i++) {
    var datum = data[i][0]; // Spalte A
    var betrag = data[i][1]; // Spalte B
    var art = data[i][2];    // Spalte C
    var rowYear = getBuchungstagJahr(datum);
    var bNum = normalizeKontoBetrag(betrag);
    
    if (rowYear !== null && !isNaN(bNum) && art === 'Sachspende') {
      if (rowYear == targetYear) {
        anzahl++;
      }
    }
  }
  
  return anzahl;
}

/**
 * Custom Function: Summiert negative Beträge (Ausgaben) aus Kontobewegungen für ein bestimmtes Jahr
 * WICHTIG: Schließt Kategorie "Spendenübergabe" aus, da diese separat in "Übergebene Spenden" erfasst wird
 * 
 * @param {number|Date|string} jahr - Das Jahr für die Filterung (Zahl, Datum oder String)
 * @return {number} Summe der Ausgaben (als positive Zahl)
 * @customfunction
 */
function AUSGABEN_KONTO_JAHR(jahr) {
  var targetYear = extractJahr(jahr);
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_KONTO);
  if (!sheet) return 0;
  
  var data = sheet.getDataRange().getValues();
  var summe = 0;
  
  // Spaltenindizes (0-basiert): B=1 (Datum), I=8 (Betrag), L=11 (Kategorie)
  for (var i = 1; i < data.length; i++) {
    var datum = data[i][1]; // Spalte B
    var betrag = data[i][8]; // Spalte I
    var kategorie = data[i][11] || ''; // Spalte L
    var rowYear = getBuchungstagJahr(datum);
    var bNum = normalizeKontoBetrag(betrag);
    
    // Schließe "Spendenübergabe" aus (wird separat in "Übergebene Spenden" gezählt)
    if (rowYear !== null && !isNaN(bNum) && bNum < 0 && kategorie !== 'Spendenübergabe') {
      if (rowYear == targetYear) {
        summe += Math.abs(bNum);
      }
    }
  }
  
  return summe;
}

/**
 * Custom Function: Zählt negative Beträge (Ausgaben) aus Kontobewegungen für ein bestimmtes Jahr
 * WICHTIG: Schließt Kategorie "Spendenübergabe" aus
 * 
 * @param {number|Date|string} jahr - Das Jahr für die Filterung (Zahl, Datum oder String)
 * @return {number} Anzahl der Ausgaben
 * @customfunction
 */
function ANZAHL_AUSGABEN_KONTO_JAHR(jahr) {
  var targetYear = extractJahr(jahr);
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_KONTO);
  if (!sheet) return 0;
  
  var data = sheet.getDataRange().getValues();
  var anzahl = 0;
  
  // Spaltenindizes (0-basiert): B=1 (Datum), I=8 (Betrag), L=11 (Kategorie)
  for (var i = 1; i < data.length; i++) {
    var datum = data[i][1]; // Spalte B
    var betrag = data[i][8]; // Spalte I
    var kategorie = data[i][11] || ''; // Spalte L
    var rowYear = getBuchungstagJahr(datum);
    var bNum = normalizeKontoBetrag(betrag);
    
    // Schließe "Spendenübergabe" aus (wird separat in "Übergebene Spenden" gezählt)
    if (rowYear !== null && !isNaN(bNum) && bNum < 0 && kategorie !== 'Spendenübergabe') {
      if (rowYear == targetYear) {
        anzahl++;
      }
    }
  }
  
  return anzahl;
}

/**
 * Custom Function: Summiert Barausgaben für ein bestimmtes Jahr
 * 
 * @param {number|Date|string} jahr - Das Jahr für die Filterung (Zahl, Datum oder String)
 * @return {number} Summe der Barausgaben
 * @customfunction
 */
function BARAUSGABEN_JAHR(jahr) {
  var targetYear = extractJahr(jahr);
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_AUSGABEN);
  if (!sheet) return 0;
  
  var data = sheet.getDataRange().getValues();
  var summe = 0;
  
  // Spaltenindizes (0-basiert): A=0 (Datum), B=1 (Betrag)
  for (var i = 1; i < data.length; i++) {
    var datum = data[i][0]; // Spalte A
    var betrag = data[i][1]; // Spalte B
    var rowYear = getBuchungstagJahr(datum);
    var bNum = normalizeKontoBetrag(betrag);
    
    if (rowYear !== null && !isNaN(bNum)) {
      if (rowYear == targetYear) {
        summe += bNum;
      }
    }
  }
  
  return summe;
}

/**
 * Custom Function: Zählt Barausgaben für ein bestimmtes Jahr
 * 
 * @param {number|Date|string} jahr - Das Jahr für die Filterung (Zahl, Datum oder String)
 * @return {number} Anzahl der Barausgaben
 * @customfunction
 */
function ANZAHL_BARAUSGABEN_JAHR(jahr) {
  var targetYear = extractJahr(jahr);
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_AUSGABEN);
  if (!sheet) return 0;
  
  var data = sheet.getDataRange().getValues();
  var anzahl = 0;
  
  // Spaltenindizes (0-basiert): A=0 (Datum), B=1 (Betrag)
  for (var i = 1; i < data.length; i++) {
    var datum = data[i][0]; // Spalte A
    var betrag = data[i][1]; // Spalte B
    var rowYear = getBuchungstagJahr(datum);
    var bNum = normalizeKontoBetrag(betrag);
    
    if (rowYear !== null && !isNaN(bNum)) {
      if (rowYear == targetYear) {
        anzahl++;
      }
    }
  }
  
  return anzahl;
}

/**
 * Custom Function: Summiert übergebene Spenden für ein bestimmtes Jahr
 * 
 * SINGLE SOURCE OF TRUTH: Nur Kontobewegungen mit Kategorie "Spendenübergabe"
 * Die "Übergebene Spenden"-Tabelle ist optional für zusätzliche Details (Empfänger, Anlass)
 * 
 * @param {number|Date|string} jahr - Das Jahr für die Filterung (Zahl, Datum oder String)
 * @return {number} Summe der übergebenen Spenden
 * @customfunction
 */
function UEBERGABE_JAHR(jahr) {
  var targetYear = extractJahr(jahr);
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var kontoSheet = ss.getSheetByName(SHEET_KONTO);
  if (!kontoSheet) return 0;
  
  var data = kontoSheet.getDataRange().getValues();
  var summe = 0;
  
  // Spaltenstruktur: B=Datum(1), I=Betrag(8), L=Kategorie(11)
  for (var i = 1; i < data.length; i++) {
    var datum = data[i][1];       // Spalte B: Buchungstag
    var betrag = data[i][8];      // Spalte I: Betrag
    var kategorie = data[i][11];  // Spalte L: Kategorie
    var rowYear = getBuchungstagJahr(datum);
    var bNum = normalizeKontoBetrag(betrag);
    
    // Nur negative Beträge (Ausgaben) mit Kategorie "Spendenübergabe"
    if (rowYear !== null && !isNaN(bNum) && bNum < 0 && kategorie === 'Spendenübergabe') {
      if (rowYear == targetYear) {
        summe += Math.abs(bNum);
      }
    }
  }
  
  return summe;
}

/**
 * Custom Function: Zählt übergebene Spenden für ein bestimmtes Jahr
 * 
 * SINGLE SOURCE OF TRUTH: Nur Kontobewegungen mit Kategorie "Spendenübergabe"
 * 
 * @param {number|Date|string} jahr - Das Jahr für die Filterung (Zahl, Datum oder String)
 * @return {number} Anzahl der übergebenen Spenden
 * @customfunction
 */
function ANZAHL_UEBERGABE_JAHR(jahr) {
  var targetYear = extractJahr(jahr);
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var kontoSheet = ss.getSheetByName(SHEET_KONTO);
  if (!kontoSheet) return 0;
  
  var data = kontoSheet.getDataRange().getValues();
  var anzahl = 0;
  
  // Spaltenstruktur: B=Datum(1), I=Betrag(8), L=Kategorie(11)
  for (var i = 1; i < data.length; i++) {
    var datum = data[i][1];       // Spalte B: Buchungstag
    var betrag = data[i][8];      // Spalte I: Betrag
    var kategorie = data[i][11];  // Spalte L: Kategorie
    var rowYear = getBuchungstagJahr(datum);
    var bNum = normalizeKontoBetrag(betrag);
    
    // Nur negative Beträge (Ausgaben) mit Kategorie "Spendenübergabe"
    if (rowYear !== null && !isNaN(bNum) && bNum < 0 && kategorie === 'Spendenübergabe') {
      if (rowYear == targetYear) {
        anzahl++;
      }
    }
  }
  
  return anzahl;
}

/**
 * Debug-Funktion: Zeigt alle positiven Kontobewegungen mit Kategorie für ein Jahr
 */
function debugKontoKategorien() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_KONTO);
  if (!sheet) {
    Logger.log('Sheet nicht gefunden');
    return;
  }
  
  var data = sheet.getDataRange().getValues();
  var jahr = 2025;
  
  Logger.log('=== DEBUG: Positive Kontobewegungen für ' + jahr + ' ===');
  Logger.log('Format: Datum | Betrag | Kategorie');
  
  for (var i = 1; i < data.length; i++) {
    var datum = data[i][1]; // Spalte B
    var betrag = data[i][8]; // Spalte I
    var kategorie = data[i][11]; // Spalte L
    var rowYear = getBuchungstagJahr(datum);
    var bNum = normalizeKontoBetrag(betrag);
    
    if (rowYear !== null && !isNaN(bNum) && bNum > 0) {
      if (rowYear == jahr) {
        var dObj = parseBuchungstagToDate(datum);
        var dStr = dObj ? Utilities.formatDate(dObj, Session.getScriptTimeZone(), 'dd.MM.yyyy') : String(datum);
        Logger.log(
          'Zeile ' + (i+1) + ': ' + 
          dStr + 
          ' | ' + betrag + ' € | "' + kategorie + '"' +
          (kategorie === 'Intern' ? ' ✓ INTERN (wird nicht gezählt)' : ' → WIRD GEZÄHLT')
        );
      }
    }
  }
  
  Logger.log('=== ENDE DEBUG ===');
}

/**
 * Custom Function: Findet das letzte Datum in der Kontobewegungen-Tabelle
 * 
 * @return {Date} Letztes Datum
 * @customfunction
 */
function LETZTES_DATUM_KONTO() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_KONTO);
  if (!sheet) return null;
  
  var data = sheet.getDataRange().getValues();
  var maxDate = null;
  
  // Spalte B (Index 1) = Buchungstag
  for (var i = 1; i < data.length; i++) {
    var datum = parseBuchungstagToDate(data[i][1]);
    if (datum) {
      if (!maxDate || datum > maxDate) {
        maxDate = datum;
      }
    }
  }
  
  return maxDate;
}

/**
 * Custom Function: Findet das letzte Datum in der Bar- und Sachspenden-Tabelle
 * 
 * @return {Date} Letztes Datum
 * @customfunction
 */
function LETZTES_DATUM_BARGELD() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_BARGELD);
  if (!sheet) return null;
  
  var data = sheet.getDataRange().getValues();
  var maxDate = null;
  
  // Spalte A (Index 0) = Datum
  for (var i = 1; i < data.length; i++) {
    var datum = parseBuchungstagToDate(data[i][0]);
    if (datum) {
      if (!maxDate || datum > maxDate) {
        maxDate = datum;
      }
    }
  }
  
  return maxDate;
}

/**
 * Custom Function: Findet das letzte Datum in der Barausgaben-Tabelle
 * 
 * @return {Date} Letztes Datum
 * @customfunction
 */
function LETZTES_DATUM_BARAUSGABEN() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_AUSGABEN);
  if (!sheet) return null;
  
  var data = sheet.getDataRange().getValues();
  var maxDate = null;
  
  // Spalte A (Index 0) = Datum
  for (var i = 1; i < data.length; i++) {
    var datum = parseBuchungstagToDate(data[i][0]);
    if (datum) {
      if (!maxDate || datum > maxDate) {
        maxDate = datum;
      }
    }
  }
  
  return maxDate;
}

/**
 * Custom Function: Findet das letzte Datum einer Spendenübergabe
 * 
 * SINGLE SOURCE OF TRUTH: Kontobewegungen mit Kategorie "Spendenübergabe"
 * 
 * @return {Date} Letztes Übergabedatum
 * @customfunction
 */
function LETZTES_DATUM_UEBERGABE() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var kontoSheet = ss.getSheetByName(SHEET_KONTO);
  if (!kontoSheet) return null;
  
  var data = kontoSheet.getDataRange().getValues();
  var maxDate = null;
  
  // Spaltenstruktur: B=Datum(1), I=Betrag(8), L=Kategorie(11)
  for (var i = 1; i < data.length; i++) {
    var datum = parseBuchungstagToDate(data[i][1]);       // Spalte B: Buchungstag
    var betrag = data[i][8];      // Spalte I: Betrag
    var kategorie = data[i][11];  // Spalte L: Kategorie
    var bNum = normalizeKontoBetrag(betrag);
    
    // Nur Buchungen mit Kategorie "Spendenübergabe"
    if (datum && !isNaN(bNum) && bNum < 0 && kategorie === 'Spendenübergabe') {
      if (!maxDate || datum > maxDate) {
        maxDate = datum;
      }
    }
  }
  
  return maxDate;
}

/**
 * Konvertiert einen Geldbetrag in Worte (für Spendenbescheinigungen)
 * 
 * @param {number} betrag - Betrag als Zahl (z.B. 160.00)
 * @return {string} Betrag in Worten (z.B. "einhundertsechzig")
 */
function betragInWorten(betrag) {
  if (!betrag || betrag === 0) return 'null';
  
  var ganzzahl = Math.floor(betrag);
  var cents = Math.round((betrag - ganzzahl) * 100);
  
  var einer = ['', 'ein', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben', 'acht', 'neun'];
  var zehnBis19 = ['zehn', 'elf', 'zwölf', 'dreizehn', 'vierzehn', 'fünfzehn', 'sechzehn', 'siebzehn', 'achtzehn', 'neunzehn'];
  var zehner = ['', 'zehn', 'zwanzig', 'dreißig', 'vierzig', 'fünfzig', 'sechzig', 'siebzig', 'achtzig', 'neunzig'];
  
  function zahlInWorten(n) {
    if (n === 0) return '';
    if (n === 1) return 'eins';
    if (n < 10) return einer[n];
    if (n < 20) return zehnBis19[n - 10];
    if (n < 100) {
      var e = n % 10;
      var z = Math.floor(n / 10);
      if (e === 0) return zehner[z];
      return einer[e] + 'und' + zehner[z];
    }
    if (n < 1000) {
      var h = Math.floor(n / 100);
      var rest = n % 100;
      var hundertText = einer[h] + 'hundert';
      if (rest === 0) return hundertText;
      return hundertText + zahlInWorten(rest);
    }
    if (n < 1000000) {
      var t = Math.floor(n / 1000);
      var rest = n % 1000;
      var tausendText = (t === 1) ? 'eintausend' : zahlInWorten(t) + 'tausend';
      if (rest === 0) return tausendText;
      return tausendText + zahlInWorten(rest);
    }
    if (n < 1000000000) {
      var m = Math.floor(n / 1000000);
      var rest = n % 1000000;
      var millionText = (m === 1) ? 'eine Million' : zahlInWorten(m) + ' Millionen';
      if (rest === 0) return millionText;
      return millionText + ' ' + zahlInWorten(rest);
    }
    return 'Betrag zu groß';
  }
  
  var result = zahlInWorten(ganzzahl);
  
  // Cents hinzufügen
  if (cents > 0) {
    result += ' Komma ' + zahlInWorten(cents);
  }
  
  return result;
}

/**
 * Findet vollständige Spenderadresse (zuerst in Mitglieder, dann in Spenderadressen)
 * 
 * @param {string} spenderName - Name des Spenders (z.B. "KORDEL, JOHANNES" oder "Max Mustermann")
 * @return {Object} Objekt mit Adressdaten oder null wenn nicht gefunden
 */
function getSpenderAdresse(spenderName) {
  if (!spenderName || spenderName.trim() === '') return null;
  
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 1. Zuerst in Mitglieder-Tabelle suchen
  var mitgliederSheet = ss.getSheetByName(SHEET_MITGLIEDER);
  if (mitgliederSheet) {
    var mitgliederData = mitgliederSheet.getDataRange().getValues();
    for (var i = 1; i < mitgliederData.length; i++) {
      var name = mitgliederData[i][MITGLIEDER_COL_NAME]; // Spalte B: Vorname, Name
      var anschrift = mitgliederData[i][MITGLIEDER_COL_ANSCHRIFT]; // Spalte C: Anschrift
      
      if (name && nameMatchesApproximate(name, spenderName)) {
        // Anschrift parsen (Format: "Straße Hausnr., PLZ Ort")
        var adressParts = parseAnschrift(anschrift);
        
        return {
          anrede: '', // Nicht in Mitgliedertabelle, daher leer
          vorname: extractVorname(name),
          nachname: extractNachname(name),
          vollstaendigerName: name,
          strasse: adressParts.strasse,
          hausnummer: adressParts.hausnummer,
          plz: adressParts.plz,
          ort: adressParts.ort,
          email: mitgliederData[i][MITGLIEDER_COL_EMAIL] || '',
          telefon: mitgliederData[i][MITGLIEDER_COL_TELEFON] || '',
          iban: mitgliederData[i][MITGLIEDER_COL_IBAN] || '',
          quelle: 'Mitglieder'
        };
      }
    }
  }
  
  // 2. In Spenderadressen-Tabelle suchen
  var spenderSheet = ss.getSheetByName(SHEET_SPENDERADRESSEN);
  if (spenderSheet) {
    var spenderData = spenderSheet.getDataRange().getValues();
    for (var i = 1; i < spenderData.length; i++) {
      var vorname = spenderData[i][2]; // Spalte C: Vorname
      var nachname = spenderData[i][3]; // Spalte D: Nachname
      var vollName = vorname + ' ' + nachname;
      
      if (nameMatchesApproximate(vollName, spenderName)) {
        return {
          anrede: spenderData[i][1] || '', // Spalte B: Anrede
          vorname: vorname,
          nachname: nachname,
          vollstaendigerName: vollName,
          strasse: spenderData[i][4] || '', // Spalte E: Straße
          hausnummer: spenderData[i][5] || '', // Spalte F: Hausnummer
          plz: spenderData[i][6] || '', // Spalte G: PLZ
          ort: spenderData[i][7] || '', // Spalte H: Ort
          email: spenderData[i][8] || '', // Spalte I: Email
          telefon: spenderData[i][9] || '', // Spalte J: Telefon
          iban: spenderData[i][10] || '', // Spalte K: IBAN
          quelle: 'Spenderadressen'
        };
      }
    }
  }
  
  Logger.log('Keine Adresse gefunden für: ' + spenderName);
  return null;
}

/**
 * Prüft ob zwei Namen ungefähr übereinstimmen (case-insensitive, mit Toleranz)
 * Unterstützt verschiedene Formate:
 * - "KORDEL, JOHANNES" vs "Johannes Kordel"
 * - "Max Mustermann" vs "Mustermann, Max"
 */
function nameMatchesApproximate(name1, name2) {
  if (!name1 || !name2) return false;
  
  // Hilfsfunktion: Normalisiert Namen zu "vorname nachname" (lowercase)
  function normalizeName(name) {
    var clean = name.toLowerCase().trim();
    
    if (clean.includes(',')) {
      // Format: "Nachname, Vorname" → "Vorname Nachname"
      var parts = clean.split(',').map(function(p) { return p.trim(); });
      if (parts.length === 2) {
        return parts[1] + ' ' + parts[0]; // Reihenfolge umdrehen
      }
    }
    
    // Format: "Vorname Nachname" (bereits korrekt)
    return clean;
  }
  
  var norm1 = normalizeName(name1).replace(/[^a-zäöüß\s]/g, '').replace(/\s+/g, ' ').trim();
  var norm2 = normalizeName(name2).replace(/[^a-zäöüß\s]/g, '').replace(/\s+/g, ' ').trim();
  
  // Debug-Logging
  Logger.log('Name-Matching:');
  Logger.log('  Original 1: "' + name1 + '" → Normalisiert: "' + norm1 + '"');
  Logger.log('  Original 2: "' + name2 + '" → Normalisiert: "' + norm2 + '"');
  Logger.log('  Match: ' + (norm1 === norm2));
  
  return norm1 === norm2 || norm1.includes(norm2) || norm2.includes(norm1);
}

/**
 * Parst Anschrift-Format: "Straße Hausnr., PLZ Ort"
 */
function parseAnschrift(anschrift) {
  if (!anschrift) return {strasse: '', hausnummer: '', plz: '', ort: ''};
  
  var parts = anschrift.split(',');
  var strasseTeil = parts[0] ? parts[0].trim() : '';
  var ortTeil = parts[1] ? parts[1].trim() : '';
  
  // Straße und Hausnummer trennen (letzte Ziffern = Hausnummer)
  var strasseMatch = strasseTeil.match(/^(.+?)(\d+[a-z]*)$/i);
  var strasse = strasseMatch ? strasseMatch[1].trim() : strasseTeil;
  var hausnummer = strasseMatch ? strasseMatch[2] : '';
  
  // PLZ und Ort trennen (erste 5 Ziffern = PLZ)
  var ortMatch = ortTeil.match(/^(\d{5})\s+(.+)$/);
  var plz = ortMatch ? ortMatch[1] : '';
  var ort = ortMatch ? ortMatch[2] : ortTeil;
  
  return {
    strasse: strasse,
    hausnummer: hausnummer,
    plz: plz,
    ort: ort
  };
}

/**
 * Extrahiert Vorname aus "Vorname Nachname" oder "Nachname, Vorname"
 */
function extractVorname(vollName) {
  if (!vollName) return '';
  
  if (vollName.includes(',')) {
    // Format: "Nachname, Vorname"
    var parts = vollName.split(',');
    return parts[1] ? parts[1].trim() : '';
  } else {
    // Format: "Vorname Nachname"
    var parts = vollName.trim().split(' ');
    return parts[0] || '';
  }
}

/**
 * Extrahiert Nachname aus "Vorname Nachname" oder "Nachname, Vorname"
 */
function extractNachname(vollName) {
  if (!vollName) return '';
  
  if (vollName.includes(',')) {
    // Format: "Nachname, Vorname"
    var parts = vollName.split(',');
    return parts[0] ? parts[0].trim() : '';
  } else {
    // Format: "Vorname Nachname"
    var parts = vollName.trim().split(' ');
    return parts.slice(1).join(' ') || '';
  }
}

// =============================================================================
// HILFSFUNKTIONEN FÜR PDF-GENERIERUNG
// =============================================================================

/**
 * Speichert ein PDF-Dokument in Google Drive
 * Gemeinsame Funktion für alle Quittungstypen
 */
function savePDFToDrive(tempDoc, pdfName) {
  Logger.log('Speichere Dokument...');
  tempDoc.saveAndClose();
  Utilities.sleep(1000);
  
  Logger.log('Konvertiere Dokument zu PDF...');
  var reopenedDoc = DocumentApp.openById(tempDoc.getId());
  var pdfBlob = reopenedDoc.getAs('application/pdf');
  pdfBlob.setName(pdfName);
  Logger.log('PDF-Konvertierung erfolgreich');
  
  // Erstelle Ordner "Spendenquittungen" falls nicht vorhanden
  var folders = DriveApp.getFoldersByName('Spendenquittungen');
  var folder;
  if (folders.hasNext()) {
    folder = folders.next();
    Logger.log('Ordner "Spendenquittungen" gefunden');
  } else {
    folder = DriveApp.createFolder('Spendenquittungen');
    Logger.log('Ordner "Spendenquittungen" erstellt');
  }
  
  Logger.log('Speichere PDF in Google Drive...');
  var pdfFile = folder.createFile(pdfBlob);
  Logger.log('✅ PDF gespeichert in Google Drive: ' + pdfFile.getName() + ' (ID: ' + pdfFile.getId() + ')');
  
  Logger.log('Lösche temporäres Dokument...');
  DriveApp.getFileById(tempDoc.getId()).setTrashed(true);
  Logger.log('✅ Temporäres Dokument gelöscht');
  
  return pdfFile;
}

// =============================================================================
// SAMMELQUITTUNGEN
// =============================================================================

/**
 * Findet alle nicht-quittierten Buchungen für eine Spenderadresse
 * Berücksichtigt auch "Zugehörige Kontonamen" für Familien/Mehrfachspender
 */
function getNichtQuittierteZahlungenFuerSpender(spenderAdresseZeile) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var spenderSheet = ss.getSheetByName(SHEET_SPENDERADRESSEN);
  var kontoSheet = ss.getSheetByName(SHEET_KONTO);
  var bargeldSheet = ss.getSheetByName(SHEET_BARGELD);
  
  if (!spenderSheet || !spenderAdresseZeile) {
    throw new Error('Spenderadressen-Tabelle nicht gefunden oder keine Zeile angegeben');
  }
  
  // Spenderdaten lesen
  var spenderData = spenderSheet.getRange(spenderAdresseZeile, 1, 1, 14).getValues()[0];
  var vorname = spenderData[2] || '';
  var nachname = spenderData[3] || '';
  var spenderName = (vorname + ' ' + nachname).trim();
  var zugehoerigeKontonamen = spenderData[11] || ''; // Spalte L (12)
  
  Logger.log('Suche Buchungen für: ' + spenderName);
  Logger.log('Zugehörige Kontonamen: ' + zugehoerigeKontonamen);
  
  // Liste aller zu suchenden Namen erstellen
  var suchNamen = [spenderName];
  if (zugehoerigeKontonamen) {
    var zusatzNamen = zugehoerigeKontonamen.split(',').map(function(n) { return n.trim(); });
    suchNamen = suchNamen.concat(zusatzNamen);
  }
  
  Logger.log('Suche nach folgenden Namen: ' + JSON.stringify(suchNamen));
  
  var buchungen = [];
  
  // 1. KONTOBEWEGUNGEN durchsuchen
  if (kontoSheet) {
    var kontoData = kontoSheet.getDataRange().getValues();
    for (var i = 1; i < kontoData.length; i++) {
      var row = kontoData[i];
      var datum = row[1]; // Spalte B
      var verwendungszweck = (row[4] || '').toString(); // Spalte E
      var auftraggeber = (row[5] || '').toString(); // Spalte F
      var betrag = parseFloat(row[8]) || 0; // Spalte I
      var quittung = (row[12] || '').toString(); // Spalte M
      
      // Nur positive Beträge ohne Quittung
      if (betrag > 0 && quittung !== 'Ja') {
        // Prüfen ob einer der Suchnamen vorkommt
        for (var j = 0; j < suchNamen.length; j++) {
          if (nameMatchesApproximate(auftraggeber, suchNamen[j]) || 
              verwendungszweck.toLowerCase().includes(suchNamen[j].toLowerCase())) {
            buchungen.push({
              quelle: 'Kontobewegungen',
              zeile: i + 1,
              datum: datum,
              betrag: betrag,
              beschreibung: auftraggeber || verwendungszweck,
              originalName: auftraggeber
            });
            break;
          }
        }
      }
    }
  }
  
  // 2. BAR- UND SACHSPENDEN durchsuchen
  // Spaltenstruktur: A=Datum(0), B=Betrag(1), C=Art(2), D=Spender(3), E=Anlass(4), F=Quittung(5)
  if (bargeldSheet) {
    var bargeldData = bargeldSheet.getDataRange().getValues();
    for (var i = 1; i < bargeldData.length; i++) {
      var row = bargeldData[i];
      var datum = row[0]; // Spalte A: Datum
      var betrag = parseFloat(row[1]) || 0; // Spalte B: Betrag
      var art = (row[2] || '').toString(); // Spalte C: Art
      var spender = (row[3] || '').toString(); // Spalte D: Spender
      var quittung = (row[5] || '').toString(); // Spalte F: Quittung ausgestellt
      
      // Nur Bargeld (nicht Sachspenden) ohne Quittung
      if (art === 'Bargeld' && betrag > 0 && quittung !== 'Ja') {
        // Prüfen ob einer der Suchnamen vorkommt
        for (var j = 0; j < suchNamen.length; j++) {
          if (nameMatchesApproximate(spender, suchNamen[j])) {
            buchungen.push({
              quelle: 'Bar- und Sachspenden',
              zeile: i + 1,
              datum: datum,
              betrag: betrag,
              beschreibung: spender,
              originalName: spender
            });
            break;
          }
        }
      }
    }
  }
  
  // Sortieren nach Datum (älteste zuerst)
  buchungen.sort(function(a, b) {
    return new Date(a.datum) - new Date(b.datum);
  });
  
  Logger.log('Gefundene Buchungen: ' + buchungen.length);
  
  return {
    spenderName: spenderName,
    spenderZeile: spenderAdresseZeile,
    buchungen: buchungen
  };
}

/**
 * Zeigt Dialog zur Auswahl einer Spenderadresse für Sammelquittung
 */
function showSammelquittungDialog() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var spenderSheet = ss.getSheetByName(SHEET_SPENDERADRESSEN);
  
  if (!spenderSheet) {
    SpreadsheetApp.getUi().alert('❌ Fehler', 'Spenderadressen-Tabelle nicht gefunden.\n\nBitte erstellen Sie zuerst die Tabelle über:\nVereinserwaltung → Spenderadressen anlegen', SpreadsheetApp.getUi().ButtonSet.OK);
    return;
  }
  
  var spenderData = spenderSheet.getDataRange().getValues();
  if (spenderData.length <= 1) {
    SpreadsheetApp.getUi().alert('❌ Fehler', 'Keine Spenderadressen vorhanden.\n\nBitte tragen Sie zuerst Spender in die Tabelle "Spenderadressen" ein.', SpreadsheetApp.getUi().ButtonSet.OK);
    return;
  }
  
  // Liste aller Spender erstellen
  var spenderListe = [];
  for (var i = 1; i < spenderData.length; i++) {
    var vorname = spenderData[i][2] || '';
    var nachname = spenderData[i][3] || '';
    var name = (vorname + ' ' + nachname).trim();
    if (name) {
      spenderListe.push({
        zeile: i + 1,
        name: name,
        displayName: (i) + '. ' + name
      });
    }
  }
  
  if (spenderListe.length === 0) {
    SpreadsheetApp.getUi().alert('❌ Fehler', 'Keine Spender mit Namen gefunden.', SpreadsheetApp.getUi().ButtonSet.OK);
    return;
  }
  
  // HTML-Dialog erstellen
  var html = '<style>' +
    'body { font-family: Arial, sans-serif; padding: 15px; }' +
    'select, button { width: 100%; padding: 10px; margin: 10px 0; font-size: 14px; }' +
    'button { background-color: #4CAF50; color: white; border: none; cursor: pointer; border-radius: 4px; }' +
    'button:hover { background-color: #45a049; }' +
    '.info { background: #e3f2fd; padding: 10px; border-radius: 4px; margin-bottom: 15px; }' +
    '</style>' +
    '<div class="info">📊 <strong>Sammelquittung erstellen</strong><br>Wählen Sie einen Spender aus, für den Sie alle nicht-quittierten Buchungen zusammenfassen möchten.</div>' +
    '<label for="spender">Spenderadresse:</label>' +
    '<select id="spender" size="10">';
  
  for (var i = 0; i < spenderListe.length; i++) {
    html += '<option value="' + spenderListe[i].zeile + '">' + spenderListe[i].displayName + '</option>';
  }
  
  html += '</select>' +
    '<button onclick="weiterZuBuchungen()">➡️ Weiter zu Buchungen</button>' +
    '<script>' +
    'function weiterZuBuchungen() {' +
    '  var spenderZeile = document.getElementById("spender").value;' +
    '  if (!spenderZeile) { alert("Bitte wählen Sie einen Spender aus."); return; }' +
    '  google.script.run.withSuccessHandler(function() {' +
    '    google.script.host.close();' +
    '  }).showBuchungenAuswahlDialog(parseInt(spenderZeile));' +
    '}' +
    '</script>';
  
  var htmlOutput = HtmlService.createHtmlOutput(html)
    .setWidth(500)
    .setHeight(500);
  SpreadsheetApp.getUi().showModalDialog(htmlOutput, '📊 Sammelquittung - Spender auswählen');
}

/**
 * Zeigt Dialog zur Auswahl der Buchungen für Sammelquittung
 */
function showBuchungenAuswahlDialog(spenderZeile) {
  try {
    var ergebnis = getNichtQuittierteZahlungenFuerSpender(spenderZeile);
    
    if (ergebnis.buchungen.length === 0) {
      SpreadsheetApp.getUi().alert('ℹ️ Keine Buchungen', 
        'Für ' + ergebnis.spenderName + ' wurden keine nicht-quittierten Buchungen gefunden.\n\n' +
        'Alle Buchungen wurden bereits quittiert oder es liegen keine Buchungen vor.', 
        SpreadsheetApp.getUi().ButtonSet.OK);
      return;
    }
    
    // Gesamtsumme berechnen
    var gesamtsumme = 0;
    for (var i = 0; i < ergebnis.buchungen.length; i++) {
      gesamtsumme += ergebnis.buchungen[i].betrag;
    }
    
    // HTML-Dialog erstellen
    var html = '<style>' +
      'body { font-family: Arial, sans-serif; padding: 15px; }' +
      'table { width: 100%; border-collapse: collapse; margin: 15px 0; }' +
      'th { background: #4CAF50; color: white; padding: 8px; text-align: left; }' +
      'td { padding: 8px; border-bottom: 1px solid #ddd; }' +
      'tr:hover { background: #f5f5f5; }' +
      'button { width: 100%; padding: 12px; margin: 10px 0; font-size: 14px; border: none; cursor: pointer; border-radius: 4px; }' +
      '.primary { background-color: #4CAF50; color: white; }' +
      '.primary:hover { background-color: #45a049; }' +
      '.secondary { background-color: #9E9E9E; color: white; }' +
      '.secondary:hover { background-color: #757575; }' +
      '.info { background: #e3f2fd; padding: 10px; border-radius: 4px; margin-bottom: 15px; }' +
      '.summary { background: #fff3e0; padding: 10px; border-radius: 4px; margin: 15px 0; font-weight: bold; }' +
      'input[type="checkbox"] { transform: scale(1.3); margin-right: 5px; }' +
      '</style>' +
      '<div class="info">📊 <strong>Sammelquittung für: ' + ergebnis.spenderName + '</strong><br>' +
      'Wählen Sie die Buchungen aus, die in der Sammelquittung zusammengefasst werden sollen.</div>' +
      '<div class="summary">💶 Gesamtsumme (alle): ' + gesamtsumme.toFixed(2).replace('.', ',') + ' € (' + ergebnis.buchungen.length + ' Buchungen)</div>' +
      '<table>' +
      '<tr><th>✓</th><th>Datum</th><th>Quelle</th><th>Betrag</th></tr>';
    
    for (var i = 0; i < ergebnis.buchungen.length; i++) {
      var b = ergebnis.buchungen[i];
      var datumStr = Utilities.formatDate(new Date(b.datum), Session.getScriptTimeZone(), 'dd.MM.yyyy');
      var betragStr = b.betrag.toFixed(2).replace('.', ',') + ' €';
      html += '<tr>' +
        '<td><input type="checkbox" id="buch_' + i + '" checked /></td>' +
        '<td>' + datumStr + '</td>' +
        '<td>' + b.quelle + ' (Zeile ' + b.zeile + ')</td>' +
        '<td style="text-align: right; font-weight: bold;">' + betragStr + '</td>' +
        '</tr>';
    }
    
    html += '</table>' +
      '<div id="selectedSum" class="summary">💰 Ausgewählte Summe: ' + gesamtsumme.toFixed(2).replace('.', ',') + ' €</div>' +
      '<button class="primary" onclick="erstelleSammelquittung()">✅ Sammelquittung erstellen</button>' +
      '<button class="secondary" onclick="google.script.host.close()">❌ Abbrechen</button>' +
      '<script>' +
      'var buchungen = ' + JSON.stringify(ergebnis.buchungen) + ';' +
      'var spenderZeile = ' + spenderZeile + ';' +
      'var spenderName = "' + ergebnis.spenderName + '";' +
      '' +
      'function updateSum() {' +
      '  var sum = 0;' +
      '  for (var i = 0; i < buchungen.length; i++) {' +
      '    if (document.getElementById("buch_" + i).checked) {' +
      '      sum += buchungen[i].betrag;' +
      '    }' +
      '  }' +
      '  document.getElementById("selectedSum").innerHTML = "💰 Ausgewählte Summe: " + sum.toFixed(2).replace(".", ",") + " €";' +
      '}' +
      '' +
      'for (var i = 0; i < buchungen.length; i++) {' +
      '  document.getElementById("buch_" + i).addEventListener("change", updateSum);' +
      '}' +
      '' +
      'function erstelleSammelquittung() {' +
      '  var ausgewaehlteBuchungen = [];' +
      '  for (var i = 0; i < buchungen.length; i++) {' +
      '    if (document.getElementById("buch_" + i).checked) {' +
      '      ausgewaehlteBuchungen.push(buchungen[i]);' +
      '    }' +
      '  }' +
      '  if (ausgewaehlteBuchungen.length === 0) {' +
      '    alert("❌ Bitte wählen Sie mindestens eine Buchung aus.");' +
      '    return;' +
      '  }' +
      '  if (!confirm("Sammelquittung für " + ausgewaehlteBuchungen.length + " Buchung(en) erstellen?")) return;' +
      '  document.body.innerHTML = "<div style=\\"text-align:center; padding:50px;\\"><h2>⏳ Erstelle Sammelquittung...</h2><p>Bitte warten Sie einen Moment.</p></div>";' +
      '  google.script.run.withSuccessHandler(function(result) {' +
      '    alert("✅ " + result);' +
      '    google.script.host.close();' +
      '  }).withFailureHandler(function(error) {' +
      '    alert("❌ Fehler: " + error.message);' +
      '    google.script.host.close();' +
      '  }).issueSammelquittung(spenderZeile, ausgewaehlteBuchungen);' +
      '}' +
      '</script>';
    
    var htmlOutput = HtmlService.createHtmlOutput(html)
      .setWidth(700)
      .setHeight(600);
    SpreadsheetApp.getUi().showModalDialog(htmlOutput, '📊 Sammelquittung - Buchungen auswählen');
    
  } catch (e) {
    SpreadsheetApp.getUi().alert('❌ Fehler', 'Fehler beim Laden der Buchungen:\n\n' + e.toString(), SpreadsheetApp.getUi().ButtonSet.OK);
    Logger.log('Fehler in showBuchungenAuswahlDialog: ' + e.toString());
  }
}

/**
 * Erstellt eine Sammelquittung für ausgewählte Buchungen
 */
function issueSammelquittung(spenderZeile, buchungen) {
  Logger.log('=== Erstelle Sammelquittung ===');
  Logger.log('Spenderzeile: ' + spenderZeile);
  Logger.log('Anzahl Buchungen: ' + buchungen.length);
  
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var spenderSheet = ss.getSheetByName(SHEET_SPENDERADRESSEN);
    var quittungenSheet = ss.getSheetByName('Spendenquittungen');
    
    if (!quittungenSheet) {
      createQuittungenSheet();
      quittungenSheet = ss.getSheetByName('Spendenquittungen');
    }
    
    // Spenderadresse abrufen
    var spenderData = spenderSheet.getRange(spenderZeile, 1, 1, 14).getValues()[0];
    var anrede = spenderData[1] || '';
    var vorname = spenderData[2] || '';
    var nachname = spenderData[3] || '';
    var strasse = spenderData[4] || '';
    var hausnummer = spenderData[5] || '';
    var plz = spenderData[6] || '';
    var ort = spenderData[7] || '';
    
    var spenderName = (vorname + ' ' + nachname).trim();
    
    // Gesamtsumme berechnen
    var gesamtsumme = 0;
    for (var i = 0; i < buchungen.length; i++) {
      gesamtsumme += buchungen[i].betrag;
    }
    
    // Zeitraum ermitteln
    var fruehstesDatum = new Date(buchungen[0].datum);
    var spaetestesDatum = new Date(buchungen[buchungen.length - 1].datum);
    var heute = new Date();
    var jahr = heute.getFullYear();
    
    // Quittungsnummer generieren (verwendet dieselbe Funktion wie normale Quittungen)
    var quittungsNummer = generateReceiptNumber(jahr);
    Logger.log('Neue Quittungsnummer: ' + quittungsNummer);
    
    // PDF generieren
    var pdfFile = generateSammelquittungPDF(
      quittungsNummer,
      {
        anrede: anrede,
        vollstaendigerName: spenderName,
        strasse: strasse,
        hausnummer: hausnummer,
        plz: plz,
        ort: ort
      },
      gesamtsumme,
      buchungen,
      fruehstesDatum,
      spaetestesDatum,
      heute
    );
    
    Logger.log('PDF erstellt: ' + pdfFile.getName());
    
    // Alle Buchungen in den Ursprungstabellen markieren
    var kontoSheet = ss.getSheetByName(SHEET_KONTO);
    var bargeldSheet = ss.getSheetByName(SHEET_BARGELD);
    var buchungsVerweise = [];
    
    for (var i = 0; i < buchungen.length; i++) {
      var b = buchungen[i];
      
      if (b.quelle === 'Kontobewegungen' && kontoSheet) {
        // Kontobewegungen: Quittung = Spalte M (13), Quittungsnummer = Spalte N (14)
        kontoSheet.getRange(b.zeile, 13).setValue('Ja');
        kontoSheet.getRange(b.zeile, 14).setValue(quittungsNummer + ' (Sammelquittung)');
        buchungsVerweise.push(b.quelle + ' Zeile ' + b.zeile);
      } else if (bargeldSheet) {
        // Bar-/Sachspenden: Quittung = Spalte F (6), Quittungsnummer = Spalte G (7)
        bargeldSheet.getRange(b.zeile, 6).setValue('Ja');
        bargeldSheet.getRange(b.zeile, 7).setValue(quittungsNummer + ' (Sammelquittung)');
        buchungsVerweise.push(b.quelle + ' Zeile ' + b.zeile);
      }
    }
    
    Logger.log('Alle Buchungen markiert: ' + buchungsVerweise.join(', '));
    
    // Eintrag in Spendenquittungen-Tabelle (wie normale Quittung)
    quittungenSheet.appendRow([
      quittungsNummer,
      heute, // Ausstellungsdatum
      jahr,
      spenderName,
      gesamtsumme,
      'Sammelquittung (' + buchungen.length + ' Buchungen)',
      '', // E-Mail (nicht relevant bei Sammelquittung)
      'Gültig', // Status
      Utilities.formatDate(fruehstesDatum, Session.getScriptTimeZone(), 'dd.MM.yyyy') + ' - ' + 
      Utilities.formatDate(spaetestesDatum, Session.getScriptTimeZone(), 'dd.MM.yyyy'), // Bemerkung: Zeitraum
      pdfFile.getUrl() // PDF-Link
    ]);
    
    // Protokoll aktualisieren (mit detaillierten Infos)
    logQuittungToProtokoll({
      quittungsNummer: quittungsNummer,
      datum: heute,
      spender: spenderName,
      betrag: gesamtsumme,
      art: 'Sammelquittung (' + buchungen.length + ' Buchungen)',
      status: 'Gültig',
      pdfLink: pdfFile.getUrl(),
      bemerkung: 'Zeitraum: ' + Utilities.formatDate(fruehstesDatum, Session.getScriptTimeZone(), 'dd.MM.yyyy') + 
                 ' bis ' + Utilities.formatDate(spaetestesDatum, Session.getScriptTimeZone(), 'dd.MM.yyyy') + 
                 ' | Buchungen: ' + buchungsVerweise.join(', ')
    });
    
    return 'Sammelquittung ' + quittungsNummer + ' erfolgreich erstellt!\n\n' +
           '💰 Gesamtsumme: ' + gesamtsumme.toFixed(2).replace('.', ',') + ' €\n' +
           '📊 Anzahl Buchungen: ' + buchungen.length + '\n' +
           '📅 Zeitraum: ' + Utilities.formatDate(fruehstesDatum, Session.getScriptTimeZone(), 'dd.MM.yyyy') + 
           ' bis ' + Utilities.formatDate(spaetestesDatum, Session.getScriptTimeZone(), 'dd.MM.yyyy') + '\n\n' +
           '✅ PDF gespeichert in Google Drive';
    
  } catch (e) {
    Logger.log('Fehler beim Erstellen der Sammelquittung: ' + e.toString());
    throw e;
  }
}

/**
 * Generiert PDF für Sammelquittung
 * Ähnlich wie normale Quittung, aber mit Auflistung der Einzelzahlungen
 */
function generateSammelquittungPDF(receiptNumber, spenderAdresse, gesamtbetrag, buchungen, fruehstesDatum, spaetestesDatum, quittungsDatum) {
  Logger.log('=== Generiere Sammelquittung-PDF ===');
  Logger.log('Quittungsnummer: ' + receiptNumber);
  Logger.log('Gesamtbetrag: ' + gesamtbetrag);
  Logger.log('Anzahl Buchungen: ' + buchungen.length);
  
  // Prüfe ob alle Buchungen von derselben Art sind (Geld oder Sach)
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var alleSachspenden = true;
  var alleGeldspenden = true;
  
  for (var i = 0; i < buchungen.length; i++) {
    var quelle = buchungen[i].quelle;
    var zeile = buchungen[i].zeile;
    
    if (quelle === SHEET_BARGELD) {
      var sourceSheet = ss.getSheetByName(quelle);
      if (sourceSheet && zeile > 1 && zeile <= sourceSheet.getLastRow()) {
        var art = sourceSheet.getRange(zeile, 3).getValue(); // Spalte C: Art
        if (art === 'Sachspende') {
          alleGeldspenden = false;
        } else {
          alleSachspenden = false;
        }
      }
    } else {
      // Kontobewegungen sind immer Geldspenden
      alleSachspenden = false;
    }
  }
  
  var istReineSachspende = alleSachspenden && !alleGeldspenden;
  Logger.log('Reine Sachspenden: ' + istReineSachspende + ', Reine Geldspenden: ' + alleGeldspenden);
  
  // WICHTIG: Prüfe Gültigkeit des Feststellungsbescheids
  var gueltigBis = new Date(VEREIN_FESTSTELLUNGSBESCHEID_GUELTIG_BIS.split('.').reverse().join('-'));
  var heute = new Date();
  var tageVerbleibend = Math.ceil((gueltigBis - heute) / (1000 * 60 * 60 * 24));
  
  if (heute > gueltigBis) {
    throw new Error('⚠️ ACHTUNG: Der Feststellungsbescheid ist abgelaufen!\n\nGültig bis: ' + VEREIN_FESTSTELLUNGSBESCHEID_GUELTIG_BIS + '\n\nBitte beantragen Sie einen neuen Feststellungsbescheid beim Finanzamt, bevor Sie weitere Spendenbescheinigungen ausstellen.');
  }
  
  if (tageVerbleibend < 90) {
    Logger.log('⚠️ WARNUNG: Feststellungsbescheid läuft in ' + tageVerbleibend + ' Tagen ab! Bitte rechtzeitig neuen Bescheid beantragen.');
  }
  
  // Formatierungen
  var formattedBetrag = parseFloat(gesamtbetrag).toFixed(2).replace('.', ',') + ' €';
  var betragInWort = betragInWorten(gesamtbetrag);
  var formattedZeitraumVon = Utilities.formatDate(new Date(fruehstesDatum), Session.getScriptTimeZone(), 'dd.MM.yyyy');
  var formattedZeitraumBis = Utilities.formatDate(new Date(spaetestesDatum), Session.getScriptTimeZone(), 'dd.MM.yyyy');
  var formattedQuittungsDatum = Utilities.formatDate(new Date(quittungsDatum), Session.getScriptTimeZone(), 'dd.MM.yyyy');
  
  // Erstelle temporäres Google Docs-Dokument
  var tempDoc = DocumentApp.create('Temp_Sammelquittung_' + receiptNumber);
  var body = tempDoc.getBody();
  body.clear();
  
  // Setze Dokumenten-Formatierung
  body.setMarginTop(50);
  body.setMarginBottom(50);
  body.setMarginLeft(70);
  body.setMarginRight(70);
  
  // === HEADER MIT LOGO RECHTS UND AUSSTELLER LINKS (nebeneinander) ===
  var headerTable = body.appendTable();
  var headerRow = headerTable.appendTableRow();
  
  // Linke Spalte: Aussteller-Informationen + Titel + Bescheinigungsnummer
  var leftCell = headerRow.appendTableCell();
  leftCell.appendParagraph('Aussteller (Bezeichnung und Anschrift der steuerbegünstigten Einrichtung):')
    .setFontSize(8).setBold(false).setSpacingBefore(0).setSpacingAfter(3);
  leftCell.appendParagraph(VEREIN_NAME)
    .setFontSize(11).setBold(true).setSpacingAfter(2);
  leftCell.appendParagraph(VEREIN_STRASSE + ' ' + VEREIN_HAUSNUMMER + ', ' + VEREIN_PLZ + ' ' + VEREIN_ORT)
    .setFontSize(10).setBold(true).setSpacingAfter(8);
  
  // Trennlinie in der Zelle
  leftCell.appendParagraph('─────────────────────────────────────')
    .setFontSize(8).setSpacingAfter(8);
  
  // Titel in der linken Zelle (dynamisch je nach Art der Spenden)
  var titelSammel = istReineSachspende ? 'Sammelbestätigung über Sachzuwendungen' : 'Sammelbestätigung über Geldzuwendungen/Spenden';
  leftCell.appendParagraph(titelSammel)
    .setFontSize(12).setBold(true).setSpacingAfter(3);
  
  // Bescheinigungsnummer in der linken Zelle
  leftCell.appendParagraph('(Bescheinigung Nr. ' + receiptNumber + ')')
    .setFontSize(9).setSpacingAfter(0);
  
  leftCell.setWidth(350);
  leftCell.setPaddingTop(0).setPaddingBottom(5);
  
  // Rechte Spalte: Logo
  var rightCell = headerRow.appendTableCell();
  rightCell.setVerticalAlignment(DocumentApp.VerticalAlignment.CENTER);
  rightCell.setWidth(120);
  rightCell.setPaddingTop(0).setPaddingBottom(5);
  
  try {
    if (VEREIN_LOGO_DRIVE_ID && VEREIN_LOGO_DRIVE_ID.length > 0) {
      var logoFile = DriveApp.getFileById(VEREIN_LOGO_DRIVE_ID);
      var logoBlob = logoFile.getBlob();
      var logoPara = rightCell.appendParagraph('');
      var logoImg = logoPara.appendInlineImage(logoBlob);
      var originalWidth = logoImg.getWidth();
      var originalHeight = logoImg.getHeight();
      var aspectRatio = originalHeight / originalWidth;
      var targetWidth = 100;
      var targetHeight = targetWidth * aspectRatio;
      logoImg.setWidth(targetWidth);
      logoImg.setHeight(targetHeight);
      logoPara.setAlignment(DocumentApp.HorizontalAlignment.RIGHT);
      Logger.log('✅ Logo geladen');
    } else {
      rightCell.appendParagraph('').setFontSize(1);
    }
  } catch (e) {
    rightCell.appendParagraph('').setFontSize(1);
    Logger.log('⚠️ Logo konnte nicht geladen werden');
  }
  
  // Tabelle ohne Rahmen (unsichtbar)
  headerTable.setBorderWidth(0);
  headerTable.setAttributes({
    [DocumentApp.Attribute.SPACING_AFTER]: 15
  });
  
  // === RECHTLICHE GRUNDLAGE (wie amtliches Muster) ===
  body.appendParagraph('im Sinne des § 10b des Einkommensteuergesetzes an eine der in § 5 Abs. 1 Nr. 9 des Körperschaftsteuergesetzes bezeichneten Körperschaften, Personenvereinigungen oder Vermögensmassen')
    .setFontSize(8).setLineSpacing(1.15).setSpacingAfter(12);
  
  // === NAME UND ANSCHRIFT DES ZUWENDENDEN (gemäß amtlichem Muster) ===
  body.appendParagraph('Name und Anschrift des Zuwendenden:')
    .setFontSize(8).setBold(false).setSpacingAfter(3);
  
  var spenderAdresseText = (spenderAdresse.anrede ? spenderAdresse.anrede + ' ' : '') + 
                           spenderAdresse.vollstaendigerName + ', ' + 
                           spenderAdresse.strasse + ' ' + spenderAdresse.hausnummer + ', ' + 
                           spenderAdresse.plz + ' ' + spenderAdresse.ort;
  
  body.appendParagraph(spenderAdresseText)
    .setFontSize(10).setBold(true).setSpacingAfter(12);
  
  // === GESAMTBETRAG UND ZEITRAUM ===
  body.appendParagraph('Gesamtbetrag der Zuwendungen:')
    .setFontSize(8).setBold(false).setSpacingAfter(3);
  
  body.appendParagraph('- in Ziffern: ' + formattedBetrag)
    .setFontSize(10).setBold(true).setSpacingAfter(2);
  
  body.appendParagraph('- in Buchstaben: ' + betragInWort)
    .setFontSize(10).setSpacingAfter(8);
  
  body.appendParagraph('Zeitraum der Zuwendungen: ' + formattedZeitraumVon + ' bis ' + formattedZeitraumBis)
    .setFontSize(10).setSpacingAfter(12);
  
  // === AUFLISTUNG DER EINZELZAHLUNGEN ===
  body.appendParagraph('Zusammensetzung der Zuwendungen:')
    .setFontSize(8).setBold(true).setSpacingAfter(5);
  
  for (var i = 0; i < buchungen.length; i++) {
    var b = buchungen[i];
    var datumStr = Utilities.formatDate(new Date(b.datum), Session.getScriptTimeZone(), 'dd.MM.yyyy');
    var betragStr = b.betrag.toFixed(2).replace('.', ',') + ' €';
    body.appendParagraph('• ' + datumStr + ': ' + betragStr)
      .setFontSize(9).setSpacingAfter(2);
  }
  
  body.appendParagraph('').setSpacingAfter(8); // Leerzeile
  
  // === VERZICHT AUF ERSTATTUNG (gemäß amtlichem Muster) ===
  body.appendParagraph('Es handelt sich um den Verzicht auf Erstattung von Aufwendungen:    ☐ Ja    ☒ Nein')
    .setFontSize(9).setSpacingAfter(15);
  
  // === GEMEINNÜTZIGKEIT (gemäß amtlichem Muster) ===
  body.appendParagraph('Wir sind wegen Förderung (Angabe des begünstigten Zwecks / der begünstigten Zwecke):')
    .setFontSize(8).setBold(false).setSpacingAfter(3);
  
  body.appendParagraph(VEREIN_SATZUNGSZWECK)
    .setFontSize(9).setItalic(true).setSpacingAfter(8);
  
  body.appendParagraph('nach dem letzten uns zugegangenen Bescheid nach § 60a Abs. 1 AO über die gesonderte Feststellung der Einhaltung der satzungsmäßigen Voraussetzungen nach § 51, 59, 60 und 61 AO vom ' + VEREIN_FESTSTELLUNGSBESCHEID_DATUM + ' (Steuernummer ' + VEREIN_STEUERNUMMER + ') für die Satzung in der Fassung vom ' + VEREIN_SATZUNG_FASSUNG_VOM + ' als steuerbegünstigt anerkannt.')
    .setFontSize(8).setLineSpacing(1.15).setSpacingAfter(8);
  
  body.appendParagraph('Es wird bestätigt, dass die Zuwendung nur zur Förderung ' + VEREIN_SATZUNGSPARAGRAPHEN + ' verwendet wird.')
    .setFontSize(8).setLineSpacing(1.15).setSpacingAfter(15);
  
  // === TRENNLINIE ===
  body.appendParagraph('─────────────────────────────────────────────────────────────')
    .setFontSize(8).setAlignment(DocumentApp.HorizontalAlignment.CENTER).setSpacingAfter(15);
  
  // === ORT, DATUM, UNTERSCHRIFT (gemäß amtlichem Muster) ===
  body.appendParagraph(VEREIN_ORT + ', den ' + formattedQuittungsDatum)
    .setFontSize(9).setSpacingBefore(10).setSpacingAfter(15);
  
  // Unterschrift als Bild einfügen (falls vorhanden)
  try {
    if (UNTERZEICHNER_UNTERSCHRIFT_DRIVE_ID && UNTERZEICHNER_UNTERSCHRIFT_DRIVE_ID.length > 0) {
      var unterschriftFile = DriveApp.getFileById(UNTERZEICHNER_UNTERSCHRIFT_DRIVE_ID);
      var unterschriftBlob = unterschriftFile.getBlob();
      var unterschriftPara = body.appendParagraph('');
      var unterschriftImg = unterschriftPara.appendInlineImage(unterschriftBlob);
      var originalWidth = unterschriftImg.getWidth();
      var originalHeight = unterschriftImg.getHeight();
      var aspectRatio = originalWidth / originalHeight;
      var targetHeight = 80;
      var targetWidth = targetHeight * aspectRatio;
      unterschriftImg.setWidth(targetWidth);
      unterschriftImg.setHeight(targetHeight);
      unterschriftPara.setSpacingAfter(5);
      Logger.log('✅ Unterschrift geladen');
    } else {
      body.appendParagraph('_______________________________________')
        .setFontSize(9).setSpacingAfter(5);
    }
  } catch (e) {
    body.appendParagraph('_______________________________________')
      .setFontSize(9).setSpacingAfter(5);
    Logger.log('⚠️ Unterschrift konnte nicht geladen werden');
  }
  
  body.appendParagraph('Unterschrift des Zuwendungsempfängers')
    .setFontSize(7).setSpacingAfter(2);
  
  body.appendParagraph(UNTERZEICHNER_NAME + ', ' + UNTERZEICHNER_FUNKTION)
    .setFontSize(9).setSpacingAfter(20);
  
  // === HINWEISE (gemäß amtlichem Muster) ===
  body.appendParagraph('─────────────────────────────────────────────────────────────')
    .setFontSize(8).setAlignment(DocumentApp.HorizontalAlignment.CENTER).setSpacingAfter(6);
  
  body.appendParagraph('Hinweis:')
    .setFontSize(6).setBold(false).setSpacingAfter(2);
  
  body.appendParagraph('Wer vorsätzlich oder grob fahrlässig eine unrichtige Zuwendungsbestätigung erstellt oder wer veranlasst, dass Zuwendungen nicht zu den in der Zuwendungsbestätigung angegebenen steuerbegünstigten Zwecken verwendet werden, haftet für die entgangene Steuer (§ 10b Abs. 4 EStG, § 9 Abs. 3 KStG, § 9 Nr. 5 GewStG).')
    .setFontSize(5).setLineSpacing(1.1).setSpacingAfter(4);
  
  body.appendParagraph('Diese Bestätigung wird nicht als Nachweis für die steuerliche Berücksichtigung der Zuwendung anerkannt, wenn das Datum des Freistellungsbescheides länger als 5 Jahre bzw. das Datum der vorläufigen Bescheinigung länger als 3 Jahre seit Ausstellung der Bestätigung zurückliegt (§ 63 Abs. 5 AO).')
    .setFontSize(5).setLineSpacing(1.1).setSpacingAfter(0);
  
  // Speichere PDF und gib File-Objekt zurück (verwendet gemeinsame Hilfsfunktion)
  return savePDFToDrive(tempDoc, 'Sammelquittung_' + receiptNumber + '.pdf');
}
