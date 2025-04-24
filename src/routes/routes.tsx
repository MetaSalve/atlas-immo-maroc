
import React, { Suspense } from "react";
import { Navigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { LoadingFallback } from "@/components/common/LoadingFallback";

// Lazy loaded components
const HomePage = React.lazy(() => import("@/pages/HomePage"));
const SearchPage = React.lazy(() => import("@/pages/SearchPage"));
const PropertyDetailPage = React.lazy(() => import("@/pages/PropertyDetailPage"));
const FavoritesPage = React.lazy(() => import("@/pages/FavoritesPage"));
const AlertsPage = React.lazy(() => import("@/pages/AlertsPage"));
const AdminPage = React.lazy(() => import("@/pages/AdminPage"));
const AuthPage = React.lazy(() => import("@/pages/AuthPage"));
const ResetPasswordPage = React.lazy(() => import("@/pages/ResetPasswordPage"));
const SubscriptionPage = React.lazy(() => import("@/pages/SubscriptionPage"));
const PaymentPage = React.lazy(() => import("@/pages/PaymentPage"));
const ProfilePage = React.lazy(() => import("@/pages/ProfilePage"));
const NotFound = React.lazy(() => import("@/pages/NotFound"));
const LegalPage = React.lazy(() => import("@/pages/LegalPage"));
const PrivacyPage = React.lazy(() => import("@/pages/PrivacyPage"));

export const routes = [
  {
    path: "/",
    element: <Navigate to="/home" replace />
  },
  {
    path: "/auth",
    element: <AuthPage />,
    authRequired: false
  },
  {
    path: "/auth/reset-password",
    element: <ResetPasswordPage />,
    authRequired: false
  },
  {
    element: <Layout />,
    children: [
      { path: "/home", element: <HomePage /> },
      { path: "/search", element: <SearchPage /> },
      {
        path: "/properties/:id",
        element: <PropertyDetailPage />,
        authRequired: true
      },
      {
        path: "/favorites",
        element: <FavoritesPage />,
        authRequired: true
      },
      {
        path: "/alerts",
        element: <AlertsPage />,
        authRequired: true
      },
      {
        path: "/admin",
        element: <AdminPage />,
        authRequired: true
      },
      {
        path: "/subscription",
        element: <SubscriptionPage />,
        authRequired: true
      },
      {
        path: "/payment",
        element: <PaymentPage />,
        authRequired: true
      },
      {
        path: "/profile",
        element: <ProfilePage />,
        authRequired: true
      },
      { path: "/legal", element: <LegalPage /> },
      { path: "/privacy", element: <PrivacyPage /> },
      { path: "*", element: <NotFound /> }
    ]
  }
];

