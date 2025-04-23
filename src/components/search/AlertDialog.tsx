
import { AlertForm } from '@/components/alerts/AlertForm';
import { SimpleSearchFiltersValues } from './SimpleSearchFilters';
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
          initialValues={filters} 
          onSave={handleClose}
          createAlert={createAlert}
        />
      </DialogContent>
    </Dialog>
  );
};
