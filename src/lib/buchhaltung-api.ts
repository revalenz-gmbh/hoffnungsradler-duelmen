/**
 * Buchhaltungs-API für Google Apps Script Integration
 * Hoffnungsradler Dülmen e.V.
 * 
 * Features:
 * - Schema-Validierung mit Zod
 * - LocalStorage-Caching (TTL: 5 Minuten)
 * - Konsistente Fehlerbehandlung
 * - Automatische Berechnung: historische + aktuelle Spenden
 */

import { API_ENDPOINTS, USE_MOCK_DATA, DEBUG_API } from './api-config';
import { 
  historicalDonations, 
  HISTORICAL_TOTAL, 
  HISTORICAL_DONATIONS_MAP,
  HISTORICAL_MAX_YEAR
} from '@/data/donations';
import { FALLBACK_DASHBOARD } from './google-sheets-api';
import {
  validateDashboardData,
  validateUebergabeSummen,
  validateAllYearlyData,
  validateJahresabschluss,
  type DashboardData,
  type UebergabeSummen,
  type AllYearlyData,
  type Jahresabschluss,
} from './donations-validator';
import {
  getCache,
  setCache,
  clearCache,
} from './donations-cache';
import {
  validateUebergabeSummenConsistency,
  validateAllYearlyDataConsistency,
} from './donations-consistency';

// Re-export types for backwards compatibility
export type {
  DashboardData,
  UebergabeSummen,
  AllYearlyData,
  Jahresabschluss,
};

// ============================================================================
// MOCK DATA (für Entwicklung ohne Google Sheets)
// ============================================================================

/**
 * Mock-Dashboard für 2026 (neues Jahr - Nullstand)
 * Wird nur verwendet wenn USE_MOCK_DATA=true oder API nicht erreichbar
 */
const mockDashboard: DashboardData = {
  year: 2026,
  einnahmen: {
    konto: { anzahl: 0, summe: 0, letzter: '' },
    bargeld: { anzahl: 0, summe: 0, letzter: '' },
    gesamt: 0
  },
  ausgaben: {
    allgemein: { anzahl: 0, summe: 0, letzter: '' },
    uebergeben: { anzahl: 0, summe: 0, letzter: '' },
    gesamt: 0
  },
  saldo: 0,
  quittungen: {
    konto: { ausgestellt: 0, offen: 0 },
    bargeld: { ausgestellt: 0, offen: 0 }
  }
};

/**
 * Erstellt Mock-Übergabe-Summen basierend auf historischen Daten
 * Verwendet HISTORICAL_DONATIONS_MAP (enthält alle abgeschlossenen Jahre inkl. 2025)
 */
async function createMockUebergabeSummen(): Promise<UebergabeSummen> {
  const { TOTAL_DONATIONS } = await import('@/data/donations');

  // Historische Daten (2004-2025) aus hardcodierten Daten
  // Das aktuelle Jahr (2026+) kommt von der API, wenn verfügbar
  return {
    summen: { ...HISTORICAL_DONATIONS_MAP },
    gesamt: TOTAL_DONATIONS
  };
}

/**
 * Erstellt Mock-Jahresdaten
 * Verwendet historicalDonations (enthält alle abgeschlossenen Jahre inkl. 2025)
 */
async function createMockAllYearlyData(): Promise<AllYearlyData> {
  const { TOTAL_DONATIONS } = await import('@/data/donations');
  const currentYear = new Date().getFullYear();

  // Historische Daten (2004-2025) aus hardcodierten Daten
  // Das aktuelle Jahr (2026+) kommt von der API, wenn verfügbar
  return {
    donations: [...historicalDonations],
    totalDonations: TOTAL_DONATIONS,
    currentYear: currentYear
  };
}

// ============================================================================
// API FUNCTIONS
// ============================================================================

/**
 * Fetch-Wrapper mit Fehlerbehandlung, Validierung und Logging
 */
async function apiFetch<T>(
  url: string, 
  validator: (data: unknown) => T,
  options?: RequestInit
): Promise<T> {
  if (DEBUG_API) {
    console.log('[API] Fetching:', url);
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (DEBUG_API) {
      console.log('[API] Response:', data);
    }

    // Validiere Response gegen Schema
    return validator(data);
  } catch (error) {
    console.error('[API] Error:', error);
    throw error;
  }
}

/**
 * Dashboard-Daten abrufen
 * 
 * Strategie:
 * 1. Prüfe Cache
 * 2. Falls nicht im Cache: API-Call
 * 3. Bei Fehler: Mock-Daten (nur im Development)
 */
export async function getDashboard(): Promise<DashboardData> {
  const cacheKey = 'getDashboard';
  
  // Prüfe Cache
  const cached = getCache<DashboardData>(cacheKey);
  if (cached) {
    if (DEBUG_API) {
      console.log('[API] Using cached dashboard data');
    }
    return cached;
  }

  // Mock-Daten im Development
  if (USE_MOCK_DATA) {
    if (DEBUG_API) {
      console.log('[API] Using mock data for dashboard');
    }
    setCache(cacheKey, mockDashboard);
    return mockDashboard;
  }

  try {
    const data = await apiFetch<DashboardData>(
      API_ENDPOINTS.getDashboard,
      validateDashboardData
    );
    
    // Cache erfolgreiche Antwort
    setCache(cacheKey, data);
    
    if (DEBUG_API) {
      console.log('[API] Successfully fetched and cached dashboard data');
    }
    
    return data;
  } catch (error) {
    console.warn('[API] Failed to fetch dashboard, using fallback');
    // Im Production: Verwende Fallback-Dashboard
    const fallback = mockDashboard;
    setCache(cacheKey, fallback); // Cache auch Fallback
    return fallback;
  }
}

/**
 * Übergebene Spenden-Summen abrufen
 * 
 * Vereinfachte Strategie:
 * - Historische Daten (2004-2024) kommen IMMER aus hardcodierten Daten
 * - Aktuelles Jahr (2025+) kommt von der API (falls verfügbar)
 * - Gesamtsumme wird NICHT dynamisch berechnet, sondern aus TOTAL_DONATIONS genommen
 */
export async function getUebergabeSummen(): Promise<UebergabeSummen> {
  const cacheKey = 'getUebergabeSummen';
  
  // Prüfe Cache
  const cached = getCache<UebergabeSummen>(cacheKey);
  if (cached) {
    if (DEBUG_API) {
      console.log('[API] Using cached Übergabe-Summen');
    }
    return cached;
  }

  // Mock-Daten im Development
  if (USE_MOCK_DATA) {
    if (DEBUG_API) {
      console.log('[API] Using mock data for Übergabe-Summen');
    }
    const mockData = await createMockUebergabeSummen();
    setCache(cacheKey, mockData);
    return mockData;
  }

  try {
    // Versuche API-Call für aktuelles Jahr
    const apiData = await apiFetch<UebergabeSummen>(
      API_ENDPOINTS.getUebergabeSummen,
      validateUebergabeSummen
    );

    // Nur Jahre NACH dem historischen Maximum von der API verwenden
    const apiYearsOnly = Object.fromEntries(
      Object.entries(apiData.summen).filter(([year]) => {
        const yearNum = parseInt(year, 10);
        return !isNaN(yearNum) && yearNum > HISTORICAL_MAX_YEAR;
      })
    );

    // Kombiniere: Historische Daten (hardcodiert) + aktuelles Jahr (API)
    const result: UebergabeSummen = {
      summen: {
        ...HISTORICAL_DONATIONS_MAP, // Historische Daten (2004-2024) - IMMER aus hardcodierten Daten
        ...apiYearsOnly, // Nur Jahre nach 2024 von der API (2025+)
      },
      gesamt: 0, // Wird aus TOTAL_DONATIONS gesetzt
    };

    // Gesamtsumme aus hardcodierter Konstante (Single Source of Truth)
    // Importiere TOTAL_DONATIONS dynamisch um zirkuläre Abhängigkeiten zu vermeiden
    const { TOTAL_DONATIONS } = await import('@/data/donations');
    result.gesamt = TOTAL_DONATIONS;

    // Cache erfolgreiche Antwort
    setCache(cacheKey, result);
    
    if (DEBUG_API) {
      console.log('[API] Successfully fetched and cached Übergabe-Summen');
      console.log('[API] Gesamtsumme (aus TOTAL_DONATIONS):', result.gesamt);
    }
    
    return result;
  } catch (error) {
    console.warn('[API] Failed to fetch Übergabe-Summen, using fallback');
    
    // Fallback: Historische Daten + Fallback für aktuelles Jahr
    const fallback = await createMockUebergabeSummen();
    setCache(cacheKey, fallback);
    return fallback;
  }
}

/**
 * Alle Jahres-Spendendaten abrufen
 * 
 * Strategie:
 * 1. Prüfe Cache
 * 2. Falls nicht im Cache: API-Call
 * 3. Kombiniere historische Daten + aktuelles Jahr
 * 4. Bei Fehler: Fallback
 */
export async function getAllYearlyData(): Promise<AllYearlyData> {
  const cacheKey = 'getAllYearlyData';
  
  // Prüfe Cache
  const cached = getCache<AllYearlyData>(cacheKey);
  if (cached) {
    if (DEBUG_API) {
      console.log('[API] Using cached yearly data');
    }
    return cached;
  }

  // Mock-Daten im Development
  if (USE_MOCK_DATA) {
    if (DEBUG_API) {
      console.log('[API] Using mock data for yearly donations');
    }
    const mockData = await createMockAllYearlyData();
    setCache(cacheKey, mockData);
    return mockData;
  }

  try {
    const apiData = await apiFetch<AllYearlyData>(
      API_ENDPOINTS.getAllYearlyData,
      validateAllYearlyData
    );

    // Stelle sicher dass alle historischen Daten enthalten sind
    // Filter: Nur Jahre NACH dem höchsten historischen Jahr von der API verwenden
    // Dies verhindert Duplikate wenn historische Daten aktualisiert werden
    const result: AllYearlyData = {
      donations: [
        ...apiData.donations.filter(d => d.year > HISTORICAL_MAX_YEAR), // Nur Jahre nach historischen Daten
        ...historicalDonations, // Historische Daten (2004-2024)
      ],
      totalDonations: 0, // Wird berechnet
      currentYear: apiData.currentYear,
    };

    // Berechne Gesamtsumme
    result.totalDonations = result.donations.reduce((sum, d) => sum + d.amount, 0);

    // Cache erfolgreiche Antwort
    setCache(cacheKey, result);
    
    // Konsistenz-Prüfung im Debug-Modus
    if (DEBUG_API) {
      const consistency = validateAllYearlyDataConsistency(result);
      if (!consistency.valid) {
        console.warn('[API] Konsistenz-Warnungen für Jahres-Daten:', consistency.errors);
      } else {
        console.log('[API] Successfully fetched and cached yearly data (konsistent)');
      }
    }
    
    return result;
  } catch (error) {
    console.warn('[API] Failed to fetch yearly data, using fallback');
    
    // Fallback: Historische Daten + Fallback für aktuelles Jahr
    const fallback = await createMockAllYearlyData();
    setCache(cacheKey, fallback); // Cache auch Fallback
    return fallback;
  }
}

/**
 * Jahresabschluss für ein bestimmtes Jahr abrufen
 */
export async function getJahresabschluss(year: number): Promise<Jahresabschluss> {
  const cacheKey = 'getJahresabschluss';
  
  // Prüfe Cache
  const cached = getCache<Jahresabschluss>(cacheKey, year);
  if (cached) {
    if (DEBUG_API) {
      console.log('[API] Using cached Jahresabschluss');
    }
    return cached;
  }

  // Mock-Daten im Development
  if (USE_MOCK_DATA) {
    if (DEBUG_API) {
      console.log('[API] Using mock data for Jahresabschluss');
    }
    const currentYear = new Date().getFullYear();
    const currentYearAmount = FALLBACK_DASHBOARD.ausgabenUebergeben;
    
    const mockData: Jahresabschluss = {
      jahr: year,
      einnahmen: {
        konto: year === currentYear ? 7939.00 : 0,
        bargeld: year === currentYear ? 2262.00 : 0,
        gesamt: year === currentYear ? 10201.00 : 0
      },
      ausgaben: {
        allgemein: year === currentYear ? 253.88 : 0,
        uebergabe: year === currentYear ? currentYearAmount : (HISTORICAL_DONATIONS_MAP[year.toString()] || 0),
        gesamt: year === currentYear ? 10253.88 : (HISTORICAL_DONATIONS_MAP[year.toString()] || 0)
      },
      saldo: year === currentYear ? 60.13 : 0,
      quittungen: {
        konto: year === currentYear ? 10 : 0,
        bargeld: year === currentYear ? 3 : 0,
        gesamt: year === currentYear ? 13 : 0
      },
      erstellt: new Date().toISOString()
    };
    
    setCache(cacheKey, mockData, year);
    return mockData;
  }

  try {
    const data = await apiFetch<Jahresabschluss>(
      API_ENDPOINTS.getJahresabschluss(year),
      validateJahresabschluss
    );
    
    // Cache erfolgreiche Antwort
    setCache(cacheKey, data, year);
    
    if (DEBUG_API) {
      console.log('[API] Successfully fetched and cached Jahresabschluss');
    }
    
    return data;
  } catch (error) {
    console.warn('[API] Failed to fetch Jahresabschluss, using fallback');
    
    // Fallback: Basis-Daten
    const currentYear = new Date().getFullYear();
    const fallback: Jahresabschluss = {
      jahr: year,
      einnahmen: {
        konto: 0,
        bargeld: 0,
        gesamt: 0
      },
      ausgaben: {
        allgemein: 0,
        uebergabe: HISTORICAL_DONATIONS_MAP[year.toString()] || 0,
        gesamt: HISTORICAL_DONATIONS_MAP[year.toString()] || 0
      },
      saldo: 0,
      quittungen: {
        konto: 0,
        bargeld: 0,
        gesamt: 0
      },
      erstellt: new Date().toISOString()
    };
    
    setCache(cacheKey, fallback, year);
    return fallback;
  }
}

/**
 * Prüft, ob die API verfügbar ist
 */
export async function checkApiAvailability(): Promise<boolean> {
  if (USE_MOCK_DATA) {
    return false;
  }

  try {
    await getDashboard();
    return true;
  } catch {
    return false;
  }
}

/**
 * Invalidiert den Cache für alle Spendendaten
 * Nützlich für manuelle Aktualisierung
 */
export function invalidateDonationsCache(): void {
  clearCache('getDashboard');
  clearCache('getUebergabeSummen');
  clearCache('getAllYearlyData');
  // Jahresabschluss-Cache kann nicht pauschal gelöscht werden (jahr-spezifisch)
  if (DEBUG_API) {
    console.log('[API] Cache invalidated');
  }
}
