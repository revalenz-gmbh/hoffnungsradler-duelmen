import { Link } from "react-router-dom";
import TourDates from "@/components/TourDates";
import SEOHead from "@/components/SEOHead";
import BreadcrumbSchema from "@/components/schemas/BreadcrumbSchema";

const TourTermine = () => {
  return (
    <div className="min-h-screen bg-snow">
      <SEOHead 
        title="Tour-Termine 2026 - Aktuelle Rennradtouren"
        description="Alle aktuellen Tour-Termine der Hoffnungsradler Dülmen 2026. Gemeinsame Rennradtouren im Münsterland für den guten Zweck. Inkl. GPX-Downloads."
        url="https://www.hoffnungs-radler-duelmen.de/tour-termine"
        keywords="Rennradtouren 2026, Tour-Termine Dülmen, Baumberge Alpin-Tour, Münsterland Radtouren, GPX Download"
      />
      <BreadcrumbSchema items={[
        { name: "Startseite", url: "https://www.hoffnungs-radler-duelmen.de" },
        { name: "Tour-Termine", url: "https://www.hoffnungs-radler-duelmen.de/tour-termine" }
      ]} />
      

      {/* Main Content */}
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Title Section */}
            <div className="flex flex-col items-center mb-12">
              <div className="w-48 h-48 mb-8 bg-forest/5 rounded-full p-4 rotate-3 transition-transform hover:rotate-6">
                <img loading="lazy" decoding="async"
                  src="/logos/aa82fed0-d01b-4922-b10c-c9a4b9dedb38.png"
                  alt="Hoffnungsradler Logo"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            
            {/* Tour Dates Section */}
            <div className="-mt-16">
              <TourDates />

              {/* Legal Notice - mit negativem margin-top */}
              <section className="bg-white rounded-lg p-8 shadow-lg border border-forest/10 -mt-16">
                <div className="space-y-4 text-text text-center">
                  <p className="italic">
                    Mit Ausnahme der "Baumberge Alpin-Tour" werden alle Touren von erfahrenen Tour-Guides geführt. Die Teilnahme erfolgt auf eigene Verantwortung.
                  </p>
                  <p className="font-medium">
                    Das Tragen eines Fahrradhelms ist bei allen gemeinsamen Touren verpflichtend.
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

              {/* Tour-Archiv Link */}
              <div className="mt-8 text-center">
                <Link 
                  to="/unsere-touren" 
                  className="inline-block bg-forest text-white px-6 py-3 rounded-lg hover:bg-forest/90 transition-colors"
                >
                  Zum Tour-Archiv
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TourTermine;
