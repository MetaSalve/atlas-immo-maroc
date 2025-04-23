
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { CreditCard, Lock } from 'lucide-react';

const PaymentPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });

  // Redirect if not logged in
  if (!user) {
    navigate('/auth');
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      // In a real implementation, you would update the user's subscription status in your database
      toast.success("Paiement accepté", {
        description: "Votre abonnement Premium est maintenant actif. Profitez de toutes les fonctionnalités !",
        duration: 5000
      });
      navigate('/');
    }, 2000);
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
            Informations de paiement
          </CardTitle>
          <CardDescription>
            Votre paiement est sécurisé et vos informations ne sont jamais stockées.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardName">Titulaire de la carte</Label>
              <Input 
                id="cardName" 
                name="cardName"
                placeholder="Nom sur la carte"
                value={formData.cardName}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Numéro de carte</Label>
              <Input 
                id="cardNumber" 
                name="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={formData.cardNumber}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Date d'expiration</Label>
                <Input 
                  id="expiryDate" 
                  name="expiryDate"
                  placeholder="MM/AA"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cvv">Code de sécurité</Label>
                <Input 
                  id="cvv" 
                  name="cvv"
                  placeholder="123"
                  value={formData.cvv}
                  onChange={handleChange}
                  type="password"
                  required
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            onClick={handleSubmit} 
            disabled={loading}
          >
            {loading ? (
              <>Traitement en cours...</>
            ) : (
              <>
                <Lock className="h-4 w-4 mr-2" />
                Payer 99 MAD
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
      
      <p className="text-center text-sm text-muted-foreground mt-6">
        En procédant au paiement, vous acceptez nos Conditions Générales d'Utilisation et notre Politique de Confidentialité.
      </p>
    </div>
  );
};

export default PaymentPage;
