/**
 * Funktion zum Testversand des Newsletters an eine bestimmte E-Mail-Adresse.
 * Liest nur noch Titel (für Betreff) und Beschreibung (für Inhalt) aus dem Sheet.
 * Hiermit kann die Formatierung und das Erscheinungsbild vor dem Massenversand geprüft werden.
 */
function sendNewsletterTest() {
  const ui = SpreadsheetApp.getUi();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Überprüfen, ob das Newsletter-Eingabeblatt existiert
  const inputSheet = ss.getSheetByName('Newsletter_aktuell');
  if (!inputSheet) {
    ui.alert(
      'Fehler', 
      'Das Blatt "Newsletter_aktuell" wurde nicht gefunden. Bitte erstelle zuerst einen Newsletter.',
      ui.ButtonSet.OK
    );
    return;
  }
  
  // Relevante Newsletter-Daten auslesen
  const tourTitle = inputSheet.getRange('B2').getValue();       // Wird für Betreff benötigt
  const tourDescription = inputSheet.getRange('B3').getValue(); // Wird für Inhalt benötigt
  
  // Prüfen, ob die notwendigen Informationen vorhanden sind
  if (!tourTitle || !tourDescription) {
    ui.alert(
      'Fehlende Informationen', 
      'Bitte fülle mindestens den Titel (B2) und die Beschreibung (B3) im Newsletter-Blatt aus, bevor du einen Testversand durchführst.',
      ui.ButtonSet.OK
    );
    return;
  }
  
  // Nach der Test-E-Mail-Adresse fragen
  const promptResponse = ui.prompt(
    'Newsletter-Testversand',
    'Bitte gib deine E-Mail-Adresse ein, an die der Test-Newsletter gesendet werden soll:',
    ui.ButtonSet.OK_CANCEL
  );
  
  // Abbrechen, wenn der Benutzer auf Abbrechen klickt
  if (promptResponse.getSelectedButton() !== ui.Button.OK) {
    return;
  }
  
  // E-Mail-Adresse aus dem Prompt holen
  const testEmail = promptResponse.getResponseText().trim();
  
  try {
    // Newsletter-Betreff erstellen
    const newsletterSubject = "[TEST] Neue Tour-Information: " + tourTitle;
    
    // Ein Beispiel für einen Abmelde- und einen Abstimmungs-Link für den Test
    const testUnsubscribeLink = "https://hoffnungs-radler-duelmen.de/unsubscribe.html?id=test-id-123456";
    const testVotingLink = "https://hoffnungs-radler-duelmen.de/abstimmung?id=test-abonnent-123";

    // Newsletter-Template mit den benötigten Daten füllen
    const newsletterData = {
      tourDescription: tourDescription, // Hauptinhalt
      unsubscribeLink: testUnsubscribeLink
    };
    
    // Der Test-Link für die Abstimmung wird als zweiter Parameter übergeben
    const newsletter = getNewsletterTemplate(newsletterData, testVotingLink);
    
    // Test-E-Mail senden
    GmailApp.sendEmail(
      testEmail,
      newsletterSubject,
      newsletter.plainBody,
      { 
        htmlBody: newsletter.htmlBody,
        name: "Hoffnungsradler Dülmen [TEST]" 
      }
    );
    
    // Bestätigung anzeigen
    ui.alert(
      'Test erfolgreich',
      `Der Test-Newsletter wurde an ${testEmail} gesendet.\n\nBitte überprüfe die E-Mail auf korrektes Erscheinungsbild und Formatierung.`,
      ui.ButtonSet.OK
    );
    
  } catch (error) {
    // Fehlerbehandlung
    Logger.log("Fehler beim Testversand: " + error.message);
    ui.alert(
      'Fehler beim Testversand',
      `Es ist ein Fehler aufgetreten: ${error.message}`,
      ui.ButtonSet.OK
    );
  }
}

// --- Hilfsfunktion validateEmail (unverändert, aber wichtig für sendNewsletterTest) ---
/**
 * Hilfsfunktion zur Validierung einer E-Mail-Adresse
 * @param {string} email - Die zu validierende E-Mail-Adresse
 * @return {boolean} - True, wenn die E-Mail-Adresse gültig ist, sonst False
 */
function validateEmail(email) {
  // Einfache Regex zur E-Mail-Validierung
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// --- Die Funktionen validateEmail und onOpen bleiben unverändert ---