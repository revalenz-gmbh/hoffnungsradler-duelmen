/**
 * Eigener Webserver für das Selbsthosten (Proxmox), ersetzt Vercel.
 *
 * - liefert die gebaute Website aus `dist/` aus (mit Komprimierung, Cache-Regeln,
 *   Range-Anfragen für Videos und SPA-Fallback auf index.html)
 * - bindet die vorhandenen Funktionen aus `api/` unverändert ein (Node 24 lädt die
 *   .ts-Dateien direkt, weil sie nur entfernbare Typ-Syntax enthalten)
 * - bildet den CDN-Cache von Vercel nach (`s-maxage`, `stale-while-revalidate`),
 *   damit nicht jeder Besucher die Datenquelle abruft
 *
 * Keine zusätzlichen Pakete. Start: `npm start` (nach `npm run build`).
 *
 * Umgebungsvariablen:
 *   PORT                  Port (Standard 3000)
 *   HOST                  Adresse (Standard 0.0.0.0)
 *   VORSCHAU=1            Vorschau-Instanz: Suchmaschinen per X-Robots-Tag aussperren
 *   SPENDENSTAND_URL, GOOGLE_APPS_SCRIPT_URL, BUCHHALTUNG_FETCH_TIMEOUT_MS,
 *   TOUREN_APPS_SCRIPT_URL                                                 für api/
 */

import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { readFile, stat } from 'node:fs/promises';
import { dirname, extname, join, normalize, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { brotliCompress, gzip, constants as zlibConstants } from 'node:zlib';
import { promisify } from 'node:util';

const WURZEL = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(WURZEL, 'dist');
const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || '0.0.0.0';
const VORSCHAU = process.env.VORSCHAU === '1';

const brotli = promisify(brotliCompress);
const gzipAsync = promisify(gzip);

// Nur diese Funktionen aus api/ sind erreichbar (Dateien mit _ sind keine Funktionen)
const API_FUNKTIONEN = new Set(['spendenstand', 'buchhaltung', 'touren']);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.pdf': 'application/pdf',
  '.gpx': 'application/gpx+xml',
};
const KOMPRIMIERBAR = new Set(['.html', '.js', '.mjs', '.css', '.json', '.xml', '.txt', '.svg', '.ico', '.gpx']);

function sicherheitsHeader(res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), interest-cohort=()');
  if (VORSCHAU) res.setHeader('X-Robots-Tag', 'noindex, nofollow');
}

function protokoll(req, status, start) {
  const ms = Date.now() - start;
  // Nur der Pfad, ohne Parameter: Der Newsletter-Abmeldelink trägt die E-Mail-Adresse in der Adresse
  const pfad = (req.url || '/').split('?')[0];
  console.log(`${req.method} ${pfad} ${status} ${ms}ms`);
}

/* ------------------------------------------------------------------ */
/* API: Vercel-Handler mit Express-artigem req/res aufrufen            */
/* ------------------------------------------------------------------ */

const handlerCache = new Map();
async function ladeHandler(name) {
  if (!handlerCache.has(name)) {
    const modul = await import(pathToFileURL(join(WURZEL, 'api', `${name}.ts`)).href);
    handlerCache.set(name, modul.default);
  }
  return handlerCache.get(name);
}

/** Führt einen Handler aus und sammelt die Antwort, statt sie direkt zu senden. */
async function fuehreHandlerAus(name, req, url) {
  const handler = await ladeHandler(name);

  const query = {};
  for (const [k, v] of url.searchParams) {
    query[k] = k in query ? [].concat(query[k], v) : v;
  }
  const cookies = Object.fromEntries(
    (req.headers.cookie || '').split(';').map((c) => c.trim()).filter(Boolean).map((c) => {
      const i = c.indexOf('=');
      return [c.slice(0, i), decodeURIComponent(c.slice(i + 1))];
    }),
  );

  const ergebnis = { status: 200, headers: {}, body: '' };

  // Vercel ergänzt req um query, cookies und body (bei GET leer)
  Object.assign(req, { query, cookies, body: undefined });
  const fakeRes = {
    statusCode: 200,
    setHeader(k, v) { ergebnis.headers[k.toLowerCase()] = v; return this; },
    getHeader(k) { return ergebnis.headers[k.toLowerCase()]; },
    removeHeader(k) { delete ergebnis.headers[k.toLowerCase()]; },
    status(code) { ergebnis.status = code; this.statusCode = code; return this; },
    json(daten) {
      if (!ergebnis.headers['content-type']) ergebnis.headers['content-type'] = 'application/json; charset=utf-8';
      return this.send(JSON.stringify(daten));
    },
    send(daten) {
      ergebnis.body = typeof daten === 'string' || Buffer.isBuffer(daten) ? daten : JSON.stringify(daten);
      return this;
    },
    end(daten) {
      if (daten !== undefined) ergebnis.body = daten;
      return this;
    },
  };

  // Die Handler antworten immer vor dem Ende ihres Promise (return res.status(..).json(..))
  await handler(req, fakeRes);
  ergebnis.status = fakeRes.statusCode;
  return ergebnis;
}

// Nachbau des Vercel-CDN-Caches: nur GET, nur Antworten mit s-maxage
const apiCache = new Map(); // url -> { ergebnis, frischBis, staleBis, laedt }

function cacheZeiten(cc) {
  if (!cc) return null;
  const s = /s-maxage=(\d+)/.exec(cc);
  if (!s) return null;
  const swr = /stale-while-revalidate=(\d+)/.exec(cc);
  return { frisch: Number(s[1]) * 1000, stale: swr ? Number(swr[1]) * 1000 : 0 };
}

async function holeUndCache(name, req, url, schluessel) {
  const ergebnis = await fuehreHandlerAus(name, req, url);
  const zeiten = ergebnis.status === 200 ? cacheZeiten(ergebnis.headers['cache-control']) : null;
  if (zeiten) {
    const jetzt = Date.now();
    apiCache.set(schluessel, { ergebnis, frischBis: jetzt + zeiten.frisch, staleBis: jetzt + zeiten.frisch + zeiten.stale });
  }
  return ergebnis;
}

async function bearbeiteApi(name, req, res, url) {
  let ergebnis;
  let cacheStatus = 'BYPASS';
  const schluessel = `${name}?${url.searchParams.toString()}`;

  if (req.method === 'GET' || req.method === 'HEAD') {
    const eintrag = apiCache.get(schluessel);
    const jetzt = Date.now();
    if (eintrag && jetzt < eintrag.frischBis) {
      ergebnis = eintrag.ergebnis;
      cacheStatus = 'HIT';
    } else if (eintrag && jetzt < eintrag.staleBis) {
      ergebnis = eintrag.ergebnis;
      cacheStatus = 'STALE';
      if (!eintrag.laedt) {
        eintrag.laedt = true;
        holeUndCache(name, req, url, schluessel)
          .catch((e) => console.error('[API-Cache] Aktualisierung fehlgeschlagen:', e?.message || e))
          .finally(() => { eintrag.laedt = false; });
      }
    } else {
      ergebnis = await holeUndCache(name, req, url, schluessel);
      cacheStatus = 'MISS';
    }
  } else {
    ergebnis = await fuehreHandlerAus(name, req, url);
  }

  for (const [k, v] of Object.entries(ergebnis.headers)) {
    // s-maxage gilt nur für unseren Cache; Browser sollen nicht zusätzlich lange cachen
    if (k === 'cache-control' && /s-maxage/.test(v)) continue;
    res.setHeader(k, v);
  }
  if (!ergebnis.headers['cache-control'] || /s-maxage/.test(ergebnis.headers['cache-control'])) {
    res.setHeader('Cache-Control', 'no-cache');
  }
  res.setHeader('X-Cache', cacheStatus);
  res.writeHead(ergebnis.status);
  res.end(req.method === 'HEAD' ? undefined : ergebnis.body);
  return ergebnis.status;
}

/* ------------------------------------------------------------------ */
/* Statische Dateien                                                   */
/* ------------------------------------------------------------------ */

const komprimiertCache = new Map(); // pfad|kodierung -> { mtime, daten }

function cacheRegel(relPfad) {
  if (relPfad === '/index.html') return 'no-cache';
  if (relPfad.startsWith('/assets/')) return 'public, max-age=31536000, immutable';
  return 'public, max-age=86400';
}

async function findeDatei(pfadname) {
  let rel;
  try {
    rel = decodeURIComponent(pfadname);
  } catch {
    return null;
  }
  if (rel.includes('\0')) return null;
  const voll = normalize(join(DIST, rel));
  if (voll !== DIST && !voll.startsWith(DIST + sep)) return null; // kein Ausbruch aus dist/
  try {
    const s = await stat(voll);
    if (s.isFile()) return { voll, rel: rel.replace(/\\/g, '/'), stat: s };
    if (s.isDirectory()) {
      const index = join(voll, 'index.html');
      const si = await stat(index).catch(() => null);
      if (si?.isFile()) return { voll: index, rel: `${rel.replace(/\/$/, '')}/index.html`, stat: si };
    }
  } catch {
    /* nicht gefunden */
  }
  return null;
}

async function sendeDatei(req, res, datei, status = 200) {
  const ext = extname(datei.voll).toLowerCase();
  const typ = MIME[ext] || 'application/octet-stream';
  const etag = `W/"${datei.stat.size.toString(16)}-${Math.floor(datei.stat.mtimeMs).toString(16)}"`;
  res.setHeader('Content-Type', typ);
  res.setHeader('Cache-Control', status === 200 ? cacheRegel(datei.rel) : 'no-cache');
  res.setHeader('ETag', etag);
  res.setHeader('Last-Modified', datei.stat.mtime.toUTCString());
  res.setHeader('Vary', 'Accept-Encoding');

  if (status === 200 && req.headers['if-none-match'] === etag) {
    res.writeHead(304);
    res.end();
    return 304;
  }

  // Komprimierte Auslieferung für Text (im Speicher gehalten, die Dateien ändern sich nur beim Ausrollen)
  const akzeptiert = req.headers['accept-encoding'] || '';
  const kodierung = KOMPRIMIERBAR.has(ext) ? (/\bbr\b/.test(akzeptiert) ? 'br' : /\bgzip\b/.test(akzeptiert) ? 'gzip' : null) : null;
  if (kodierung) {
    const schluessel = `${datei.voll}|${kodierung}`;
    let eintrag = komprimiertCache.get(schluessel);
    if (!eintrag || eintrag.mtime !== datei.stat.mtimeMs) {
      const roh = await readFile(datei.voll);
      const daten = kodierung === 'br'
        ? await brotli(roh, { params: { [zlibConstants.BROTLI_PARAM_QUALITY]: 9 } })
        : await gzipAsync(roh, { level: 9 });
      eintrag = { mtime: datei.stat.mtimeMs, daten };
      komprimiertCache.set(schluessel, eintrag);
    }
    res.setHeader('Content-Encoding', kodierung);
    res.setHeader('Content-Length', eintrag.daten.length);
    res.writeHead(status);
    res.end(req.method === 'HEAD' ? undefined : eintrag.daten);
    return status;
  }

  // Range-Anfragen (Videos, v. a. Safari)
  res.setHeader('Accept-Ranges', 'bytes');
  const groesse = datei.stat.size;
  const range = status === 200 ? /^bytes=(\d*)-(\d*)$/.exec(req.headers.range || '') : null;
  if (range) {
    let start = range[1] === '' ? groesse - Number(range[2]) : Number(range[1]);
    let ende = range[1] === '' || range[2] === '' ? groesse - 1 : Number(range[2]);
    start = Math.max(0, start);
    ende = Math.min(ende, groesse - 1);
    if (start > ende || start >= groesse) {
      res.setHeader('Content-Range', `bytes */${groesse}`);
      res.writeHead(416);
      res.end();
      return 416;
    }
    res.setHeader('Content-Range', `bytes ${start}-${ende}/${groesse}`);
    res.setHeader('Content-Length', ende - start + 1);
    res.writeHead(206);
    if (req.method === 'HEAD') { res.end(); return 206; }
    createReadStream(datei.voll, { start, end: ende }).pipe(res);
    return 206;
  }

  res.setHeader('Content-Length', groesse);
  res.writeHead(status);
  if (req.method === 'HEAD') { res.end(); return status; }
  createReadStream(datei.voll).pipe(res);
  return status;
}

/* ------------------------------------------------------------------ */
/* Server                                                              */
/* ------------------------------------------------------------------ */

const server = createServer(async (req, res) => {
  const start = Date.now();
  let status = 500;
  try {
    sicherheitsHeader(res);
    const url = new URL(req.url || '/', 'http://localhost');
    const pfad = url.pathname;

    if (pfad === '/healthz') {
      res.setHeader('Cache-Control', 'no-store');
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.writeHead(200);
      res.end('ok');
      return; // nicht protokollieren (wird minütlich abgefragt)
    }

    const api = /^\/api\/([a-z0-9-]+)\/?$/.exec(pfad);
    if (api) {
      if (!API_FUNKTIONEN.has(api[1])) {
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Not found' }));
        status = 404;
      } else {
        status = await bearbeiteApi(api[1], req, res, url);
      }
      return;
    }
    if (pfad.startsWith('/api/')) {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.writeHead(404);
      res.end(JSON.stringify({ error: 'Not found' }));
      status = 404;
      return;
    }

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.setHeader('Allow', 'GET, HEAD');
      res.writeHead(405);
      res.end();
      status = 405;
      return;
    }

    const datei = await findeDatei(pfad);
    if (datei) {
      status = await sendeDatei(req, res, datei);
      return;
    }

    // Fehlende Datei mit Endung (Bild, Skript …) ist ein echter 404, keine Seite
    if (extname(pfad)) {
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('Cache-Control', 'no-cache');
      res.writeHead(404);
      res.end('Nicht gefunden');
      status = 404;
      return;
    }

    // SPA-Fallback: React Router übernimmt (auch die eigene 404-Seite)
    const index = await findeDatei('/index.html');
    if (!index) {
      res.writeHead(503);
      res.end('Website ist noch nicht gebaut (npm run build).');
      status = 503;
      return;
    }
    status = await sendeDatei(req, res, index);
  } catch (fehler) {
    console.error('[Server] Fehler:', fehler);
    if (!res.headersSent) {
      res.writeHead(500);
      res.end('Interner Fehler');
    } else {
      res.end();
    }
    status = 500;
  } finally {
    if (req.url !== '/healthz') protokoll(req, status, start);
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Hoffnungsradler-Website läuft auf http://${HOST}:${PORT}${VORSCHAU ? ' (Vorschau, noindex)' : ''}`);
});

for (const signal of ['SIGTERM', 'SIGINT']) {
  process.on(signal, () => {
    console.log(`${signal} empfangen, beende …`);
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(0), 5000).unref();
  });
}
