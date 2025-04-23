
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqSectionProps {
  items?: FaqItem[];
}

export const FaqSection = ({ items = [] }: FaqSectionProps) => {
  const defaultFaqItems = [
    {
      question: "Comment fonctionne la période d'essai ?",
      answer: "La période d'essai gratuite de 15 jours commence dès la création de votre compte. Vous pouvez explorer les fonctionnalités de base du service sans engagement."
    },
    {
      question: "Puis-je annuler mon abonnement à tout moment ?",
      answer: "Oui, vous pouvez annuler votre abonnement à tout moment depuis votre espace personnel. Si vous annulez pendant les 14 premiers jours suivant la souscription, vous serez intégralement remboursé."
    },
    {
      question: "Comment fonctionnent les notifications ?",
      answer: "Les notifications vous alertent en temps réel lorsqu'une nouvelle annonce correspondant à vos critères est publiée. Ces alertes sont disponibles par email et notification push pour les abonnés premium."
    },
    {
      question: "Quelles sont les limitations de l'offre gratuite ?",
      answer: "L'offre gratuite vous permet d'accéder aux fonctionnalités de base avec certaines limitations : 10 consultations par jour, 3 alertes configurables et une période d'essai de 15 jours."
    }
  ];

  const faqItems = items.length > 0 ? items : defaultFaqItems;

  return (
    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold mb-6">Questions fréquentes</h2>
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
      </div>
      
      <div>
        <div className="bg-muted rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Besoin d'aide ?</h2>
          <p className="text-muted-foreground mb-6">
            Notre équipe d'experts est à votre disposition pour vous conseiller et répondre à toutes vos questions.
          </p>
          <Button variant="outline" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Contacter le support
          </Button>
        </div>
      </div>
    </div>
  );
};
