
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OverviewTab } from './tabs/OverviewTab';
import { UsersTab } from './tabs/UsersTab';
import { PerformanceTab } from './tabs/PerformanceTab';
import { ErrorsTab } from './tabs/ErrorsTab';
import { useDashboardData } from '../hooks/useDashboardData';

export const AdminDashboardTabs = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { 
    appMetrics, 
    systemMetrics, 
    timeSeriesData, 
    errorLogs, 
    isLoading, 
    refreshData 
  } = useDashboardData();
  
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="mb-4">
        <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
        <TabsTrigger value="users">Utilisateurs</TabsTrigger>
        <TabsTrigger value="performance">Performance</TabsTrigger>
        <TabsTrigger value="errors">Erreurs</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview" className="space-y-4">
        <OverviewTab 
          appMetrics={appMetrics}
          systemMetrics={systemMetrics}
          timeSeriesData={timeSeriesData}
          errorLogs={errorLogs}
          isLoading={isLoading}
        />
      </TabsContent>
      
      <TabsContent value="users" className="space-y-4">
        <UsersTab />
      </TabsContent>
      
      <TabsContent value="performance" className="space-y-4">
        <PerformanceTab />
      </TabsContent>
      
      <TabsContent value="errors" className="space-y-4">
        <ErrorsTab errorLogs={errorLogs} />
      </TabsContent>
    </Tabs>
  );
};
