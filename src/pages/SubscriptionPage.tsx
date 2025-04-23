
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';
import { useSubscription } from '@/providers/SubscriptionProvider';
import { toast } from 'sonner';
import { 
  Check, 
  Shield, 
  Clock, 
  Bell, 
  Users, 
  Search, 
  Star, 
  Heart, 
  MessageSquare,
  ChevronDown
} from 'lucide-react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { PlanCard } from '@/components/subscription/PlanCard';
import { Separator } from '@/components/ui/separator';
import { TrialBanner } from '@/components/subscription/TrialBanner';
import { Button } from '@/components/ui/button';

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
    { text: "Accès à l'agrégateur d'annonces", icon: <Search className="h-4 w-4" /> },
    { text: "Limite de 10 consultations par jour", icon: <Clock className="h-4 w-4" /> },
    { text: "3 alertes personnalisées", icon: <Bell className="h-4 w-4" /> },
    { text: "Période d'essai de 15 jours", icon: <Star className="h-4 w-4" /> }
  ];

  const premiumPlanFeatures = [
    { text: "Accès illimité à toutes les annonces", icon: <Search className="h-4 w-4" /> },
    { text: "Alertes illimitées et personnalisables", icon: <Bell className="h-4 w-4" /> },
    { text: "Favoris illimités", icon: <Heart className="h-4 w-4" /> },
    { text: "Notifications multiplateforme", icon: <MessageSquare className="h-4 w-4" /> },
    { text: "Support prioritaire", icon: <Users className="h-4 w-4" /> }
  ];

  const faqItems = [
    {
      question: "Comment fonctionne la période d'essai ?",
      answer: "Votre période d'essai de 15 jours commence dès la création de votre compte. Pendant cette période, vous bénéficiez des fonctionnalités de base de notre service. Aucune carte bancaire n'est requise pour commencer."
    },
    {
      question: "Puis-je annuler mon abonnement à tout moment ?",
      answer: "Oui, vous pouvez annuler votre abonnement à tout moment depuis votre espace personnel. Si vous annulez pendant les 14 premiers jours suivant votre souscription, vous pourrez être remboursé intégralement."
    },
    {
      question: "Comment fonctionnent les notifications ?",
      answer: "Les notifications vous alertent en temps réel lorsque de nouvelles annonces correspondant à vos critères sont publiées. En tant qu'abonné premium, vous recevez ces alertes par email et sur votre mobile, même lorsque l'application n'est pas ouverte."
    },
    {
      question: "Quelles sont les limites de l'offre gratuite ?",
      answer: "L'offre gratuite vous permet d'accéder à notre agrégateur avec une limite de 10 consultations par jour, jusqu'à 3 alertes personnalisées et une période d'essai de 15 jours. Pour un accès illimité, nous vous recommandons notre offre Expert."
    },
  ];

  const isPremiumUser = tier === 'premium';
  
  return (
    <div className="py-12 px-4 md:px-6 lg:px-8 max-w-6xl mx-auto bg-white">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3 font-inter">Choisissez votre formule</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Découvrez le marché immobilier marocain en temps réel et ne manquez plus aucune opportunité grâce à nos alertes personnalisées.
        </p>
      </div>
      
      <TrialBanner />
      
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <PlanCard
          title="Découverte"
          description="Pour explorer notre service"
          price={0}
          features={freePlanFeatures}
          isActive={tier === 'free'}
          onSubscribe={() => navigate('/')}
          buttonText="Continuer gratuitement"
          showIcons={true}
        />
        
        <PlanCard
          title="Expert"
          description="Pour les chercheurs sérieux"
          price={99}
          features={premiumPlanFeatures}
          isActive={isPremiumUser}
          isRecommended={!isPremiumUser}
          onSubscribe={() => handleSubscribe('premium')}
          buttonText={isLoading ? "Traitement..." : isPremiumUser ? "Abonnement actif" : "S'abonner maintenant"}
          buttonDisabled={isLoading || isPremiumUser}
          showIcons={true}
        />
      </div>
      
      <div className="mt-16 max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Avantages exclusifs</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-muted rounded-xl p-6 text-center">
            <div className="bg-primary/10 rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
              <Search className="text-primary h-6 w-6" />
            </div>
            <h3 className="font-medium mb-2">Accès complet</h3>
            <p className="text-sm text-muted-foreground">
              Explorez l'intégralité des annonces immobilières aggrégées du marché marocain.
            </p>
          </div>
          <div className="bg-muted rounded-xl p-6 text-center">
            <div className="bg-primary/10 rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
              <Bell className="text-primary h-6 w-6" />
            </div>
            <h3 className="font-medium mb-2">Alertes intelligentes</h3>
            <p className="text-sm text-muted-foreground">
              Recevez des notifications instantanées selon vos critères spécifiques.
            </p>
          </div>
          <div className="bg-muted rounded-xl p-6 text-center">
            <div className="bg-primary/10 rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
              <Shield className="text-primary h-6 w-6" />
            </div>
            <h3 className="font-medium mb-2">Garantie satisfait</h3>
            <p className="text-sm text-muted-foreground">
              Remboursement garanti pendant 14 jours si notre service ne vous convient pas.
            </p>
          </div>
        </div>
      </div>
      
      <Separator className="my-16" />
      
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-8 text-center">Questions fréquentes</h2>
        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left font-medium">
                {item.question}
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground">{item.answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        
        <div className="mt-10 bg-muted rounded-xl p-6 text-center">
          <h3 className="font-medium mb-3">Besoin d'aide supplémentaire ?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Notre équipe est à votre disposition pour répondre à toutes vos questions.
          </p>
          <Button variant="outline" size="sm">Contacter le support</Button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
