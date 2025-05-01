import { HomePage } from '@/pages/HomePage';
import { AuthPage } from '@/pages/AuthPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { PropertiesPage } from '@/pages/PropertiesPage';
import { PropertyDetailPage } from '@/pages/PropertyDetailPage';
import { FavoritesPage } from '@/pages/FavoritesPage';
import { AlertsPage } from '@/pages/AlertsPage';
import { NotificationsPage } from '@/pages/NotificationsPage';
import AdminPage from '@/pages/AdminPage';
import AdminDashboardPage from '@/pages/AdminDashboardPage';
import { CustomRouteObject } from './types';

export const routes: CustomRouteObject[] = [
  {
    path: '/',
    element: <HomePage />,
    authRequired: false
  },
  {
    path: '/auth',
    element: <AuthPage />,
    authRequired: false
  },
  {
    path: '/profile',
    element: <ProfilePage />,
    authRequired: true
  },
  {
    path: '/properties',
    element: <PropertiesPage />,
    authRequired: false
  },
  {
    path: '/properties/:id',
    element: <PropertyDetailPage />,
    authRequired: false
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
  // Route admin existante
  {
    path: '/admin',
    element: <AdminPage />,
    authRequired: true
  },
  
  // Nouvelle route pour le tableau de bord admin
  {
    path: '/admin/dashboard',
    element: <AdminDashboardPage />,
    authRequired: true
  }
];
