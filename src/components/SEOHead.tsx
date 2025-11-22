import { Helmet } from 'react-helmet';

interface SEOHeadProps {
  title: string;
  description: string;
  url?: string;
  image?: string;
  type?: string;
  keywords?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

const SEOHead = ({
  title,
  description,
  url = 'https://www.hoffnungs-radler-duelmen.de',
  image = 'https://www.hoffnungs-radler-duelmen.de/og-image.png',
  type = 'website',
  keywords,
  author = 'Hoffnungsradler Dülmen e.V.',
  publishedTime,
  modifiedTime,
}: SEOHeadProps) => {
  const fullTitle = title.includes('Hoffnungsradler') 
    ? title 
    : `${title} | Hoffnungsradler Dülmen`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="author" content={author} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Hoffnungsradler Dülmen e.V." />
      <meta property="og:locale" content="de_DE" />
      
      {/* Article specific */}
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {type === 'article' && (
        <meta property="article:author" content={author} />
      )}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Additional SEO Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <meta name="language" content="de" />
    </Helmet>
  );
};

export default SEOHead;

