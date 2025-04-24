
import { lazy } from 'react';
import { LazyComponent } from '@/components/common/LazyComponent';
import { PageTransition } from '@/components/common/PageTransition';
import { CustomRouteObject } from './types';

// Lazy load les pages
const HomePage = lazy(() => import('@/pages/HomePage'));
const SearchPage = lazy(() => import('@/pages/SearchPage'));
const PropertyDetailPage = lazy(() => import('@/pages/PropertyDetailPage'));
const AuthPage = lazy(() => import('@/pages/AuthPage'));
const ResetPasswordPage = lazy(() => import('@/pages/ResetPasswordPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const FavoritesPage = lazy(() => import('@/pages/FavoritesPage'));
const AlertsPage = lazy(() => import('@/pages/AlertsPage'));
const SubscriptionPage = lazy(() => import('@/pages/SubscriptionPage'));
const Index = lazy(() => import('@/pages/Index'));

export const routes: CustomRouteObject[] = [
  {
    path: '/',
    element: (
      <LazyComponent>
        <PageTransition>
          <Index />
        </PageTransition>
      </LazyComponent>
    ),
  },
  {
    path: '/home',
    element: (
      <LazyComponent>
        <PageTransition>
          <HomePage />
        </PageTransition>
      </LazyComponent>
    ),
  },
  {
    path: '/search',
    element: (
      <LazyComponent>
        <PageTransition>
          <SearchPage />
        </PageTransition>
      </LazyComponent>
    ),
  },
  {
    path: '/properties/:id',
    element: (
      <LazyComponent>
        <PageTransition>
          <PropertyDetailPage />
        </PageTransition>
      </LazyComponent>
    ),
  },
  {
    path: '/auth',
    element: (
      <LazyComponent>
        <PageTransition>
          <AuthPage />
        </PageTransition>
      </LazyComponent>
    ),
    authRequired: false,
  },
  {
    path: '/auth/reset-password',
    element: (
      <LazyComponent>
        <PageTransition>
          <ResetPasswordPage />
        </PageTransition>
      </LazyComponent>
    ),
    authRequired: false,
  },
  {
    path: '/profile',
    element: (
      <LazyComponent>
        <PageTransition>
          <ProfilePage />
        </PageTransition>
      </LazyComponent>
    ),
    authRequired: true,
  },
  {
    path: '/favorites',
    element: (
      <LazyComponent>
        <PageTransition>
          <FavoritesPage />
        </PageTransition>
      </LazyComponent>
    ),
    authRequired: true,
  },
  {
    path: '/alerts',
    element: (
      <LazyComponent>
        <PageTransition>
          <AlertsPage />
        </PageTransition>
      </LazyComponent>
    ),
    authRequired: true,
  },
  {
    path: '/subscription',
    element: (
      <LazyComponent>
        <PageTransition>
          <SubscriptionPage />
        </PageTransition>
      </LazyComponent>
    ),
    authRequired: true,
  },
];
