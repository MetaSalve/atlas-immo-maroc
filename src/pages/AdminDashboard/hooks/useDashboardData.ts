
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AppMetric {
  name: string;
  value: number;
  change?: number;
  trend?: 'up' | 'down' | 'stable';
}

export interface SystemMetric {
  name: string;
  value: number;
  unit: string;
  warning?: boolean;
  critical?: boolean;
}

export interface TimeSeriesData {
  timestamp: string;
  users?: number;
  requests?: number;
  errors?: number;
  properties?: number;
  subscriptions?: number;
}

export interface ErrorLog {
  id: string;
  timestamp: string;
  error_message: string;
  user_id?: string;
  path?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export const useDashboardData = (autoRefreshInterval: number | null = null) => {
  // État pour les métriques
  const [appMetrics, setAppMetrics] = useState<AppMetric[]>([]);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetric[]>([]);
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([]);
  const [errorLogs, setErrorLogs] = useState<ErrorLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fonction pour générer des données fictives pour la démo
  const generateDemoData = () => {
    // Métriques de l'application
    const demoAppMetrics: AppMetric[] = [
      { name: 'Utilisateurs', value: 1245, change: 5.2, trend: 'up' },
      { name: 'Abonnements', value: 287, change: 2.1, trend: 'up' },
      { name: 'Biens immobiliers', value: 18543, change: 8.7, trend: 'up' },
      { name: 'Alertes actives', value: 3456, change: 1.2, trend: 'up' }
    ];
    
    // Métriques système
    const demoSystemMetrics: SystemMetric[] = [
      { name: 'Utilisation CPU', value: 45, unit: '%' },
      { name: 'Utilisation mémoire', value: 72, unit: '%', warning: true },
      { name: 'Espace disque', value: 56, unit: '%' },
      { name: 'Temps de réponse API', value: 350, unit: 'ms', warning: true },
      { name: 'Temps de réponse DB', value: 120, unit: 'ms' },
      { name: 'Taux d\'erreurs', value: 0.8, unit: '%' }
    ];
    
    // Données de séries temporelles
    const now = new Date();
    const demoTimeSeriesData: TimeSeriesData[] = Array.from({ length: 24 }, (_, i) => {
      const date = new Date(now);
      date.setHours(date.getHours() - 23 + i);
      
      return {
        timestamp: date.toISOString(),
        users: Math.floor(Math.random() * 50) + 150,
        requests: Math.floor(Math.random() * 500) + 1000,
        errors: Math.floor(Math.random() * 10),
        properties: Math.floor(Math.random() * 20) + 18500,
        subscriptions: Math.floor(Math.random() * 5) + 280
      };
    });
    
    // Logs d'erreurs
    const demoErrorLogs: ErrorLog[] = [
      { 
        id: '1', 
        timestamp: new Date(Date.now() - 15 * 60000).toISOString(), 
        error_message: 'Échec de la connexion à la base de données', 
        path: '/api/properties', 
        severity: 'high'
      },
      { 
        id: '2', 
        timestamp: new Date(Date.now() - 45 * 60000).toISOString(), 
        error_message: 'Validation échouée pour les paramètres de recherche', 
        user_id: '123', 
        path: '/api/search', 
        severity: 'low'
      },
      { 
        id: '3', 
        timestamp: new Date(Date.now() - 120 * 60000).toISOString(), 
        error_message: 'Timeout lors du traitement du paiement', 
        user_id: '456', 
        path: '/api/payments', 
        severity: 'medium'
      },
      { 
        id: '4', 
        timestamp: new Date(Date.now() - 180 * 60000).toISOString(), 
        error_message: 'Exception non capturée dans le module de notifications', 
        path: '/api/notifications', 
        severity: 'critical'
      }
    ];
    
    setAppMetrics(demoAppMetrics);
    setSystemMetrics(demoSystemMetrics);
    setTimeSeriesData(demoTimeSeriesData);
    setErrorLogs(demoErrorLogs);
    setIsLoading(false);
  };
  
  // Fonction pour charger les données (actuellement démo, mais pourrait être connectée à une API réelle)
  const fetchDashboardData = async () => {
    setIsLoading(true);
    // En production, on utiliserait supabase ou une autre API pour récupérer les vraies données
    // const { data, error } = await supabase.from('dashboard_metrics').select('*');
    
    // Pour l'instant, nous utilisons des données de démo
    generateDemoData();
    setIsLoading(false);
  };
  
  // Charger les données au montage
  useEffect(() => {
    fetchDashboardData();
  }, []);
  
  // Gestion de l'auto-refresh
  useEffect(() => {
    if (autoRefreshInterval) {
      const interval = setInterval(() => {
        fetchDashboardData();
      }, autoRefreshInterval * 1000);
      
      return () => clearInterval(interval);
    }
  }, [autoRefreshInterval]);
  
  return {
    appMetrics,
    systemMetrics,
    timeSeriesData,
    errorLogs,
    isLoading,
    refreshData: fetchDashboardData
  };
};
