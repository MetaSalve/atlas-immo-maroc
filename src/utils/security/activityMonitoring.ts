
/**
 * Surveillance des activités suspectes et journalisation de sécurité
 */

import { toast } from 'sonner';

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
