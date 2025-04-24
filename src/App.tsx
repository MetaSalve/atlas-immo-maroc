
import React from "react";
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
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import PropertyDetailPage from "./pages/PropertyDetailPage";
import FavoritesPage from "./pages/FavoritesPage";
import AlertsPage from "./pages/AlertsPage";
import AdminPage from "./pages/AdminPage";
import AuthPage from "./pages/AuthPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import SubscriptionPage from "./pages/SubscriptionPage";
import PaymentPage from "./pages/PaymentPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

// Composant de protection pour les routes nécessitant une authentification
const ProtectedRoute = ({ element, requiresAuth = true }: { element: React.ReactNode, requiresAuth?: boolean }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  // Si on est en cours de chargement, afficher un loader
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>;
  }
  
  // Si l'authentification est requise et l'utilisateur n'est pas connecté
  if (requiresAuth && !user) {
    toast.info("Connexion requise", {
      description: "Veuillez vous connecter pour accéder à cette fonctionnalité",
      position: "top-center",
    });
    
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }
  
  // Si l'authentification n'est pas requise et l'utilisateur est connecté (pages comme login/signup)
  if (!requiresAuth && user) {
    return <Navigate to="/" replace />;
  }
  
  // Dans tous les autres cas, rendre le composant demandé
  return <>{element}</>;
};

// Définir les métadonnées pour le document
const updateDocumentMeta = (title: string, description: string) => {
  document.title = title;
  
  // Mettre à jour ou créer la balise meta description
  let metaDescription = document.querySelector('meta[name="description"]');
  if (!metaDescription) {
    metaDescription = document.createElement('meta');
    metaDescription.setAttribute('name', 'description');
    document.head.appendChild(metaDescription);
  }
  metaDescription.setAttribute('content', description);
};

// Définir les métadonnées par défaut du site
React.useEffect(() => {
  updateDocumentMeta(
    'AlertImmo - Alertes immobilières en temps réel au Maroc',
    'Trouvez votre bien immobilier idéal au Maroc grâce à nos alertes personnalisées en temps réel. Appartements, maisons, villas et riads dans tout le Maroc.'
  );
}, []);

const App = () => (
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
                    element={<ProtectedRoute element={<AuthPage />} requiresAuth={false} />} 
                  />
                  <Route 
                    path="/auth/reset-password" 
                    element={<ProtectedRoute element={<ResetPasswordPage />} requiresAuth={false} />} 
                  />
                  <Route 
                    path="/auth/callback" 
                    element={<ProtectedRoute element={<div>Redirection en cours...</div>} requiresAuth={false} />} 
                  />
                  <Route element={<Layout />}>
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/search" element={<SearchPage />} />
                    <Route 
                      path="/properties/:id" 
                      element={<ProtectedRoute element={<PropertyDetailPage />} />} 
                    />
                    <Route 
                      path="/favorites" 
                      element={<ProtectedRoute element={<FavoritesPage />} />} 
                    />
                    <Route 
                      path="/alerts" 
                      element={<ProtectedRoute element={<AlertsPage />} />} 
                    />
                    <Route 
                      path="/admin" 
                      element={<ProtectedRoute element={<AdminPage />} />} 
                    />
                    <Route 
                      path="/subscription" 
                      element={<ProtectedRoute element={<SubscriptionPage />} />} 
                    />
                    <Route 
                      path="/payment" 
                      element={<ProtectedRoute element={<PaymentPage />} />} 
                    />
                    <Route 
                      path="/profile" 
                      element={<ProtectedRoute element={<ProfilePage />} />} 
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

export default App;
