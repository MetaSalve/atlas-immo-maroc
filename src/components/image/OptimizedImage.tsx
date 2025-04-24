
import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { optimizeImage } from '@/utils/optimizationUtils';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  fallback?: string;
  aspectRatio?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  width?: number;
  quality?: number;
  priority?: boolean;
}

export const OptimizedImage = ({ 
  src, 
  alt, 
  className, 
  fallback = '/placeholder.svg',
  aspectRatio = 'aspect-video',
  objectFit = 'cover',
  width = 800,
  quality = 80,
  priority = false,
  ...props 
}: OptimizedImageProps) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const optimizedSrc = optimizeImage(src, { width, quality, format: 'webp' });
    setImgSrc(optimizedSrc);
    setIsLoading(true);
  }, [src, width, quality]);

  useEffect(() => {
    if (priority) {
      setIsVisible(true);
      return;
    }
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (imgRef.current) {
              observer.unobserve(imgRef.current);
            }
          }
        });
      },
      { threshold: 0.1, rootMargin: '200px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [priority]);

  return (
    <div className={cn(
      "relative overflow-hidden",
      aspectRatio,
      isLoading && "animate-pulse bg-muted"
    )}>
      {(isVisible || props.loading === 'eager' || priority) && (
        <img
          ref={imgRef}
          src={imgSrc}
          alt={alt}
          className={cn(
            "transition-opacity duration-300 w-full h-full",
            `object-${objectFit}`,
            isLoading ? "opacity-0" : "opacity-100",
            className
          )}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setImgSrc(fallback);
            setIsLoading(false);
          }}
          loading={priority ? "eager" : "lazy"}
          decoding={priority ? "sync" : "async"}
          width={width}
          {...props}
        />
      )}
    </div>
  );
};
