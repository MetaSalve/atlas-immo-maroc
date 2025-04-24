
import React from 'react';
import { format, addDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CreditCard, Info, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useSubscription } from '@/providers/SubscriptionProvider';

export const SubscriptionTab = () => {
  const { tier, maxFavorites, allowedAlerts, trialEndsAt } = useSubscription();
  
  const isPremium = tier === 'premium';
  const isFree = tier === 'free';
  
  const trialDays = 15;
  const today = new Date();
  const trialEndDate = trialEndsAt ? new Date(trialEndsAt) : addDays(today, trialDays);
  const daysRemaining = Math.max(0, Math.ceil((trialEndDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
  const trialProgress = Math.min(100, ((trialDays - daysRemaining) / trialDays) * 100);

  const subscriptionData = {
    status: isPremium ? 'active' : 'not_active',
    currentPeriodEnd: isPremium ? addDays(today, 30) : null,
    createdAt: isPremium ? addDays(today, -30) : null,
    priceId: isPremium ? 'price_premium_monthly' : null,
    renewalDate: isPremium ? addDays(today, 30) : null,
    price: '99 MAD',
    periodicity: 'mensuel'
  };

  const handleUpgradeSubscription = () => {
    window.location.href = '/subscription';
  };

  return (
    <>
      {isFree ? (
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
              onClick={handleUpgradeSubscription}
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Passer à l'offre Premium
            </Button>
          </CardFooter>
        </Card>
      ) : (
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
                  {subscriptionData.price} • {subscriptionData.periodicity}
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
                  Prochain prélèvement le {format(subscriptionData.renewalDate!, 'dd MMMM yyyy', { locale: fr })}
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
                <p>Votre abonnement se renouvellera automatiquement le {format(subscriptionData.renewalDate!, 'dd MMMM yyyy', { locale: fr })}. Vous pouvez le gérer à tout moment.</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-3">
            <Button 
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => window.location.href = '/subscription'}
            >
              Gérer le paiement
            </Button>
            <Button
              variant="outline" 
              className="w-full sm:w-auto text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30"
              onClick={() => window.location.href = '/subscription'}
            >
              Annuler l'abonnement
            </Button>
          </CardFooter>
        </Card>
      )}
    </>
  );
};
