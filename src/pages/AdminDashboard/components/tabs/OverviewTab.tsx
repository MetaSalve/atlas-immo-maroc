
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Activity, AlertTriangle, Database, AreaChart, Server, Zap } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { AppMetric, SystemMetric, TimeSeriesData, ErrorLog } from '../../hooks/useDashboardData';
import { formatDateTime, formatHour } from '../../utils/dateUtils';
import { MetricCards } from '../metrics/MetricCards';
import { SystemMetricsList } from '../metrics/SystemMetricsList';
import { RecentErrorsList } from '../errors/RecentErrorsList';

interface OverviewTabProps {
  appMetrics: AppMetric[];
  systemMetrics: SystemMetric[];
  timeSeriesData: TimeSeriesData[];
  errorLogs: ErrorLog[];
  isLoading: boolean;
}

export const OverviewTab = ({
  appMetrics,
  systemMetrics,
  timeSeriesData,
  errorLogs,
  isLoading
}: OverviewTabProps) => {
  if (isLoading) {
    return <div className="flex justify-center p-8">Chargement des données...</div>;
  }

  return (
    <>
      {/* Cartes de métriques principales */}
      <MetricCards metrics={appMetrics} />
      
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
          <SystemMetricsList metrics={systemMetrics} />
        </CardContent>
      </Card>
      
      {/* Erreurs récentes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Erreurs récentes</CardTitle>
        </CardHeader>
        <CardContent>
          <RecentErrorsList errors={errorLogs.slice(0, 3)} />
        </CardContent>
      </Card>
    </>
  );
};
