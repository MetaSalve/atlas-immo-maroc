import { lazy } from 'react';
import { LazyComponent } from '@/components/common/LazyComponent';
import { PageTransition } from '@/components/common/PageTransition';
import { RouteObject } from 'react-router-dom';

// Lazy load les pages
const HomePage = lazy(() => import('@/pages/HomePage'));
const SearchPage = lazy(() => import('@/pages/SearchPage'));
const PropertyDetailPage = lazy(() => import('@/pages/PropertyDetailPage'));
const AuthPage = lazy(() => import('@/pages/AuthPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const FavoritesPage = lazy(() => import('@/pages/FavoritesPage'));
const AlertsPage = lazy(() => import('@/pages/AlertsPage'));
const SubscriptionPage = lazy(() => import('@/pages/SubscriptionPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const TwoFactorAuthPage = lazy(() => import('@/pages/TwoFactorAuthPage'));
const AccountDeletionPage = lazy(() => import('@/pages/AccountDeletionPage'));

export const routes: RouteObject[] = [
  {
    path: '/',
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
  },
  {
    path: '/contact',
    element: (
      <LazyComponent>
        <PageTransition>
          <ContactPage />
        </PageTransition>
      </LazyComponent>
    ),
  },
  {
    path: '/two-factor-auth',
    element: (
      <LazyComponent>
        <PageTransition>
          <TwoFactorAuthPage />
        </PageTransition>
      </LazyComponent>
    ),
  },
  {
    path: '/account-deletion',
    element: (
      <LazyComponent>
        <PageTransition>
          <AccountDeletionPage />
        </PageTransition>
      </LazyComponent>
    ),
  },
];
