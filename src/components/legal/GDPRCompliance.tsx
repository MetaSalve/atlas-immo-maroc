import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/providers/AuthProvider';
import { toast } from 'sonner';
import { Download, Trash2, Shield, FileText, AlertTriangle } from 'lucide-react';

export const GDPRCompliance = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const exportUserData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Récupérer toutes les données utilisateur
      const [profile, alerts, favorites, notifications] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('user_alerts').select('*').eq('user_id', user.id),
        supabase.from('favorites').select('*').eq('user_id', user.id),
        supabase.from('notifications').select('*').eq('user_id', user.id)
      ]);

      const userData = {
        profile: profile.data,
        alerts: alerts.data,
        favorites: favorites.data,
        notifications: notifications.data,
        export_date: new Date().toISOString(),
        user_id: user.id
      };

      // Créer et télécharger le fichier JSON
      const blob = new Blob([JSON.stringify(userData, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mes-donnees-alertimmo-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('Données exportées avec succès');
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Erreur lors de l\'export des données');
    } finally {
      setLoading(false);
    }
  };

  const deleteUserAccount = async () => {
    if (!user || !confirmDelete) return;
    
    setLoading(true);
    try {
      // Supprimer toutes les données liées à l'utilisateur et marquer la demande
      await Promise.all([
        supabase.from('user_alerts').delete().eq('user_id', user.id),
        supabase.from('favorites').delete().eq('user_id', user.id),
        supabase.from('notifications').delete().eq('user_id', user.id),
        supabase.from('account_deletions').insert({
          user_id: user.id,
          reason: 'Demande RGPD'
        })
      ]);

      // Pour la démo, nous simulons la suppression
      // En production, cela devrait déclencher un processus administratif
      toast.success('Demande de suppression enregistrée');
      toast.info('Un administrateur traitera votre demande sous 30 jours');
    } catch (error) {
      console.error('Deletion failed:', error);
      toast.error('Erreur lors de la suppression du compte');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Conformité RGPD</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <FileText className="w-4 h-4" />
            <AlertDescription>
              Conformément au RGPD, vous avez le droit d'accéder, de modifier, 
              d'exporter ou de supprimer vos données personnelles.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Export de vos données</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Téléchargez toutes vos données personnelles dans un fichier JSON.
                </p>
                <Button 
                  onClick={exportUserData}
                  disabled={loading}
                  className="w-full"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Exporter mes données
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base text-destructive">
                  Suppression du compte
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Supprimez définitivement votre compte et toutes vos données.
                </p>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="destructive" className="w-full">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Supprimer mon compte
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirmer la suppression</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Alert className="border-destructive">
                        <AlertTriangle className="w-4 h-4" />
                        <AlertDescription>
                          Cette action est irréversible. Toutes vos données seront
                          définitivement supprimées.
                        </AlertDescription>
                      </Alert>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="confirm-delete"
                          checked={confirmDelete}
                          onCheckedChange={(checked) => setConfirmDelete(checked === true)}
                        />
                        <label htmlFor="confirm-delete" className="text-sm">
                          Je comprends que cette action est irréversible
                        </label>
                      </div>
                      
                      <Button 
                        variant="destructive" 
                        onClick={deleteUserAccount}
                        disabled={!confirmDelete || loading}
                        className="w-full"
                      >
                        Confirmer la suppression
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};