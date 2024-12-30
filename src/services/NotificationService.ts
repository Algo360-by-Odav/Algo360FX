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

  public async getNotifications(): Promise<Notification[]> {
    if (import.meta.env.DEV) {
      // Return mock notifications in development
      return [
        {
          id: '1',
          type: 'info',
          title: 'Market Update',
          message: 'EURUSD has reached your target price.',
          timestamp: new Date(),
          read: false
        },
        {
          id: '2',
          type: 'success',
          title: 'Trade Executed',
          message: 'Buy order for GBPUSD executed successfully.',
          timestamp: new Date(),
          read: true
        }
      ];
    }

    try {
      const response = await axios.get('/notifications');
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  }

  public async getPreferences(): Promise<NotificationPreferences> {
    if (import.meta.env.DEV) {
      // Return mock preferences in development
      return {
        emailNotifications: true,
        pushNotifications: true,
        tradeAlerts: true,
        marketAlerts: true,
        systemAlerts: true
      };
    }

    try {
      const response = await axios.get('/notifications/preferences');
      return response.data;
    } catch (error) {
      console.error('Error fetching notification preferences:', error);
      throw error;
    }
  }

  public async updatePreferences(preferences: NotificationPreferences): Promise<void> {
    if (import.meta.env.DEV) {
      // Mock successful update in development
      console.log('Updated notification preferences:', preferences);
      return;
    }

    try {
      await axios.put('/notifications/preferences', preferences);
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      throw error;
    }
  }

  public async markAsRead(notificationId: string): Promise<void> {
    if (import.meta.env.DEV) {
      // Mock successful update in development
      console.log('Marked notification as read:', notificationId);
      return;
    }

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
