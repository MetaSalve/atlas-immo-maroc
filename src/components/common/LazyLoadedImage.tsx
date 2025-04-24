
import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface LazyLoadedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  blurHash?: string;
}

export const LazyLoadedImage = ({ src, alt, className, blurHash, ...props }: LazyLoadedImageProps) => {
  const [isLoaded, setIsLoaded] = React.useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isLoaded ? 1 : 0 }}
      transition={{ duration: 0.3 }}
      className="relative w-full h-full"
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        className={cn(
          "transition-opacity duration-300",
          isLoaded ? "opacity-100" : "opacity-0",
          className
        )}
        {...props}
      />
    </motion.div>
  );
};
