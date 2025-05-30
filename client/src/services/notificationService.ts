import axios from 'axios';
import { makeAutoObservable, runInAction } from 'mobx';
import { API_BASE_URL } from '../config';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  data?: any;
}

export type NotificationType = 
  | 'billing'
  | 'mining'
  | 'system'
  | 'security'
  | 'subscription';

class NotificationService {
  private readonly baseUrl = `${API_BASE_URL}/notifications`;
  public notifications: Notification[] = [];
  public unreadCount = 0;

  constructor() {
    makeAutoObservable(this);
    this.initializeNotifications();
    this.startWebSocket();
  }

  private async initializeNotifications() {
    try {
      const response = await axios.get(`${this.baseUrl}/recent`);
      runInAction(() => {
        this.notifications = response.data;
        this.updateUnreadCount();
      });
    } catch (error) {
      console.error('Failed to initialize notifications:', error);
    }
  }

  private startWebSocket() {
    const ws = new WebSocket(`${API_BASE_URL.replace('http', 'ws')}/ws/notifications`);

    ws.onmessage = (event) => {
      const notification = JSON.parse(event.data);
      this.addNotification(notification);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setTimeout(() => this.startWebSocket(), 5000);
    };
  }

  private addNotification(notification: Notification) {
    runInAction(() => {
      this.notifications.unshift(notification);
      this.updateUnreadCount();
      this.showDesktopNotification(notification);
    });
  }

  private updateUnreadCount() {
    this.unreadCount = this.notifications.filter(n => !n.read).length;
  }

  private async showDesktopNotification(notification: Notification) {
    if (!("Notification" in window)) return;

    if (Notification.permission === "granted") {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/logo192.png'
      });
    } else if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        new Notification(notification.title, {
          body: notification.message,
          icon: '/logo192.png'
        });
      }
    }
  }

  async markAsRead(notificationId: string) {
    try {
      await axios.post(`${this.baseUrl}/${notificationId}/read`);
      runInAction(() => {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification) {
          notification.read = true;
          this.updateUnreadCount();
        }
      });
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  }

  async markAllAsRead() {
    try {
      await axios.post(`${this.baseUrl}/read-all`);
      runInAction(() => {
        this.notifications.forEach(n => n.read = true);
        this.updateUnreadCount();
      });
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  }

  async clearNotifications() {
    try {
      await axios.delete(`${this.baseUrl}/clear`);
      runInAction(() => {
        this.notifications = [];
        this.unreadCount = 0;
      });
    } catch (error) {
      console.error('Failed to clear notifications:', error);
    }
  }

  // Billing notification methods
  async sendBillingNotification(data: {
    type: 'payment_success' | 'payment_failed' | 'subscription_renewed' | 'subscription_cancelled';
    amount?: number;
    planId?: string;
    error?: string;
  }) {
    try {
      await axios.post(`${this.baseUrl}/billing`, data);
    } catch (error) {
      console.error('Failed to send billing notification:', error);
    }
  }

  // Mining notification methods
  async sendMiningNotification(data: {
    type: 'rig_offline' | 'rig_online' | 'profit_alert' | 'hashrate_drop';
    rigId?: string;
    message: string;
  }) {
    try {
      await axios.post(`${this.baseUrl}/mining`, data);
    } catch (error) {
      console.error('Failed to send mining notification:', error);
    }
  }

  // System notification methods
  async sendSystemNotification(data: {
    type: 'maintenance' | 'update' | 'error';
    message: string;
    severity?: 'info' | 'warning' | 'error';
  }) {
    try {
      await axios.post(`${this.baseUrl}/system`, data);
    } catch (error) {
      console.error('Failed to send system notification:', error);
    }
  }

  // Security notification methods
  async sendSecurityNotification(data: {
    type: 'login_attempt' | 'password_changed' | 'api_key_updated';
    message: string;
    location?: string;
    ip?: string;
  }) {
    try {
      await axios.post(`${this.baseUrl}/security`, data);
    } catch (error) {
      console.error('Failed to send security notification:', error);
    }
  }
}

export const notificationService = new NotificationService();
export default notificationService;
