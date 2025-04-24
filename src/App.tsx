
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { AuthProvider } from "./providers/AuthProvider";
import { SubscriptionProvider } from "./providers/SubscriptionProvider";
import { NotificationsProvider } from "./providers/NotificationsProvider";
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import PropertyDetailPage from "./pages/PropertyDetailPage";
import FavoritesPage from "./pages/FavoritesPage";
import AlertsPage from "./pages/AlertsPage";
import AdminPage from "./pages/AdminPage";
import AuthPage from "./pages/AuthPage";
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
const ProtectedRoute = ({ element }: { element: React.ReactNode }) => {
  const navigate = () => {
    toast({
      title: "Connexion requise",
      description: "Veuillez vous connecter pour accéder à cette fonctionnalité",
    });
    return <Navigate to="/auth" replace />;
  };
  return element;
};

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
                  <Route path="/auth" element={<AuthPage />} />
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
