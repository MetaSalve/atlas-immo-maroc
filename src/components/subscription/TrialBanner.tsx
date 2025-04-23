
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useSubscription } from "@/providers/SubscriptionProvider";
import { differenceInDays } from "date-fns";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const TrialBanner = () => {
  const { tier, trialEndsAt } = useSubscription();
  const navigate = useNavigate();
  
  if (tier !== 'free' || !trialEndsAt) return null;
  
  const daysRemaining = differenceInDays(new Date(trialEndsAt), new Date());
  
  if (daysRemaining <= 0) return null;
  
  return (
    <Alert variant="default" className="bg-accent/10 border-accent text-accent-foreground mb-10 flex items-center justify-between">
      <div className="flex items-center">
        <Clock className="h-5 w-5 mr-2 flex-shrink-0" />
        <AlertDescription className="text-accent-foreground font-medium">
          {daysRemaining === 1 ? (
            "Votre période d'essai se termine demain !"
          ) : (
            `Il vous reste ${daysRemaining} jours dans votre période d'essai.`
          )}
        </AlertDescription>
      </div>
      <Button 
        size="sm" 
        variant="outline" 
        className="ml-4 border-accent text-accent-foreground hover:bg-accent hover:text-accent-foreground"
        onClick={() => navigate('#premium')}
      >
        Passer à l'offre Expert
      </Button>
    </Alert>
  );
};
