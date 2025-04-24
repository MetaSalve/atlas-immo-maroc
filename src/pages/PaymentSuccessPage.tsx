
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
  
  const transactionId = searchParams.get('transaction_id');
  
  useEffect(() => {
    // Rediriger si non connecté
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
        // Récupérer les détails de la transaction
        const { data, error } = await supabase
          .from('payment_transactions')
          .select('*')
          .eq('payment_id', transactionId)
          .eq('user_id', user.id)
          .single();
        
        if (error) throw error;
        
        if (!data) {
          setError("Transaction non trouvée");
          setLoading(false);
          return;
        }
        
        setTransaction(data);
        
        // Vérifier si l'abonnement a déjà été mis à jour
        const { data: profile } = await supabase
          .from('profiles')
          .select('subscription_status, subscription_ends_at')
          .eq('id', user.id)
          .single();
          
        // Si l'abonnement n'est pas encore premium, le mettre à jour
        if (profile && profile.subscription_status !== 'premium') {
          const thirtyDaysLater = new Date();
          thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30);
          
          await supabase
            .from('profiles')
            .update({
              subscription_status: 'premium',
              subscription_tier: 'premium',
              subscription_ends_at: thirtyDaysLater.toISOString(),
              updated_at: new Date().toISOString()
            })
            .eq('id', user.id);
        }
        
        setLoading(false);
        
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
