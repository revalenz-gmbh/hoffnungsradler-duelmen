import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

const Datenschutz = () => {
  return (
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
            die Sie in ein Kontaktformular eingeben.
          </p>
          <p className="mb-4">
            Andere Daten werden automatisch oder nach Ihrer Einwilligung beim Besuch der Website durch unsere IT-Systeme erfasst. 
            Das sind vor allem technische Daten (z.B. Internetbrowser, Betriebssystem oder Uhrzeit des Seitenaufrufs).
          </p>

          <h4 className="font-semibold mt-2">Wofür nutzen wir Ihre Daten?</h4>
          <p className="mb-4">
            Ein Teil der Daten wird erhoben, um eine fehlerfreie Bereitstellung der Website zu gewährleisten. Andere Daten können 
            zur Analyse Ihres Nutzerverhaltens verwendet werden.
          </p>

          <h4 className="font-semibold mt-2">Welche Rechte haben Sie bezüglich Ihrer Daten?</h4>
          <p className="mb-4">
            Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und Zweck Ihrer gespeicherten 
            personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht, die Berichtigung oder Löschung dieser Daten zu 
            verlangen. Wenn Sie eine Einwilligung zur Datenverarbeitung erteilt haben, können Sie diese Einwilligung jederzeit 
            widerrufen. Außerdem haben Sie das Recht, unter bestimmten Umständen die Einschränkung der Verarbeitung Ihrer 
            personenbezogenen Daten zu verlangen.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">2. Kontaktaufnahme</h2>
          <p className="mb-4">
            Wenn Sie uns per Kontaktformular oder E-Mail kontaktieren, werden Ihre Angaben zwecks Bearbeitung der Anfrage und für 
            den Fall von Anschlussfragen bei uns gespeichert. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">3. Cookies</h2>
          <p className="mb-4">
            Unsere Website verwendet Cookies. Das sind kleine Textdateien, die Ihr Webbrowser auf Ihrem Endgerät speichert. 
            Cookies helfen uns dabei, unser Angebot nutzerfreundlicher, effektiver und sicherer zu machen.
          </p>

          <p className="mt-8 text-sm">
            Stand: 21.02.2025
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Datenschutz; 