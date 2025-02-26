import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from './components/Header';
import Index from "./pages/Index";
import UeberUns from "./pages/UeberUns";
import TourTermine from "./pages/TourTermine";
import UnsereTouren from "./pages/UnsereTouren";
import Sponsoren from "./pages/Sponsoren";
import Spenden from "./pages/Spenden";
import NotFound from "./pages/NotFound";
import Datenschutz from "./pages/Datenschutz";
import Impressum from "./pages/Impressum";
import Medienhinweis from "./pages/Medienhinweis";
import Presse from './pages/Presse';
import Kontakt from "./pages/Kontakt";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Router>
        <Header />
        <main className="mt-20">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/presse" element={<Presse />} />
            <Route path="/ueber-uns" element={<UeberUns />} />
            <Route path="/tour-termine" element={<TourTermine />} />
            <Route path="/unsere-touren" element={<UnsereTouren />} />
            <Route path="/sponsoren" element={<Sponsoren />} />
            <Route path="/spenden" element={<Spenden />} />
            <Route path="/datenschutz" element={<Datenschutz />} />
            <Route path="/impressum" element={<Impressum />} />
            <Route path="/medienhinweis" element={<Medienhinweis />} />
            <Route path="/kontakt" element={<Kontakt />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </Router>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
