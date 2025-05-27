
import React from 'react';
import HomePage from '@/pages/HomePage';
import AuthPage from '@/pages/AuthPage'; 
import ProfilePage from '@/pages/ProfilePage';
import PropertyDetailPage from '@/pages/PropertyDetailPage';
import FavoritesPage from '@/pages/FavoritesPage';
import AlertsPage from '@/pages/AlertsPage';
import NotificationsPage from '@/pages/NotificationsPage';
import AdminDashboardPage from '@/pages/AdminDashboard';
import { NotFound } from '@/components/common/NotFound';
import { RouteObject } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

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
    element: <ProtectedRoute element={<ProfilePage />} />
  },
  {
    path: '/properties',
    element: <HomePage /> // Utilisation de HomePage temporairement en attendant PropertiesPage
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
  },
  {
    path: '*',
    element: <NotFound />
  }
];

export default routes;
