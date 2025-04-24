
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Logo } from './Logo';
import { NavMenu } from './NavMenu';
import { UserNav } from './UserNav';

export const NavBar = () => {
  const isMobile = useIsMobile();
  
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-2">
          {!isMobile && (
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <Logo />
        </div>

        <NavMenu />

        <div className="flex items-center gap-2">
          <UserNav />
        </div>
      </div>
    </header>
  );
};
