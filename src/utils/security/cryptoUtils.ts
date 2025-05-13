
/**
 * Utilitaires cryptographiques pour l'application
 */

/**
 * Génère un identifiant unique aléatoire sécurisé
 * @returns Un identifiant unique
 */
export const generateSecureId = (): string => {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  
  return Array.from(array)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};
