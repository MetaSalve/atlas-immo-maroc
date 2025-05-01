
import React from 'react';
import { Zap, Server, Database, Activity, AreaChart, AlertTriangle } from 'lucide-react';
import { SystemMetric } from '../../hooks/useDashboardData';

interface SystemMetricsListProps {
  metrics: SystemMetric[];
}

export const SystemMetricsList = ({ metrics }: SystemMetricsListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {metrics.map((metric, index) => (
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
  );
};
