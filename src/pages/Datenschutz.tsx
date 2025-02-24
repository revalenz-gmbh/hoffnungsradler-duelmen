import React from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent } from "@/components/ui/card";

const Datenschutz = () => {
  return (
    <>
      <Helmet>
        <meta property="og:title" content="Hoffnungsradler Dülmen" />
        <meta property="og:description" content="gemeinsam bewegen wir mehr" />
        <meta property="og:image" content="https://www.hoffnungs-radler-duelmen.de/og-image.png" />
        <meta property="og:url" content="https://www.hoffnungs-radler-duelmen.de" />
        <meta property="og:type" content="website" />
      </Helmet>
      
      <div className="container mx-auto py-8 px-4">
        <Card>
          <CardContent className="pt-6">
            <h1 className="text-3xl font-bold mb-6">Datenschutzerklärung</h1>

            <h2 className="text-xl font-semibold mt-6 mb-2">1. Datenschutz auf einen Blick</h2>
            <h3 className="text-lg font-semibold mt-4 mb-2">Allgemeine Hinweise</h3>
            <p className="mb-4">
              Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, 
              wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert 
              werden können.
            </p>

            <h3 className="text-lg font-semibold mt-4 mb-2">Datenerfassung auf dieser Website</h3>
            <h4 className="font-semibold mt-2">Wer ist verantwortlich für die Datenerfassung auf dieser Website?</h4>
            <p className="mb-4">
              Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten können Sie dem 
              Impressum dieser Website entnehmen.
            </p>

            <h4 className="font-semibold mt-2">Wie erfassen wir Ihre Daten?</h4>
            <p className="mb-4">
              Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann es sich z.B. um Daten handeln, 
              die Sie in ein Kontaktformular eingeben. Andere Daten werden automatisch beim Besuch der Website durch unsere IT-Systeme erfasst. 
              Das sind vor allem technische Daten (z.B. Internetbrowser, Betriebssystem oder Uhrzeit des Seitenaufrufs). 
              Die Erfassung dieser Daten erfolgt automatisch, sobald Sie unsere Website betreten.
            </p>

            <h4 className="font-semibold mt-2">Wofür nutzen wir Ihre Daten?</h4>
            <p className="mb-4">
              Ein Teil der Daten wird erhoben, um eine fehlerfreie Bereitstellung der Website zu gewährleisten. Andere Daten können 
              zur Analyse Ihres Nutzerverhaltens verwendet werden.
            </p>

            <h4 className="font-semibold mt-2">Welche Rechte haben Sie bezüglich Ihrer Daten?</h4>
            <p className="mb-4">
              Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und Zweck Ihrer gespeicherten 
              personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht, die Berichtigung, Löschung oder Einschränkung 
              der Verarbeitung dieser Daten zu verlangen. Wenn Sie eine Einwilligung zur Datenverarbeitung erteilt haben, können 
              Sie diese Einwilligung jederzeit für die Zukunft widerrufen. Zudem steht Ihnen unter bestimmten Umständen ein 
              Widerspruchsrecht gegen die Verarbeitung Ihrer Daten zu (Art. 21 DSGVO). Bei Fragen oder zur Ausübung Ihrer Rechte 
              wenden Sie sich bitte an die im Impressum angegebene Kontaktadresse. Ihnen steht außerdem ein Beschwerderecht bei 
              einer zuständigen Datenschutz-Aufsichtsbehörde zu.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2">2. Kontaktaufnahme</h2>
            <p className="mb-4">
              Wenn Sie uns per Kontaktformular oder E-Mail kontaktieren, werden Ihre Angaben inklusive der von Ihnen angegebenen 
              Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert. Diese 
              Datenverarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO (Vertragsanbahnung) bzw. Art. 6 Abs. 1 
              lit. f DSGVO (berechtigtes Interesse an der Bearbeitung Ihrer Anfrage). Diese Daten geben wir nicht ohne Ihre 
              Einwilligung an Dritte weiter.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2">3. Cookies</h2>
            <p className="mb-4">
              Unsere Website verwendet Cookies. Das sind kleine Textdateien, die Ihr Webbrowser auf Ihrem Endgerät speichert. 
              Cookies helfen uns dabei, unser Angebot nutzerfreundlicher, effektiver und sicherer zu machen.
            </p>
            <p className="mb-4">
              Einige Cookies sind technisch notwendig, um die Funktionalität der Website sicherzustellen (z. B. Navigation). 
              Diese verarbeiten wir auf Grundlage unseres berechtigten Interesses gemäß Art. 6 Abs. 1 lit. f DSGVO. Andere 
              Cookies, die z. B. Ihr Nutzerverhalten analysieren, setzen wir nur mit Ihrer Einwilligung ein (Art. 6 Abs. 1 
              lit. a DSGVO). Sie können Ihre Einwilligung jederzeit über die Cookie-Einstellungen der Website widerrufen.
            </p>
            <p className="mb-4">
              Sie können Ihren Browser so einstellen, dass Sie über das Setzen von Cookies informiert werden und Cookies nur 
              im Einzelfall erlauben, die Annahme von Cookies für bestimmte Fälle oder generell ausschließen sowie das 
              automatische Löschen der Cookies beim Schließen des Browsers aktivieren. Bei der Deaktivierung von Cookies 
              kann die Funktionalität dieser Website eingeschränkt sein.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2">4. Hosting und Content Delivery Networks (CDN)</h2>
            <h3 className="text-lg font-semibold mt-4 mb-2">Externes Hosting durch Vercel</h3>
            <p className="mb-4">
              Diese Website wird bei Vercel gehostet. Vercel ist ein Dienst der Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA.
              Die Datenverarbeitung durch Vercel erfolgt auf Grundlage unserer berechtigten Interessen an einer effizienten und sicheren 
              Bereitstellung unseres Onlineangebotes (Art. 6 Abs. 1 lit. f DSGVO).
            </p>
            <p className="mb-4">
              Beim Aufruf unserer Website werden durch Vercel automatisch Server-Logfiles erhoben, die technische Daten wie Ihre 
              IP-Adresse, Datum und Uhrzeit des Zugriffs sowie aufgerufene Seiten enthalten können. Dies dient der Sicherheit 
              und Optimierung des Dienstes.
            </p>
            <p className="mb-4">
              Vercel verarbeitet Daten von Besuchern unserer Website in den USA. Wir haben mit Vercel einen 
              Auftragsverarbeitungsvertrag geschlossen, der den Anforderungen von Art. 28 DSGVO entspricht. Die 
              Datenübermittlung in die USA erfolgt auf Basis von Standardvertragsklauseln der EU-Kommission. Bitte beachten 
              Sie, dass in den USA kein mit der EU vergleichbares Datenschutzniveau garantiert werden kann und dass US-Behörden 
              unter Umständen Zugriff auf Ihre Daten haben könnten (z. B. gemäß CLOUD Act).
            </p>
            <p className="mb-4">
              Vercel nutzt ein Content Delivery Network (CDN), um die Ladezeiten der Website zu optimieren. Dabei können 
              personenbezogene Daten wie IP-Adressen an Server weltweit übermittelt werden.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2">5. SSL/TLS-Verschlüsselung</h2>
            <p className="mb-4">
              Diese Seite nutzt aus Sicherheitsgründen eine SSL/TLS-Verschlüsselung, um die Vertraulichkeit und Integrität 
              der übertragenen Daten zu schützen. Eine verschlüsselte Verbindung erkennen Sie daran, dass die Adresszeile 
              des Browsers von "http://" auf "https://" wechselt und an dem Schloss-Symbol in Ihrer Browserleiste. Dank 
              dieser Verschlüsselung können die von Ihnen übermittelten Daten nicht von Dritten mitgelesen werden.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2">6. Speicherdauer</h2>
            <p className="mb-4">
              Sofern nicht spezifisch angegeben, speichern wir personenbezogene Daten nur so lange, wie es zur Erfüllung der 
              verfolgten Zwecke notwendig ist oder gesetzliche Aufbewahrungsfristen dies vorschreiben. Die Speicherdauer der 
              durch Vercel verarbeiteten Daten (z. B. Server-Logfiles) richtet sich zudem nach den technischen Erfordernissen 
              des Hostings und unserem Vertrag mit Vercel. Nach Ablauf der Speicherdauer werden die Daten gelöscht, es sei denn, 
              eine weitere Verarbeitung ist gesetzlich erforderlich oder zulässig.
            </p>

            <p className="mt-8 text-sm">
              Stand: 22.02.2025
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Datenschutz; 