
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
        console.log('[Notifications] Initializing push notifications for user:', user.id);
        
        // Vérifier si les notifications sont disponibles (web ou mobile)
        const permissionStatus = await PushNotifications.checkPermissions();
        console.log('[Notifications] Current permission status:', permissionStatus);
        
        if (permissionStatus.receive === 'prompt' || permissionStatus.receive === 'prompt-with-rationale') {
          console.log('[Notifications] Requesting permissions...');
          const { receive } = await PushNotifications.requestPermissions();
          setHasPermission(receive === 'granted');
          console.log('[Notifications] Permission request result:', receive);
        } else {
          setHasPermission(permissionStatus.receive === 'granted');
        }

        if (hasPermission) {
          console.log('[Notifications] Permission granted, registering for push...');
          // Enregistrer pour les notifications
          await PushNotifications.register();

          // Écouter les notifications entrantes
          PushNotifications.addListener('registration', async (token) => {
            console.log('[Notifications] Push registration success, token:', token.value);
            // Sauvegarder le token dans Supabase
            const { error } = await supabase
              .from('profiles')
              .update({ 
                updated_at: new Date().toISOString(),
              })
              .eq('id', user.id);

            if (error) {
              console.error('[Notifications] Error saving push token:', error);
            } else {
              console.log('[Notifications] Push token saved successfully');
            }
          });

          // Gérer les notifications reçues
          PushNotifications.addListener('pushNotificationReceived', 
            (notification) => {
              console.log('[Notifications] Push received:', notification);
              toast.info(notification.title, {
                description: notification.body,
              });
            }
          );

          // Gérer les clics sur les notifications
          PushNotifications.addListener('pushNotificationActionPerformed',
            (notification) => {
              console.log('[Notifications] Push notification clicked:', notification);
              // Rediriger vers la page appropriée selon le type de notification
              if (notification.notification.data?.propertyId) {
                console.log('[Notifications] Navigating to property:', notification.notification.data.propertyId);
                window.location.href = `/properties/${notification.notification.data.propertyId}`;
              }
            }
          );

          console.log('[Notifications] All listeners registered successfully');
        }
      } catch (error) {
        console.error('[Notifications] Error initializing push notifications:', error);
      }
    };

    initializePushNotifications();

    return () => {
      console.log('[Notifications] Cleaning up notification listeners');
      PushNotifications.removeAllListeners();
    };
  }, [user, hasPermission]);

  return { hasPermission };
};
