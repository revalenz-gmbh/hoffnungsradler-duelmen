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
import { fetchUebergabeSummen } from "../lib/fetchUebergabeSummen";

const Spenden = () => {
  const donations = [
    { year: 2024, recipient: "Datteln Elterninitiative krebskranker Kinder", amount: 7000.0 },
    { year: 2023, recipient: "Datteln Elterninitiative krebskranker Kinder", amount: 13000.0 },
    { year: 2022, recipient: "Datteln Elterninitiative krebskranker Kinder", amount: 4000.0 },
    { year: 2021, recipient: "Kinderkrebshilfe Münster", amount: 4500.0 },
    { year: 2020, recipient: "Datteln Elterninitiative krebskranker Kinder", amount: 5600.0 },
    { year: 2019, recipient: "Datteln Elterninitiative krebskranker Kinder", amount: 5500.0 },
    { year: 2018, recipient: "Kinderkrebshilfe Münster", amount: 5000.0 },
    { year: 2017, recipient: "Kinder u. Jugendliche-Krebsberatung-Münster", amount: 5000.0 },
    { year: 2016, recipient: "Datteln Elterninitiative krebskranker Kinder", amount: 7000.0 },
    { year: 2015, recipient: "Datteln Elterninitiative krebskranker Kinder", amount: 5600.0 },
    { year: 2014, recipient: "Datteln Elterninitiative krebskranker Kinder", amount: 5555.0 },
    { year: 2013, recipient: "Datteln Elterninitiative krebskranker Kinder", amount: 2000.0 },
    { year: 2013, recipient: "Tour der Hoffnung", amount: 3000.0 },
    { year: 2012, recipient: "Tour der Hoffnung", amount: 4000.0 },
    { year: 2011, recipient: "Tour der Hoffnung", amount: 4000.0 },
    { year: 2010, recipient: "Tour der Hoffnung", amount: 3000.0 },
    { year: 2009, recipient: "Tour der Hoffnung", amount: 2500.0 },
    { year: 2008, recipient: "Tour der Hoffnung", amount: 1700.0 },
    { year: 2007, recipient: "Tour der Hoffnung", amount: 1300.0 },
    { year: 2006, recipient: "Tour der Hoffnung", amount: 1200.0 },
    { year: 2005, recipient: "Tour der Hoffnung", amount: 500.0 },
    { year: 2004, recipient: "Tour der Hoffnung", amount: 100.0 },
  ];

  const totalDonations = donations.reduce((sum, donation) => sum + donation.amount, 0);
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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-24">Jahr</TableHead>
                    <TableHead className="min-w-[300px]">Organisation</TableHead>
                    <TableHead className="text-right w-32">Betrag</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tableData.map((donation, index) => (
                    <TableRow key={`${donation.year}-${index}`}>
                      <TableCell className="font-medium">{donation.year}</TableCell>
                      <TableCell>{donation.recipient}</TableCell>
                      <TableCell className="text-right">
                        {donation.amount.toLocaleString("de-DE", { style: "currency", currency: "EUR" })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Spenden;
