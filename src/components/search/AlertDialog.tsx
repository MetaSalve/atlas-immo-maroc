
import { AlertForm } from '@/components/alerts/AlertForm';
import { SimpleSearchFiltersValues } from './SimpleSearchFilters';
import { SearchFiltersValues } from './SearchFilters';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AlertDialogProps {
  open: boolean;
  filters: SimpleSearchFiltersValues;
  onOpenChange: (open: boolean) => void;
  createAlert: (data: {name: string, filters: any, is_active: boolean}) => Promise<boolean>;
}

export const AlertDialog = ({
  open,
  filters,
  onOpenChange,
  createAlert
}: AlertDialogProps) => {
  const handleClose = () => {
    onOpenChange(false);
  };
  
  // Convert SimpleSearchFiltersValues to the format expected by createAlert
  const handleCreateAlert = async (data: {name: string, filters: any, is_active: boolean}) => {
    // Preserve the original filters but allow them to be overridden
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

  // Convert SimpleSearchFiltersValues to SearchFiltersValues to match the expected type
  const convertedFilters: SearchFiltersValues = {
    ...filters,
    // Ensure status is properly typed as "for-sale" | "for-rent" | "all"
    status: (filters.status === 'for_sale' ? 'for-sale' : 
             filters.status === 'for_rent' ? 'for-rent' : 
             'all') as 'for-sale' | 'for-rent' | 'all',
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Créer une alerte</DialogTitle>
          <DialogDescription>
            Vous recevrez des notifications pour les nouveaux biens qui correspondent à ces critères.
          </DialogDescription>
        </DialogHeader>
        
        <AlertForm 
          initialValues={convertedFilters} 
          onSave={handleClose}
          createAlert={handleCreateAlert}
        />
      </DialogContent>
    </Dialog>
  );
};
