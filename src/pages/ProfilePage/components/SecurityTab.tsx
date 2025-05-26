
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DeleteAccountDialog } from '@/components/account/DeleteAccountDialog';
import { useProfilePage } from '../hooks/useProfilePage';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import TwoFactorSetup from '@/components/auth/TwoFactorSetup';

export const SecurityTab = () => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { 
    currentPassword, 
    newPassword, 
    confirmPassword,
    setCurrentPassword,
    setNewPassword,
    setConfirmPassword,
    handleUpdatePassword,
    isUpdating,
    csrfToken,
    hasCSRFProtection
  } = useProfilePage();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Changer le mot de passe</CardTitle>
          <CardDescription>
            Mettez à jour votre mot de passe pour sécuriser votre compte.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            {hasCSRFProtection && csrfToken && (
              <input type="hidden" name="csrf_token" value={csrfToken} />
            )}
            
            <div className="space-y-2">
              <label htmlFor="currentPassword" className="text-sm font-medium">
                Mot de passe actuel
              </label>
              <Input
                id="currentPassword"
                type="password"
                placeholder="Mot de passe actuel"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="newPassword" className="text-sm font-medium">
                Nouveau mot de passe
              </label>
              <Input
                id="newPassword"
                type="password"
                placeholder="Nouveau mot de passe"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
                pattern="^(?=.*[A-Z])(?=.*[0-9]).{8,}$"
                title="Le mot de passe doit contenir au moins 8 caractères, dont une majuscule et un chiffre"
              />
              <p className="text-xs text-muted-foreground">
                Minimum 8 caractères, avec au moins une majuscule et un chiffre
              </p>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirmer le nouveau mot de passe
              </label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirmer le nouveau mot de passe"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button">
            Annuler
          </Button>
          <Button 
            onClick={handleUpdatePassword} 
            disabled={isUpdating}
            type="button"
          >
            {isUpdating ? "Mise à jour..." : "Sauvegarder"}
          </Button>
        </CardFooter>
      </Card>
      
      <Separator />
      
      <TwoFactorSetup />
      
      <Separator />

      <Card>
        <CardHeader>
          <CardTitle className="text-red-600">Zone de danger</CardTitle>
          <CardDescription>
            Une fois votre compte supprimé, toutes vos données seront définitivement effacées.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>
              Cette action est irréversible. Toutes vos données personnelles, favoris, alertes et historique seront définitivement supprimés.
            </AlertDescription>
          </Alert>
          <Button 
            variant="destructive"
            onClick={() => setShowDeleteDialog(true)}
          >
            Supprimer mon compte
          </Button>
        </CardContent>
      </Card>

      <DeleteAccountDialog 
        open={showDeleteDialog} 
        onOpenChange={setShowDeleteDialog}
      />
    </div>
  );
};
