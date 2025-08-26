
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DocumentHead } from '@/components/common/DocumentHead';

interface PaymentConfirmationProps {
  transactionId?: string;
  amount?: number;
  subscriptionEnd?: string;
}

export const PaymentConfirmation = ({ 
  transactionId = '', 
  amount = 99, 
  subscriptionEnd = '' 
}: PaymentConfirmationProps) => {
  const navigate = useNavigate();
  
  // Formater la date de fin d'abonnement
  const formattedDate = subscriptionEnd ? 
    new Date(subscriptionEnd).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) : '';
  
  return (
    <>
      <DocumentHead 
        title="Paiement confirmé - AlertImmo" 
        description="Votre paiement a été confirmé. Profitez maintenant de votre abonnement premium sur AlertImmo."
      />
      
      <div className="max-w-md mx-auto py-12 px-4">
        <Card className="shadow-md">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-4 bg-green-100 p-3 rounded-full">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-green-700">Paiement confirmé</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4 pt-4">
            <div className="text-center">
              <p className="text-muted-foreground mb-1">Merci pour votre paiement</p>
              <p className="text-xl font-semibold">{amount} MAD</p>
            </div>
            
            <div className="border-t border-b py-4 space-y-2">
              {transactionId && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Transaction ID:</span>
                  <span className="font-medium">{transactionId}</span>
                </div>
              )}
              
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Date:</span>
                <span className="font-medium">{new Date().toLocaleDateString('fr-FR')}</span>
              </div>
              
              {formattedDate && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Abonnement valide jusqu'au:</span>
                  <span className="font-medium">{formattedDate}</span>
                </div>
              )}
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800">
              <p className="font-medium mb-1">Abonnement activé avec succès</p>
              <p>Toutes les fonctionnalités Premium sont maintenant disponibles.</p>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-2">
            <Button 
              onClick={() => navigate('/profile')}
              className="w-full"
            >
              Voir mon abonnement
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="w-full"
            >
              Retour à l'accueil
            </Button>
          </CardFooter>
        </Card>
        
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Un email de confirmation a été envoyé à votre adresse.</p>
          <p className="mt-1">
            En cas de question, contactez notre support à{' '}
            <a href="mailto:support@alertimmo.ma" className="text-primary underline">
              support@alertimmo.ma
            </a>
          </p>
        </div>
      </div>
    </>
  );
};
