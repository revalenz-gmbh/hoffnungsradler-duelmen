
import { CalendarIcon } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

const News = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  const newsItems = [
    {
      date: "23.01.2025",
      images: [
        "/lovable-uploads/8b8afb96-cd97-488e-a597-7119e154af07.png",
      ],
    },
    {
      date: "12.01.2025",
      images: [
        "/lovable-uploads/afec76a7-7703-49d3-b34a-1ddc9eaf8763.png",
        "/lovable-uploads/62f4385a-1bae-480c-855c-4f9b8222d1b6.png",
      ],
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
                className={`relative flex flex-col md:flex-row ${
                  index % 2 === 0 ? 'md:justify-start' : 'md:justify-end'
                } group mb-12 ${index > 0 ? '-mt-24' : ''}`}
              >
                {/* Date bubble */}
                <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-lg border-2 border-forest/20 z-10">
                  <CalendarIcon className="w-6 h-6 text-forest" />
                </div>

                {/* Content card */}
                <div className={`ml-16 md:ml-0 md:w-5/12 bg-white rounded-lg shadow-lg p-6 transition-all duration-300 hover:shadow-xl border border-forest/10 ${
                  index % 2 === 0 ? 'md:mr-auto' : 'md:ml-auto'
                }`}>
                  <div className={`${index % 2 === 1 ? 'md:ml-8' : 'md:mr-8'}`}>
                    <time className="text-sm text-forest/70 mb-2 block">
                      {item.date}
                    </time>
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                      <DialogTrigger
                        onClick={() => setStartIndex(0)}
                        className="cursor-pointer hover:opacity-90 transition-opacity"
                      >
                        <img
                          src={item.images[0]}
                          alt={`News vom ${item.date}`}
                          className="w-full rounded-lg shadow-md"
                        />
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl w-[95vw] h-auto p-0 overflow-y-auto">
                        <Carousel className="w-full h-full">
                          <CarouselContent className="h-full">
                            {item.images.map((image, imageIndex) => (
                              <CarouselItem key={imageIndex} className="h-full">
                                <div className="flex items-center justify-center h-full p-4">
                                  <img
                                    src={image}
                                    alt={`News - Seite ${imageIndex + 1}`}
                                    className="max-h-[85vh] w-auto object-contain rounded-lg"
                                  />
                                </div>
                              </CarouselItem>
                            ))}
                          </CarouselContent>
                          <CarouselPrevious className="left-4" />
                          <CarouselNext className="right-4" />
                        </Carousel>
                      </DialogContent>
                    </Dialog>
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

