
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { CreditCard, Lock, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const PaymentPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Redirect if not logged in
  if (!user) {
    navigate('/auth');
    return null;
  }

  const handlePayment = async () => {
    try {
      setLoading(true);
      
      // Call the create-checkout edge function
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {},
      });
      
      if (error) throw new Error(error.message);
      if (!data || !data.success) throw new Error('Échec de la création du paiement');
      
      // Redirect to payment page or success page (for simulated payment)
      window.location.href = data.redirectUrl;
      
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error("Erreur lors du traitement", {
        description: "Une erreur est survenue lors de la création du paiement."
      });
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold text-center mb-6">Finaliser votre abonnement</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Résumé de la commande</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <span>Abonnement Premium (mensuel)</span>
            <span className="font-medium">99 MAD</span>
          </div>
          <div className="flex justify-between items-center text-sm text-muted-foreground mt-1">
            <span>Taxes incluses</span>
            <span>Facturation mensuelle</span>
          </div>
          <div className="border-t mt-4 pt-4 flex justify-between items-center font-semibold">
            <span>Total</span>
            <span>99 MAD</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Mode de test
          </CardTitle>
          <CardDescription>
            Cette page simule un paiement réussi pour tester les fonctionnalités Premium.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-700 text-sm">
            <p><strong>Mode test activé :</strong> Aucune vraie transaction ne sera effectuée.</p>
            <p className="mt-1">Le paiement sera simulé et votre compte passera en mode Premium pour 30 jours.</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            onClick={handlePayment}
            disabled={loading}
          >
            {loading ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Simulation en cours...</>
            ) : (
              <>
                <Lock className="h-4 w-4 mr-2" />
                Simuler le paiement de 99 MAD
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
      
      <p className="text-center text-sm text-muted-foreground mt-6">
        Ceci est une simulation pour tester les fonctionnalités Premium.
      </p>
    </div>
  );
};

export default PaymentPage;
