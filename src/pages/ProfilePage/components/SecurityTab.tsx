
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DeleteAccountDialog } from '@/components/account/DeleteAccountDialog';
import { useProfilePage } from '../hooks/useProfilePage';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, Shield } from 'lucide-react';
import TwoFactorSetup from '@/components/auth/TwoFactorSetup';
import { checkPasswordStrength } from '@/utils/security/passwordSecurity';

export const SecurityTab = () => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [passwordFeedback, setPasswordFeedback] = useState<string[]>([]);
  const [passwordScore, setPasswordScore] = useState(0);
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

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setNewPassword(password);
    
    // Évaluer la force du mot de passe pendant la saisie
    if (password) {
      const { score, feedback } = checkPasswordStrength(password);
      setPasswordScore(score);
      setPasswordFeedback(feedback);
    } else {
      setPasswordScore(0);
      setPasswordFeedback([]);
    }
  };

  const getScoreColor = () => {
    if (passwordScore <= 1) return "bg-red-500";
    if (passwordScore <= 3) return "bg-yellow-500";
    return "bg-green-500";
  };

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
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Nouveau mot de passe"
                  value={newPassword}
                  onChange={handlePasswordChange}
                  className="pl-10"
                  required
                  minLength={8}
                />
              </div>
              
              {/* Indicateur de force du mot de passe */}
              {newPassword && (
                <div className="mt-2">
                  <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${getScoreColor()}`} 
                      style={{ width: `${(passwordScore / 5) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-gray-500">Faible</span>
                    <span className="text-xs text-gray-500">Fort</span>
                  </div>
                </div>
              )}
              
              {passwordFeedback.length > 0 && (
                <Alert className="mt-2">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <ul className="list-disc pl-4 text-xs">
                      {passwordFeedback.map((feedback, index) => (
                        <li key={index}>{feedback}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
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
              {confirmPassword && newPassword && confirmPassword !== newPassword && (
                <p className="text-xs text-destructive">Les mots de passe ne correspondent pas</p>
              )}
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button">
            Annuler
          </Button>
          <Button 
            onClick={handleUpdatePassword} 
            disabled={isUpdating || passwordScore < 4 || (newPassword !== confirmPassword)}
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
