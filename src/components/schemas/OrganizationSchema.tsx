import SchemaScript from '../SchemaScript';

const OrganizationSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Hoffnungsradler Dülmen e.V.",
    "alternateName": "Hoffnungsradler Dülmen",
    "url": "https://www.hoffnungs-radler-duelmen.de",
    "logo": "https://www.hoffnungs-radler-duelmen.de/og-image.png",
    "description": "Gemeinnütziger Verein aus Dülmen, der durch Rennradtouren Spenden für krebskranke Kinder sammelt. Seit über 20 Jahren aktiv im Münsterland.",
    "foundingDate": "2003",
    "nonprofitStatus": "Nonprofit501c3",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Dülmen",
      "addressRegion": "Nordrhein-Westfalen",
      "addressCountry": "DE"
    },
    "areaServed": {
      "@type": "Place",
      "name": "Münsterland, Nordrhein-Westfalen"
    },
    "sameAs": [
      "https://www.hoffnungs-radler-duelmen.de"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "General Inquiries",
      "availableLanguage": "German"
    }
  };

  return <SchemaScript schema={schema} />;
};

export default OrganizationSchema;

