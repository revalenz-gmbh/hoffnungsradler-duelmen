import { useState } from "react";
import { Menu, X, Bike } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { name: "Wir über uns", path: "/ueber-uns" },
    { name: "Tour Termine", path: "/tour-termine" },
    { name: "Unsere Touren", path: "#unsere-touren" },
    { name: "Presse", path: "#presse" },
    { name: "Sponsoren", path: "#sponsoren" },
    { name: "Spenden", path: "#spenden" },
    { name: "Fotogalerie", path: "#fotogalerie" },
  ];

  return (
    <header className="fixed top-0 w-full z-50 bg-snow/80 backdrop-blur-lg shadow-sm">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-20">
          <Link
            to="/"
            className="font-anton text-2xl text-forestDark flex items-center gap-2"
          >
            <Bike className="w-6 h-6" />
            Hoffnungsradler
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="font-inter text-text hover:text-prussian transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-text"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 w-full bg-snow/95 backdrop-blur-lg border-t border-gray-200 animate-fade-in">
            <div className="container px-4 py-4">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="block py-3 font-inter text-text hover:text-prussian transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
