import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Activity, Zap, Globe, Database, Clock, Users } from 'lucide-react';

interface PerformanceMetrics {
  pageLoadTime: number;
  apiResponseTime: number;
  errorRate: number;
  activeUsers: number;
  cacheHitRate: number;
  databaseConnections: number;
}

export const PerformanceDashboard = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    pageLoadTime: 0,
    apiResponseTime: 0,
    errorRate: 0,
    activeUsers: 0,
    cacheHitRate: 0,
    databaseConnections: 0
  });

  useEffect(() => {
    // Simuler des métriques de performance en temps réel
    const updateMetrics = () => {
      setMetrics({
        pageLoadTime: Math.random() * 2000 + 500, // 500-2500ms
        apiResponseTime: Math.random() * 300 + 50, // 50-350ms
        errorRate: Math.random() * 2, // 0-2%
        activeUsers: Math.floor(Math.random() * 150 + 50), // 50-200
        cacheHitRate: Math.random() * 20 + 80, // 80-100%
        databaseConnections: Math.floor(Math.random() * 30 + 10) // 10-40
      });
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 5000);
    return () => clearInterval(interval);
  }, []);

  const getPerformanceStatus = (value: number, thresholds: { good: number; warning: number }) => {
    if (value <= thresholds.good) return { status: 'good', color: 'default' };
    if (value <= thresholds.warning) return { status: 'warning', color: 'secondary' };
    return { status: 'critical', color: 'destructive' };
  };

  const getLoadTimeStatus = getPerformanceStatus(metrics.pageLoadTime, { good: 1000, warning: 2000 });
  const getApiStatus = getPerformanceStatus(metrics.apiResponseTime, { good: 200, warning: 500 });
  const getErrorStatus = getPerformanceStatus(metrics.errorRate, { good: 0.5, warning: 1.5 });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Temps de chargement</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">
                {metrics.pageLoadTime.toFixed(0)}ms
              </div>
              <Badge variant={getLoadTimeStatus.color as any}>
                {getLoadTimeStatus.status}
              </Badge>
            </div>
            <Progress 
              value={(2500 - metrics.pageLoadTime) / 20} 
              className="mt-2" 
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Response</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">
                {metrics.apiResponseTime.toFixed(0)}ms
              </div>
              <Badge variant={getApiStatus.color as any}>
                {getApiStatus.status}
              </Badge>
            </div>
            <Progress 
              value={(500 - metrics.apiResponseTime) / 4.5} 
              className="mt-2" 
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux d'erreur</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">
                {metrics.errorRate.toFixed(2)}%
              </div>
              <Badge variant={getErrorStatus.color as any}>
                {getErrorStatus.status}
              </Badge>
            </div>
            <Progress 
              value={Math.max(0, (2 - metrics.errorRate) * 50)} 
              className="mt-2" 
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs actifs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeUsers}</div>
            <p className="text-xs text-muted-foreground">En temps réel</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux de cache</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.cacheHitRate.toFixed(1)}%</div>
            <Progress value={metrics.cacheHitRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connexions DB</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.databaseConnections}</div>
            <p className="text-xs text-muted-foreground">/ 100 max</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recommandations d'optimisation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {metrics.pageLoadTime > 2000 && (
              <div className="p-3 border-l-4 border-destructive bg-destructive/10">
                <p className="font-medium">Temps de chargement élevé détecté</p>
                <p className="text-sm text-muted-foreground">
                  Considérer l'optimisation des images et le lazy loading
                </p>
              </div>
            )}
            
            {metrics.apiResponseTime > 400 && (
              <div className="p-3 border-l-4 border-warning bg-warning/10">
                <p className="font-medium">Latence API élevée</p>
                <p className="text-sm text-muted-foreground">
                  Optimiser les requêtes de base de données et implémenter la mise en cache
                </p>
              </div>
            )}
            
            {metrics.cacheHitRate < 85 && (
              <div className="p-3 border-l-4 border-secondary bg-secondary/10">
                <p className="font-medium">Taux de cache sous-optimal</p>
                <p className="text-sm text-muted-foreground">
                  Ajuster les stratégies de mise en cache pour améliorer les performances
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};