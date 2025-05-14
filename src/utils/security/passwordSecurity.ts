
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

  // Vérifier si le mot de passe est couramment utilisé
  if (isCommonPassword(password)) {
    feedback.push('Ce mot de passe est trop commun et facilement devinable');
    // Réduire le score pour les mots de passe courants
    score = Math.max(0, score - 2);
  }
  
  return {
    score,
    isStrong: score >= 4,
    feedback
  };
};

/**
 * Vérifie si un mot de passe est dans la liste des mots de passe courants
 * @param password Le mot de passe à vérifier
 * @returns True si le mot de passe est courant, sinon false
 */
export const isCommonPassword = (password: string): boolean => {
  // Liste des mots de passe les plus courants
  const commonPasswords = [
    'password', '123456', '123456789', '12345678', 'qwerty', 
    'abc123', '111111', '123123', 'admin', 'welcome', 
    'password1', '1234567', '12345', '1234567890', 'azerty',
    'sunshine', 'iloveyou', 'princess', 'dragon', 'monkey',
    'letmein', 'football', 'baseball', 'superman', 'password123',
    'qwertyuiop', 'zxcvbnm', 'trustno1', 'welcome1', 'admin123'
  ];
  
  // Convertir en minuscule pour la comparaison
  const lowercasePassword = password.toLowerCase();
  
  return commonPasswords.includes(lowercasePassword);
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

/**
 * Vérifie si un mot de passe a été compromis
 * Cette version utilise uniquement une vérification locale
 * @param password Le mot de passe à vérifier
 * @returns True si le mot de passe a été compromis, sinon false
 */
export const checkPasswordCompromised = async (password: string): Promise<boolean> => {
  try {
    // Nous utilisons seulement une vérification locale au lieu de HaveIBeenPwned
    // Vérification basée sur les mots de passe communs et une heuristique simple
    
    const hashedPassword = await hashString(password);
    
    // Vérifier si c'est un mot de passe commun
    if (isCommonPassword(password)) {
      return true;
    }
    
    // Vérifications supplémentaires de complexité
    const complexityCheck = checkPasswordStrength(password);
    
    // Si le score est trop faible, considérer comme compromis
    if (complexityCheck.score <= 2) {
      return true;
    }
    
    // Vérifier les répétitions et séquences
    if (/(.)\1{2,}/.test(password)) {  // 3 caractères répétés ou plus
      return true;
    }
    
    if (/^(123|abc|qwe|asd|zxc)/i.test(password)) {
      return true;
    }
    
    // Simuler une vérification de mot de passe compromis
    // En production, on pourrait avoir une base locale de hachages compromis
    return false;
  } catch (error) {
    console.error("Erreur lors de la vérification du mot de passe compromis:", error);
    return false;
  }
};
