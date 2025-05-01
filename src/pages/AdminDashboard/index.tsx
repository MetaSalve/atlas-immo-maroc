
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { AdminDashboardTabs } from './components/AdminDashboardTabs';
import { AdminDashboardHeader } from './components/AdminDashboardHeader';

const AdminDashboardPage = () => {
  const { t } = useTranslation();

  return (
    <div className="py-6">
      <Helmet>
        <title>Tableau de bord administrateur | AlertImmo</title>
      </Helmet>
      
      <AdminDashboardHeader />
      <AdminDashboardTabs />
    </div>
  );
};

export default AdminDashboardPage;
