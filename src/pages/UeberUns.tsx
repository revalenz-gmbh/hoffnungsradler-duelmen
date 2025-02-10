import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const UeberUns = () => {
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
            {/* Logo and Title Section */}
            <div className="flex flex-col items-center mb-12">
              <div className="w-48 h-48 mb-8 bg-forest/5 rounded-full p-4 rotate-3 transition-transform hover:rotate-6">
                <img
                  src="/lovable-uploads/aa82fed0-d01b-4922-b10c-c9a4b9dedb38.png"
                  alt="Hoffnungsradler Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <h1 className="font-anton text-4xl md:text-5xl text-prussian mb-4">
                Wir über uns
              </h1>
            </div>

            {/* Content Sections */}
            <div className="space-y-12 font-inter text-text">
              {/* History Section */}
              <section className="bg-white rounded-lg p-8 shadow-lg border border-forest/10">
                <h2 className="font-anton text-2xl text-prussian mb-6">
                  Unsere Geschichte
                </h2>
                <div className="space-y-4 leading-relaxed">
                  <p>
                    Die Initiative "Dülmener Hoffnungsradler" ist im Jahr 2003
                    durch Josef Friedag und Carlo Hüwe ins Leben gerufen worden.
                  </p>
                  <p>
                    Seit mittlerweile 21 Jahren werden jährlich sieben bis acht
                    geführte Rennradtouren durch die münsterländische
                    Parklandschaft auf verkehrsarmen Wegen organisiert.
                  </p>
                  <p>
                    Das von den Teilnehmern freiwillig und in eigenem Ermessen
                    entrichtete Startgeld wird von den Initiatoren gesammelt und
                    nach Saisonabschluss der Kinderkrebshilfe gespendet.
                  </p>
                  <p>
                    Von Beginn an spenden nicht nur die aktiven Radsportler,
                    sondern auch immer wieder diverse Firmen und Unternehmen –
                    siehe{" "}
                    <Link
                      to="/sponsoren"
                      className="font-semibold text-forestDark hover:text-forest transition-colors underline"
                    >
                      Sponsorenseite
                    </Link>
                    .
                  </p>
                  <p className="text-forest font-semibold">
                    Insgesamt konnten durch die Dülmener Hoffnungsradler über
                    80.000 Euro Spenden gesammelt werden!
                  </p>
                </div>
              </section>

              {/* Donations Section */}
              <section className="bg-white rounded-lg p-8 shadow-lg border border-forest/10">
                <h2 className="font-anton text-2xl text-prussian mb-6">
                  Spendenverwendung
                </h2>
                <div className="space-y-4 leading-relaxed">
                  <p>
                    Bis 2013 wurden die Spenden der Dülmener Hoffnungsradler an
                    die überregionale Institution "Tour der Hoffnung" weiter
                    geleitet. Seit dem Zeitpunkt werden die gesammelten Spenden
                    nach dem Motto "aus der Region - für die Region" hier im
                    Umkreis überreicht, wie die Elterninitiative krebskranker
                    Kinder in Datteln und im vergangenen Jahr die Kinder- u.
                    Jugendliche-Krebsberatungsstelle Münster.
                  </p>
                  <p>
                    Die Spenden werden für psychosoziale Maßnahmen,
                    Kinderfreizeiten, Übernachtungsmöglichkeiten für Eltern von
                    erkrankten Kindern etc. verwendet, zumal Krankenkassen nur
                    für die medizinische Versorgung leisten können.
                  </p>
                </div>
              </section>

              {/* In Memoriam Section */}
              <section className="bg-white rounded-lg p-8 shadow-lg border border-forest/10">
                <h2 className="font-anton text-2xl text-prussian mb-6">
                  In Memoriam
                </h2>
                <p className="leading-relaxed">
                  Ein schwerer Schicksalsschlag traf die Dülmener
                  Hoffnungsradler, als im November 2015 Carlo Hüwe im Alter von
                  66 Jahren an einer Tumorerkrankung viel zu früh verstarb.
                </p>
              </section>

              {/* Current Team Section */}
              <section className="bg-white rounded-lg p-8 shadow-lg border border-forest/10">
                <h2 className="font-anton text-2xl text-prussian mb-6">
                  Aktuelles Orgateam
                </h2>
                <p className="mb-4">
                  Zum aktuellen Orgateam der Dülmener Hoffnungsradler gehören
                  seit 2023:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Josef Friedag als Hauptinitiator und Tourguide</li>
                  <li>
                    Ludger Dey zur Pflege der Internetseite, Tourguide,
                    Öffentlichkeitsarbeit
                  </li>
                  <li>Martin Stolz als Tourguide, Öffentlichkeitsarbeit</li>
                </ul>
              </section>

              {/* Website Section */}
              <section className="bg-white rounded-lg p-8 shadow-lg border border-forest/10">
                <h2 className="font-anton text-2xl text-prussian mb-6">
                  Internetseite
                </h2>
                <p className="leading-relaxed">
                  Seit 2017 haben die Dülmener Hoffnungsradler wieder eine
                  eigene neue Internetseite:{" "}
                  <a
                    href="https://www.hoffnungs-radler-duelmen.de"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-forestDark hover:text-forest transition-colors underline"
                  >
                    www.hoffnungs-radler-duelmen.de
                  </a>
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UeberUns;
