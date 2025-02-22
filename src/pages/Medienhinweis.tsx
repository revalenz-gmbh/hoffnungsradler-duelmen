import { Camera } from "lucide-react";

const Medienhinweis = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <h1 className="font-anton text-3xl text-forestDark">
            Medienhinweis: Foto- und Videoaufnahmen bei Veranstaltungen
          </h1>
          <Camera className="w-8 h-8 text-forestDark" />
        </div>

        <div className="prose prose-forest max-w-none">
          <p className="lead">
            Bei unseren Veranstaltungen, insbesondere den gemeinsamen Ausfahrten, 
            werden gelegentlich Fotos und Videos gemacht. Diese Aufnahmen dienen dazu, 
            unsere Aktivitäten zu dokumentieren und die Öffentlichkeit über die Arbeit 
            des Hoffnungsradler Dülmen e.V. zu informieren. Unser Ziel ist es, die Belange krebskranker Kinder und ihrer Familien zu 
            unterstützen und die Öffentlichkeit für diese wichtige Thematik zu 
            sensibilisieren.
          </p>

          <h2 className="font-anton text-xl mt-8 mb-4">Zweck der Aufnahmen</h2>
          <p>
            Die Veröffentlichung der Aufnahmen dient der Dokumentation unserer 
            Vereinsarbeit und der Sensibilisierung der Öffentlichkeit für die Belange 
            krebskranker Kinder und ihrer Familien. Durch die Veröffentlichung möchten 
            wir auf die Unterstützung aufmerksam machen und andere 
            Menschen dazu inspirieren, sich ebenfalls zu engagieren.
          </p>

          <h2 className="font-anton text-xl mt-8 mb-4">Teilnahme</h2>
          <p>
            Mit der Teilnahme an unseren Veranstaltungen erklären Sie sich damit 
            einverstanden, dass Fotos und Videos, auf denen Sie erkennbar sind, im 
            Rahmen der Vereinsarbeit verwendet werden dürfen. Diese Aufnahmen werden 
            auf unserer Website, in sozialen Medien oder in Flyern veröffentlicht, 
            um die Öffentlichkeit über unsere Aktivitäten zu informieren.
          </p>

          <h2 className="font-anton text-xl mt-8 mb-4">Widerruf</h2>
          <p>
            Falls Sie nicht damit einverstanden sind, dass Aufnahmen von Ihnen 
            veröffentlicht werden, teilen Sie dies bitte vor der Veranstaltung einem 
            Vorstandsmitglied mit. Wir werden Ihre Wünsche selbstverständlich 
            respektieren und keine Aufnahmen von Ihnen veröffentlichen.
          </p>

          <div className="bg-forest/10 p-6 rounded-lg mt-8">
            <p className="mb-0">
              Wir danken Ihnen für Ihr Verständnis und Ihre Unterstützung! Gemeinsam 
              können wir die Botschaft des Hoffnungsradler Dülmen e.V. in die Welt 
              tragen und die Unterstützung für krebskranke Kinder und ihre Familien 
              weiter vorantreiben.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Medienhinweis; 