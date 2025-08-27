import { ArrowRightIcon, CalendarIcon, Heart } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger
} from "@/components/ui/dialog";
import { useState } from "react";

const News = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const newsItems = [
    {
      date: "24.08.2025",
      title: "Herzlichen Glückwunsch, Ludger Dey, zum 65. Geburtstag!",
      excerpt: `Die Hoffnungsradler gratulieren ihrem langjährigen Organisator Ludger Dey ganz herzlich zum 65. Geburtstag. Anlässlich seiner Feier wünschte er sich statt Geschenken Spenden – dadurch kamen weitere 1.500 € für den guten Zweck zusammen. Damit sind wir unserem diesjährigen Spendenziel bereits sehr nahe gekommen.`,
      type: "internal",
      highlight: true
    },
    {
      date: "23.08.2025",
      title: "Gemeinsame Matjes-Tour nach Winterswijk",
      excerpt: `Am 23. August fand unsere Matjes-Tour nach Winterswijk statt. Bei bestem Radfahrwetter ging es gemeinsam über ruhige Straßen zum Wochenmarkt – ein toller Tag mit starker Gruppe und guter Stimmung!`,
      images: ["/photos/Matjes 25_1.jpg"],
      type: "internal"
    },
    {
      date: "17.05.2025",
      source: "Dülmenplus",
      title: "Hoffnungsradler auch am 24. Mai unterwegs",
      excerpt: `Die Hoffnungsradler Dülmen unternahmen am Sonntag eine gemeinsame Radtour von Dülmen nach Weseke und zurück. Die 86 Kilometer lange Strecke führte entlang malerischer Baumalleen...`,
      images: ["/zeitungsartikel/duelmenplus-250517.png"],
      type: "press"
    },
    {
      date: "11.05.2025",
      title: "'Große Scheibe Lette' überreicht Spende in Höhe von 1.200 € bei Tour nach Weseke",
      excerpt: `Bei der Tour nach Weseke überreichte die Radsportgruppe 'Große Scheibe Lette' eine großzügige Spende in Höhe von 1.200€, die sie gemeinsam mit dem Team des Dentallabors Böinghoff aus Ahaus gesammelt hatte. Diese Spende ist ein großer Beitrag zur Spendensumme für 2025, die damit bereits auf 1.930 € anstieg.
Bis zur Rast bei der Bäckerei Späker in Weseke leistete 'Große Scheibe Lette' zudem eine starke Führungsarbeit und sorgte für eine schwungvolle Fahrt. Die Hoffnungsradler bedanken sich herzlich für die tolle Unterstützung und den gemeinsamen Einsatz. Die Tour war ein sportlicher und solidarischer Erfolg.`,
      images: ["/zeitungsartikel/3ac1df73-721c-4114-a502-09eed0e8d4d5~1.jpg"],
      type: "internal"
    }
  ];

  return (
    <Dialog onOpenChange={(isOpen) => !isOpen && setSelectedImage(null)}>
      <section className="py-16 bg-[#F0F4F0]">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl text-[#003366] text-center mb-12">
            Aktuelles
          </h2>

          <div className="grid gap-6 max-w-5xl mx-auto">
            {newsItems.map((item, index) => (
              <div
                key={index}
                className={`bg-white rounded-lg shadow-sm overflow-hidden flex flex-col ${
                  item.type === "internal" ? "p-8" : "p-6"
                } ${('highlight' in item && (item as any).highlight) ? 'border-l-4 border-amber-400' : ''}`}
              >
                {/* Text Content */}
                <div className="flex-grow">
                  {/* Combine Date and Source */}
                  <div className="text-sm text-gray-500 mb-2">
                    {item.date}
                    {item.source && ` | ${item.source}`}
                    {('highlight' in item && (item as any).highlight) && (
                      <span className="ml-2 inline-flex items-center gap-1 text-amber-800 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-full text-xs font-medium">
                        <Heart className="w-3 h-3" />
                        Spenden-Highlight
                      </span>
                    )}
                  </div>
                  
                  {/* Title */}
                  <h3 className={`font-bold text-[#003366] ${
                    item.type === "internal" ? "text-2xl mb-4" : "text-xl mb-2"
                  }`}>
                    {item.title}
                  </h3>

                  {/* Excerpt - Unified Styling */}
                  {item.excerpt && (
                    <p className="text-gray-700 mb-4">
                      {item.excerpt}
                    </p>
                  )}
                </div>
                
                {/* Image / Link Section */}
                <div className="mt-4 space-y-4">
                  {/* Image display logic for internal articles */}
                  {item.type === 'internal' && item.images && (
                    <DialogTrigger asChild>
                      <button onClick={() => setSelectedImage(item.images![0])} className="block w-full">
                        <img
                          src={item.images[0]}
                          alt={`News vom ${item.date}`}
                          className="w-full rounded-lg shadow-sm hover:opacity-90 transition-opacity"
                        />
                      </button>
                    </DialogTrigger>
                  )}

                  {/* Link / Image trigger logic for press articles */}
                  {item.type === 'press' && (
                    item.link ? (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Artikel lesen
                        <ArrowRightIcon className="w-4 h-4 ml-1" />
                      </a>
                    ) : item.images ? (
                      <DialogTrigger asChild>
                        <button 
                          onClick={() => setSelectedImage(item.images![0])}
                          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Artikel lesen
                          <ArrowRightIcon className="w-4 h-4 ml-1" />
                        </button>
                      </DialogTrigger>
                    ) : null
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dialog Content for Image */}   
      <DialogContent className="max-w-4xl w-[95vw] p-0">
        {selectedImage && (
          <img 
            src={selectedImage} 
            alt="Zeitungsartikel oder News Bild" 
            className="w-full h-auto max-h-[90vh] object-contain rounded-lg"
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default News;