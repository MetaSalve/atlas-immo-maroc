
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export const CookieConsent = () => {
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (consent) {
      setAccepted(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'true');
    setAccepted(true);
  };

  if (accepted) {
    return null;
  }

  return (
    <Card className="fixed bottom-0 left-0 right-0 z-50 m-4">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            Nous utilisons des cookies pour améliorer votre expérience sur notre site. 
            En continuant à naviguer, vous acceptez notre utilisation des cookies.
            Pour en savoir plus, consultez notre{' '}
            <a href="/privacy" className="underline">politique de confidentialité</a>.
          </p>
          <Button onClick={handleAccept}>Accepter</Button>
        </div>
      </CardContent>
    </Card>
  );
};
