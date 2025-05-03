
import React, { createContext, useContext, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/providers/AuthProvider';

type AuditAction = 
  | 'login_success' 
  | 'login_failed' 
  | 'logout' 
  | 'signup' 
  | 'password_reset' 
  | 'password_change'
  | 'profile_update'
  | 'subscription_change'
  | 'access_denied'
  | 'feature_access_premium'
  | 'admin_action'
  | 'data_export'
  | 'account_deletion';

interface SecurityAuditContextType {
  logEvent: (action: AuditAction, details?: Record<string, any>) => Promise<void>;
}

const SecurityAuditContext = createContext<SecurityAuditContextType | undefined>(undefined);

export const useSecurityAudit = () => {
  const context = useContext(SecurityAuditContext);
  if (!context) {
    throw new Error('useSecurityAudit must be used within a SecurityAuditProvider');
  }
  return context;
};

export const SecurityAuditProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  const logEvent = useCallback(async (action: AuditAction, details?: Record<string, any>) => {
    try {
      const event = {
        user_id: user?.id || null,
        action,
        details,
        ip_address: '(client-side)', // Idéalement, cela serait capturé côté serveur
        user_agent: navigator.userAgent,
      };
      
      console.info('Logging security event:', event);
      
      // Dans une application réelle, nous enregistrerions cet événement dans une table d'audit
      // via une fonction Edge pour capturer correctement l'adresse IP
      if (user) {
        await supabase.functions.invoke('log-security-event', {
          body: { event }
        });
      }
    } catch (error) {
      // Nous ne voulons pas que les erreurs de journalisation perturbent l'expérience utilisateur
      console.error('Failed to log security event:', error);
    }
  }, [user]);

  return (
    <SecurityAuditContext.Provider value={{ logEvent }}>
      {children}
    </SecurityAuditContext.Provider>
  );
};
