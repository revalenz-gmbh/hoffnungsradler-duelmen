import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import emailjs from '@emailjs/browser';
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft } from "lucide-react";

const NewsletterUnsubscribe = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [isUnsubscribing, setIsUnsubscribing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  
  const id = searchParams.get('id');
  const email = searchParams.get('email');
  
  useEffect(() => {
    if (!id || !email) {
      toast({
        title: "Fehler",
        description: "Ungültiger Abmelde-Link. Bitte kontaktiere uns unter hoffnungsradler-info@gmail",
        variant: "destructive"
      });
    }
    
    emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);
  }, [id, email, toast]);
  
  const handleUnsubscribe = async () => {
    if (!id || !email) return;
    
    setIsUnsubscribing(true);
    
    try {
      // Abmeldung an Admin senden
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_UNSUBSCRIBE_TEMPLATE_ID,
        {
          subscriber_email: email,
          subscriber_id: id,
          unsubscribe_date: new Date().toLocaleDateString('de-DE'),
          unsubscribe_url: window.location.href
        }
      );
      
      setIsComplete(true);
      toast({
        title: "Erfolgreich abgemeldet",
        description: "Du wurdest erfolgreich von unserem Newsletter abgemeldet."
      });
    } catch (error) {
      console.error("Fehler bei der Abmeldung:", error);
      toast({
        title: "Fehler bei der Abmeldung",
        description: "Bitte versuche es später erneut oder kontaktiere uns direkt.",
        variant: "destructive"
      });
    } finally {
      setIsUnsubscribing(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-snow">
      {/* Header mit Zurück-Navigation */}
      <header className="fixed top-0 w-full z-50 bg-snow/80 backdrop-blur-lg shadow-sm">
        <div className="container mx-auto px-4">
          <nav className="flex items-center h-20">
            <Link
              to="/"
              className="flex items-center gap-2 text-prussian hover:text-prussian/80 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Zurück zur Startseite
            </Link>
          </nav>
        </div>
      </header>

      {/* Hauptinhalt */}
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg p-8 shadow-lg border border-forest/10 text-center">
              <h1 className="font-anton text-3xl text-prussian mb-6">
                Newsletter-Abmeldung
              </h1>
              
              {!id || !email ? (
                <p className="text-text mb-6">
                  Ungültiger Abmelde-Link. Bitte überprüfe den Link oder wende dich an uns.
                </p>
              ) : isComplete ? (
                <div>
                  <p className="text-text mb-6">
                    Du wurdest erfolgreich vom Tour-Newsletter abgemeldet.
                  </p>
                  <Link to="/" className="text-forest hover:underline">
                    Zurück zur Startseite
                  </Link>
                </div>
              ) : (
                <div>
                  <p className="text-text mb-6">
                    Möchtest du dich wirklich von unserem Tour-Newsletter abmelden?
                  </p>
                  <p className="text-sm text-gray-600 mb-8">
                    E-Mail-Adresse: {email}
                  </p>
                  <button
                    onClick={handleUnsubscribe}
                    className="bg-forest text-white px-6 py-3 rounded-lg hover:bg-forest/90 transition-colors font-medium disabled:opacity-70"
                    disabled={isUnsubscribing}
                  >
                    {isUnsubscribing ? "Wird abgemeldet..." : "Ja, abmelden"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NewsletterUnsubscribe; 