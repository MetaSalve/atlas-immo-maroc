
import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  fallback?: string;
  aspectRatio?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
}

export const OptimizedImage = ({ 
  src, 
  alt, 
  className, 
  fallback = '/placeholder.svg',
  aspectRatio = 'aspect-video',
  objectFit = 'cover',
  ...props 
}: OptimizedImageProps) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setImgSrc(src);
    setIsLoading(true);
  }, [src]);

  useEffect(() => {
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
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, []);

  // Support du format WebP si disponible
  const getOptimizedSrc = (originalSrc: string) => {
    // Si l'utilisateur a déjà une URL optimisée (ex: Cloudinary, Imgix...)
    if (originalSrc.includes('format=webp') || originalSrc.includes('f=webp')) {
      return originalSrc;
    }

    // Si c'est une URL externe sans service d'optimisation
    return originalSrc;
  };

  return (
    <div className={cn(
      "relative overflow-hidden",
      aspectRatio,
      isLoading && "animate-pulse bg-muted"
    )}>
      {(isVisible || props.loading === 'eager') && (
        <img
          ref={imgRef}
          src={getOptimizedSrc(imgSrc)}
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
          loading={props.loading || "lazy"}
          decoding="async"
          {...props}
        />
      )}
    </div>
  );
};
