
import React from 'react';
import { ErrorLog } from '../../hooks/useDashboardData';
import { formatDateTime } from '../../utils/dateUtils';

interface RecentErrorsListProps {
  errors: ErrorLog[];
}

export const RecentErrorsList = ({ errors }: RecentErrorsListProps) => {
  if (errors.length === 0) {
    return <p className="text-center text-muted-foreground">Aucune erreur récente</p>;
  }

  return (
    <div className="border rounded-lg divide-y">
      {errors.map((log) => (
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
  );
};
