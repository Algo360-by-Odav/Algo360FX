import { format } from 'date-fns';
import axios from './axios';

export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  read?: boolean;
}

export interface NotificationPreferences {
  emailNotifications: boolean;
  pushNotifications: boolean;
  tradeAlerts: boolean;
  marketAlerts: boolean;
  systemAlerts: boolean;
}

class NotificationService {
  private static instance: NotificationService;

  private constructor() {}

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  async getNotifications(page: number = 1, limit: number = 20): Promise<{ notifications: Notification[], total: number }> {
    try {
      const response = await axios.get(`/notifications`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  }

  async getPreferences(): Promise<NotificationPreferences> {
    try {
      const response = await axios.get(`/notifications/preferences`);
      return response.data;
    } catch (error) {
      console.error('Error fetching notification preferences:', error);
      throw error;
    }
  }

  async updatePreferences(preferences: Partial<NotificationPreferences>): Promise<NotificationPreferences> {
    try {
      const response = await axios.put(`/notifications/preferences`, preferences);
      return response.data;
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      throw error;
    }
  }

  async markAsRead(notificationId: string): Promise<void> {
    try {
      await axios.put(`/notifications/${notificationId}/read`);
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  async markAllAsRead(): Promise<void> {
    try {
      await axios.put(`/notifications/read-all`);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  subscribe(channel: string, callback: (notification: Notification) => void) {
    // WebSocket subscription will be handled by WebSocketService
    const ws = (window as any).webSocketService;
    if (ws) {
      ws.subscribe(`notification:${channel}`, callback);
    }
  }

  unsubscribe(channel: string, callback: (notification: Notification) => void) {
    // WebSocket unsubscription will be handled by WebSocketService
    const ws = (window as any).webSocketService;
    if (ws) {
      ws.unsubscribe(`notification:${channel}`, callback);
    }
  }
}

export default NotificationService.getInstance();
