import React, { useState, useEffect } from 'react';
import { OptimizedImage } from './OptimizedImage';
import { useCacheContext } from '@/providers/CacheProvider';

type ImageProps = Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'width' | 'height'> & {
  fallbackSrc?: string;
  loading?: 'lazy' | 'eager';
  lowQualitySrc?: string;
  highResThreshold?: number;
  width?: number;
  height?: number;
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

  useEffect(() => {
    if (!lowQualitySrc) {
      setShouldLoadHighRes(true);
      return;
    }

    if (connectionType === '4g' || connectionType === 'wifi') {
      setShouldLoadHighRes(true);
      return;
    }

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
      width={props.width}
      height={props.height}
      {...props}
    />
  );
};
