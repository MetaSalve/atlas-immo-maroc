
import React from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from '@/components/ui/card';
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

export const PerformanceTab = () => {
  return (
    <>
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
          <PerformanceTable />
        </CardContent>
      </Card>
    </>
  );
};

const PerformanceTable = () => {
  return (
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
  );
};
