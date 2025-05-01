
import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    
    // Définir l'état initial
    setMatches(media.matches);
    
    // Mettre à jour l'état quand le media query change
    const listener = (event: MediaQueryListEvent) => setMatches(event.matches);
    media.addEventListener('change', listener);
    
    // Nettoyer l'event listener
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}
