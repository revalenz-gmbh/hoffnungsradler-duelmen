import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { getUebergabeSummen } from "../lib/buchhaltung-api";
import type { UebergabeSummen } from "../lib/buchhaltung-api";
import SEOHead from "@/components/SEOHead";
import BreadcrumbSchema from "@/components/schemas/BreadcrumbSchema";

// Statische Daten für Empfänger-Organisationen (werden mit API-Daten kombiniert)
const recipientMapping: { [year: number]: string } = {
  2024: "Datteln Elterninitiative krebskranker Kinder",
  2023: "Datteln Elterninitiative krebskranker Kinder",
  2022: "Datteln Elterninitiative krebskranker Kinder",
  2021: "Kinderkrebshilfe Münster",
  2020: "Datteln Elterninitiative krebskranker Kinder",
  2019: "Datteln Elterninitiative krebskranker Kinder",
  2018: "Kinderkrebshilfe Münster",
  2017: "Kinder u. Jugendliche-Krebsberatung-Münster",
  2016: "Datteln Elterninitiative krebskranker Kinder",
  2015: "Datteln Elterninitiative krebskranker Kinder",
  2014: "Datteln Elterninitiative krebskranker Kinder",
  2013: "Datteln Elterninitiative krebskranker Kinder / Tour der Hoffnung",
  2012: "Tour der Hoffnung",
  2011: "Tour der Hoffnung",
  2010: "Tour der Hoffnung",
  2009: "Tour der Hoffnung",
  2008: "Tour der Hoffnung",
  2007: "Tour der Hoffnung",
  2006: "Tour der Hoffnung",
  2005: "Tour der Hoffnung",
  2004: "Tour der Hoffnung",
};

const Spenden = () => {
  const [donationsData, setDonationsData] = useState<UebergabeSummen | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getUebergabeSummen();
        setDonationsData(data);
      } catch (error) {
        console.error("Fehler beim Laden der Spendendaten:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Konvertiere API-Daten in Tabellen-Format
  const donations = donationsData
    ? Object.entries(donationsData.summen).map(([year, amount]) => ({
        year: parseInt(year),
        recipient: recipientMapping[parseInt(year)] || "Kinderkrebshilfe",
        amount: amount,
      }))
    : [];

  const totalDonations = donationsData?.gesamt || 91055;
  const tableData = [...donations].sort((a, b) => b.year - a.year);

  const organizations = [
    {
      name: "Elterninitiative krebskranker Kinder Datteln",
      description: "Die Elterninitiative krebskranker Kinder an der Vestischen Kinderklinik Datteln e.V. unterstützt seit vielen Jahren Familien mit krebskranken Kindern durch gemeinsame Aktivitäten, Ausflüge, Feste und verschiedene Hilfsangebote. Die Initiative hilft dabei, den schweren Alltag der betroffenen Familien zu erleichtern.",
      link: "https://www.elterninitiative-datteln.de/",
    },
    {
      name: "Kinderkrebshilfe Münster",
      description: "Die Kinderkrebshilfe Münster e.V. steht seit über 40 Jahren Familien mit krebskranken Kindern zur Seite. Der Verein unterstützt durch verschiedene Nachsorgeprojekte, Forschungsförderung, Familiennothilfe und bietet wichtige psychosoziale Hilfsangebote an.",
      link: "https://www.kinderkrebshilfe-muenster.de/",
    },
    {
      name: "Krebsberatung Münster",
      description: "Die Krebsberatung Münster bietet spezielle Unterstützung für Kinder und Jugendliche aus Familien mit krebskranken Angehörigen. Durch Beratungsgespräche, psychoonkologische Begleitung und praktische Hilfen werden Kinder und ihre Familien in dieser schwierigen Situation unterstützt.",
      link: "https://krebsberatung-muenster.de/kinder-und-jugendliche/",
    },
    {
      name: "Tour der Hoffnung",
      description: "Die Tour der Hoffnung ist eine jährliche Benefizradtour, die seit 1983 deutschlandweit Spenden für krebskranke Kinder und Jugendliche sammelt. Die gesammelten Spenden fließen in verschiedene Einrichtungen wie Kinderkliniken, Hospize und Forschungseinrichtungen.",
      link: "https://www.tour-der-hoffnung.de/",
    },
  ];

  // Spendenkonto-Informationen
  const bankAccount = {
    bank: "Sparkasse Westmünsterland",
    accountHolder: "Hoffnungsradler Dülmen e.V.",
    iban: "DE76 4015 4530 0035 6376 51",
    bic: "WELADE3WXXX"
  };

  // QR-Code-Daten für SEPA-Überweisung
  const qrCodeData = `BCD
001
1
SCT
${bankAccount.bic}
${bankAccount.accountHolder}
${bankAccount.iban.replace(/\s/g, "")}
EUR
0
Spende Hoffnungsradler
`;

  return (
    <div className="min-h-screen bg-snow">
      <SEOHead 
        title="Spenden für krebskranke Kinder - Über 90.000€ gesammelt"
        description="Die Hoffnungsradler Dülmen haben über 90.000 Euro für krebskranke Kinder gesammelt. Erfahren Sie mehr über unsere Spenden-Historie und wie Sie helfen können."
        url="https://www.hoffnungs-radler-duelmen.de/spenden"
        keywords="Spenden krebskranke Kinder, Elterninitiative Datteln, Kinderkrebshilfe Münster, Spendenquittung, Bankverbindung"
      />
      <BreadcrumbSchema items={[
        { name: "Startseite", url: "https://www.hoffnungs-radler-duelmen.de" },
        { name: "Spenden", url: "https://www.hoffnungs-radler-duelmen.de/spenden" }
      ]} />
      
      {/* Header with Back Navigation */}
      <header className="fixed top-0 w-full z-50 bg-snow/80 backdrop-blur-lg shadow-sm">
        <div className="container mx-auto px-4">
          <nav className="flex items-center h-20">
            <Link
              to="/"
              className="flex items-center gap-2 text-prussian hover:text-prussian/80 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Zurück
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Title Section */}
            <div className="flex flex-col items-center mb-12">
              <div className="w-48 h-48 mb-8 bg-forest/5 rounded-full p-4 rotate-3 transition-transform hover:rotate-6">
                <img
                  src="/logos/aa82fed0-d01b-4922-b10c-c9a4b9dedb38.png"
                  alt="Hoffnungsradler Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <h1 className="font-anton text-4xl md:text-5xl text-prussian mb-4">
                Spenden
              </h1>
              <p className="text-text text-lg max-w-2xl text-center mb-8">
                Seit 2004 haben wir Spendengelder in Höhe von insgesamt {totalDonations.toLocaleString("de-DE", { style: "currency", currency: "EUR" })} an gemeinnützige Organisationen übergeben, die sich der Unterstützung und Betreuung von Familien mit krebskranken Kindern widmen.
              </p>
            </div>

            {/* Spendenkonto Section */}
            <div className="mb-16 bg-white rounded-lg shadow-lg border border-forest/10 p-8">
              <h2 className="font-anton text-3xl text-prussian mb-6">Unser Spendenkonto</h2>
              <p className="text-text mb-6">
                Unterstützen Sie uns mit Ihrer Spende. Sie können den QR-Code mit Ihrer Banking-App scannen, um eine Überweisung zu tätigen, oder die Kontodaten manuell eingeben.
              </p>
              
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="bg-white p-4 rounded-lg border border-forest/20">
                  <QRCodeSVG 
                    value={qrCodeData} 
                    size={200} 
                    level="M"
                    includeMargin={true}
                  />
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-bold text-xl text-prussian mb-2">Kontoinhaber</h3>
                    <p className="text-text">{bankAccount.accountHolder}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-bold text-xl text-prussian mb-2">Bank</h3>
                    <p className="text-text">{bankAccount.bank}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-bold text-xl text-prussian mb-2">IBAN</h3>
                    <p className="text-text font-mono">{bankAccount.iban}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-bold text-xl text-prussian mb-2">BIC</h3>
                    <p className="text-text font-mono">{bankAccount.bic}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Organizations Section */}
            <div className="mb-16">
              <h2 className="font-anton text-3xl text-prussian mb-8">Unterstützte Organisationen</h2>
              <p className="text-text mb-8">
                Seit 2004 unterstützen wir verschiedene Organisationen, die sich für krebskranke Kinder und deren Familien einsetzen. Unsere Spendengelder fließen direkt in Projekte und Hilfsangebote, die das Leben der betroffenen Familien erleichtern und verbessern.
              </p>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {organizations.map((org, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-lg border border-forest/10 p-6">
                    <h3 className="font-bold text-xl text-prussian mb-4">{org.name}</h3>
                    <p className="text-text mb-4">{org.description}</p>
                    <a 
                      href={org.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-forest hover:text-forest/80 font-medium inline-flex items-center"
                    >
                      Website besuchen
                      <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/>
                      </svg>
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Tabelle der übergebenen Spenden */}
            <div className="bg-white rounded-lg shadow-lg border border-forest/10 overflow-hidden">
              {loading ? (
                <div className="p-12 text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-forest"></div>
                  <p className="mt-4 text-text">Lade Spendendaten...</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-24">Jahr</TableHead>
                      <TableHead className="min-w-[300px]">Organisation</TableHead>
                      <TableHead className="text-right w-32">Betrag</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tableData.length > 0 ? (
                      tableData.map((donation, index) => (
                        <TableRow key={`${donation.year}-${index}`}>
                          <TableCell className="font-medium">{donation.year}</TableCell>
                          <TableCell>{donation.recipient}</TableCell>
                          <TableCell className="text-right">
                            {donation.amount.toLocaleString("de-DE", { style: "currency", currency: "EUR" })}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-text/60 py-8">
                          Keine Spendendaten verfügbar
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Spenden;
