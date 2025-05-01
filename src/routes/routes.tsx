
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
import { NotFound } from '@/components/common/NotFound';
import { RouteObject } from 'react-router-dom';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <HomePage />,
    index: true
  },
  {
    path: '/auth',
    element: <AuthPage />
  },
  {
    path: '/profile',
    element: <ProfilePage />
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
    element: <FavoritesPage />
  },
  {
    path: '/alerts',
    element: <AlertsPage />
  },
  {
    path: '/notifications',
    element: <NotificationsPage />
  },
  {
    path: '/subscription',
    element: <SubscriptionPage />
  },
  {
    path: '/payment',
    element: <PaymentPage />
  },
  {
    path: '/payment-success',
    element: <PaymentSuccessPage />
  },
  {
    path: '/admin',
    element: <AdminDashboardPage />
  },
  {
    path: '*',
    element: <NotFound />
  }
];

export default routes;
