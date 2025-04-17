
import { Outlet } from 'react-router-dom';
import { NavBar } from './NavBar';
import { BottomNav } from './BottomNav';
import { useIsMobile } from '@/hooks/use-mobile';

export const Layout = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <main className="flex-1 container pb-16">
        <Outlet />
      </main>
      {isMobile && <BottomNav />}
    </div>
  );
};
