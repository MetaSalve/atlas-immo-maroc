import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import { UserNav } from "@/components/auth/UserNav";
import { NavMenu } from "@/components/layout/NavMenu";
import { Logo } from "@/components/ui/Logo";
import { MobileNav } from "./MobileNav";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

export const NavBar = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const isLargeScreen = useMediaQuery('(min-width: 768px)');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <Logo />
          </Link>
        </div>

        <div className="flex items-center">
          {/* Sélecteur de langue */}
          <LanguageSwitcher />
          
          {/* Menu utilisateur */}
          <UserNav />
          
          {/* Menu de navigation */}
          <NavMenu />
        </div>
      </div>
    </header>
  );
};
