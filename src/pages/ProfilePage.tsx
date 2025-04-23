import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';
import { useSubscription } from '@/providers/SubscriptionProvider';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { User, Heart, Bell, CreditCard, KeyRound, LogOut, Settings, Info, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

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

  const subscriptionData = {
    status: isPremium ? 'active' : 'not_active',
    currentPeriodEnd: isPremium ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : null,
    createdAt: isPremium ? new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) : null,
    priceId: isPremium ? 'price_premium_monthly' : null,
  };

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
  
  const handleCancelSubscription = async () => {
    if (!isPremium) {
      toast.info('Vous n\'avez pas d\'abonnement actif');
      return;
    }
    
    toast.info('Redirection vers la page d\'annulation d\'abonnement...');
    setTimeout(() => {
      navigate('/subscription');
    }, 1000);
  };
  
  if (!user) {
    navigate('/auth');
    return null;
  }
  
  const userInitials = user?.email?.substring(0, 2).toUpperCase() || 'U';
  
  return (
    <div className="py-10 px-4 md:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <Card className="w-full md:w-64 bg-cream/30">
          <CardHeader className="text-center pb-2">
            <Avatar className="w-20 h-20 mx-auto mb-2">
              <AvatarImage src="" alt={user?.email || "Utilisateur"} />
              <AvatarFallback className="bg-skyblue text-white text-lg">{userInitials}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-xl font-medium text-navy">
              {user.email?.split('@')[0]}
            </CardTitle>
            <CardDescription className="text-navy/60">
              {isPremium ? 'Abonné Premium' : 'Compte Gratuit'}
            </CardDescription>
          </CardHeader>
          <Separator />
          <CardContent className="p-0">
            <nav className="flex flex-col">
              <Button
                variant="ghost"
                className="justify-start rounded-none h-12 px-4 py-2 text-navy/80 hover:text-navy hover:bg-cream/50"
                onClick={() => navigate('/favorites')}
              >
                <Heart className="h-4 w-4 mr-3" />
                Favoris
              </Button>
              <Button
                variant="ghost"
                className="justify-start rounded-none h-12 px-4 py-2 text-navy/80 hover:text-navy hover:bg-cream/50"
                onClick={() => navigate('/alerts')}
              >
                <Bell className="h-4 w-4 mr-3" />
                Alertes
              </Button>
              <Button
                variant="ghost"
                className="justify-start rounded-none h-12 px-4 py-2 text-navy/80 hover:text-navy hover:bg-cream/50"
                onClick={() => navigate('/subscription')}
              >
                <CreditCard className="h-4 w-4 mr-3" />
                Abonnements
              </Button>
            </nav>
          </CardContent>
          <Separator />
          <CardFooter className="p-0">
            <Button
              variant="ghost"
              className="w-full justify-start rounded-none h-12 px-4 py-2 text-destructive hover:bg-destructive/10"
              onClick={() => signOut()}
            >
              <LogOut className="h-4 w-4 mr-3" />
              Déconnexion
            </Button>
          </CardFooter>
        </Card>
        
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight mb-6 text-navy">Mon compte</h1>
          
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Profil</span>
              </TabsTrigger>
              <TabsTrigger value="subscription" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                <span>Abonnement</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <KeyRound className="h-4 w-4" />
                <span>Sécurité</span>
              </TabsTrigger>
            </TabsList>
            
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
            
            <TabsContent value="subscription">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Détails de l'abonnement</CardTitle>
                    {isPremium && (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Actif
                      </Badge>
                    )}
                  </div>
                  <CardDescription>
                    Gérez votre abonnement et les détails de paiement.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isPremium ? (
                    <>
                      <div className="rounded-lg border p-4 bg-cream/20">
                        <h3 className="text-lg font-medium mb-2">Abonnement Premium</h3>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p><span className="font-medium">Prix:</span> 99 MAD/mois</p>
                          {subscriptionData.currentPeriodEnd && (
                            <p>
                              <span className="font-medium">Prochain paiement:</span>{' '}
                              {format(subscriptionData.currentPeriodEnd, 'dd MMMM yyyy', { locale: fr })}
                            </p>
                          )}
                          {subscriptionData.createdAt && (
                            <p>
                              <span className="font-medium">Date d'inscription:</span>{' '}
                              {format(subscriptionData.createdAt, 'dd MMMM yyyy', { locale: fr })}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Button 
                          onClick={handleManageSubscription}
                          variant="outline"
                          className="flex-1"
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Gérer l'abonnement
                        </Button>
                        <Button 
                          onClick={handleCancelSubscription}
                          variant="destructive"
                          className="flex-1"
                        >
                          Annuler l'abonnement
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-6 space-y-4">
                      <div className="mb-4 text-center">
                        <Info className="h-10 w-10 text-navy/50 mx-auto mb-2" />
                        <h3 className="text-lg font-medium">Aucun abonnement actif</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Vous utilisez actuellement la version gratuite.
                        </p>
                      </div>
                      
                      <div className="space-y-2 text-sm text-left">
                        <div className="flex items-center">
                          <span className="w-32">Favoris:</span>
                          <span>{maxFavorites === Infinity ? 'Illimités' : maxFavorites}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="w-32">Alertes:</span>
                          <span>{allowedAlerts === Infinity ? 'Illimitées' : allowedAlerts}</span>
                        </div>
                      </div>
                      
                      <Button 
                        onClick={() => navigate('/subscription')}
                        className="mt-4"
                      >
                        <CreditCard className="h-4 w-4 mr-2" />
                        S'abonner maintenant
                      </Button>
                    </div>
                  )}
                </CardContent>
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
      </div>
    </div>
  );
};

export default ProfilePage;
