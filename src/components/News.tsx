import { ArrowRightIcon, CalendarIcon } from "lucide-react";
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
      date: "11.05.2025",
      title: "'Große Scheibe Lette' überreicht Spende in Höhe von 1.200 € bei Tour nach Weseke",
      excerpt: `Bei der Tour nach Weseke überreichte die Radsportgruppe 'Große Scheibe Lette' eine großzügige Spende in Höhe von 1.200€, die sie gemeinsam mit dem Team des Dentallabors Böinghoff aus Ahaus gesammelt hatte. Diese Spende ist ein großer Beitrag zur Spendensumme für 2025, die damit bereits auf 1.930 € anstieg.
Bis zur Rast bei der Bäckerei Späker in Weseke leistete 'Große Scheibe Lette' zudem eine starke Führungsarbeit und sorgte für eine schwungvolle Fahrt. Die Hoffnungsradler bedanken sich herzlich für die tolle Unterstützung und den gemeinsamen Einsatz. Die Tour war ein sportlicher und solidarischer Erfolg.`,
      images: ["/lovable-uploads/3ac1df73-721c-4114-a502-09eed0e8d4d5~1.jpg"],
      type: "internal"
    },
    {
      date: "22.04.2025",
      title: "Traditioneller Start am Marktplatz",
      source: "Dülmener Zeitung",
      excerpt: "An den Ternschersee führte die erste Tour der 22. Saison der Dülmener Hoffnungsradler. Traditionell am Karfreitag machten sich die Radler auf den Weg,...",
      images: ["/lovable-uploads/dz250422.png"],
      type: "press"
    },
    {
      date: "18.04.2025",
      title: "Saisoneröffnung der Hoffnungsradler mit Tour zum Ternscher See",
      excerpt: "Am Karfreitag starteten die Dülmener Hoffnungsradler trotz regnerischer Wetterprognosen zu ihrem traditionellen Saisonauftakt. In diesem Jahr führte die Tour zum Ternscher See. Die 52 km lange Strecke wurde von den Radlern ohne Probleme gemeistert - und das Beste: Alle kamen trocken zurück! Zu Beginn der Tour sprach Bürgermeister Carsten Hövekamp ein paar herzliche Grußworte und nutzte die Gelegenheit, Josef Friedag für sein langjähriges Engagement zu ehren.",
      images: ["/lovable-uploads/Karfreitag25_1.jpg"],
      type: "internal"
    },
    {
      date: "12.01.2025",
      title: "Hoffnungsradler übergeben 7.000 Euro an Elterninitiative",
      source: "DÜLMENplus",
      link: "https://duelmenplus.de/hoffnungsradler-uebergeben-7-000-euro-an-elterninitiative/",
      type: "press"
    },
    {
      date: "23.01.2025",
      title: "Künftig gemeinnützig auf dem Rad",
      source: "Dülmener Zeitung",
      link: "https://www.dzonline.de/sport/lokalsport/kuenftig-gemeinnuetzig-auf-dem-rad-3233070",
      type: "press"
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
                }`}
              >
                {/* Text Content */}
                <div className="flex-grow">
                  {/* Combine Date and Source */}
                  <div className="text-sm text-gray-500 mb-2">
                    {item.date}
                    {item.source && ` | ${item.source}`}
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