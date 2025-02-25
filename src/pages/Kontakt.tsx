import { ArrowLeft, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

const Kontakt = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mailtoLink = `mailto:hoffnungsradlerinfo@gmail.com?subject=${encodeURIComponent(
      formData.subject || "Kontaktanfrage"
    )}&body=${encodeURIComponent(
      `Name: ${formData.name}\nE-Mail: ${formData.email}\n\n${formData.message}`
    )}`;
    window.location.href = mailtoLink;
  };

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
          <div className="max-w-2xl mx-auto">
            {/* Title Section */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-forest/10 text-forest mb-6">
                <Mail className="w-8 h-8" />
              </div>
              <h1 className="font-anton text-4xl md:text-5xl text-prussian mb-4">
                Kontakt
              </h1>
              <p className="text-text text-lg">
                Haben Sie Fragen oder Anregungen? Schreiben Sie uns eine Nachricht!
              </p>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-lg p-8 shadow-lg border border-forest/10">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ihr Name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    E-Mail *
                  </label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="ihre@email.de"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Betreff
                  </label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Optional"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Nachricht *
                  </label>
                  <Textarea
                    id="message"
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Ihre Nachricht an uns"
                    className="min-h-[150px]"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-forest hover:bg-forest/90"
                >
                  Nachricht senden
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Kontakt; 