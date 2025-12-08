import SchemaScript from '../SchemaScript';

interface ArticleSchemaProps {
  headline: string;
  description?: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
  image?: string;
  url: string;
}

const ArticleSchema = ({
  headline,
  description,
  datePublished,
  dateModified,
  author = "Hoffnungsradler Dülmen e.V.",
  image = "https://www.hoffnungs-radler-duelmen.de/og-image.png",
  url
}: ArticleSchemaProps) => {
  // Konvertiere deutsches Datum zu ISO (TT. Monat JJJJ)
  const parseGermanDate = (dateStr: string): string => {
    const monthMap: { [key: string]: string } = {
      'Januar': '01', 'Februar': '02', 'März': '03', 'April': '04',
      'Mai': '05', 'Juni': '06', 'Juli': '07', 'August': '08',
      'September': '09', 'Oktober': '10', 'November': '11', 'Dezember': '12'
    };
    
    const parts = dateStr.match(/(\d+)\.\s*(\w+)\s*(\d{4})/);
    if (parts) {
      const day = parts[1].padStart(2, '0');
      const month = monthMap[parts[2]] || '01';
      const year = parts[3];
      return `${year}-${month}-${day}`;
    }
    return new Date().toISOString().split('T')[0];
  };

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": headline,
    "description": description || headline,
    "image": image,
    "datePublished": parseGermanDate(datePublished),
    "dateModified": dateModified ? parseGermanDate(dateModified) : parseGermanDate(datePublished),
    "author": {
      "@type": "Organization",
      "name": author
    },
    "publisher": {
      "@type": "Organization",
      "name": "Hoffnungsradler Dülmen e.V.",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.hoffnungs-radler-duelmen.de/og-image.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    }
  };

  return <SchemaScript schema={schema} />;
};

export default ArticleSchema;

