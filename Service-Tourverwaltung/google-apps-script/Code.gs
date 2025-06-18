// Diese Funktion wird beim Öffnen des Spreadsheets aufgerufen
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Tourverwaltung')
    .addItem('Touren-Verzeichnis konfigurieren', 'configureToursDirectory')
    .addItem('Touren aktualisieren', 'updateTours')
    .addSeparator()
    .addItem('Alle Distanzen neu berechnen', 'recalculateAllDistances')
    .addItem('Einzelne Tour neu berechnen', 'recalculateSingleTour')
    .addSeparator()
    .addItem('Neue Abstimmung einrichten', 'setupVoting')
    .addItem('Google Forms für Abstimmung erstellen', 'createVotingFormInTourManagement')
    .addSeparator()
    .addItem('Neues Planungs-Sheet erstellen', 'menuCreateTourPlanningSheet')
    .addSeparator()
    .addItem('Tabellenblätter initialisieren', 'initializeSheets')
    .addToUi();
    
  // Stelle sicher, dass das Einstellungen-Blatt existiert
  ensureSettingsSheet();
}

// Hilfsfunktion zum Erstellen des Einstellungen-Blatts
function ensureSettingsSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let settingsSheet = ss.getSheetByName('Einstellungen');
  
  if (!settingsSheet) {
    // Erstelle das Einstellungen-Blatt
    settingsSheet = ss.insertSheet('Einstellungen');
    
    // Füge die Standardeinstellungen hinzu
    settingsSheet.getRange('A1:B1').setValues([['Einstellung', 'Wert']]);
    settingsSheet.getRange('A2:B2').setValues([['Touren-Verzeichnis-URL', '']]);
    
    // Formatiere die Überschriften
    settingsSheet.getRange('A1:B1').setFontWeight('bold');
    settingsSheet.getRange('A:B').setWrap(true);
    
    // Setze die Spaltenbreite
    settingsSheet.setColumnWidth(1, 200);
    settingsSheet.setColumnWidth(2, 400);
  }
}

// Hilfsfunktion zum Erstellen der Tabellenblätter
function initializeSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();
  
  // Prüfe, ob bereits Daten existieren
  const existingSheets = ss.getSheets();
  if (existingSheets.length > 1) { // Mehr als nur das Einstellungen-Blatt
    const response = ui.alert(
      'Warnung',
      'Es existieren bereits Tabellenblätter. Möchtest du sie wirklich neu initialisieren?\n\n' +
      'ACHTUNG: Alle vorhandenen Daten werden gelöscht!',
      ui.ButtonSet.YES_NO
    );
    
    if (response !== ui.Button.YES) {
      return;
    }
  }
  
  // Lösche alle vorhandenen Blätter außer "Einstellungen"
  existingSheets.forEach(sheet => {
    if (sheet.getName() !== 'Einstellungen') {
      ss.deleteSheet(sheet);
    }
  });
  
  // Erstelle das Blatt "Tour Daten"
  const toursSheet = ss.insertSheet('Tour Daten');
  const toursHeaders = [
    'Name',
    'Jahr',
    'Distanz',
    'Höhenmeter',
    'Start',
    'Ende',
    'Fahrradtyp',
    'Schwierigkeit',
    'Beschreibung',
    'GPX-URL',
    'Map-URL',
    'Komoot-URL',
    'Letzte Aktualisierung',
    'Update nötig',
    'Letzte Verarbeitung',
    'Verarbeitungsstatus'
  ];
  toursSheet.getRange(1, 1, 1, toursHeaders.length).setValues([toursHeaders]);
  toursSheet.getRange(1, 1, 1, toursHeaders.length).setFontWeight('bold');
  toursSheet.setFrozenRows(1);
  
  // Formatiere die Spalten
  toursSheet.setColumnWidth(1, 200);  // Name
  toursSheet.setColumnWidth(2, 80);   // Jahr
  toursSheet.setColumnWidth(3, 100);  // Distanz
  toursSheet.setColumnWidth(4, 100);  // Höhenmeter
  toursSheet.setColumnWidth(5, 150);  // Start
  toursSheet.setColumnWidth(6, 150);  // Ende
  toursSheet.setColumnWidth(7, 120);  // Fahrradtyp
  toursSheet.setColumnWidth(8, 120);  // Schwierigkeit
  toursSheet.setColumnWidth(9, 300);  // Beschreibung
  toursSheet.setColumnWidth(10, 300); // GPX-URL
  toursSheet.setColumnWidth(11, 300); // Map-URL
  toursSheet.setColumnWidth(12, 300); // Komoot-URL
  toursSheet.setColumnWidth(13, 150); // Letzte Aktualisierung
  toursSheet.setColumnWidth(14, 100); // Update nötig
  toursSheet.setColumnWidth(15, 150); // Letzte Verarbeitung
  toursSheet.setColumnWidth(16, 200); // Verarbeitungsstatus
  
  // Erstelle das Blatt "Abstimmung"
  const votingSheet = ss.insertSheet('Abstimmung');
  const votingHeaders = [
    'Tour',
    'Stimmen',
    'Kommentare'
  ];
  votingSheet.getRange(1, 1, 1, votingHeaders.length).setValues([votingHeaders]);
  votingSheet.getRange(1, 1, 1, votingHeaders.length).setFontWeight('bold');
  votingSheet.setFrozenRows(1);
  
  // Formatiere die Spalten
  votingSheet.setColumnWidth(1, 200);  // Tour
  votingSheet.setColumnWidth(2, 100);  // Stimmen
  votingSheet.setColumnWidth(3, 300);  // Kommentare
  
  // Erstelle das Blatt "Ergebnisse"
  const resultsSheet = ss.insertSheet('Ergebnisse');
  const resultsHeaders = [
    'Tour',
    'Stimmen',
    'Kommentare',
    'Distanz',
    'Höhenmeter',
    'Schwierigkeit',
    'Fahrradtyp',
    'Letzte Verarbeitung',
    'Verarbeitungsstatus'
  ];
  resultsSheet.getRange(1, 1, 1, resultsHeaders.length).setValues([resultsHeaders]);
  resultsSheet.getRange(1, 1, 1, resultsHeaders.length).setFontWeight('bold');
  resultsSheet.setFrozenRows(1);
  
  // Formatiere die Spalten
  resultsSheet.setColumnWidth(1, 200);  // Tour
  resultsSheet.setColumnWidth(2, 100);  // Stimmen
  resultsSheet.setColumnWidth(3, 300);  // Kommentare
  resultsSheet.setColumnWidth(4, 100);  // Distanz
  resultsSheet.setColumnWidth(5, 100);  // Höhenmeter
  resultsSheet.setColumnWidth(6, 120);  // Schwierigkeit
  resultsSheet.setColumnWidth(7, 120);  // Fahrradtyp
  resultsSheet.setColumnWidth(8, 150);  // Letzte Verarbeitung
  resultsSheet.setColumnWidth(9, 200);  // Verarbeitungsstatus
  
  // Erstelle oder aktualisiere das Einstellungen-Blatt
  let settingsSheet = ss.getSheetByName('Einstellungen');
  if (!settingsSheet) {
    settingsSheet = ss.insertSheet('Einstellungen');
  }
  
  // Setze die Einstellungen-Header
  const settingsHeaders = [
    ['Einstellung', 'Wert', 'Letzte Aktualisierung'],
    ['Touren-Verzeichnis-URL', '', ''],
    ['Letzter Verarbeitungsstatus', '', '']
  ];
  
  settingsSheet.getRange(1, 1, settingsHeaders.length, 3).setValues(settingsHeaders);
  settingsSheet.getRange(1, 1, 1, 3).setFontWeight('bold');
  settingsSheet.setFrozenRows(1);
  
  // Formatiere die Spalten
  settingsSheet.setColumnWidth(1, 200);  // Einstellung
  settingsSheet.setColumnWidth(2, 400);  // Wert
  settingsSheet.setColumnWidth(3, 150);  // Letzte Aktualisierung
  
  // Aktiviere die Blattreihenfolge
  ss.setActiveSheet(toursSheet);
  
  ui.alert(
    'Erfolg',
    'Die Tabellenblätter wurden erfolgreich initialisiert:\n\n' +
    '- Tour Daten\n' +
    '- Abstimmung\n' +
    '- Ergebnisse\n' +
    '- Einstellungen\n\n' +
    'Bitte tragen Sie die Touren-Verzeichnis-URL im Einstellungen-Blatt ein.',
    ui.ButtonSet.OK
  );
}

// Hilfsfunktion zum Konfigurieren des Touren-Verzeichnisses
function configureToursDirectory() {
  const ui = SpreadsheetApp.getUi();
  const result = ui.prompt(
    'Touren-Verzeichnis konfigurieren',
    'Bitte geben Sie die URL des Google Drive-Verzeichnisses ein, das Ihre GPX-Dateien enthält:',
    ui.ButtonSet.OK_CANCEL
  );

  if (result.getSelectedButton() === ui.Button.OK) {
    const url = result.getResponseText();
    if (url) {
      try {
        const settingsSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Einstellungen');
        if (!settingsSheet) {
          throw new Error('Das Blatt "Einstellungen" wurde nicht gefunden. Bitte initialisiere die Tabellen neu.');
        }
        
        // Finde die richtige Zeile und aktualisiere die URL
        const data = settingsSheet.getDataRange().getValues();
        let urlRowIndex = -1;
        for (let i = 0; i < data.length; i++) {
          if (data[i][0] === 'Touren-Verzeichnis-URL') {
            urlRowIndex = i;
            break;
          }
        }

        if (urlRowIndex !== -1) {
          settingsSheet.getRange(urlRowIndex + 1, 2).setValue(url);
          settingsSheet.getRange(urlRowIndex + 1, 3).setValue(new Date().toISOString());
          ui.alert('Erfolg', 'Das Touren-Verzeichnis wurde erfolgreich konfiguriert.', ui.ButtonSet.OK);
        } else {
          throw new Error('Die Einstellungszeile "Touren-Verzeichnis-URL" konnte nicht gefunden werden.');
        }

      } catch (error) {
        Logger.log('Fehler beim Konfigurieren des Verzeichnisses: ' + error.toString());
        ui.alert('Fehler', 'Das Verzeichnis konnte nicht konfiguriert werden. ' + error.message, ui.ButtonSet.OK);
      }
    }
  }
}

// Hilfsfunktion zum Umwandeln einer Google Drive URL in eine direkte Download-URL
function getDirectDownloadUrl(fileUrl) {
  try {
    // Extrahiere die Datei-ID aus der URL
    const fileId = fileUrl.match(/\/d\/([^\/]+)/)?.[1];
    if (!fileId) {
      throw new Error('Konnte keine Datei-ID aus der URL extrahieren');
    }
    
    // Hole die Datei
    const file = DriveApp.getFileById(fileId);
    
    // Erstelle eine direkte Download-URL
    return file.getDownloadUrl();
  } catch (error) {
    Logger.log('Fehler beim Umwandeln der URL: ' + error.toString());
    throw error;
  }
}

// Hilfsfunktion zum Berechnen der Distanz und Höhenmeter aus GPX
function calculateGpxDistance(gpxContent) {
  try {
    // Extrahiere alle Trackpoints
    const trackpoints = [];
    
    // Versuche verschiedene Regex-Muster für Trackpoints
    const patterns = [
      /<trkpt[^>]*lat="([^"]*)"[^>]*lon="([^"]*)"[^>]*>(?:[\s\S]*?<ele>([^<]*)<\/ele>)?/g,
      /<trkpt[^>]*lon="([^"]*)"[^>]*lat="([^"]*)"[^>]*>(?:[\s\S]*?<ele>([^<]*)<\/ele>)?/g,
      /<trkpt[^>]*lat='([^']*)'[^>]*lon='([^']*)'[^>]*>(?:[\s\S]*?<ele>([^<]*)<\/ele>)?/g,
      /<trkpt[^>]*lon='([^']*)'[^>]*lat='([^']*)'[^>]*>(?:[\s\S]*?<ele>([^<]*)<\/ele>)?/g
    ];
    
    let match;
    let hasElevationData = false;
    for (const pattern of patterns) {
      while ((match = pattern.exec(gpxContent)) !== null) {
        const lat = parseFloat(match[1]);
        const lon = parseFloat(match[2]);
        const ele = match[3] ? parseFloat(match[3]) : null;
        
        if (ele !== null) {
          hasElevationData = true;
        }

        if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
          Logger.log('Ungültige Koordinaten gefunden: lat=' + lat + ', lon=' + lon);
          continue;
        }
        
        trackpoints.push({ lat, lon, ele });
      }
      
      if (trackpoints.length > 0) break;
    }
    
    if (!hasElevationData) {
      Logger.log('Warnung: Keine Höhenpunkte (<ele>) in der GPX-Datei gefunden.');
    }
    
    Logger.log('Gefundene Trackpoints: ' + trackpoints.length);
    
    if (trackpoints.length < 2) {
      throw new Error('Zu wenige Trackpoints in der GPX-Datei (' + trackpoints.length + ' gefunden)');
    }
    
    // Berechne die Gesamtdistanz und Höhenmeter
    let totalDistance = 0;
    
    for (let i = 1; i < trackpoints.length; i++) {
      const prev = trackpoints[i - 1];
      const curr = trackpoints[i];
      
      const distance = calculateDistance(prev.lat, prev.lon, curr.lat, curr.lon);
      totalDistance += distance;
    }
    
    // Prüfe, ob die berechnete Distanz sinnvoll ist
    if (totalDistance <= 0 || totalDistance > 1500) { // Maximal 1500 km
      throw new Error('Ungültige Distanz berechnet: ' + totalDistance + ' km');
    }
    
    // Runde auf eine Nachkommastelle
    const roundedDistance = Math.round(totalDistance * 10) / 10;
    
    // Berechne Höhenmeter nur, wenn Daten vorhanden sind
    let roundedAscent = 0;
    let roundedDescent = 0;

    if (hasElevationData) {
        let totalAscent = 0;
        let totalDescent = 0;
        let lastEle = null;
        for (const pt of trackpoints) {
            if (pt.ele !== null) {
                lastEle = pt.ele;
                break;
            }
        }

        for (let i = 1; i < trackpoints.length; i++) {
            const curr = trackpoints[i];
            if (curr.ele !== null && lastEle !== null) {
                const eleDiff = curr.ele - lastEle;
                if (eleDiff > 0) {
                    totalAscent += eleDiff;
                } else {
                    totalDescent += Math.abs(eleDiff);
                }
                lastEle = curr.ele;
            }
        }
        roundedAscent = Math.round(totalAscent);
        roundedDescent = Math.round(totalDescent);
    }
    
    Logger.log('Berechnete Distanz: ' + roundedDistance + ' km');
    Logger.log('Berechnete Höhenmeter: ' + (hasElevationData ? (roundedAscent + ' m Aufstieg, ' + roundedDescent + ' m Abstieg') : 'N/A'));
    
    return {
      distance: roundedDistance,
      ascent: hasElevationData ? roundedAscent : 'N/A',
      descent: hasElevationData ? roundedDescent : 'N/A',
      hasElevation: hasElevationData
    };
  } catch (error) {
    Logger.log('Fehler beim Berechnen der Distanz: ' + error.toString());
    throw error;
  }
}

// Hilfsfunktion zum Berechnen der Distanz zwischen zwei Koordinaten (Haversine-Formel)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Erdradius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  return distance;
}

// Hilfsfunktion zum Umrechnen von Grad in Radiant
function toRad(degrees) {
  return degrees * (Math.PI / 180);
}

// Hilfsfunktion zum Abrufen der Tourendaten
function getToursData(sheet) {
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  return data.slice(1).map(row => {
    const tour = {};
    headers.forEach((header, index) => {
      tour[header] = row[index];
    });
    return tour;
  });
}

// Hilfsfunktion zum Analysieren der zu verarbeitenden Touren
function analyzeToursToProcess(sheet) {
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const nameIndex = headers.indexOf('Name');
  const gpxUrlIndex = headers.indexOf('GPX-URL');
  const lastModifiedIndex = headers.indexOf('Letzte Aktualisierung');
  const distanceIndex = headers.indexOf('Distanz');
  const elevationIndex = headers.indexOf('Höhenmeter');
  const lastProcessedIndex = headers.indexOf('Letzte Verarbeitung');

  if ([nameIndex, gpxUrlIndex, lastModifiedIndex, distanceIndex, elevationIndex, lastProcessedIndex].includes(-1)) {
    throw new Error('Erforderliche Spalten nicht gefunden. Bitte initialisiere die Tabellen neu.');
  }

  const toursToProcess = [];
  const toursToSkip = [];

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const name = row[nameIndex];
    const gpxUrl = row[gpxUrlIndex];
    const distance = row[distanceIndex];
    const elevation = row[elevationIndex];
    
    // Rohdaten aus der Tabelle lesen
    const fileLastModifiedValue = row[lastModifiedIndex];
    const lastProcessedValue = row[lastProcessedIndex];

    if (!name || !gpxUrl) {
      continue;
    }

    // Datums-Objekte erstellen und validieren
    const fileLastModified = fileLastModifiedValue ? new Date(fileLastModifiedValue) : null;
    const lastProcessedTime = lastProcessedValue ? new Date(lastProcessedValue) : null;
    const isProcessedDateValid = lastProcessedTime && !isNaN(lastProcessedTime.getTime());

    let needsProcessing = false;
    let reason = '';

    if (!isProcessedDateValid) {
      needsProcessing = true;
      reason = 'Neue Tour (noch nie verarbeitet)';
    } else if (fileLastModified && fileLastModified.getTime() > lastProcessedTime.getTime()) {
      needsProcessing = true;
      reason = 'GPX-Datei wurde aktualisiert';
    } else if (!distance || !elevation || distance.toString().toLowerCase().includes('fehler')) {
      needsProcessing = true;
      reason = 'Distanz/Höhenmeter fehlen oder sind fehlerhaft';
    }
    
    const tour = {
      index: i,
      name: name,
      lastModified: fileLastModified,
      gpxUrl: gpxUrl
    };
    
    if (needsProcessing) {
      tour.reason = reason;
      toursToProcess.push(tour);
    } else {
      toursToSkip.push(tour);
    }
  }

  return {
    totalTours: data.length - 1,
    toursToProcess: toursToProcess,
    toursToSkip: toursToSkip
  };
}

// Hilfsfunktion zum Berechnen der Distanzen
function calculateDistances(sheet) {
  // Hole die Header-Zeile
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const distanceIndex = headers.indexOf('Distanz');
  const elevationIndex = headers.indexOf('Höhenmeter');
  const lastProcessedIndex = headers.indexOf('Letzte Verarbeitung');
  const statusIndex = headers.indexOf('Verarbeitungsstatus');
  
  // Analysiere zuerst die zu verarbeitenden Touren
  const analysis = analyzeToursToProcess(sheet);
  
  // Zeige Analyse-Ergebnisse
  const ui = SpreadsheetApp.getUi();
  let message = 'Analyse der Touren:\n\n';
  message += 'Gesamtanzahl Touren: ' + analysis.totalTours + '\n';
  message += 'Zu verarbeitende Touren: ' + analysis.toursToProcess.length + '\n';
  message += 'Übersprungene Touren: ' + analysis.toursToSkip.length + '\n\n';
  
  if (analysis.toursToProcess.length > 0) {
    message += 'Zu verarbeitende Touren:\n';
    analysis.toursToProcess.slice(0, 15).forEach(tour => { // Zeige nur die ersten 15
      message += '- ' + tour.name + ' (' + tour.reason + ')\n';
    });
    if (analysis.toursToProcess.length > 15) {
      message += '... und ' + (analysis.toursToProcess.length - 15) + ' weitere.\n';
    }
  } else {
    message += 'Alle Touren sind auf dem neuesten Stand.';
  }
  
  const response = ui.alert(
    'Touren-Analyse',
    message + '\nMöchten Sie mit der Verarbeitung fortfahren?',
    ui.ButtonSet.YES_NO
  );
  
  if (response !== ui.Button.YES) {
    return;
  }
  
  // Verarbeite nur die Touren, die verarbeitet werden müssen
  const toursToProcess = analysis.toursToProcess;
  let processedCount = 0;
  let errorCount = 0;
  
  const startTime = new Date();
  
  for (const tour of toursToProcess) {
    // Prüfe auf Timeout (5 Minuten)
    if (new Date() - startTime > 5 * 60 * 1000) {
      ui.alert('Timeout', 'Die Verarbeitung wurde wegen Zeitüberschreitung gestoppt. Bitte starte sie erneut, um fortzufahren.', ui.ButtonSet.OK);
      break;
    }

    const rowIndex = tour.index;
    try {
      Logger.log('Verarbeite Tour: ' + tour.name);
      
      const directUrl = getDirectDownloadUrl(tour.gpxUrl);
      const response = UrlFetchApp.fetch(directUrl, { muteHttpExceptions: true, followRedirects: true });
      
      if (response.getResponseCode() !== 200) {
        throw new Error('HTTP-Fehler: ' + response.getResponseCode());
      }
      
      const gpxContent = response.getContentText();
      const result = calculateGpxDistance(gpxContent);
      
      sheet.getRange(rowIndex + 1, distanceIndex + 1).setValue(result.distance + ' km');
      
      if (result.hasElevation) {
        sheet.getRange(rowIndex + 1, elevationIndex + 1).setValue(result.ascent + ' m ↑, ' + result.descent + ' m ↓');
      } else {
        sheet.getRange(rowIndex + 1, elevationIndex + 1).setValue('N/A');
      }

      sheet.getRange(rowIndex + 1, lastProcessedIndex + 1).setValue(new Date());
      sheet.getRange(rowIndex + 1, statusIndex + 1).setValue('Erfolgreich verarbeitet');
      
      processedCount++;
      Logger.log('Tour erfolgreich verarbeitet: ' + tour.name);
      
    } catch (error) {
      Logger.log('Fehler bei Tour ' + tour.name + ': ' + error.toString());
      sheet.getRange(rowIndex + 1, distanceIndex + 1).setValue('Fehler');
      sheet.getRange(rowIndex + 1, elevationIndex + 1).setValue('Fehler');
      sheet.getRange(rowIndex + 1, lastProcessedIndex + 1).setValue(new Date());
      sheet.getRange(rowIndex + 1, statusIndex + 1).setValue('Fehler: ' + error.message.substring(0, 100));
      errorCount++;
    }
  }
  
  // Zeige Zusammenfassung
  let summary = 'Die Distanzen und Höhenmeter wurden berechnet!\n\n';
  summary += 'Verarbeitete Touren: ' + processedCount + ' von ' + toursToProcess.length + '\n';
  if (errorCount > 0) {
    summary += '\nBei ' + errorCount + ' Tour(en) trat ein Fehler auf.\n';
  }
  
  ui.alert('Berechnung abgeschlossen', summary, ui.ButtonSet.OK);
}

// Funktion zum Neuberechnen ALLER Distanzen
function recalculateAllDistances() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Tour Daten');
    
    if (!sheet) {
      throw new Error('Das Blatt "Tour Daten" wurde nicht gefunden. Bitte initialisiere die Tabellen neu.');
    }
    
    const ui = SpreadsheetApp.getUi();
    const response = ui.alert(
      'Alle Distanzen neu berechnen',
      'Möchten Sie wirklich die Distanzen und Höhenmeter für ALLE Touren neu berechnen?\n\n' +
      'Dies ignoriert den letzten Verarbeitungsstatus und kann einige Zeit in Anspruch nehmen.',
      ui.ButtonSet.YES_NO
    );
    
    if (response !== ui.Button.YES) {
      return;
    }
    
    // Setze den Verarbeitungsstatus zurück, um eine Neuberechnung zu erzwingen
    const lastRow = sheet.getLastRow();
    const statusRange = sheet.getRange(2, headers.indexOf('Letzte Verarbeitung') + 1, lastRow - 1, 1);
    statusRange.clearContent();

    ui.alert('Status zurückgesetzt', 'Der Verarbeitungsstatus wurde zurückgesetzt. Starte jetzt die Neuberechnung...', ui.ButtonSet.OK);

    // Starte die normale Berechnung, die nun alle Touren neu verarbeitet
    calculateDistances(sheet);
    
  } catch (error) {
    Logger.log('Fehler beim Neuberechnen der Distanzen: ' + error.toString());
    const ui = SpreadsheetApp.getUi();
    ui.alert('Fehler', error.message, ui.ButtonSet.OK);
  }
}

// Funktion zum Neuberechnen einer EINZELNEN Tour
function recalculateSingleTour() {
  const ui = SpreadsheetApp.getUi();
  try {
    const result = ui.prompt(
      'Einzelne Tour neu berechnen',
      'Bitte geben Sie die Zeilennummer der Tour ein, die Sie neu berechnen möchten (z.B. 2):',
      ui.ButtonSet.OK_CANCEL
    );

    if (result.getSelectedButton() !== ui.Button.OK) {
      return;
    }

    const responseText = result.getResponseText();
    const rowNumber = parseInt(responseText, 10);

    if (isNaN(rowNumber) || rowNumber <= 1) {
      throw new Error('Bitte geben Sie eine gültige Zeilennummer größer als 1 ein.');
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Tour Daten');
    if (!sheet) {
      throw new Error('Das Blatt "Tour Daten" wurde nicht gefunden.');
    }

    if (rowNumber > sheet.getLastRow()) {
        throw new Error(`Die Zeilennummer ${rowNumber} ist ungültig. Das Blatt hat nur ${sheet.getLastRow()} Zeilen.`);
    }

    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const nameIndex = headers.indexOf('Name');
    const gpxUrlIndex = headers.indexOf('GPX-URL');
    const distanceIndex = headers.indexOf('Distanz');
    const elevationIndex = headers.indexOf('Höhenmeter');
    const lastProcessedIndex = headers.indexOf('Letzte Verarbeitung');
    const statusIndex = headers.indexOf('Verarbeitungsstatus');

    if ([nameIndex, gpxUrlIndex, distanceIndex, elevationIndex, lastProcessedIndex, statusIndex].includes(-1)) {
      throw new Error('Erforderliche Spalten im Blatt "Tour Daten" nicht gefunden.');
    }

    const rowData = sheet.getRange(rowNumber, 1, 1, sheet.getLastColumn()).getValues()[0];
    const tourName = rowData[nameIndex];
    const gpxUrl = rowData[gpxUrlIndex];

    if (!gpxUrl) {
      throw new Error(`In Zeile ${rowNumber} wurde keine GPX-URL gefunden.`);
    }

    ui.alert('Verarbeitung gestartet', `Die Tour "${tourName}" (Zeile ${rowNumber}) wird jetzt neu berechnet...`, ui.ButtonSet.OK);

    Logger.log(`Starte manuelle Neuberechnung für Tour: ${tourName} (Zeile ${rowNumber})`);
    const directUrl = getDirectDownloadUrl(gpxUrl);
    const response = UrlFetchApp.fetch(directUrl, { muteHttpExceptions: true, followRedirects: true });

    if (response.getResponseCode() !== 200) {
      throw new Error('HTTP-Fehler beim Abrufen der GPX-Datei: ' + response.getResponseCode());
    }

    const gpxContent = response.getContentText();
    const calcResult = calculateGpxDistance(gpxContent);

    sheet.getRange(rowNumber, distanceIndex + 1).setValue(calcResult.distance + ' km');

    if (calcResult.hasElevation) {
        sheet.getRange(rowNumber, elevationIndex + 1).setValue(calcResult.ascent + ' m ↑, ' + calcResult.descent + ' m ↓');
    } else {
        sheet.getRange(rowNumber, elevationIndex + 1).setValue('N/A');
    }
    
    sheet.getRange(rowNumber, lastProcessedIndex + 1).setValue(new Date());
    sheet.getRange(rowNumber, statusIndex + 1).setValue('Erfolgreich manuell verarbeitet');

    Logger.log(`Tour "${tourName}" erfolgreich neu berechnet.`);
    ui.alert('Erfolg', `Die Tour "${tourName}" wurde erfolgreich neu berechnet.`, ui.ButtonSet.OK);

  } catch (error) {
    Logger.log('Fehler bei der Neuberechnung der einzelnen Tour: ' + error.toString());
    ui.alert('Fehler', 'Die Tour konnte nicht neu berechnet werden.\n\nFehlerdetails: ' + error.message, ui.ButtonSet.OK);
  }
}

// Funktion zum Einrichten einer neuen Abstimmung
function setupVoting() {
  const ui = SpreadsheetApp.getUi();
  try {
    // Schritt 1: Newsletter-Spreadsheet-ID abfragen
    const newsletterIdResult = ui.prompt(
      'Abstimmung einrichten (1/3)',
      'Bitte geben Sie die ID Ihres Newsletter-Spreadsheets ein.\n\nVorschlag: 1O-w996WxWUXA0Q4Pbc9L6_aGdw9-fCxyW_BI4Uyb1_8',
      ui.ButtonSet.OK_CANCEL
    );
    if (newsletterIdResult.getSelectedButton() !== ui.Button.OK || !newsletterIdResult.getResponseText()) return;
    const newsletterSheetId = newsletterIdResult.getResponseText().trim();

    // Schritt 2: Tour-Zeilennummern abfragen
    const rowsResult = ui.prompt(
      'Abstimmung einrichten (2/3)',
      'Bitte geben Sie die Zeilennummern der Touren aus dem "Tour Daten"-Blatt an (kommagetrennt).\n\nVorschlag: 13, 51, 77, 7, 28',
      ui.ButtonSet.OK_CANCEL
    );
    if (rowsResult.getSelectedButton() !== ui.Button.OK || !rowsResult.getResponseText()) return;
    const rowNumbers = rowsResult.getResponseText().split(',').map(n => parseInt(n.trim()));

    // Schritt 3: Namen für die Abstimmungsrunde abfragen
    const votingRoundNameResult = ui.prompt(
      'Abstimmung einrichten (3/3)',
      'Geben Sie einen eindeutigen Namen für diese Abstimmungsrunde ein (z.B. "Abstimmung_Sommer_2025"). Dieser wird als Spaltenname im Newsletter-Sheet verwendet, um doppelte Stimmen zu verhindern.',
      ui.ButtonSet.OK_CANCEL
    );
    if (votingRoundNameResult.getSelectedButton() !== ui.Button.OK) return;
    const votingRoundName = votingRoundNameResult.getResponseText();
    if (!votingRoundName) throw new Error('Der Name der Abstimmungsrunde darf nicht leer sein.');

    // Speichere Konfiguration
    const scriptProperties = PropertiesService.getScriptProperties();
    scriptProperties.setProperty('newsletterSheetId', newsletterSheetId);
    scriptProperties.setProperty('votingRoundName', votingRoundName);

    // Lese die Tour-Daten
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const tourSheet = ss.getSheetByName('Tour Daten');
    if (!tourSheet) {
      throw new Error('Das Tabellenblatt "Tour Daten" wurde nicht gefunden. Bitte führen Sie zuerst die Initialisierung aus oder benennen Sie das Blatt entsprechend um.');
    }
    const nameIndex = tourSheet.getRange(1, 1, 1, tourSheet.getLastColumn()).getValues()[0].indexOf('Name');
    const distanceIndex = tourSheet.getRange(1, 1, 1, tourSheet.getLastColumn()).getValues()[0].indexOf('Distanz');
    
    if (nameIndex === -1 || distanceIndex === -1) {
      throw new Error('Die Spalten "Name" und/oder "Distanz" wurden im Blatt "Tour Daten" nicht gefunden.');
    }

    const votingTours = [];
    for (const rowNum of rowNumbers) {
      if (isNaN(rowNum) || rowNum <= 1) continue;
      const tourData = tourSheet.getRange(rowNum, 1, 1, tourSheet.getLastColumn()).getValues()[0];
      votingTours.push([tourData[nameIndex], tourData[distanceIndex], 0]);
    }
    
    // Bereite das "Abstimmung"-Blatt vor oder erstelle es
    let votingSheet = ss.getSheetByName('Abstimmung');
    if (!votingSheet) {
      votingSheet = ss.insertSheet('Abstimmung');
    }

    votingSheet.clear();
    votingSheet.getRange(1, 1, 1, 3).setValues([['Tour', 'Distanz', 'Stimmen']]).setFontWeight('bold');
    if (votingTours.length > 0) {
      votingSheet.getRange(2, 1, votingTours.length, 3).setValues(votingTours);
    }

    ui.alert('Erfolg', 'Die Abstimmung wurde erfolgreich eingerichtet. Das Blatt "Abstimmung" ist nun bereit.', ui.ButtonSet.OK);

  } catch (e) {
    Logger.log('Fehler beim Einrichten der Abstimmung: ' + e.toString());
    ui.alert('Fehler', 'Die Abstimmung konnte nicht eingerichtet werden.\n\nDetails: ' + e.message, ui.ButtonSet.OK);
  }
}

// API-Endpunkt für die Web-App
function doGet(e) {
  try {
    const action = e.parameter.action || 'getTours'; // Standard-Aktion
    Logger.log(`Anfrage erhalten: action=${action}`);
    
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    
    if (action === 'getVotingTours') {
      const sheet = ss.getSheetByName('Abstimmung');
      if (!sheet) throw new Error('Das Blatt "Abstimmung" wurde nicht gefunden.');
      
      const data = sheet.getDataRange().getValues();
      const tours = data.slice(1).map(row => ({ name: row[0], distance: row[1] }));
      
      return createJsonResponse(tours);
    }
    
    // Standard-Aktion: GPX-Touren-Archiv zurückgeben
    const sheet = ss.getSheetByName('Tour Daten');
    if (!sheet) throw new Error('Das Blatt "Tour Daten" wurde nicht gefunden.');

  const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const nameIndex = headers.indexOf('Name');
    const distanzIndex = headers.indexOf('Distanz');
    const gpxUrlIndex = headers.indexOf('GPX-URL');
    const statusIndex = headers.indexOf('Verarbeitungsstatus');
    const jahrIndex = headers.indexOf('Jahr');

    if ([nameIndex, distanzIndex, gpxUrlIndex, statusIndex, jahrIndex].includes(-1)) {
        throw new Error('Benötigte Spalten nicht im Blatt "Tour Daten" gefunden.');
    }

    const tours = [];
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const status = row[statusIndex];
      const gpxUrl = row[gpxUrlIndex];
      
      if (gpxUrl && status && !status.toString().toLowerCase().includes('fehler')) {
        const fileId = gpxUrl.match(/[-\w]{25,}/);
        if (fileId) {
            tours.push({
                name: row[nameIndex],
                distance: row[distanzIndex],
                year: row[jahrIndex],
                downloadUrl: `https://drive.google.com/uc?export=download&id=${fileId[0]}`
            });
        }
      }
    }
    tours.sort((a, b) => {
        if (b.year !== a.year) return b.year - a.year;
        return a.name.localeCompare(b.name);
    });

    return createJsonResponse(tours);

  } catch (error) {
    Logger.log('Fehler in doGet: ' + error.toString());
    return createJsonResponse({ error: error.message });
  }
}

// API-Endpunkt für das Empfangen von Daten (z.B. Stimmen)
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000); // Auf Sperre für 30 Sekunden warten, um konkurrierende Zugriffe zu verhindern

  try {
    const requestData = JSON.parse(e.postData.contents);
    const { subscriberId, votedTourNames } = requestData;

    // Verwende die neue interne Abstimmungsverarbeitung
    const result = processVoteInternal(subscriberId, votedTourNames);
    return createJsonResponse(result);

  } catch (error) {
    Logger.log('Fehler in doPost: ' + error.toString());
    return createJsonResponse({ success: false, message: 'Ein interner Fehler ist aufgetreten: ' + error.message });
  } finally {
    lock.releaseLock();
  }
}

function createJsonResponse(data) {
  const output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  // Erlaubt Anfragen von jeder Webseite.
  output.setHeader('Access-Control-Allow-Origin', '*');
  return output;
}

/**
 * Antwortet auf CORS "Preflight"-Anfragen, die der Browser vor
 * einem POST-Request sendet.
 */
function doOptions() {
  const response = ContentService.createTextOutput();
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  response.setMimeType(ContentService.MimeType.TEXT);
  return response;
}

//==============================================================
// FUNKTIONEN ZUR TOUR-PLANUNG
//==============================================================

/**
 * Wrapper-Funktion, die aus dem Menü aufgerufen wird,
 * um den Dialog für ein neues Planungs-Sheet anzuzeigen.
 */
function menuCreateTourPlanningSheet() {
  const ui = SpreadsheetApp.getUi();
  const response = ui.prompt('Neues Touren-Blatt anlegen', 'Wie soll das neue Blatt heißen? (z.B. "Touren 2024")', ui.ButtonSet.OK_CANCEL);
  
  if (response.getSelectedButton() !== ui.Button.OK) {
    return;
  }
  
  const sheetName = response.getResponseText().trim();
  if (!sheetName) {
    ui.alert('Bitte gib einen gültigen Namen ein!');
    return;
  }
  
  createTourPlanningSheet(sheetName);
}

/**
 * Legt ein neues Touren-Blatt mit allen benötigten Spalten an
 * @param {string} sheetName - Name des neuen Blatts (z.B. "Touren 2024")
 */
function createTourPlanningSheet(sheetName) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(sheetName);
  if (sheet) {
    SpreadsheetApp.getUi().alert('Es existiert bereits ein Blatt mit diesem Namen!');
    return;
  }
  sheet = ss.insertSheet(sheetName);
  const headers = [
    'Datum', 'Wochentag', 'Uhrzeit', 'Titel', 'Treffpunkt', 'Geschwindigkeit', 
    'Beschreibung', 'Google Maps Link', 'Komoot Link', 'GPS Link', 'Tour Guide', 
    'Bemerkung', 'Teilnehmer', 'Bar-Spenden', 'Bilder-Link(s)', 'Anmelde-Link'
  ];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold');
  sheet.setFrozenRows(1);

  sheet.setColumnWidths(1, headers.length, 140);
  sheet.setColumnWidth(7, 300); // Beschreibung breiter
  sheet.setColumnWidth(12, 200); // Bemerkung breiter
  sheet.setColumnWidth(15, 200); // Bilder-Link(s) breiter
  sheet.setColumnWidth(16, 200); // Anmelde-Link breiter
}

/**
 * Erstellt ein Google Forms für Tour-Abstimmungen als Alternative zur React-App
 * (Lösung für CORS-Probleme)
 */
function createVotingFormInTourManagement() {
  try {
    const ui = SpreadsheetApp.getUi();
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // Prüfe, ob Abstimmungs-Daten vorhanden sind
    const votingSheet = ss.getSheetByName('Abstimmung');
    if (!votingSheet) {
      ui.alert('Fehler', 'Es wurde kein "Abstimmung" Blatt gefunden.\n\nBitte richte zuerst über "Neue Abstimmung einrichten" eine Abstimmung ein.', ui.ButtonSet.OK);
      return;
    }
    
    const votingData = votingSheet.getDataRange().getValues();
    if (votingData.length <= 1) {
      ui.alert('Fehler', 'Keine Touren zur Abstimmung gefunden.\n\nBitte richte zuerst über "Neue Abstimmung einrichten" eine Abstimmung ein.', ui.ButtonSet.OK);
      return;
    }
    
    // Erstelle ein neues Google Forms
    const form = FormApp.create('Hoffnungsradler - Tour-Abstimmung');
    
    // Setze Beschreibung
    form.setDescription(
      'Wähle die Tour aus, die dich am meisten interessiert. ' +
      'Deine Stimme hilft uns bei der Planung der nächsten Gruppentouren!'
    );
    
    // Füge Feld für Abonnenten-ID hinzu
    const subscriberIdItem = form.addTextItem();
    subscriberIdItem.setTitle('Abonnenten-ID (automatisch ausgefüllt)');
    subscriberIdItem.setRequired(true);
    subscriberIdItem.setHelpText('Diese ID wird automatisch vom Newsletter-Link ausgefüllt.');
    
    // Füge Feld für E-Mail hinzu (optional, für Verifikation)
    const emailItem = form.addTextItem();
    emailItem.setTitle('E-Mail-Adresse (automatisch ausgefüllt)');
    emailItem.setRequired(false);
    emailItem.setHelpText('Zur Verifikation - wird automatisch ausgefüllt.');
    
    // DEBUG: Zeige was im Abstimmungs-Blatt steht
    Logger.log(`Abstimmungs-Blatt hat ${votingData.length} Zeilen`);
    Logger.log('Erste paar Zeilen des Abstimmungs-Blatts:');
    for (let i = 0; i < Math.min(5, votingData.length); i++) {
      Logger.log(`Zeile ${i}: ${JSON.stringify(votingData[i])}`);
    }
    
    // Lese die aktuellen Touren aus dem Abstimmungs-Blatt
    const tourChoices = [];
    for (let i = 1; i < votingData.length; i++) {
      const tourName = votingData[i][0];
      const tourDistance = votingData[i][1];
      Logger.log(`Zeile ${i}: Name="${tourName}", Distanz="${tourDistance}"`);
      
      if (tourName && tourName.toString().trim() !== '') {
        const choiceText = `${tourName} (${tourDistance || 'unbekannt'})`;
        tourChoices.push(choiceText);
        Logger.log(`Hinzugefügt: "${choiceText}"`);
      } else {
        Logger.log(`Übersprungen: Leerer Tour-Name in Zeile ${i}`);
      }
    }
    
    Logger.log(`Insgesamt ${tourChoices.length} Touren gefunden: ${JSON.stringify(tourChoices)}`);
    
    if (tourChoices.length === 0) {
      throw new Error(`Keine gültigen Touren zur Abstimmung gefunden. Abstimmungs-Blatt hat ${votingData.length} Zeilen. Erste Zeile: ${JSON.stringify(votingData[0] || 'leer')}`);
    }
    
    // Füge Multiple-Choice-Feld für Touren hinzu
    const tourItem = form.addMultipleChoiceItem();
    tourItem.setTitle('Welche Tour interessiert dich am meisten?');
    tourItem.setRequired(true);
    
    // Erstelle Choice-Objekte für MultipleChoiceItem
    const choices = tourChoices.map(choice => tourItem.createChoice(choice));
    tourItem.setChoices(choices);
    tourItem.setHelpText('Bitte wähle die Tour aus, die dich am meisten interessiert.');
    
    // Füge Kommentar-Feld hinzu
    const commentItem = form.addParagraphTextItem();
    commentItem.setTitle('Kommentare oder Wünsche (optional)');
    commentItem.setRequired(false);
    commentItem.setHelpText('Hier kannst du zusätzliche Wünsche oder Anmerkungen hinterlassen.');
    
    // WICHTIG: Erst einmal OHNE Spreadsheet-Verknüpfung erstellen
    // Die Verknüpfung kann später manuell hinzugefügt werden
    // form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());
    
    // Hole die Forms-URL
    const formUrl = form.getPublishedUrl();
    
    // Speichere die Forms-URL in den Einstellungen
    const settingsSheet = ss.getSheetByName('Einstellungen');
    if (settingsSheet) {
      const settingsData = settingsSheet.getDataRange().getValues();
      let formsUrlRowIndex = -1;
      
      // Suche nach vorhandener "Forms-URL" Zeile
      for (let i = 0; i < settingsData.length; i++) {
        if (settingsData[i][0] === 'Abstimmungs-Forms-URL') {
          formsUrlRowIndex = i;
          break;
        }
      }
      
      if (formsUrlRowIndex === -1) {
        // Füge neue Zeile hinzu
        settingsSheet.appendRow(['Abstimmungs-Forms-URL', formUrl, new Date().toISOString()]);
      } else {
        // Aktualisiere vorhandene Zeile
        settingsSheet.getRange(formsUrlRowIndex + 1, 2).setValue(formUrl);
        settingsSheet.getRange(formsUrlRowIndex + 1, 3).setValue(new Date().toISOString());
      }
    }
    
    ui.alert(
      'Google Forms erstellt!',
      `Ein neues Google Forms für Tour-Abstimmungen wurde erstellt:\n\n${formUrl}\n\n` +
      'WICHTIG: Verknüpfe das Formular manuell mit diesem Spreadsheet:\n' +
      '1. Öffne das Forms über den obigen Link\n' +
      '2. Klicke auf "Antworten" → Einstellungen (Zahnrad)\n' +
      '3. Wähle "Antworten in Tabellenkalkulationen sammeln"\n' +
      '4. Wähle "Neue Tabellenkalkulation erstellen" oder "Vorhandene auswählen"\n\n' +
      'Die URL wurde in den Einstellungen gespeichert für den Newsletter-Service.',
      ui.ButtonSet.OK
    );
    
    Logger.log(`Google Forms für Abstimmung erstellt: ${formUrl}`);
    return formUrl;
    
  } catch (error) {
    Logger.log(`Fehler beim Erstellen des Abstimmungs-Forms: ${error.message}`);
    SpreadsheetApp.getUi().alert('Fehler', `Forms konnte nicht erstellt werden: ${error.message}`, SpreadsheetApp.getUi().ButtonSet.OK);
    return null;
  }
}

/**
 * Hilfsfunktion zum Abrufen der gespeicherten Forms-URL
 */
function getVotingFormsUrl() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const settingsSheet = ss.getSheetByName('Einstellungen');
    
    if (!settingsSheet) {
      return null;
    }
    
    const data = settingsSheet.getDataRange().getValues();
    for (let i = 0; i < data.length; i++) {
      if (data[i][0] === 'Abstimmungs-Forms-URL') {
        return data[i][1] || null;
      }
    }
    
    return null;
  } catch (error) {
    Logger.log(`Fehler beim Abrufen der Forms-URL: ${error.message}`);
    return null;
  }
}

/**
 * Verarbeitet Google Forms Antworten automatisch
 * Diese Funktion wird als Trigger auf das Forms-Antworten-Blatt gesetzt
 */
function onFormSubmit(e) {
  try {
    Logger.log('Google Forms Antwort empfangen');
    
    // Hole die Antworten aus dem Event
    const formResponse = e.values;
    
    if (!formResponse || formResponse.length < 4) {
      Logger.log('Unvollständige Antwort empfangen');
      return;
    }
    
    // Forms-Antworten Struktur:
    // [0] = Timestamp
    // [1] = Abonnenten-ID  
    // [2] = E-Mail
    // [3] = Tour-Auswahl (Kommagetrennt)
    // [4] = Kommentare (optional)
    
    const timestamp = formResponse[0];
    const subscriberId = formResponse[1];
    const email = formResponse[2];
    const tourSelections = formResponse[3];
    const comments = formResponse[4] || '';
    
    Logger.log(`Verarbeite Antwort von ${subscriberId}: ${tourSelections}`);
    
    // Simuliere die doPost Verarbeitung
    const votedTourNames = parseFormsResponse(tourSelections);
    
    const result = processVoteInternal(subscriberId, votedTourNames, comments);
    
    if (result.success) {
      Logger.log(`Abstimmung erfolgreich verarbeitet für ${subscriberId}`);
    } else {
      Logger.log(`Fehler bei Abstimmung für ${subscriberId}: ${result.message}`);
    }
    
  } catch (error) {
    Logger.log(`Fehler beim Verarbeiten der Forms-Antwort: ${error.message}`);
  }
}

/**
 * Hilfsfunktion zum Parsen der Forms-Antworten
 */
function parseFormsResponse(tourSelection) {
  if (!tourSelection) return [];
  
  // Bei MultipleChoiceItem kommt nur eine einzelne Auswahl (kein Komma-getrennter String)
  const selection = tourSelection.toString().trim();
  
  // Extrahiere den Tour-Namen (entferne Distanz-Angaben in Klammern)
  const match = selection.match(/^(.+?)\s*\(/);
  const tourName = match ? match[1].trim() : selection;
  
  return [tourName]; // Gib Array mit einem Element zurück für Kompatibilität
}

/**
 * Interne Abstimmungsverarbeitung (sowohl für API als auch Forms)
 */
function processVoteInternal(subscriberId, votedTourNames, comments = '') {
  try {
    if (!subscriberId || !Array.isArray(votedTourNames) || votedTourNames.length === 0) {
      return { success: false, message: 'Ungültige Anfrage: subscriberId oder votedTourNames fehlen.' };
    }

    // Konfiguration aus den Script-Properties laden
    const scriptProperties = PropertiesService.getScriptProperties();
    const newsletterSheetId = scriptProperties.getProperty('newsletterSheetId');
    const votingRoundName = scriptProperties.getProperty('votingRoundName');

    if (!newsletterSheetId || !votingRoundName) {
      return { success: false, message: 'Die Abstimmung ist nicht konfiguriert. Bitte führen Sie "Abstimmung einrichten" aus.' };
    }

    // --- Schritt 1: Überprüfen, ob der Abonnent bereits abgestimmt hat ---
    const newsletterSpreadsheet = SpreadsheetApp.openById(newsletterSheetId);
    const subscribersSheet = newsletterSpreadsheet.getSheets()[0]; 
    const subscribersData = subscribersSheet.getDataRange().getValues();
    const headers = subscribersData[0];
    const idIndex = headers.indexOf('SubscriberID');
    let voteColumnIndex = headers.indexOf(votingRoundName);

    if (idIndex === -1) {
      return { success: false, message: 'Spalte "SubscriberID" im Newsletter-Sheet nicht gefunden.' };
    }
    
    // Wenn die Abstimmungsspalte nicht existiert, füge sie hinzu
    if (voteColumnIndex === -1) {
      subscribersSheet.getRange(1, headers.length + 1).setValue(votingRoundName);
      voteColumnIndex = headers.length;
    }

    const subscriberRow = subscribersData.find(row => row[idIndex] === subscriberId);
    if (!subscriberRow) {
      return { success: false, message: 'Ungültige Abonnenten-ID.' };
    }

    if (subscriberRow[voteColumnIndex]) {
      return { success: false, message: 'Du hast bereits abgestimmt.' };
    }

    // --- Schritt 2: Stimmen im "Abstimmung"-Blatt zählen ---
    const tourSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const votingSheet = tourSpreadsheet.getSheetByName('Abstimmung');
    const votingData = votingSheet.getDataRange().getValues();
    
    for (const tourName of votedTourNames) {
      const tourRowIndex = votingData.findIndex(row => row[0] === tourName);
      if (tourRowIndex !== -1) {
        const currentVotes = votingSheet.getRange(tourRowIndex + 1, 3).getValue();
        votingSheet.getRange(tourRowIndex + 1, 3).setValue(currentVotes + 1);
      }
    }

    // --- Schritt 3: Abonnent als "hat abgestimmt" markieren ---
    const subscriberRowIndex = subscribersData.findIndex(row => row[idIndex] === subscriberId) + 1;
    subscribersSheet.getRange(subscriberRowIndex, voteColumnIndex + 1).setValue(new Date());

    return { success: true, message: 'Vielen Dank! Deine Stimme wurde gezählt.' };

  } catch (error) {
    Logger.log('Fehler bei der Abstimmungsverarbeitung: ' + error.toString());
    return { success: false, message: 'Ein interner Fehler ist aufgetreten: ' + error.message };
  }
}