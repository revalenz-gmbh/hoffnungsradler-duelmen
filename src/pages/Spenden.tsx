
import { ArrowLeft, PiggyBank } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Spenden = () => {
  const donations = [
    { year: 2024, recipient: "Datteln Elterninitiative krebskranker Kinder", amount: 7000.00 },
    { year: 2023, recipient: "Datteln Elterninitiative krebskranker Kinder", amount: 13000.00 },
    { year: 2022, recipient: "Datteln Elterninitiative krebskranker Kinder", amount: 4000.00 },
    { year: 2021, recipient: "Kinderkrebshilfe Münster E.V.", amount: 4500.00 },
    { year: 2020, recipient: "Datteln Elterninitiative krebskranker Kinder", amount: 5600.00 },
    { year: 2019, recipient: "Datteln Elterninitiative krebskranker Kinder", amount: 5500.00 },
    { year: 2018, recipient: "Kinderkrebshilfe Münster E.V.", amount: 5000.00 },
    { year: 2017, recipient: "Kinder u. Jugendliche-Krebsberatung-Münster", amount: 5000.00 },
    { year: 2016, recipient: "Datteln Elterninitiative krebskranker Kinder", amount: 7000.00 },
    { year: 2015, recipient: "Datteln Elterninitiative krebskranker Kinder", amount: 5600.00 },
    { year: 2014, recipient: "Datteln Elterninitiative krebskranker Kinder", amount: 5555.00 },
    { year: 2013, recipient: "Tour der Hoffnung", amount: 3000.00 },
    { year: 2013, recipient: "Datteln Elterninitiative krebskranker Kinder", amount: 2000.00 },
    { year: 2012, recipient: "Tour der Hoffnung", amount: 4000.00 },
    { year: 2011, recipient: "Tour der Hoffnung", amount: 4000.00 },
    { year: 2010, recipient: "Tour der Hoffnung", amount: 3000.00 },
    { year: 2009, recipient: "Tour der Hoffnung", amount: 2500.00 },
    { year: 2008, recipient: "Tour der Hoffnung", amount: 1700.00 },
    { year: 2007, recipient: "Tour der Hoffnung", amount: 1300.00 },
    { year: 2006, recipient: "Tour der Hoffnung", amount: 1200.00 },
    { year: 2005, recipient: "Tour der Hoffnung", amount: 500.00 },
    { year: 2004, recipient: "Tour der Hoffnung", amount: 100.00 },
  ];

  const totalDonations = donations.reduce((sum, donation) => sum + donation.amount, 0);

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
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-forest/10 text-forest mb-6">
                <PiggyBank className="w-8 h-8" />
              </div>
              <h1 className="font-anton text-4xl md:text-5xl text-prussian mb-4">
                Spenden
              </h1>
              <p className="text-text text-lg max-w-2xl text-center mb-8">
                Seit 2004 haben wir insgesamt {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(totalDonations)} an verschiedene Organisationen gespendet.
              </p>
            </div>

            {/* Donations Table */}
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
                  {donations.map((donation, index) => (
                    <TableRow key={`${donation.year}-${index}`}>
                      <TableCell className="font-medium">{donation.year}</TableCell>
                      <TableCell>{donation.recipient}</TableCell>
                      <TableCell className="text-right">
                        {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(donation.amount)}
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
