const Hero = () => {
  return (
    <div className="relative h-screen">
      <img
        src="/lovable-uploads/Hoffnungsradler Titelphoto.png"
        alt="Hoffnungsradler cycling group"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute inset-0 flex items-center justify-center -translate-y-[20%]">
        <div className="text-center px-4">
          <h1 className="font-anton text-4xl md:text-6xl lg:text-7xl text-white mb-6 animate-fade-in">
            Hoffnungsradler Dülmen
          </h1>
          <p className="font-inter text-xl md:text-2xl text-white/90 animate-fade-in-up">
            Gemeinsam bewegen wir mehr.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hero;
