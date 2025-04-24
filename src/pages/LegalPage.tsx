
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const LegalPage = () => {
  return (
    <div className="container py-8 space-y-8">
      <h1 className="text-3xl font-bold">Mentions Légales</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Informations légales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <section>
            <h2 className="text-xl font-semibold mb-2">Éditeur du site</h2>
            <p>AlertImmo</p>
            <p>Adresse : [Votre adresse]</p>
            <p>Email : contact@alertimmo.ma</p>
            <p>SIRET : [Votre SIRET]</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">Hébergement</h2>
            <p>Ce site est hébergé par :</p>
            <p>[Nom de l'hébergeur]</p>
            <p>[Adresse de l'hébergeur]</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">Propriété intellectuelle</h2>
            <p>
              L'ensemble de ce site relève de la législation française et internationale 
              sur le droit d'auteur et la propriété intellectuelle.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
};

export default LegalPage;
