
import React from 'react';
import HomePage from '@/pages/HomePage';
import AuthPage from '@/pages/AuthPage'; 
import ProfilePage from '@/pages/ProfilePage';
import PropertyDetailPage from '@/pages/PropertyDetailPage';
import FavoritesPage from '@/pages/FavoritesPage';
import AlertsPage from '@/pages/AlertsPage';
import NotificationsPage from '@/pages/NotificationsPage';
import AdminDashboardPage from '@/pages/AdminDashboard';
import PropertiesPage from '@/pages/PropertiesPage';
import SearchPage from '@/pages/SearchPage';
import { NotFound } from '@/components/common/NotFound';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

const routes = [
  {
    path: '/',
    element: <HomePage />
  },
  {
    path: '/auth',
    element: <AuthPage />
  },
  {
    path: '/profile',
    element: <ProtectedRoute element={<ProfilePage />} />
  },
  {
    path: '/properties',
    element: <PropertiesPage />
  },
  {
    path: '/search',
    element: <SearchPage />
  },
  {
    path: '/property/:id',
    element: <PropertyDetailPage />
  },
  {
    path: '/favorites',
    element: <ProtectedRoute element={<FavoritesPage />} />
  },
  {
    path: '/alerts',
    element: <ProtectedRoute element={<AlertsPage />} />
  },
  {
    path: '/notifications',
    element: <ProtectedRoute element={<NotificationsPage />} />
  },
  {
    path: '/admin',
    element: <ProtectedRoute element={<AdminDashboardPage />} />
  }
];

export default routes;
