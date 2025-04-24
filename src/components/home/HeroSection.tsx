
import React from 'react';
import { Globe, Bell } from 'lucide-react';
import { SearchBar } from '@/components/search/SearchBar';
import { MoroccanHeroImage } from './HeroBackground';

export const HeroSection = () => {
  return (
    <section className="relative py-12 px-4 rounded-2xl bg-gradient-to-br from-navy/90 to-skyblue/80 text-white overflow-hidden min-h-[340px]">
      <MoroccanHeroImage />
      <div className="relative max-w-2xl mx-auto text-center z-10">
        <div className="mb-2 pb-1 font-bold text-lg uppercase tracking-wider text-gold">
          Notifications en temps réel
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 font-playfair text-white drop-shadow">
          Le premier agrégateur d'annonces immobilières au Maroc
        </h1>
        <div className="flex justify-center gap-8 mb-8">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-2">
              <Globe className="h-6 w-6 text-white" />
            </div>
            <p className="text-sm font-medium">Sources multiples</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-2">
              <Bell className="h-6 w-6 text-white" />
            </div>
            <p className="text-sm font-medium">Notifications en temps réel</p>
          </div>
        </div>
        <SearchBar className="max-w-xl mx-auto" />
      </div>
    </section>
  );
};

