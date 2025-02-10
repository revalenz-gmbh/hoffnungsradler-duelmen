import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const TourDates = () => {
  const tours = [
    {
      date: "29.03.2024",
      day: "Karfreitag",
      name: "Von Dorp to Dorp",
      distance: "55 km",
      time: "10.30 Uhr",
      location: "Rathausplatz Dülmen",
    },
    {
      date: "28.04.2024",
      day: "Sonntag",
      name: "Rinkerode-Senden",
      distance: "87 km",
      time: "10.00 Uhr",
      location: "Sportzentrum Süd, Kapellenweg",
    },
    {
      date: "25.05.2024",
      day: "Samstag",
      name: "Münster Berg Fidel",
      distance: "70 km",
      time: "14.00 Uhr",
      location: "Sportzentrum Süd/Kapellenweg",
    },
    {
      date: "23.06.2024",
      day: "Sonntag",
      name: "Haus Egelborg Legden",
      distance: "80 km",
      time: "10.00 Uhr",
      location: "Sportzentrum Süd/Kapellenweg",
    },
    {
      date: "21.07.2024",
      day: "Sonntag",
      name: "Felsenmühle Ochtrup",
      distance: "108 km",
      time: "10.00 Uhr",
      location: "Sportzentrum Süd/Kapellenweg",
    },
    {
      date: "25.08.2024",
      day: "Sonntag",
      name: "Sandstein-Route",
      distance: "80 km",
      time: "10.00 Uhr",
      location: "Sportzentrum Süd/Kapellenweg",
    },
    {
      date: "29.09.2024",
      day: "Sonntag",
      name: "Baumberger Alpin-Tour",
      distance: "48/78/106 km",
      time: "10.00 Uhr",
      location: "Sportzentrum Süd/Kapellenweg",
    },
  ];

  return (
    <section className="py-32 bg-snow">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-anton text-4xl text-prussian text-center mb-12">
            Tour-Termine 2024
          </h2>
          <div className="bg-white rounded-lg p-4 md:p-8 shadow-lg border border-forest/10">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[180px] font-medium text-prussian">
                      Datum
                    </TableHead>
                    <TableHead className="w-[200px] font-medium text-prussian">
                      Tour
                    </TableHead>
                    <TableHead className="w-[120px] font-medium text-prussian">
                      Distanz
                    </TableHead>
                    <TableHead className="w-[100px] font-medium text-prussian">
                      Start
                    </TableHead>
                    <TableHead className="min-w-[220px] font-medium text-prussian">
                      Treffpunkt
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tours.map((tour, index) => (
                    <TableRow key={index} className="hover:bg-forest/5">
                      <TableCell className="font-medium whitespace-nowrap">
                        {tour.day}, {tour.date}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {tour.name}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {tour.distance}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {tour.time}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {tour.location}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
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
