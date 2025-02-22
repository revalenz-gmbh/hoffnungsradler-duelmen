import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TourDate {
  date: string;
  time: string;
  name: string;
  location: string;
  address: string;
  distance: string;
  speed: string;
}

const TourDates = () => {
  const tours: TourDate[] = [
    {
      date: "18.04.2025",
      day: "Karfreitag",
      name: "Ternschersee",
      distance: "52 km",
      time: "10:00 Uhr",
      location: "Rathausplatz Dülmen",
      address: "Marktstraße 1, Dülmen",
      speed: "25-27 km/h"
    },
    {
      date: "11.05.2025",
      day: "Sonntag",
      name: "in Planung",
      distance: " km",
      time: "10:00 Uhr",
      location: "Sportzentrum Süd",
      address: "Kapellenweg, Dülmen"
    },
    {
      date: "24.05.2025",
      day: "Samstag",
      name: "Münster Berg Fidel",
      distance: "70km",
      time: "14:00 Uhr",
      location: "Sportzentrum Süd",
      address: "Kapellenweg, Dülmen"
    },
    {
      date: "22.06.2025",
      day: "Sonntag",
      name: "in Planung",
      distance: " km",
      time: "10:00 Uhr",
      location: "Sportzentrum Süd",
      address: "Kapellenweg, Dülmen"
    },
    {
      date: "20.07.2025",
      day: "Sonntag",
      name: "in Planung",
      distance: " km",
      time: "10:00 Uhr",
      location: "Sportzentrum Süd",
      address: "Kapellenweg, Dülmen"
    },
    {
      date: "24.08.2028",
      day: "Sonntag",
      name: "in Planung",
      distance: " km",
      time: "10:00 Uhr",
      location: "Sportzentrum Süd",
      address: "Kapellenweg, Dülmen"
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
    },
  ];

  return (
    <section className="py-32 bg-snow">
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
                </tr>
              </thead>
              <tbody>
                {tours.map((tour, index) => (
                  <tr 
                    key={index}
                    className={`border-t border-forest/10 ${
                      index % 2 === 0 ? 'bg-forest/5' : 'bg-white'
                    }`}
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium">{tour.date}</div>
                      <div className="text-sm text-gray-600">{tour.time}</div>
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-8 text-center">
            <Link
              to="/unsere-touren"
              className="inline-flex items-center justify-center bg-forest text-white px-6 py-3 rounded-lg hover:bg-forest/90 transition-colors font-medium"
            >
              GPS-Dateien der Touren
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TourDates;
