
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const About = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section id="wir-über-uns" className="py-20 bg-snow">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h2 className="font-anton text-4xl text-prussian">Über Uns</h2>
            <div className="bg-white rounded-lg p-2 shadow-md transform hover:rotate-3 transition-transform">
              <img
                src="/lovable-uploads/aa82fed0-d01b-4922-b10c-c9a4b9dedb38.png"
                alt="Hoffnungsradler Logo"
                className="w-24 h-auto"
              />
            </div>
          </div>

          <div className="bg-white rounded-lg p-8 shadow-lg border border-forest/10">
            <div className="space-y-4 font-inter text-text leading-relaxed">
              {/* Mobile: Show only first paragraph and toggle button */}
              <div className="md:hidden">
                <p>
                  Die Initiative "Dülmener Hoffnungsradler" ist im Jahr 2003 durch Josef
                  Friedag und Carlo Hüwe ins Leben gerufen worden.
                </p>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="flex items-center justify-center w-full mt-4 text-prussian"
                >
                  {isExpanded ? (
                    <>
                      Weniger anzeigen <ChevronUp className="ml-2 w-4 h-4" />
                    </>
                  ) : (
                    <>
                      Mehr anzeigen <ChevronDown className="ml-2 w-4 h-4" />
                    </>
                  )}
                </button>
                {isExpanded && (
                  <div className="mt-4 space-y-4 animate-fade-in">
                    <p>
                      Seit mittlerweile 21 Jahren werden jährlich sieben bis acht geführte
                      Rennradtouren durch die münsterländische Parklandschaft auf
                      verkehrsarmen Wegen organisiert.
                    </p>

                    <p>
                      Das von den Teilnehmern freiwillig und in eigenem Ermessen
                      entrichtete Startgeld wird von den Initiatoren gesammelt und nach
                      Saisonabschluss der Kinderkrebshilfe gespendet. Von Beginn an
                      spenden nicht nur die aktiven Radsportler, sondern auch immer wieder
                      diverse Firmen und Unternehmen, siehe Sponsorenseite.
                    </p>

                    <p className="font-semibold text-prussian">
                      Insgesamt konnten durch die Dülmener Hoffnungsradler über 80.000
                      Euro Spenden gesammelt werden!
                    </p>
                  </div>
                )}
              </div>

              {/* Desktop: Show all content */}
              <div className="hidden md:block space-y-4">
                <p>
                  Die Initiative "Dülmener Hoffnungsradler" ist im Jahr 2003 durch Josef
                  Friedag und Carlo Hüwe ins Leben gerufen worden.
                </p>

                <p>
                  Seit mittlerweile 21 Jahren werden jährlich sieben bis acht geführte
                  Rennradtouren durch die münsterländische Parklandschaft auf
                  verkehrsarmen Wegen organisiert.
                </p>

                <p>
                  Das von den Teilnehmern freiwillig und in eigenem Ermessen
                  entrichtete Startgeld wird von den Initiatoren gesammelt und nach
                  Saisonabschluss der Kinderkrebshilfe gespendet. Von Beginn an
                  spenden nicht nur die aktiven Radsportler, sondern auch immer wieder
                  diverse Firmen und Unternehmen, siehe Sponsorenseite.
                </p>

                <p className="font-semibold text-prussian">
                  Insgesamt konnten durch die Dülmener Hoffnungsradler über 80.000
                  Euro Spenden gesammelt werden!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
