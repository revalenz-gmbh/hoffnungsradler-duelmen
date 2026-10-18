/**
 * Vercel Serverless Function - Spendenstand aus dem Bankabruf
 *
 * Liest die kleine JSON-Datei, die der Kontoexport täglich in eine öffentliche Nextcloud-
 * Freigabe legt (nur Spendenstand und Abrufzeitpunkt, nie der Kontostand), und reicht sie
 * geprüft weiter. Ist nichts konfiguriert oder die Datei unbrauchbar, antwortet die Funktion
 * mit einem Fehler - die Seite fällt dann auf den Wert aus dem Google Sheet zurück.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

const QUELLE = process.env.SPENDENSTAND_URL || '';
const TIMEOUT_MS = 8000;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!QUELLE) {
    return res.status(503).json({ error: 'Service not configured' });
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const antwort = await fetch(QUELLE, { headers: { Accept: 'application/json' }, signal: controller.signal });
    if (!antwort.ok) {
      throw new Error(`Quelle antwortet mit ${antwort.status}`);
    }
    const daten: unknown = await antwort.json();
    const d = daten as { spendenstand?: unknown; abruf?: unknown };
    const abruf = typeof d.abruf === 'string' ? new Date(d.abruf) : null;
    if (
      typeof d.spendenstand !== 'number' || !Number.isFinite(d.spendenstand) || d.spendenstand < 0 ||
      !abruf || Number.isNaN(abruf.getTime())
    ) {
      throw new Error('Quelle liefert kein gültiges Format');
    }
    // Zehn Minuten teilen sich alle Besucher einen Abruf; der Kontoexport läuft ohnehin nur täglich.
    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=3600');
    return res.status(200).json({ spendenstand: d.spendenstand, abruf: abruf.toISOString() });
  } catch (error) {
    console.error('[API Spendenstand]', error instanceof Error ? error.message : error);
    return res.status(502).json({ error: 'Spendenstand nicht verfügbar' });
  } finally {
    clearTimeout(timer);
  }
}
