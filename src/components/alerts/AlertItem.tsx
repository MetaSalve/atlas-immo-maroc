
import { useState } from 'react';
import { UserAlert } from '@/types/alerts';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Bell, Trash2, Edit } from 'lucide-react';
import { SimpleSearchFiltersValues } from '@/components/search/SimpleSearchFilters';
import { useNavigate } from 'react-router-dom';

interface AlertItemProps {
  alert: UserAlert;
  onUpdate: (id: string, data: Partial<UserAlert>) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
}

export const AlertItem = ({ alert, onUpdate, onDelete }: AlertItemProps) => {
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);
  const [isActive, setIsActive] = useState(alert.is_active);
  const navigate = useNavigate();

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

  const handleEdit = () => {
    navigate('/search', { state: { filters } });
  };
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Jamais';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="grid grid-cols-[1fr_auto_auto] gap-3 items-center">
          <div>
            <div className="font-medium flex items-center gap-2">
              <Bell className={`h-4 w-4 ${isActive ? 'text-terracotta' : 'text-muted-foreground'}`} />
              {alert.name}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {alert.last_notification_at && (
                <>
                  {alert.last_notification_count} nouveaux biens le {formatDate(alert.last_notification_at)}
                </>
              )}
            </div>
          </div>
          
          <Switch 
            checked={isActive} 
            onCheckedChange={handleToggleActive} 
            disabled={isUpdateLoading}
          />
          
          <div className="flex space-x-1">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleEdit}
              disabled={isUpdateLoading}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleDelete}
              disabled={isDeleteLoading}
              className="text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
