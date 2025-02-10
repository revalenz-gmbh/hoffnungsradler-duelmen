
const About = () => {
  return (
    <section id="wir-über-uns" className="py-20 bg-snow">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="font-anton text-4xl text-prussian mb-6">Über Uns</h2>
          <p className="font-inter text-lg text-text leading-relaxed">
            Wir sind eine Gemeinschaft von begeisterten Radfahrern, die sich für
            nachhaltigen Sport und soziales Engagement einsetzen. Gemeinsam
            erkunden wir die schönsten Routen um Dülmen und schaffen dabei
            bleibende Erinnerungen.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img
              src="/lovable-uploads/bd60a530-eb66-4c55-a5d7-85937bf178c2.png"
              alt="Diverse group of cyclists"
              className="w-full h-[400px] object-cover"
            />
          </div>
          <div className="space-y-6">
            <h3 className="font-playfair text-2xl text-prussian">
              Unsere Mission
            </h3>
            <p className="font-inter text-text">
              Als Hoffnungsradler Dülmen verbinden wir Radsport mit
              gesellschaftlichem Engagement. Jede Tour ist eine Gelegenheit, unsere
              Gemeinschaft zu stärken und einen positiven Beitrag zu leisten.
            </p>
            <a
              href="#tour-termine"
              className="inline-block bg-forest text-white font-inter px-6 py-3 rounded-lg transition-transform hover:scale-105"
            >
              Mitmachen
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
