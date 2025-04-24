
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { MetaTags } from '@/components/common/MetaTags';

const PrivacyPage = () => {
  return (
    <>
      <MetaTags 
        title="Politique de Confidentialité - AlertImmo" 
        description="Politique de confidentialité d'AlertImmo: comment nous protégeons vos données personnelles et respectons votre vie privée."
      />
      
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
                Dans le cadre de l'utilisation de nos services, nous collectons les données suivantes :
              </p>
              <ul className="list-disc pl-6 mt-2">
                <li>Informations de compte (email, nom, préférences)</li>
                <li>Préférences de recherche immobilière</li>
                <li>Historique des favoris et alertes</li>
                <li>Données de navigation et d'utilisation du service</li>
                <li>Informations de paiement (uniquement lors des transactions)</li>
              </ul>
              <p className="mt-2">
                Les données sont collectées lors de la création de votre compte, de vos recherches, 
                et lorsque vous interagissez avec notre plateforme.
              </p>
            </section>

            <Separator className="my-4" />

            <section>
              <h2 className="text-xl font-semibold mb-2">Utilisation des données</h2>
              <p>
                Vos données sont utilisées pour :
              </p>
              <ul className="list-disc pl-6 mt-2">
                <li>Personnaliser votre expérience utilisateur</li>
                <li>Vous envoyer des alertes immobilières selon vos critères</li>
                <li>Traiter vos transactions et abonnements</li>
                <li>Améliorer nos services et développer de nouvelles fonctionnalités</li>
                <li>Assurer la sécurité de votre compte</li>
              </ul>
            </section>

            <Separator className="my-4" />

            <section>
              <h2 className="text-xl font-semibold mb-2">Conservation des données</h2>
              <p>
                Nous conservons vos données personnelles aussi longtemps que votre compte est actif ou 
                que cela est nécessaire pour vous fournir nos services. Si vous supprimez votre compte, 
                nous supprimerons vos données personnelles dans un délai de 30 jours, sauf si la loi 
                nous oblige à les conserver plus longtemps.
              </p>
            </section>

            <Separator className="my-4" />

            <section>
              <h2 className="text-xl font-semibold mb-2">Partage des données</h2>
              <p>
                Nous ne vendons pas vos données personnelles. Nous pouvons partager vos informations avec :
              </p>
              <ul className="list-disc pl-6 mt-2">
                <li>Nos prestataires de service (hébergement, paiement)</li>
                <li>Les autorités compétentes si la loi l'exige</li>
              </ul>
              <p className="mt-2">
                Tout partage de données est encadré par des contrats garantissant le respect de votre vie privée.
              </p>
            </section>

            <Separator className="my-4" />

            <section>
              <h2 className="text-xl font-semibold mb-2">Vos droits RGPD</h2>
              <p>
                Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez des droits suivants :
              </p>
              <ul className="list-disc pl-6 mt-2">
                <li>Droit d'accès à vos données</li>
                <li>Droit de rectification</li>
                <li>Droit à l'effacement (droit à l'oubli)</li>
                <li>Droit à la limitation du traitement</li>
                <li>Droit à la portabilité des données</li>
                <li>Droit d'opposition</li>
                <li>Droit de ne pas faire l'objet d'une décision automatisée</li>
              </ul>
              <p className="mt-2">
                Pour exercer ces droits, veuillez nous contacter à l'adresse privacy@alertimmo.ma
              </p>
            </section>

            <Separator className="my-4" />

            <section>
              <h2 className="text-xl font-semibold mb-2">Cookies</h2>
              <p>
                Nous utilisons des cookies pour améliorer votre expérience sur notre site. 
                Les cookies sont de petits fichiers texte stockés sur votre appareil qui nous 
                aident à optimiser votre navigation et nos services.
              </p>
              <p className="mt-2">
                Vous pouvez à tout moment modifier vos préférences de cookies via le 
                panneau de gestion des cookies accessible depuis le pied de page.
              </p>
            </section>

            <Separator className="my-4" />

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
    </>
  );
};

export default PrivacyPage;
