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
  newsletterMenu.addItem('Anmeldungen & Abmeldungen verarbeiten', 'processInboxNewsletterTasks');
  newsletterMenu.addItem('Manuelle Abonnenten hinzufügen', 'addManualSubscribers');
  newsletterMenu.addSeparator();
  newsletterMenu.addItem('Ungültige E-Mails deaktivieren', 'cleanupInvalidEmails');
  
  const adminSubMenu = ui.createMenu('Administration');
  adminSubMenu.addItem('⚙️ System-Setup durchführen', 'setupNewsletterSettings');
  adminSubMenu.addItem('📋 Einstellungen anzeigen', 'showCurrentSettings');
  adminSubMenu.addItem('✅ Einstellungen prüfen', 'validateSettings');
  adminSubMenu.addSeparator();
  adminSubMenu.addItem('🏠 Auf lokales Sheet umstellen', 'switchToLocalMode');
  adminSubMenu.addItem('📊 Lokales Newsletter-Sheet erstellen', 'createLocalNewsletterSheet');
  adminSubMenu.addSeparator();
  adminSubMenu.addItem('Backup erstellen', 'createBackup');
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
  
  // --- Menü für Tourplanung ---
  const tourMenu = ui.createMenu('Tourplanung');
  tourMenu.addItem('Neues Blatt für Tourplanung anlegen', 'menuCreateTourPlanningSheet');
  tourMenu.addToUi();
} 