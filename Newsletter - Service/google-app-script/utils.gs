/**
 * Zentrale Hilfsfunktionen für den Newsletter-Service
 */

/**
 * Validiert eine E-Mail-Adresse
 * @param {string} email
 * @return {boolean}
 */
function validateEmail(email) {
  // Einheitliche, robuste Regex
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  return emailRegex.test(email);
}

/**
 * Extrahiert eine E-Mail-Adresse aus einem beliebigen Text (z.B. Name <email> oder nur email)
 * @param {string} input
 * @return {string|null}
 */
function extractEmail(input) {
  if (!input) return null;
  // Format: Name <email@example.com>
  const angleRegex = /<([^<>]+)>$/;
  const angleMatch = input.match(angleRegex);
  if (angleMatch && angleMatch[1]) {
    const extractedEmail = angleMatch[1].trim();
    if (validateEmail(extractedEmail)) {
      return extractedEmail;
    }
  }
  // Format: email@example.com
  const simpleRegex = /\b([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})\b/;
  const simpleMatch = input.match(simpleRegex);
  if (simpleMatch && simpleMatch[1]) {
    const extractedEmail = simpleMatch[1].trim();
    if (validateEmail(extractedEmail)) {
      return extractedEmail;
    }
  }
  return null;
}

/**
 * Erstellt das Newsletter-Template (plain & html)
 * @param {Object} data - Muss mindestens tourDescription und unsubscribeLink enthalten
 * @return {Object} - { plainBody, htmlBody }
 */
function getNewsletterTemplate(data) {
  const plainBody =
    `Tour-Newsletter der Hoffnungsradler Dülmen\n\n` +
    `${data.tourDescription}\n\n` +
    `Wir freuen uns auf deine Teilnahme!\n\n` +
    `Mit sportlichen Grüßen,\n` +
    `Das Team der Hoffnungsradler Dülmen\n\n` +
    `--\n` +
    `Du erhältst diese E-Mail, weil du dich für unseren Tour-Newsletter angemeldet hast.\n` +
    `Um dich abzumelden, besuche: ${data.unsubscribeLink}`;

  // **Text** durch <strong>Text</strong> ersetzen
  const formattedHtmlDescription = (data.tourDescription || '').replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h1 style="color: #003366; text-align: center; border-bottom: 2px solid #003366; padding-bottom: 10px;">Tour-Newsletter der Hoffnungsradler Dülmen</h1>
      <div style="margin-top: 20px; line-height: 1.6;">
        ${formattedHtmlDescription.replace(/\n/g, '<br>')}
      </div>
      <p style="margin-top: 25px;">Wir freuen uns auf deine Teilnahme!</p>
      <p style="margin-top: 15px;">Mit sportlichen Grüßen,<br>Das Team der Hoffnungsradler Dülmen</p>
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; text-align: center;">
        <p>Du erhältst diese E-Mail, weil du dich für unseren Tour-Newsletter angemeldet hast.</p>
        <p>Um dich abzumelden, <a href="${data.unsubscribeLink}" style="color: #003366; text-decoration: underline;">klicke bitte hier</a>.</p>
      </div>
    </div>
  `;
  return {
    plainBody: plainBody,
    htmlBody: htmlBody
  };
} 