
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export const useNetwork = () => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [connectionType, setConnectionType] = useState<string | null>(null);
  
  useEffect(() => {
    const updateOnlineStatus = () => {
      const online = navigator.onLine;
      setIsOnline(online);
      
      if (online) {
        toast.success('Connexion internet rétablie');
      } else {
        toast.warning('Connexion internet perdue', {
          description: 'Certaines fonctionnalités peuvent être limitées',
        });
      }
    };

    const updateConnectionType = () => {
      // @ts-ignore - NavigatorConnection is not in the standard TypeScript definitions
      if ('connection' in navigator) {
        // @ts-ignore
        const { effectiveType } = navigator.connection;
        setConnectionType(effectiveType);
      }
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    // @ts-ignore - NavigatorConnection is not in the standard TypeScript definitions
    if ('connection' in navigator) {
      // @ts-ignore
      navigator.connection.addEventListener('change', updateConnectionType);
      updateConnectionType();
    }

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);

      // @ts-ignore - NavigatorConnection is not in the standard TypeScript definitions
      if ('connection' in navigator) {
        // @ts-ignore
        navigator.connection.removeEventListener('change', updateConnectionType);
      }
    };
  }, []);

  return {
    isOnline,
    connectionType,
  };
};
