
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Mail } from 'lucide-react';
import { useProfilePage } from '../hooks/useProfilePage';

export const SecurityTab = () => {
  const {
    handleUpdatePassword,
    currentPassword,
    newPassword,
    confirmPassword,
    isUpdating,
    setCurrentPassword,
    setNewPassword,
    setConfirmPassword,
  } = useProfilePage();

  return (
    <>
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
    </>
  );
};
