
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface PWAStatus {
  isInstallable: boolean;
  isInstalled: boolean;
  isOffline: boolean;
}

export const usePWAStatus = () => {
  const [status, setStatus] = useState<PWAStatus>({
    isInstallable: false,
    isInstalled: false,
    isOffline: false
  });

  useEffect(() => {
    // Vérifier si l'app est déjà installée
    const isInStandaloneMode = 
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone ||
      document.referrer.includes('android-app://');

    setStatus(prev => ({ ...prev, isInstalled: isInStandaloneMode }));

    // Monitorer la connexion réseau
    const handleConnectionChange = () => {
      const isOffline = !navigator.onLine;
      setStatus(prev => ({ ...prev, isOffline }));
      
      if (isOffline) {
        toast.warning("Vous êtes hors ligne", {
          description: "L'application continuera de fonctionner avec des fonctionnalités limitées"
        });
      } else {
        toast.success("Connexion rétablie", {
          description: "Toutes les fonctionnalités sont de nouveau disponibles"
        });
      }
    };

    window.addEventListener('online', handleConnectionChange);
    window.addEventListener('offline', handleConnectionChange);

    // Vérifier si l'app est installable
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setStatus(prev => ({ ...prev, isInstallable: true }));
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Cleanup
    return () => {
      window.removeEventListener('online', handleConnectionChange);
      window.removeEventListener('offline', handleConnectionChange);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  return status;
};
