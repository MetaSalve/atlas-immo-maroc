
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { MetaTags } from '@/components/common/MetaTags';

const LegalPage = () => {
  return (
    <>
      <MetaTags 
        title="Mentions Légales - AlertImmo" 
        description="Mentions légales et informations juridiques concernant AlertImmo, votre plateforme d'alertes immobilières au Maroc."
      />
      
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
              <p>SARL au capital de 10 000 MAD</p>
              <p>Adresse : 123 Avenue Mohammed V, Casablanca, Maroc</p>
              <p>Email : contact@alertimmo.ma</p>
              <p>Téléphone : +212 5XX-XXXXXX</p>
              <p>SIRET : XX XXX XXX XXXXX</p>
              <p>Directeur de la publication : [Nom du directeur]</p>
            </section>

            <Separator className="my-4" />

            <section>
              <h2 className="text-xl font-semibold mb-2">Hébergement</h2>
              <p>Ce site est hébergé par :</p>
              <p>Supabase</p>
              <p>https://supabase.com/</p>
            </section>

            <Separator className="my-4" />

            <section>
              <h2 className="text-xl font-semibold mb-2">Propriété intellectuelle</h2>
              <p>
                L'ensemble de ce site relève de la législation marocaine et internationale 
                sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction 
                sont réservés, y compris pour les documents téléchargeables et les représentations 
                iconographiques et photographiques.
              </p>
              <p className="mt-2">
                La reproduction de tout ou partie de ce site sur quelque support que ce soit est 
                formellement interdite sauf autorisation expresse d'AlertImmo.
              </p>
            </section>

            <Separator className="my-4" />

            <section>
              <h2 className="text-xl font-semibold mb-2">Limitation de responsabilité</h2>
              <p>
                AlertImmo s'efforce d'assurer au mieux de ses possibilités l'exactitude et la mise 
                à jour des informations diffusées sur ce site, dont elle se réserve le droit de 
                corriger, à tout moment et sans préavis, le contenu. Toutefois, AlertImmo ne peut 
                garantir l'exactitude, la précision ou l'exhaustivité des informations mises à 
                disposition sur ce site.
              </p>
              <p className="mt-2">
                Les informations présentes sur ce site ne sont pas contractuelles et AlertImmo 
                ne saurait être tenue responsable des erreurs, d'une absence de disponibilité 
                des informations, et/ou de la présence de virus sur son site.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default LegalPage;
