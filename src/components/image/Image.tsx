
import React, { useState, useEffect } from 'react';
import { OptimizedImage } from './OptimizedImage';
import { useCacheContext } from '@/providers/CacheProvider';

type ImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  fallbackSrc?: string;
  loading?: 'lazy' | 'eager';
  lowQualitySrc?: string;
  highResThreshold?: number;
};

export const Image: React.FC<ImageProps> = ({ 
  src, 
  alt, 
  className, 
  fallbackSrc = '/placeholder.svg', 
  loading = 'lazy',
  lowQualitySrc,
  highResThreshold = 768,
  ...props 
}) => {
  const [imageError, setImageError] = useState(false);
  const [shouldLoadHighRes, setShouldLoadHighRes] = useState(false);
  const { connectionType } = useCacheContext();

  // Déterminer si on doit charger l'image haute résolution
  useEffect(() => {
    // Toujours charger l'image haute résolution si pas d'image basse qualité
    if (!lowQualitySrc) {
      setShouldLoadHighRes(true);
      return;
    }

    // Vérifier la connexion
    if (connectionType === '4g' || connectionType === 'wifi') {
      setShouldLoadHighRes(true);
      return;
    }

    // Vérifier la taille de l'écran
    const checkScreenSize = () => {
      setShouldLoadHighRes(window.innerWidth >= highResThreshold);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, [lowQualitySrc, connectionType, highResThreshold]);

  const imageSrc = shouldLoadHighRes ? src : (lowQualitySrc || src);

  if (!imageSrc || imageError) {
    return (
      <img 
        src={fallbackSrc} 
        alt="Image non disponible" 
        className={className}
        loading={loading}
        aria-hidden={!alt}
      />
    );
  }
  
  return (
    <OptimizedImage 
      src={imageSrc} 
      alt={alt || 'Image'} 
      className={className}
      loading={loading}
      onError={() => setImageError(true)}
      {...props}
    />
  );
};
