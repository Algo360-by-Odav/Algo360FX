import { makeAutoObservable, runInAction } from 'mobx';
import {
  userService,
  UserProfile,
  SecuritySettings,
  Device,
  ActivityLogEntry,
  UpdateProfileData,
} from '@/services/api/userService';

export class UserStore {
  profile: UserProfile | null = null;
  securitySettings: SecuritySettings | null = null;
  devices: Device[] = [];
  activityLog: ActivityLogEntry[] = [];
  tradingStats: {
    totalTrades: number;
    winRate: number;
    profitFactor: number;
    avgReturn: number;
    monthlyPerformance: Array<{
      month: string;
      profit: number;
    }>;
  } | null = null;
  apiKeys: Array<{
    id: string;
    name: string;
    createdAt: string;
    lastUsed: string;
    permissions: string[];
  }> = [];

  loading = {
    profile: false,
    security: false,
    devices: false,
    activity: false,
    stats: false,
    apiKeys: false,
  };

  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  // Profile Management
  async fetchProfile() {
    try {
      this.loading.profile = true;
      const profile = await userService.getProfile();
      runInAction(() => {
        this.profile = profile;
        this.error = null;
      });
    } catch (error) {
      runInAction(() => {
        this.error = 'Failed to fetch profile';
        console.error('Error fetching profile:', error);
      });
    } finally {
      runInAction(() => {
        this.loading.profile = false;
      });
    }
  }

  async updateProfile(data: UpdateProfileData) {
    try {
      this.loading.profile = true;
      const updatedProfile = await userService.updateProfile(data);
      runInAction(() => {
        this.profile = updatedProfile;
        this.error = null;
      });
    } catch (error) {
      runInAction(() => {
        this.error = 'Failed to update profile';
        console.error('Error updating profile:', error);
      });
    } finally {
      runInAction(() => {
        this.loading.profile = false;
      });
    }
  }

  async uploadProfilePhoto(file: File) {
    try {
      this.loading.profile = true;
      const { photoUrl } = await userService.uploadProfilePhoto(file);
      runInAction(() => {
        if (this.profile) {
          this.profile.photoUrl = photoUrl;
        }
        this.error = null;
      });
    } catch (error) {
      runInAction(() => {
        this.error = 'Failed to upload profile photo';
        console.error('Error uploading profile photo:', error);
      });
    } finally {
      runInAction(() => {
        this.loading.profile = false;
      });
    }
  }

  // Security Settings
  async fetchSecuritySettings() {
    try {
      this.loading.security = true;
      const settings = await userService.getSecuritySettings();
      runInAction(() => {
        this.securitySettings = settings;
        this.error = null;
      });
    } catch (error) {
      runInAction(() => {
        this.error = 'Failed to fetch security settings';
        console.error('Error fetching security settings:', error);
      });
    } finally {
      runInAction(() => {
        this.loading.security = false;
      });
    }
  }

  async updateSecuritySettings(settings: Partial<SecuritySettings>) {
    try {
      this.loading.security = true;
      const updatedSettings = await userService.updateSecuritySettings(settings);
      runInAction(() => {
        this.securitySettings = updatedSettings;
        this.error = null;
      });
    } catch (error) {
      runInAction(() => {
        this.error = 'Failed to update security settings';
        console.error('Error updating security settings:', error);
      });
    } finally {
      runInAction(() => {
        this.loading.security = false;
      });
    }
  }

  // Device Management
  async fetchDevices() {
    try {
      this.loading.devices = true;
      const devices = await userService.getDevices();
      runInAction(() => {
        this.devices = devices;
        this.error = null;
      });
    } catch (error) {
      runInAction(() => {
        this.error = 'Failed to fetch devices';
        console.error('Error fetching devices:', error);
      });
    } finally {
      runInAction(() => {
        this.loading.devices = false;
      });
    }
  }

  async removeDevice(deviceId: string) {
    try {
      await userService.removeDevice(deviceId);
      runInAction(() => {
        this.devices = this.devices.filter(device => device.id !== deviceId);
        this.error = null;
      });
    } catch (error) {
      runInAction(() => {
        this.error = 'Failed to remove device';
        console.error('Error removing device:', error);
      });
    }
  }

  // Activity Log
  async fetchActivityLog(page: number = 1, limit: number = 10) {
    try {
      this.loading.activity = true;
      const { entries } = await userService.getActivityLog(page, limit);
      runInAction(() => {
        this.activityLog = entries;
        this.error = null;
      });
    } catch (error) {
      runInAction(() => {
        this.error = 'Failed to fetch activity log';
        console.error('Error fetching activity log:', error);
      });
    } finally {
      runInAction(() => {
        this.loading.activity = false;
      });
    }
  }

  // Trading Statistics
  async fetchTradingStats() {
    try {
      this.loading.stats = true;
      const stats = await userService.getTradingStats();
      runInAction(() => {
        this.tradingStats = stats;
        this.error = null;
      });
    } catch (error) {
      runInAction(() => {
        this.error = 'Failed to fetch trading statistics';
        console.error('Error fetching trading statistics:', error);
      });
    } finally {
      runInAction(() => {
        this.loading.stats = false;
      });
    }
  }

  // API Keys Management
  async fetchApiKeys() {
    try {
      this.loading.apiKeys = true;
      const keys = await userService.getApiKeys();
      runInAction(() => {
        this.apiKeys = keys;
        this.error = null;
      });
    } catch (error) {
      runInAction(() => {
        this.error = 'Failed to fetch API keys';
        console.error('Error fetching API keys:', error);
      });
    } finally {
      runInAction(() => {
        this.loading.apiKeys = false;
      });
    }
  }

  async createApiKey(name: string, permissions: string[]) {
    try {
      const newKey = await userService.createApiKey(name, permissions);
      await this.fetchApiKeys(); // Refresh the list
      return newKey;
    } catch (error) {
      runInAction(() => {
        this.error = 'Failed to create API key';
        console.error('Error creating API key:', error);
      });
      throw error;
    }
  }

  async deleteApiKey(keyId: string) {
    try {
      await userService.deleteApiKey(keyId);
      runInAction(() => {
        this.apiKeys = this.apiKeys.filter(key => key.id !== keyId);
        this.error = null;
      });
    } catch (error) {
      runInAction(() => {
        this.error = 'Failed to delete API key';
        console.error('Error deleting API key:', error);
      });
    }
  }

  // Account Management
  async deleteAccount(confirmation: string) {
    try {
      await userService.deleteAccount(confirmation);
      // Handle post-deletion cleanup (e.g., logout)
    } catch (error) {
      runInAction(() => {
        this.error = 'Failed to delete account';
        console.error('Error deleting account:', error);
      });
      throw error;
    }
  }
}

export const userStore = new UserStore();
