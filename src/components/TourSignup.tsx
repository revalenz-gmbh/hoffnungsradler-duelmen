
import { CalendarPlus } from "lucide-react";

const TourSignup = () => {
  return (
    <section className="py-20 bg-[#F2FCE2]">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white rounded-lg p-8 md:p-12 shadow-lg border border-forest/10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-forest/10 text-forest mb-6">
              <CalendarPlus className="w-8 h-8" />
            </div>
            <h2 className="font-anton text-3xl text-prussian mb-4">
              Jetzt für die nächste Tour anmelden
            </h2>
            <p className="text-text mb-8 max-w-2xl mx-auto">
              Melden Sie sich für unsere nächste Tour an und werden Sie Teil einer wunderbaren Gemeinschaft. 
              Jeder Kilometer zählt im Kampf gegen Kinderkrebs.
            </p>
            <a
              href="mailto:info@hoffnungsradler-duelmen.de?subject=Tour-Anmeldung"
              className="inline-flex items-center justify-center bg-forest text-white px-6 py-3 rounded-lg hover:bg-forest/90 transition-colors font-medium"
            >
              Zur Tour anmelden
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TourSignup;
