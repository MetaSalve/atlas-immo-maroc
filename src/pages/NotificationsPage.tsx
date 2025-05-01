
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useNotificationsContext } from '@/providers/NotificationsProvider';
import { useTranslation } from '@/i18n';

const NotificationsPage = () => {
  const { t } = useTranslation();
  const { notifications, markAsRead } = useNotificationsContext();

  return (
    <div className="container py-6">
      <Helmet>
        <title>{t('notifications.title')} | AlertImmo</title>
      </Helmet>

      <h1 className="text-3xl font-bold mb-6">{t('notifications.title')}</h1>
      
      {notifications.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">{t('notifications.empty')}</p>
        </div>
      ) : (
        <ul className="divide-y">
          {notifications.map(notification => (
            <li 
              key={notification.id} 
              className={`py-4 px-2 ${!notification.read ? 'bg-blue-50' : ''}`}
              onClick={() => markAsRead(notification.id)}
            >
              <h3 className="font-medium">{notification.title}</h3>
              <p className="text-gray-600">{notification.body}</p>
              <span className="text-xs text-gray-400">
                {new Date(notification.created_at).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationsPage;
