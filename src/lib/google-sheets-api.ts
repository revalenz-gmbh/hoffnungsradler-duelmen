/**
 * Google Sheets Fallback-Daten
 * Hoffnungsradler Dülmen e.V.
 * 
 * Diese Datei enthält nur noch Fallback-Daten für den Fall,
 * dass die Google Apps Script API nicht erreichbar ist.
 * 
 * Der direkte Google Sheets Zugriff wurde entfernt (Sicherheit, nicht mehr benötigt).
 * Alle Live-Daten kommen über die Google Apps Script API (via Vercel Proxy).
 */

/**
 * Dashboard-Werte Interface
 * Wird für Fallback-Daten verwendet
 */
export interface DashboardValues {
  // Einnahmen
  einnahmenKonto: number;      // C5
  einnahmenBargeld: number;    // C7
  einnahmenGesamt: number;     // C9
  
  // Ausgaben
  ausgabenKonto: number;       // C13
  ausgabenBargeld: number;     // C15
  ausgabenUebergeben: number;  // C17 (Übergebene Spenden)
  ausgabenGesamt: number;      // C18
  
  // Saldo
  saldo: number;               // C20 (Aktueller Spendenstand)
  
  // Metadaten
  jahr: number;
  lastUpdated: string;
}

/**
 * Fallback-Werte falls die API nicht erreichbar ist
 * Stand: 23.01.2026 - Aktueller Kontostand aus Buchhaltung
 *
 * Diese Werte werden nur verwendet wenn:
 * - Die Google Apps Script API nicht erreichbar ist
 * - Im Development-Modus (USE_MOCK_DATA=true)
 * 
 * WICHTIG: Bei Änderungen des Kontostands hier aktualisieren!
 * Alternativ: src/data/current-season.ts für zentrale Pflege nutzen.
 */
export const FALLBACK_DASHBOARD: DashboardValues = {
  einnahmenKonto: 1012.30,
  einnahmenBargeld: 0,
  einnahmenGesamt: 1012.30,
  ausgabenKonto: 0,
  ausgabenBargeld: 0,
  ausgabenUebergeben: 0,  // Noch keine Übergaben in 2026
  ausgabenGesamt: 0,
  saldo: 1012.30,  // Aktueller Kontostand 2026
  jahr: 2026,
  lastUpdated: '2026-01-23',
};
