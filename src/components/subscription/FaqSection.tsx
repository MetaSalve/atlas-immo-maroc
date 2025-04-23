
import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const FaqSection = () => {
  return (
    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold mb-4">Questions fréquentes</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">Puis-je annuler à tout moment ?</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Oui, vous pouvez annuler votre abonnement à tout moment. Le remboursement est possible 
              dans les 14 jours suivant la souscription si vous n'avez pas utilisé le service.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Comment fonctionnent les notifications ?</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Recevez des alertes instantanées par email et sur votre mobile pour ne manquer aucune 
              nouvelle annonce correspondant à vos critères, même lorsque l'application n'est pas ouverte.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Quelles sont les limitations de l'offre gratuite ?</h3>
            <p className="text-sm text-muted-foreground mt-1">
              L'offre gratuite vous permet d'essayer l'application pendant 15 jours avec des fonctionnalités 
              limitées : 10 annonces par jour, 10 favoris maximum et 3 alertes personnalisées.
            </p>
          </div>
        </div>
      </div>
      
      <div>
        <div className="bg-muted rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Besoin d'aide ?</h2>
          <p className="text-muted-foreground mb-6">
            Notre équipe est à votre disposition pour vous aider à choisir la formule qui correspond 
            le mieux à vos besoins.
          </p>
          <Button variant="outline" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Nous contacter
          </Button>
        </div>
      </div>
    </div>
  );
};
