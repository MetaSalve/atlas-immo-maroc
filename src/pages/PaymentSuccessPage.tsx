
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PaymentConfirmation } from '@/components/payment/PaymentConfirmation';
import { useAuth } from '@/providers/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [transaction, setTransaction] = useState<any>(null);
  
  // Check for different payment providers
  const sessionId = searchParams.get('session_id'); // Stripe
  const orderId = searchParams.get('order_id'); // CMI
  const transactionId = sessionId || orderId || '';
  
  useEffect(() => {
    // Redirect if not logged in
    if (!user) {
      toast.error("Session expirée", {
        description: "Veuillez vous reconnecter pour accéder à cette page"
      });
      navigate('/auth');
      return;
    }
    
    const verifyPayment = async () => {
      if (!transactionId) {
        setError("Référence de transaction manquante");
        setLoading(false);
        return;
      }
      
      try {
        // Call verify-payment edge function
        const { data, error } = await supabase.functions.invoke('verify-payment', {
          body: { sessionId: transactionId },
        });
        
        if (error || !data || !data.success) throw new Error(error?.message || 'Échec de la vérification du paiement');
        
        setTransaction(data.transaction);
        setLoading(false);
        
        // Show success notification
        toast.success("Paiement confirmé", {
          description: "Votre abonnement premium a été activé avec succès"
        });
        
      } catch (err: any) {
        console.error('Erreur lors de la vérification du paiement:', err);
        setError("Impossible de vérifier votre paiement");
        setLoading(false);
      }
    };
    
    verifyPayment();
  }, [user, transactionId, navigate]);
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <h2 className="text-xl font-semibold mb-2">Vérification du paiement</h2>
        <p className="text-muted-foreground text-center">
          Veuillez patienter pendant que nous confirmons votre transaction...
        </p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="max-w-md mx-auto py-12 px-4 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Erreur de vérification</h2>
        <p className="mb-6 text-muted-foreground">{error}</p>
        <Button onClick={() => navigate('/subscription')}>
          Retourner aux abonnements
        </Button>
      </div>
    );
  }
  
  return (
    <PaymentConfirmation 
      transactionId={transaction.payment_id} 
      amount={transaction.amount}
      subscriptionEnd={transaction.subscription_ends_at}
    />
  );
};

export default PaymentSuccessPage;
