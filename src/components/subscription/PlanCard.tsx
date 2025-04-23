
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PlanFeature {
  text: string;
}

interface PlanCardProps {
  title: string;
  description: string;
  price: number;
  features: PlanFeature[];
  isActive?: boolean;
  isRecommended?: boolean;
  onSubscribe: () => void;
  buttonText: string;
  buttonDisabled?: boolean;
}

export const PlanCard = ({
  title,
  description,
  price,
  features,
  isActive,
  isRecommended,
  onSubscribe,
  buttonText,
  buttonDisabled
}: PlanCardProps) => {
  return (
    <Card className={cn("flex flex-col", isActive ? "border-2 border-primary" : "")}>
      <CardHeader>
        {isActive && (
          <div className="py-1 px-3 rounded-full bg-primary text-primary-foreground w-fit text-sm font-medium mb-2">
            Votre plan actuel
          </div>
        )}
        {isRecommended && !isActive && (
          <div className="py-1 px-3 rounded-full bg-primary/10 text-primary w-fit text-sm font-medium mb-2">
            Recommandé
          </div>
        )}
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <div className="mt-4">
          <span className="text-4xl font-bold">{price}</span>
          <span className="text-muted-foreground ml-1 text-lg">MAD/mois</span>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <Check className="h-4 w-4 mr-2 text-green-500" />
              <span>{feature.text}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={onSubscribe}
          disabled={buttonDisabled}
        >
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
};
