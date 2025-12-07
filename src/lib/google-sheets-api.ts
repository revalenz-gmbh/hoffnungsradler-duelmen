// Google Sheets Direct API Integration
// Hoffnungsradler Dülmen e.V.
// 
// Diese Datei ermöglicht den direkten Zugriff auf das Google Sheet Dashboard
// ohne ein separates Backend zu benötigen.

// Google Sheet ID aus der URL extrahiert
const SHEET_ID = '1rfP-sM38RYmwY9PKEDQQ7Hb28qY_kXUmsl92rpyc3Yg';

// Dashboard Sheet GID
const DASHBOARD_GID = '1156727551';

// Öffentliche Google Sheets API URL (CSV Export)
// WICHTIG: Das Sheet muss als "Für jeden mit dem Link" freigegeben sein!
const getSheetCsvUrl = (sheetId: string, gid: string) => 
  `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;

// Alternative: Google Visualization API (erlaubt Abfragen)
const getVisualizationUrl = (sheetId: string, query: string, gid: string) =>
  `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&gid=${gid}&tq=${encodeURIComponent(query)}`;

export interface DashboardValues {
  // Einnahmen
  einnahmenKonto: number;      // C5
  einnahmenBargeld: number;    // C7
  einnahmenGesamt: number;     // C9
  
  // Ausgaben
  ausgabenKonto: number;       // C13
  ausgabenBargeld: number;     // C15
  ausgabenUebergeben: number;  // C17 (Übergebene Spenden)
  ausgabenGesamt: number;      // C18
  
  // Saldo
  saldo: number;               // C20 (Aktueller Spendenstand)
  
  // Metadaten
  jahr: number;
  lastUpdated: string;
}

/**
 * Parst eine CSV-Zeile und extrahiert die Werte
 */
function parseCsvRow(row: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (const char of row) {
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  values.push(current.trim());
  
  return values;
}

/**
 * Extrahiert einen numerischen Wert aus einer Zelle
 * Unterstützt deutsche Zahlenformate (1.234,56 €)
 */
function parseGermanNumber(value: string): number {
  if (!value) return 0;
  
  // Entferne Währungssymbole und Leerzeichen
  let cleaned = value.replace(/[€\s]/g, '').trim();
  
  // Konvertiere deutsches Zahlenformat (1.234,56) zu englisch (1234.56)
  // Entferne Tausendertrennpunkte
  cleaned = cleaned.replace(/\./g, '');
  // Ersetze Komma durch Punkt für Dezimalstellen
  cleaned = cleaned.replace(',', '.');
  
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

/**
 * Lädt die Dashboard-Daten direkt aus dem Google Sheet
 */
export async function fetchDashboardFromSheet(): Promise<DashboardValues | null> {
  try {
    const url = getSheetCsvUrl(SHEET_ID, DASHBOARD_GID);
    console.log('[Google Sheets] Fetching dashboard data...');
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'text/csv',
      },
    });
    
    if (!response.ok) {
      console.error('[Google Sheets] HTTP Error:', response.status, response.statusText);
      return null;
    }
    
    const csvText = await response.text();
    const rows = csvText.split('\n').map(row => parseCsvRow(row));
    
    console.log('[Google Sheets] Parsed rows:', rows.length);
    
    // Dashboard-Struktur (basierend auf dem echten Dashboard):
    // Zeile 1: Header (Jahr)
    // Zeile 2: Überschrift "EINNAHMEN"
    // Zeile 3-4: Leer oder Beschriftungen
    // Zeile 5: Einnahmen (Konto) - Spalte C
    // Zeile 6: Leer
    // Zeile 7: Einnahmen (Bargeld) - Spalte C
    // Zeile 8: Leer
    // Zeile 9: GESAMT EINNAHMEN - Spalte C
    // ...
    // Zeile 13: Ausgaben (Konto) - Spalte C
    // Zeile 15: Ausgaben (Bargeld) - Spalte C
    // Zeile 17: Übergebene Spenden - Spalte C
    // Zeile 18: GESAMT AUSGABEN - Spalte C
    // ...
    // Zeile 20: Aktueller Spendenstand - Spalte C
    
    // Extrahiere Werte (Zeilen sind 0-basiert, also -1)
    const getValue = (rowIndex: number, colIndex: number = 2): number => {
      if (rows[rowIndex] && rows[rowIndex][colIndex]) {
        return parseGermanNumber(rows[rowIndex][colIndex]);
      }
      return 0;
    };
    
    // Extrahiere das Jahr aus der ersten Zeile
    const jahrText = rows[0]?.[2] || new Date().getFullYear().toString();
    const jahr = parseInt(jahrText) || new Date().getFullYear();
    
    const dashboardValues: DashboardValues = {
      einnahmenKonto: getValue(4),      // Zeile 5 (Index 4)
      einnahmenBargeld: getValue(6),    // Zeile 7 (Index 6)
      einnahmenGesamt: getValue(8),     // Zeile 9 (Index 8)
      
      ausgabenKonto: getValue(12),      // Zeile 13 (Index 12)
      ausgabenBargeld: getValue(14),    // Zeile 15 (Index 14)
      ausgabenUebergeben: getValue(16), // Zeile 17 (Index 16)
      ausgabenGesamt: getValue(17),     // Zeile 18 (Index 17)
      
      saldo: getValue(19),              // Zeile 20 (Index 19)
      
      jahr: jahr,
      lastUpdated: new Date().toISOString(),
    };
    
    console.log('[Google Sheets] Dashboard values:', dashboardValues);
    
    return dashboardValues;
  } catch (error) {
    console.error('[Google Sheets] Error fetching dashboard:', error);
    return null;
  }
}

/**
 * Berechnet die Gesamtsumme aller übergebenen Spenden (historisch + aktuell)
 */
export function calculateTotalDonations(
  historicalDonations: { [year: string]: number },
  currentYearSaldo: number
): number {
  const historicalSum = Object.values(historicalDonations).reduce((sum, val) => sum + val, 0);
  return historicalSum + Math.max(0, currentYearSaldo);
}

/**
 * Fallback-Werte falls das Sheet nicht erreichbar ist
 * Stand: 07.12.2025 (aus Dashboard-Screenshot)
 */
export const FALLBACK_DASHBOARD: DashboardValues = {
  einnahmenKonto: 7939.00,
  einnahmenBargeld: 2262.00,
  einnahmenGesamt: 10201.00,
  ausgabenKonto: 253.88,
  ausgabenBargeld: 0,
  ausgabenUebergeben: 10000.00,  // 2x Spendenübergabe à 5.000€
  ausgabenGesamt: 10253.88,
  saldo: 60.13,  // Endbestand Geldmittel
  jahr: 2025,
  lastUpdated: '2025-12-07',
};

// Historische Spendensummen (bereits übergeben - diese ändern sich nicht mehr)
export const HISTORICAL_DONATIONS: { [year: string]: number } = {
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
};

// Berechne historische Gesamtsumme
export const HISTORICAL_TOTAL = Object.values(HISTORICAL_DONATIONS).reduce((sum, val) => sum + val, 0);
// = 91055 €

