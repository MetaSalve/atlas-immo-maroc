
import { useSubscription } from '@/providers/SubscriptionProvider';
import { useSecurityAudit } from '@/providers/SecurityAuditProvider';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { LockIcon } from 'lucide-react';
import { useEffect } from 'react';

interface FeatureGateProps {
  feature: 'unlimited_alerts' | 'advanced_filters' | 'unlimited_favorites' | 'email_notifications' | 'property_comparisons';
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showAlert?: boolean;
  logAccess?: boolean;
}

export const FeatureGate = ({
  feature,
  children,
  fallback,
  showAlert = true,
  logAccess = true,
}: FeatureGateProps) => {
  const { isFeatureEnabled, checkFeatureAccess } = useSubscription();
  const { logEvent } = useSecurityAudit();
  const navigate = useNavigate();
  
  const hasAccess = isFeatureEnabled(feature);
  const { allowed, message } = checkFeatureAccess(feature);
  
  useEffect(() => {
    if (logAccess && !hasAccess) {
      // Journaliser les tentatives d'accès aux fonctionnalités premium
      logEvent('access_denied', { feature });
    } else if (logAccess && hasAccess) {
      // Journaliser l'utilisation des fonctionnalités premium
      logEvent('feature_access_premium', { feature });
    }
  }, [feature, hasAccess, logAccess, logEvent]);
  
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
