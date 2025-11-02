// API-Konfiguration für Google Apps Script
// Hoffnungsradler Dülmen e.V.

/**
 * Google Apps Script Web-App URL
 * 
 * WICHTIG: Diese URL muss nach dem Deployment des Google Apps Scripts aktualisiert werden!
 * 
 * Deployment-Anleitung:
 * 1. Apps Script Editor öffnen (Erweiterungen → Apps Script)
 * 2. Bereitstellen → Neue Bereitstellung
 * 3. Typ: Web-App
 * 4. Ausführen als: Ich
 * 5. Zugriff: Jeder
 * 6. URL kopieren und hier eintragen
 */

export const GOOGLE_APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL || '';

// Für lokale Entwicklung: Fallback auf Mock-Daten
export const USE_MOCK_DATA = !GOOGLE_APPS_SCRIPT_URL || import.meta.env.DEV;

// Debug-Modus
export const DEBUG_API = import.meta.env.DEV;

/**
 * API-Endpunkte
 */
export const API_ENDPOINTS = {
  getDashboard: `${GOOGLE_APPS_SCRIPT_URL}?action=getDashboard`,
  getUebergabeSummen: `${GOOGLE_APPS_SCRIPT_URL}?action=getUebergabeSummen`,
  getAllYearlyData: `${GOOGLE_APPS_SCRIPT_URL}?action=getAllYearlyData`,
  getJahresabschluss: (year: number) => `${GOOGLE_APPS_SCRIPT_URL}?action=getJahresabschluss&year=${year}`,
} as const;

