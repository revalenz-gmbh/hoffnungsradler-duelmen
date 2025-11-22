import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import News from "@/components/News";
import TourDates from "@/components/TourDates";
import TourSignup from "@/components/TourSignup";
import PhotoGallery from "@/components/PhotoGallery";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import OrganizationSchema from "@/components/schemas/OrganizationSchema";
import LocalBusinessSchema from "@/components/schemas/LocalBusinessSchema";

const Index = () => {
  return (
    <div className="min-h-screen bg-snow">
      <SEOHead 
        title="Hoffnungsradler Dülmen e.V. | Gemeinsam Radfahren für den guten Zweck"
        description="Die Hoffnungsradler Dülmen unterstützen krebskranke Kinder. Über 90.000€ gesammelt durch Rennradtouren im Münsterland. Jetzt mitmachen!"
        url="https://www.hoffnungs-radler-duelmen.de"
        keywords="Hoffnungsradler Dülmen, Charity Radtouren, krebskranke Kinder, Münsterland, Rennrad Dülmen, Spenden, gemeinnütziger Verein"
        type="website"
      />
      <OrganizationSchema />
      <LocalBusinessSchema />
      
      <Header />
      <Hero />
      <About />
      <News />
      <TourDates />
      <TourSignup />
      <PhotoGallery />
      <Footer />
    </div>
  );
};

export default Index;
