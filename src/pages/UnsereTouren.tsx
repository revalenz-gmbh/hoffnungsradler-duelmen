import React, { useState, useEffect } from 'react';
import MainLayout from '../components/MainLayout';
import { FaDownload, FaSpinner } from 'react-icons/fa';
import SEOHead from '@/components/SEOHead';
import BreadcrumbSchema from '@/components/schemas/BreadcrumbSchema';

interface Tour {
  name: string;
  distance: string;
  year: number;
  downloadUrl: string;
}

const UnsereTouren: React.FC = () => {
  const [toursByYear, setToursByYear] = useState<Record<number, Tour[]>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTours = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbyu5QQ6_cSw4lCfVyqNyIxfYH1aKsYvft6NnDzrZDP5vxcRZZH3xgkuVadRN1iEunkA/exec');
        if (!response.ok) {
          throw new Error(`HTTP-Fehler! Status: ${response.status}`);
        }
        const data: Tour[] = await response.json();
        
        // Gruppiere Touren nach Jahr
        const groupedTours = data.reduce((acc, tour) => {
          const year = tour.year || 'Unbekannt';
          if (!acc[year]) {
            acc[year] = [];
          }
          acc[year].push(tour);
          return acc;
        }, {} as Record<string, Tour[]>);

        // Sortiere die Jahre absteigend
        const sortedYears = Object.keys(groupedTours).sort((a, b) => Number(b) - Number(a));
        const sortedGroupedTours: Record<number, Tour[]> = {};
        for (const year of sortedYears) {
            sortedGroupedTours[Number(year)] = groupedTours[year];
        }

        setToursByYear(sortedGroupedTours);
      } catch (err) {
        console.error("Fehler beim Abrufen der Touren:", err);
        setError('Die Touren konnten leider nicht geladen werden. Bitte versuchen Sie es später erneut.');
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  return (
    <MainLayout>
      <SEOHead 
        title="Unsere Touren - Tour-Archiv mit GPX-Downloads"
        description="Entdecken Sie unser umfangreiches Tour-Archiv mit allen bisherigen Rennradtouren der Hoffnungsradler Dülmen. Inklusive GPX-Downloads für Ihre nächste Tour."
        url="https://www.hoffnungs-radler-duelmen.de/unsere-touren"
        keywords="Tour-Archiv, GPX Downloads, Rennradstrecken Münsterland, historische Touren"
      />
      <BreadcrumbSchema items={[
        { name: "Startseite", url: "https://www.hoffnungs-radler-duelmen.de" },
        { name: "Unsere Touren", url: "https://www.hoffnungs-radler-duelmen.de/unsere-touren" }
      ]} />
      
      <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Unser GPX-Tourenarchiv
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Stöbern Sie durch unsere Sammlung von Radtouren. Alle Touren stehen als GPX-Datei zum direkten Download bereit.
            </p>
          </div>

          <div className="mt-8 max-w-4xl mx-auto bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 p-4 rounded-r-lg" role="alert">
            <p className="font-bold">Ein kleiner Hinweis</p>
            <p>
              Hier finden Sie einige Highlights aus unseren gemeinsamen Fahrten der letzten Jahre. Da die Touren teilweise vor längerer Zeit erstellt wurden und nicht regelmäßig überarbeitet werden, empfehlen wir, den Streckenverlauf vor Antritt der Fahrt zu überprüfen.
            </p>
          </div>

          {loading && (
            <div className="mt-12 flex justify-center items-center">
              <FaSpinner className="animate-spin text-4xl text-blue-600" />
              <p className="ml-4 text-xl text-gray-700">Touren werden geladen...</p>
            </div>
          )}

          {error && (
            <div className="mt-12 text-center text-red-600 bg-red-100 p-4 rounded-lg">
              <p className="text-xl font-semibold">{error}</p>
            </div>
          )}

          {!loading && !error && (
            <div className="mt-12 space-y-12">
              {Object.entries(toursByYear).map(([year, tours]) => (
                <div key={year} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <h3 className="text-2xl font-bold text-gray-800 border-b-2 border-blue-500 pb-2 mb-6">
                    Touren aus den letzten Jahren
                  </h3>
                  <ul className="divide-y divide-gray-200">
                    {tours.map((tour) => (
                      <li key={tour.name} className="py-4 flex items-center justify-between hover:bg-gray-50 rounded-md p-2 transition-colors duration-200">
                        <div className="flex-grow">
                          <p className="text-lg font-medium text-gray-900">{tour.name}</p>
                          <p className="text-sm text-gray-500">{tour.distance}</p>
                        </div>
                        <a
                          href={tour.downloadUrl}
                          download
                          className="ml-4 flex-shrink-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform transform hover:scale-105"
                        >
                          <FaDownload className="mr-2 -ml-1 h-5 w-5" />
                          GPX-Download
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default UnsereTouren;
