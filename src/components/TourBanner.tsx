import React, { useMemo } from 'react';
import { Calendar, MapPin, Users } from 'lucide-react';
import { tours2025 } from './TourDates';

const TourBanner = () => {
  // Funktion um das nächste Tour-Datum zu finden
  const nextTour = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Auf Mitternacht setzen für Vergleich
    
    // Touren nach Datum sortieren und die nächste finden
    const futureTours = tours2025
      .map(tour => {
        // Deutsche Datumsformat (DD.MM.YYYY) in Date Object konvertieren
        const [day, month, year] = tour.date.split('.');
        const tourDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        return { ...tour, dateObj: tourDate };
      })
      .filter(tour => tour.dateObj >= today) // Nur zukünftige Touren
      .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime()); // Nach Datum sortieren
    
    return futureTours.length > 0 ? futureTours[0] : null;
  }, []);

  // Banner ausblenden wenn keine zukünftige Tour vorhanden ist
  if (!nextTour) {
    return null;
  }

  // Datum formatieren (z.B. "23. August 2025")
  const formatDate = (dateStr: string) => {
    const [day, month, year] = dateStr.split('.');
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return date.toLocaleDateString('de-DE', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  return (
    <div className="fixed top-20 w-full z-40 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-2 md:py-4 shadow-xl">
      <div className="container mx-auto px-4">
        {/* Mobile: Kompakte einfache Anzeige */}
        <div className="md:hidden flex items-center justify-center gap-3">
          <Calendar className="w-4 h-4" />
          <div className="text-center">
            <span className="font-anton text-sm">{formatDate(nextTour.date)}: {nextTour.name}</span>
          </div>
        </div>

        {/* Desktop: Kompakte Anzeige */}
        <div className="hidden md:flex items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span className="font-anton text-base">{formatDate(nextTour.date)}</span>
            {nextTour.day && (
              <span className="text-sm text-white/80">({nextTour.day})</span>
            )}
          </div>
          
          <div className="w-px h-4 bg-white/30"></div>
          
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span className="font-anton text-base">{nextTour.name}</span>
            <span className="text-sm text-white/80">{nextTour.distance}</span>
          </div>
          
          <div className="w-px h-4 bg-white/30"></div>
          
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span className="text-sm">{nextTour.location}, {nextTour.time}</span>
          </div>
          
          <div className="ml-4">
            <a 
              href="/tour-termine" 
              className="bg-white/20 hover:bg-white/30 transition-colors px-3 py-1 rounded text-sm"
            >
              Mehr Infos →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourBanner; 