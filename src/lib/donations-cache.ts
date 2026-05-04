/**
 * Caching-System für Spendendaten
 * 
 * Verwendet LocalStorage mit TTL (Time-To-Live) für Browser-Caching
 * Cache-Key Format: donations:${action}:${year?}
 * TTL: 5 Minuten (300 Sekunden)
 */

const CACHE_PREFIX = 'donations';
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 Minuten

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

/**
 * Generiert einen Cache-Key
 */
function getCacheKey(action: string, year?: number): string {
  if (year) {
    return `${CACHE_PREFIX}:${action}:${year}`;
  }
  return `${CACHE_PREFIX}:${action}`;
}

/**
 * Prüft ob LocalStorage verfügbar ist
 */
function isLocalStorageAvailable(): boolean {
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * Speichert Daten im Cache
 * @param ttlMs Optional: eigene Gültigkeit in ms (Standard: 5 Min.). Für Buchhaltungs-API kurz halten.
 */
export function setCache<T>(action: string, data: T, year?: number, ttlMs?: number): void {
  if (!isLocalStorageAvailable()) {
    return;
  }

  try {
    const key = getCacheKey(action, year);
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttlMs !== undefined && ttlMs >= 0 ? ttlMs : CACHE_TTL_MS,
    };
    localStorage.setItem(key, JSON.stringify(entry));
  } catch (error) {
    console.warn('[Cache] Failed to set cache:', error);
  }
}

/**
 * Liest Daten aus dem Cache
 * Gibt null zurück wenn Cache abgelaufen oder nicht vorhanden
 */
export function getCache<T>(action: string, year?: number): T | null {
  if (!isLocalStorageAvailable()) {
    return null;
  }

  try {
    const key = getCacheKey(action, year);
    const cached = localStorage.getItem(key);
    
    if (!cached) {
      return null;
    }

    const entry: CacheEntry<T> = JSON.parse(cached);
    const now = Date.now();
    const age = now - entry.timestamp;

    // Cache abgelaufen?
    if (age > entry.ttl) {
      localStorage.removeItem(key);
      return null;
    }

    return entry.data;
  } catch (error) {
    console.warn('[Cache] Failed to get cache:', error);
    // Bei Fehler: Cache-Eintrag entfernen
    try {
      const key = getCacheKey(action, year);
      localStorage.removeItem(key);
    } catch {
      // Ignorieren
    }
    return null;
  }
}

/**
 * Entfernt einen Cache-Eintrag
 */
export function clearCache(action: string, year?: number): void {
  if (!isLocalStorageAvailable()) {
    return;
  }

  try {
    const key = getCacheKey(action, year);
    localStorage.removeItem(key);
  } catch (error) {
    console.warn('[Cache] Failed to clear cache:', error);
  }
}

/**
 * Entfernt alle Cache-Einträge für Spendendaten
 */
export function clearAllCache(): void {
  if (!isLocalStorageAvailable()) {
    return;
  }

  try {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(CACHE_PREFIX + ':')) {
        keys.push(key);
      }
    }
    keys.forEach(key => localStorage.removeItem(key));
  } catch (error) {
    console.warn('[Cache] Failed to clear all cache:', error);
  }
}

/**
 * Prüft ob ein Cache-Eintrag existiert und noch gültig ist
 */
export function hasValidCache(action: string, year?: number): boolean {
  return getCache(action, year) !== null;
}

