
import { createContext, useContext, useEffect, useState } from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import { useAuth } from '@/providers/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Database } from '@/integrations/supabase/types';

// Define the Notification type directly from the Database type
type Notification = Database['public']['Tables']['notifications']['Row'];

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
        setNotifications(data);
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

      // Update local state
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Impossible de marquer la notification comme lue');
    }
  };

  // Set up Supabase Realtime for real-time notifications
  useEffect(() => {
    if (!user) return;

    fetchNotifications();

    // Subscribe to new notifications
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
          
          // Update local state
          setNotifications(prev => [newNotification, ...prev]);
          setUnreadCount(prev => prev + 1);
          
          // Display toast notification
          toast.info(newNotification.title, {
            description: newNotification.body,
            action: {
              label: 'Voir',
              onClick: () => {
                // Redirect to appropriate page if needed
                if (newNotification.data?.propertyId) {
                  window.location.href = `/properties/${newNotification.data.propertyId}`;
                }
                // Mark as read
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
