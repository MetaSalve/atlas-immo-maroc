import React from 'react';
import { DocumentHead } from '@/components/common/DocumentHead';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const LegalPage = () => {
  return (
    <>
      <DocumentHead 
        title="Mentions Légales | AlertImmo"
        description="Mentions légales d'AlertImmo, plateforme d'agrégation d'annonces immobilières au Maroc."
      />
      
      <div className="container mx-auto py-8 space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Mentions Légales</h1>
          <p className="text-muted-foreground">Informations légales et réglementaires</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informations générales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Raison sociale :</h3>
              <p>AlertImmo SARL</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Siège social :</h3>
              <p>123 Avenue Mohammed V, Casablanca 20000, Maroc</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Directeur de publication :</h3>
              <p>Équipe AlertImmo</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Contact :</h3>
              <p>Email: contact@alertimmo.ma</p>
              <p>Téléphone: +212 522 000 000</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default LegalPage;