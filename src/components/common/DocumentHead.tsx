import React from 'react';

interface DocumentHeadProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  jsonLd?: Record<string, any>;
}

export const DocumentHead = ({
  title = 'AlertImmo - Alertes immobilières au Maroc',
  description = 'Trouvez votre bien immobilier idéal au Maroc grâce à nos alertes personnalisées en temps réel. Appartements, maisons, villas et riads.',
  image = '/lovable-uploads/ba556c6a-9c08-49fd-8bec-9255f57322dc.png',
  url,
  type = 'website',
  jsonLd
}: DocumentHeadProps) => {
  const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const siteName = 'AlertImmo';

  React.useEffect(() => {
    // Set document title
    document.title = title;

    // Set meta description
    const descriptionMeta = document.querySelector('meta[name="description"]') || 
      document.createElement('meta');
    descriptionMeta.setAttribute('name', 'description');
    descriptionMeta.setAttribute('content', description);
    if (!document.querySelector('meta[name="description"]')) {
      document.head.appendChild(descriptionMeta);
    }

    // Set Open Graph meta tags
    const ogMetas = [
      { property: 'og:type', content: type },
      { property: 'og:url', content: currentUrl },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:image', content: image },
      { property: 'og:site_name', content: siteName },
      { property: 'og:locale', content: 'fr_FR' }
    ];

    ogMetas.forEach(({ property, content }) => {
      if (content) {
        const meta = document.querySelector(`meta[property="${property}"]`) || 
          document.createElement('meta');
        meta.setAttribute('property', property);
        meta.setAttribute('content', content);
        if (!document.querySelector(`meta[property="${property}"]`)) {
          document.head.appendChild(meta);
        }
      }
    });

    // Set Twitter meta tags
    const twitterMetas = [
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: image }
    ];

    twitterMetas.forEach(({ name, content }) => {
      if (content) {
        const meta = document.querySelector(`meta[name="${name}"]`) || 
          document.createElement('meta');
        meta.setAttribute('name', name);
        meta.setAttribute('content', content);
        if (!document.querySelector(`meta[name="${name}"]`)) {
          document.head.appendChild(meta);
        }
      }
    });

    // Set canonical link
    if (currentUrl) {
      const canonical = document.querySelector('link[rel="canonical"]') || 
        document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      canonical.setAttribute('href', currentUrl);
      if (!document.querySelector('link[rel="canonical"]')) {
        document.head.appendChild(canonical);
      }
    }

    // Set robots meta
    const robotsMeta = document.querySelector('meta[name="robots"]') || 
      document.createElement('meta');
    robotsMeta.setAttribute('name', 'robots');
    robotsMeta.setAttribute('content', 'index, follow');
    if (!document.querySelector('meta[name="robots"]')) {
      document.head.appendChild(robotsMeta);
    }

    // Set author meta
    const authorMeta = document.querySelector('meta[name="author"]') || 
      document.createElement('meta');
    authorMeta.setAttribute('name', 'author');
    authorMeta.setAttribute('content', 'AlertImmo');
    if (!document.querySelector('meta[name="author"]')) {
      document.head.appendChild(authorMeta);
    }

    // Set JSON-LD structured data
    if (jsonLd) {
      const existingScript = document.querySelector('script[type="application/ld+json"]');
      if (existingScript) {
        existingScript.remove();
      }
      
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }
  }, [title, description, image, currentUrl, type, jsonLd, siteName]);

  return null;
};

// Helper pour créer des données structurées schema.org pour les biens immobiliers
export const createPropertySchema = (property: any) => {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "name": property.title,
    "description": property.description,
    "url": typeof window !== 'undefined' ? window.location.href : '',
    "datePosted": property.created_at,
    "image": property.images && property.images.length > 0 ? property.images[0] : null,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": property.city,
      "addressRegion": property.district,
      "streetAddress": property.address
    },
    "price": `${property.price} ${property.price_unit}`,
    "numberOfRooms": property.bedrooms,
    "floorSize": {
      "@type": "QuantitativeValue",
      "value": property.area,
      "unitCode": "MTK",
      "unitText": "m²"
    },
    "offer": {
      "@type": "Offer",
      "price": property.price,
      "priceCurrency": property.price_unit === "MAD" ? "MAD" : "EUR",
      "availability": "https://schema.org/InStock"
    }
  };
};