
/**
 * Utilitaires de sécurité pour l'application AlertImmo
 * Contient des fonctions pour renforcer la sécurité de l'application
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
 * Détecte les tentatives d'injection SQL
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

/**
 * Détecte les comportements suspects dans l'application
 * (tentatives multiples de connexion, activités anormales, etc.)
 * @param userId ID de l'utilisateur
 * @param action Action effectuée
 */
export const detectSuspiciousActivity = (userId: string, action: string): void => {
  // Obtenir l'historique des actions de l'utilisateur depuis le stockage local
  const storageKey = `user_activity_${userId}`;
  const activityLog = JSON.parse(localStorage.getItem(storageKey) || '[]');
  
  // Ajouter la nouvelle action au journal
  const newAction = {
    action,
    timestamp: Date.now()
  };
  
  activityLog.push(newAction);
  
  // Garder seulement les 50 dernières actions
  if (activityLog.length > 50) {
    activityLog.shift();
  }
  
  // Enregistrer le journal mis à jour
  localStorage.setItem(storageKey, JSON.stringify(activityLog));
  
  // Analyser les actions récentes pour détecter des comportements suspects
  const recentActions = activityLog.filter(
    (a: any) => a.timestamp > Date.now() - 5 * 60 * 1000 // 5 dernières minutes
  );
  
  // Vérifier le nombre de tentatives de connexion échouées
  if (action === 'login_failed') {
    const failedAttempts = recentActions.filter((a: any) => a.action === 'login_failed').length;
    
    if (failedAttempts >= 5) {
      toast.error('Comportement suspect détecté', {
        description: 'Trop de tentatives de connexion échouées. Veuillez réessayer plus tard.'
      });
      
      // Enregistrer cette activité suspecte pour analyse ultérieure
      // Dans une application réelle, on pourrait l'envoyer à un système de sécurité
      console.warn('Activité suspecte détectée:', {
        userId,
        action: 'multiple_failed_logins',
        count: failedAttempts,
        timestamp: new Date().toISOString()
      });
    }
  }
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

/**
 * Enregistre une activité de sécurité importante pour audit
 * @param userId ID de l'utilisateur
 * @param action Action effectuée
 * @param details Détails supplémentaires
 */
export const logSecurityEvent = (
  userId: string,
  action: string,
  details?: Record<string, any>
): void => {
  const event = {
    userId,
    action,
    details,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    ip: '(client-side)' // Dans une application réelle, l'IP serait ajoutée côté serveur
  };
  
  // Dans une application réelle, on enverrait cet événement à un service d'audit
  console.info('Événement de sécurité:', event);
  
  // Pour les événements critiques, on peut notifier l'utilisateur
  if (['password_changed', 'two_factor_enabled', 'two_factor_disabled'].includes(action)) {
    toast.success('Action de sécurité réussie', {
      description: `L'action "${action}" a été effectuée avec succès.`
    });
  }
};
