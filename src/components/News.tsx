import { ArrowRightIcon, CalendarIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger
} from "@/components/ui/dialog";
import { useState } from "react";

const News = () => {
  const [isOpen, setIsOpen] = useState(false);

  const newsItems = [
    {
      date: "18.04.2025",
      title: "Saisoneröffnung der Hoffnungsradler mit Tour zum Ternscher See",
      excerpt: "Am Karfreitag starteten die Dülmener Hoffnungsradler trotz regnerischer Wetterprognosen zu ihrem traditionellen Saisonauftakt. In diesem Jahr führte die Tour zum Ternscher See. Die 52 km lange Strecke wurde von den Radlern ohne Probleme gemeistert - und das Beste: Alle kamen trocken zurück! Zu Beginn der Tour sprach Bürgermeister Carsten Hövekamp ein paar herzliche Grußworte und nutzte die Gelegenheit, Josef Friedag für sein langjähriges Engagement zu ehren.",
      images: ["/lovable-uploads/Karfreitag25_1.jpg"],
      type: "internal"
    },
    {
      date: "12.01.2024",
      title: "Hoffnungsradler übergeben 7.000 Euro an Elterninitiative",
      source: "DÜLMENplus",
      link: "https://duelmenplus.de/hoffnungsradler-uebergeben-7-000-euro-an-elterninitiative/",
      type: "press"
    },
    {
      date: "23.01.2024",
      title: "Künftig gemeinnützig auf dem Rad",
      source: "Dülmener Zeitung",
      link: "https://www.dzonline.de/sport/lokalsport/kuenftig-gemeinnuetzig-auf-dem-rad-3233070",
      type: "press"
    }
  ];

  return (
    <section className="py-16 bg-[#F0F4F0]">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl text-[#003366] text-center mb-12">
          Aktuelles
        </h2>

        <div className="grid gap-6 max-w-5xl mx-auto">
          {newsItems.map((item, index) => (
            <div
              key={index}
              className={`bg-white rounded-lg shadow-sm overflow-hidden ${
                item.type === "internal" ? "p-8" : "p-6"
              }`}
            >
              <div className="flex flex-col">
                <time className="text-sm text-gray-500 mb-2">
                  {item.date}
                </time>
                {item.source && (
                  <span className="text-sm text-gray-400 mb-1">
                    {item.source}
                  </span>
                )}
                <h3 className={`font-bold text-[#003366] ${
                  item.type === "internal" ? "text-2xl mb-4" : "text-xl mb-2"
                }`}>
                  {item.title}
                </h3>
                {item.excerpt && (
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {item.excerpt}
                  </p>
                )}
                {item.images && (
                  <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger className="mb-4">
                      <img
                        src={item.images[0]}
                        alt={`News vom ${item.date}`}
                        className="w-full rounded-lg shadow-sm hover:opacity-90 transition-opacity"
                      />
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl w-[95vw]">
                      <img
                        src={item.images[0]}
                        alt={`News vom ${item.date}`}
                        className="w-full h-auto max-h-[85vh] object-contain rounded-lg"
                      />
                    </DialogContent>
                  </Dialog>
                )}
                {item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium mt-2"
                  >
                    Artikel lesen
                    <ArrowRightIcon className="w-4 h-4 ml-1" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default News;