
import React from 'react';
import { Globe, Layers3, Bell } from 'lucide-react';
import { ZelligeBackground } from './HeroBackground';
import { useTranslation } from '@/i18n';

export const FeaturesSection = () => {
  const { t } = useTranslation();
  
  return (
    <section className="bg-cream/60 p-6 rounded-lg text-center relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 z-0"><ZelligeBackground /></div>
      <div className="relative z-10">
        <h2 className="text-2xl font-bold mb-4 font-playfair text-navy">{t('hero.howItWorks')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-md shadow-sm">
            <div className="w-12 h-12 rounded-full bg-skyblue/20 flex items-center justify-center mb-4 mx-auto">
              <Globe className="h-6 w-6 text-skyblue" />
            </div>
            <h3 className="font-bold mb-2">{t('hero.intelligentCollection')}</h3>
            <p className="text-sm text-muted-foreground">{t('hero.intelligentCollectionDesc')}</p>
          </div>
          <div className="bg-white p-6 rounded-md shadow-sm">
            <div className="w-12 h-12 rounded-full bg-skyblue/20 flex items-center justify-center mb-4 mx-auto">
              <Layers3 className="h-6 w-6 text-skyblue" />
            </div>
            <h3 className="font-bold mb-2">{t('hero.centralization')}</h3>
            <p className="text-sm text-muted-foreground">{t('hero.centralizationDesc')}</p>
          </div>
          <div className="bg-white p-6 rounded-md shadow-sm">
            <div className="w-12 h-12 rounded-full bg-skyblue/20 flex items-center justify-center mb-4 mx-auto">
              <Bell className="h-6 w-6 text-skyblue" />
            </div>
            <h3 className="font-bold mb-2">{t('hero.realTimeNotifications')}</h3>
            <p className="text-sm text-muted-foreground">{t('hero.realTimeAlertsDesc')}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

