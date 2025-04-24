
import { createContext, useContext } from 'react';
import { useNotifications } from '@/hooks/useNotifications';

const NotificationsContext = createContext<{ hasPermission: boolean }>({
  hasPermission: false,
});

export const NotificationsProvider = ({ children }: { children: React.ReactNode }) => {
  const notifications = useNotifications();

  return (
    <NotificationsContext.Provider value={notifications}>
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
