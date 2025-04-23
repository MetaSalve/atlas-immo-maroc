
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useSubscription } from "@/providers/SubscriptionProvider"
import { differenceInDays } from "date-fns"
import { Bell } from "lucide-react"

export const TrialBanner = () => {
  const { tier, trialEndsAt } = useSubscription()
  
  if (tier !== 'free' || !trialEndsAt) return null
  
  const daysRemaining = differenceInDays(new Date(trialEndsAt), new Date())
  
  if (daysRemaining <= 0) return null
  
  return (
    <Alert variant="default" className="bg-primary/10 border-primary text-primary mb-8">
      <Bell className="h-5 w-5" />
      <AlertDescription className="text-primary">
        {daysRemaining === 1 ? (
          "Votre période d'essai se termine demain. Passez à l'offre Premium pour continuer à profiter de toutes les fonctionnalités."
        ) : (
          `Il vous reste ${daysRemaining} jours dans votre période d'essai. Passez à l'offre Premium pour ne rien manquer.`
        )}
      </AlertDescription>
    </Alert>
  )
}
