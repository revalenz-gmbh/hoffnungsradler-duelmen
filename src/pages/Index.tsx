
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import News from "@/components/News";
import TourDates from "@/components/TourDates";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-snow">
      <Header />
      <Hero />
      <About />
      <News />
      <TourDates />
      <Footer />
    </div>
  );
};

export default Index;
