
import { AlertForm } from '@/components/alerts/AlertForm';
import { SimpleSearchFilters, SimpleSearchFiltersValues } from './SimpleSearchFilters';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from 'react';

interface AlertDialogProps {
  open: boolean;
  filters: SimpleSearchFiltersValues;
  onOpenChange: (open: boolean) => void;
  createAlert: (data: {name: string, filters: any, is_active: boolean}) => Promise<boolean>;
}

export const AlertDialog = ({
  open,
  filters: initialFilters,
  onOpenChange,
  createAlert
}: AlertDialogProps) => {
  const [filters, setFilters] = useState<SimpleSearchFiltersValues>(initialFilters);

  const handleClose = () => {
    onOpenChange(false);
  };
  
  const handleFilterChange = (newFilters: Partial<SimpleSearchFiltersValues>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleApplyFilters = () => {
    // Nothing to do here since filters are automatically applied
  };

  const handleResetFilters = () => {
    setFilters({
      status: 'all',
      type: 'all',
      location: '',
      priceMin: 0,
      priceMax: 10000000,
      bedroomsMin: 0,
      bathroomsMin: 0,
      areaMin: 0,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Créer une alerte</DialogTitle>
          <DialogDescription>
            Vous recevrez des notifications pour les nouveaux biens qui correspondent à ces critères.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
          <SimpleSearchFilters
            values={filters}
            onChange={handleFilterChange}
            onApplyFilters={handleApplyFilters}
            onResetFilters={handleResetFilters}
          />
          
          <AlertForm 
            initialValues={filters}
            onSave={handleClose}
            createAlert={createAlert}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
