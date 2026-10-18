/**
 * Spendenstand aus dem täglichen Bankabruf (Kontostand abzüglich Basisabsicherung).
 *
 * Die Zahl kommt aus /api/spendenstand. Ist sie älter als MAX_ALTER_TAGE oder nicht abrufbar,
 * liefert die Funktion null - der Aufrufer nimmt dann den Wert aus dem Google Sheet.
 */

export interface BankSpendenstand {
  betrag: number;
  abruf: Date;
}

const MAX_ALTER_TAGE = 2;
const TAG_MS = 24 * 60 * 60 * 1000;

/** Prüft die Antwort der API und die Frische; null heißt: nicht verwenden. */
export function auswerten(daten: unknown, jetzt: Date = new Date()): BankSpendenstand | null {
  const d = daten as { spendenstand?: unknown; abruf?: unknown } | null;
  if (!d || typeof d.spendenstand !== 'number' || !Number.isFinite(d.spendenstand) || d.spendenstand < 0) return null;
  if (typeof d.abruf !== 'string') return null;
  const abruf = new Date(d.abruf);
  if (Number.isNaN(abruf.getTime())) return null;
  const alter = jetzt.getTime() - abruf.getTime();
  // Ein Abruf aus der Zukunft (falsche Uhr) ist ebenso unbrauchbar wie ein zu alter.
  if (alter < -60 * 60 * 1000 || alter > MAX_ALTER_TAGE * TAG_MS) return null;
  return { betrag: d.spendenstand, abruf };
}

export async function ladeBankSpendenstand(): Promise<BankSpendenstand | null> {
  try {
    const antwort = await fetch('/api/spendenstand', { headers: { Accept: 'application/json' } });
    if (!antwort.ok) return null;
    return auswerten(await antwort.json());
  } catch {
    return null;
  }
}
