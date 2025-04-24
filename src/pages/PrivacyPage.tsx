
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PrivacyPage = () => {
  return (
    <div className="container py-8 space-y-8">
      <h1 className="text-3xl font-bold">Politique de Confidentialité</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Protection de vos données</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <section>
            <h2 className="text-xl font-semibold mb-2">Collecte des données</h2>
            <p>
              Nous collectons les données suivantes :
            </p>
            <ul className="list-disc pl-6 mt-2">
              <li>Informations de compte (email, nom)</li>
              <li>Préférences de recherche immobilière</li>
              <li>Historique des favoris</li>
              <li>Données de navigation</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">Utilisation des données</h2>
            <p>
              Vos données sont utilisées pour :
            </p>
            <ul className="list-disc pl-6 mt-2">
              <li>Personnaliser votre expérience</li>
              <li>Vous envoyer des alertes immobilières</li>
              <li>Améliorer nos services</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">Vos droits RGPD</h2>
            <p>
              Conformément au RGPD, vous disposez des droits suivants :
            </p>
            <ul className="list-disc pl-6 mt-2">
              <li>Droit d'accès à vos données</li>
              <li>Droit de rectification</li>
              <li>Droit à l'effacement</li>
              <li>Droit à la portabilité</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">Contact</h2>
            <p>
              Pour toute question concernant vos données personnelles :
              <br />
              Email : privacy@alertimmo.ma
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrivacyPage;
