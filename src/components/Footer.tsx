
import { Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-prussian text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
          {/* Bank Account Details */}
          <div className="space-y-2">
            <h3 className="font-anton text-xl mb-4">Spendenkonto</h3>
            <p className="font-inter">Sparkasse Westmünsterland</p>
            <p className="font-inter">Hoffnungsradler Dülmen</p>
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
                href="mailto:info@hoffnungsradler.de"
                className="flex items-center gap-2 hover:text-white/80 transition-colors justify-center md:justify-start"
              >
                <Mail className="w-4 h-4" />
                <span>info@hoffnungsradler.de</span>
              </a>
              <a
                href="tel:+491234567890"
                className="flex items-center gap-2 hover:text-white/80 transition-colors justify-center md:justify-start"
              >
                <Phone className="w-4 h-4" />
                <span>+49 1234 567890</span>
              </a>
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <MapPin className="w-4 h-4" />
                <span>48249 Dülmen</span>
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-2">
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
            </div>
          </div>
        </div>

        {/* Copyright and Legal Links */}
        <div className="pt-8 border-t border-white/10 text-sm text-white/80">
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8">
            <p>&copy; 2025 Hoffnungsradler Dülmen e.V.</p>
            <div className="flex items-center gap-8">
              <Link to="/impressum" className="hover:text-white transition-colors">
                Impressum
              </Link>
              <Link to="/datenschutz" className="hover:text-white transition-colors">
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
