
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useAuth } from '@/providers/AuthProvider';
import { supabase } from '@/integrations/supabase/client';

interface PrivacySettings {
  collectAnalytics: boolean;
  marketing: boolean;
  tracking: boolean;
  thirdParties: boolean;
}

interface UserPrivacySettings {
  id: string;
  user_id: string;
  collect_analytics: boolean;
  marketing_consent: boolean;
  tracking_consent: boolean;
  third_party_consent: boolean;
  created_at: string;
  updated_at: string;
}

export const DataPrivacySettings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<PrivacySettings>({
    collectAnalytics: false,
    marketing: false,
    tracking: false,
    thirdParties: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dataRequested, setDataRequested] = useState(false);
  const [deletionRequested, setDeletionRequested] = useState(false);

  useEffect(() => {
    if (user) {
      loadPrivacySettings();
    }
  }, [user]);

  const loadPrivacySettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_privacy_settings')
        .select('*')
        .eq('user_id', user?.id)
        .single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 = No rows returned
        throw error;
      }
      
      if (data) {
        const typedData = data as UserPrivacySettings;
        setSettings({
          collectAnalytics: typedData.collect_analytics,
          marketing: typedData.marketing_consent,
          tracking: typedData.tracking_consent,
          thirdParties: typedData.third_party_consent,
        });
      }
    } catch (err) {
      console.error("Erreur lors du chargement des paramètres de confidentialité:", err);
      toast.error("Impossible de charger vos paramètres de confidentialité");
    } finally {
      setLoading(false);
    }
  };

  const savePrivacySettings = async () => {
    if (!user) return;
    
    try {
      setSaving(true);
      const { error } = await supabase
        .from('user_privacy_settings')
        .upsert({
          user_id: user.id,
          collect_analytics: settings.collectAnalytics,
          marketing_consent: settings.marketing,
          tracking_consent: settings.tracking,
          third_party_consent: settings.thirdParties,
          updated_at: new Date().toISOString()
        });
      
      if (error) throw error;
      
      toast.success("Paramètres de confidentialité mis à jour");
      
      // Enregistrer cette action dans les logs de sécurité
      await supabase.functions.invoke('log-security-event', {
        body: {
          event: {
            user_id: user.id,
            action: 'privacy_settings_updated',
            details: settings
          }
        }
      });
    } catch (err) {
      console.error("Erreur lors de la sauvegarde des paramètres:", err);
      toast.error("Impossible de sauvegarder vos paramètres de confidentialité");
    } finally {
      setSaving(false);
    }
  };

  const requestDataExport = async () => {
    if (!user) return;
    
    try {
      setDataRequested(true);
      
      const { error } = await supabase.functions.invoke('request-data-export', {
        body: { userId: user.id }
      });
      
      if (error) throw error;
      
      toast.success("Demande d'exportation de données envoyée", {
        description: "Vous recevrez un email avec vos données dans les 48 heures."
      });
    } catch (err) {
      console.error("Erreur lors de la demande d'exportation:", err);
      toast.error("Impossible de traiter votre demande d'exportation");
      setDataRequested(false);
    }
  };

  const requestAccountDeletion = async () => {
    if (!user) return;
    
    try {
      setDeletionRequested(true);
      
      const { error } = await supabase.functions.invoke('request-account-deletion', {
        body: { userId: user.id }
      });
      
      if (error) throw error;
      
      toast.success("Demande de suppression de compte envoyée", {
        description: "Vous recevrez un email de confirmation pour finaliser la suppression."
      });
    } catch (err) {
      console.error("Erreur lors de la demande de suppression:", err);
      toast.error("Impossible de traiter votre demande de suppression");
      setDeletionRequested(false);
    }
  };

  const handleToggle = (setting: keyof PrivacySettings) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle>Paramètres de confidentialité</CardTitle>
        <CardDescription>
          Gérez comment vos données sont utilisées conformément au RGPD
        </CardDescription>
      </CardHeader>
      
      <Tabs defaultValue="consent">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="consent">Consentements</TabsTrigger>
          <TabsTrigger value="data">Mes données</TabsTrigger>
        </TabsList>
        
        <TabsContent value="consent">
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium">Collecte d'analyses</div>
                <div className="text-sm text-muted-foreground">
                  Autoriser la collecte de données d'utilisation anonymisées
                </div>
              </div>
              <Switch
                checked={settings.collectAnalytics}
                onCheckedChange={() => handleToggle('collectAnalytics')}
                disabled={loading || saving}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium">Communications marketing</div>
                <div className="text-sm text-muted-foreground">
                  Recevoir des emails sur nos offres et services
                </div>
              </div>
              <Switch
                checked={settings.marketing}
                onCheckedChange={() => handleToggle('marketing')}
                disabled={loading || saving}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium">Cookies de suivi</div>
                <div className="text-sm text-muted-foreground">
                  Permettre le suivi de votre activité sur le site
                </div>
              </div>
              <Switch
                checked={settings.tracking}
                onCheckedChange={() => handleToggle('tracking')}
                disabled={loading || saving}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium">Partage avec des tiers</div>
                <div className="text-sm text-muted-foreground">
                  Autoriser le partage limité de données avec nos partenaires
                </div>
              </div>
              <Switch
                checked={settings.thirdParties}
                onCheckedChange={() => handleToggle('thirdParties')}
                disabled={loading || saving}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={savePrivacySettings} 
              disabled={loading || saving}
              className="w-full"
            >
              {saving ? "Enregistrement..." : "Enregistrer mes préférences"}
            </Button>
          </CardFooter>
        </TabsContent>
        
        <TabsContent value="data">
          <CardContent className="pt-6 space-y-5">
            <div>
              <h3 className="font-medium mb-2">Exportation de données</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Recevez une copie complète des données que nous conservons vous concernant dans un format structuré.
              </p>
              <Button 
                variant="outline"
                onClick={requestDataExport}
                disabled={dataRequested}
                className="w-full"
              >
                {dataRequested ? "Demande envoyée" : "Demander mes données"}
              </Button>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Droit à l'oubli</h3>
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm text-muted-foreground">
                  Demandez la suppression complète de votre compte et de toutes vos données personnelles.
                </p>
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Irréversible</Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                Cette action ne peut pas être annulée et entraînera la perte définitive de votre compte et de vos données.
              </p>
              <Button 
                variant="destructive"
                onClick={requestAccountDeletion}
                disabled={deletionRequested}
                className="w-full"
              >
                {deletionRequested ? "Demande envoyée" : "Demander la suppression de mon compte"}
              </Button>
            </div>
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  );
};
