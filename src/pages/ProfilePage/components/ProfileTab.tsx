
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useProfilePage } from '../hooks/useProfilePage';

export const ProfileTab = () => {
  const { 
    fullName, 
    email, 
    setFullName, 
    handleUpdateProfile, 
    isUpdating 
  } = useProfilePage();

  return (
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
        <Button variant="outline" onClick={() => window.location.href = '/'}>
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
  );
};
