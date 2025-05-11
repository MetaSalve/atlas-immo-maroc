
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useNavigate } from 'react-router-dom';

export const DynamicImportError = () => {
  const navigate = useNavigate();

  const handleRetry = () => {
    window.location.reload();
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <Alert variant="destructive" className="mb-6 max-w-md">
        <AlertTriangle className="h-5 w-5" />
        <AlertTitle>Erreur de chargement</AlertTitle>
        <AlertDescription>
          Un problème est survenu lors du chargement du module. Cela peut être dû à une connexion internet instable ou un problème temporaire.
        </AlertDescription>
      </Alert>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <Button onClick={handleRetry} variant="default">
          Rafraîchir la page
        </Button>
        <Button onClick={handleGoBack} variant="outline">
          Retour à la page précédente
        </Button>
      </div>
    </div>
  );
};
