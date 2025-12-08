// API-Konfiguration für Google Apps Script
// Hoffnungsradler Dülmen e.V.

/**
 * API-Proxy Konfiguration
 *
 * SICHERHEIT:
 * ===========
 * Die Google Apps Script URL wird NICHT mehr im Browser exponiert.
 * Stattdessen läuft der gesamte Verkehr über einen Vercel API-Proxy.
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
 * 2. URL konfigurieren auf Vercel:
 *    - Vercel Dashboard → Project Settings → Environment Variables
 *    - Neue Variable: GOOGLE_APPS_SCRIPT_URL
 *    - Wert: https://script.google.com/macros/s/DEINE_ID/exec
 *    - Redeploy triggern
 *
 * 3. Lokal testen (.env Datei - NICHT committen!):
 *    GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/DEINE_ID/exec
 *    VITE_USE_LIVE_API=true
 *
 * Ausführliche Anleitung: docs/GOOGLE_APPS_SCRIPT_SETUP.md
 */

// API Base URL - nutzt Vercel Serverless Function als Proxy
const API_BASE_URL = import.meta.env.DEV
  ? 'http://localhost:3000/api'  // Development (falls lokal getestet)
  : '/api';  // Production (Vercel)

// Mock-Daten verwenden wenn im Development-Modus (außer explizit deaktiviert)
const forceLiveApi = import.meta.env.VITE_USE_LIVE_API === 'true';
export const USE_MOCK_DATA = import.meta.env.DEV && !forceLiveApi;

// Debug-Modus für API-Calls
export const DEBUG_API = import.meta.env.DEV;

/**
 * API-Endpunkte (über sicheren Proxy)
 * Die Google Apps Script URL ist für den Browser nicht sichtbar
 */
export const API_ENDPOINTS = {
  getDashboard: `${API_BASE_URL}/buchhaltung?action=getDashboard`,
  getUebergabeSummen: `${API_BASE_URL}/buchhaltung?action=getUebergabeSummen`,
  getAllYearlyData: `${API_BASE_URL}/buchhaltung?action=getAllYearlyData`,
  getJahresabschluss: (year: number) => `${API_BASE_URL}/buchhaltung?action=getJahresabschluss&year=${year}`,
} as const;

