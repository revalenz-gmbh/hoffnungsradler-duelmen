import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import TourDates from "@/components/TourDates";

const TourTermine = () => {
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
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Title Section */}
            <div className="flex flex-col items-center mb-12">
              <div className="w-48 h-48 mb-8 bg-forest/5 rounded-full p-4 rotate-3 transition-transform hover:rotate-6">
                <img
                  src="/lovable-uploads/aa82fed0-d01b-4922-b10c-c9a4b9dedb38.png"
                  alt="Hoffnungsradler Logo"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            {/* Tour Dates Section */}
            <div className="-mt-16">
              <TourDates />

              {/* Legal Notice */}
              <section className="bg-white rounded-lg p-8 shadow-lg border border-forest/10 mt-8">
                <div className="space-y-4 text-text text-center">
                  <p className="italic">
                    Mit Ausnahme der "Baumberge Alpin-Tour" werden alle Touren von erfahrenen Tour-Guides geführt. Die Teilnahme erfolgt auf eigene Verantwortung.
                  </p>
                  <p className="font-medium">
                    Alle Teilnehmer sind verpflichtet, die Regelungen der Straßenverkehrsordnung (StVO) einzuhalten und eigenverantwortlich für ihre persönliche Sicherheit zu sorgen.
                  </p>
                  <p className="font-medium">
                    Der Verein und die Tour-Guides übernehmen keine Haftung für Personen- oder Sachschäden während der Veranstaltung.
                  </p>
                  <p className="mt-6">
                    <Link 
                      to="/medienhinweis" 
                      className="text-forest hover:text-forest/80 underline transition-colors"
                    >
                      Wichtiger Hinweis zu Foto- und Videoaufnahmen während der Tour
                    </Link>
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TourTermine;
