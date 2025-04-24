
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

type ErrorType = 'network' | 'auth' | 'validation' | 'server' | 'unknown';

interface ErrorOptions {
  showToast?: boolean;
  logToConsole?: boolean;
  retry?: boolean;
}

export const useErrorHandler = () => {
  const [lastError, setLastError] = useState<Error | null>(null);

  const getErrorType = (error: any): ErrorType => {
    if (!navigator.onLine) return 'network';
    
    if (error?.status === 401 || error?.statusCode === 401) {
      return 'auth';
    }
    
    if (error?.status === 400 || error?.statusCode === 400 || error?.validationErrors) {
      return 'validation';
    }
    
    if (error?.status >= 500 || error?.statusCode >= 500) {
      return 'server';
    }
    
    return 'unknown';
  };

  const getErrorMessage = (error: any, type: ErrorType): string => {
    switch (type) {
      case 'network':
        return 'Problème de connexion. Veuillez vérifier votre connexion internet.';
      case 'auth':
        return 'Vous n\'êtes plus authentifié. Veuillez vous reconnecter.';
      case 'validation':
        return error.message || 'Les données saisies sont invalides.';
      case 'server':
        return 'Une erreur est survenue sur nos serveurs. Nos équipes ont été notifiées.';
      default:
        return error.message || 'Une erreur inattendue est survenue.';
    }
  };
  
  const handleError = useCallback((error: any, options: ErrorOptions = {}) => {
    const { showToast = true, logToConsole = true } = options;
    
    // Conserver l'erreur
    setLastError(error);
    
    const errorType = getErrorType(error);
    const errorMessage = getErrorMessage(error, errorType);
    
    if (logToConsole) {
      console.error('Erreur capturée:', {
        message: errorMessage,
        type: errorType,
        originalError: error
      });
    }
    
    if (showToast) {
      toast.error('Erreur', {
        description: errorMessage,
        duration: errorType === 'auth' ? 5000 : 3000
      });
    }
    
    // On pourrait ajouter ici une logique pour envoyer l'erreur à un service de monitoring
    
    return { errorType, errorMessage };
  }, []);
  
  return { handleError, lastError };
};
