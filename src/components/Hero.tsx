import { totalDonations, donationYear } from "../data/donations";
import { CURRENT_SEASON, getVerfuegbarerBetrag } from "../data/current-season";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { getDashboard, getUebergabeSummen, invalidateDonationsCache } from "../lib/buchhaltung-api";
import { useRefetchWhenTabVisible } from "@/hooks/use-refetch-when-tab-visible";

const Hero = () => {
  // Spendendaten - Primär aus current-season.ts, optional API-Update
  // getVerfuegbarerBetrag() = kontostand - stilleReserve
  const [currentDonations, setCurrentDonations] = useState(getVerfuegbarerBetrag());
  const [totalDonationsValue, setTotalDonationsValue] = useState(totalDonations);
  
  // Spendenziel aus current-season.ts
  const donationGoal = CURRENT_SEASON.spendenziel;
  
  // Animierte Zahlen
  const [animatedCurrent, setAnimatedCurrent] = useState(0);
  const [animatedTotal, setAnimatedTotal] = useState(0);

  // Banner-Steuerung
  const showCancellationBanner = false; // Auf true setzen, um den Banner anzuzeigen

  // API-Daten (Google Sheet): nach Tab-Rückkehr und mit kurzem Browser-Cache neu laden
  const fetchDonationData = useCallback(async () => {
    invalidateDonationsCache();
    try {
      const dashboard = await getDashboard();
      
      // Debug-Log für Diagnose
      console.log('[Hero] API Dashboard:', {
        saldo: dashboard?.saldo,
        basisAbsicherung: dashboard?.basisAbsicherung,
        verfuegbarFuerWebsite: dashboard?.verfuegbarFuerWebsite
      });

      // Priorität 1: verfuegbarFuerWebsite (G4) direkt aus API - aber nur wenn > 0
      const vf = dashboard?.verfuegbarFuerWebsite;
      if (vf !== undefined && vf !== null && Number(vf) > 0) {
        console.log('[Hero] Verwende verfuegbarFuerWebsite (G4):', vf);
        setCurrentDonations(Number(vf));
        return await loadGesamtsumme();
      }

      // Priorität 2: saldo (C23) minus basisAbsicherung (E4) - aber nur wenn saldo > 0
      const saldoN = Number(dashboard?.saldo);
      const basisN = Number(dashboard?.basisAbsicherung);
      if (Number.isFinite(saldoN) && saldoN > 0 && Number.isFinite(basisN) && basisN >= 0) {
        const berechnet = Math.max(0, saldoN - basisN);
        console.log('[Hero] Verwende saldo - basisAbsicherung:', berechnet);
        setCurrentDonations(berechnet);
        return await loadGesamtsumme();
      }

      // API gab keinen brauchbaren Wert - behalte Fallback aus current-season.ts
      console.log('[Hero] API-Werte nicht brauchbar, behalte Fallback:', getVerfuegbarerBetrag());
      await loadGesamtsumme();
    } catch (error) {
      console.log('[Hero] API nicht verfügbar, verwende manuelle Daten aus current-season.ts');
    }
  }, []);

  // Hilfsfunktion für Gesamtsumme
  const loadGesamtsumme = async () => {
    try {
      const uebergabe = await getUebergabeSummen();
      if (uebergabe?.gesamt) {
        setTotalDonationsValue(uebergabe.gesamt);
      }
    } catch {
      // Fehler ignorieren, Fallback bleibt
    }
  };

  useEffect(() => {
    void fetchDonationData();
  }, [fetchDonationData]);

  useRefetchWhenTabVisible(fetchDonationData);

  useEffect(() => {
    // Animation für aktuelle Spendensumme
    const duration = 1200;
    const step = (timestamp: number, startTime: number) => {
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setAnimatedCurrent(Math.floor(progress * currentDonations));
      if (progress < 1) {
        requestAnimationFrame((t) => step(t, startTime));
      } else {
        setAnimatedCurrent(currentDonations);
      }
    };
    requestAnimationFrame((t) => step(t, t));
    // Animation für Gesamtsumme
    const durationTotal = 1500;
    const stepTotal = (timestamp: number, startTime: number) => {
      const progress = Math.min((timestamp - startTime) / durationTotal, 1);
      setAnimatedTotal(Math.floor(progress * totalDonationsValue));
      if (progress < 1) {
        requestAnimationFrame((t) => stepTotal(t, startTime));
      } else {
        setAnimatedTotal(totalDonationsValue);
      }
    };
    requestAnimationFrame((t) => stepTotal(t, t));
  }, [currentDonations, totalDonationsValue]);

  // Fortschritt für Balken
  const progress = Math.min(animatedCurrent / donationGoal, 1);

  return (
    <>
      {/* Tour-Absage-Banner kann per Variable aktiviert werden */}
      {showCancellationBanner && (
        <div className="sticky top-20 w-full bg-red-600 text-white py-4 px-2 flex items-center justify-center z-40">
          <svg className="w-6 h-6 mr-3 text-yellow-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-bold text-lg">
            Die heutige Tour muss leider aufgrund der Wettervorhersage abgesagt werden.
          </span>
        </div>
      )}
      <div className="relative h-screen flex flex-col justify-center items-center">
        <img
          src="/photos/Hoffnungsradler Titelphoto.png"
          alt="Hoffnungsradler Dülmen Rennradgruppe - Gemeinsam Radfahren für krebskranke Kinder im Münsterland"
          className="w-full h-full object-cover absolute inset-0 z-0"
        />
        <div className="relative z-20 flex flex-col items-center w-full px-4 h-full">
          <div className="text-center mt-12 md:mt-0 flex-1 flex flex-col justify-center">
            <h1 className="font-anton text-4xl md:text-6xl lg:text-7xl text-white mb-6 animate-fade-in drop-shadow-lg">
              Hoffnungsradler Dülmen
            </h1>
            <div className="inline-block bg-black/30 backdrop-blur-sm rounded-lg px-6 py-3 mb-8">
              <p className="font-inter text-xl md:text-2xl text-white animate-fade-in-up drop-shadow-md">
                Gemeinsam bewegen wir mehr.
              </p>
            </div>

            {/* NEUER BUTTON FÜR DIE ABSTIMMUNG - VORÜBERGEHEND AUSKOMMENTIERT
            <Dialog>
              <DialogTrigger asChild>
                <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-white animate-fade-in-up mx-auto">
                  Tour-Abstimmung 2025 ist live!
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Tour-Abstimmung 2025</DialogTitle>
                  <DialogDescription>
                    Die Abstimmung über die großen Touren für das nächste Jahr hat begonnen!
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4 text-sm">
                  <p className="mb-4">
                    Alle Newsletter-Abonnenten haben einen persönlichen Abstimmungs-Link per E-Mail erhalten. Schau jetzt in dein Postfach, um mitzubestimmen!
                  </p>
                  <p>
                    <strong>Noch kein Abonnent?</strong> Melde dich jetzt für unseren Newsletter an, um bei zukünftigen Abstimmungen teilzunehmen und keine Tour-Infos mehr zu verpassen.
                  </p>
                </div>
                <Button asChild>
                  <Link to="/kontakt">
                    Zur Newsletter-Anmeldung
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </DialogContent>
            </Dialog>
            */}

          </div>
          {/* Fortschrittsbalken und Gesamtsumme ganz unten */}
          <div className="w-full max-w-xl mb-8 mt-auto">
            <div className="flex justify-between mb-1">
              <span className="text-white/90 font-semibold text-lg">{donationYear} – Spendenziel {donationGoal.toLocaleString("de-DE")} €</span>
              <span className="text-white/80 text-md">{((progress * 100).toFixed(0))}%</span>
            </div>
            <div className="w-full h-8 bg-white/20 rounded-full overflow-hidden shadow-inner">
              <div
                className="h-full bg-forest transition-all duration-700 flex items-center pl-4 text-white font-bold text-lg"
                style={{ width: `${progress * 100}%`, minWidth: "2.5rem" }}
              >
                {animatedCurrent.toLocaleString("de-DE")} €
              </div>
            </div>
            <div className="mt-4 text-white/90 text-lg md:text-xl font-inter drop-shadow text-center">
              Insgesamt übergeben: <span className="font-bold">{animatedTotal.toLocaleString("de-DE")} €</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;
