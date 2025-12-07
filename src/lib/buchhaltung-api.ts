// Buchhaltungs-API für Google Apps Script Integration
// Hoffnungsradler Dülmen e.V.

import { API_ENDPOINTS, USE_MOCK_DATA, DEBUG_API } from './api-config';
import { donations } from '@/data/donations';
import { 
  HISTORICAL_DONATIONS, 
  HISTORICAL_TOTAL,
  FALLBACK_DASHBOARD
} from './google-sheets-api';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface DashboardData {
  year: number;
  einnahmen: {
    konto: { anzahl: number; summe: number; letzter: string };
    bargeld: { anzahl: number; summe: number; letzter: string };
    gesamt: number;
  };
  ausgaben: {
    allgemein: { anzahl: number; summe: number; letzter: string };
    uebergeben: { anzahl: number; summe: number; letzter: string };
    gesamt: number;
  };
  saldo: number;
  quittungen: {
    konto: { ausgestellt: number; offen: number };
    bargeld: { ausgestellt: number; offen: number };
  };
}

export interface UebergabeSummen {
  summen: { [year: string]: number };
  gesamt: number;
}

export interface YearlyDonation {
  year: number;
  amount: number;
}

export interface AllYearlyData {
  donations: YearlyDonation[];
  totalDonations: number;
  currentYear: number;
}

export interface Jahresabschluss {
  jahr: number;
  einnahmen: {
    konto: number;
    bargeld: number;
    gesamt: number;
  };
  ausgaben: {
    allgemein: number;
    uebergabe: number;
    gesamt: number;
  };
  saldo: number;
  quittungen: {
    konto: number;
    bargeld: number;
    gesamt: number;
  };
  erstellt: string;
}

// ============================================================================
// MOCK DATA (für Entwicklung ohne Google Sheets)
// ============================================================================

// Mock-Daten basierend auf historischen Daten + Fallback für aktuelles Jahr
const mockUebergabeSummen: UebergabeSummen = {
  summen: {
    ...HISTORICAL_DONATIONS,
    '2025': FALLBACK_DASHBOARD.ausgabenUebergeben, // Aktuelle übergebene Spenden aus Fallback
  },
  gesamt: HISTORICAL_TOTAL + FALLBACK_DASHBOARD.ausgabenUebergeben
};

const mockAllYearlyData: AllYearlyData = {
  donations: donations,
  totalDonations: 96055,
  currentYear: 2025
};

// Mock-Dashboard mit aktuellen Werten (Stand: 07.12.2025)
const mockDashboard: DashboardData = {
  year: 2025,
  einnahmen: {
    konto: { anzahl: 23, summe: 7939.00, letzter: '05.12.2025' },
    bargeld: { anzahl: 7, summe: 2262.00, letzter: '28.09.2025' },
    gesamt: 10201.00
  },
  ausgaben: {
    allgemein: { anzahl: 3, summe: 253.88, letzter: '05.12.2025' },
    uebergeben: { anzahl: 2, summe: 10000.00, letzter: '05.12.2025' },
    gesamt: 10253.88
  },
  saldo: 60.13,  // Endbestand Geldmittel
  quittungen: {
    konto: { ausgestellt: 10, offen: 5 },
    bargeld: { ausgestellt: 3, offen: 5 }
  }
};

// ============================================================================
// API FUNCTIONS
// ============================================================================

/**
 * Fetch-Wrapper mit Fehlerbehandlung und Logging
 */
async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
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

    return data;
  } catch (error) {
    console.error('[API] Error:', error);
    throw error;
  }
}

/**
 * Dashboard-Daten abrufen
 */
export async function getDashboard(): Promise<DashboardData> {
  if (USE_MOCK_DATA) {
    console.log('[API] Using mock data for dashboard');
    return mockDashboard;
  }

  return apiFetch<DashboardData>(API_ENDPOINTS.getDashboard);
}

/**
 * Übergebene Spenden-Summen abrufen
 * 
 * Versucht die Daten von der Google Apps Script Web-App zu laden.
 * Falls nicht konfiguriert oder nicht erreichbar, werden Fallback-Daten verwendet.
 */
export async function getUebergabeSummen(): Promise<UebergabeSummen> {
  // Versuche die Google Apps Script Web-App API
  if (!USE_MOCK_DATA) {
    try {
      console.log('[API] Fetching from Google Apps Script Web-App...');
      const data = await apiFetch<UebergabeSummen>(API_ENDPOINTS.getUebergabeSummen);
      console.log('[API] Successfully fetched data from Apps Script');
      return data;
    } catch (error) {
      console.warn('[API] Could not fetch from Apps Script:', error);
    }
  }
  
  // Fallback: Mock-Daten (basierend auf historischen Daten + Fallback für aktuelles Jahr)
  console.log('[API] Using fallback data for Übergabe-Summen');
  return mockUebergabeSummen;
}

/**
 * Alle Jahres-Spendendaten abrufen
 */
export async function getAllYearlyData(): Promise<AllYearlyData> {
  if (USE_MOCK_DATA) {
    console.log('[API] Using mock data for yearly donations');
    return mockAllYearlyData;
  }

  return apiFetch<AllYearlyData>(API_ENDPOINTS.getAllYearlyData);
}

/**
 * Jahresabschluss für ein bestimmtes Jahr abrufen
 */
export async function getJahresabschluss(year: number): Promise<Jahresabschluss> {
  if (USE_MOCK_DATA) {
    console.log('[API] Using mock data for Jahresabschluss');
    const currentYear = new Date().getFullYear();
    return {
      jahr: year,
      einnahmen: {
        konto: year === currentYear ? 3200.50 : 0,
        bargeld: year === currentYear ? 1781.50 : 0,
        gesamt: year === currentYear ? 4982.00 : 0
      },
      ausgaben: {
        allgemein: year === currentYear ? 250.00 : 0,
        uebergabe: mockUebergabeSummen.summen[year.toString()] || 0,
        gesamt: (mockUebergabeSummen.summen[year.toString()] || 0) + (year === currentYear ? 250 : 0)
      },
      saldo: year === currentYear ? 4732.00 : 0,
      quittungen: {
        konto: year === currentYear ? 10 : 0,
        bargeld: year === currentYear ? 3 : 0,
        gesamt: year === currentYear ? 13 : 0
      },
      erstellt: new Date().toISOString()
    };
  }

  return apiFetch<Jahresabschluss>(API_ENDPOINTS.getJahresabschluss(year));
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

