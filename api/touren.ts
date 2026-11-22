/**
 * Tour-Archiv aus der Tourverwaltung (Google Apps Script), über unseren Server geleitet.
 *
 * Vorher hat der Browser das Apps Script direkt aufgerufen: Google bekam die IP-Adresse
 * jedes Besuchers, und die Adresse des Scripts stand öffentlich im Quelltext. Jetzt ruft
 * nur unser Server ab (Umgebungsvariable TOUREN_APPS_SCRIPT_URL), reicht nur die
 * benötigten Felder weiter und hält das Ergebnis eine Stunde vor.
 *
 * Läuft auf Vercel und auf dem eigenen Server (server/server.mjs) gleich.
 */

import type { VercelRequest, VercelResponse } from './_vercel-types.js';

const QUELLE = process.env.TOUREN_APPS_SCRIPT_URL || '';
// Das Apps Script braucht nach einer Ruhephase bis zu ~55 s (Kaltstart)
const TIMEOUT_MS = Number(process.env.TOUREN_FETCH_TIMEOUT_MS) || 55000;

interface Tour {
  name: string;
  distance: string;
  year: number | null;
  downloadUrl: string;
}

function bereinige(eintrag: unknown): Tour | null {
  if (typeof eintrag !== 'object' || eintrag === null) return null;
  const e = eintrag as Record<string, unknown>;
  const name = e.name === undefined || e.name === null ? '' : String(e.name).trim();
  const downloadUrl = typeof e.downloadUrl === 'string' ? e.downloadUrl : '';
  if (!name || !/^https:\/\//.test(downloadUrl)) return null;
  const jahr = Number(e.year);
  return {
    name,
    distance: e.distance === undefined || e.distance === null ? '' : String(e.distance),
    year: Number.isInteger(jahr) && jahr > 1990 && jahr < 2200 ? jahr : null,
    downloadUrl,
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
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
    if (!Array.isArray(daten)) {
      throw new Error('Quelle liefert keine Liste');
    }
    const touren = daten.map(bereinige).filter((t): t is Tour => t !== null);

    // Eine Stunde für alle Besucher gemeinsam; danach noch einen Tag lang der alte Stand,
    // während im Hintergrund neu geladen wird (überbrückt den Kaltstart des Apps Script)
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
    return res.status(200).json(touren);
  } catch (error) {
    const grund = error instanceof Error && error.name === 'AbortError' ? 'Zeitüberschreitung' : error instanceof Error ? error.message : String(error);
    console.error('[API Touren]', grund);
    return res.status(502).json({ error: 'Touren nicht verfügbar' });
  } finally {
    clearTimeout(timer);
  }
}
