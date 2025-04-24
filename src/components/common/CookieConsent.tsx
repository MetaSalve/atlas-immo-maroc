
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';

type CookieConsent = {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
};

const defaultConsent: CookieConsent = {
  necessary: true, // Toujours nécessaire
  analytics: false,
  marketing: false,
  preferences: true,
};

export const CookieConsent = () => {
  const [open, setOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [consent, setConsent] = useState<CookieConsent>(defaultConsent);

  useEffect(() => {
    const storedConsent = localStorage.getItem('cookie-consent');
    
    if (storedConsent) {
      try {
        setConsent(JSON.parse(storedConsent));
      } catch (e) {
        console.error('Erreur lors de la lecture du consentement aux cookies', e);
        setOpen(true);
      }
    } else {
      // Aucun consentement stocké, montrer la bannière
      setOpen(true);
    }
  }, []);

  const handleAcceptAll = () => {
    const fullConsent = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    };
    localStorage.setItem('cookie-consent', JSON.stringify(fullConsent));
    setConsent(fullConsent);
    setOpen(false);
  };

  const handleSavePreferences = () => {
    // Toujours forcer les cookies nécessaires
    const updatedConsent = { ...consent, necessary: true };
    localStorage.setItem('cookie-consent', JSON.stringify(updatedConsent));
    setConsent(updatedConsent);
    setOpen(false);
  };

  const handleRejectNonEssential = () => {
    const minimalConsent = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
    };
    localStorage.setItem('cookie-consent', JSON.stringify(minimalConsent));
    setConsent(minimalConsent);
    setOpen(false);
  };

  const toggleCookieType = (type: keyof CookieConsent) => {
    if (type === 'necessary') return; // On ne peut pas désactiver les cookies nécessaires
    setConsent(prev => ({ ...prev, [type]: !prev[type] }));
  };

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
      <Card className="w-full max-w-3xl">
        <CardContent className="p-6">
          {!showDetails ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Gestion des cookies</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Notre site utilise des cookies pour améliorer votre expérience. Veuillez choisir les catégories de cookies que vous acceptez.
                  </p>
                </div>
                <Button
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleRejectNonEssential()}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="text-sm">
                <p>
                  Nous utilisons des cookies pour assurer le bon fonctionnement du site, améliorer votre expérience, personnaliser le contenu et les annonces, 
                  et analyser notre trafic. Pour en savoir plus, consultez notre{' '}
                  <Link to="/privacy" className="font-medium underline">politique de confidentialité</Link>.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 sm:gap-4">
                <Button variant="default" onClick={handleAcceptAll}>
                  Accepter tous les cookies
                </Button>
                <Button variant="outline" onClick={handleRejectNonEssential}>
                  Uniquement cookies nécessaires
                </Button>
                <Button variant="ghost" onClick={() => setShowDetails(true)}>
                  Paramétrer
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <h2 className="text-xl font-semibold">Préférences de cookies</h2>
                <Button
                  variant="ghost" 
                  size="icon"
                  onClick={() => setShowDetails(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <Tabs defaultValue="details">
                <TabsList className="grid grid-cols-2">
                  <TabsTrigger value="details">Détails</TabsTrigger>
                  <TabsTrigger value="about">À propos des cookies</TabsTrigger>
                </TabsList>
                <TabsContent value="details" className="space-y-4 pt-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Cookies nécessaires</h3>
                        <p className="text-sm text-muted-foreground">
                          Ces cookies sont indispensables au fonctionnement du site.
                        </p>
                      </div>
                      <Switch checked disabled />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Cookies de préférences</h3>
                        <p className="text-sm text-muted-foreground">
                          Ces cookies permettent de mémoriser vos préférences d'utilisation.
                        </p>
                      </div>
                      <Switch 
                        checked={consent.preferences} 
                        onCheckedChange={() => toggleCookieType('preferences')} 
                        id="preferences"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Cookies analytiques</h3>
                        <p className="text-sm text-muted-foreground">
                          Ces cookies nous aident à comprendre comment les visiteurs utilisent le site.
                        </p>
                      </div>
                      <Switch 
                        checked={consent.analytics} 
                        onCheckedChange={() => toggleCookieType('analytics')} 
                        id="analytics" 
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Cookies marketing</h3>
                        <p className="text-sm text-muted-foreground">
                          Ces cookies sont utilisés pour vous proposer des contenus personnalisés.
                        </p>
                      </div>
                      <Switch 
                        checked={consent.marketing} 
                        onCheckedChange={() => toggleCookieType('marketing')} 
                        id="marketing" 
                      />
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="about" className="space-y-4 pt-4">
                  <p className="text-sm">
                    Les cookies sont de petits fichiers texte stockés sur votre appareil par les sites web que vous visitez. Ils sont largement utilisés pour faire fonctionner les sites web ou les rendre plus efficaces, ainsi que pour fournir des informations aux propriétaires du site.
                  </p>
                  <p className="text-sm">
                    <strong>Cookies nécessaires :</strong> Indispensables au fonctionnement du site, ils permettent d'utiliser ses principales fonctionnalités (accès à votre compte, mémorisation du panier, etc.).
                  </p>
                  <p className="text-sm">
                    <strong>Cookies de préférences :</strong> Permettent de mémoriser vos préférences d'utilisation (langue, région, paramètres d'affichage).
                  </p>
                  <p className="text-sm">
                    <strong>Cookies analytiques :</strong> Nous aident à comprendre comment vous interagissez avec notre site et à améliorer votre expérience.
                  </p>
                  <p className="text-sm">
                    <strong>Cookies marketing :</strong> Utilisés pour suivre les visiteurs sur les sites web afin d'afficher des publicités pertinentes et engageantes.
                  </p>
                </TabsContent>
              </Tabs>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setShowDetails(false)}>
                  Retour
                </Button>
                <Button onClick={handleSavePreferences}>
                  Enregistrer mes préférences
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
