
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';
import { toast } from 'sonner';
import { Check, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const SubscriptionPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubscribe = (plan: string) => {
    if (!user) {
      toast("Connexion requise", {
        description: "Vous devez être connecté pour souscrire à un abonnement",
        action: {
          label: "Se connecter",
          onClick: () => navigate('/auth')
        }
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simuler un processus de paiement
    setTimeout(() => {
      toast.success(`Merci pour votre abonnement au forfait ${plan}!`, {
        description: "Vous avez maintenant accès à toutes les fonctionnalités premium."
      });
      setIsLoading(false);
    }, 2000);
  };
  
  return (
    <div className="py-10 px-4 md:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Nos offres d'abonnement</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
          Choisissez l'offre qui correspond à vos besoins et accédez à des fonctionnalités exclusives pour trouver le bien immobilier idéal.
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Plan Gratuit */}
        <Card className="flex flex-col border-2">
          <CardHeader>
            <CardTitle className="text-xl">Offre Gratuite</CardTitle>
            <CardDescription>Pour commencer à explorer</CardDescription>
            <div className="mt-4">
              <span className="text-4xl font-bold">0 MAD</span>
              <span className="text-muted-foreground ml-1">/mois</span>
            </div>
          </CardHeader>
          <CardContent className="flex-grow">
            <ul className="space-y-2">
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-green-500" />
                <span>Recherche de base</span>
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-green-500" />
                <span>10 annonces consultables par jour</span>
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-green-500" />
                <span>Sauvegarde des favoris</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => navigate('/')}>
              C'est gratuit
            </Button>
          </CardFooter>
        </Card>
        
        {/* Plan Standard */}
        <Card className="flex flex-col border-2 border-primary">
          <CardHeader>
            <div className="py-1 px-3 rounded-full bg-primary text-primary-foreground w-fit text-sm font-medium mb-2">
              Populaire
            </div>
            <CardTitle className="text-xl">Standard</CardTitle>
            <CardDescription>Pour une recherche efficace</CardDescription>
            <div className="mt-4">
              <span className="text-4xl font-bold">149 MAD</span>
              <span className="text-muted-foreground ml-1">/mois</span>
            </div>
          </CardHeader>
          <CardContent className="flex-grow">
            <ul className="space-y-2">
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-green-500" />
                <span>Recherche avancée</span>
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-green-500" />
                <span>Accès illimité aux annonces</span>
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-green-500" />
                <span>5 alertes personnalisées</span>
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-green-500" />
                <span>Notifications par email</span>
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-green-500" />
                <span>Comparaison de biens</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => handleSubscribe('Standard')} disabled={isLoading}>
              {isLoading ? "Traitement..." : "S'abonner"}
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <Separator className="my-16" />
      
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
              <h3 className="font-semibold">Comment fonctionnent les alertes ?</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Les alertes vous permettent de recevoir des notifications lorsque de nouveaux biens 
                correspondant à vos critères sont publiés. Vous pouvez personnaliser vos critères 
                de recherche et choisir la fréquence des notifications.
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
    </div>
  );
};

export default SubscriptionPage;
