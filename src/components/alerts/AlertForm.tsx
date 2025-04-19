import { useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { SearchFiltersValues } from '@/components/search/SearchFilters';
import { Bell } from 'lucide-react';
import { Json } from '@/integrations/supabase/types';
import { UserAlertInsert } from '@/types/alerts';

interface AlertFormProps {
  initialValues?: SearchFiltersValues;
  onSave?: () => void;
}

export const AlertForm = ({ initialValues, onSave }: AlertFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [alertName, setAlertName] = useState('');
  const [filters] = useState<SearchFiltersValues>(initialValues || {
    status: 'all',
    type: 'all',
    location: '',
    priceMin: 0,
    priceMax: 10000000,
    bedroomsMin: 0,
    bathroomsMin: 0,
    areaMin: 0,
  });
  
  const [isEnabled, setIsEnabled] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const saveAlert = async () => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Vous devez être connecté pour créer une alerte'
      });
      return;
    }
    
    if (!alertName) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Veuillez donner un nom à votre alerte'
      });
      return;
    }
    
    try {
      setIsSaving(true);
      
      const alertData: UserAlertInsert = {
        user_id: user.id,
        name: alertName,
        filters: filters as unknown as Json,
        is_active: isEnabled,
      };
      
      const { error } = await supabase
        .from('user_alerts')
        .insert(alertData);
        
      if (error) throw error;
      
      toast({
        title: 'Alerte créée',
        description: 'Vous recevrez des notifications pour les nouveaux biens correspondant à vos critères'
      });
      
      setAlertName('');
      if (onSave) onSave();
    } catch (error) {
      console.error('Error saving alert:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de créer l\'alerte'
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const getSummary = (filters: SearchFiltersValues) => {
    const parts = [];
    
    if (filters.location) parts.push(`À ${filters.location}`);
    if (filters.type !== 'all') parts.push(`Type: ${filters.type}`);
    if (filters.status !== 'all') parts.push(`Statut: ${filters.status === 'for-sale' ? 'À vendre' : 'À louer'}`);
    
    if (filters.priceMin > 0 || filters.priceMax < 10000000) {
      const priceRange = [];
      if (filters.priceMin > 0) priceRange.push(`min ${filters.priceMin.toLocaleString('fr-FR')} MAD`);
      if (filters.priceMax < 10000000) priceRange.push(`max ${filters.priceMax.toLocaleString('fr-FR')} MAD`);
      parts.push(`Prix: ${priceRange.join(' - ')}`);
    }
    
    if (filters.bedroomsMin > 0) parts.push(`Min ${filters.bedroomsMin} chambres`);
    if (filters.bathroomsMin > 0) parts.push(`Min ${filters.bathroomsMin} salles de bains`);
    if (filters.areaMin > 0) parts.push(`Min ${filters.areaMin} m²`);
    
    return parts.join(' • ');
  };
  
  return (
    <Card className="w-full">
      <CardContent className="pt-6 pb-4 space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Créer une alerte</h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Activée</span>
              <Switch checked={isEnabled} onCheckedChange={setIsEnabled} />
            </div>
          </div>
          
          <div className="space-y-1">
            <Input
              placeholder="Nom de l'alerte (ex: Appartements 2 chambres à Marrakech)"
              value={alertName}
              onChange={e => setAlertName(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              {getSummary(filters)}
            </p>
          </div>
        </div>
        
        <div className="border-t pt-4 flex justify-end">
          <Button
            onClick={saveAlert}
            disabled={isSaving || !alertName}
          >
            <Bell className="h-4 w-4 mr-2" />
            Créer l'alerte
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
