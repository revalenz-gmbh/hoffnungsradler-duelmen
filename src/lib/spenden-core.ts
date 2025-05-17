// Kern-Datenmodell für eine Spende
export interface Donation {
  id: string;
  year: number;
  amount: number;
  name: string;
  email: string;
  date: string;
  receiptIssued: boolean;
  receiptNumber?: string;
  note?: string;
}

// Interface für einen generischen Spenden-Provider
export interface DonationProvider {
  getDonations(): Promise<Donation[]>;
  addDonation(donation: Donation): Promise<void>;
  updateDonation(id: string, update: Partial<Donation>): Promise<void>;
  // Erweiterbar um weitere Methoden
} 