import { useState, useEffect } from "react";
import { Mail } from "lucide-react";
import emailjs from '@emailjs/browser';
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';

const TourSignup = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // EmailJS initialisieren
  useEffect(() => {
    emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Eindeutige ID für den Abonnenten generieren
      const subscriberId = uuidv4();
      const unsubscribeUrl = `${window.location.origin}/newsletter/abmelden?id=${subscriberId}&email=${encodeURIComponent(email)}`;
      
      // Admin-Benachrichtigung über neue Anmeldung senden
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_NEWSLETTER_TEMPLATE_ID,
        {
          subscriber_email: email,
          subscriber_id: subscriberId,
          subscription_date: new Date().toLocaleDateString('de-DE'),
          subscription_type: 'tour-newsletter',
          source: window.location.href,
          unsubscribe_link: unsubscribeUrl
        }
      );

      toast({
        title: "Anmeldung erfolgreich",
        description: "Vielen Dank für deine Anmeldung zum Tour-Newsletter! Eine Bestätigung wird in Kürze an deine E-Mail-Adresse gesendet.",
      });

      // Formular zurücksetzen
      setEmail("");
    } catch (error) {
      console.error("Fehler bei der Newsletter-Anmeldung:", error);
      toast({
        variant: "destructive",
        title: "Fehler",
        description: "Bei der Anmeldung ist ein Fehler aufgetreten. Bitte versuche es später erneut.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-24 bg-forestLight">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white rounded-lg p-8 md:p-12 shadow-lg border border-forest/10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-forest/10 text-forest mb-6">
              <Mail className="w-8 h-8" />
            </div>
            <h2 className="font-anton text-3xl text-prussian mb-4">
              Jetzt für den Tour-Newsletter anmelden!
            </h2>
            <p className="text-text mb-8 max-w-2xl mx-auto">
              Bleib stets über unsere Touren informiert! Mit unserem Tour-Newsletter erhältst du:
              <ul className="text-left list-disc pl-6 mt-4 space-y-2">
                <li>Eine Woche vor jeder Tour eine detaillierte Routenbeschreibung</li>
                <li>Kurzfristige Updates bei Wetteränderungen oder Routenänderungen</li>
                <li>Exklusive Tipps zur Vorbereitung auf die jeweilige Tour</li>
                <li>Gelegentliche Fotoeindrücke vergangener Touren</li>
              </ul>
            </p>
            
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Deine E-Mail-Adresse"
                  className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-forest"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="bg-forest text-white px-6 py-3 rounded-lg hover:bg-forest/90 transition-colors font-medium disabled:opacity-70"
                  disabled={loading}
                >
                  {loading ? "Wird angemeldet..." : "Anmelden"}
                </button>
              </div>
              <div className="mt-4 text-sm text-gray-600">
                Mit der Anmeldung stimmst du dem Erhalt von E-Mails bezüglich unserer Touren zu. 
                Deine Daten werden ausschließlich für den Versand des Newsletters verwendet. 
                Du kannst dich jederzeit über einen Link in jeder E-Mail abmelden. 
                Weitere Informationen findest du in unserer <Link to="/datenschutz" className="text-forest hover:underline">Datenschutzerklärung</Link>.
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TourSignup;
