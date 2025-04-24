
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { MetaTags } from '@/components/common/MetaTags';

const TermsPage = () => {
  return (
    <>
      <MetaTags 
        title="Conditions Générales d'Utilisation - AlertImmo" 
        description="Conditions Générales d'Utilisation du service AlertImmo, plateforme d'alertes immobilières au Maroc."
      />
      
      <div className="container py-8 space-y-8">
        <h1 className="text-3xl font-bold">Conditions Générales d'Utilisation</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Conditions d'utilisation du service</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <section>
              <h2 className="text-xl font-semibold mb-2">1. Objet</h2>
              <p>
                Les présentes Conditions Générales d'Utilisation (CGU) définissent les modalités d'utilisation 
                du service AlertImmo, accessible via le site web www.alertimmo.ma.
              </p>
              <p className="mt-2">
                AlertImmo est un service en ligne permettant aux utilisateurs de recevoir des alertes 
                immobilières personnalisées sur le marché marocain, de sauvegarder des favoris et 
                d'accéder à des informations détaillées sur des biens immobiliers.
              </p>
            </section>

            <Separator className="my-4" />

            <section>
              <h2 className="text-xl font-semibold mb-2">2. Acceptation des CGU</h2>
              <p>
                L'utilisation du service AlertImmo implique l'acceptation pleine et entière des présentes CGU. 
                Si vous n'acceptez pas ces conditions, vous ne devez pas utiliser le service.
              </p>
              <p className="mt-2">
                AlertImmo se réserve le droit de modifier les présentes CGU à tout moment. 
                Les modifications entrent en vigueur dès leur publication sur le site. 
                Il est de votre responsabilité de consulter régulièrement les CGU pour prendre 
                connaissance des éventuelles modifications.
              </p>
            </section>

            <Separator className="my-4" />

            <section>
              <h2 className="text-xl font-semibold mb-2">3. Inscription et compte utilisateur</h2>
              <p>
                Pour bénéficier pleinement des fonctionnalités d'AlertImmo, vous devez créer un compte utilisateur. 
                Vous vous engagez à fournir des informations exactes et à les maintenir à jour.
              </p>
              <p className="mt-2">
                Vous êtes responsable de la confidentialité de vos identifiants de connexion et 
                de toutes les activités effectuées avec votre compte. Vous devez immédiatement 
                informer AlertImmo de toute utilisation non autorisée de votre compte.
              </p>
            </section>

            <Separator className="my-4" />

            <section>
              <h2 className="text-xl font-semibold mb-2">4. Description du service</h2>
              <p>
                AlertImmo propose les services suivants :
              </p>
              <ul className="list-disc pl-6 mt-2">
                <li>Création d'alertes immobilières personnalisées</li>
                <li>Recherche de biens immobiliers selon divers critères</li>
                <li>Sauvegarde de biens en favoris</li>
                <li>Consultation de fiches détaillées des biens</li>
                <li>Abonnements premium pour des fonctionnalités avancées</li>
              </ul>
            </section>

            <Separator className="my-4" />

            <section>
              <h2 className="text-xl font-semibold mb-2">5. Abonnements et paiements</h2>
              <p>
                AlertImmo propose un accès gratuit limité et des formules d'abonnement payantes 
                offrant des fonctionnalités supplémentaires.
              </p>
              <p className="mt-2">
                Les tarifs des abonnements sont indiqués sur le site avant toute souscription. 
                Les paiements s'effectuent selon les modalités précisées lors de la souscription. 
                Les abonnements sont renouvelés automatiquement sauf résiliation par l'utilisateur.
              </p>
              <p className="mt-2">
                Vous pouvez résilier votre abonnement à tout moment depuis votre espace personnel. 
                La résiliation sera effective à la fin de la période d'abonnement en cours.
              </p>
            </section>

            <Separator className="my-4" />

            <section>
              <h2 className="text-xl font-semibold mb-2">6. Propriété intellectuelle</h2>
              <p>
                L'ensemble des éléments constituant le service AlertImmo (textes, graphiques, 
                logiciels, images, vidéos, etc.) est protégé par les lois relatives à la 
                propriété intellectuelle et appartient à AlertImmo ou à des tiers ayant 
                autorisé AlertImmo à les utiliser.
              </p>
              <p className="mt-2">
                Toute reproduction, représentation, modification ou exploitation de tout ou partie 
                de ces éléments sans l'autorisation préalable écrite d'AlertImmo est strictement interdite.
              </p>
            </section>

            <Separator className="my-4" />

            <section>
              <h2 className="text-xl font-semibold mb-2">7. Responsabilité</h2>
              <p>
                AlertImmo s'efforce de fournir des informations exactes et à jour, mais ne peut 
                garantir leur exhaustivité, leur précision ou leur pertinence. Les informations 
                concernant les biens immobiliers sont fournies à titre indicatif et ne constituent 
                pas une offre contractuelle.
              </p>
              <p className="mt-2">
                AlertImmo ne peut être tenu responsable des dommages directs ou indirects résultant 
                de l'utilisation de son service ou de l'impossibilité d'y accéder.
              </p>
            </section>

            <Separator className="my-4" />

            <section>
              <h2 className="text-xl font-semibold mb-2">8. Protection des données personnelles</h2>
              <p>
                AlertImmo s'engage à respecter la confidentialité des données personnelles des utilisateurs 
                conformément à la législation en vigueur, notamment le Règlement Général sur la Protection 
                des Données (RGPD).
              </p>
              <p className="mt-2">
                Pour plus d'informations, veuillez consulter notre Politique de confidentialité.
              </p>
            </section>

            <Separator className="my-4" />

            <section>
              <h2 className="text-xl font-semibold mb-2">9. Résiliation</h2>
              <p>
                AlertImmo se réserve le droit de suspendre ou de résilier votre compte, avec ou sans préavis, 
                en cas de violation des présentes CGU ou pour tout autre motif légitime.
              </p>
              <p className="mt-2">
                Vous pouvez résilier votre compte à tout moment en adressant une demande à support@alertimmo.ma 
                ou en utilisant la fonctionnalité de suppression de compte disponible dans votre espace personnel.
              </p>
            </section>

            <Separator className="my-4" />

            <section>
              <h2 className="text-xl font-semibold mb-2">10. Loi applicable et juridiction compétente</h2>
              <p>
                Les présentes CGU sont régies par le droit marocain. En cas de litige, les tribunaux 
                de Casablanca seront seuls compétents, sauf disposition légale contraire.
              </p>
            </section>

            <Separator className="my-4" />

            <section>
              <h2 className="text-xl font-semibold mb-2">11. Contact</h2>
              <p>
                Pour toute question concernant ces CGU, vous pouvez nous contacter à l'adresse suivante :
                <br />
                Email : legal@alertimmo.ma
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default TermsPage;
