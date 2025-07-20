import { Mail, Phone, AtSign } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-forestDark text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1.5fr_1fr_2.5fr] gap-12 mb-8">
          {/* Bank Account Details */}
          <div className="space-y-2">
            <h3 className="font-anton text-xl mb-4">Spendenkonto</h3>
            <p className="font-inter">Sparkasse Westmünsterland</p>
            <p className="font-inter">Hoffnungsradler Dülmen e.V.</p>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-white/80">IBAN:</span>
                <span>DE76 4015 4530 0035 6376 51</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white/80">BIC:</span>
                <span>WELADE3WXXX</span>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-2">
            <h3 className="font-anton text-xl mb-4">Kontakt</h3>
            <div className="space-y-2 font-inter">
              <a
                href="mailto:hoffnungsradlerinfo@gmail.com"
                className="flex items-center gap-2 hover:text-white/80 transition-colors justify-center md:justify-start"
              >
                <AtSign className="w-4 h-4" />
                <span className="whitespace-nowrap">hoffnungsradlerinfo@gmail.com</span>
              </a>
              <a
                href="tel:+4916090615995"
                className="flex items-center gap-2 hover:text-white/80 transition-colors justify-center md:justify-start"
              >
                <Phone className="w-4 h-4" />
                <span>02594 8933840</span>
              </a>
              <div className="flex items-start gap-2 justify-center md:justify-start">
                <Mail className="w-4 h-4 shrink-0 mt-1" />
                <div className="flex flex-col">
                  <span>Königsberger Str. 26</span>
                  <span className="ml-0">48249 Dülmen</span>
                </div>
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-2">
            <h3 className="font-anton text-xl mb-4">Links</h3>
            <div className="space-y-2 font-inter">
              <Link
                to="/spenden"
                className="block hover:text-white/80 transition-colors"
              >
                Spenden
              </Link>
              <Link
                to="/presse"
                className="block hover:text-white/80 transition-colors"
              >
                Presse
              </Link>
              <Link
                to="/medienhinweis"
                className="block hover:text-white/80 transition-colors"
              >
                Medienhinweis
              </Link>
              <Link
                to="/sponsoren"
                className="block hover:text-white/80 transition-colors"
              >
                Sponsoren
              </Link>
              <a
                href="https://drive.google.com/file/d/1rkeDCSUrRD-NJmy1vq8eA3h7HheCJtH6/view?usp=drive_link"
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:text-white/80 transition-colors"
              >
                Satzung
              </a>
              <a
                href="https://drive.google.com/file/d/1w0MqMYgxws6AAFtrKjx9T9Dwx86CJSpz/view?usp=drive_link"
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:text-white/80 transition-colors"
              >
                Beitrittserklärung
              </a>
            </div>
          </div>

          {/* Radsportfreunde */}
          <div className="space-y-2">
            <h3 className="font-anton text-xl mb-4">Radsportfreunde</h3>
            <div className="flex flex-row items-center justify-center md:justify-start gap-12">
              <a
                href="https://djk-radsport.de/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
              >
                <img
                  src="/logos/b0799038-8c76-42b1-b74b-96c4ea20285e.png"
                  alt="DJK Logo"
                  className="h-28 w-auto"
                />
              </a>
              <a
                href="https://www.djk-adler-buldern.de/radsport/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
              >
                <img
                  src="/logos/a05f6440-d361-4236-ace4-32d06e932465.png"
                  alt="DJK Adler Buldern Logo"
                  className="h-28 w-28 object-cover rounded-full bg-white"
                />
              </a>
              <a
                href="https://www.djk-roedder.de/abteilungen/radsport/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
              >
                <img
                  src="/logos/DJK-Rödder.avif"
                  alt="DJK Rödder Logo"
                  className="h-28 w-auto"
                />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright and Legal Links */}
        <div className="pt-8 border-t border-white/10 text-sm text-white/80">
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8">
            <div className="flex items-center gap-8">
              <p>&copy; 2025 Hoffnungsradler Dülmen e.V.</p>
              <span className="hidden md:inline-block text-white/40">|</span>
              <Link
                to="/impressum"
                className="hover:text-white transition-colors"
              >
                Impressum
              </Link>
              <span className="hidden md:inline-block text-white/40">|</span>
              <Link
                to="/datenschutz"
                className="hover:text-white transition-colors"
              >
                Datenschutz
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
