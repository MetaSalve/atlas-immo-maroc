
import React from 'react';
import { OptimizedImage } from './OptimizedImage';

type ImageProps = React.ImgHTMLAttributes<HTMLImageElement>;

export const Image: React.FC<ImageProps> = ({ src, alt, className, ...props }) => {
  if (!src) {
    return null;
  }
  
  return (
    <OptimizedImage 
      src={src} 
      alt={alt || ''} 
      className={className}
      fallback="/placeholder.svg"
      {...props}
    />
  );
};
