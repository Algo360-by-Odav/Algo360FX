import axios from 'axios';
import { API_BASE_URL } from '../../config';

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  photoUrl?: string;
  createdAt: string;
  preferences: {
    language: string;
    timezone: string;
    notifications: {
      email: boolean;
      push: boolean;
      trades: boolean;
      news: boolean;
      marketing: boolean;
    };
    trading: {
      defaultLeverage: number;
      riskLevel: 'low' | 'medium' | 'high';
      autoTrade: boolean;
    };
  };
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  preferences?: Partial<UserProfile['preferences']>;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  biometricEnabled: boolean;
  loginNotifications: boolean;
  deviceTrust: boolean;
}

export interface Device {
  id: string;
  type: 'desktop' | 'mobile' | 'tablet';
  name: string;
  lastActive: string;
  location: string;
  current: boolean;
}

export interface ActivityLogEntry {
  id: string;
  type: 'login' | 'security' | 'profile' | '2fa';
  description: string;
  timestamp: string;
  location?: string;
  device?: string;
}

class UserService {
  private axios = axios.create({
    baseURL: `${API_BASE_URL}/users`,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Profile Management
  async getProfile(): Promise<UserProfile> {
    const response = await this.axios.get('/profile');
    return response.data;
  }

  async updateProfile(data: UpdateProfileData): Promise<UserProfile> {
    const response = await this.axios.patch('/profile', data);
    return response.data;
  }

  async uploadProfilePhoto(file: File): Promise<{ photoUrl: string }> {
    const formData = new FormData();
    formData.append('photo', file);
    const response = await this.axios.post('/profile/photo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // Security Settings
  async getSecuritySettings(): Promise<SecuritySettings> {
    const response = await this.axios.get('/security');
    return response.data;
  }

  async updateSecuritySettings(settings: Partial<SecuritySettings>): Promise<SecuritySettings> {
    const response = await this.axios.patch('/security', settings);
    return response.data;
  }

  async setup2FA(): Promise<{ qrCode: string; secret: string }> {
    const response = await this.axios.post('/security/2fa/setup');
    return response.data;
  }

  async verify2FA(code: string): Promise<{ success: boolean }> {
    const response = await this.axios.post('/security/2fa/verify', { code });
    return response.data;
  }

  async disable2FA(code: string): Promise<{ success: boolean }> {
    const response = await this.axios.post('/security/2fa/disable', { code });
    return response.data;
  }

  // Device Management
  async getDevices(): Promise<Device[]> {
    const response = await this.axios.get('/devices');
    return response.data;
  }

  async removeDevice(deviceId: string): Promise<void> {
    await this.axios.delete(`/devices/${deviceId}`);
  }

  // Activity Log
  async getActivityLog(page: number = 1, limit: number = 10): Promise<{
    entries: ActivityLogEntry[];
    total: number;
  }> {
    const response = await this.axios.get('/activity', {
      params: { page, limit },
    });
    return response.data;
  }

  // Trading Statistics
  async getTradingStats(): Promise<{
    totalTrades: number;
    winRate: number;
    profitFactor: number;
    avgReturn: number;
    monthlyPerformance: Array<{
      month: string;
      profit: number;
    }>;
  }> {
    const response = await this.axios.get('/stats/trading');
    return response.data;
  }

  // Account Management
  async deleteAccount(confirmation: string): Promise<void> {
    await this.axios.post('/account/delete', { confirmation });
  }

  // API Keys Management
  async getApiKeys(): Promise<Array<{
    id: string;
    name: string;
    createdAt: string;
    lastUsed: string;
    permissions: string[];
  }>> {
    const response = await this.axios.get('/api-keys');
    return response.data;
  }

  async createApiKey(name: string, permissions: string[]): Promise<{
    id: string;
    key: string;
    secret: string;
  }> {
    const response = await this.axios.post('/api-keys', { name, permissions });
    return response.data;
  }

  async deleteApiKey(keyId: string): Promise<void> {
    await this.axios.delete(`/api-keys/${keyId}`);
  }
}

export const userService = new UserService();
