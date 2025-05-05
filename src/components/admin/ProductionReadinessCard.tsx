
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckIcon, AlertCircle, XCircle, Info } from 'lucide-react';

interface ReadinessItem {
  name: string;
  status: 'complete' | 'warning' | 'error' | 'info';
  description: string;
}

const ProductionReadinessCard = () => {
  const readinessItems: ReadinessItem[] = [
    {
      name: "Variables d'environnement",
      status: "complete",
      description: "Configuration des variables d'environnement de production"
    },
    {
      name: "Passerelle de paiement",
      status: "complete",
      description: "Configuration de Stripe et CMI pour les paiements"
    },
    {
      name: "Certificats SSL",
      status: "complete",
      description: "Mise en place et vérification des certificats SSL"
    },
    {
      name: "Monitoring",
      status: "complete",
      description: "Configuration du monitoring et des alertes"
    },
    {
      name: "Conformité RGPD",
      status: "complete",
      description: "Mise en place des outils de conformité au RGPD"
    },
    {
      name: "Sauvegardes",
      status: "complete",
      description: "Configuration des sauvegardes automatisées"
    },
    {
      name: "Tests de performance",
      status: "complete",
      description: "Mise en place des outils de test de performance"
    },
    {
      name: "Plan de reprise",
      status: "complete",
      description: "Configuration du plan de reprise d'activité"
    }
  ];

  const completedItems = readinessItems.filter(item => item.status === 'complete').length;
  const progress = Math.round((completedItems / readinessItems.length) * 100);

  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle>État de préparation pour la production</CardTitle>
        <CardDescription>
          État d'avancement de la configuration pour le déploiement en production
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progression globale:</span>
            <span className="font-medium">{progress}% complet</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        
        <ul className="space-y-3 mt-4">
          {readinessItems.map((item, index) => (
            <li key={index} className="flex items-start gap-3 border-b pb-2 last:border-0">
              <div className="mt-0.5">
                {item.status === 'complete' && (
                  <CheckIcon className="h-5 w-5 text-green-500" />
                )}
                {item.status === 'warning' && (
                  <AlertCircle className="h-5 w-5 text-amber-500" />
                )}
                {item.status === 'error' && (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                {item.status === 'info' && (
                  <Info className="h-5 w-5 text-blue-500" />
                )}
              </div>
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded mt-4">
          <p className="font-medium text-green-800">Prêt pour la production !</p>
          <p className="text-sm text-green-700">
            Toutes les configurations nécessaires ont été effectuées. 
            L'application est prête à être déployée en production.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductionReadinessCard;
