import React, { useEffect, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "sonner";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { AuthProvider, useAuth } from "./providers/AuthProvider";
import { SubscriptionProvider } from "./providers/SubscriptionProvider";
import { NotificationsProvider } from "./providers/NotificationsProvider";
import { configureSecurityHeaders, checkHttpsConfiguration, checkFrameProtection, runSecurityChecks } from "./utils/securityHeaders";

const HomePage = React.lazy(() => import("./pages/HomePage"));
const SearchPage = React.lazy(() => import("./pages/SearchPage"));
const PropertyDetailPage = React.lazy(() => import("./pages/PropertyDetailPage"));
const FavoritesPage = React.lazy(() => import("./pages/FavoritesPage"));
const AlertsPage = React.lazy(() => import("./pages/AlertsPage"));
const AdminPage = React.lazy(() => import("./pages/AdminPage"));
const AuthPage = React.lazy(() => import("./pages/AuthPage"));
const ResetPasswordPage = React.lazy(() => import("./pages/ResetPasswordPage"));
const SubscriptionPage = React.lazy(() => import("./pages/SubscriptionPage"));
const PaymentPage = React.lazy(() => import("./pages/PaymentPage"));
const ProfilePage = React.lazy(() => import("./pages/ProfilePage"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const LegalPage = React.lazy(() => import("./pages/LegalPage"));
const PrivacyPage = React.lazy(() => import("./pages/PrivacyPage"));

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

const ProtectedRoute = ({ element, requiresAuth = true }: { element: React.ReactNode, requiresAuth?: boolean }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return <LoadingFallback />;
  }
  
  if (requiresAuth && !user) {
    toast.info("Connexion requise", {
      description: "Veuillez vous connecter pour accéder à cette fonctionnalité",
      position: "top-center",
    });
    
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }
  
  if (!requiresAuth && user) {
    return <Navigate to="/" replace />;
  }
  
  return <>{element}</>;
};

const updateDocumentMeta = (title: string, description: string) => {
  document.title = title;
  
  let metaDescription = document.querySelector('meta[name="description"]');
  if (!metaDescription) {
    metaDescription = document.createElement('meta');
    metaDescription.setAttribute('name', 'description');
    document.head.appendChild(metaDescription);
  }
  metaDescription.setAttribute('content', description);
};

const App = () => {
  useEffect(() => {
    runSecurityChecks();
    updateDocumentMeta(
      'AlertImmo - Alertes immobilières en temps réel au Maroc',
      'Trouvez votre bien immobilier idéal au Maroc grâce à nos alertes personnalisées en temps réel. Appartements, maisons, villas et riads dans tout le Maroc.'
    );
  }, []);

  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <BrowserRouter>
            <AuthProvider>
              <SubscriptionProvider>
                <NotificationsProvider>
                  <Toaster />
                  <Sonner />
                  <Routes>
                    <Route path="/" element={<Navigate to="/home" replace />} />
                    <Route 
                      path="/auth" 
                      element={
                        <Suspense fallback={<LoadingFallback />}>
                          <ProtectedRoute element={<AuthPage />} requiresAuth={false} />
                        </Suspense>
                      } 
                    />
                    <Route 
                      path="/auth/reset-password" 
                      element={
                        <Suspense fallback={<LoadingFallback />}>
                          <ProtectedRoute element={<ResetPasswordPage />} requiresAuth={false} />
                        </Suspense>
                      } 
                    />
                    <Route element={<Layout />}>
                      <Route 
                        path="/home" 
                        element={
                          <Suspense fallback={<LoadingFallback />}>
                            <HomePage />
                          </Suspense>
                        } 
                      />
                      <Route 
                        path="/search" 
                        element={
                          <Suspense fallback={<LoadingFallback />}>
                            <SearchPage />
                          </Suspense>
                        } 
                      />
                      <Route 
                        path="/properties/:id" 
                        element={
                          <Suspense fallback={<LoadingFallback />}>
                            <ProtectedRoute element={<PropertyDetailPage />} />
                          </Suspense>
                        } 
                      />
                      <Route 
                        path="/favorites" 
                        element={
                          <Suspense fallback={<LoadingFallback />}>
                            <ProtectedRoute element={<FavoritesPage />} />
                          </Suspense>
                        } 
                      />
                      <Route 
                        path="/alerts" 
                        element={
                          <Suspense fallback={<LoadingFallback />}>
                            <ProtectedRoute element={<AlertsPage />} />
                          </Suspense>
                        } 
                      />
                      <Route 
                        path="/admin" 
                        element={
                          <Suspense fallback={<LoadingFallback />}>
                            <ProtectedRoute element={<AdminPage />} />
                          </Suspense>
                        } 
                      />
                      <Route 
                        path="/subscription" 
                        element={
                          <Suspense fallback={<LoadingFallback />}>
                            <ProtectedRoute element={<SubscriptionPage />} />
                          </Suspense>
                        } 
                      />
                      <Route 
                        path="/payment" 
                        element={
                          <Suspense fallback={<LoadingFallback />}>
                            <ProtectedRoute element={<PaymentPage />} />
                          </Suspense>
                        } 
                      />
                      <Route 
                        path="/profile" 
                        element={
                          <Suspense fallback={<LoadingFallback />}>
                            <ProtectedRoute element={<ProfilePage />} />
                          </Suspense>
                        } 
                      />
                      <Route 
                        path="/legal" 
                        element={
                          <Suspense fallback={<LoadingFallback />}>
                            <LegalPage />
                          </Suspense>
                        } 
                      />
                      <Route 
                        path="/privacy" 
                        element={
                          <Suspense fallback={<LoadingFallback />}>
                            <PrivacyPage />
                          </Suspense>
                        } 
                      />
                      <Route path="*" element={<NotFound />} />
                    </Route>
                  </Routes>
                </NotificationsProvider>
              </SubscriptionProvider>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
