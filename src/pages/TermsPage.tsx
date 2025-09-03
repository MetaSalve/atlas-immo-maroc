import React from 'react';
import { DocumentHead } from '@/components/common/DocumentHead';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TermsPage = () => {
  return (
    <>
      <DocumentHead 
        title="Conditions d'Utilisation | AlertImmo"
        description="Conditions générales d'utilisation de la plateforme AlertImmo."
      />
      
      <div className="container mx-auto py-8 space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Conditions d'Utilisation</h1>
          <p className="text-muted-foreground">Règles d'utilisation de notre plateforme</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Acceptation des conditions</CardTitle>
          </CardHeader>
          <CardContent>
            <p>En utilisant AlertImmo, vous acceptez ces conditions d'utilisation.</p>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default TermsPage;