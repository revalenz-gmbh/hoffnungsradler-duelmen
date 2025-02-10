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
            <div className="-mt-32">
              <TourDates />

              {/* Legal Notice */}
              <section className="bg-white rounded-lg p-8 shadow-lg border border-forest/10 -mt-16">
                <div className="space-y-4 text-text text-center">
                  <p className="italic">
                    Die Baumberger-Touren sind nicht ausgeschildert und nur als
                    GPS-Track veröffentlicht.
                  </p>
                  <p className="font-medium">
                    Die Bestimmungen der StVO sind einzuhalten. Jeder Teilnehmer
                    fährt auf eigene Gefahr.
                  </p>
                  <p className="font-medium">
                    Für Unfälle wird keine Haftung übernommen.
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
