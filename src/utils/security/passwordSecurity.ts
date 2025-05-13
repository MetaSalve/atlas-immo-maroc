
/**
 * Sécurité des mots de passe
 * Fonctions pour valider et gérer les mots de passe
 */

/**
 * Vérifie si un mot de passe est suffisamment fort
 * @param password Le mot de passe à vérifier
 * @returns Un objet contenant la force du mot de passe et les messages d'erreur
 */
export const checkPasswordStrength = (password: string): { 
  score: number;
  isStrong: boolean;
  feedback: string[];
} => {
  const feedback: string[] = [];
  let score = 0;
  
  // Vérifier la longueur
  if (password.length < 8) {
    feedback.push('Le mot de passe doit contenir au moins 8 caractères');
  } else {
    score += 1;
  }
  
  // Vérifier la présence de chiffres
  if (!/\d/.test(password)) {
    feedback.push('Le mot de passe doit contenir au moins un chiffre');
  } else {
    score += 1;
  }
  
  // Vérifier la présence de lettres minuscules
  if (!/[a-z]/.test(password)) {
    feedback.push('Le mot de passe doit contenir au moins une lettre minuscule');
  } else {
    score += 1;
  }
  
  // Vérifier la présence de lettres majuscules
  if (!/[A-Z]/.test(password)) {
    feedback.push('Le mot de passe doit contenir au moins une lettre majuscule');
  } else {
    score += 1;
  }
  
  // Vérifier la présence de caractères spéciaux
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    feedback.push('Le mot de passe doit contenir au moins un caractère spécial');
  } else {
    score += 1;
  }
  
  return {
    score,
    isStrong: score >= 4,
    feedback
  };
};

/**
 * Hache une chaîne avec l'algorithme SHA-256
 * Utile pour anonymiser des données sensibles avant stockage
 * @param input La chaîne à hacher
 * @returns La chaîne hachée
 */
export const hashString = async (input: string): Promise<string> => {
  if (!input) return '';
  
  // Encoder en UTF-8
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  
  // Hacher avec SHA-256
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  
  // Convertir le tableau d'octets en chaîne hexadécimale
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};
