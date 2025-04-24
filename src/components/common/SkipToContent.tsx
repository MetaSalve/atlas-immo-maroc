
import React from 'react';

export const SkipToContent = () => {
  return (
    <a 
      href="#main-content" 
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-primary text-primary-foreground px-4 py-2 rounded focus:outline-none"
    >
      Aller au contenu principal
    </a>
  );
};
