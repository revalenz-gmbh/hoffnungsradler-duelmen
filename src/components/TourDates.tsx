
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
    <section className="py-20 bg-snow">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-anton text-4xl text-prussian text-center mb-12">
            Tour-Termine 2024
          </h2>
          <div className="bg-white rounded-lg p-4 md:p-8 shadow-lg border border-forest/10">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Datum</TableHead>
                    <TableHead>Tour</TableHead>
                    <TableHead>Distanz</TableHead>
                    <TableHead>Start</TableHead>
                    <TableHead>Treffpunkt</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tours.map((tour, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {tour.day}, {tour.date}
                      </TableCell>
                      <TableCell>{tour.name}</TableCell>
                      <TableCell>{tour.distance}</TableCell>
                      <TableCell>{tour.time}</TableCell>
                      <TableCell>{tour.location}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TourDates;
