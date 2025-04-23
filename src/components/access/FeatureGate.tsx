
import { useSubscription } from '@/providers/SubscriptionProvider';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { LockIcon } from 'lucide-react';

interface FeatureGateProps {
  feature: 'unlimited_alerts' | 'advanced_filters' | 'unlimited_favorites' | 'email_notifications' | 'property_comparisons';
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showAlert?: boolean;
}

export const FeatureGate = ({
  feature,
  children,
  fallback,
  showAlert = true,
}: FeatureGateProps) => {
  const { isFeatureEnabled, checkFeatureAccess } = useSubscription();
  const navigate = useNavigate();
  
  const hasAccess = isFeatureEnabled(feature);
  const { allowed, message } = checkFeatureAccess(feature);
  
  if (hasAccess) {
    return <>{children}</>;
  }
  
  if (fallback) {
    return <>{fallback}</>;
  }
  
  if (!showAlert) {
    return null;
  }
  
  return (
    <Alert className="mt-4">
      <div className="flex items-center">
        <LockIcon className="h-4 w-4 mr-2" />
        <AlertTitle className="flex items-center gap-2">
          Fonctionnalité Premium
          <Badge variant="outline" className="ml-2">Premium</Badge>
        </AlertTitle>
      </div>
      <AlertDescription className="mt-2">
        {message}
        <div className="mt-3">
          <Button onClick={() => navigate('/subscription')} size="sm">
            Passer à Premium
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};
