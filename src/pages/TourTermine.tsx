import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import TourDates from "@/components/TourDates";

interface WeatherData {
  temperature: number;
  description: string;
  windSpeed: number;
  windDirection: string;
  humidity: number;
  icon: string;
}

const TourTermine = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherError, setWeatherError] = useState<string | null>(null);

  // Funktion zur Umwandlung der Windrichtung in Himmelsrichtungen
  const getWindDirection = (degrees: number): string => {
    const directions = ['N', 'NO', 'O', 'SO', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  };

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setWeatherError(null);
        const response = await fetch(
          'https://api.openweathermap.org/data/2.5/weather?q=Duelmen,DE&units=metric&appid=cf09fcafa05f1cc9b5c7df1f97c753e1&lang=de'
        );
        
        if (!response.ok) {
          throw new Error(`HTTP-Fehler! Status: ${response.status}`);
        }
        
        const data = await response.json();

        if (!data.main || !data.weather || !data.weather[0]) {
          throw new Error('Unerwartetes Datenformat von der API');
        }

        setWeather({
          temperature: Math.round(data.main.temp),
          description: data.weather[0].description,
          windSpeed: Math.round(data.wind.speed * 3.6),
          windDirection: getWindDirection(data.wind.deg),
          humidity: data.main.humidity,
          icon: data.weather[0].icon
        });
      } catch (error) {
        console.error("Fehler beim Laden der Wetterdaten:", error);
        setWeatherError(
          error instanceof Error 
            ? `Fehler: ${error.message}` 
            : "Wetterdaten konnten nicht geladen werden"
        );
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 900000);
    return () => clearInterval(interval);
  }, []);

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

              {/* Wetter Widget */}
              <div className="mt-8 bg-white rounded-lg p-6 shadow-lg border border-forest/10">
                <h2 className="font-anton text-2xl text-prussian mb-4">
                  Aktuelles Wetter in Dülmen
                </h2>
                
                {weatherError ? (
                  <div className="text-red-600">{weatherError}</div>
                ) : weather ? (
                  <div className="flex items-center gap-8">
                    <img
                      src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                      alt="Wetter Icon"
                      className="w-16 h-16"
                    />
                    <div>
                      <p className="text-3xl font-bold text-prussian">
                        {weather.temperature}°C
                      </p>
                      <p className="text-gray-600 capitalize">{weather.description}</p>
                    </div>
                    <div className="ml-auto space-y-2">
                      <p className="text-gray-600">
                        Wind: {weather.windSpeed} km/h aus {weather.windDirection}
                      </p>
                      <p className="text-gray-600">
                        Luftfeuchtigkeit: {weather.humidity}%
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-600">Lade Wetterdaten...</div>
                )}
              </div>

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
