/**
 * Schema-Validierung für Spendendaten-API
 * 
 * Verwendet Zod für Type-Safe Validierung aller API-Response-Typen
 */

import { z } from 'zod';

// ============================================================================
// DASHBOARD SCHEMA
// ============================================================================

const DashboardEinnahmenSchema = z.object({
  konto: z.object({
    anzahl: z.number().int().nonnegative(),
    summe: z.number().nonnegative(),
    letzter: z.string(),
  }),
  bargeld: z.object({
    anzahl: z.number().int().nonnegative(),
    summe: z.number().nonnegative(),
    letzter: z.string(),
  }),
  gesamt: z.number().nonnegative(),
});

const DashboardAusgabenSchema = z.object({
  allgemein: z.object({
    anzahl: z.number().int().nonnegative(),
    summe: z.number().nonnegative(),
    letzter: z.string(),
  }),
  uebergeben: z.object({
    anzahl: z.number().int().nonnegative(),
    summe: z.number().nonnegative(),
    letzter: z.string(),
  }),
  gesamt: z.number().nonnegative(),
});

const DashboardQuittungenSchema = z.object({
  konto: z.object({
    ausgestellt: z.number().int().nonnegative(),
    offen: z.number().int().nonnegative(),
  }),
  bargeld: z.object({
    ausgestellt: z.number().int().nonnegative(),
    offen: z.number().int().nonnegative(),
  }),
});

export const DashboardDataSchema = z.object({
  year: z.number().int().min(2004).max(2100),
  einnahmen: DashboardEinnahmenSchema,
  ausgaben: DashboardAusgabenSchema,
  saldo: z.number(),
  quittungen: DashboardQuittungenSchema,
});

export type DashboardData = z.infer<typeof DashboardDataSchema>;

// ============================================================================
// ÜBERGABE SUMMEN SCHEMA
// ============================================================================

export const UebergabeSummenSchema = z.object({
  summen: z.record(z.string(), z.number().nonnegative()),
  gesamt: z.number().nonnegative(),
});

export type UebergabeSummen = z.infer<typeof UebergabeSummenSchema>;

// ============================================================================
// YEARLY DATA SCHEMA
// ============================================================================

const YearlyDonationSchema = z.object({
  year: z.number().int().min(2004).max(2100),
  amount: z.number().nonnegative(),
});

export const AllYearlyDataSchema = z.object({
  donations: z.array(YearlyDonationSchema),
  totalDonations: z.number().nonnegative(),
  currentYear: z.number().int().min(2004).max(2100),
});

export type AllYearlyData = z.infer<typeof AllYearlyDataSchema>;
export type YearlyDonation = z.infer<typeof YearlyDonationSchema>;

// ============================================================================
// JAHRESABSCHLUSS SCHEMA
// ============================================================================

const JahresabschlussEinnahmenSchema = z.object({
  konto: z.number().nonnegative(),
  bargeld: z.number().nonnegative(),
  gesamt: z.number().nonnegative(),
});

const JahresabschlussAusgabenSchema = z.object({
  // Legacy/Frontend-Form: "allgemein"
  allgemein: z.number().nonnegative().optional(),
  // Apps-Script-Form: "konto" + "bar"
  konto: z.number().nonnegative().optional(),
  bar: z.number().nonnegative().optional(),
  bargeld: z.number().nonnegative().optional(),
  uebergabe: z.number().nonnegative(),
  gesamt: z.number().nonnegative(),
});

const JahresabschlussQuittungenSchema = z.object({
  // Legacy/Frontend-Form
  konto: z.number().int().nonnegative().optional(),
  bargeld: z.number().int().nonnegative().optional(),
  // Apps-Script-Form
  gueltig: z.number().int().nonnegative().optional(),
  storniert: z.number().int().nonnegative().optional(),
  gesamt: z.number().int().nonnegative(),
  hinweis: z.string().optional(),
});

export const JahresabschlussSchema = z.object({
  jahr: z.number().int().min(2004).max(2100),
  anfangsbestand: z.number().nonnegative().optional(),
  einnahmen: JahresabschlussEinnahmenSchema,
  sachspenden: z.object({
    wert: z.number().nonnegative(),
    hinweis: z.string(),
  }).optional(),
  ausgaben: JahresabschlussAusgabenSchema,
  saldo: z.number(),
  quittungen: JahresabschlussQuittungenSchema,
  erstellt: z.string(),
});

export type Jahresabschluss = z.infer<typeof JahresabschlussSchema>;

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

/**
 * Validiert Dashboard-Daten gegen Schema
 */
export function validateDashboardData(data: unknown): DashboardData {
  return DashboardDataSchema.parse(data);
}

/**
 * Validiert Übergabe-Summen gegen Schema
 */
export function validateUebergabeSummen(data: unknown): UebergabeSummen {
  return UebergabeSummenSchema.parse(data);
}

/**
 * Validiert Jahres-Daten gegen Schema
 */
export function validateAllYearlyData(data: unknown): AllYearlyData {
  return AllYearlyDataSchema.parse(data);
}

/**
 * Validiert Jahresabschluss gegen Schema
 */
export function validateJahresabschluss(data: unknown): Jahresabschluss {
  return JahresabschlussSchema.parse(data);
}

/**
 * Prüft ob Daten valide sind (ohne Exception zu werfen)
 */
export function isValidDashboardData(data: unknown): data is DashboardData {
  return DashboardDataSchema.safeParse(data).success;
}

export function isValidUebergabeSummen(data: unknown): data is UebergabeSummen {
  return UebergabeSummenSchema.safeParse(data).success;
}

export function isValidAllYearlyData(data: unknown): data is AllYearlyData {
  return AllYearlyDataSchema.safeParse(data).success;
}

export function isValidJahresabschluss(data: unknown): data is Jahresabschluss {
  return JahresabschlussSchema.safeParse(data).success;
}

