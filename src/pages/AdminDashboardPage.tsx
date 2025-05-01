
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  Users, Activity, AlertTriangle, Bell, Server, LineChart,
  Zap, AreaChart, Database, FileCode, RefreshCw
} from 'lucide-react';
import { 
  LineChart as ReLineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface AppMetric {
  name: string;
  value: number;
  change?: number;
  trend?: 'up' | 'down' | 'stable';
}

interface SystemMetric {
  name: string;
  value: number;
  unit: string;
  warning?: boolean;
  critical?: boolean;
}

interface TimeSeriesData {
  timestamp: string;
  users?: number;
  requests?: number;
  errors?: number;
  properties?: number;
  subscriptions?: number;
}

interface ErrorLog {
  id: string;
  timestamp: string;
  error_message: string;
  user_id?: string;
  path?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

const AdminDashboardPage = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');
  
  // État pour les métriques
  const [appMetrics, setAppMetrics] = useState<AppMetric[]>([]);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetric[]>([]);
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([]);
  const [errorLogs, setErrorLogs] = useState<ErrorLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState<number | null>(null);
  
  // Couleurs pour les graphiques
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
  
  // Générer des données fictives pour la démo
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
  
  // Charger les données au montage
  useEffect(() => {
    generateDemoData();
    
    // En production, on chargerait les vraies données
    // fetchDashboardData();
  }, []);
  
  // Gestion de l'auto-refresh
  useEffect(() => {
    if (refreshInterval) {
      const interval = setInterval(() => {
        generateDemoData();
      }, refreshInterval * 1000);
      
      return () => clearInterval(interval);
    }
  }, [refreshInterval]);
  
  // Format des dates
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  // Format des heures pour l'axe X
  const formatHour = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getHours()}:00`;
  };

  return (
    <div className="py-6">
      <Helmet>
        <title>Tableau de bord administrateur | AlertImmo</title>
      </Helmet>
      
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Tableau de bord administrateur</h1>
        
        <div className="flex items-center gap-2">
          <select 
            className="px-3 py-1 border rounded-md bg-background text-sm"
            value={refreshInterval?.toString() || 'off'}
            onChange={(e) => setRefreshInterval(e.target.value === 'off' ? null : parseInt(e.target.value))}
          >
            <option value="off">Refresh: Off</option>
            <option value="30">30 secondes</option>
            <option value="60">1 minute</option>
            <option value="300">5 minutes</option>
          </select>
          
          <button 
            onClick={() => generateDemoData()}
            className="flex items-center gap-1 px-3 py-1 border rounded-md bg-background text-sm hover:bg-muted"
          >
            <RefreshCw className="h-4 w-4" /> Actualiser
          </button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="errors">Erreurs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          {/* Cartes de métriques principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {appMetrics.map((metric, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm text-muted-foreground">{metric.name}</p>
                    <div className="flex items-end justify-between">
                      <p className="text-3xl font-bold">{metric.value.toLocaleString()}</p>
                      {metric.change && (
                        <div className={`flex items-center ${metric.trend === 'up' ? 'text-green-600' : metric.trend === 'down' ? 'text-red-600' : 'text-yellow-600'}`}>
                          {metric.trend === 'up' ? '↑' : metric.trend === 'down' ? '↓' : '→'}
                          <span className="ml-1 text-sm">{metric.change}%</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Graphiques */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Activité utilisateurs (24h)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={timeSeriesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="timestamp" 
                        tickFormatter={formatHour}
                        interval={3}
                      />
                      <YAxis />
                      <Tooltip 
                        labelFormatter={(label) => formatDateTime(label)} 
                        formatter={(value: number) => [value, 'Utilisateurs']}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="users" 
                        stroke="#8884d8" 
                        name="Utilisateurs" 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="requests" 
                        stroke="#82ca9d" 
                        name="Requêtes" 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Erreurs et performances</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={timeSeriesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="timestamp" 
                        tickFormatter={formatHour}
                        interval={3}
                      />
                      <YAxis />
                      <Tooltip 
                        labelFormatter={(label) => formatDateTime(label)} 
                      />
                      <Bar dataKey="errors" fill="#ff0000" name="Erreurs" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Métriques système */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">État du système</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {systemMetrics.map((metric, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-2">
                      {metric.name === 'Utilisation CPU' && <Zap className="h-5 w-5 text-yellow-500" />}
                      {metric.name === 'Utilisation mémoire' && <Server className="h-5 w-5 text-blue-500" />}
                      {metric.name === 'Espace disque' && <Database className="h-5 w-5 text-purple-500" />}
                      {metric.name === 'Temps de réponse API' && <Activity className="h-5 w-5 text-green-500" />}
                      {metric.name === 'Temps de réponse DB' && <AreaChart className="h-5 w-5 text-cyan-500" />}
                      {metric.name === 'Taux d\'erreurs' && <AlertTriangle className="h-5 w-5 text-red-500" />}
                      <span>{metric.name}</span>
                    </div>
                    <span className={`font-bold ${
                      metric.critical ? 'text-red-600' : 
                      metric.warning ? 'text-yellow-600' : 
                      'text-green-600'
                    }`}>
                      {metric.value}{metric.unit}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Erreurs récentes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Erreurs récentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg divide-y">
                {errorLogs.slice(0, 3).map((log) => (
                  <div key={log.id} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`inline-block w-2 h-2 rounded-full ${
                          log.severity === 'critical' ? 'bg-red-500' :
                          log.severity === 'high' ? 'bg-orange-500' :
                          log.severity === 'medium' ? 'bg-yellow-500' :
                          'bg-blue-500'
                        }`}></span>
                        <span className="font-medium">{log.path}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{formatDateTime(log.timestamp)}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{log.error_message}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Statistiques utilisateurs</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">Détails sur les utilisateurs, leur activité et leur engagement.</p>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-medium mb-4">Distribution des abonnements</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Gratuit', value: 958 },
                            { name: 'Premium', value: 287 },
                          ]}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {[0, 1].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-4">Nouveaux utilisateurs (30 jours)</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={Array.from({ length: 30 }, (_, i) => ({
                        date: new Date(Date.now() - (29-i) * 86400000).toISOString().split('T')[0],
                        count: Math.floor(Math.random() * 20) + 5
                      }))}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="date" 
                          interval={4}
                        />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#82ca9d" name="Nouveaux utilisateurs" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <div>
                <h3 className="font-medium mb-4">Activité par région</h3>
                <div className="border rounded-lg p-4">
                  <p className="text-center text-muted-foreground">Carte interactive des utilisateurs par région à intégrer ici</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Performance API</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={Array.from({ length: 24 }, (_, i) => ({
                      hour: new Date(Date.now() - (23-i) * 3600000).toISOString(),
                      responseTime: Math.floor(Math.random() * 200) + 150,
                      requestCount: Math.floor(Math.random() * 500) + 1000
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="hour" 
                        tickFormatter={formatHour}
                        interval={3}
                      />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip labelFormatter={(label) => formatDateTime(label)} />
                      <Line 
                        yAxisId="left"
                        type="monotone" 
                        dataKey="responseTime" 
                        stroke="#8884d8" 
                        name="Temps de réponse (ms)" 
                      />
                      <Line 
                        yAxisId="right"
                        type="monotone" 
                        dataKey="requestCount" 
                        stroke="#82ca9d" 
                        name="Nombre de requêtes" 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Performance base de données</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={Array.from({ length: 24 }, (_, i) => ({
                      hour: new Date(Date.now() - (23-i) * 3600000).toISOString(),
                      queryTime: Math.floor(Math.random() * 100) + 50,
                      queryCount: Math.floor(Math.random() * 1000) + 3000
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="hour" 
                        tickFormatter={formatHour}
                        interval={3}
                      />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip labelFormatter={(label) => formatDateTime(label)} />
                      <Line 
                        yAxisId="left"
                        type="monotone" 
                        dataKey="queryTime" 
                        stroke="#8884d8" 
                        name="Temps de requête (ms)" 
                      />
                      <Line 
                        yAxisId="right"
                        type="monotone" 
                        dataKey="queryCount" 
                        stroke="#82ca9d" 
                        name="Nombre de requêtes" 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Performances par endpoint</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Endpoint</th>
                      <th className="text-left py-3 px-4">Méthode</th>
                      <th className="text-left py-3 px-4">Temps moyen</th>
                      <th className="text-left py-3 px-4">p95</th>
                      <th className="text-left py-3 px-4">Erreurs</th>
                      <th className="text-left py-3 px-4">Requêtes/min</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">/api/properties</td>
                      <td className="py-3 px-4">GET</td>
                      <td className="py-3 px-4">150 ms</td>
                      <td className="py-3 px-4">320 ms</td>
                      <td className="py-3 px-4">0.2%</td>
                      <td className="py-3 px-4">45</td>
                    </tr>
                    <tr className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">/api/search</td>
                      <td className="py-3 px-4">POST</td>
                      <td className="py-3 px-4">210 ms</td>
                      <td className="py-3 px-4">450 ms</td>
                      <td className="py-3 px-4">0.5%</td>
                      <td className="py-3 px-4">32</td>
                    </tr>
                    <tr className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">/api/auth</td>
                      <td className="py-3 px-4">POST</td>
                      <td className="py-3 px-4">90 ms</td>
                      <td className="py-3 px-4">220 ms</td>
                      <td className="py-3 px-4">1.2%</td>
                      <td className="py-3 px-4">12</td>
                    </tr>
                    <tr className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">/api/subscriptions</td>
                      <td className="py-3 px-4">GET</td>
                      <td className="py-3 px-4">130 ms</td>
                      <td className="py-3 px-4">280 ms</td>
                      <td className="py-3 px-4">0.1%</td>
                      <td className="py-3 px-4">8</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="errors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Logs d'erreurs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Timestamp</th>
                      <th className="text-left py-3 px-4">Sévérité</th>
                      <th className="text-left py-3 px-4">Message</th>
                      <th className="text-left py-3 px-4">Chemin</th>
                      <th className="text-left py-3 px-4">Utilisateur</th>
                    </tr>
                  </thead>
                  <tbody>
                    {errorLogs.map((log) => (
                      <tr key={log.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4">{formatDateTime(log.timestamp)}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            log.severity === 'critical' ? 'bg-red-100 text-red-800' :
                            log.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                            log.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {log.severity === 'critical' ? 'Critique' :
                             log.severity === 'high' ? 'Élevée' :
                             log.severity === 'medium' ? 'Moyenne' : 'Basse'
                            }
                          </span>
                        </td>
                        <td className="py-3 px-4">{log.error_message}</td>
                        <td className="py-3 px-4">{log.path || '-'}</td>
                        <td className="py-3 px-4">{log.user_id || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Graphique d'erreurs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={Array.from({ length: 24 }, (_, i) => ({
                    hour: new Date(Date.now() - (23-i) * 3600000).toISOString(),
                    errors400: Math.floor(Math.random() * 10),
                    errors500: Math.floor(Math.random() * 5),
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="hour" 
                      tickFormatter={formatHour}
                      interval={3}
                    />
                    <YAxis />
                    <Tooltip labelFormatter={(label) => formatDateTime(label)} />
                    <Line 
                      type="monotone" 
                      dataKey="errors400" 
                      stroke="#ff9800" 
                      name="Erreurs 400" 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="errors500" 
                      stroke="#f44336" 
                      name="Erreurs 500" 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboardPage;
