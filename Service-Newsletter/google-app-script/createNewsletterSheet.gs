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
    inputSheet.getRange('A3').setValue("Beschreibung (inkl. Datum, Uhrzeit, Treffpunkt etc.):").setFontWeight('bold');
    inputSheet.getRange('B3').setValue("").setWrap(true);
    inputSheet.setRowHeight(3, 200);  // Höhe für Beschreibung
    // Anweisung und Menü-Hinweis
    inputSheet.getRange('A7:B7').merge().setValue("Fülle alle Felder aus und klicke dann auf 'Erweiterungen > Newsletter > Newsletter versenden'.");
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