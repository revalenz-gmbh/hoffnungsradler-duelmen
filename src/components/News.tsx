
import { CalendarIcon } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const News = () => {
  const newsItems = [
    {
      date: "12.01.2025",
      title: "7000 Euro für krebskranke Kinder erstrampelt",
      images: [
        "/lovable-uploads/afec76a7-7703-49d3-b34a-1ddc9eaf8763.png",
        "/lovable-uploads/62f4385a-1bae-480c-855c-4f9b8222d1b6.png",
      ],
      description:
        "Die Hoffnungsradler Dülmen übergaben am Mittwochabend eine Spende in Höhe von 7000 Euro an die Elterninitiative krebskranker Kinder an der Vestischen Kinderklinik Datteln.",
    },
  ];

  return (
    <section className="py-20 bg-[#F2FCE2]">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-anton text-4xl text-prussian text-center mb-12">
            Aktuelles
          </h2>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-forest/20" />

            {/* News items */}
            {newsItems.map((item, index) => (
              <div
                key={index}
                className="relative flex flex-col md:flex-row md:justify-between group mb-12"
              >
                {/* Date bubble */}
                <div className="absolute left-0 md:left-1/2 -translate-x-4 md:-translate-x-6 flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-lg border-2 border-forest/20 z-10">
                  <CalendarIcon className="w-6 h-6 text-forest" />
                </div>

                {/* Content card */}
                <div className="ml-16 md:ml-0 md:w-5/12 bg-white rounded-lg shadow-lg p-6 transition-all duration-300 hover:shadow-xl border border-forest/10">
                  {/* If it's on the right side (odd items) */}
                  <div className={`${index % 2 === 1 ? "md:ml-8" : "md:mr-8"}`}>
                    <time className="text-sm text-forest/70 mb-2 block">
                      {item.date}
                    </time>
                    <h3 className="text-xl font-semibold text-prussian mb-4">
                      {item.title}
                    </h3>
                    <Carousel className="w-full mb-4">
                      <CarouselContent>
                        {item.images.map((image, imageIndex) => (
                          <CarouselItem key={imageIndex}>
                            <img
                              src={image}
                              alt={`${item.title} - Seite ${imageIndex + 1}`}
                              className="w-full rounded-lg shadow-md"
                            />
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious />
                      <CarouselNext />
                    </Carousel>
                    <p className="text-text/80">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default News;

