
import React from 'react';
import { usePWAStatus } from '@/hooks/usePWAStatus';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { WifiOff, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const PWAStatus = () => {
  const { isInstallable, isOffline } = usePWAStatus();

  if (!isOffline && !isInstallable) return null;

  return (
    <div className="fixed bottom-16 left-4 right-4 md:left-auto md:right-4 md:w-auto md:max-w-md z-50 space-y-2">
      {isOffline && (
        <Alert variant="destructive" className="flex items-center gap-2 shadow-lg">
          <WifiOff className="h-5 w-5" />
          <AlertDescription>
            Vous êtes hors ligne. Certaines fonctionnalités peuvent être limitées.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
