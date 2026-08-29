import { useState } from "react";
import { Mail } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";

const TourSignup = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Gleicher Ursprung dank der Weiterleitung in vercel.json. Ein direkter Aufruf
      // der Spenden-Subdomain waere fremder Ursprung, und der Proxy setzt keine
      // CORS-Header -- die Anmeldung scheiterte dann still am Preflight.
      const antwort = await fetch("/api/anmelden", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const json = await antwort.json().catch(() => null);

      if (!json || !json.success) {
        throw new Error((json && json.message) || "Unbekannter Fehler");
      }

      // Die Antwort ist bewusst immer dieselbe -- auch wenn die Adresse schon
      // eingetragen ist. Alles andere verriete, wer bereits Abonnent ist.
      toast({
        title: "Fast geschafft!",
        description: "Wir haben dir eine E-Mail geschickt. Bitte klicke den Bestätigungslink darin — erst danach bekommst du den Newsletter."
      });

      setEmail("");
    } catch (error) {
      console.error("Fehler bei der Newsletter-Anmeldung:", error);
      toast({
        variant: "destructive",
        title: "Fehler",
        description: "Bei der Anmeldung ist ein Fehler aufgetreten. Bitte versuche es später erneut."
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
