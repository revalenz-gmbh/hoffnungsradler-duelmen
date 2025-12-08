/**
 * Konsistenz-Prüfungen für Spendendaten
 * 
 * Validiert dass alle Datenquellen konsistent sind:
 * - Historische Daten stimmen überein
 * - Gesamtsumme = historisch + aktuelles Jahr
 * - Keine doppelten oder fehlenden Jahre
 */

import { historicalDonations, HISTORICAL_TOTAL } from '@/data/donations';
import type { UebergabeSummen, AllYearlyData } from './donations-validator';

/**
 * Prüft ob die Übergabe-Summen konsistent sind
 */
export function validateUebergabeSummenConsistency(data: UebergabeSummen): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Prüfe dass alle historischen Jahre vorhanden sind
  for (const donation of historicalDonations) {
    const yearStr = donation.year.toString();
    if (!(yearStr in data.summen)) {
      errors.push(`Fehlendes historisches Jahr: ${donation.year}`);
    } else if (data.summen[yearStr] !== donation.amount) {
      errors.push(
        `Inkonsistenz für Jahr ${donation.year}: erwartet ${donation.amount}, erhalten ${data.summen[yearStr]}`
      );
    }
  }

  // Berechne erwartete Gesamtsumme
  const calculatedTotal = Object.values(data.summen).reduce((sum, val) => sum + val, 0);
  
  // Prüfe Gesamtsumme
  if (Math.abs(data.gesamt - calculatedTotal) > 0.01) {
    errors.push(
      `Gesamtsumme inkonsistent: erwartet ${calculatedTotal}, erhalten ${data.gesamt}`
    );
  }

  // Prüfe dass Gesamtsumme mindestens historische Summe enthält
  if (data.gesamt < HISTORICAL_TOTAL) {
    errors.push(
      `Gesamtsumme (${data.gesamt}) ist kleiner als historische Summe (${HISTORICAL_TOTAL})`
    );
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Prüft ob die Jahres-Daten konsistent sind
 */
export function validateAllYearlyDataConsistency(data: AllYearlyData): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Prüfe dass alle historischen Jahre vorhanden sind
  const dataYears = new Set(data.donations.map(d => d.year));
  
  for (const donation of historicalDonations) {
    if (!dataYears.has(donation.year)) {
      errors.push(`Fehlendes historisches Jahr: ${donation.year}`);
    } else {
      const found = data.donations.find(d => d.year === donation.year);
      if (found && found.amount !== donation.amount) {
        errors.push(
          `Inkonsistenz für Jahr ${donation.year}: erwartet ${donation.amount}, erhalten ${found.amount}`
        );
      }
    }
  }

  // Berechne erwartete Gesamtsumme
  const calculatedTotal = data.donations.reduce((sum, d) => sum + d.amount, 0);
  
  // Prüfe Gesamtsumme
  if (Math.abs(data.totalDonations - calculatedTotal) > 0.01) {
    errors.push(
      `Gesamtsumme inkonsistent: erwartet ${calculatedTotal}, erhalten ${data.totalDonations}`
    );
  }

  // Prüfe dass Gesamtsumme mindestens historische Summe enthält
  if (data.totalDonations < HISTORICAL_TOTAL) {
    errors.push(
      `Gesamtsumme (${data.totalDonations}) ist kleiner als historische Summe (${HISTORICAL_TOTAL})`
    );
  }

  // Prüfe aktuelles Jahr
  const currentYear = new Date().getFullYear();
  if (data.currentYear !== currentYear) {
    errors.push(
      `Aktuelles Jahr inkonsistent: erwartet ${currentYear}, erhalten ${data.currentYear}`
    );
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Prüft ob beide Datenquellen (UebergabeSummen und AllYearlyData) konsistent sind
 */
export function validateCrossSourceConsistency(
  uebergabe: UebergabeSummen,
  yearly: AllYearlyData
): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Prüfe Gesamtsummen stimmen überein
  if (Math.abs(uebergabe.gesamt - yearly.totalDonations) > 0.01) {
    errors.push(
      `Gesamtsummen stimmen nicht überein: UebergabeSummen=${uebergabe.gesamt}, AllYearlyData=${yearly.totalDonations}`
    );
  }

  // Prüfe dass alle Jahre in beiden Quellen vorhanden sind
  const uebergabeYears = new Set(Object.keys(uebergabe.summen).map(y => parseInt(y, 10)));
  const yearlyYears = new Set(yearly.donations.map(d => d.year));

  // Prüfe Jahre in UebergabeSummen
  for (const year of uebergabeYears) {
    if (!yearlyYears.has(year)) {
      errors.push(`Jahr ${year} in UebergabeSummen aber nicht in AllYearlyData`);
    } else {
      const uebergabeAmount = uebergabe.summen[year.toString()];
      const yearlyAmount = yearly.donations.find(d => d.year === year)?.amount || 0;
      if (Math.abs(uebergabeAmount - yearlyAmount) > 0.01) {
        errors.push(
          `Betrag für Jahr ${year} stimmt nicht überein: UebergabeSummen=${uebergabeAmount}, AllYearlyData=${yearlyAmount}`
        );
      }
    }
  }

  // Prüfe Jahre in AllYearlyData
  for (const year of yearlyYears) {
    if (!uebergabeYears.has(year)) {
      errors.push(`Jahr ${year} in AllYearlyData aber nicht in UebergabeSummen`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Führt alle Konsistenz-Prüfungen durch und gibt einen Report zurück
 */
export function validateAllConsistency(
  uebergabe: UebergabeSummen,
  yearly: AllYearlyData
): {
  valid: boolean;
  report: {
    uebergabe: ReturnType<typeof validateUebergabeSummenConsistency>;
    yearly: ReturnType<typeof validateAllYearlyDataConsistency>;
    crossSource: ReturnType<typeof validateCrossSourceConsistency>;
  };
} {
  const uebergabeCheck = validateUebergabeSummenConsistency(uebergabe);
  const yearlyCheck = validateAllYearlyDataConsistency(yearly);
  const crossSourceCheck = validateCrossSourceConsistency(uebergabe, yearly);

  const valid = uebergabeCheck.valid && yearlyCheck.valid && crossSourceCheck.valid;

  return {
    valid,
    report: {
      uebergabe: uebergabeCheck,
      yearly: yearlyCheck,
      crossSource: crossSourceCheck,
    },
  };
}

