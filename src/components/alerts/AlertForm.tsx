import { useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { SearchFiltersValues } from '@/components/search/SearchFilters';
import { Bell } from 'lucide-react';
import { Json } from '@/integrations/supabase/types';

interface AlertFormProps {
  initialValues?: SearchFiltersValues;
  onSave?: () => void;
  createAlert?: (data: {name: string, filters: any, is_active: boolean}) => Promise<boolean>;
}

export const AlertForm = ({ initialValues, onSave, createAlert }: AlertFormProps) => {
  const { user } = useAuth();
  
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
      toast('Connexion requise', {
        description: 'Vous devez être connecté pour créer une alerte',
      });
      return;
    }
    
    const finalAlertName = alertName.trim() || "Alerte immobilière";
    
    try {
      setIsSaving(true);
      
      if (createAlert) {
        const success = await createAlert({
          name: finalAlertName,
          filters: filters as unknown as Json,
          is_active: isEnabled
        });
        
        if (success) {
          setAlertName('');
          if (onSave) onSave();
        }
      } else {
        toast('Création d\'alerte temporairement indisponible', {
          description: 'La fonctionnalité est en cours de maintenance',
        });
      }
    } catch (error) {
      console.error('Error saving alert:', error);
      toast('Erreur', {
        description: 'Impossible de créer l\'alerte',
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
            disabled={isSaving}
            className="bg-terracotta hover:bg-terracotta/90"
          >
            <Bell className="h-4 w-4 mr-2" />
            Créer l'alerte
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
