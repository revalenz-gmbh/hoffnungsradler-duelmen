import { GoogleSheetsDonationProvider } from "./spenden-google-sheets";

// Beispiel-Konfiguration (Sheet-ID und Credentials müssen ersetzt werden)
const provider = new GoogleSheetsDonationProvider({
  sheetId: "DEINE_SHEET_ID",
  credentials: {/* ...Google Service Account Credentials... */},
});

async function beispiel() {
  // Spenden abrufen
  const donations = await provider.getDonations();
  console.log("Spenden:", donations);

  // Neue Spende hinzufügen
  /*
  await provider.addDonation({
    id: "1",
    year: 2025,
    amount: 100,
    name: "Max Mustermann",
    email: "max@beispiel.de",
    date: "2025-05-12",
    receiptIssued: false,
  });
  */
}

// beispiel(); // Zum Testen auskommentieren 