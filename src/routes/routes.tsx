
import React, { lazy, Suspense } from 'react';
import { LoadingFallback } from '@/components/common/LoadingFallback';
import { NotFound } from '@/components/common/NotFound';
import { CustomRouteObject } from './types';

// Direct imports for critical pages to avoid lazy loading issues
import Index from '@/pages/Index';
import HomePage from '@/pages/HomePage';

// Lazy load other pages to improve initial load performance
const AuthPage = lazy(() => import('@/pages/AuthPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const PropertyDetailPage = lazy(() => import('@/pages/PropertyDetailPage'));
const FavoritesPage = lazy(() => import('@/pages/FavoritesPage'));
const AlertsPage = lazy(() => import('@/pages/AlertsPage'));
const AdminDashboardPage = lazy(() => import('@/pages/AdminDashboard'));
const PropertiesPage = lazy(() => import('@/pages/PropertiesPage'));
const NotificationsPage = lazy(() => import('@/pages/NotificationsPage'));
const SubscriptionPage = lazy(() => import('@/pages/SubscriptionPage'));
const PaymentPage = lazy(() => import('@/pages/PaymentPage'));
const PaymentSuccessPage = lazy(() => import('@/pages/PaymentSuccessPage'));
const ResetPasswordPage = lazy(() => import('@/pages/ResetPasswordPage'));

// Wrap lazy-loaded components with Suspense
const withSuspense = (Component) => (
  <Suspense fallback={<LoadingFallback />}>
    <Component />
  </Suspense>
);

const routes: CustomRouteObject[] = [
  {
    path: '/',
    element: <Index />,
    index: true
  },
  {
    path: '/home',
    element: <HomePage /> // Direct import for HomePage
  },
  {
    path: '/auth',
    element: withSuspense(AuthPage)
  },
  {
    path: '/auth/callback',
    element: withSuspense(AuthPage)
  },
  {
    path: '/auth/reset-password',
    element: withSuspense(ResetPasswordPage)
  },
  {
    path: '/profile',
    element: withSuspense(ProfilePage),
    authRequired: true
  },
  {
    path: '/properties',
    element: withSuspense(PropertiesPage)
  },
  {
    path: '/property/:id',
    element: withSuspense(PropertyDetailPage)
  },
  {
    path: '/favorites',
    element: withSuspense(FavoritesPage),
    authRequired: true
  },
  {
    path: '/alerts',
    element: withSuspense(AlertsPage),
    authRequired: true
  },
  {
    path: '/notifications',
    element: withSuspense(NotificationsPage),
    authRequired: true
  },
  {
    path: '/subscription',
    element: withSuspense(SubscriptionPage),
    authRequired: true
  },
  {
    path: '/payment',
    element: withSuspense(PaymentPage),
    authRequired: true
  },
  {
    path: '/payment-success',
    element: withSuspense(PaymentSuccessPage),
    authRequired: true
  },
  {
    path: '/admin',
    element: withSuspense(AdminDashboardPage),
    authRequired: true,
    adminRequired: true
  },
  {
    path: '*',
    element: <NotFound />
  }
];

export default routes;
