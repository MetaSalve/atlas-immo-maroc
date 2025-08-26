
import { Helmet } from 'react-helmet-async';

interface MetaTagsProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  jsonLd?: Record<string, any>;
}

export const MetaTags = ({
  title = 'AlertImmo - Alertes immobilières au Maroc',
  description = 'Trouvez votre bien immobilier idéal au Maroc grâce à nos alertes personnalisées en temps réel. Appartements, maisons, villas et riads.',
  image = '/lovable-uploads/ba556c6a-9c08-49fd-8bec-9255f57322dc.png',
  url = window.location.href,
  type = 'website',
  jsonLd
}: MetaTagsProps) => {
  const siteName = 'AlertImmo';
  
  return (
      <Helmet>
        {/* Balises de base */}
        <title>{title}</title>
        <meta name="description" content={description} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content={type} />
        <meta property="og:url" content={url} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image} />
        <meta property="og:site_name" content={siteName} />
        <meta property="og:locale" content="fr_FR" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />

        {/* Balises supplémentaires pour le SEO */}
        <meta name="robots" content="index, follow" />
        <meta name="author" content="AlertImmo" />
        <link rel="canonical" href={url} />

        {/* Schema.org JSON-LD structured data */}
        {jsonLd && (
          <script type="application/ld+json">
            {JSON.stringify(jsonLd)}
          </script>
        )}
      </Helmet>
  );
};

// Helper pour créer des données structurées schema.org pour les biens immobiliers
export const createPropertySchema = (property: any) => {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "name": property.title,
    "description": property.description,
    "url": window.location.href,
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
