
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, AlertCircle, Clock, XCircle } from 'lucide-react';

interface StatusItem {
  name: string;
  status: 'completed' | 'in-progress' | 'pending' | 'critical';
  description: string;
  priority: 'high' | 'medium' | 'low';
}

const productionItems: StatusItem[] = [
  {
    name: 'Navigation & Routes',
    status: 'completed',
    description: 'Toutes les routes implémentées et fonctionnelles',
    priority: 'high'
  },
  {
    name: 'Système de recherche',
    status: 'completed', 
    description: 'Recherche et filtres opérationnels',
    priority: 'high'
  },
  {
    name: 'Gestion des favoris',
    status: 'completed',
    description: 'Ajout/suppression favoris avec persistance',
    priority: 'high'
  },
  {
    name: 'Tests de charge',
    status: 'pending',
    description: 'Tests avec >1000 utilisateurs simultanés',
    priority: 'high'
  },
  {
    name: 'Monitoring production',
    status: 'pending',
    description: 'Grafana, alertes, logs centralisés',
    priority: 'high'
  },
  {
    name: 'Tests paiements live',
    status: 'critical',
    description: 'Validation Stripe/CMI en mode production',
    priority: 'high'
  },
  {
    name: 'Configuration serveur',
    status: 'pending',
    description: 'Nginx, SSL, variables environnement',
    priority: 'high'
  },
  {
    name: 'Conformité RGPD',
    status: 'pending',
    description: 'Mentions légales, politique confidentialité',
    priority: 'medium'
  }
];

export const ProductionStatus = () => {
  const completedItems = productionItems.filter(item => item.status === 'completed');
  const totalItems = productionItems.length;
  const completionPercentage = Math.round((completedItems.length / totalItems) * 100);

  const getStatusIcon = (status: StatusItem['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
      case 'critical':
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusBadge = (status: StatusItem['status']) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Terminé</Badge>;
      case 'in-progress':
        return <Badge className="bg-yellow-100 text-yellow-800">En cours</Badge>;
      case 'pending':
        return <Badge className="bg-gray-100 text-gray-800">En attente</Badge>;
      case 'critical':
        return <Badge className="bg-red-100 text-red-800">Critique</Badge>;
    }
  };

  const getPriorityBadge = (priority: StatusItem['priority']) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">Haute</Badge>;
      case 'medium':
        return <Badge variant="secondary">Moyenne</Badge>;
      case 'low':
        return <Badge variant="outline">Basse</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📊 Statut de Production AlertImmo
          </CardTitle>
          <CardDescription>
            Progression vers le déploiement en production
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progression globale</span>
                <span>{completionPercentage}%</span>
              </div>
              <Progress value={completionPercentage} className="h-2" />
            </div>
            
            <div className="text-sm text-gray-600">
              {completedItems.length} sur {totalItems} éléments terminés
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Éléments de Production</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {productionItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(item.status)}
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-gray-600">{item.description}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {getPriorityBadge(item.priority)}
                  {getStatusBadge(item.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader>
          <CardTitle className="text-yellow-800">⚠️ Actions Immédiates</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-red-500">🔴</span>
              <span><strong>Tests paiements</strong>: Valider Stripe et CMI en mode production</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500">🟠</span>
              <span><strong>Tests de charge</strong>: Vérifier la tenue en charge avant lancement</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500">🟠</span>
              <span><strong>Monitoring</strong>: Configurer alertes et surveillance 24/7</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
