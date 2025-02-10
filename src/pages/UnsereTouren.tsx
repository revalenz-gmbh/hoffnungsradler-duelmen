import { ArrowLeft, Download } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const UnsereTouren = () => {
  const tours = [
    {
      name: "Dülmen-Büren-Dülmen",
      filename: "Dulmen-Buren-Dulmen.gpx",
    },
    {
      name: "Henrichenburg-Schiffshebewerk",
      filename: "Henrichenburg-Schiffshebewerk.gpx",
    },
    {
      name: "Rieselfelder-Handorf",
      filename: "Rieselfelder-Handorf.gpx",
    },
    {
      name: "Dülmen-Legden-Düstermühle",
      filename: "Dulmen-Legden-Dustermuhle.gpx",
    },
    {
      name: "Dülmen Offlumer-See",
      filename: "Dulmen-Offlumer-See.gpx",
    },
    {
      name: "Dülmen-Sendenhorst",
      filename: "Dulmen-Sendenhorst.gpx",
    },
    {
      name: "Dülmen Zwillbrocker-Venn-Stadtlohn",
      filename: "Dulmen-Zwillbrocker-Venn-Stadtlohn.gpx",
    },
    {
      name: "Rheinpromenade-Wesel",
      filename: "Rheinpromenade-Wesel.gpx",
    },
    {
      name: "Schloß-Raesfeld-Heiden",
      filename: "Schloss-Raesfeld-Heiden.gpx",
    },
    {
      name: "12 Schlösser Tour",
      filename: "12-Schlosser-Tour.gpx",
    },
    {
      name: "Karfreitags-Tour 2024",
      filename: "Karfreitags-Tour-2024.gpx",
    },
  ];

  return (
    <div className="min-h-screen bg-snow">
      {/* Header with Back Navigation */}
      <header className="fixed top-0 w-full z-50 bg-snow/80 backdrop-blur-lg shadow-sm">
        <div className="container mx-auto px-4">
          <nav className="flex items-center h-20">
            <Link
              to="/"
              className="flex items-center gap-2 text-prussian hover:text-prussian/80 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Zurück
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-40 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Hero Section */}
            <div className="mb-12 text-center">
              <h1 className="font-anton text-4xl md:text-5xl text-prussian mb-12">
                GPS-Dateien unserer Touren
              </h1>
              <p className="text-text text-lg max-w-4xl mx-auto mb-6">
                Hier können Sie sich kostenlos die GPS-Daten der
                Hoffnungsradler-Dülmen herunterladen.
              </p>
              <p className="text-text text-lg max-w-4xl mx-auto">
                Wir stellen Ihnen den Track der Hoffnungsradler in den Formaten
                .gpx zur Verfügung.
              </p>
            </div>

            {/* Downloads Section */}
            <div className="bg-white rounded-lg p-8 shadow-lg border border-forest/10">
              <div className="space-y-4">
                {tours.map((tour, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-lg text-prussian">{tour.name}</span>
                      <Button
                        variant="outline"
                        className="flex items-center gap-2 text-forest hover:text-forest hover:bg-forest/5"
                        asChild
                      >
                        <a href={`/gps/${tour.filename}`} download>
                          <Download className="w-4 h-4" />
                          GPX herunterladen
                        </a>
                      </Button>
                    </div>
                    {index < tours.length - 1 && (
                      <Separator className="mt-2 bg-forest/5" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Ferry Information */}
            <div className="mt-12 bg-white rounded-lg p-6 md:p-8 shadow-lg border border-forest/10">
              <h2 className="font-medium text-xl text-prussian mb-4">
                Zusatzinformation für die Tour nach Arnheim
              </h2>
              <p className="text-text">
                <strong>Issel-Fähre Brummen - Bronkhorst:</strong> bei ca. 151
                km (Autofahre)
                <br />
                Mobil: 06-15020976
                <br />
                Fahrzeiten:
                <br />
                1.5.-30.9.: mo-fr 7.30-19.00 h; sa+so 9.30-19.00 h
                <br />
                1.10.-30.4.: mo-fr 7.30-17.30 h; sa+so 10.00–17.00 h
                <br />
                Keine Fahrt bei Eisgang, mehr als Windstärke 7 und bei
                Hochwasser.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UnsereTouren;
