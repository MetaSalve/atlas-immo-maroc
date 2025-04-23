
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, BellOff, Edit, Trash } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

export interface AlertItemProps {
  alert: {
    id: string;
    name: string;
    filters: any;
    is_active: boolean;
  };
  onUpdate: (id: string, data: { is_active: boolean }) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
}

export const AlertItem: React.FC<AlertItemProps> = ({ alert, onUpdate, onDelete }) => {
  const [isDeleting, setIsDeleting] = React.useState(false);
  
  const toggleActive = async () => {
    await onUpdate(alert.id, { is_active: !alert.is_active });
  };
  
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(alert.id);
    } finally {
      setIsDeleting(false);
    }
  };
  
  const formatFilters = (filters: any) => {
    const parts = [];
    
    if (filters.location) parts.push(`À ${filters.location}`);
    if (filters.type !== 'all') parts.push(`Type: ${filters.type}`);
    if (filters.status !== 'all') parts.push(`Statut: ${filters.status === 'for_sale' ? 'À vendre' : 'À louer'}`);
    
    return parts.join(', ');
  };
  
  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-lg">{alert.name}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {formatFilters(alert.filters)}
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              checked={alert.is_active} 
              onCheckedChange={toggleActive}
            />
            <Button variant="ghost" size="icon" onClick={handleDelete} disabled={isDeleting}>
              <Trash className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
