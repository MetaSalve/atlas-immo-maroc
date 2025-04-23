
import { AlertForm } from '@/components/alerts/AlertForm';
import { SearchFilters, SearchFiltersValues } from './SearchFilters';
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
  filters: SearchFiltersValues;
  onOpenChange: (open: boolean) => void;
  createAlert: (data: {name: string, filters: any, is_active: boolean}) => Promise<boolean>;
}

export const AlertDialog = ({
  open,
  filters: initialFilters,
  onOpenChange,
  createAlert
}: AlertDialogProps) => {
  const [filters, setFilters] = useState<SearchFiltersValues>(initialFilters);

  const handleClose = () => {
    onOpenChange(false);
  };
  
  const handleCreateAlert = async (data: {name: string, filters: any, is_active: boolean}) => {
    const mergedFilters = {
      ...filters,
      ...data.filters,
    };
    
    return createAlert({
      name: data.name,
      filters: mergedFilters,
      is_active: data.is_active
    });
  };

  const handleFilterChange = (newFilters: SearchFiltersValues) => {
    setFilters(newFilters);
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
          <SearchFilters
            initialValues={filters}
            onFilterChange={handleFilterChange}
          />
          
          <AlertForm 
            initialValues={filters}
            onSave={handleClose}
            createAlert={handleCreateAlert}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
