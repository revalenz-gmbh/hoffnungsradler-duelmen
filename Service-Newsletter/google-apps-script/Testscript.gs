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
 * Testfunktion für die Newsletter-Template-Generierung
 */
function testNewsletterTemplate() {
  Logger.log("=== Starte Test für Newsletter-Template ===");

  const testDescription = "Hallo,\n\ndas ist ein Test-Newsletter.\n\nWir freuen uns auf die nächste Tour!\n\nViele Grüße";

  const newsletterData = {
    tourDescription: testDescription,
    unsubscribeLink: "https://example.com/unsubscribe"
  };

  const template = getNewsletterTemplate(newsletterData);

  Logger.log("\n--- Plain Text Output ---");
  Logger.log(template.plainBody);

  Logger.log("\n--- HTML Output ---");
  Logger.log(template.htmlBody);

  Logger.log("=== Test für Newsletter-Template beendet ===");
}