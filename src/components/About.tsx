
const About = () => {
  return (
    <section id="wir-über-uns" className="py-20 bg-snow">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-anton text-4xl text-prussian mb-12 text-center">Über Uns</h2>

          <div className="bg-white rounded-lg p-8 shadow-lg border border-forest/10 relative">
            {/* Letter Header with Logo */}
            <div className="absolute -top-8 right-8 bg-white rounded-lg p-2 shadow-md">
              <img
                src="/lovable-uploads/aa82fed0-d01b-4922-b10c-c9a4b9dedb38.png"
                alt="Hoffnungsradler Logo"
                className="w-24 h-auto"
              />
            </div>

            <div className="space-y-4 font-inter text-text leading-relaxed">
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

              <p className="font-semibold text-prussian mt-6">
                Insgesamt konnten durch die Dülmener Hoffnungsradler über 80.000
                Euro Spenden gesammelt werden!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

