
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, AlertTriangle, XCircle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface ServerStatus {
  sslValid: boolean;
  sslExpiration: string | null;
  daysUntilExpiration: number | null;
  serverSoftware: string;
  securityHeaders: {
    hsts: boolean;
    csp: boolean;
    xContentType: boolean;
    xFrame: boolean;
  };
  alertsConfigured: boolean;
  backupsConfigured: boolean;
}

export const ServerStatusCard = () => {
  const [status, setStatus] = useState<ServerStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const checkServerStatus = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('check-server-status');
      
      if (error) throw new Error(error.message);
      setStatus(data);
    } catch (err) {
      console.error('Erreur lors de la vérification du statut du serveur:', err);
      toast.error('Impossible de vérifier le statut du serveur');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkServerStatus();
  }, []);

  const getSslStatusColor = () => {
    if (!status?.sslValid) return 'bg-red-500';
    if ((status?.daysUntilExpiration || 0) <= 14) return 'bg-amber-500';
    return 'bg-green-500';
  };

  if (loading) {
    return (
      <Card className="w-full shadow-md">
        <CardHeader className="pb-2">
          <CardTitle>État du serveur</CardTitle>
          <CardDescription>Vérification du serveur en cours...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (!status) {
    return (
      <Card className="w-full shadow-md">
        <CardHeader className="pb-2">
          <CardTitle>État du serveur</CardTitle>
          <CardDescription>Impossible de récupérer le statut</CardDescription>
        </CardHeader>
        <CardContent className="py-4">
          <div className="flex flex-col items-center gap-2">
            <XCircle className="h-12 w-12 text-red-500" />
            <p className="text-sm text-muted-foreground">
              La fonction de vérification n'est pas disponible ou n'est pas configurée.
            </p>
            <Button size="sm" variant="outline" onClick={checkServerStatus} className="mt-2">
              <RefreshCw className="mr-2 h-4 w-4" />
              Réessayer
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>État du serveur</CardTitle>
            <CardDescription>Configuration et statut de production</CardDescription>
          </div>
          <Button variant="outline" size="icon" onClick={checkServerStatus}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Certificat SSL:</span>
              <Badge variant={status.sslValid ? "success" : "destructive"}>
                {status.sslValid ? 'Valide' : 'Invalide'}
              </Badge>
            </div>
            {status.sslExpiration && (
              <p className="text-xs text-muted-foreground">
                Expire le {new Date(status.sslExpiration).toLocaleDateString()}
                {status.daysUntilExpiration !== null && (
                  <span className={status.daysUntilExpiration <= 14 ? 'text-amber-500 font-medium' : ''}>
                    {' '}({status.daysUntilExpiration} jours)
                  </span>
                )}
              </p>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">En-têtes de sécurité:</span>
              <Badge variant={Object.values(status.securityHeaders).every(Boolean) ? "success" : "warning"}>
                {Object.values(status.securityHeaders).filter(Boolean).length}/{Object.values(status.securityHeaders).length}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-1 mt-1">
              <div className="flex items-center gap-1">
                {status.securityHeaders.hsts ? 
                  <CheckCircle className="h-3 w-3 text-green-500" /> :
                  <AlertTriangle className="h-3 w-3 text-amber-500" />
                }
                <span className="text-xs">HSTS</span>
              </div>
              <div className="flex items-center gap-1">
                {status.securityHeaders.csp ? 
                  <CheckCircle className="h-3 w-3 text-green-500" /> :
                  <AlertTriangle className="h-3 w-3 text-amber-500" />
                }
                <span className="text-xs">CSP</span>
              </div>
              <div className="flex items-center gap-1">
                {status.securityHeaders.xContentType ? 
                  <CheckCircle className="h-3 w-3 text-green-500" /> :
                  <AlertTriangle className="h-3 w-3 text-amber-500" />
                }
                <span className="text-xs">X-Content-Type</span>
              </div>
              <div className="flex items-center gap-1">
                {status.securityHeaders.xFrame ? 
                  <CheckCircle className="h-3 w-3 text-green-500" /> :
                  <AlertTriangle className="h-3 w-3 text-amber-500" />
                }
                <span className="text-xs">X-Frame</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2 pt-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Alertes configurées:</span>
            {status.alertsConfigured ? 
              <Badge variant="success">Oui</Badge> :
              <Badge variant="destructive">Non</Badge>
            }
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Sauvegardes automatiques:</span>
            {status.backupsConfigured ? 
              <Badge variant="success">Actives</Badge> :
              <Badge variant="destructive">Inactives</Badge>
            }
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Serveur:</span>
            <span className="text-xs bg-gray-100 px-2 py-0.5 rounded font-mono">
              {status.serverSoftware}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4 text-xs text-muted-foreground">
        <span>Dernière vérification: {new Date().toLocaleString()}</span>
        <span className="font-medium">
          {status.sslValid && Object.values(status.securityHeaders).every(Boolean) && status.alertsConfigured && status.backupsConfigured
            ? "✓ Configuration prête pour la production"
            : "⚠️ Configuration incomplète"}
        </span>
      </CardFooter>
    </Card>
  );
};
