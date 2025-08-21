import { Link } from "react-router-dom";
import { Download, Map, Link2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

// Einfache Struktur für aktuelle Touren
interface TourDate {
  date: string;
  day?: string;
  name: string;
  distance: string;
  time: string;
  location: string;
  address: string;
  speed?: string;
  gpxUrl?: string;
  mapUrl?: string;
  komootUrl?: string;
  cancelled?: boolean;
}

// Exportierte Tour-Daten für 2025
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
    time: "10:00 Uhr",
    location: "Sportzentrum Süd",
    address: "Kapellenweg, Dülmen",
    speed: "frei"
  }
];

const TourDates = () => {
  return (
    <section className="bg-snow py-32">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-anton text-4xl text-prussian text-center mb-12">
            Tour-Termine 2025
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
                {tours2025.map((tour, index) => (
                  <tr 
                    key={index}
                    className={`border-t border-forest/10 ${
                      index % 2 === 0 ? 'bg-forest/5' : 'bg-white'
                    }`}
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
                        <div>{tour.name}</div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{tour.location}</div>
                      <div className="text-sm text-gray-600">{tour.address}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{tour.distance}</div>
                      <div className="text-sm text-gray-600">{tour.speed}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
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
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TourDates;
