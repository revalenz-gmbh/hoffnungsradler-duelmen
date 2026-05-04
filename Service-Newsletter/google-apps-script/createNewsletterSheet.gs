function createNewsletterSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Erstellen eines Eingabe-Blattes für die Newsletter-Daten
  let inputSheet = ss.getSheetByName('Newsletter_aktuell');
  if (!inputSheet) {
    inputSheet = ss.insertSheet('Newsletter_aktuell');
    
    // Formatieren des Eingabeblattes
    inputSheet.setColumnWidth(1, 150);
    inputSheet.setColumnWidth(2, 600);
    // Überschriften
    inputSheet.getRange('A1').setValue("TOUR-NEWSLETTER").setFontWeight('bold');
    inputSheet.getRange('A1:B1').merge().setBackground('#f3f3f3').setHorizontalAlignment('center');
    inputSheet.getRange('A2').setValue("Tour-Titel:").setFontWeight('bold');
    inputSheet.getRange('A3').setValue('Beschreibung:').setFontWeight('bold');
    inputSheet.getRange('B3').setValue('').setWrap(true);
    inputSheet.setRowHeight(3, 200);
    inputSheet.getRange('A4').setValue('Datum und Uhrzeit:').setFontWeight('bold');
    inputSheet.getRange('B4').setValue('');
    inputSheet.getRange('A5').setValue('Treffpunkt:').setFontWeight('bold');
    inputSheet.getRange('B5').setValue('');
    // Anweisung und Menü-Hinweis
    inputSheet.getRange('A7:B7').merge().setValue("Fülle alle Felder aus (B2–B5) und wähle dann im Menü „Newsletter“ → „NEWSLETTER AN ALLE SENDEN“.");
    // Statistik-Bereich
    inputSheet.getRange('A10').setValue("STATISTIK").setFontWeight('bold');
    inputSheet.getRange('A10:B10').merge().setBackground('#f3f3f3').setHorizontalAlignment('center');
    inputSheet.getRange('A11').setValue("Versanddatum:").setFontWeight('bold');
    inputSheet.getRange('A12').setValue("Anzahl Empfänger:").setFontWeight('bold');
    inputSheet.getRange('A13').setValue("Status:").setFontWeight('bold');
    // Zähler für Newsletter-ID
    inputSheet.getRange('A15').setValue("Newsletter-ID:").setFontWeight('bold');
    inputSheet.getRange('B15').setValue(1);
  }
  
  Browser.msgBox("Newsletter erstellen", 
      "Bitte trage alle Tour-Details im Blatt 'Newsletter_aktuell' ein.\n\n" +
      "Wenn du den Newsletter versenden möchtest, klicke auf 'Erweiterungen > Newsletter > Newsletter versenden'.\n\n" +
      "Um frühere Newsletter zu archivieren, kannst du vor dem Senden das Blatt duplizieren und umbenennen.", 
      Browser.Buttons.OK);
}

/**
 * Archiviert das aktuelle Newsletter-Blatt mit einem Zeitstempel
 */
function archiveCurrentNewsletterSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const currentSheet = ss.getSheetByName('Newsletter_aktuell');
  
  if (!currentSheet) {
    Browser.msgBox("Fehler", "Das Blatt 'Newsletter_aktuell' wurde nicht gefunden.", Browser.Buttons.OK);
    return;
  }
  
  // Prüfe, ob das Blatt Daten enthält
  const tourTitle = currentSheet.getRange('B2').getValue();
  const tourDescription = currentSheet.getRange('B3').getValue();
  
  if (!tourTitle && !tourDescription) {
    const ui = SpreadsheetApp.getUi();
    const response = ui.alert(
      'Leeres Blatt',
      'Das Newsletter-Blatt scheint leer zu sein. Möchtest du es trotzdem archivieren?',
      ui.ButtonSet.YES_NO
    );
    
    if (response !== ui.Button.YES) {
      return;
    }
  }
  
  // Erstelle Archiv-Namen mit Zeitstempel
  const now = new Date();
  const timestamp = Utilities.formatDate(now, Session.getScriptTimeZone(), 'yyyy-MM-dd_HH-mm');
  
  // Verwende den Tour-Titel für den Archiv-Namen, wenn verfügbar
  let archiveName = `Newsletter_${timestamp}`;
  if (tourTitle) {
    // Bereinige den Titel für den Dateinamen
    const cleanTitle = tourTitle.toString().replace(/[^a-zA-Z0-9äöüÄÖÜß\s]/g, '').substring(0, 30);
    archiveName = `Newsletter_${cleanTitle}_${timestamp}`;
  }
  
  // Prüfe, ob der Name bereits existiert
  let finalName = archiveName;
  let counter = 1;
  while (ss.getSheetByName(finalName)) {
    finalName = `${archiveName}_${counter}`;
    counter++;
  }
  
  try {
    // Dupliziere das Blatt
    const archivedSheet = currentSheet.copyTo(ss);
    archivedSheet.setName(finalName);
    
    // Setze das archivierte Blatt als schreibgeschützt
    archivedSheet.protect().setDescription('Archivierter Newsletter - nicht bearbeiten');
    
    // Leere das aktuelle Blatt für den nächsten Newsletter
    currentSheet.getRange('B2').setValue(''); // Tour-Titel
    currentSheet.getRange('B3').setValue(''); // Beschreibung
    currentSheet.getRange('B11').setValue(''); // Versanddatum
    currentSheet.getRange('B12').setValue(''); // Anzahl Empfänger
    currentSheet.getRange('B13').setValue(''); // Status
    
    // Erhöhe die Newsletter-ID für den nächsten Newsletter
    const currentId = currentSheet.getRange('B15').getValue() || 1;
    currentSheet.getRange('B15').setValue(currentId + 1);
    
    Browser.msgBox(
      "Newsletter archiviert", 
      `Der Newsletter wurde erfolgreich archiviert als: "${finalName}"\n\n` +
      `Das aktuelle Newsletter-Blatt wurde geleert und ist bereit für den nächsten Newsletter.\n\n` +
      `Newsletter-ID wurde auf ${currentId + 1} erhöht.`,
      Browser.Buttons.OK
    );
    
  } catch (error) {
    Logger.log("Fehler beim Archivieren: " + error.message);
    Browser.msgBox(
      "Fehler beim Archivieren",
      `Es ist ein Fehler aufgetreten: ${error.message}`,
      Browser.Buttons.OK
    );
  }
}