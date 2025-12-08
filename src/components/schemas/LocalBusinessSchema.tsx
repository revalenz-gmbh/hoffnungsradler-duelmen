import SchemaScript from '../SchemaScript';

const LocalBusinessSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": ["SportsActivityLocation", "NGO"],
    "name": "Hoffnungsradler Dülmen e.V.",
    "image": "https://www.hoffnungs-radler-duelmen.de/og-image.png",
    "url": "https://www.hoffnungs-radler-duelmen.de",
    "telephone": "",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "",
      "addressLocality": "Dülmen",
      "postalCode": "48249",
      "addressRegion": "NRW",
      "addressCountry": "DE"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 51.8313,
      "longitude": 7.2803
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Sunday"
      ],
      "opens": "10:00",
      "closes": "18:00",
      "description": "Touren finden hauptsächlich sonntags statt"
    },
    "priceRange": "Kostenlos (Spenden erwünscht)",
    "description": "Die Hoffnungsradler Dülmen e.V. organisieren Rennradtouren im Münsterland und sammeln Spenden für krebskranke Kinder. Über 90.000 Euro wurden bereits gesammelt.",
    "hasMap": "https://www.google.com/maps/place/Dülmen",
    "keywords": "Rennrad, Charity, Spenden, krebskranke Kinder, Münsterland, Dülmen, Radtouren"
  };

  return <SchemaScript schema={schema} />;
};

export default LocalBusinessSchema;

