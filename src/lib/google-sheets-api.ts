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
 * Stand: 07.12.2025 (aus Dashboard-Screenshot)
 * 
 * Diese Werte werden nur verwendet wenn:
 * - Die Google Apps Script API nicht erreichbar ist
 * - Im Development-Modus (USE_MOCK_DATA=true)
 */
export const FALLBACK_DASHBOARD: DashboardValues = {
  einnahmenKonto: 7939.00,
  einnahmenBargeld: 2262.00,
  einnahmenGesamt: 10201.00,
  ausgabenKonto: 253.88,
  ausgabenBargeld: 0,
  ausgabenUebergeben: 10000.00,  // 2x Spendenübergabe à 5.000€
  ausgabenGesamt: 10253.88,
  saldo: 60.13,  // Endbestand Geldmittel
  jahr: 2025,
  lastUpdated: '2025-12-07',
};
