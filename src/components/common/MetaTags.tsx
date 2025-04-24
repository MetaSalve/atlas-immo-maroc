
import { Helmet } from 'react-helmet-async';

interface MetaTagsProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

export const MetaTags = ({
  title = 'AlertImmo - Alertes immobilières au Maroc',
  description = 'Trouvez votre bien immobilier idéal au Maroc grâce à nos alertes personnalisées en temps réel. Appartements, maisons, villas et riads.',
  image = '/lovable-uploads/ba556c6a-9c08-49fd-8bec-9255f57322dc.png',
  url = window.location.href
}: MetaTagsProps) => {
  const siteName = 'AlertImmo';
  
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={url} />
    </Helmet>
  );
};
