
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { formatDateTime, formatHour } from '../../utils/dateUtils';
import { ErrorLog } from '../../hooks/useDashboardData';

interface ErrorsTabProps {
  errorLogs?: ErrorLog[];
}

export const ErrorsTab = ({ errorLogs = [] }: ErrorsTabProps) => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Logs d'erreurs</CardTitle>
        </CardHeader>
        <CardContent>
          <ErrorLogsTable errors={errorLogs} />
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
    </>
  );
};

interface ErrorLogsTableProps {
  errors: ErrorLog[];
}

const ErrorLogsTable = ({ errors }: ErrorLogsTableProps) => {
  if (!errors.length) {
    return <p className="text-center py-4">Aucune erreur à afficher</p>;
  }

  return (
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
          {errors.map((log) => (
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
  );
};
