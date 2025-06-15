/**
 * @OnlyCurrentDoc
 *
 * Diese Datei enthält Funktionen zur Verwaltung von Skript-Einstellungen.
 */

const VOTING_URL_KEY = 'VOTING_PAGE_URL';

/**
 * Erlaubt dem Nutzer, die Standard-URL für die Abstimmungsseite
 * über ein Dialogfenster zu setzen und zu speichern.
 */
function menu_setVotingUrl() {
  const ui = SpreadsheetApp.getUi();
  const scriptProperties = PropertiesService.getScriptProperties();
  
  const currentUrl = scriptProperties.getProperty(VOTING_URL_KEY) || 'https://hoffnungs-radler-duelmen.de/abstimmung';

  const response = ui.prompt(
    'Abstimmungs-URL festlegen',
    'Bitte gib die Standard-URL für die Abstimmungsseite ein. Diese wird als Vorschlag verwendet, wenn du neue Links erstellst.\n\nAktueller Wert:\n' + currentUrl,
    ui.ButtonSet.OK_CANCEL
  );

  if (response.getSelectedButton() == ui.Button.OK) {
    const newUrl = response.getResponseText().trim();
    if (newUrl.startsWith('https')) {
      scriptProperties.setProperty(VOTING_URL_KEY, newUrl);
      ui.alert('Erfolg', 'Die Abstimmungs-URL wurde gespeichert:\n' + newUrl);
    } else {
      ui.alert('Fehler', 'Die URL ist ungültig. Bitte eine vollständige URL mit https:// angeben.');
    }
  }
}

/**
 * Ruft die gespeicherte Abstimmungs-URL ab.
 * @returns {string} Die gespeicherte URL oder ein Standardwert.
 */
function getVotingUrl() {
  const scriptProperties = PropertiesService.getScriptProperties();
  return scriptProperties.getProperty(VOTING_URL_KEY) || 'https://hoffnungs-radler-duelmen.de/abstimmung';
} 