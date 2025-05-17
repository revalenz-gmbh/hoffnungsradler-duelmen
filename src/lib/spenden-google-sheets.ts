import { Donation, DonationProvider } from "./spenden-core";

// Platzhalter für Google Sheets API-Integration
export class GoogleSheetsDonationProvider implements DonationProvider {
  constructor(private config: { sheetId: string; credentials: any }) {}

  async getDonations(): Promise<Donation[]> {
    // TODO: Google Sheets API aufrufen und Daten mappen
    return [];
  }

  async addDonation(donation: Donation): Promise<void> {
    // TODO: Neue Spende ins Sheet schreiben
  }

  async updateDonation(id: string, update: Partial<Donation>): Promise<void> {
    // TODO: Spende im Sheet aktualisieren
  }
} 