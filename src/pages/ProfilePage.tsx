
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, CreditCard, Shield } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';

import { SubscriptionTab } from './ProfilePage/components/SubscriptionTab';
import { ProfileTab } from './ProfilePage/components/ProfileTab';
import { SecurityTab } from './ProfilePage/components/SecurityTab';
import { useProfilePage } from './ProfilePage/hooks/useProfilePage';

const ProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isLoading } = useProfilePage();

  if (!user) {
    navigate('/auth');
    return null;
  }

  if (isLoading) {
    return <div>Chargement...</div>;
  }

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
          <SubscriptionTab />
        </TabsContent>
        
        <TabsContent value="profile">
          <ProfileTab />
        </TabsContent>
        
        <TabsContent value="security">
          <SecurityTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePage;
