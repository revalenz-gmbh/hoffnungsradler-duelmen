import { ArrowRightIcon, CalendarIcon, Heart } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger
} from "@/components/ui/dialog";
import { ReactNode, useState } from "react";

interface NewsItem {
  date: string;
  title: string;
  type: "internal" | "press";
  excerpt?: string;
  content?: ReactNode;
  images?: string[];
  source?: string;
  link?: string;
  highlight?: boolean;
}

const News = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const newsItems: NewsItem[] = [
    {
      date: "25.06.2026",
      title: "Münster-Tour am 28.06. abgesagt – Nachholtermin am 26.07.",
      excerpt: `Leider müssen wir unsere für Sonntag, den 28.06.2026, geplante Münster-Tour absagen. Für das Wochenende sind sehr hohe Temperaturen vorhergesagt, sodass wir aus Rücksicht auf die Gesundheit aller Teilnehmenden auf die Tour verzichten. Gute Nachricht: Wir holen die Münster-Tour am Sonntag, den 26.07.2026, nach – Start wie gewohnt um 10:00 Uhr am Sportzentrum Süd. Bleibt gesund und kühl, wir freuen uns auf euch!`,
      type: "internal"
    },
    {
      date: "31.05.2026",
      title: "Tour nach Gescher – 90 km bei Sonnenschein",
      excerpt: `Beim Start am Sportzentrum Süd war auch Jupp dabei – ein schöner Auftakt für unsere Gescher-Tour. Wir hatten Glück mit dem Wetter, genossen einen Stopp bei der Eisdiele in Velen und mussten auf dem Rückweg wegen eines nach dem Gewitter am Freitag umgestürzten Baums auf dem Radweg eine Ausweichstrecke nehmen. Insgesamt kamen wir auf rund 90 km, die die Truppe gemeinsam in flottem Tempo bewältigt hat.`,
      images: ["/photos/Gescher26_1.jpg"],
      type: "internal"
    },
    {
      date: "26.05.2026",
      title: "Kanaltour – gemeinsam am Wasser unterwegs",
      excerpt: `Bei bestem Radfahrwetter sind die Hoffnungsradler gestern die Kanalstrecke entlang gefahren. Sonne, gute Laune und eine eingespielte Gruppe machten die Runde zu einem schönen gemeinsamen Erlebnis – vielen Dank an alle, die dabei waren!`,
      images: ["/photos/26mai_02.jpg"],
      type: "internal"
    },
    {
      date: "April 2026",
      source: "Dülmener Zeitung",
      title: "Zeitungsbericht zur Karfreitagstour 2026",
      excerpt: `Unter der Überschrift „Hoffnungsradler eröffnen ihre Saison und bringen den Bürgermeister nach Hause“ berichtet die Zeitung über unseren Saisonstart am Rathaus in Dülmen mit rund 30 Teilnehmenden. Die Karfreitagstour führte über eine landschaftlich reizvolle Runde in einer Schleife am Ruheforst in Coesfeld zurück nach Dülmen. Wie jedes Jahr wurden Spenden gesammelt, die zu 100 % an die Kinderkrebshilfe Münster sowie die Elterninitiative krebskranker Kinder Datteln gehen. Bürgermeister Carsten Hövekamp, der erneut mitfuhr, wurde mit den Worten zitiert: „Von so vielen Leuten bin ich auch noch nicht nach Hause gebracht worden.“`,
      images: ["/zeitungsartikel/Karfreitag2026.jpeg"],
      type: "internal",
      highlight: true
    },
    {
      date: "Dezember 2025",
      title: "Meilenstein für Hoffnungsradler Dülmen: 10.000 Euro Weihnachtsspende",
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            Dülmen/Münster/Datteln. Kurz vor Weihnachten haben die Hoffnungsradler Dülmen ihre erfolgreiche Rennrad-Saison mit einer besonderen Bescherung gekrönt. Der Verein übergab in dieser Woche Spenden in Höhe von insgesamt 10.000 Euro an lokale Hilfsorganisationen.
          </p>
          <p className="text-gray-700">
            Je 5.000 Euro gingen an die Kinderkrebshilfe Münster e.V. sowie an die Elterninitiative krebskranker Kinder Datteln e.V..
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
            <DialogTrigger asChild>
              <button onClick={() => setSelectedImage("/photos/Datteln2025-1.jpg")} className="block w-full">
                <figure>
                  <img src="/photos/Datteln2025-1.jpg" alt="Spendenübergabe in Datteln" className="w-full rounded-lg shadow-sm hover:opacity-90 transition-opacity" />
                  <figcaption className="text-xs text-gray-500 mt-1">Gregor Horstmann, Roswitha Rabe (Elterninitiative Datteln) und Josef Friedag</figcaption>
                </figure>
              </button>
            </DialogTrigger>
            <DialogTrigger asChild>
              <button onClick={() => setSelectedImage("/photos/Muenster2025-2.jpg")} className="block w-full">
                <figure>
                  <img src="/photos/Muenster2025-2.jpg" alt="Spendenübergabe in Münster" className="w-full rounded-lg shadow-sm hover:opacity-90 transition-opacity" />
                  <figcaption className="text-xs text-gray-500 mt-1">Gregor Horstmann, Anette Blomberg (Kinderkrebshilfe) und Martin Stolz</figcaption>
                </figure>
              </button>
            </DialogTrigger>
          </div>
          <p className="text-gray-700 font-semibold">
            100.000 Euro Gesamtspenden seit Gründung
          </p>
          <p className="text-gray-700">
            Die diesjährige Übergabe markiert einen historischen Moment in der Vereinsgeschichte: Mit der aktuellen Summe haben die Dülmener Radsportler seit ihrer Gründung die Marke von insgesamt 100.000 Euro an Spendengeldern überschritten. Die Spenden fließen zu 100 % in die Projekte, da der Verein rein ehrenamtlich arbeitet.
          </p>
        </div>
      ),
      type: "internal",
      highlight: true
    },
    {
      date: "28.09.2025",
      title: "Baumberge Alpin‑Tour – aus dem Nebel hinauf in die Sonne",
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            Besonders in diesem Jahr: Wir starteten im Nebel und erst in den Baumbergen zeigte sich die Sonne.
          </p>
          <DialogTrigger asChild>
            <button onClick={() => setSelectedImage("/photos/Alpin25b.jpg")} className="block w-full">
              <figure>
                <img src="/photos/Alpin25b.jpg" alt="Start im Nebel" className="w-full rounded-lg shadow-sm hover:opacity-90 transition-opacity" />
                <figcaption className="text-xs text-gray-500 mt-1">Start im Nebel – später Sonne in den Baumbergen</figcaption>
              </figure>
            </button>
          </DialogTrigger>
          <p className="text-gray-700">
            Bei km 30 wartete unser Verpflegungsteam und versorgte alle mit Obst und Getränken – vielen Dank!
          </p>
          <DialogTrigger asChild>
            <button onClick={() => setSelectedImage("/photos/Alpin25D.jpg")} className="block w-full">
              <figure>
                <img src="/photos/Alpin25D.jpg" alt="Verpflegungsstation bei km 30" className="w-full rounded-lg shadow-sm hover:opacity-90 transition-opacity" />
                <figcaption className="text-xs text-gray-500 mt-1">Verpflegungsstation bei km 30 in der Sonne</figcaption>
              </figure>
            </button>
          </DialogTrigger>
          <p className="text-gray-700">
            Drei Varianten (48/78/106 km) boten sportliche Herausforderungen und großartige Ausblicke.
          </p>
        </div>
      ),
      type: "internal"
    },
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
                } ${item.highlight ? 'border-l-4 border-amber-400' : ''}`}
              >
                {/* Text Content */}
                <div className="flex-grow">
                  {/* Combine Date and Source */}
                  <div className="text-sm text-gray-500 mb-2">
                    {item.date}
                    {item.source && ` | ${item.source}`}
                    {item.highlight && (
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

                  {/* Content or Excerpt */}
                  {item.content ? (
                    item.content
                  ) : item.excerpt ? (
                    <p className="text-gray-700 mb-4">
                      {item.excerpt}
                    </p>
                  ) : null}
                </div>
                
                {/* Image / Link Section */}
                <div className="mt-4 space-y-4">
                  {/* Interne Beiträge: Galerie nur, wenn kein Inline-Content vorhanden */}
                  {item.type === 'internal' && item.images && item.images.length > 0 && !item.content && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {item.images.map((img, i) => (
                        <DialogTrigger asChild key={i}>
                          <button onClick={() => setSelectedImage(img)} className="block w-full">
                            <img
                              src={img}
                              alt={`News vom ${item.date} – Bild ${i + 1}`}
                              className="w-full rounded-lg shadow-sm hover:opacity-90 transition-opacity"
                            />
                          </button>
                        </DialogTrigger>
                      ))}
                    </div>
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