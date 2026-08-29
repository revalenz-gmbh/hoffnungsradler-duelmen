import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import SEOHead from "@/components/SEOHead";

/**
 * Abmeldeseite fuer ALTE Links.
 *
 * Der Newsletter laeuft seit der Umstellung ueber den Vereins-Baustein: Jede Nachricht
 * traegt einen eigenen Abmeldelink, ein Klick genuegt, und die Abmeldung wirkt sofort.
 *
 * Diese Route bleibt trotzdem bestehen, weil in den Postfaechern der Abonnenten noch
 * Links auf /newsletter/abmelden stehen. Sie zu entfernen hiesse: Wer sich ueber eine
 * aeltere Nachricht abmelden will, landet auf einer 404-Seite -- und das ist genau der
 * Moment, in dem eine Sackgasse am meisten schadet.
 */
const NewsletterUnsubscribe = () => {
  return (
    <div className="min-h-screen bg-snow">
      <SEOHead
        title="Newsletter abmelden"
        description="Newsletter der Hoffnungsradler Dülmen abmelden."
        url="https://www.hoffnungs-radler-duelmen.de/newsletter/abmelden"
      />

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

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg p-8 shadow-lg border border-forest/10">
              <h1 className="font-anton text-3xl text-prussian mb-6">
                Newsletter abmelden
              </h1>

              <p className="text-text mb-4">
                Dieser Link stammt aus einer älteren Nachricht.
              </p>

              <p className="text-text mb-4">
                Bitte nutze den <strong>Abmeldelink am Ende unseres letzten
                Newsletters</strong> — ein Klick genügt, und die Abmeldung wirkt sofort.
              </p>

              <p className="text-text mb-6">
                Du kommst nicht weiter? Schreib uns an{" "}
                <a
                  href="mailto:hoffnungsradlerinfo@gmail.com"
                  className="text-forest hover:underline"
                >
                  hoffnungsradlerinfo@gmail.com
                </a>
                , wir nehmen dich von Hand aus der Liste.
              </p>

              <Link to="/" className="text-forest hover:underline">
                Zurück zur Startseite
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NewsletterUnsubscribe;
