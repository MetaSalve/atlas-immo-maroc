
import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface CancelSubscriptionDialogProps {
  renewalDate: Date;
  onConfirm: () => void;
}

export const CancelSubscriptionDialog = ({
  renewalDate,
  onConfirm,
}: CancelSubscriptionDialogProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline" 
          className="w-full sm:w-auto text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30"
        >
          Annuler l'abonnement
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Êtes-vous sûr de vouloir annuler votre abonnement ?</AlertDialogTitle>
          <AlertDialogDescription>
            Vous perdrez l'accès à toutes les fonctionnalités premium à la fin de votre période d'abonnement actuelle.
            Votre abonnement restera actif jusqu'au {format(renewalDate, 'dd MMMM yyyy', { locale: fr })}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={onConfirm}
          >
            Confirmer l'annulation
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
