
import { Outlet } from 'react-router-dom';
import { NavBar } from './NavBar';
import { BottomNav } from './BottomNav';
import { useIsMobile } from '@/hooks/use-mobile';
import { Database } from 'lucide-react';
import { FadeIn } from '../ui/animations';
import { AccessibilityBar } from '../common/AccessibilityBar';
import { withPageTransition } from '../hoc/WithPageTransition';

export const Layout = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <main id="main-content" className="flex-1 container pb-16" tabIndex={-1} aria-label="Contenu principal">
        <FadeIn>
          <Outlet />
        </FadeIn>
      </main>
      <footer className="container py-4 text-center text-sm text-muted-foreground border-t">
        <div className="flex items-center justify-center gap-2 font-medium">
          <Database className="h-4 w-4 text-primary" aria-hidden="true" />
          <span>Agrégateur d'annonces immobilières depuis 2023</span>
        </div>
        <div className="mt-2 flex justify-center space-x-4">
          <a href="/legal" className="hover:underline">Mentions légales</a>
          <a href="/privacy" className="hover:underline">Politique de confidentialité</a>
        </div>
      </footer>
      {!isMobile && <AccessibilityBar />} 
      {isMobile && <BottomNav />}
    </div>
  );
};

// Exporter avec la transition de page
export default withPageTransition(Layout);
