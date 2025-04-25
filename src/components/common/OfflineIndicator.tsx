
import React, { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const OfflineIndicator = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <Alert variant="destructive" className="fixed bottom-16 left-4 right-4 md:left-auto md:right-4 md:w-auto md:max-w-md z-50 flex items-center gap-2 shadow-lg">
      <WifiOff className="h-5 w-5" />
      <AlertDescription>
        Vous êtes hors ligne. Certaines fonctionnalités peuvent être limitées.
      </AlertDescription>
    </Alert>
  );
};
