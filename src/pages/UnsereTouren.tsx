import { ArrowLeft, Download } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const UnsereTouren = () => {
  const tours = [
    {
      name: "Altenberge-Häger",
      filename: "Altenberge-Häger.gpx",
      driveUrl: "https://drive.google.com/file/d/1Mddv5BjKvPysk0ChLkdBTuScZUhfc0rr/view?usp=drive_link"
    },
    {
      name: "Durch die Seppenrader Schweiz",
      filename: "Durch die Seppenrader Schweiz 58 Km.gpx",
      driveUrl: "https://drive.google.com/file/d/1S5yx3WpMVTNPd66kA_YtTq5ilvERc-5Q/view?usp=drive_link"
    },
    {
      name: "Henrichenburg Schiffshebewerk",
      filename: "Henrichenburg-schiffshebewerk.gpx",
      driveUrl: "https://drive.google.com/file/d/1e2a-SMAtAghNHgCEpI1pUapj6L7eUWry/view?usp=drive_link"
    },
    {
      name: "Matjes-Tour",
      filename: "Matjes-tour 1.gpx",
      driveUrl: "https://drive.google.com/file/d/1e2Zj8vouvXLYwX1xMxahS5SFm_Eb-aMD/view?usp=drive_link"
    },
    {
      name: "Rheinpromenade Wesel",
      filename: "Rheinpromenade-wesel.gpx",
      driveUrl: "https://drive.google.com/file/d/1rdLMEVwn-gTRIk07TpV6iIpDWh6Piiad/view?usp=drive_link"
    },
    {
      name: "Schloss Nordkirchen",
      filename: "SchlossNordkirchen.gpx",
      driveUrl: "https://drive.google.com/file/d/1SQLxLmVSxIMqBbUapXk0nZ1g40SsX0wN/view?usp=drive_link"
    }
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
                Hier können Sie sich kostenlos die GPS-Daten der Hoffnungsradler-Touren herunterladen.
              </p>
              <p className="text-text text-lg max-w-4xl mx-auto">
                Die Tracks stehen Ihnen im GPX-Format zur Verfügung und können in alle gängigen 
                Navigationsgeräte und Apps importiert werden.
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
                        <a 
                          href={tour.driveUrl} 
                          target="_blank"
                          rel="noopener noreferrer"
                        >
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
          </div>
        </div>
      </main>
    </div>
  );
};

export default UnsereTouren;
