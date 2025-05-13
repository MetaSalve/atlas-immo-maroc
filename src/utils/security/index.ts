
/**
 * Point d'entrée principal pour les utilitaires de sécurité
 * Exporte toutes les fonctions de sécurité depuis un seul fichier
 */

// Importation et ré-exportation des sous-modules
export * from './xssProtection';
export * from './passwordSecurity';
export * from './jwtUtils';
export * from './activityMonitoring';
export * from './securityChecks';
export * from './securityHeaders';
export * from './cryptoUtils';

// Fonction principale pour effectuer toutes les vérifications de sécurité
import {
  checkHttpsConfiguration,
  checkFrameProtection,
  detectXSSVulnerabilities,
  detectCSRFAttempts
} from './securityChecks';

import { configureSecurityHeaders } from './securityHeaders';

/**
 * Effectue un ensemble complet de vérifications de sécurité
 */
export const runSecurityChecks = () => {
  try {
    configureSecurityHeaders();
    checkHttpsConfiguration();
    checkFrameProtection();
    detectXSSVulnerabilities();
    detectCSRFAttempts();
    
    console.info('Vérifications de sécurité terminées.');
  } catch (error) {
    console.error('Erreur lors des vérifications de sécurité:', error);
  }
};
