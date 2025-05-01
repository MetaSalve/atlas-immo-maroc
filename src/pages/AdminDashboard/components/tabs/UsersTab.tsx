
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  PieChart, 
  Pie, 
  ResponsiveContainer, 
  Tooltip, 
  Cell,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis
} from 'recharts';

export const UsersTab = () => {
  // Couleurs pour les graphiques
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
  
  return (
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
  );
};
