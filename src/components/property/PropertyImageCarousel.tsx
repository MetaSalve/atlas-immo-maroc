
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Image } from '@/components/image/Image';

interface PropertyImageCarouselProps {
  images: string[];
  title: string;
  onOpen?: () => void;
}

export const PropertyImageCarousel = ({
  images,
  title,
  onOpen
}: PropertyImageCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageError, setImageError] = useState<Record<number, boolean>>({});
  
  const fallbackImage = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MzR8fHJlYWwlMjBlc3RhdGV8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60';
  
  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };
  
  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };
  
  const handleImageError = (index: number) => {
    setImageError((prev) => ({ ...prev, [index]: true }));
  };
  
  return (
    <div className="relative rounded-xl overflow-hidden" aria-label={`Images de ${title}`}>
      <div className="aspect-[16/9] overflow-hidden">
        <Image
          src={imageError[currentIndex] ? fallbackImage : images[currentIndex]}
          alt={`${title} - Image ${currentIndex + 1}`}
          className="w-full h-full object-cover animate-fade-in"
          onError={() => handleImageError(currentIndex)}
          loading="eager"
        />
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" aria-hidden="true" />
      
      {onOpen && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm hover:bg-background/60"
          onClick={onOpen}
          aria-label="Voir en plein écran"
        >
          <Maximize className="h-4 w-4" />
        </Button>
      )}
      
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-1/2 left-3 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background/60"
        onClick={handlePrevious}
        aria-label="Image précédente"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-1/2 right-3 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background/60"
        onClick={handleNext}
        aria-label="Image suivante"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
      
      <div 
        className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5" 
        role="tablist" 
        aria-label="Navigation des images"
      >
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? 'bg-primary' : 'bg-background/80'
            }`}
            onClick={() => setCurrentIndex(index)}
            role="tab"
            aria-selected={index === currentIndex}
            aria-controls={`image-${index}`}
            aria-label={`Image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
