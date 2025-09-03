import React from 'react';
import { DocumentHead } from '@/components/common/DocumentHead';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PrivacyPage = () => {
  return (
    <>
      <DocumentHead 
        title="Politique de Confidentialité | AlertImmo"
        description="Politique de confidentialité et protection des données personnelles sur AlertImmo."
      />
      
      <div className="container mx-auto py-8 space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Politique de Confidentialité</h1>
          <p className="text-muted-foreground">Protection de vos données personnelles</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Collecte des données</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Nous collectons uniquement les données nécessaires au fonctionnement de notre service : nom, email, et préférences de recherche pour personnaliser votre expérience.</p>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default PrivacyPage;