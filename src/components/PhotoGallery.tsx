import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const PhotoGallery = () => {
  const images = [
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

  return (
    <section className="py-32 bg-snow">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center mb-12">
            <h2 className="font-anton text-4xl text-prussian">Impressionen</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image, index) => (
              <Dialog key={index}>
                <DialogTrigger>
                  <div className="relative group overflow-hidden rounded-lg shadow-lg border border-forest/10 aspect-[4/3] cursor-pointer">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-4xl w-[95vw]">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-auto max-h-[85vh] object-contain rounded-lg"
                  />
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PhotoGallery;
