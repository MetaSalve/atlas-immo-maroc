import React, { createContext, useContext, useState, useEffect } from 'react';

interface AccessibilityContextType {
  highContrast: boolean;
  toggleHighContrast: () => void;
  fontSize: number;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  resetFontSize: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [highContrast, setHighContrast] = useState(() => {
    const saved = localStorage.getItem('high-contrast');
    return saved ? JSON.parse(saved) : false;
  });
  
  const [fontSize, setFontSize] = useState(() => {
    const saved = localStorage.getItem('font-size');
    return saved ? JSON.parse(saved) : 16;
  });

  useEffect(() => {
    localStorage.setItem('high-contrast', JSON.stringify(highContrast));
    document.documentElement.classList.toggle('high-contrast', highContrast);
    
    document.documentElement.setAttribute('lang', 'fr');
    document.documentElement.setAttribute('dir', 'ltr');
  }, [highContrast]);

  useEffect(() => {
    localStorage.setItem('font-size', JSON.stringify(fontSize));
    document.documentElement.style.fontSize = `${fontSize}px`;
  }, [fontSize]);

  const toggleHighContrast = () => setHighContrast(prev => !prev);
  const increaseFontSize = () => setFontSize(prev => Math.min(prev + 1, 24));
  const decreaseFontSize = () => setFontSize(prev => Math.max(prev - 1, 12));
  const resetFontSize = () => setFontSize(16);

  return (
    <AccessibilityContext.Provider value={{
      highContrast,
      toggleHighContrast,
      fontSize,
      increaseFontSize,
      decreaseFontSize,
      resetFontSize
    }}>
      {children}
    </AccessibilityContext.Provider>
  );
};
