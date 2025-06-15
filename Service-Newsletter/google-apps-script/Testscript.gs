function testEmailExtraction() {
  const testBody = `Neue Anmeldung zum Tour-Newsletter!
E-Mail: test@beispiel.com
Datum: 14.03.2025
Quelle: Webseite
Abonnenten-ID: a1b2c3d4-e5f6
Abmelde-Link: https://example.com/unsubscribe?id=a1b2c3d4-e5f6`;
  
  const emailRegex = /E-Mail:\s+([\w.-]+@[\w.-]+\.\w+)/i;
  const linkRegex = /Abmelde-Link:\s+(https:\/\/[^\s\n]+)/i;
  const idRegex = /Abonnenten-ID:\s+([a-f0-9-]+)/i;
  
  const emailMatch = testBody.match(emailRegex);
  const linkMatch = testBody.match(linkRegex);
  const idMatch = testBody.match(idRegex);
  
  Logger.log("Email Match: " + JSON.stringify(emailMatch));
  Logger.log("Link Match: " + JSON.stringify(linkMatch));
  Logger.log("ID Match: " + JSON.stringify(idMatch));
  
  if (emailMatch) Logger.log("Extrahierte E-Mail: " + emailMatch[1]);
  if (linkMatch) Logger.log("Extrahierter Link: " + linkMatch[1]);
  if (idMatch) Logger.log("Extrahierte ID: " + idMatch[1]);
}

/**
 * Neue Testfunktion, um die Ersetzung der Abstimmungs-Platzhalter zu prüfen.
 */
function testPlaceholderReplacement() {
  Logger.log("=== Starte Test für Platzhalter-Ersetzung ===");

  const testDescription = "Hallo,\n\ndas ist ein Test.\n\nHier ist der Button: [abstimmungs_button]\n\nUnd hier der reine Link: [abstimmungs_link]\n\nViele Grüße";
  const testVotingLink = "https://example.com/vote?id=test-user-xyz";

  const newsletterData = {
    tourDescription: testDescription,
    unsubscribeLink: "https://example.com/unsubscribe"
  };

  const template = getNewsletterTemplate(newsletterData, testVotingLink);

  Logger.log("\n--- Plain Text Output ---");
  Logger.log(template.plainBody);

  Logger.log("\n--- HTML Output ---");
  Logger.log(template.htmlBody);

  if (template.htmlBody.includes(testVotingLink) && !template.htmlBody.includes('[abstimmungs_button]')) {
    Logger.log("\n✅ ERFOLG: Button-Platzhalter wurde im HTML ersetzt.");
  } else {
    Logger.log("\n❌ FEHLER: Button-Platzhalter wurde im HTML NICHT korrekt ersetzt.");
  }
  
  if (template.plainBody.includes(testVotingLink) && !template.plainBody.includes('[abstimmungs_button]')) {
    Logger.log("✅ ERFOLG: Button-Platzhalter wurde im Plain-Text ersetzt.");
  } else {
    Logger.log("❌ FEHLER: Button-Platzhalter wurde im Plain-Text NICHT korrekt ersetzt.");
  }

  Logger.log("=== Test für Platzhalter-Ersetzung beendet ===");
}