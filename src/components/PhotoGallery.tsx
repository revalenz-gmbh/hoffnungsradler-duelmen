import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PhotoGallery = () => {
  const images = [
    {
      src: "/lovable-uploads/613a2cc8-11be-4e10-ab1f-36fa9f108889.png",
      alt: "Hoffnungsradler Gruppenfoto",
    },
    {
      src: "/lovable-uploads/IMG_0007 1.png",
      alt: "Hoffnungsradler bei einer Tour",
    },
    {
      src: "/lovable-uploads/IMG_0255.png",
      alt: "Hoffnungsradler Gruppe",
    },
    {
      src: "/lovable-uploads/Sandsteinroute 24 IMG_0515.png",
      alt: "Hoffnungsradler auf der Sandsteinroute 2024",
    },
    {
      src: "/lovable-uploads/Sandsteinroute 24 IMG_0518.png",
      alt: "Hoffnungsradler Gruppenpause auf der Sandsteinroute",
    },
    {
      src: "/lovable-uploads/dd742c69-9e75-48ca-9d73-988155c1bca7.png",
      alt: "Hoffnungsradler Gruppenfoto",
    },
    {
      src: "/lovable-uploads/32eef6b5-977b-435f-af25-6ea63b499462.png",
      alt: "Hoffnungsradler Gruppe vor dem Start",
    },
    {
      src: "/lovable-uploads/51c8b22f-ad16-4975-aa65-3183d8706a01.png",
      alt: "Hoffnungsradler Team vor Geschäft",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Automatischer Bildwechsel alle 5 Sekunden
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 2) % images.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [images.length]);

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 2) % images.length);
  };

  const previousImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 2 + images.length) % images.length);
  };

  // Hilfsfunktion um den Index des zweiten Bildes zu berechnen
  const getSecondImageIndex = () => (currentIndex + 1) % images.length;

  return (
    <section className="py-32 bg-snow">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center mb-12">
            <h2 className="font-anton text-4xl text-prussian">Impressionen</h2>
          </div>

          <div className="relative">
            {/* Navigation Buttons */}
            <button
              onClick={previousImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-prussian" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-colors"
            >
              <ChevronRight className="w-6 h-6 text-prussian" />
            </button>

            {/* Image Carousel */}
            <div className="grid grid-cols-2 gap-4">
              {/* Erstes Bild */}
              <Dialog>
                <DialogTrigger>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-lg shadow-lg border border-forest/10 cursor-pointer">
                    <img
                      src={images[currentIndex].src}
                      alt={images[currentIndex].alt}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-4xl w-[95vw]">
                  <img
                    src={images[currentIndex].src}
                    alt={images[currentIndex].alt}
                    className="w-full h-auto max-h-[85vh] object-contain rounded-lg"
                  />
                </DialogContent>
              </Dialog>

              {/* Zweites Bild */}
              <Dialog>
                <DialogTrigger>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-lg shadow-lg border border-forest/10 cursor-pointer">
                    <img
                      src={images[getSecondImageIndex()].src}
                      alt={images[getSecondImageIndex()].alt}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-4xl w-[95vw]">
                  <img
                    src={images[getSecondImageIndex()].src}
                    alt={images[getSecondImageIndex()].alt}
                    className="w-full h-auto max-h-[85vh] object-contain rounded-lg"
                  />
                </DialogContent>
              </Dialog>
            </div>

            {/* Dots Navigation */}
            <div className="flex justify-center gap-2 mt-4">
              {Array.from({ length: Math.ceil(images.length / 2) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index * 2)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    Math.floor(currentIndex / 2) === index ? "bg-prussian w-4" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PhotoGallery;
