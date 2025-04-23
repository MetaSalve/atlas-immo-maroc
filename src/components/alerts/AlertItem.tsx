
import { useState } from 'react';
import { UserAlert } from '@/types/alerts';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Bell, Trash2, Edit } from 'lucide-react';
import { SimpleSearchFiltersValues } from '@/components/search/SimpleSearchFilters';

interface AlertItemProps {
  alert: UserAlert;
  onUpdate: (id: string, data: Partial<UserAlert>) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
}

export const AlertItem = ({ alert, onUpdate, onDelete }: AlertItemProps) => {
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);
  const [isActive, setIsActive] = useState(alert.is_active);

  // Parse the filters from the alert
  const filters = alert.filters as unknown as SimpleSearchFiltersValues;
  
  const handleToggleActive = async () => {
    setIsUpdateLoading(true);
    try {
      const newIsActive = !isActive;
      const success = await onUpdate(alert.id, { is_active: newIsActive });
      if (success) {
        setIsActive(newIsActive);
      }
    } finally {
      setIsUpdateLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleteLoading(true);
    try {
      await onDelete(alert.id);
    } finally {
      setIsDeleteLoading(false);
    }
  };
  
  const formatFilters = (filters: SimpleSearchFiltersValues) => {
    const parts = [];
    
    if (filters.location) parts.push(`À ${filters.location}`);
    if (filters.type !== 'all') parts.push(`Type: ${filters.type === 'apartment' ? 'Appartement' : 
                                                 filters.type === 'house' ? 'Maison' : 
                                                 filters.type === 'land' ? 'Terrain' : 
                                                 filters.type === 'commercial' ? 'Commerce' : filters.type}`);
    if (filters.status !== 'all') parts.push(`Statut: ${filters.status === 'for_sale' ? 'À vendre' : 'À louer'}`);
    
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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center space-x-2">
          <Bell className={`h-5 w-5 ${isActive ? 'text-terracotta' : 'text-muted-foreground'}`} />
          <h3 className="font-medium text-lg">{alert.name}</h3>
        </div>
        <div className="flex items-center space-x-2">
          <Switch 
            checked={isActive} 
            onCheckedChange={handleToggleActive} 
            disabled={isUpdateLoading}
          />
          <Button 
            variant="destructive" 
            size="icon"
            onClick={handleDelete}
            disabled={isDeleteLoading}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground">
          {formatFilters(filters)}
        </div>
        {alert.last_notification_at && (
          <div className="text-xs text-muted-foreground mt-2">
            {alert.last_notification_count} nouveaux biens trouvés le {new Date(alert.last_notification_at).toLocaleDateString()}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
