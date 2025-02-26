import { ArrowLeft, Sun, Cloud, CloudRain, Wind } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import emailjs from '@emailjs/browser';

interface WeatherData {
  temperature: number;
  description: string;
  windSpeed: number;
  windDirection: string;
  humidity: number;
  icon: string;
}

interface Participant {
  name: string;
  contact: string;  // Email oder SMS
  contactType: 'email' | 'sms';  // WhatsApp entfernt
}

interface TourPlan {
  id: string;
  date: string;
  time: string;
  startPoint: string;
  description: string;
  creator: {
    name: string;
    contact: string;
    contactType: 'email' | 'sms';  // WhatsApp entfernt
  };
  participants: Participant[];
}

// Temporäre Liste der Vereinsmitglieder die Benachrichtigungen wünschen
// Später sollte dies aus einer Datenbank kommen
const SUBSCRIBED_MEMBERS = [
  { name: 'Max Mustermann', email: 'max@example.com' },
  { name: 'Anna Schmidt', email: 'anna@example.com' },
  // ... weitere Mitglieder
];

const SpontanTour = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  const [activeTour, setActiveTour] = useState<TourPlan | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newTour, setNewTour] = useState({
    date: "",
    time: "",
    startPoint: "",
    description: "",
    creator: {
      name: "",
      contact: "",
      contactType: 'email' as const  // Default auf email geändert
    }
  });
  
  const [newParticipant, setNewParticipant] = useState({
    name: "",
    contact: "",
    contactType: 'email' as const  // Default auf email geändert
  });

  // Funktion zur Umwandlung der Windrichtung in Himmelsrichtungen
  const getWindDirection = (degrees: number): string => {
    const directions = ['N', 'NO', 'O', 'SO', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  };

  // Wetterdaten von OpenWeatherMap API abrufen
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setWeatherError(null);
        const response = await fetch(
          'https://api.openweathermap.org/data/2.5/weather?q=Duelmen,DE&units=metric&appid=cf09fcafa05f1cc9b5c7df1f97c753e1&lang=de'
        );
        
        if (!response.ok) {
          console.error('API-Antwort nicht OK:', response.status);
          throw new Error(`HTTP-Fehler! Status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Wetterdaten empfangen:', data);

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
        console.error("Detaillierter Fehler beim Laden der Wetterdaten:", error);
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

  useEffect(() => {
    emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);
  }, []);

  const handleCreateTour = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const tour: TourPlan = {
        id: Date.now().toString(),
        ...newTour,
        participants: []
      };
      setActiveTour(tour);
      setIsCreating(false);
      
      // Alle angemeldeten Vereinsmitglieder benachrichtigen
      for (const member of SUBSCRIBED_MEMBERS) {
        try {
          await emailjs.send(
            import.meta.env.VITE_EMAILJS_SERVICE_ID,
            import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
            {
              to_email: member.email,
              to_name: member.name,
              is_new_tour: true,
              tour_date: new Date(tour.date).toLocaleDateString('de-DE', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }),
              tour_time: tour.time,
              tour_location: tour.startPoint,
              tour_leader: tour.creator.name,
              tour_description: tour.description
            },
            import.meta.env.VITE_EMAILJS_PUBLIC_KEY
          );
        } catch (error) {
          console.error(`Fehler beim Senden der Email an ${member.name}:`, error);
        }
      }
    } catch (error) {
      console.error('Fehler beim Erstellen der Tour:', error);
    }
  };

  const handleJoinTour = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTour) return;

    try {
      const updatedTour = {
        ...activeTour,
        participants: [...activeTour.participants, newParticipant]
      };
      setActiveTour(updatedTour);
      
      if (newParticipant.contactType === 'email') {
        await emailjs.send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID,
          import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
          {
            to_email: newParticipant.contact,
            to_name: newParticipant.name,
            is_new_tour: false,
            message_intro: 'Du bist erfolgreich der Spontan-Tour beigetreten!',
            tour_date: new Date(activeTour.date).toLocaleDateString('de-DE', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }),
            tour_time: activeTour.time,
            tour_location: activeTour.startPoint,
            tour_leader: activeTour.creator.name,
            tour_description: activeTour.description
          },
          import.meta.env.VITE_EMAILJS_PUBLIC_KEY
        );
      }

      setNewParticipant({
        name: "",
        contact: "",
        contactType: 'email'
      });
    } catch (error) {
      console.error('Fehler beim Beitreten der Tour:', error);
    }
  };

  return (
    <div className="min-h-screen bg-snow">
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

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Wetter-Sektion */}
            <div className="bg-white rounded-lg p-6 shadow-lg border border-forest/10 mb-8">
              <h2 className="font-anton text-2xl text-prussian mb-4">
                Aktuelles Wetter in Dülmen
              </h2>
              
              {weatherError ? (
                <div className="text-red-600">{weatherError}</div>
              ) : weather ? (
                <div className="space-y-6">
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
                </div>
              ) : (
                <div className="text-gray-600">Lade Wetterdaten...</div>
              )}
            </div>

            {/* Aktive Tour oder Tour-Erstellung */}
            <div className="bg-white rounded-lg p-6 shadow-lg border border-forest/10">
              {activeTour ? (
                <div>
                  <h2 className="font-anton text-2xl text-prussian mb-4">
                    Aktuelle Spontan-Tour
                  </h2>
                  <div className="space-y-4">
                    <p>
                      <span className="font-semibold">Datum:</span> {activeTour.date}
                    </p>
                    <p>
                      <span className="font-semibold">Uhrzeit:</span> {activeTour.time}
                    </p>
                    <p>
                      <span className="font-semibold">Treffpunkt:</span>{" "}
                      {activeTour.startPoint}
                    </p>
                    <p>
                      <span className="font-semibold">Beschreibung:</span>{" "}
                      {activeTour.description}
                    </p>
                    <div>
                      <p className="font-semibold mb-2">Teilnehmer:</p>
                      <ul className="list-disc list-inside">
                        {activeTour.participants.map((participant, index) => (
                          <li key={index}>{participant.name}</li>
                        ))}
                      </ul>
                    </div>
                    <form onSubmit={handleJoinTour} className="mt-4 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Dein Name
                        </label>
                        <Input
                          value={newParticipant.name}
                          onChange={(e) => setNewParticipant({
                            ...newParticipant,
                            name: e.target.value
                          })}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Kontakt für Benachrichtigungen
                        </label>
                        <div className="flex gap-2">
                          <Input
                            value={newParticipant.contact}
                            onChange={(e) => setNewParticipant({
                              ...newParticipant,
                              contact: e.target.value
                            })}
                            placeholder="Email oder SMS"
                            required
                          />
                        </div>
                      </div>
                      <Button type="submit" className="bg-forest hover:bg-forest/90">
                        Tour beitreten
                      </Button>
                    </form>
                  </div>
                </div>
              ) : (
                <div>
                  <h2 className="font-anton text-2xl text-prussian mb-4">
                    {isCreating ? "Neue Spontan-Tour erstellen" : "Keine aktive Tour"}
                  </h2>
                  {isCreating ? (
                    <form onSubmit={handleCreateTour} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Datum
                        </label>
                        <Input
                          type="date"
                          value={newTour.date}
                          onChange={(e) =>
                            setNewTour({ ...newTour, date: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Uhrzeit
                        </label>
                        <Input
                          type="time"
                          value={newTour.time}
                          onChange={(e) =>
                            setNewTour({ ...newTour, time: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Treffpunkt
                        </label>
                        <Input
                          value={newTour.startPoint}
                          onChange={(e) =>
                            setNewTour({ ...newTour, startPoint: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Beschreibung
                        </label>
                        <Textarea
                          value={newTour.description}
                          onChange={(e) =>
                            setNewTour({ ...newTour, description: e.target.value })
                          }
                          placeholder="Route, Geschwindigkeit, etc."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Dein Name
                        </label>
                        <Input
                          value={newTour.creator.name}
                          onChange={(e) => setNewTour({
                            ...newTour,
                            creator: { ...newTour.creator, name: e.target.value }
                          })}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Kontakt für Benachrichtigungen
                        </label>
                        <div className="flex gap-2">
                          <Input
                            value={newTour.creator.contact}
                            onChange={(e) => setNewTour({
                              ...newTour,
                              creator: { ...newTour.creator, contact: e.target.value }
                            })}
                            placeholder="Email oder SMS"
                            required
                          />
                        </div>
                      </div>
                      <Button type="submit" className="bg-forest hover:bg-forest/90">
                        Tour erstellen
                      </Button>
                    </form>
                  ) : (
                    <Button
                      onClick={() => setIsCreating(true)}
                      className="bg-forest hover:bg-forest/90"
                    >
                      Neue Spontan-Tour erstellen
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SpontanTour; 