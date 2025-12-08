/**
 * Vercel Serverless Function - API Proxy für Google Apps Script
 *
 * Verbirgt die Google Apps Script URL vor dem Client-Browser
 * und behandelt CORS-Probleme
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

// Google Apps Script URL aus Umgebungsvariable
const GOOGLE_APPS_SCRIPT_URL = process.env.GOOGLE_APPS_SCRIPT_URL || '';

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
    return res.status(503).json({
      error: 'Service not configured',
      message: 'Google Apps Script URL not set'
    });
  }

  try {
    // Extrahiere action Parameter
    const { action } = req.query;

    if (!action || typeof action !== 'string') {
      return res.status(400).json({ error: 'Missing action parameter' });
    }

    // Nur erlaubte Actions durchlassen (Whitelist)
    const allowedActions = [
      'getDashboard',
      'getUebergabeSummen',
      'getAllYearlyData',
      'getJahresabschluss'
    ];

    if (!allowedActions.includes(action)) {
      return res.status(403).json({ error: 'Action not allowed' });
    }

    // Baue die vollständige URL
    let targetUrl = `${GOOGLE_APPS_SCRIPT_URL}?action=${action}`;

    // Füge zusätzliche Parameter hinzu (z.B. year für getJahresabschluss)
    if (action === 'getJahresabschluss' && req.query.year) {
      targetUrl += `&year=${req.query.year}`;
    }

    // Rufe Google Apps Script auf
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Google Apps Script returned ${response.status}`);
    }

    const data = await response.json();

    // Cache-Control Header für bessere Performance
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');

    return res.status(200).json(data);

  } catch (error) {
    console.error('API Proxy Error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
