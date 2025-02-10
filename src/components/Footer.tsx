
import { Mail, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-prussian text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Bank Account Details */}
          <div className="space-y-2">
            <h3 className="font-anton text-xl mb-4">Spendenkonto</h3>
            <p className="font-inter">Sparkasse Westmünsterland</p>
            <p className="font-inter">Hoffnungsradler Dülmen</p>
            <p className="font-inter">
              <span className="text-white/80">IBAN:</span>
              <br />
              DE76 4015 4530 0035 6376 51
            </p>
            <p className="font-inter">
              <span className="text-white/80">BIC:</span>
              <br />
              WELADE3WXXX
            </p>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-anton text-xl mb-4">Kontakt</h3>
            <div className="space-y-2">
              <a
                href="mailto:info@hoffnungsradler.de"
                className="flex items-center gap-2 hover:text-white/80 transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>info@hoffnungsradler.de</span>
              </a>
              <a
                href="https://youtube.com/@hoffnungsradler"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-white/80 transition-colors"
              >
                <Youtube className="w-4 h-4" />
                <span>YouTube</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-anton text-xl mb-4">Links</h3>
            <div className="space-y-2 font-inter">
              <Link to="/spenden" className="block hover:text-white/80 transition-colors">
                Spenden
              </Link>
              <Link to="/presse" className="block hover:text-white/80 transition-colors">
                Presse
              </Link>
              <Link to="/sponsoren" className="block hover:text-white/80 transition-colors">
                Sponsoren
              </Link>
              <Link to="/impressum" className="block hover:text-white/80 transition-colors">
                Impressum
              </Link>
              <Link to="/datenschutz" className="block hover:text-white/80 transition-colors">
                Datenschutz
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-white/10 text-center text-sm text-white/80">
          <p>&copy; 2025 Hoffnungsradler Dülmen e.V.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
