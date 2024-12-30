import apiClient from '../../api/apiClient';
import WebSocketService from '../websocketService';

export interface Notification {
  id: string;
  type: 'trade' | 'alert' | 'news' | 'account' | 'system';
  title: string;
  message: string;
  priority: 'high' | 'medium' | 'low';
  timestamp: string;
  read: boolean;
  metadata?: {
    tradeId?: string;
    alertId?: string;
    newsId?: string;
    accountEvent?: string;
    [key: string]: any;
  };
}

export interface NotificationPreferences {
  channels: {
    email: boolean;
    push: boolean;
    sms: boolean;
    telegram?: boolean;
    slack?: boolean;
  };
  categories: {
    [key: string]: {
      enabled: boolean;
      priority: 'high' | 'medium' | 'low';
      channels: string[];
    };
  };
  schedules: {
    [key: string]: {
      enabled: boolean;
      frequency: 'realtime' | 'daily' | 'weekly' | 'monthly';
      time?: string;
      dayOfWeek?: number;
      dayOfMonth?: number;
    };
  };
}

class NotificationService {
  private listeners: Map<string, Set<(notification: Notification) => void>> =
    new Map();

  constructor() {
    this.setupWebSocket();
  }

  private setupWebSocket() {
    WebSocketService.on('notification', (notification: Notification) => {
      this.handleNotification(notification);
    });

    WebSocketService.on('connected', () => {
      WebSocketService.subscribe('notifications');
    });
  }

  private handleNotification(notification: Notification) {
    // Notify all listeners for this notification type
    const typeListeners = this.listeners.get(notification.type);
    if (typeListeners) {
      typeListeners.forEach((listener) => listener(notification));
    }

    // Notify all general listeners
    const allListeners = this.listeners.get('all');
    if (allListeners) {
      allListeners.forEach((listener) => listener(notification));
    }

    // Show browser notification if enabled
    this.showBrowserNotification(notification);
  }

  private async showBrowserNotification(notification: Notification) {
    if (!('Notification' in window)) {
      return;
    }

    if (Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/logo.png',
        tag: notification.id,
      });
    } else if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        this.showBrowserNotification(notification);
      }
    }
  }

  // Subscribe to notifications
  public subscribe(
    type: string,
    callback: (notification: Notification) => void
  ) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)?.add(callback);
  }

  // Unsubscribe from notifications
  public unsubscribe(
    type: string,
    callback: (notification: Notification) => void
  ) {
    this.listeners.get(type)?.delete(callback);
  }

  // Fetch notifications
  public async getNotifications(
    page: number = 1,
    limit: number = 20,
    filter?: {
      type?: string[];
      priority?: ('high' | 'medium' | 'low')[];
      read?: boolean;
      startDate?: string;
      endDate?: string;
    }
  ): Promise<{ notifications: Notification[]; total: number }> {
    return apiClient.get('/notifications', {
      params: {
        page,
        limit,
        ...filter,
      },
    });
  }

  // Mark notification as read
  public async markAsRead(notificationId: string): Promise<void> {
    await apiClient.patch(`/notifications/${notificationId}/read`);
  }

  // Mark all notifications as read
  public async markAllAsRead(): Promise<void> {
    await apiClient.patch('/notifications/read-all');
  }

  // Delete notification
  public async deleteNotification(notificationId: string): Promise<void> {
    await apiClient.delete(`/notifications/${notificationId}`);
  }

  // Get notification preferences
  public async getPreferences(): Promise<NotificationPreferences> {
    return apiClient.get('/notifications/preferences');
  }

  // Update notification preferences
  public async updatePreferences(
    preferences: Partial<NotificationPreferences>
  ): Promise<NotificationPreferences> {
    return apiClient.patch('/notifications/preferences', preferences);
  }

  // Test notification channels
  public async testNotification(channel: string): Promise<{ success: boolean }> {
    return apiClient.post('/notifications/test', { channel });
  }

  // Connect external services
  public async connectExternalService(
    service: 'telegram' | 'slack',
    config: any
  ): Promise<{ success: boolean }> {
    return apiClient.post(`/notifications/services/${service}/connect`, config);
  }

  // Disconnect external services
  public async disconnectExternalService(
    service: 'telegram' | 'slack'
  ): Promise<void> {
    await apiClient.delete(`/notifications/services/${service}`);
  }

  // Get notification templates
  public async getTemplates(): Promise<{
    [key: string]: {
      title: string;
      message: string;
      variables: string[];
    };
  }> {
    return apiClient.get('/notifications/templates');
  }

  // Update notification template
  public async updateTemplate(
    templateId: string,
    template: {
      title: string;
      message: string;
    }
  ): Promise<void> {
    await apiClient.patch(`/notifications/templates/${templateId}`, template);
  }
}

export const notificationService = new NotificationService();
