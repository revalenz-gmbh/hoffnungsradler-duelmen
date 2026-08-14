import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from './components/Header';
import TourBanner from './components/TourBanner';
import Index from "./pages/Index";

// Nicht-kritische Seiten erst beim Aufruf laden, um das initiale Bundle kleinzuhalten
const UeberUns = lazy(() => import("./pages/UeberUns"));
const TourTermine = lazy(() => import("./pages/TourTermine"));
const UnsereTouren = lazy(() => import("./pages/UnsereTouren"));
const Sponsoren = lazy(() => import("./pages/Sponsoren"));
const Spenden = lazy(() => import("./pages/Spenden"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Datenschutz = lazy(() => import("./pages/Datenschutz"));
const Impressum = lazy(() => import("./pages/Impressum"));
const Medienhinweis = lazy(() => import("./pages/Medienhinweis"));
const Presse = lazy(() => import("./pages/Presse"));
const Kontakt = lazy(() => import("./pages/Kontakt"));
const NewsletterUnsubscribe = lazy(() => import("./pages/NewsletterUnsubscribe"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Router>
        <Header />
        <TourBanner />
        <main>
          <Suspense fallback={null}>
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
              <Route path="/newsletter/abmelden" element={<NewsletterUnsubscribe />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
      </Router>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
