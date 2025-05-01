
import React from 'react';
import { useLanguageSwitch } from '@/i18n';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const LanguageSwitcher = () => {
  const { currentLanguage, switchLanguage, availableLanguages } = useLanguageSwitch();

  const languageNames: Record<string, string> = {
    fr: 'Français',
    en: 'English'
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Globe className="h-4 w-4" />
          <span className="hidden md:inline">{languageNames[currentLanguage] || currentLanguage}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {availableLanguages.map((lang) => (
          <DropdownMenuItem
            key={lang}
            onClick={() => switchLanguage(lang)}
            className={currentLanguage === lang ? 'bg-muted' : ''}
          >
            {languageNames[lang] || lang}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
