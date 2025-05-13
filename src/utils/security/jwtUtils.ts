
/**
 * Utilitaires pour la gestion des tokens JWT
 */

/**
 * Vérifie si un token JWT est valide et non expiré
 * @param token Le token JWT à vérifier
 * @returns true si le token est valide
 */
export const isValidJWT = (token: string): boolean => {
  if (!token) return false;
  
  try {
    // Vérifier la structure du token (3 parties séparées par des points)
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    // Décoder le payload (2ème partie)
    const payload = JSON.parse(atob(parts[1]));
    
    // Vérifier l'expiration
    const currentTime = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < currentTime) return false;
    
    return true;
  } catch (error) {
    console.error('Erreur lors de la validation du JWT:', error);
    return false;
  }
};

/**
 * Vérifie si l'origine de la requête est autorisée
 * @param origin L'origine de la requête
 * @param allowedOrigins Les origines autorisées
 * @returns true si l'origine est autorisée
 */
export const isAllowedOrigin = (
  origin: string,
  allowedOrigins: string[] = [window.location.origin]
): boolean => {
  return allowedOrigins.includes(origin);
};
