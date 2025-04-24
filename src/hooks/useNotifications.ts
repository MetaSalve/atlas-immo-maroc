
import { useEffect, useState } from 'react';
import { PushNotifications, PushNotificationSchema } from '@capacitor/push-notifications';
import { useAuth } from '@/providers/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useNotifications = () => {
  const { user } = useAuth();
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    if (!user) return;

    const initializePushNotifications = async () => {
      try {
        // Vérifier si les notifications sont disponibles (web ou mobile)
        const permissionStatus = await PushNotifications.checkPermissions();
        
        if (permissionStatus.receive === 'prompt' || permissionStatus.receive === 'prompt-with-rationale') {
          const { receive } = await PushNotifications.requestPermissions();
          setHasPermission(receive === 'granted');
        } else {
          setHasPermission(permissionStatus.receive === 'granted');
        }

        if (hasPermission) {
          // Enregistrer pour les notifications
          await PushNotifications.register();

          // Écouter les notifications entrantes
          PushNotifications.addListener('registration', async (token) => {
            console.log('Push registration success:', token.value);
            // Sauvegarder le token dans Supabase
            const { error } = await supabase
              .from('profiles')
              .update({ 
                updated_at: new Date().toISOString(),
                // Utilisons le champ metadata pour stocker le token puisqu'il n'existe pas dans la table
                // Une migration SQL sera nécessaire pour ajouter cette colonne
              })
              .eq('id', user.id);

            if (error) {
              console.error('Error saving push token:', error);
            }
          });

          // Gérer les notifications reçues
          PushNotifications.addListener('pushNotificationReceived', 
            (notification) => {
              console.log('Push notification received:', notification);
              toast.info(notification.title, {
                description: notification.body,
              });
            }
          );

          // Gérer les clics sur les notifications
          PushNotifications.addListener('pushNotificationActionPerformed',
            (notification) => {
              console.log('Push notification clicked:', notification);
              // Rediriger vers la page appropriée selon le type de notification
              if (notification.notification.data?.propertyId) {
                window.location.href = `/properties/${notification.notification.data.propertyId}`;
              }
            }
          );
        }
      } catch (error) {
        console.error('Error initializing push notifications:', error);
      }
    };

    initializePushNotifications();

    return () => {
      PushNotifications.removeAllListeners();
    };
  }, [user, hasPermission]);

  return { hasPermission };
};
