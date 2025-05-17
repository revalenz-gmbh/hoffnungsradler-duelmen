function createNewsletterSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Erstellen eines Eingabe-Blattes für die Newsletter-Daten
  let inputSheet = ss.getSheetByName('Newsletter_aktuell');
  if (!inputSheet) {
    inputSheet = ss.insertSheet('Newsletter_aktuell');
    
    // [Alle Formatierungen wie zuvor...]
    
    // Statt der formatierten Zelle, fügen wir eine Anleitung hinzu
    inputSheet.getRange('A7:B7').merge().setValue("Fülle alle Felder aus und klicke dann auf 'Erweiterungen > Newsletter > Newsletter versenden'.");
  }
  
  Browser.msgBox("Newsletter erstellen", 
      "Bitte trage alle Tour-Details im Blatt 'Newsletter_aktuell' ein.\n\n" +
      "Wenn du den Newsletter versenden möchtest, klicke auf 'Erweiterungen > Newsletter > Newsletter versenden'.\n\n" +
      "Um frühere Newsletter zu archivieren, kannst du vor dem Senden das Blatt duplizieren und umbenennen.", 
      Browser.Buttons.OK);
}