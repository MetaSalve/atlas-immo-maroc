
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';
import { useSubscription } from '@/providers/SubscriptionProvider';
import { toast } from 'sonner';
import { PlanCard } from '@/components/subscription/PlanCard';
import { FaqSection } from '@/components/subscription/FaqSection';
import { Separator } from '@/components/ui/separator';
import { TrialBanner } from '@/components/subscription/TrialBanner';

const SubscriptionPage = () => {
  const { user } = useAuth();
  const { tier } = useSubscription();
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
      navigate('/auth');
      return;
    }
    
    setIsLoading(true);
    toast.success("Redirection vers la page de paiement", {
      description: "Vous allez être redirigé vers notre page de paiement sécurisée."
    });
    
    setTimeout(() => {
      setIsLoading(false);
      navigate('/payment');
    }, 1500);
  };

  const freePlanFeatures = [
    { text: "Agrégation des annonces immobilières" },
    { text: "Accès limité aux redirections" },
    { text: "Nombre limité de favoris" },
    { text: "3 alertes personnalisées" },
    { text: "Période d'essai de 15 jours" }
  ];

  const premiumPlanFeatures = [
    { text: "Agrégation complète du marché immobilier marocain" },
    { text: "Accès illimité aux annonces" },
    { text: "Favoris illimités" },
    { text: "Alertes personnalisées illimitées" },
    { text: "Notifications push et email" }
  ];

  const isPremiumUser = tier === 'premium';
  
  return (
    <div className="py-10 px-4 md:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Nos offres d'abonnement</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
          Trouvez le bien immobilier idéal grâce à nos outils de recherche avancés et nos notifications en temps réel.
        </p>
      </div>
      
      <TrialBanner />
      
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <PlanCard
          title="Offre Gratuite"
          description="Pour commencer à explorer"
          price={0}
          features={freePlanFeatures}
          isActive={tier === 'free'}
          onSubscribe={() => navigate('/')}
          buttonText="Continuer gratuitement"
        />
        
        <PlanCard
          title="Premium"
          description="Pour une recherche efficace"
          price={99}
          features={premiumPlanFeatures}
          isActive={isPremiumUser}
          isRecommended={!isPremiumUser}
          onSubscribe={() => handleSubscribe('premium')}
          buttonText={isLoading ? "Traitement..." : isPremiumUser ? "Abonnement actif" : "S'abonner"}
          buttonDisabled={isLoading || isPremiumUser}
        />
      </div>
      
      <Separator className="my-16" />
      
      <FaqSection />
    </div>
  );
};

export default SubscriptionPage;
