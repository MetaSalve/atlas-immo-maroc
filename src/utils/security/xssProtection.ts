
/**
 * Protection contre les attaques XSS (Cross-Site Scripting)
 * Contient des fonctions pour détecter et prévenir les attaques XSS
 */

import { toast } from 'sonner';

/**
 * Analyse et détecte les attaques potentielles par XSS
 * @param input Le texte à analyser
 * @returns true si une attaque potentielle est détectée
 */
export const detectXSS = (input: string): boolean => {
  if (!input) return false;
  
  // Motifs dangereux à rechercher
  const dangerousPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /data:text\/html/gi
  ];
  
  return dangerousPatterns.some(pattern => pattern.test(input));
};

/**
 * Sanitise une entrée utilisateur pour éviter les attaques XSS
 * @param input Le texte à nettoyer
 * @returns Le texte nettoyé
 */
export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  
  // Remplacer les caractères spéciaux par leurs entités HTML
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

/**
 * Détecte les injections SQL potentielles
 * @param input Le texte à analyser
 * @returns true si une injection potentielle est détectée
 */
export const detectSQLInjection = (input: string): boolean => {
  if (!input) return false;
  
  const sqlPatterns = [
    /\b(SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|UNION)\b/i,
    /--/g,
    /;/g,
    /\/\*/g,
    /\*\//g,
    /''/g,
    /""/g
  ];
  
  return sqlPatterns.some(pattern => pattern.test(input));
};

/**
 * Vérifie si une URL est sûre (non dangereuse)
 * @param url L'URL à vérifier
 * @returns true si l'URL est sûre
 */
export const isSafeURL = (url: string): boolean => {
  if (!url) return false;
  
  try {
    const parsedURL = new URL(url);
    
    // Vérifier le protocole (uniquement http et https)
    if (parsedURL.protocol !== 'http:' && parsedURL.protocol !== 'https:') {
      return false;
    }
    
    // Vérifier si l'URL contient des scripts
    if (detectXSS(url)) {
      return false;
    }
    
    return true;
  } catch (error) {
    return false;
  }
};
