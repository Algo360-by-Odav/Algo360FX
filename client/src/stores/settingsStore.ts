import { makeAutoObservable } from 'mobx';

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  timezone: string;
}

export interface AppPreferences {
  theme: 'light' | 'dark';
  chartTimeframe: string;
  notifications: {
    email: boolean;
    push: boolean;
    trade: boolean;
    news: boolean;
  };
  language: string;
}

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: Date;
  lastUsed?: Date;
  permissions: string[];
}

export class SettingsStore {
  profile: UserProfile | null = null;
  preferences: AppPreferences = {
    theme: 'light',
    chartTimeframe: '1H',
    notifications: {
      email: true,
      push: true,
      trade: true,
      news: false,
    },
    language: 'en'
  };
  apiKeys: ApiKey[] = [];
  isLoading: boolean = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  async fetchProfile() {
    try {
      this.isLoading = true;
      // TODO: Implement API call
      // const response = await api.get('/profile');
      // this.profile = response.data;
    } catch (error) {
      this.error = 'Failed to fetch profile';
    } finally {
      this.isLoading = false;
    }
  }

  async updateProfile(profile: Partial<UserProfile>) {
    try {
      this.isLoading = true;
      // TODO: Implement API call
      // const response = await api.patch('/profile', profile);
      // this.profile = { ...this.profile, ...response.data };
    } catch (error) {
      this.error = 'Failed to update profile';
    } finally {
      this.isLoading = false;
    }
  }

  async fetchPreferences() {
    try {
      this.isLoading = true;
      // TODO: Implement API call
      // const response = await api.get('/preferences');
      // this.preferences = response.data;
    } catch (error) {
      this.error = 'Failed to fetch preferences';
    } finally {
      this.isLoading = false;
    }
  }

  async updatePreferences(preferences: Partial<AppPreferences>) {
    try {
      this.isLoading = true;
      // TODO: Implement API call
      // const response = await api.patch('/preferences', preferences);
      // this.preferences = { ...this.preferences, ...response.data };
    } catch (error) {
      this.error = 'Failed to update preferences';
    } finally {
      this.isLoading = false;
    }
  }

  async fetchApiKeys() {
    try {
      this.isLoading = true;
      // TODO: Implement API call
      // const response = await api.get('/api-keys');
      // this.apiKeys = response.data;
    } catch (error) {
      this.error = 'Failed to fetch API keys';
    } finally {
      this.isLoading = false;
    }
  }

  async generateApiKey(name: string, permissions: string[]) {
    try {
      this.isLoading = true;
      // TODO: Implement API call
      // const response = await api.post('/api-keys', { name, permissions });
      // this.apiKeys.push(response.data);
    } catch (error) {
      this.error = 'Failed to generate API key';
    } finally {
      this.isLoading = false;
    }
  }

  async deleteApiKey(id: string) {
    try {
      this.isLoading = true;
      // TODO: Implement API call
      // await api.delete(`/api-keys/${id}`);
      this.apiKeys = this.apiKeys.filter(key => key.id !== id);
    } catch (error) {
      this.error = 'Failed to delete API key';
    } finally {
      this.isLoading = false;
    }
  }

  setTheme(theme: 'light' | 'dark') {
    this.preferences.theme = theme;
  }

  clearError() {
    this.error = null;
  }
}

export const settingsStore = new SettingsStore();
