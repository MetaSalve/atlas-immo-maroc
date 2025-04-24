
import { createContext, useContext, useEffect, useState } from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import { useAuth } from '@/providers/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Notification {
  id: string;
  title: string;
  body: string;
  data: any;
  read: boolean;
  created_at: string;
}

interface NotificationsContextType {
  hasPermission: boolean;
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => Promise<void>;
  fetchNotifications: () => Promise<void>;
}

const NotificationsContext = createContext<NotificationsContextType>({
  hasPermission: false,
  notifications: [],
  unreadCount: 0,
  markAsRead: async () => {},
  fetchNotifications: async () => {}
});

export const NotificationsProvider = ({ children }: { children: React.ReactNode }) => {
  const { hasPermission } = useNotifications();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      if (data) {
        setNotifications(data as Notification[]);
        setUnreadCount(data.filter(n => !n.read).length);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id);

      if (error) throw error;

      // Mettre à jour l'état local
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Impossible de marquer la notification comme lue');
    }
  };

  // Configurer Supabase Realtime pour les notifications en temps réel
  useEffect(() => {
    if (!user) return;

    fetchNotifications();

    // S'abonner aux nouvelles notifications
    const channel = supabase
      .channel('db-notifications')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        }, 
        payload => {
          console.log('New notification received:', payload);
          const newNotification = payload.new as Notification;
          
          // Mettre à jour l'état local
          setNotifications(prev => [newNotification, ...prev]);
          setUnreadCount(prev => prev + 1);
          
          // Afficher une toast pour la notification
          toast.info(newNotification.title, {
            description: newNotification.body,
            action: {
              label: 'Voir',
              onClick: () => {
                // Rediriger vers la page appropriée si nécessaire
                if (newNotification.data?.propertyId) {
                  window.location.href = `/properties/${newNotification.data.propertyId}`;
                }
                // Marquer comme lu
                markAsRead(newNotification.id);
              }
            }
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return (
    <NotificationsContext.Provider 
      value={{ 
        hasPermission, 
        notifications, 
        unreadCount,
        markAsRead,
        fetchNotifications
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotificationsContext = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotificationsContext must be used within a NotificationsProvider');
  }
  return context;
};
