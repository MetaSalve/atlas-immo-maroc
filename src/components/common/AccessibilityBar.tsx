
import React from 'react';
import { Button } from '../ui/button';
import { useAccessibility } from '@/providers/AccessibilityProvider';
import { Contrast } from 'lucide-react';

export const AccessibilityBar: React.FC = () => {
  const { highContrast, toggleHighContrast } = useAccessibility();
  
  return (
    <div className="fixed bottom-4 right-4 z-50 bg-background/90 backdrop-blur-sm border rounded-md shadow-md p-2" aria-label="Options d'accessibilité">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={toggleHighContrast}
        aria-pressed={highContrast}
        aria-label="Activer/désactiver le mode contraste élevé"
      >
        <Contrast className={highContrast ? "text-primary" : ""} />
      </Button>
    </div>
  );
};
