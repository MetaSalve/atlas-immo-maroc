
import React, { useState } from 'react';
import { OptimizedImage } from './OptimizedImage';

type ImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  fallbackSrc?: string;
  loading?: 'lazy' | 'eager';
};

export const Image: React.FC<ImageProps> = ({ 
  src, 
  alt, 
  className, 
  fallbackSrc = '/placeholder.svg', 
  loading = 'lazy',
  ...props 
}) => {
  const [imageError, setImageError] = useState(false);

  if (!src || imageError) {
    return (
      <img 
        src={fallbackSrc} 
        alt="Image non disponible" 
        className={className}
        loading={loading}
      />
    );
  }
  
  return (
    <OptimizedImage 
      src={src} 
      alt={alt || 'Image'} 
      className={className}
      loading={loading}
      onError={() => setImageError(true)}
      {...props}
    />
  );
};
