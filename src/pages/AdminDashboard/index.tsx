
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from '@/i18n';
import { AdminDashboardTabs } from './components/AdminDashboardTabs';
import { AdminDashboardHeader } from './components/AdminDashboardHeader';

const AdminDashboardPage = () => {
  const { t } = useTranslation();

  return (
    <div className="py-6">
      <Helmet>
        <title>{t('admin.dashboard')} | AlertImmo</title>
      </Helmet>
      
      <AdminDashboardHeader />
      <AdminDashboardTabs />
    </div>
  );
};

export default AdminDashboardPage;
