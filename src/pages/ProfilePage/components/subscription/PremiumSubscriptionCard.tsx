
import React from 'react';
import { Info, Calendar, CreditCard } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CancelSubscriptionDialog } from './CancelSubscriptionDialog';

interface PremiumSubscriptionCardProps {
  renewalDate: Date;
  onManagePayment: () => void;
  onCancelSubscription: () => void;
}

export const PremiumSubscriptionCard = ({
  renewalDate,
  onManagePayment,
  onCancelSubscription,
}: PremiumSubscriptionCardProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center">
              <CardTitle>Abonnement Premium</CardTitle>
              <Badge variant="default" className="ml-2 bg-green-500">
                Actif
              </Badge>
            </div>
            <CardDescription className="mt-1">
              99 MAD • mensuel
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border p-4 bg-cream/20">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
            <h3 className="font-medium">Détails de l'abonnement</h3>
            <Badge variant="outline" className="w-fit mt-1 sm:mt-0 bg-blue-50 text-blue-700 border-blue-200">
              <Calendar className="h-3 w-3 mr-1" />
              Prochain prélèvement le {format(renewalDate, 'dd MMMM yyyy', { locale: fr })}
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <p className="font-medium">Fonctionnalités incluses</p>
              <ul className="space-y-1 text-muted-foreground">
                <li className="flex items-center">
                  <span className="inline-block w-4 h-4 rounded-full bg-green-500/20 text-green-600 text-center text-xs mr-2">✓</span>
                  Favoris illimités
                </li>
                <li className="flex items-center">
                  <span className="inline-block w-4 h-4 rounded-full bg-green-500/20 text-green-600 text-center text-xs mr-2">✓</span>
                  Alertes illimitées
                </li>
                <li className="flex items-center">
                  <span className="inline-block w-4 h-4 rounded-full bg-green-500/20 text-green-600 text-center text-xs mr-2">✓</span>
                  Filtres avancés
                </li>
                <li className="flex items-center">
                  <span className="inline-block w-4 h-4 rounded-full bg-green-500/20 text-green-600 text-center text-xs mr-2">✓</span>
                  Notifications par email
                </li>
                <li className="flex items-center">
                  <span className="inline-block w-4 h-4 rounded-full bg-green-500/20 text-green-600 text-center text-xs mr-2">✓</span>
                  Comparaison de biens
                </li>
              </ul>
            </div>
            
            <div className="space-y-1">
              <p className="font-medium">Informations de paiement</p>
              <div className="text-muted-foreground">
                <p>Carte •••• 4242</p>
                <p>Expire le 12/25</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 text-amber-700">
          <div className="flex items-start">
            <Info className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <p>Votre abonnement se renouvellera automatiquement le {format(renewalDate, 'dd MMMM yyyy', { locale: fr })}. Vous pouvez le gérer à tout moment.</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-3">
        <Button 
          variant="outline"
          className="w-full sm:w-auto"
          onClick={onManagePayment}
        >
          <CreditCard className="h-4 w-4 mr-2" />
          Gérer le paiement
        </Button>

        <CancelSubscriptionDialog 
          renewalDate={renewalDate}
          onConfirm={onCancelSubscription}
        />
      </CardFooter>
    </Card>
  );
};
