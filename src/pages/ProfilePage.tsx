import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';
import { useSubscription } from '@/providers/SubscriptionProvider';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format, addDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { User, Heart, Bell, CreditCard, KeyRound, LogOut, Settings, Info, Mail, Calendar, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const ProfilePage = () => {
  const { user, signOut } = useAuth();
  const { tier, maxFavorites, allowedAlerts } = useSubscription();
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const isPremium = tier === 'premium';
  const isFree = tier === 'free';
  
  const trialDays = 14;
  const signUpDate = new Date(user?.created_at || Date.now() - 5 * 24 * 60 * 60 * 1000);
  const trialEndDate = addDays(signUpDate, trialDays);
  const today = new Date();
  const daysRemaining = Math.max(0, Math.ceil((trialEndDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
  const trialProgress = Math.min(100, ((trialDays - daysRemaining) / trialDays) * 100);
  
  const subscriptionData = {
    status: isPremium ? 'active' : 'not_active',
    currentPeriodEnd: isPremium ? addDays(today, 30) : null,
    createdAt: isPremium ? addDays(today, -30) : null,
    priceId: isPremium ? 'price_premium_monthly' : null,
    renewalDate: isPremium ? addDays(today, 30) : null,
    price: '99 MAD',
    periodicity: 'mensuel'
  };

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          
          if (error) throw error;
          
          if (data) {
            setFullName(data.full_name || '');
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      };
      
      fetchProfile();
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    try {
      setIsUpdating(true);
      
      const { error } = await supabase
        .from('profiles')
        .update({ 
          full_name: fullName,
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      toast.success('Profil mis à jour avec succès');
    } catch (error: any) {
      toast.error('Erreur lors de la mise à jour du profil', {
        description: error.message
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }
    
    try {
      setIsUpdating(true);
      
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;
      
      toast.success('Mot de passe mis à jour avec succès');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      toast.error('Erreur lors de la mise à jour du mot de passe', {
        description: error.message
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleManageSubscription = async () => {
    try {
      if (!user) {
        toast.error('Vous devez être connecté pour gérer votre abonnement');
        return;
      }
      
      toast.info('Redirection vers le portail de gestion des abonnements...');
      
      setTimeout(() => {
        navigate('/subscription');
      }, 1000);
      
    } catch (error: any) {
      toast.error('Erreur lors de l\'accès au portail d\'abonnement', {
        description: error.message
      });
    }
  };
  
  const handleUpgradeSubscription = async () => {
    navigate('/subscription');
  };
  
  if (!user) {
    navigate('/auth');
    return null;
  }
  
  const userInitials = user?.email?.substring(0, 2).toUpperCase() || 'U';
  
  return (
    <div className="py-10 px-4 md:px-6 lg:px-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight mb-6 text-navy">Mon compte</h1>
      
      <Tabs defaultValue="subscription" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="subscription" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span>Abonnement</span>
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Profil</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>Sécurité</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="subscription">
          {isFree ? (
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <CardTitle>Période d'essai gratuite</CardTitle>
                    <CardDescription className="mt-1">
                      Votre période d'essai expire dans {daysRemaining} jours
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="mt-2 sm:mt-0 bg-orange-100 text-orange-700 border-orange-200 w-fit">
                    <Calendar className="h-3 w-3 mr-1" />
                    {format(trialEndDate, 'dd MMM yyyy', { locale: fr })}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progression de votre essai</span>
                    <span>{Math.round(trialProgress)}%</span>
                  </div>
                  <Progress value={trialProgress} />
                </div>
                
                <div className="rounded-lg border p-4 bg-cream/20 space-y-3">
                  <h3 className="font-medium">Limitations du compte gratuit</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span>Favoris</span>
                      <span className="font-medium">{maxFavorites} maximum</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Alertes</span>
                      <span className="font-medium">{allowedAlerts} maximum</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Filtres avancés</span>
                      <span className="text-red-500">Non disponible</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Notifications par email</span>
                      <span className="text-red-500">Non disponible</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-700">
                  <div className="flex items-start">
                    <Info className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                    <p className="font-medium">Passez à l'offre Premium</p>
                    <p className="mt-1">Votre période d'essai se termine bientôt. Passez à l'offre premium pour avoir un accès illimité à toutes les fonctionnalités.</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={handleUpgradeSubscription}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Passer à l'offre Premium
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex items-center">
                      <CardTitle>Abonnement Premium</CardTitle>
                      <Badge variant="default" className="ml-2 bg-green-500">
                        Actif
                      </Badge>
                    </div>
                    <CardDescription className="mt-1">
                      {subscriptionData.price} • {subscriptionData.periodicity}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border p-4 bg-cream/20">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                    <h3 className="font-medium">Détails de l'abonnement</h3>
                    <Badge variant="outline" className="w-fit mt-1 sm:mt-0 bg-blue-50 text-blue-700 border-blue-200">
                      <Calendar className="h-3 w-3 mr-1" />
                      Prochain prélèvement le {format(subscriptionData.renewalDate, 'dd MMMM yyyy', { locale: fr })}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                      <p className="font-medium">Fonctionnalités incluses</p>
                      <ul className="space-y-1 text-muted-foreground">
                        <li className="flex items-center">
                          <span className="inline-block w-4 h-4 rounded-full bg-green-500/20 text-green-600 text-center text-xs mr-2">✓</span>
                          Favoris illimités
                        </li>
                        <li className="flex items-center">
                          <span className="inline-block w-4 h-4 rounded-full bg-green-500/20 text-green-600 text-center text-xs mr-2">✓</span>
                          Alertes illimitées
                        </li>
                        <li className="flex items-center">
                          <span className="inline-block w-4 h-4 rounded-full bg-green-500/20 text-green-600 text-center text-xs mr-2">✓</span>
                          Filtres avancés
                        </li>
                        <li className="flex items-center">
                          <span className="inline-block w-4 h-4 rounded-full bg-green-500/20 text-green-600 text-center text-xs mr-2">✓</span>
                          Notifications par email
                        </li>
                      </ul>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="font-medium">Informations de paiement</p>
                      <div className="text-muted-foreground">
                        <p>Carte •••• 4242</p>
                        <p>Expire le 12/25</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 text-amber-700">
                  <div className="flex items-start">
                    <Info className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                    <p>Votre abonnement se renouvellera automatiquement le {format(subscriptionData.renewalDate, 'dd MMMM yyyy', { locale: fr })}. Vous pouvez le gérer à tout moment.</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row gap-3">
                <Button 
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={handleManageSubscription}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Gérer le paiement
                </Button>
                <Button
                  variant="outline" 
                  className="w-full sm:w-auto text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30"
                  onClick={() => navigate('/subscription')}
                >
                  Annuler l'abonnement
                </Button>
              </CardFooter>
            </Card>
          )}
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Historique des paiements</CardTitle>
            </CardHeader>
            <CardContent>
              {isPremium ? (
                <div className="border rounded-md">
                  <div className="grid grid-cols-4 gap-4 p-4 border-b bg-muted/50 font-medium text-sm">
                    <div>Date</div>
                    <div>Montant</div>
                    <div>Statut</div>
                    <div className="text-right">Facture</div>
                  </div>
                  <div className="grid grid-cols-4 gap-4 p-4 text-sm items-center">
                    <div>{format(subscriptionData.createdAt || new Date(), 'dd/MM/yyyy', { locale: fr })}</div>
                    <div>99 MAD</div>
                    <div>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Payé
                      </Badge>
                    </div>
                    <div className="text-right">
                      <Button variant="ghost" size="sm" className="h-8 px-2">
                        Télécharger
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Aucun historique de paiement disponible</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
              <CardDescription>
                Mettez à jour vos informations personnelles.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="fullName" className="text-sm font-medium">
                    Nom complet
                  </label>
                  <Input
                    id="fullName"
                    placeholder="Votre nom complet"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">
                    Pour changer d'email, veuillez contacter le support.
                  </p>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => navigate('/')}>
                Annuler
              </Button>
              <Button 
                onClick={handleUpdateProfile} 
                disabled={isUpdating}
              >
                {isUpdating ? "Mise à jour..." : "Sauvegarder"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Changer de mot de passe</CardTitle>
              <CardDescription>
                Mettez à jour votre mot de passe pour sécuriser votre compte.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="currentPassword" className="text-sm font-medium">
                    Mot de passe actuel
                  </label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="newPassword" className="text-sm font-medium">
                    Nouveau mot de passe
                  </label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium">
                    Confirmer le mot de passe
                  </label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => {
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
              }}>
                Annuler
              </Button>
              <Button 
                onClick={handleUpdatePassword} 
                disabled={isUpdating || !currentPassword || !newPassword || !confirmPassword}
              >
                {isUpdating ? "Mise à jour..." : "Changer le mot de passe"}
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Support et aide</CardTitle>
              <CardDescription>
                Besoin d'aide avec votre compte ?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => window.open('mailto:support@alertimmo.com')}
              >
                <Mail className="h-4 w-4 mr-2" />
                Contacter le support
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePage;
