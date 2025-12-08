/**
 * Single Source of Truth für historische Spendendaten (2004-2024)
 * 
 * Diese Datei enthält die historischen, bereits übergebenen Spenden.
 * Das aktuelle Jahr (2025) wird dynamisch aus der Google Apps Script API geladen.
 * 
 * WICHTIG: Diese Daten ändern sich nicht mehr, da es bereits übergebene Spenden sind.
 * Nur das aktuelle Jahr wird regelmäßig aktualisiert.
 * 
 * Stand: 07.12.2025
 */

export interface YearlyDonation {
  year: number;
  amount: number;
}

/**
 * Historische Spenden (2004-2024)
 * Diese Werte sind final und ändern sich nicht mehr.
 */
export const historicalDonations: YearlyDonation[] = [
  { year: 2024, amount: 7000 },
  { year: 2023, amount: 13000 },
  { year: 2022, amount: 4000 },
  { year: 2021, amount: 4500 },
  { year: 2020, amount: 5600 },
  { year: 2019, amount: 5500 },
  { year: 2018, amount: 5000 },
  { year: 2017, amount: 5000 },
  { year: 2016, amount: 7000 },
  { year: 2015, amount: 5600 },
  { year: 2014, amount: 5555 },
  { year: 2013, amount: 5000 }, // 2000 + 3000
  { year: 2012, amount: 4000 },
  { year: 2011, amount: 4000 },
  { year: 2010, amount: 3000 },
  { year: 2009, amount: 2500 },
  { year: 2008, amount: 1700 },
  { year: 2007, amount: 1300 },
  { year: 2006, amount: 1200 },
  { year: 2005, amount: 500 },
  { year: 2004, amount: 100 },
];

/**
 * Berechnet die Gesamtsumme aller historischen Spenden (2004-2024)
 */
export const HISTORICAL_TOTAL = historicalDonations.reduce(
  (sum, donation) => sum + donation.amount,
  0
); // = 91.055 €

/**
 * Berechnet das höchste Jahr in den historischen Daten
 * Wird verwendet um zu bestimmen, welche Jahre von der API kommen sollten
 */
export const HISTORICAL_MAX_YEAR = Math.max(...historicalDonations.map(d => d.year));

/**
 * Konvertiert historische Spenden in ein Jahr-zu-Betrag Mapping
 * Für Kompatibilität mit bestehendem Code
 */
export const HISTORICAL_DONATIONS_MAP: Record<string, number> = 
  Object.fromEntries(
    historicalDonations.map(d => [d.year.toString(), d.amount])
  );

/**
 * Rückwärtskompatibilität: donations Array (inkl. aktuelles Jahr als Fallback)
 * @deprecated Verwende historicalDonations für historische Daten
 */
export const donations: YearlyDonation[] = [
  { year: 2025, amount: 10000 },  // Fallback für aktuelles Jahr (wird durch API überschrieben)
  ...historicalDonations,
];

/**
 * GESAMTSUMME ALLER ÜBERGEBENEN SPENDEN (2004-2025)
 * 
 * SINGLE SOURCE OF TRUTH: Diese Zahl wird einmal am Ende der Saison aktualisiert.
 * Stand: 07.12.2025
 * 
 * Berechnung:
 * - Historische Spenden (2004-2024): 91.055 €
 * - Aktuelle Spenden (2025): 10.000 € (2x 5.000€)
 * = GESAMT: 101.055 €
 */
export const TOTAL_DONATIONS = 101055;

/**
 * Gesamtsumme aller historischen Spenden (2004-2024)
 * @deprecated Verwende HISTORICAL_TOTAL
 */
export const totalDonations = TOTAL_DONATIONS;

/**
 * Fallback-Wert für aktuelles Jahr (wird durch API überschrieben)
 * @deprecated Wird dynamisch aus API geladen
 */
export const currentYearDonations = 10000;

/**
 * Spendenziel für das aktuelle Jahr
 */
export const donationGoal = 5000;

/**
 * Aktuelles Jahr
 */
export const donationYear = 2025; 