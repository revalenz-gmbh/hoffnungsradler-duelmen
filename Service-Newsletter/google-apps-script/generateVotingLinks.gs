//==============================================================
// FUNKTION ZUM ERSTELLEN VON ABSTIMMUNGS-LINKS
//==============================================================

function generateVotingLinks() {
  const ui = SpreadsheetApp.getUi();
  const defaultUrl = getVotingUrl(); // Ruft die zentral gespeicherte URL ab
  
  const urlResult = ui.prompt(
    'URL der Abstimmungsseite',
    'Bitte geben Sie die vollständige URL zur Abstimmungs-Seite ein.\n\nGespeicherter Standardwert:\n' + defaultUrl,
    ui.ButtonSet.OK_CANCEL
  );

  if (urlResult.getSelectedButton() !== ui.Button.OK || !urlResult.getResponseText()) return;
  
  const baseUrl = urlResult.getResponseText().trim();
  if (!baseUrl.startsWith('http')) {
    ui.alert('Ungültige URL. Bitte mit https:// beginnen.');
    return;
  }
  
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sourceSheet = ss.getSheetByName('Newsletter-Abonnenten');
  if (!sourceSheet) {
    ui.alert('Fehler', 'Das Blatt "Newsletter-Abonnenten" wurde nicht gefunden.', ui.ButtonSet.OK);
    return;
  }
  
  const data = sourceSheet.getDataRange().getValues();
  const headers = data[0];
  
  const emailIndex = headers.indexOf('Email');
  const subscriberIdIndex = headers.indexOf('SubscriberID');

  if (emailIndex === -1 || subscriberIdIndex === -1) {
    ui.alert('Fehler', 'Benötigte Spalten "Email" oder "SubscriberID" im Blatt "Newsletter-Abonnenten" nicht gefunden.', ui.ButtonSet.OK);
    return;
  }
  

  let targetSheet = ss.getSheetByName('Abstimmungs-Links');
  if (targetSheet) {
    targetSheet.clear();
  } else {
    targetSheet = ss.insertSheet('Abstimmungs-Links');
  }

  targetSheet.getRange(1, 1, 1, 2).setValues([['Email', 'Persönlicher Abstimmungs-Link']]).setFontWeight('bold');
  
  const linksData = [];
  // Starte bei 1, um Header zu überspringen
  for (let i = 1; i < data.length; i++) { 
    const row = data[i];
    if(row[emailIndex] && row[subscriberIdIndex]){
      const link = `${baseUrl}?id=${row[subscriberIdIndex]}`;
      linksData.push([row[emailIndex], link]);
    }
  }

  if (linksData.length > 0) {
    targetSheet.getRange(2, 1, linksData.length, 2).setValues(linksData);
    targetSheet.autoResizeColumns(1, 2);
  }
  
  ss.setActiveSheet(targetSheet);
  ui.alert('Erfolg!', `${linksData.length} personalisierte Links wurden im Blatt "Abstimmungs-Links" erstellt.`, ui.ButtonSet.OK);
} 