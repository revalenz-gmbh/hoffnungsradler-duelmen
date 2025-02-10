
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
      image: "/lovable-uploads/afec76a7-7703-49d3-b34a-1ddc9eaf8763.png",
    },
    {
      date: "12.01.2025",
      image: "/lovable-uploads/e6c2c3c4-c44d-4881-943e-308ad9e7eaed.png",
    },
  ];

  return (
    <section className="py-20 bg-[#F2FCE2]">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="relative">
            <div className="absolute left-1/2 h-full w-px bg-forest/20" />
            <div className="w-full md:w-1/2">
              <Carousel className="w-full">
                <CarouselContent>
                  {newsItems.map((item, index) => (
                    <CarouselItem key={index}>
                      <div className="bg-white rounded-lg shadow-lg p-6 transition-all duration-300 hover:shadow-xl border border-forest/10">
                        <time className="text-sm text-forest/70 mb-4 block flex items-center gap-2">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-forest/10">
                            <CalendarIcon className="w-4 h-4 text-forest" />
                          </span>
                          {item.date}
                        </time>
                        <img
                          src={item.image}
                          alt={`Article page ${index + 1}`}
                          className="w-full rounded-lg shadow-md"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-0" />
                <CarouselNext className="right-0" />
              </Carousel>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default News;
