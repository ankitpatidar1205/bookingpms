import { useState, useEffect } from 'react';
import { notificationService } from '../../services/notificationService';
import { Card, CardBody, CardHeader, Button, Loading, Badge } from '../../components/common';
import { BellIcon, CheckIcon, TrashIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const response = await notificationService.getAll({ limit: 50 });
      setNotifications(response.data.notifications);
      setUnreadCount(response.data.unreadCount);
    } catch (error) {
      console.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, isRead: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      // Error handled by interceptor
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.success('All notifications marked as read');
    } catch (error) {
      // Error handled by interceptor
    }
  };

  const handleDelete = async (id) => {
    try {
      await notificationService.delete(id);
      const notification = notifications.find(n => n.id === id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      if (!notification?.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      toast.success('Notification deleted');
    } catch (error) {
      // Error handled by interceptor
    }
  };

  const handleDeleteRead = async () => {
    try {
      await notificationService.deleteRead();
      setNotifications(prev => prev.filter(n => !n.isRead));
      toast.success('Read notifications deleted');
    } catch (error) {
      // Error handled by interceptor
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600">
            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
          </p>
        </div>
        {notifications.length > 0 && (
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
                <CheckIcon className="h-4 w-4 mr-1" />
                Mark All Read
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={handleDeleteRead}>
              <TrashIcon className="h-4 w-4 mr-1" />
              Clear Read
            </Button>
          </div>
        )}
      </div>

      {/* Notifications List */}
      <Card>
        <CardBody className="p-0">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loading size="lg" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-12">
              <BellIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No notifications</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 ${!notification.isRead ? 'bg-primary-50' : ''}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-gray-900">
                          {notification.title}
                        </h3>
                        {!notification.isRead && (
                          <Badge variant="primary" className="text-xs">New</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400">
                        {formatDate(notification.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      {!notification.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="p-1 text-gray-400 hover:text-primary-600"
                          title="Mark as read"
                        >
                          <CheckIcon className="h-5 w-5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(notification.id)}
                        className="p-1 text-gray-400 hover:text-red-600"
                        title="Delete"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
