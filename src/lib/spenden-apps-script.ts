import { Donation, DonationProvider } from "./spenden-core";

export class AppsScriptDonationProvider implements DonationProvider {
  constructor(private apiUrl: string) {}

  async getDonations(): Promise<Donation[]> {
    const res = await fetch(`${this.apiUrl}?action=getDonations`);
    return await res.json();
  }

  async addDonation(donation: Donation): Promise<void> {
    await fetch(this.apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "addDonation", donation }),
    });
  }

  async updateDonation(id: string, update: Partial<Donation>): Promise<void> {
    // Optional: Implementiere update-Logik in Apps Script und hier
    throw new Error("updateDonation ist noch nicht implementiert");
  }
} 