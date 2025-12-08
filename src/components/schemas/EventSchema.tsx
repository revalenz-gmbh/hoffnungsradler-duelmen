import SchemaScript from '../SchemaScript';

interface EventSchemaProps {
  name: string;
  startDate: string;
  startTime?: string;
  location: string;
  address?: string;
  description?: string;
  distance?: string;
  image?: string;
}

const EventSchema = ({
  name,
  startDate,
  startTime = "10:00",
  location,
  address,
  description,
  distance,
  image = "https://www.hoffnungs-radler-duelmen.de/og-image.png"
}: EventSchemaProps) => {
  // Konvertiere deutsches Datum (TT.MM.JJJJ) zu ISO-Format
  const parseGermanDate = (dateStr: string, time: string): string => {
    const [day, month, year] = dateStr.split('.');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${time}:00+02:00`;
  };

  const isoDate = parseGermanDate(startDate, startTime);
  
  const schema = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    "name": name,
    "description": description || `${name} - Rennradtour der Hoffnungsradler Dülmen${distance ? ` über ${distance}` : ''}`,
    "startDate": isoDate,
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "eventStatus": "https://schema.org/EventScheduled",
    "location": {
      "@type": "Place",
      "name": location,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": address || "",
        "addressLocality": "Dülmen",
        "addressRegion": "NRW",
        "addressCountry": "DE"
      }
    },
    "image": image,
    "organizer": {
      "@type": "Organization",
      "name": "Hoffnungsradler Dülmen e.V.",
      "url": "https://www.hoffnungs-radler-duelmen.de"
    },
    "isAccessibleForFree": true,
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "EUR",
      "availability": "https://schema.org/InStock",
      "url": "https://www.hoffnungs-radler-duelmen.de/tour-termine"
    },
    "sport": "Cycling",
    "keywords": "Rennrad, Charity, Radtour, Münsterland, Dülmen"
  };

  return <SchemaScript schema={schema} />;
};

export default EventSchema;

