
import { Outlet } from 'react-router-dom';
import { NavBar } from './NavBar';
import { BottomNav } from './BottomNav';
import { useIsMobile } from '@/hooks/use-mobile';
import { Database } from 'lucide-react';

export const Layout = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <main className="flex-1 container pb-16">
        <Outlet />
      </main>
      <footer className="container py-4 text-center text-sm text-muted-foreground border-t">
        <div className="flex items-center justify-center gap-2 font-medium">
          <Database className="h-4 w-4 text-primary" />
          <span>Agrégateur d'annonces immobilières depuis 2023</span>
        </div>
      </footer>
      {isMobile && <BottomNav />}
    </div>
  );
};
