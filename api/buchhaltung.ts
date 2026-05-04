/**
 * Vercel Serverless Function - API Proxy für Google Apps Script
 *
 * Verbirgt die Google Apps Script URL vor dem Client-Browser
 * und behandelt CORS-Probleme
 * 
 * Features:
 * - Whitelist für erlaubte Actions
 * - Timeout für Google Apps Script Calls
 * - Response-Validierung (Basis-Checks)
 * - Bessere Fehlerbehandlung
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

// Google Apps Script URL aus Umgebungsvariable
const GOOGLE_APPS_SCRIPT_URL = process.env.GOOGLE_APPS_SCRIPT_URL || '';

// Timeout für Google Apps Script Calls (8 Sekunden)
const FETCH_TIMEOUT_MS = 8000;

// Erlaubte Actions (Whitelist)
const ALLOWED_ACTIONS = [
  'getDashboard',
  'getUebergabeSummen',
  'getAllYearlyData',
  'getJahresabschluss'
] as const;

/**
 * Erstellt einen fetch mit Timeout
 */
async function fetchWithTimeout(url: string, options: RequestInit, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error;
  }
}

/**
 * Validiert dass die Response ein gültiges JSON-Objekt ist
 */
function isValidJsonResponse(data: unknown): data is Record<string, unknown> {
  return typeof data === 'object' && data !== null && !Array.isArray(data);
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // CORS Headers setzen
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Nur GET-Anfragen erlauben
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Prüfe ob Google Apps Script URL konfiguriert ist
  if (!GOOGLE_APPS_SCRIPT_URL) {
    console.warn('[API Proxy] Google Apps Script URL not configured');
    return res.status(503).json({
      error: 'Service not configured',
      message: 'Google Apps Script URL not set'
    });
  }

  try {
    // Extrahiere action Parameter
    const { action } = req.query;

    if (!action || typeof action !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid action parameter' });
    }

    // Nur erlaubte Actions durchlassen (Whitelist)
    if (!ALLOWED_ACTIONS.includes(action as typeof ALLOWED_ACTIONS[number])) {
      console.warn(`[API Proxy] Disallowed action: ${action}`);
      return res.status(403).json({ error: 'Action not allowed' });
    }

    // Validiere year Parameter für getJahresabschluss
    if (action === 'getJahresabschluss') {
      const year = req.query.year;
      if (year) {
        const yearNum = typeof year === 'string' ? parseInt(year, 10) : NaN;
        if (isNaN(yearNum) || yearNum < 2004 || yearNum > 2100) {
          return res.status(400).json({ error: 'Invalid year parameter' });
        }
      }
    }

    // Baue die vollständige URL
    let targetUrl = `${GOOGLE_APPS_SCRIPT_URL}?action=${action}`;

    // Füge zusätzliche Parameter hinzu (z.B. year für getJahresabschluss)
    if (action === 'getJahresabschluss' && req.query.year) {
      targetUrl += `&year=${req.query.year}`;
    }

    // Rufe Google Apps Script auf (mit Timeout)
    const response = await fetchWithTimeout(
      targetUrl,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      },
      FETCH_TIMEOUT_MS
    );

    if (!response.ok) {
      console.error(`[API Proxy] Google Apps Script returned ${response.status}: ${response.statusText}`);
      throw new Error(`Google Apps Script returned ${response.status}: ${response.statusText}`);
    }

    // Parse JSON mit Fehlerbehandlung
    let data: unknown;
    try {
      data = await response.json();
    } catch (parseError) {
      console.error('[API Proxy] Failed to parse JSON response:', parseError);
      throw new Error('Invalid JSON response from Google Apps Script');
    }

    // Basis-Validierung: Muss ein Objekt sein
    if (!isValidJsonResponse(data)) {
      console.error('[API Proxy] Response is not a valid JSON object');
      throw new Error('Invalid response format from Google Apps Script');
    }

    // Kein CDN-/Browser-Caching: Daten kommen live aus Google Sheets
    res.setHeader('Cache-Control', 'private, no-store');

    return res.status(200).json(data);

  } catch (error) {
    console.error('[API Proxy] Error:', error);
    
    // Spezifische Fehlermeldungen
    if (error instanceof Error) {
      if (error.message === 'Request timeout') {
        return res.status(504).json({
          error: 'Gateway timeout',
          message: 'Google Apps Script did not respond in time'
        });
      }
      
      return res.status(500).json({
        error: 'Internal server error',
        message: error.message
      });
    }
    
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Unknown error'
    });
  }
}
