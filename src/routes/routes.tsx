
import React from 'react';
import HomePage from '@/pages/HomePage';
import AuthPage from '@/pages/AuthPage'; 
import ProfilePage from '@/pages/ProfilePage';
import PropertyDetailPage from '@/pages/PropertyDetailPage';
import FavoritesPage from '@/pages/FavoritesPage';
import AlertsPage from '@/pages/AlertsPage';
import AdminDashboardPage from '@/pages/AdminDashboard';
import PropertiesPage from '@/pages/PropertiesPage';
import NotificationsPage from '@/pages/NotificationsPage';
import SubscriptionPage from '@/pages/SubscriptionPage';
import PaymentPage from '@/pages/PaymentPage';
import PaymentSuccessPage from '@/pages/PaymentSuccessPage';
import ResetPasswordPage from '@/pages/ResetPasswordPage';
import { NotFound } from '@/components/common/NotFound';
import { CustomRouteObject } from './types';
import Index from '@/pages/Index';

const routes: CustomRouteObject[] = [
  {
    path: '/',
    element: <Index />,
    index: true
  },
  {
    path: '/home',
    element: <HomePage />
  },
  {
    path: '/auth',
    element: <AuthPage />
  },
  {
    path: '/auth/reset-password',
    element: <ResetPasswordPage />
  },
  {
    path: '/profile',
    element: <ProfilePage />,
    authRequired: true
  },
  {
    path: '/properties',
    element: <PropertiesPage />
  },
  {
    path: '/property/:id',
    element: <PropertyDetailPage />
  },
  {
    path: '/favorites',
    element: <FavoritesPage />,
    authRequired: true
  },
  {
    path: '/alerts',
    element: <AlertsPage />,
    authRequired: true
  },
  {
    path: '/notifications',
    element: <NotificationsPage />,
    authRequired: true
  },
  {
    path: '/subscription',
    element: <SubscriptionPage />,
    authRequired: true
  },
  {
    path: '/payment',
    element: <PaymentPage />,
    authRequired: true
  },
  {
    path: '/payment-success',
    element: <PaymentSuccessPage />,
    authRequired: true
  },
  {
    path: '/admin',
    element: <AdminDashboardPage />,
    authRequired: true,
    adminRequired: true
  },
  {
    path: '*',
    element: <NotFound />
  }
];

export default routes;
