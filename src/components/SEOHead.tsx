import { useEffect } from 'react';

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

/**
 * React 19 kompatible SEO Head Komponente
 * Verwendet React 19's native document metadata support
 */
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
  useEffect(() => {
    // Update document title
    document.title = title;

    // Helper to update or create meta tag
    const updateMetaTag = (attr: string, value: string, content: string) => {
      let element = document.querySelector(`meta[${attr}="${value}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, value);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Update basic meta tags
    updateMetaTag('name', 'description', description);
    if (keywords) updateMetaTag('name', 'keywords', keywords);
    updateMetaTag('name', 'author', author);

    // Update Open Graph tags
    updateMetaTag('property', 'og:title', title);
    updateMetaTag('property', 'og:description', description);
    updateMetaTag('property', 'og:url', url);
    updateMetaTag('property', 'og:image', image);
    updateMetaTag('property', 'og:type', type);

    // Update Twitter Card tags
    updateMetaTag('name', 'twitter:card', 'summary_large_image');
    updateMetaTag('name', 'twitter:title', title);
    updateMetaTag('name', 'twitter:description', description);
    updateMetaTag('name', 'twitter:image', image);

    // Update article specific tags
    if (publishedTime) {
      updateMetaTag('property', 'article:published_time', publishedTime);
    }
    if (modifiedTime) {
      updateMetaTag('property', 'article:modified_time', modifiedTime);
    }

    // Update canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = url;
  }, [title, description, url, image, type, keywords, author, publishedTime, modifiedTime]);

  return null;
};

export default SEOHead;

