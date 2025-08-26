
import React from 'react';
import { useTranslation } from '@/i18n';
import { AdminDashboardTabs } from './components/AdminDashboardTabs';
import { AdminDashboardHeader } from './components/AdminDashboardHeader';
import { DocumentHead } from '@/components/common/DocumentHead';

const AdminDashboardPage = () => {
  const { t } = useTranslation();

  return (
    <div className="py-6">
      <DocumentHead title={`${t('admin.dashboard')} | AlertImmo`} />
      
      <AdminDashboardHeader />
      <AdminDashboardTabs />
    </div>
  );
};

export default AdminDashboardPage;
