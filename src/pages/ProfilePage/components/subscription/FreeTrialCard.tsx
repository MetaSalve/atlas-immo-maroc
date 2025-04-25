
import React from 'react';
import { useNavigate } from 'react-router-dom';
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
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface FreeTrialCardProps {
  daysRemaining: number;
  trialProgress: number;
  trialEndDate: Date;
  maxFavorites: number;
  allowedAlerts: number;
  onUpgrade: () => void;
}

export const FreeTrialCard = ({
  daysRemaining,
  trialProgress,
  trialEndDate,
  maxFavorites,
  allowedAlerts,
  onUpgrade,
}: FreeTrialCardProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Période d'essai gratuite</CardTitle>
            <CardDescription className="mt-1">
              Votre période d'essai expire dans {daysRemaining} jours
            </CardDescription>
          </div>
          <Badge variant="outline" className="mt-2 sm:mt-0 bg-orange-100 text-orange-700 border-orange-200 w-fit">
            <Calendar className="h-3 w-3 mr-1" />
            {format(trialEndDate, 'dd MMM yyyy', { locale: fr })}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progression de votre essai</span>
            <span>{Math.round(trialProgress)}%</span>
          </div>
          <Progress value={trialProgress} />
        </div>
        
        <div className="rounded-lg border p-4 bg-cream/20 space-y-3">
          <h3 className="font-medium">Limitations du compte gratuit</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span>Favoris</span>
              <span className="font-medium">{maxFavorites} maximum</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Alertes</span>
              <span className="font-medium">{allowedAlerts} maximum</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Filtres avancés</span>
              <span className="text-red-500">Non disponible</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Notifications par email</span>
              <span className="text-red-500">Non disponible</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Comparaison de biens</span>
              <span className="text-red-500">Non disponible</span>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-700">
          <div className="flex items-start">
            <Info className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Passez à l'offre Premium</p>
              <p className="mt-1">Votre période d'essai se termine bientôt. Passez à l'offre premium pour avoir un accès illimité à toutes les fonctionnalités.</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={onUpgrade}
        >
          <CreditCard className="h-4 w-4 mr-2" />
          Passer à l'offre Premium
        </Button>
      </CardFooter>
    </Card>
  );
};
