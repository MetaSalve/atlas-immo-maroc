
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AppMetric } from '../../hooks/useDashboardData';

interface MetricCardsProps {
  metrics: AppMetric[];
}

export const MetricCards = ({ metrics }: MetricCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="flex flex-col gap-1">
              <p className="text-sm text-muted-foreground">{metric.name}</p>
              <div className="flex items-end justify-between">
                <p className="text-3xl font-bold">{metric.value != null ? metric.value.toLocaleString() : '0'}</p>
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
  );
};
