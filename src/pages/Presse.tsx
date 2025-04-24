import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface PressArticle {
  date: string;
  title: string;
  source: string;
  excerpt?: string;
  link?: string;
  image?: string;
}

const Presse = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const pressArticles: PressArticle[] = [
    {
      date: "22. April 2025",
      title: "Traditioneller Start am Marktplatz",
      source: "Dülmener Zeitung",
      excerpt: "An den Ternschersee führte die erste Tour der 22. Saison der Dülmener Hoffnungsradler. Traditionell am Karfreitag machten sich die Radler auf den Weg,...",
      image: "/lovable-uploads/dz250422.png"
    },
    {
      date: "23. Januar 2025",
      title: "Künftig gemeinnützig auf dem Rad",
      source: "Dülmener Zeitung",
      excerpt: "Die Dülmener Hoffnungsradler wollen künftig als gemeinnütziger Verein für den guten Zweck in die Pedale treten. Die Gründungsversammlung am 30. Januar im einsA wird unter anderem von Martin Stolz organisiert.",
      link: "https://www.dzonline.de/sport/lokalsport/kuenftig-gemeinnuetzig-auf-dem-rad-3233070",
    },
    {
      date: "11. Januar 2025",
      title: "Hoffnungsradler übergeben 7.000 Euro an Elterninitiative",
      source: "DÜLMENplus",
      excerpt: "Einen Spendenscheck über 7.000 Euro überreichte Josef Friedag im Namen der Hoffnungsradler Dülmen an Roswitha und Hans Rabe von der Elterninitiative krebskranker Kinder an der Vestischen Kinderklinik Datteln e.V.",
      link: "https://duelmenplus.de/hoffnungsradler-uebergeben-7-000-euro-an-elterninitiative/",
    },
    {
      date: "8. Januar 2025",
      title: "7000 Euro für krebskranke Kinder erstrampelt",
      source: "Dülmener Zeitung",
      excerpt: "Die Hoffnungsradler Dülmen haben mit ihren sechs Touren im gerade abgelaufenen Jahr 7000 Euro für den guten Zweck erstrampelt. Im alten Tennisheim der DJK Dülmen übergab das Team den Scheck an die Elterninitiative krebskranker Kinder.",
      link: "https://www.dzonline.de/sport/lokalsport/7000-euro-fuer-krebskranke-kinder-erstrampelt-3223224",
    },
    {
      date: "22. November 2023",
      title: "Hoffnungsradler Dülmen überreichten riesige Spende",
      source: "DÜLMENplus",
      excerpt: "Über eine Spende von 13.000 Euro freuten sich Vertreter der 'Elterninitiative krebskranker Kinder an der Vestischen Kinderklinik Datteln e.V.'. Das Geld stammt von der Jubiläumstour und weiteren Sponsoren.",
      link: "https://duelmenplus.de/hoffnungsradler-duelmen-ueberreichten-riesige-spende/",
    },
    {
      date: "7. April 2023",
      title: "Hoffnungsradler Dülmen begrüßen Vertreter der Elterninitiative",
      source: "Elterninitiative Datteln",
      excerpt: "Gemeinsamer Start zum 'abstrampeln' für den guten Zweck mit Bürgermeister Carsten Hövekamp und Vertretern der Elterninitiative krebskranker Kinder.",
      link: "https://www.elterninitiative-datteln.de/2023/04/07/hoffnungsradler-begrüßen-vertreter-der-elterninitiative/",
    },
    {
      date: "22. März 2023",
      title: "Jubiläum '20 Jahre Hoffnungsradler Dülmen für krebskranke Kinder'",
      source: "DÜLMENplus",
      excerpt: "Über 71.000 Euro für krebskranke Kinder sind in den vergangenen 19 Jahren bei den Rennradtouren der 'Hoffnungsradler Dülmen' zusammengekommen. Karfreitag startet das diesjährige Programm mit acht Touren.",
      link: "https://duelmenplus.de/jubilaeum-20-jahre-hoffnungsradler-duelmen-fuer-krebskranke-kinder/",
    },
  ];

  return (
    <Dialog onOpenChange={(isOpen) => !isOpen && setSelectedImage(null)}>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-4xl font-bold mb-8">Pressespiegel</h1>
        
        <div className="grid gap-6">
          {pressArticles.map((article, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="text-sm text-gray-500 mb-2">{article.date} | {article.source}</div>
                <h2 className="text-2xl font-bold mb-3">{article.title}</h2>
                {article.excerpt && (
                  <p className="text-gray-700 mb-4">{article.excerpt}</p>
                )}
                
                {article.link ? (
                  <a 
                    href={article.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Artikel lesen →
                  </a>
                ) : article.image ? (
                  <DialogTrigger asChild>
                    <button 
                      onClick={() => setSelectedImage(article.image!)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Artikel lesen →
                    </button>
                  </DialogTrigger>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <DialogContent className="max-w-4xl w-[95vw] p-0">
        {selectedImage && (
          <img 
            src={selectedImage} 
            alt="Zeitungsartikel" 
            className="w-full h-auto max-h-[90vh] object-contain rounded-lg"
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Presse; 