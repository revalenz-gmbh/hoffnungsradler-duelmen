/**
 * Aktuelle Saison-Daten für Hoffnungsradler Dülmen e.V.
 * 
 * Diese Datei dient als Single Source of Truth für den aktuellen Spendenstand.
 * Sie wird manuell aktualisiert, wenn neue Spenden eingehen oder Ausgaben getätigt werden.
 * 
 * ANLEITUNG ZUM AKTUALISIEREN:
 * 1. Öffne diese Datei
 * 2. Aktualisiere den Wert `kontostand` mit dem aktuellen Kontostand aus der Buchhaltung
 * 3. Aktualisiere das `lastUpdated` Datum
 * 4. Committe und pushe die Änderung
 * 5. Nach dem Vercel-Deployment ist der neue Stand live
 * 
 * HINWEIS: Der Fortschrittsbalken auf der Startseite zeigt:
 * kontostand - STILLE_RESERVE (300€) = verfügbarer Spendenbetrag
 */

export interface CurrentSeasonData {
  /** Aktuelles Jahr der Saison */
  year: number;
  /** Aktueller Kontostand in Euro (aus Buchhaltung) */
  kontostand: number;
  /** Spendenziel für das aktuelle Jahr in Euro */
  spendenziel: number;
  /** Datum der letzten Aktualisierung (YYYY-MM-DD) */
  lastUpdated: string;
  /** Stille Reserve die nicht im Fortschrittsbalken angezeigt wird */
  stilleReserve: number;
}

/**
 * Aktuelle Saison-Daten
 * 
 * Stand: 23.01.2026
 * Quelle: Bankauszug in Buchhaltungslösung
 */
export const CURRENT_SEASON: CurrentSeasonData = {
  year: 2026,
  kontostand: 1012.30,      // Aktueller Kontostand aus Buchhaltung
  spendenziel: 5000,        // Spendenziel für 2026
  lastUpdated: '2026-01-23', // Datum der letzten Aktualisierung
  stilleReserve: 300,       // Fixer Reservebetrag
};

/**
 * Berechnet den für den Fortschrittsbalken verfügbaren Betrag
 * (Kontostand minus stille Reserve)
 */
export function getVerfuegbarerBetrag(): number {
  return Math.max(0, CURRENT_SEASON.kontostand - CURRENT_SEASON.stilleReserve);
}

/**
 * Berechnet den Fortschritt zum Spendenziel in Prozent (0-100)
 */
export function getFortschrittProzent(): number {
  const verfuegbar = getVerfuegbarerBetrag();
  return Math.min(100, (verfuegbar / CURRENT_SEASON.spendenziel) * 100);
}
