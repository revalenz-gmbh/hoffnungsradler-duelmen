
import { ArrowLeft, Handshake } from "lucide-react";
import { Link } from "react-router-dom";

const Sponsoren = () => {
  const sponsors = [
    {
      name: "DÜMO Reisemobile",
      logo: "/lovable-uploads/40a11938-1150-4706-9454-5cbe35d8b8dd.png",
      website: "#",
    },
    {
      name: "Kes Thiel & Co",
      logo: "/lovable-uploads/a0371457-045a-4dd5-9f40-ac475a36ef3b.png",
      website: "#",
    },
    {
      name: "Fahrrad XXL Hürter",
      logo: "/lovable-uploads/c8eeff6b-1d45-4b78-8780-07ac23bdfa0e.png",
      website: "#",
    },
    {
      name: "Laumann Druck & Verlag",
      logo: "/lovable-uploads/cab5fd4d-2b5d-4af9-9499-04423c7de1eb.png",
      website: "#",
    },
    {
      name: "Stadtwerke Dülmen GmbH",
      logo: "/lovable-uploads/50f80957-1d08-4ecb-bcd8-83d0bd0aaa00.png",
      website: "#",
    },
    {
      name: "Baumschule Rüskamp",
      logo: "/lovable-uploads/68952004-e13e-4290-a8a9-440e9cc4918f.png",
      website: "#",
    },
    {
      name: "A&R Münsterland",
      logo: "/lovable-uploads/373bd578-37cc-42bf-b984-e8359e6a41e8.png",
      website: "#",
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
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Title Section */}
            <div className="flex flex-col items-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-forest/10 text-forest mb-6">
                <Handshake className="w-8 h-8" />
              </div>
              <h1 className="font-anton text-4xl md:text-5xl text-prussian mb-4">
                Unsere Sponsoren
              </h1>
              <p className="text-text text-lg max-w-2xl text-center">
                Wir danken unseren Sponsoren für ihre großzügige Unterstützung.
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
