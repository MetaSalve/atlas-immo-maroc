
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { CreditCard, Lock, Loader2, CreditCardIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const PaymentPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'cmi'>('stripe');

  // Redirect if not logged in
  if (!user) {
    navigate('/auth');
    return null;
  }

  const handleStripePayment = async () => {
    try {
      setLoading(true);
      
      // Call the create-checkout edge function
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {},
      });
      
      if (error) throw new Error(error.message);
      if (!data || !data.success) throw new Error('Échec de la création du paiement');
      
      // Redirect to Stripe checkout
      window.location.href = data.redirectUrl;
      
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error("Erreur lors du traitement", {
        description: "Une erreur est survenue lors de la création du paiement."
      });
      setLoading(false);
    }
  };

  const handleCMIPayment = async () => {
    try {
      setLoading(true);
      
      // Call the CMI payment edge function
      const { data, error } = await supabase.functions.invoke('cmi-payment', {
        body: {},
      });
      
      if (error) throw new Error(error.message);
      if (!data || !data.success) throw new Error('Échec de la création du paiement CMI');
      
      // Create a form to post to CMI
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = data.paymentFormUrl;
      
      // Add all required CMI parameters
      Object.entries(data.paymentData).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value as string;
        form.appendChild(input);
      });
      
      // Add the form to the body and submit it
      document.body.appendChild(form);
      form.submit();
      
    } catch (error) {
      console.error('Error processing CMI payment:', error);
      toast.error("Erreur lors du traitement", {
        description: "Une erreur est survenue lors de la création du paiement CMI."
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
          <CardTitle>Choisir un mode de paiement</CardTitle>
          <CardDescription>
            Sélectionnez votre méthode de paiement préférée
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="stripe" onValueChange={(value) => setPaymentMethod(value as 'stripe' | 'cmi')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="stripe">Carte bancaire</TabsTrigger>
              <TabsTrigger value="cmi">CMI</TabsTrigger>
            </TabsList>
            
            <TabsContent value="stripe" className="space-y-4">
              <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-700 text-sm">
                <div className="flex items-start">
                  <CreditCardIcon className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Paiement sécurisé par Stripe</p>
                    <p className="mt-1">Paiement international avec carte Visa, Mastercard et American Express</p>
                  </div>
                </div>
              </div>
              
              <Button 
                className="w-full mt-4" 
                onClick={handleStripePayment}
                disabled={loading}
              >
                {loading ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Traitement en cours...</>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Payer avec carte bancaire
                  </>
                )}
              </Button>
            </TabsContent>
            
            <TabsContent value="cmi" className="space-y-4">
              <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4 text-green-700 text-sm">
                <div className="flex items-start">
                  <CreditCardIcon className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Paiement sécurisé par CMI</p>
                    <p className="mt-1">Centre Monétique Interbancaire - solution de paiement marocaine</p>
                  </div>
                </div>
              </div>
              
              <Button 
                className="w-full mt-4" 
                onClick={handleCMIPayment}
                disabled={loading}
              >
                {loading ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Traitement en cours...</>
                ) : (
                  <>
                    <Lock className="h-4 w-4 mr-2" />
                    Payer avec CMI
                  </>
                )}
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Paiement sécurisé et crypté
          </p>
        </CardFooter>
      </Card>
      
      <p className="text-center text-sm text-muted-foreground mt-6">
        En procédant au paiement, vous acceptez nos <a href="/terms" className="underline">conditions générales</a>.
      </p>
    </div>
  );
};

export default PaymentPage;
