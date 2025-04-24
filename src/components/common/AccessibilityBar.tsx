
import React from 'react';
import { Button } from '../ui/button';
import { useAccessibility } from '@/providers/AccessibilityProvider';
import { Contrast, Type, Minus, Plus, RotateCcw } from 'lucide-react';

export const AccessibilityBar: React.FC = () => {
  const { 
    highContrast, 
    toggleHighContrast,
    increaseFontSize,
    decreaseFontSize,
    resetFontSize
  } = useAccessibility();
  
  return (
    <div className="fixed top-20 right-4 z-50 bg-background/90 backdrop-blur-sm border rounded-md shadow-md p-2" aria-label="Options d'accessibilité">
      <div className="flex flex-col gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleHighContrast}
          aria-pressed={highContrast}
          aria-label="Activer/désactiver le mode contraste élevé"
        >
          <Contrast className={highContrast ? "text-primary" : ""} />
        </Button>
        
        <div className="flex flex-col items-center gap-1" role="group" aria-label="Ajuster la taille du texte">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={increaseFontSize}
            aria-label="Augmenter la taille du texte"
          >
            <Plus className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={resetFontSize}
            aria-label="Réinitialiser la taille du texte"
          >
            <Type className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={decreaseFontSize}
            aria-label="Diminuer la taille du texte"
          >
            <Minus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
