import { Link } from "react-router-dom";
import { Download, Map, Link2, Mountain } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

// Einfache Struktur für aktuelle Touren
interface TourVariant {
  label: string; // z.B. "48 km"
  /** Höhenmeter der Variante, z. B. "ca. 430 hm" */
  elevation?: string;
  gpxUrl?: string;
  komootUrl?: string;
}

interface TourDate {
  date: string;
  day?: string;
  name: string;
  distance: string;
  /** Höhenmeter, bei mehreren Varianten z. B. "ca. 430 / 810 / 1.110 hm" */
  elevation?: string;
  time: string;
  location: string;
  address: string;
  speed?: string;
  /** Kurzer Hinweis z. B. zu geeigneten Fahrradtypen (Gravel, alle Bikes …) */
  bikeNote?: string;
  gpxUrl?: string;
  mapUrl?: string;
  komootUrl?: string;
  cancelled?: boolean;
  variants?: TourVariant[]; // Optional: mehrere Streckenvarianten
}

// Archivierte Tour-Daten für 2025
export const tours2025: TourDate[] = [
  {
    date: "18.04.2025",
    day: "Karfreitag",
    name: "Ternschersee",
    distance: "52 km",
    time: "10:00 Uhr",
    location: "Rathausplatz Dülmen",
    address: "Marktstraße 1, Dülmen",
    speed: "25-27 km/h",
    gpxUrl: "https://drive.google.com/file/d/1_JqqlE72V2TLM0BVQHFZKXD99x5MieLz/view?usp=drive_link",
    mapUrl: "https://www.google.com/maps/d/edit?mid=1T-IjkctOlimn3-_vp7HJY5hLDRT-JEc&usp=drive_link"
  },
  {
    date: "11.05.2025",
    day: "Sonntag",
    name: "Weseke",
    distance: "86 km",
    time: "10:00 Uhr",
    location: "Sportzentrum Süd",
    address: "Kapellenweg, Dülmen",
    speed: "25-27 km/h",
    gpxUrl: "https://drive.google.com/file/d/1xjgRRVigXswIta5iDUo3O0lX83kwbKMY/view?usp=drive_link",
    mapUrl: "https://www.google.com/maps/d/edit?mid=1WtmfEqv87gfcf9ca7ncuw90fC-P59Q4&usp=drive_link",
    komootUrl: "https://www.komoot.com/de-de/tour/2098047867?s"
  },
  {
    date: "24.05.2025",
    day: "Samstag",
    name: "Münster Berg Fidel",
    distance: "77 km",
    speed: "25-27 km/h",
    time: "14:00 Uhr",
    location: "Sportzentrum Süd",
    address: "Kapellenweg, Dülmen",
    gpxUrl: "https://drive.google.com/file/d/1WQsIXZI9PUE4_nmZePiOGnDDKn24VLfP/view?usp=sharing",
    mapUrl: "https://www.google.com/maps/d/edit?mid=1O1HENk0BcTf_93drEwojRXFMb8pqAyc&usp=sharing",
    komootUrl: "https://www.komoot.com/de-de/tour/2244963952?share_token=a722EL5hQbTT9suvWG57BSBvixPOobLPaE2TEY9fZgelfjJ0eu&ref=wtd"
  },
  {
    date: "22.06.2025",
    day: "Sonntag",
    name: "Tour nach Rhade-Dorsten",
    distance: "74 km",
    speed: "25-27 km/h",
    time: "10:00 Uhr",
    location: "Sportzentrum Süd",
    address: "Kapellenweg, Dülmen",
    gpxUrl: "https://drive.google.com/file/d/1RUGjdUtle2thNF0RbgbC0BjMU6w2qkIC/view?usp=sharing",
    mapUrl: "https://www.google.com/maps/d/edit?mid=1QgvcjQe412DEhl5ba4zD-JiCkPQnCVE&usp=sharing",
    komootUrl: "https://www.komoot.com/de-de/tour/2235975171?share_token=aa8vO4K4MhMWm2L4pnWamJtKS4x413Bf5233GLDoKB3hu9r3Nq&ref=wtd"
  },
  {
    date: "20.07.2025",
    day: "Sonntag",
    name: "Tour nach Frettholt-Asbeck",
    distance: "86 km",
    time: "10:00 Uhr",
    location: "Sportzentrum Süd",
    address: "Kapellenweg, Dülmen",
    gpxUrl: "https://drive.google.com/uc?export=download&id=12ssb84LnaH8qTjCFtm0IuMT5d5OyvGSy",
    mapUrl: "https://www.google.com/maps/d/u/0/edit?mid=1I2dHsrcoLA_ewU4luTOrciZFvna2gyA&usp=sharing",
    komootUrl: "https://www.komoot.com/de-de/tour/2385623782?share_token=aeq56EQxcRrX11Kt1a6TtZHyRhLvt7z3bz9wcvdOPxPYkwL6GP&ref=wtd"
  },
  {
    date: "23.08.2025",
    day: "Samstag",
    name: "Matjes Tour",
    distance: "108 km",
    time: "10:00 Uhr",
    location: "Sportzentrum Süd",
    address: "Kapellenweg, Dülmen",
    gpxUrl: "https://drive.google.com/uc?export=download&id=1UE00r_AOBPoEzYZgafy3TFOlXwhaW7XL",
    mapUrl: "https://www.google.com/maps/d/u/0/edit?mid=1GQIDKl03LpCZLXF68SiK_uiaGJ6VC_k&usp=sharing",
    komootUrl: "https://www.komoot.com/de-de/tour/2359268070?share_token=aKRLKMKeEl7UUCzrAgijqnWM1k75C8SLlNZcq0fwBlJojbDnOo&ref=wtd"
  },
  {
    date: "28.09.2025",
    day: "Sonntag",
    name: "Baumberger Alpin-Tour",
    distance: "48/78/106km",
    elevation: "ca. 430 / 804 / 1.110 hm",
    time: "10:00 Uhr",
    location: "Sportzentrum Süd",
    address: "Kapellenweg, Dülmen",
    speed: "frei",
    variants: [
      { label: "48 km", elevation: "ca. 430 hm", gpxUrl: "https://drive.google.com/uc?export=download&id=1hL8i29g_qrrSh0SDjx6WVC8rAvYQpmkZ", komootUrl: "https://www.komoot.com/de-de/tour/1877164999?share_token=aGV4K3O2xCUTn3xliWAv3X2lWz5bqvUOYK1VTvUu2VIySKH1Mu&ref=wtd" },
      { label: "78 km", elevation: "ca. 804 hm", gpxUrl: "https://drive.google.com/uc?export=download&id=1Ng0roWrLU1-14vaOhgHZjU51C45ySL4O", komootUrl: "https://www.komoot.com/de-de/tour/1319782395?share_token=aR4axmOGOFXBIn72YWKJQiDP3oVLjISVmXti7lXzeYw8HkjaJ3&ref=wtd" },
      { label: "106 km", elevation: "ca. 1.110 hm", gpxUrl: "https://drive.google.com/uc?export=download&id=1E9ngRO40RK4UzQmMVSUPOS2MvgWjx3IW", komootUrl: "https://www.komoot.com/de-de/tour/1861946972?share_token=aPe3qoV9MbMVylwYZp2aQUW77unufTOuXcoDz1a66IHkVB1NB6&ref=wtd" }
    ]
  }
];

// Tour-Termine für 2026 - festgelegt auf der Mitgliederversammlung am 19.01.2026
export const tours2026: TourDate[] = [
  {
    date: "03.04.2026",
    day: "Karfreitag",
    name: "Saisonauftakt zum Ruheforst",
    distance: "ca. 53 km",
    time: "10:00 Uhr",
    location: "Rathaus / Marktplatz",
    address: "Markt, 48249 Dülmen",
    speed: "Guide: Berni",
    bikeNote: "Geeignet für alle Fahrradtypen.",
    komootUrl: "https://www.komoot.com/tour/2837377226",
    gpxUrl: "https://drive.google.com/uc?export=download&id=107gvnc8rx1nLsngH8jSuq_N0YC2P87Z0",
    mapUrl: "https://www.google.com/maps/d/edit?mid=1fgam5iQ_Mv5iW-h7aLbCtXSc3GEdoGw&usp=sharing",
  },
  {
    date: "03.05.2026",
    day: "Sonntag",
    name: "Kanaltour",
    distance: "57 km",
    time: "10:00 Uhr",
    location: "Sportzentrum Süd",
    address: "Kapellenweg, Dülmen",
    speed: "Guide: Piet",
    bikeNote: "Gravel-Tour – besonders für Gravel-Bikes geeignet.",
    mapUrl: "https://www.google.com/maps/d/u/0/edit?mid=1iPBjqpVdtY0p83lPzoIMjg6lLlCFAYA&usp=sharing",
    komootUrl: "https://www.komoot.com/de-de/tour/2808082918",
    gpxUrl: "https://drive.google.com/uc?export=download&id=1XagAaCAT5OwYWnRuQtKuiBr_9O2EvaKI",
  },
  {
    date: "31.05.2026",
    day: "Sonntag",
    name: "Tour nach Gescher",
    distance: "ca. 90 km",
    time: "10:00 Uhr",
    location: "Sportzentrum Süd",
    address: "Kapellenweg, Dülmen",
    speed: "Guide: Berni",
    mapUrl: "https://www.google.com/maps/d/edit?mid=17bMykMq7H_5lmnCBAHhdL28R3LDj3zI&usp=sharing",
    komootUrl: "https://www.komoot.com/de-de/tour/2915333557?share_token=aGl88e45ZVLUCkStBaswu43O7CHvxDuguyG04rhEC8zF1SnN0E&ref=wtd",
    gpxUrl: "https://drive.google.com/uc?export=download&id=1Un-7TdyEpQ_QVJl1FH5wzOqeRrRRQVkn",
  },
  {
    date: "28.06.2026",
    day: "Sonntag",
    name: "Münster-Tour",
    distance: "ca. 81 km",
    time: "10:00 Uhr",
    location: "Sportzentrum Süd",
    address: "Kapellenweg, Dülmen",
    speed: "Guide: Martin",
    cancelled: true,
    mapUrl: "https://www.google.com/maps/d/u/0/edit?mid=1t-AhPv3cG4L8I9NO6ZLLFNiKejtjGuI&usp=sharing",
    komootUrl: "https://www.komoot.com/de-de/tour/2981890670",
    gpxUrl: "https://drive.google.com/uc?export=download&id=1vWTO7j0ZI6rD7G8H0Z0MbjCfjCDe7eT0",
  },
  {
    date: "26.07.2026",
    day: "Sonntag",
    name: "Münster-Tour (Nachholtermin)",
    distance: "ca. 81 km",
    time: "10:00 Uhr",
    location: "Sportzentrum Süd",
    address: "Kapellenweg, Dülmen",
    speed: "Guide: Martin",
    mapUrl: "https://www.google.com/maps/d/u/0/edit?mid=1t-AhPv3cG4L8I9NO6ZLLFNiKejtjGuI&usp=sharing",
    komootUrl: "https://www.komoot.com/de-de/tour/2981890670",
    gpxUrl: "https://drive.google.com/uc?export=download&id=1vWTO7j0ZI6rD7G8H0Z0MbjCfjCDe7eT0",
  },
  {
    date: "23.08.2026",
    day: "Sonntag",
    name: "Legden - Düstermühle",
    distance: "ca. 81 km",
    time: "10:00 Uhr",
    location: "Sportzentrum Süd",
    address: "Kapellenweg, Dülmen",
    speed: "Guide: Martin",
    komootUrl: "https://www.komoot.com/tour/3198197417",
    mapUrl: "https://www.google.com/maps/d/u/0/edit?mid=1iPRW_PR8H-zHnS0_9136nYUCjCJd4M0&ll=51.93384070467501%2C7.200728013576669&z=11",
    gpxUrl: "https://drive.google.com/file/d/1gLunvRLMTJXxTD3yG3JxitCNLMuumckY/view?usp=sharing",
  },
  {
    date: "27.09.2026",
    day: "Sonntag",
    name: "Saisonabschluss / Baumberge-Alpin-Tour",
    distance: "48/78/106 km",
    elevation: "ca. 430 / 804 / 1.110 hm",
    time: "10:00 Uhr",
    location: "Sportzentrum Süd",
    address: "Kapellenweg, Dülmen",
    speed: "frei",
    variants: [
      { label: "48 km", elevation: "ca. 430 hm", gpxUrl: "https://drive.google.com/uc?export=download&id=1hL8i29g_qrrSh0SDjx6WVC8rAvYQpmkZ", komootUrl: "https://www.komoot.com/de-de/tour/1877164999?share_token=aGV4K3O2xCUTn3xliWAv3X2lWz5bqvUOYK1VTvUu2VIySKH1Mu&ref=wtd" },
      { label: "78 km", elevation: "ca. 804 hm", gpxUrl: "https://drive.google.com/uc?export=download&id=1Ng0roWrLU1-14vaOhgHZjU51C45ySL4O", komootUrl: "https://www.komoot.com/de-de/tour/1319782395?share_token=aR4axmOGOFXBIn72YWKJQiDP3oVLjISVmXti7lXzeYw8HkjaJ3&ref=wtd" },
      { label: "106 km", elevation: "ca. 1.110 hm", gpxUrl: "https://drive.google.com/uc?export=download&id=1E9ngRO40RK4UzQmMVSUPOS2MvgWjx3IW", komootUrl: "https://www.komoot.com/de-de/tour/1861946972?share_token=aPe3qoV9MbMVylwYZp2aQUW77unufTOuXcoDz1a66IHkVB1NB6&ref=wtd" }
    ]
  },
];

interface ArchiveTour {
  name: string;
  distance: string;
  year: number;
  downloadUrl: string;
}

const TourDates = () => {
  const [tourList, setTourList] = useState<TourDate[]>(tours2026);

  useEffect(() => {
    const loadVariantLinks = async () => {
      try {
        const res = await fetch('https://script.google.com/macros/s/AKfycbyu5QQ6_cSw4lCfVyqNyIxfYH1aKsYvft6NnDzrZDP5vxcRZZH3xgkuVadRN1iEunkA/exec');
        if (!res.ok) return;
        const data: ArchiveTour[] = await res.json();

        const normalize = (s: string) => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        const isBaumberge = (name: string) => {
          const n = normalize(name);
          return n.includes('baumbergealpintour') || n.includes('baumbergeralpintour');
        };

        const baumberge = data.filter(t => isBaumberge(t.name));
        if (baumberge.length === 0) return;

        // Mappe Distanz -> Download-URL (z. B. "48 km")
        const variantMap: Record<string, string> = {};
        for (const t of baumberge) {
          const fromName = (t.name || '').match(/(48|78|106)(?=\D|$)/);
          const fromDistance = String(t.distance || '').match(/(48|78|106)(?=\D|$)/);
          const num = (fromName?.[1] || fromDistance?.[1]) as string | undefined;
          if (num) {
            const label = `${num} km`;
            if (!variantMap[label]) variantMap[label] = t.downloadUrl;
          }
        }

        setTourList(prev => prev.map(td => {
          if (!isBaumberge(td.name)) return td;
          const desiredLabels = ['48 km', '78 km', '106 km'];
          const existing: TourVariant[] = td.variants && td.variants.length ? td.variants : desiredLabels.map(l => ({ label: l }));
          const merged = existing.map(v => ({ ...v, gpxUrl: variantMap[v.label] || v.gpxUrl }));
          return { ...td, variants: merged };
        }));
      } catch (e) {
        console.error('Konnte Varianten-Links nicht laden', e);
      }
    };
    loadVariantLinks();
  }, []);

  return (
    <section className="bg-snow py-32">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-anton text-4xl text-prussian text-center mb-12">
            Tour-Termine 2026
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow-lg border border-forest/10">
              <thead className="bg-forest text-white">
                <tr>
                  <th className="px-4 py-3 text-left">Datum & Zeit</th>
                  <th className="px-4 py-3 text-left">Tour</th>
                  <th className="px-4 py-3 text-left">Treffpunkt</th>
                  <th className="px-4 py-3 text-left">Details</th>
                  <th className="px-4 py-3 text-left">Route</th>
                </tr>
              </thead>
              <tbody>
                {tourList.map((tour, index) => (
                  <tr
                    key={index}
                    className={`border-t border-forest/10 ${
                      index % 2 === 0 ? 'bg-forest/5' : 'bg-white'
                    } ${tour.cancelled ? 'opacity-60' : ''}`}
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium">{tour.date}</div>
                      <div className="text-sm text-gray-600">{tour.time}</div>
                      {tour.day && (
                        <div className="text-sm text-gray-600">{tour.day}</div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {tour.name === "in Planung" ? (
                        <div className="text-gray-400 italic">in Planung</div>
                      ) : (
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={tour.cancelled ? 'line-through text-gray-500' : ''}>
                            {tour.name}
                          </span>
                          {tour.cancelled && (
                            <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700 border border-red-200">
                              Abgesagt
                            </span>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{tour.location}</div>
                      <div className="text-sm text-gray-600">{tour.address}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{tour.distance}</div>
                      {tour.elevation && (
                        <div className="text-sm text-gray-600 flex items-center gap-1">
                          <Mountain className="w-3.5 h-3.5 text-forest/70" aria-hidden="true" />
                          <span>{tour.elevation}</span>
                        </div>
                      )}
                      <div className="text-sm text-gray-600">{tour.speed}</div>
                      {tour.bikeNote && (
                        <div className="text-sm text-forest/90 mt-1">{tour.bikeNote}</div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {tour.variants && tour.variants.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {tour.variants.map((variant, vIdx) => (
                            <div key={vIdx} className="border border-forest/10 rounded-lg p-2">
                              <div className="mb-2">
                                <div className="text-sm font-medium">{variant.label}</div>
                                {variant.elevation && (
                                  <div className="text-xs text-gray-600 flex items-center gap-1">
                                    <Mountain className="w-3 h-3 text-forest/70" aria-hidden="true" />
                                    <span>{variant.elevation}</span>
                                  </div>
                                )}
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {variant.komootUrl ? (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-forest hover:text-forest hover:bg-forest/5"
                                    asChild
                                  >
                                    <a 
                                      href={variant.komootUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      title="Route auf Komoot ansehen"
                                    >
                                      <Link2 className="w-4 h-4" />
                                    </a>
                                  </Button>
                                ) : (
                                  <span className="text-xs text-gray-400">Komoot bald verfügbar</span>
                                )}
                                {variant.gpxUrl ? (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-forest hover:text-forest hover:bg-forest/5"
                                    asChild
                                  >
                                    <a 
                                      href={variant.gpxUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      title="GPX herunterladen"
                                    >
                                      <Download className="w-4 h-4" />
                                    </a>
                                  </Button>
                                ) : (
                                  <span className="text-xs text-gray-400">GPX bald verfügbar</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          {tour.mapUrl && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-forest hover:text-forest hover:bg-forest/5"
                              asChild
                            >
                              <a 
                                href={tour.mapUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Route auf Google Maps ansehen"
                              >
                                <Map className="w-4 h-4" />
                              </a>
                            </Button>
                          )}
                          {tour.komootUrl && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-forest hover:text-forest hover:bg-forest/5"
                              asChild
                            >
                              <a 
                                href={tour.komootUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Route auf Komoot ansehen"
                              >
                                <Link2 className="w-4 h-4" />
                              </a>
                            </Button>
                          )}
                          {tour.gpxUrl && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-forest hover:text-forest hover:bg-forest/5"
                              asChild
                            >
                              <a 
                                href={tour.gpxUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="GPX herunterladen"
                              >
                                <Download className="w-4 h-4" />
                              </a>
                            </Button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-center text-gray-600 mt-6 italic">
            Streckendetails und GPX-Tracks werden rechtzeitig vor den jeweiligen Touren veröffentlicht.
          </p>
        </div>
      </div>
    </section>
  );
};

export default TourDates;
