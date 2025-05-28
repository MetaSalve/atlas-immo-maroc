
import React from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNotificationsContext } from '@/providers/NotificationsProvider';
import { Link } from 'react-router-dom';

export const NotificationIndicator = () => {
  const { notifications } = useNotificationsContext();
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Button variant="ghost" size="sm" asChild className="relative">
      <Link to="/notifications">
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Link>
    </Button>
  );
};
