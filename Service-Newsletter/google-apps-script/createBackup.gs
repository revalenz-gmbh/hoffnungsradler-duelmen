function createBackup() {
  var sourceSpreadsheetId = '1O-w996WxWUXA0Q4Pbc9L6_aGdw9-fCxyW_BI4Uyb1_8';
  var backupFolderName = 'Automatische Backups';
  var date = new Date();
  var formattedDate = Utilities.formatDate(date, Session.getScriptTimeZone(), 'yyyy-MM-dd_HH-mm');
  
  var sourceSpreadsheet = SpreadsheetApp.openById(sourceSpreadsheetId);
  var backupName = 'Backup_' + sourceSpreadsheet.getName() + '_' + formattedDate;
  
  var backupFolder = findOrCreateFolder(backupFolderName);
  var file = DriveApp.getFileById(sourceSpreadsheetId);
  var backup = file.makeCopy(backupName, backupFolder);
  
  Logger.log('Backup erstellt: ' + backup.getUrl());
}

function findOrCreateFolder(folderName) {
  var folders = DriveApp.getFoldersByName(folderName);
  
  if (folders.hasNext()) {
    return folders.next();
  } else {
    return DriveApp.createFolder(folderName);
  }
}

// Trigger für tägliche Sicherung einrichten
function setupTrigger() {
  ScriptApp.newTrigger('createBackup')
    .timeBased()
    .everyDays(1)
    .atHour(2)
    .create();
}