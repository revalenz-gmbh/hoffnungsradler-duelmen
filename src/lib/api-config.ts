// API-Konfiguration für Google Apps Script
// Hoffnungsradler Dülmen e.V.

/**
 * Google Apps Script Web-App URL
 * 
 * SETUP-ANLEITUNG:
 * ================
 * 
 * 1. Google Apps Script deployen:
 *    - Öffne das Google Sheet
 *    - Erweiterungen → Apps Script
 *    - Bereitstellen → Neue Bereitstellung → Web-App
 *    - Ausführen als: Ich
 *    - Zugriff: Jeder
 *    - URL kopieren
 * 
 * 2. URL konfigurieren (eine Option wählen):
 * 
 *    Option A - Umgebungsvariable (.env Datei):
 *    VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/DEINE_ID/exec
 * 
 *    Option B - Direkt hier eintragen:
 *    Ersetze '' unten mit deiner Web-App URL
 * 
 * Ausführliche Anleitung: docs/GOOGLE_APPS_SCRIPT_SETUP.md
 */

// Web-App URL - entweder aus Umgebungsvariable oder direkt hier eintragen
export const GOOGLE_APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL || '';

// Mock-Daten verwenden wenn:
// - Keine Apps Script URL konfiguriert ist
// - Im Development-Modus (kann überschrieben werden mit VITE_USE_LIVE_API=true)
const forceLiveApi = import.meta.env.VITE_USE_LIVE_API === 'true';
export const USE_MOCK_DATA = !GOOGLE_APPS_SCRIPT_URL || (import.meta.env.DEV && !forceLiveApi);

// Debug-Modus für API-Calls
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

