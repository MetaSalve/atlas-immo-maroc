
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useTranslation } from '@/i18n';

export function UserNav() {
  const { t } = useTranslation();
  const isLoggedIn = localStorage.getItem('sb-authuser') !== null;

  if (!isLoggedIn) {
    return (
      <Link to="/auth">
        <Button variant="outline" size="sm">{t('auth.login')}</Button>
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar>
            <AvatarImage src="/placeholder.svg" alt={t('user.profile')} />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{t('user.account')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link to="/profile">
          <DropdownMenuItem className="cursor-pointer">
            {t('user.profile')}
          </DropdownMenuItem>
        </Link>
        <Link to="/favorites">
          <DropdownMenuItem className="cursor-pointer">
            {t('user.favorites')}
          </DropdownMenuItem>
        </Link>
        <Link to="/notifications">
          <DropdownMenuItem className="cursor-pointer">
            {t('user.notifications')}
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer">
          {t('auth.logout')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
