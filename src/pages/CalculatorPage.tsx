import React from 'react';
import { MortgageCalculator } from '@/components/calculators/MortgageCalculator';
import { CurrencyConverter } from '@/components/converters/CurrencyConverter';
import { DocumentHead } from '@/components/common/DocumentHead';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from '@/i18n';

const CalculatorPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <DocumentHead 
        title="Calculateurs Immobiliers | AlertImmo"
        description="Calculez votre crédit immobilier au Maroc et convertissez les devises. Outils gratuits pour votre projet immobilier."
      />
      
      <div className="container mx-auto py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Calculateurs Immobiliers
          </h1>
          <p className="text-muted-foreground">
            Outils gratuits pour vos projets immobiliers au Maroc
          </p>
        </div>

        <Tabs defaultValue="mortgage" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="mortgage">Crédit Immobilier</TabsTrigger>
            <TabsTrigger value="currency">Convertisseur</TabsTrigger>
          </TabsList>
          
          <TabsContent value="mortgage" className="mt-6">
            <MortgageCalculator />
          </TabsContent>
          
          <TabsContent value="currency" className="mt-6">
            <CurrencyConverter />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default CalculatorPage;