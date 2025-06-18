function onOpen() {
  const ui = SpreadsheetApp.getUi();

  // --- Hauptmenü für Newsletter ---
  const newsletterMenu = ui.createMenu('Newsletter');

  newsletterMenu.addItem('Vorlage erstellen/öffnen', 'createNewsletterSheet');
  newsletterMenu.addItem('Newsletter archivieren', 'archiveCurrentNewsletterSheet');
  newsletterMenu.addSeparator();
  newsletterMenu.addItem('Test-Newsletter senden', 'sendNewsletterTest');
  newsletterMenu.addItem('NEWSLETTER AN ALLE SENDEN', 'sendNewsletterToAllSubscribers');
  newsletterMenu.addSeparator();
  newsletterMenu.addItem('Neue Anmeldungen verarbeiten', 'processNewSubscriptions');
  newsletterMenu.addItem('Manuelle Abonnenten hinzufügen', 'addManualSubscribers');
  newsletterMenu.addSeparator();
  newsletterMenu.addItem('Personalisierte Abstimmungs-Links erstellen', 'generateVotingLinks');
  newsletterMenu.addItem('Google Forms Entry-IDs ermitteln', 'getFormsEntryIds');
  newsletterMenu.addItem('Migration: Alte Abstimmungs-Links übertragen', 'migrateVotingLinksToMainTable');
  newsletterMenu.addSeparator();
  
  const adminSubMenu = ui.createMenu('Administration');
  adminSubMenu.addItem('Backup erstellen', 'createBackup');
  adminSubMenu.addItem('Abstimmungs-URL festlegen', 'menu_setVotingUrl');
  adminSubMenu.addSeparator();
  adminSubMenu.addItem('Trigger-Status (detailliert)', 'showDetailedTriggerStatus');
  adminSubMenu.addItem('Versand manuell fortsetzen', 'manualContinueNewsletterSend');
  adminSubMenu.addItem('Newsletter-System zurücksetzen', 'resetNewsletterSystem');
  adminSubMenu.addItem('Monitoring-Trigger installieren', 'installMonitoringTrigger');
  adminSubMenu.addSeparator();
  adminSubMenu.addItem('Trigger anzeigen (einfach)', 'listAllTriggers');
  adminSubMenu.addItem('Versandstatus anzeigen', 'getNewsletterSendStatus');
  adminSubMenu.addItem('Versand-24h-Check', 'checkLastSendTimeAndQuota');
  adminSubMenu.addItem('Quota-Status (24h) anzeigen', 'checkQuotaUsage');
  newsletterMenu.addSubMenu(adminSubMenu);
  
  newsletterMenu.addToUi();
} 