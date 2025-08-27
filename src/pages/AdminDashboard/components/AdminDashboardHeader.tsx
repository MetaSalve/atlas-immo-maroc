
import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { useTranslation } from '@/i18n';

interface AdminDashboardHeaderProps {
  onRefresh?: () => void;
}

export const AdminDashboardHeader = ({ onRefresh }: AdminDashboardHeaderProps = {}) => {
  const { t } = useTranslation();
  const [refreshInterval, setRefreshInterval] = useState<string>('off');
  
  const handleRefreshChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRefreshInterval(e.target.value);
    // Cette fonction serait utilisée pour configurer l'intervalle de rafraîchissement
    // dans un composant parent si nécessaire
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-bold">Tableau de bord administrateur</h1>
      
      <div className="flex items-center gap-2">
        <select 
          className="px-3 py-1 border rounded-md bg-background text-sm"
          value={refreshInterval}
          onChange={handleRefreshChange}
        >
          <option value="off">Refresh: Off</option>
          <option value="30">30 secondes</option>
          <option value="60">1 minute</option>
          <option value="300">5 minutes</option>
        </select>
        
        <button 
          onClick={onRefresh}
          className="flex items-center gap-1 px-3 py-1 border rounded-md bg-background text-sm hover:bg-muted"
        >
          <RefreshCw className="h-4 w-4" /> Actualiser
        </button>
      </div>
    </div>
  );
};
