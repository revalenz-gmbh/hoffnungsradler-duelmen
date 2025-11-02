// Buchhaltungs-API für Google Apps Script Integration
// Hoffnungsradler Dülmen e.V.

import { API_ENDPOINTS, USE_MOCK_DATA, DEBUG_API } from './api-config';
import { donations } from '@/data/donations';

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

const mockUebergabeSummen: UebergabeSummen = {
  summen: {
    '2025': 0,
    '2024': 7000,
    '2023': 13000,
    '2022': 4000,
    '2021': 4500,
    '2020': 5600,
    '2019': 5500,
    '2018': 5000,
    '2017': 5000,
    '2016': 7000,
    '2015': 5600,
    '2014': 5555,
    '2013': 5000,
    '2012': 4000,
    '2011': 4000,
    '2010': 3000,
    '2009': 2500,
    '2008': 1700,
    '2007': 1300,
    '2006': 1200,
    '2005': 500,
    '2004': 100,
  },
  gesamt: 91055
};

const mockAllYearlyData: AllYearlyData = {
  donations: donations,
  totalDonations: 91055,
  currentYear: 2025
};

const mockDashboard: DashboardData = {
  year: 2025,
  einnahmen: {
    konto: { anzahl: 15, summe: 3200.50, letzter: '15.03.2025' },
    bargeld: { anzahl: 8, summe: 1781.50, letzter: '20.03.2025' },
    gesamt: 4982.00
  },
  ausgaben: {
    allgemein: { anzahl: 3, summe: 250.00, letzter: '10.03.2025' },
    uebergeben: { anzahl: 0, summe: 0, letzter: '' },
    gesamt: 250.00
  },
  saldo: 4732.00,
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
 */
export async function getUebergabeSummen(): Promise<UebergabeSummen> {
  if (USE_MOCK_DATA) {
    console.log('[API] Using mock data for Übergabe-Summen');
    return mockUebergabeSummen;
  }

  return apiFetch<UebergabeSummen>(API_ENDPOINTS.getUebergabeSummen);
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

