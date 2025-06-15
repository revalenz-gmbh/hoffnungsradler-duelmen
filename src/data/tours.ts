// Gemeinsame Basis-Informationen für alle Touren
export interface BaseTour {
  name: string;
  distance: string | number;
  startLocation: string;
  endLocation: string;
  description?: string;
  highlights?: string[];
  bikeType: "rennrad" | "gravel" | "mountainbike";
  difficulty: "leicht" | "mittel" | "anspruchsvoll";
  speed?: string;
}

// Tour-Termine (für TourDates.tsx)
export interface TourDate extends BaseTour {
  date: string;
  time: string;
  day?: string;
  location: string;
  address: string;
  gpxUrl?: string;
  mapUrl?: string;
  komootUrl?: string;
  cancelled?: boolean;
}

// Historische GPX-Touren (für UnsereTouren.tsx)
export interface HistoricalTour extends BaseTour {
  year: number;
  filename: string;
  driveUrl: string;
  lastUpdated?: string;
  needsUpdate?: boolean;
  gpxUrl?: string;
  mapUrl?: string;
  komootUrl?: string;
}

// Aktuelle Tour-Termine 2025
export const currentYearTours: TourDate[] = [
  {
    name: "Ternschersee",
    date: "18.04.2025",
    day: "Karfreitag",
    time: "10:00 Uhr",
    distance: "52 km",
    speed: "25-27 km/h",
    location: "Rathausplatz Dülmen",
    address: "Marktstraße 1, Dülmen",
    startLocation: "Dülmen",
    endLocation: "Dülmen",
    bikeType: "rennrad",
    difficulty: "mittel",
    gpxUrl: "https://drive.google.com/file/d/1_JqqlE72V2TLM0BVQHFZKXD99x5MieLz/view?usp=drive_link",
    mapUrl: "https://www.google.com/maps/d/edit?mid=1T-IjkctOlimn3-_vp7HJY5hLDRT-JEc&usp=drive_link"
  },
  // ... weitere Touren ...
];

// Historische GPX-Touren
export const historicalTours: HistoricalTour[] = [
  {
    name: "Altenberge-Häger",
    year: 2024,
    distance: 45,
    startLocation: "Dülmen",
    endLocation: "Dülmen",
    bikeType: "rennrad",
    difficulty: "mittel",
    duration: "2-3 Stunden",
    filename: "Altenberge-Häger.gpx",
    driveUrl: "https://drive.google.com/file/d/1Mddv5BjKvPysk0ChLkdBTuScZUhfc0rr/view?usp=drive_link",
    gpxUrl: "https://drive.google.com/file/d/1Mddv5BjKvPysk0ChLkdBTuScZUhfc0rr/view?usp=drive_link",
    mapUrl: "https://www.google.com/maps/d/edit?mid=1T-IjkctOlimn3-_vp7HJY5hLDRT-JEc&usp=drive_link",
    komootUrl: "https://www.komoot.com/de-de/tour/2098047867?s"
  },
  // ... weitere historische Touren ...
];

// Hilfsfunktionen
export const getToursByBikeType = (tours: (TourDate | HistoricalTour)[], bikeType: BaseTour["bikeType"]) => {
  return tours.filter(tour => tour.bikeType === bikeType);
};

export const getToursByYear = (tours: HistoricalTour[], year: number) => {
  return tours.filter(tour => tour.year === year);
};

export const getToursByDifficulty = (tours: (TourDate | HistoricalTour)[], difficulty: BaseTour["difficulty"]) => {
  return tours.filter(tour => tour.difficulty === difficulty);
}; 