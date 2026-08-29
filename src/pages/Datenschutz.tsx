import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Link } from 'react-router-dom';
import SEOHead from "@/components/SEOHead";

const Datenschutz = () => {
  return (
    <>
      <SEOHead
        title="Datenschutzerklärung"
        description="Datenschutzerklärung der Hoffnungsradler Dülmen e.V. Informationen zur Verarbeitung personenbezogener Daten gemäß DSGVO."
        url="https://www.hoffnungs-radler-duelmen.de/datenschutz"
      />

      <div className="container mx-auto py-8 px-4">
        <Card>
          <CardContent className="pt-6">
            <h1 className="text-3xl font-bold mb-6">Datenschutzerklärung</h1>

            <h2 className="text-xl font-semibold mt-6 mb-2">1. Datenschutz auf einen Blick</h2>
            <h3 className="text-lg font-semibold mt-4 mb-2">Allgemeine Hinweise</h3>
            <p className="mb-4">
              Die folgenden Hinweise geben einen Überblick darüber, was mit Ihren personenbezogenen Daten passiert,
              wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich
              identifiziert werden können.
            </p>
            <p className="mb-4">
              Diese Erklärung gilt für unsere Website <strong>www.hoffnungs-radler-duelmen.de</strong> und für unsere
              Spendenseite <strong>spenden.hoffnungs-radler-duelmen.de</strong>. Die Spendenseite verarbeitet mehr Daten
              als die übrige Website; Abschnitt 6 beschreibt das im Einzelnen.
            </p>

            <h3 className="text-lg font-semibold mt-4 mb-2">Datenerfassung auf dieser Website</h3>
            <h4 className="font-semibold mt-2">Wer ist verantwortlich für die Datenerfassung?</h4>
            <p className="mb-4">
              Verantwortlich ist der Hoffnungsradler Dülmen e.V. Die Kontaktdaten finden Sie in unserem{' '}
              <Link to="/impressum" className="text-forest hover:underline">Impressum</Link>.
            </p>

            <h4 className="font-semibold mt-2">Wie erfassen wir Ihre Daten?</h4>
            <p className="mb-4">
              Zum einen dadurch, dass Sie uns Daten mitteilen — etwa in unserem Kontaktformular, bei der
              Newsletter-Anmeldung oder auf der Spendenseite. Zum anderen erfasst der Server beim Aufruf einer Seite
              automatisch technische Daten (z. B. Browsertyp, Betriebssystem, Uhrzeit des Zugriffs, IP-Adresse).
            </p>

            <h4 className="font-semibold mt-2">Wofür nutzen wir Ihre Daten?</h4>
            <p className="mb-4">
              Ausschließlich für den Zweck, zu dem Sie sie uns gegeben haben: die Beantwortung Ihrer Anfrage, den
              Versand des Newsletters, die Zuordnung Ihrer Spende und die Ausstellung einer Zuwendungsbestätigung.
              Hinzu kommt die technisch fehlerfreie Bereitstellung der Website.
            </p>
            <p className="mb-4">
              <strong>Wir analysieren Ihr Nutzungsverhalten nicht.</strong> Auf unseren Seiten laufen keine
              Analyse- oder Trackingdienste, keine Reichweitenmessung und keine Werbenetzwerke. Wir erstellen keine
              Nutzerprofile und geben Ihre Daten nicht zu Werbezwecken weiter.
            </p>

            <h4 className="font-semibold mt-2">Welche Rechte haben Sie bezüglich Ihrer Daten?</h4>
            <p className="mb-4">
              Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und Zweck Ihrer
              gespeicherten personenbezogenen Daten zu erhalten (Art. 15 DSGVO). Sie haben außerdem ein Recht auf
              Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18) und
              Datenübertragbarkeit (Art. 20). Wenn Sie eine Einwilligung erteilt haben, können Sie diese jederzeit
              für die Zukunft widerrufen; die Rechtmäßigkeit der bis dahin erfolgten Verarbeitung bleibt davon
              unberührt. Zudem steht Ihnen unter bestimmten Umständen ein Widerspruchsrecht zu (Art. 21 DSGVO).
            </p>
            <p className="mb-4">
              Wenden Sie sich dafür an die im Impressum genannte Adresse. Ihnen steht außerdem ein Beschwerderecht bei
              einer Datenschutz-Aufsichtsbehörde zu; für uns zuständig ist die Landesbeauftragte für Datenschutz und
              Informationsfreiheit Nordrhein-Westfalen.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2">2. Server-Logfiles</h2>
            <p className="mb-4">
              Beim Aufruf unserer Seiten werden automatisch Zugriffsdaten in Logfiles gespeichert: aufgerufene Seite,
              Datum und Uhrzeit, übertragene Datenmenge, Browsertyp und Betriebssystem sowie die IP-Adresse. Diese
              Daten dienen dem sicheren und störungsfreien Betrieb und werden nicht mit anderen Datenquellen
              zusammengeführt. Rechtsgrundlage ist unser berechtigtes Interesse an der Sicherheit und Funktionsfähigkeit
              unseres Angebots (Art. 6 Abs. 1 lit. f DSGVO).
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2">3. Kontaktformular und Tour-Anmeldung</h2>
            <p className="mb-4">
              Wenn Sie uns über das Kontaktformular oder das Anmeldeformular für eine Tour schreiben, verarbeiten wir
              die von Ihnen angegebenen Daten (Name, E-Mail-Adresse und Ihre Nachricht) zur Bearbeitung Ihres Anliegens
              und für den Fall von Anschlussfragen. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO
              (Vertragsanbahnung) bzw. Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Bearbeitung Ihrer
              Anfrage).
            </p>
            <p className="mb-4">
              Für die Zustellung dieser Formulare als E-Mail nutzen wir den Dienst <strong>EmailJS</strong>. Ihre
              Formulareingaben werden dabei an die Server des Anbieters übermittelt und von dort als E-Mail an unser
              Postfach zugestellt. Eine Verarbeitung außerhalb der Europäischen Union kann dabei nicht ausgeschlossen
              werden. Rechtsgrundlage ist unser berechtigtes Interesse an einem funktionierenden Kontaktweg
              (Art. 6 Abs. 1 lit. f DSGVO).
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2">4. Cookies und Speicherung im Browser</h2>
            <p className="mb-4">
              <strong>Unsere Website setzt keine Cookies.</strong> Wir verwenden weder technisch notwendige Cookies
              noch Cookies zur Analyse oder zu Werbezwecken. Ein Cookie-Banner ist deshalb nicht erforderlich.
            </p>
            <p className="mb-4">
              Auf der Spendenübersicht speichern wir für wenige Minuten die abgerufenen Spendensummen im lokalen
              Speicher Ihres Browsers (localStorage), damit die Seite beim erneuten Aufruf schneller lädt. Dabei
              handelt es sich ausschließlich um öffentliche Summen und Jahreszahlen, nicht um personenbezogene Daten.
              Diese Angaben verlassen Ihren Browser nicht und können über die Einstellungen Ihres Browsers jederzeit
              gelöscht werden.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2">5. Newsletter</h2>
            <p className="mb-4">
              Wenn Sie sich für unseren Tour-Newsletter anmelden, speichern wir Ihre E-Mail-Adresse, das Anmeldedatum
              und eine eindeutige Kennung. Die Kennung dient der Verwaltung Ihres Abonnements und dem Nachweis Ihrer
              Anmeldung. Rechtsgrundlage ist Ihre Einwilligung (Art. 6 Abs. 1 lit. a DSGVO).
            </p>
            <p className="mb-4">
              Die Abonnentenliste führen wir in Google Sheets, der Versand erfolgt über Gmail — siehe Abschnitt 8.
            </p>
            <p className="mb-4">
              Sie können den Newsletter jederzeit abbestellen, indem Sie den Abmelde-Link verwenden, der in jeder
              Newsletter-Mail enthalten ist. Alternativ können Sie sich direkt über diesen{' '}
              <Link to="/newsletter/abmelden" className="text-forest hover:underline">Abmelde-Link</Link> oder durch
              eine Mitteilung an die im Impressum angegebenen Kontaktdaten abmelden. Nach der Abmeldung löschen wir
              Ihre E-Mail-Adresse aus dem Verteiler.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2">6. Spenden über spenden.hoffnungs-radler-duelmen.de</h2>
            <p className="mb-4">
              Auf unserer Spendenseite können Sie eine Spende ankündigen. Sie erhalten dafür eine persönliche
              Referenznummer und einen QR-Code für Ihre Überweisung. Anhand der Referenznummer im Verwendungszweck
              ordnen wir Ihren Zahlungseingang zu.
            </p>

            <h3 className="text-lg font-semibold mt-4 mb-2">Welche Daten wir erheben</h3>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li><strong>Immer:</strong> Name, E-Mail-Adresse, angekündigter Betrag, Zeitpunkt der Zusage sowie die
                erzeugte Referenznummer und der Zahlungsstatus.</li>
              <li><strong>Nur wenn Sie eine Zuwendungsbestätigung wünschen:</strong> zusätzlich Straße, Hausnummer,
                Postleitzahl und Ort. Ohne Anschrift dürfen wir keine Zuwendungsbestätigung ausstellen.</li>
              <li><strong>Nur wenn Sie es ausdrücklich ankreuzen:</strong> Ihre Einwilligung, dass Ihr Name in der
                Liste der letzten Spenden auf der Spendenseite erscheinen darf.</li>
            </ul>
            <p className="mb-4">
              <strong>Zahlungsdaten erheben wir auf der Website nicht.</strong> Die Überweisung führen Sie selbst bei
              Ihrer Bank aus; wir sehen Ihre Kontoverbindung nur insoweit, wie sie auf unserem Kontoauszug erscheint.
              Der QR-Code enthält ausschließlich unsere eigenen Kontodaten und den Verwendungszweck.
            </p>

            <h3 className="text-lg font-semibold mt-4 mb-2">Auf welcher Grundlage</h3>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li><strong>Name, E-Mail-Adresse und Betrag:</strong> Ihre Einwilligung, die Sie beim Absenden des
                Formulars ausdrücklich erteilen (Art. 6 Abs. 1 lit. a DSGVO), sowie unser berechtigtes Interesse an
                der Zuordnung des Zahlungseingangs (Art. 6 Abs. 1 lit. f DSGVO).</li>
              <li><strong>Anschrift für die Zuwendungsbestätigung:</strong> Erfüllung einer rechtlichen Verpflichtung
                (Art. 6 Abs. 1 lit. c DSGVO). Eine Zuwendungsbestätigung muss nach § 50 EStDV die Anschrift der
                zuwendenden Person enthalten.</li>
              <li><strong>Öffentliche Nennung Ihres Namens:</strong> ausschließlich Ihre Einwilligung
                (Art. 6 Abs. 1 lit. a DSGVO). Sie ist freiwillig, standardmäßig nicht gesetzt und unabhängig davon,
                ob Sie eine Zuwendungsbestätigung wünschen. Sie können sie jederzeit formlos widerrufen; wir
                entfernen Ihren Namen dann aus der Liste.</li>
            </ul>

            <h3 className="text-lg font-semibold mt-4 mb-2">Schutz vor Missbrauch</h3>
            <p className="mb-4">
              Um automatisierte Massenanfragen zu unterbinden, zählt unser Server kurzzeitig die Anfragen je
              IP-Adresse. Diese Zählung liegt nur im Arbeitsspeicher, umfasst ein Zeitfenster von einer Minute und
              wird nicht dauerhaft gespeichert oder mit Ihrer Spende verknüpft. Rechtsgrundlage ist unser berechtigtes
              Interesse am störungsfreien Betrieb (Art. 6 Abs. 1 lit. f DSGVO).
            </p>

            <h3 className="text-lg font-semibold mt-4 mb-2">Wie lange wir die Daten speichern</h3>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li><strong>Angekündigte, aber nicht bezahlte Spenden</strong> verfallen nach Ablauf einer Frist und
                werden automatisch gelöscht.</li>
              <li><strong>Daten zu ausgestellten Zuwendungsbestätigungen</strong> — einschließlich Ihrer Anschrift —
                bewahren wir zehn Jahre auf. Wir sind verpflichtet, ein Doppel der Bestätigung aufzubewahren
                (§ 50 EStDV, § 147 AO); vorher dürfen wir diese Daten nicht löschen.</li>
              <li><strong>Ihre Einwilligung zur öffentlichen Nennung</strong> speichern wir, solange Ihr Name in der
                Liste steht, und darüber hinaus zum Nachweis der Einwilligung.</li>
            </ul>

            <h2 className="text-xl font-semibold mt-6 mb-2">7. Hosting</h2>
            <h3 className="text-lg font-semibold mt-4 mb-2">Website: Vercel</h3>
            <p className="mb-4">
              Unsere Website www.hoffnungs-radler-duelmen.de wird bei Vercel Inc., 340 S Lemon Ave #4133, Walnut,
              CA 91789, USA gehostet. Beim Aufruf werden Server-Logfiles erhoben (siehe Abschnitt 2). Rechtsgrundlage
              ist unser berechtigtes Interesse an einer sicheren und effizienten Bereitstellung
              (Art. 6 Abs. 1 lit. f DSGVO).
            </p>
            <p className="mb-4">
              Vercel verarbeitet dabei auch Daten in den USA und betreibt ein Content Delivery Network, über das
              Anfragen an Server in verschiedenen Ländern geleitet werden können. Wir haben mit Vercel einen
              Auftragsverarbeitungsvertrag nach Art. 28 DSGVO geschlossen; die Übermittlung in die USA erfolgt auf
              Grundlage der Standardvertragsklauseln der EU-Kommission. Bitte beachten Sie, dass in den USA kein mit
              der EU vergleichbares Datenschutzniveau garantiert werden kann und US-Behörden unter Umständen Zugriff
              auf Daten erhalten können (z. B. nach dem CLOUD Act).
            </p>
            <h3 className="text-lg font-semibold mt-4 mb-2">Spendenseite: eigener Server</h3>
            <p className="mb-4">
              Die Spendenseite spenden.hoffnungs-radler-duelmen.de betreiben wir auf einem eigenen Server in
              Deutschland. Die dort erhobenen Daten verlassen unseren Server nur, um in unserer Vereinstabelle bei
              Google gespeichert zu werden (Abschnitt 8). Ein Content Delivery Network setzen wir für die
              Spendenseite nicht ein; auch die zur Anzeige des QR-Codes verwendete Programmbibliothek liegt auf
              unserem eigenen Server, damit beim Aufruf der Seite keine Verbindung zu Dritten entsteht.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2">8. Google-Dienste</h2>
            <p className="mb-4">
              Wir verwalten unsere Vereinsdaten — Newsletter-Abonnements, Spendenzusagen und die Buchhaltung — in
              Google Sheets und automatisieren sie mit Google Apps Script. Der Newsletter-Versand erfolgt über Gmail.
              Anbieter ist Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland, die sich zur
              Verarbeitung Google LLC in den USA bedient.
            </p>
            <p className="mb-4">
              Das bedeutet: Die in Abschnitt 5 und 6 genannten Daten werden auf Servern von Google gespeichert, und
              eine Verarbeitung in den USA kann nicht ausgeschlossen werden. In den USA besteht kein mit der EU
              vergleichbares Datenschutzniveau; US-Behörden können unter Umständen Zugriff auf Daten erhalten.
              Rechtsgrundlage ist unser berechtigtes Interesse an einer für einen kleinen Verein tragbaren Verwaltung
              (Art. 6 Abs. 1 lit. f DSGVO) sowie, soweit Sie eingewilligt haben, Art. 6 Abs. 1 lit. a DSGVO.
            </p>
            <p className="mb-4">
              Die Tabellen sind nicht öffentlich und nur für die dafür zuständigen Vorstandsmitglieder zugänglich.
              Über unsere Website werden ausschließlich zusammengefasste, nicht personenbezogene Zahlen
              veröffentlicht — sowie Namen in der Liste der letzten Spenden, wenn Sie dem ausdrücklich zugestimmt
              haben.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2">9. SSL/TLS-Verschlüsselung</h2>
            <p className="mb-4">
              Unsere Seiten nutzen eine SSL/TLS-Verschlüsselung, um die Vertraulichkeit und Integrität der
              übertragenen Daten zu schützen. Eine verschlüsselte Verbindung erkennen Sie daran, dass die Adresszeile
              des Browsers mit „https://" beginnt und ein Schloss-Symbol anzeigt.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2">10. Speicherdauer im Überblick</h2>
            <p className="mb-4">
              Sofern in dieser Erklärung nichts anderes angegeben ist, speichern wir personenbezogene Daten nur so
              lange, wie es für den jeweiligen Zweck erforderlich ist oder gesetzliche Aufbewahrungsfristen es
              vorschreiben. Konkret: Anfragen über das Kontaktformular löschen wir, sobald sie abschließend bearbeitet
              sind; Newsletter-Daten mit Ihrer Abmeldung; nicht bezahlte Spendenzusagen nach Ablauf ihrer Frist;
              Unterlagen zu Zuwendungsbestätigungen nach zehn Jahren.
            </p>

            <p className="mt-8 text-sm">
              Stand: 29.08.2026
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Datenschutz;
