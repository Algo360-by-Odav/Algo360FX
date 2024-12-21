import { makeAutoObservable, runInAction } from 'mobx';
import NotificationService, {
  Notification,
  NotificationPreferences,
} from '@/services/NotificationService';
import { v4 as uuidv4 } from 'uuid';
import { NotificationType } from '@/types/notification';

export class NotificationStore {
  notifications: Notification[] = [];
  unreadCount: number = 0;
  preferences: NotificationPreferences | null = null;
  loading = {
    notifications: false,
    preferences: false,
  };
  error: string | null = null;
  total: number = 0;
  currentPage: number = 1;
  pageSize: number = 20;
  isOpen: boolean = false;

  constructor() {
    makeAutoObservable(this);
    this.initialize();
  }

  private initialize() {
    // Load initial data
    this.fetchNotifications();
    this.fetchPreferences();
  }

  addNotification(
    type: NotificationType,
    title: string,
    message: string,
    options: Partial<Notification> = {}
  ) {
    const notification: Notification = {
      id: uuidv4(),
      type,
      title,
      message,
      timestamp: new Date(),
      read: false,
      ...options
    };
    runInAction(() => {
      this.notifications.unshift(notification);
      if (!notification.read) {
        this.unreadCount++;
      }
    });
  }

  removeNotification(id: string) {
    this.notifications = this.notifications.filter(n => n.id !== id);
  }

  async fetchNotifications(
    page: number = this.currentPage,
    limit: number = this.pageSize,
    filter?: {
      type?: string[];
      priority?: ('high' | 'medium' | 'low')[];
      read?: boolean;
      startDate?: string;
      endDate?: string;
    }
  ) {
    try {
      this.loading.notifications = true;
      const response = await NotificationService.getNotifications(
        page,
        limit,
        filter
      );
      runInAction(() => {
        this.notifications =
          page === 1 ? response.notifications : [...this.notifications, ...response.notifications];
        this.total = response.total;
        this.currentPage = page;
        this.error = null;
      });
    } catch (error) {
      runInAction(() => {
        this.error = 'Failed to fetch notifications';
        console.error('Error fetching notifications:', error);
      });
    } finally {
      runInAction(() => {
        this.loading.notifications = false;
      });
    }
  }

  async fetchPreferences() {
    try {
      this.loading.preferences = true;
      const preferences = await NotificationService.getPreferences();
      runInAction(() => {
        this.preferences = preferences;
        this.error = null;
      });
    } catch (error) {
      runInAction(() => {
        this.error = 'Failed to fetch notification preferences';
        console.error('Error fetching preferences:', error);
      });
    } finally {
      runInAction(() => {
        this.loading.preferences = false;
      });
    }
  }

  async updatePreferences(preferences: Partial<NotificationPreferences>) {
    try {
      const updatedPreferences = await NotificationService.updatePreferences(preferences);
      runInAction(() => {
        this.preferences = updatedPreferences;
        this.error = null;
      });
    } catch (error) {
      runInAction(() => {
        this.error = 'Failed to update preferences';
        console.error('Error updating preferences:', error);
      });
    }
  }

  async markAsRead(notificationId: string) {
    try {
      await NotificationService.markAsRead(notificationId);
      runInAction(() => {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification && !notification.read) {
          notification.read = true;
          this.unreadCount = Math.max(0, this.unreadCount - 1);
        }
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }

  async markAllAsRead() {
    try {
      await NotificationService.markAllAsRead();
      runInAction(() => {
        this.notifications.forEach(notification => {
          notification.read = true;
        });
        this.unreadCount = 0;
      });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  }

  async deleteNotification(notificationId: string) {
    try {
      await NotificationService.deleteNotification(notificationId);
      runInAction(() => {
        this.notifications = this.notifications.filter(n => n.id !== notificationId);
        this.total = Math.max(0, this.total - 1);
      });
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  }

  setPage(page: number) {
    this.currentPage = page;
    this.fetchNotifications();
  }

  toggleOpen() {
    this.isOpen = !this.isOpen;
  }

  setOpen(isOpen: boolean) {
    this.isOpen = isOpen;
  }

  get hasUnread() {
    return this.unreadCount > 0;
  }
}

export const notificationStore = new NotificationStore();
