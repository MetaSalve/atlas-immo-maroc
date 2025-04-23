
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface PlanFeature {
  text: string;
  icon?: ReactNode;
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
  showIcons?: boolean;
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
  buttonDisabled,
  showIcons = false
}: PlanCardProps) => {
  return (
    <Card className={cn(
      "flex flex-col h-full transition-all duration-300 hover:shadow-lg",
      isActive ? "border-2 border-primary shadow-md" : "",
      isRecommended ? "shadow-md" : ""
    )}>
      <CardHeader className="pb-4">
        {isActive && (
          <div className="py-1 px-3 rounded-full bg-primary text-primary-foreground w-fit text-sm font-medium mb-2">
            Votre plan actuel
          </div>
        )}
        {isRecommended && !isActive && (
          <div className="py-1 px-3 rounded-full bg-accent text-accent-foreground w-fit text-sm font-medium mb-2">
            Recommandé
          </div>
        )}
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <div className="mt-4 flex items-end gap-1">
          <span className="text-4xl font-bold">{price}</span>
          <span className="text-muted-foreground ml-1 text-base mb-1">MAD/mois</span>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              {showIcons && feature.icon ? (
                <span className="mr-2 text-green-500 flex-shrink-0 mt-1">{feature.icon}</span>
              ) : (
                <Check className="h-4 w-4 mr-2 text-green-500 flex-shrink-0 mt-1" />
              )}
              <span className="text-sm">{feature.text}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button
          className={cn(
            "w-full transition-all",
            isRecommended && !isActive ? "bg-accent hover:bg-accent/90" : ""
          )}
          variant={isActive ? "outline" : "default"}
          onClick={onSubscribe}
          disabled={buttonDisabled}
        >
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
};
