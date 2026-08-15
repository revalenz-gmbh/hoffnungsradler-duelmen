import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import BreadcrumbSchema from "@/components/schemas/BreadcrumbSchema";

const Sponsoren = () => {
  const sponsors = [
    // Erste Reihe: Aktive Hauptsponsoren
    {
      name: "Baumschule Rüskamp",
      logo: "/logos/68952004-e13e-4290-a8a9-440e9cc4918f.png",
      website: "https://www.rueskamp-welte.de/",
    },
    {
      name: "Stadtwerke Dülmen GmbH",
      logo: "/logos/Stw_Logo_transparent_NEU_10_12__Original.gif",
      website:
        "http://www.stadtwerke-duelmen.de/privatkunden/service/online-portal/",
    },
    {
      name: "Fahrrad XXL Hürter",
      logo: "/logos/c8eeff6b-1d45-4b78-8780-07ac23bdfa0e.png",
      website:
        "https://www.fahrrad-xxl.de/filiale/muenster/?filiale=006_MS&gclid=EAIaIQobChMI1JixkIiP2QIVCPEbCh0olwhvEAAYASAAEgIYkPD_BwE",
    },
    {
      name: "Laumann Druck & Verlag",
      logo: "/logos/cab5fd4d-2b5d-4af9-9499-04423c7de1eb.png",
      website: "https://laumann-verlag.de/",
    },
    {
      name: "Vette Repro & Bürobedarfscenter GmbH",
      logo: "/logos/Vette_Logo.gif",
      website: "http://www.repro-vette.de/",
    },
  ];

  return (
    <div className="min-h-screen bg-snow">
      <SEOHead 
        title="Unsere Sponsoren und Partner"
        description="Danke an unsere Sponsoren und Partner, die die Hoffnungsradler Dülmen unterstützen: Baumschule Rüskamp, Stadtwerke Dülmen, Fahrrad XXL Hürter, Laumann Verlag und viele mehr."
        url="https://www.hoffnungs-radler-duelmen.de/sponsoren"
        keywords="Sponsoren Hoffnungsradler, Partner Dülmen, Rüskamp, Stadtwerke Dülmen, Fahrrad XXL"
      />
      <BreadcrumbSchema items={[
        { name: "Startseite", url: "https://www.hoffnungs-radler-duelmen.de" },
        { name: "Sponsoren", url: "https://www.hoffnungs-radler-duelmen.de/sponsoren" }
      ]} />
      
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
          <div className="max-w-6xl mx-auto">
            {/* Title Section */}
            <div className="flex flex-col items-center mb-12">
              <div className="w-48 h-48 mb-8 bg-forest/5 rounded-full p-4 rotate-3 transition-transform hover:rotate-6">
                <img
                  src="/logos/aa82fed0-d01b-4922-b10c-c9a4b9dedb38.png"
                  alt="Hoffnungsradler Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <h1 className="font-anton text-4xl md:text-5xl text-prussian mb-4">
                Unsere Sponsoren
              </h1>
              <p className="text-text text-xl max-w-3xl text-center">
                Wir unterstützen die Tour der Hoffnung zugunsten krebskranker
                Kinder.
              </p>
            </div>

            {/* Sponsors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sponsors.map((sponsor, index) => (
                <a
                  key={index}
                  href={sponsor.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <div className="bg-white rounded-lg p-6 h-48 flex items-center justify-center shadow-lg border border-forest/10 transition-all duration-300 hover:shadow-xl">
                    <img
                      src={sponsor.logo}
                      alt={`${sponsor.name} Logo`}
                      className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Sponsoren;
