
import React from 'react';
import { useTranslation } from '@/i18n';
import { AdminDashboardTabs } from './components/AdminDashboardTabs';
import { AdminDashboardHeader } from './components/AdminDashboardHeader';
import { MetaTags } from '@/components/common/MetaTags';

const AdminDashboardPage = () => {
  const { t } = useTranslation();

  return (
    <div className="py-6">
      <MetaTags title={`${t('admin.dashboard')} | AlertImmo`} />
      
      <AdminDashboardHeader />
      <AdminDashboardTabs />
    </div>
  );
};

export default AdminDashboardPage;
