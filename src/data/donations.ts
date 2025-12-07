// Übergebene Spenden pro Jahr (historisch + aktuell)
// Diese Daten werden als Fallback verwendet, wenn das Google Sheet nicht erreichbar ist.
// Die Live-Daten werden direkt aus dem Dashboard geladen.
// Stand: 07.12.2025
export const donations = [
  { year: 2025, amount: 10000 },  // 2x Spendenübergabe (Dashboard: 05.12.2025)
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

// Gesamtsumme aller übergebenen Spenden (2004-2025)
// 91.055 € (historisch) + 10.000 € (2025) = 101.055 €
export const totalDonations = 101055;

// Aktuell übergebene Spenden im laufenden Jahr
export const currentYearDonations = 10000;

// Spendenziel für das aktuelle Jahr
export const donationGoal = 5000;

// Aktuelles Jahr
export const donationYear = 2025; 