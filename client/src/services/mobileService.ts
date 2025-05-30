import { apiService } from './api';

export interface PushNotification {
  id: string;
  type: 'price' | 'trade' | 'news' | 'alert' | 'system';
  title: string;
  message: string;
  data?: any;
  timestamp: Date;
  read: boolean;
}

export interface ChartConfiguration {
  theme: 'light' | 'dark';
  indicators: string[];
  timeframe: string;
  chartType: 'candlestick' | 'line' | 'bar';
  showVolume: boolean;
  customColors: { [key: string]: string };
}

export interface WatchlistSync {
  lists: {
    id: string;
    name: string;
    symbols: string[];
    lastModified: Date;
  }[];
  settings: {
    sortBy: string;
    columns: string[];
    alerts: boolean;
  };
}

export interface OfflineData {
  symbols: string[];
  timeframes: string[];
  indicators: string[];
  expiryTime: Date;
}

class MobileService {
  private static instance: MobileService;
  private readonly baseUrl = '/mobile';

  private constructor() {}

  public static getInstance(): MobileService {
    if (!MobileService.instance) {
      MobileService.instance = new MobileService();
    }
    return MobileService.instance;
  }

  // Push Notifications
  async registerDevice(token: string, platform: 'ios' | 'android'): Promise<{ success: boolean }> {
    try {
      return await apiService.post(`${this.baseUrl}/notifications/register`, {
        token,
        platform
      });
    } catch (error) {
      console.error('Failed to register device:', error);
      throw error;
    }
  }

  async unregisterDevice(token: string): Promise<{ success: boolean }> {
    try {
      return await apiService.post(`${this.baseUrl}/notifications/unregister`, { token });
    } catch (error) {
      console.error('Failed to unregister device:', error);
      throw error;
    }
  }

  async getNotifications(
    filter?: { type?: string; read?: boolean },
    page: number = 1
  ): Promise<{
    notifications: PushNotification[];
    total: number;
    unread: number;
  }> {
    try {
      return await apiService.get(`${this.baseUrl}/notifications`, {
        params: { ...filter, page }
      });
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      throw error;
    }
  }

  async markNotificationRead(
    notificationId: string | string[]
  ): Promise<{ success: boolean }> {
    try {
      return await apiService.put(`${this.baseUrl}/notifications/read`, {
        ids: Array.isArray(notificationId) ? notificationId : [notificationId]
      });
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      throw error;
    }
  }

  // Advanced Mobile Charting
  async saveChartConfiguration(
    symbol: string,
    config: ChartConfiguration
  ): Promise<{ success: boolean }> {
    try {
      return await apiService.post(`${this.baseUrl}/charts/config`, {
        symbol,
        config
      });
    } catch (error) {
      console.error('Failed to save chart configuration:', error);
      throw error;
    }
  }

  async getChartConfiguration(symbol: string): Promise<ChartConfiguration> {
    try {
      return await apiService.get(`${this.baseUrl}/charts/config/${symbol}`);
    } catch (error) {
      console.error('Failed to fetch chart configuration:', error);
      throw error;
    }
  }

  // Watchlist Sync
  async syncWatchlist(data: WatchlistSync): Promise<{ success: boolean }> {
    try {
      return await apiService.post(`${this.baseUrl}/watchlist/sync`, data);
    } catch (error) {
      console.error('Failed to sync watchlist:', error);
      throw error;
    }
  }

  async getWatchlistSync(): Promise<WatchlistSync> {
    try {
      return await apiService.get(`${this.baseUrl}/watchlist/sync`);
    } catch (error) {
      console.error('Failed to fetch watchlist sync:', error);
      throw error;
    }
  }

  // Offline Mode
  async downloadOfflineData(request: {
    symbols: string[];
    timeframes: string[];
    indicators: string[];
  }): Promise<{ success: boolean; size: number }> {
    try {
      return await apiService.post(`${this.baseUrl}/offline/download`, request);
    } catch (error) {
      console.error('Failed to download offline data:', error);
      throw error;
    }
  }

  async getOfflineDataStatus(): Promise<{
    available: boolean;
    lastSync: Date;
    size: number;
    data: OfflineData;
  }> {
    try {
      return await apiService.get(`${this.baseUrl}/offline/status`);
    } catch (error) {
      console.error('Failed to get offline data status:', error);
      throw error;
    }
  }

  async clearOfflineData(): Promise<{ success: boolean }> {
    try {
      return await apiService.delete(`${this.baseUrl}/offline/clear`);
    } catch (error) {
      console.error('Failed to clear offline data:', error);
      throw error;
    }
  }

  // Mobile Performance Optimization
  async optimizeDataForMobile(data: any): Promise<any> {
    // Implement data optimization for mobile
    const optimizedData = {
      ...data,
      // Add optimization logic here
    };
    return optimizedData;
  }

  async getCachedData(key: string): Promise<any> {
    try {
      return await apiService.get(`${this.baseUrl}/cache/${key}`);
    } catch (error) {
      console.error('Failed to get cached data:', error);
      throw error;
    }
  }

  async setCachedData(key: string, data: any, ttl?: number): Promise<{ success: boolean }> {
    try {
      return await apiService.post(`${this.baseUrl}/cache/${key}`, { data, ttl });
    } catch (error) {
      console.error('Failed to set cached data:', error);
      throw error;
    }
  }
}

export const mobileService = MobileService.getInstance();
