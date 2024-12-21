import { makeAutoObservable, runInAction } from 'mobx';
import { api } from '../services/api';
import { UserPreferences } from '../types/user';
import { RootStore } from './RootStore';

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'dark',
  notifications: {
    email: true,
    push: true,
    sms: false
  },
  tradingPreferences: {
    defaultLeverage: 1,
    riskLevel: 'medium',
    autoTrade: false
  },
  displayPreferences: {
    chartType: 'candlestick',
    timeframe: '1h',
    indicators: ['MA', 'RSI']
  }
};

export class UserPreferencesStore {
  preferences: UserPreferences = DEFAULT_PREFERENCES;
  loading: boolean = false;
  error: string | null = null;
  isLoaded: boolean = false;

  constructor(private rootStore: RootStore) {
    makeAutoObservable(this);
    this.loadPreferences();
  }

  async loadPreferences() {
    try {
      this.loading = true;
      const response = await api.get('/user/preferences');
      runInAction(() => {
        this.preferences = {
          ...DEFAULT_PREFERENCES,
          ...response.data
        };
        this.loading = false;
        this.isLoaded = true;
      });
    } catch (error) {
      if (error.response?.status === 404) {
        runInAction(() => {
          this.preferences = this.getDefaultPreferences();
          this.loading = false;
          this.isLoaded = true;
        });
        // Save default preferences
        await this.savePreferences(this.preferences);
      } else {
        runInAction(() => {
          this.error = 'Failed to load preferences';
          this.loading = false;
        });
      }
    }
  }

  private getDefaultPreferences(): UserPreferences {
    return {
      theme: 'light',
      language: 'en',
      notifications: {
        email: true,
        push: true,
        desktop: true
      },
      trading: {
        defaultTimeframe: '1h',
        defaultPairings: ['EUR/USD', 'GBP/USD', 'USD/JPY'],
        riskLevel: 'medium',
        autoTrade: false
      },
      display: {
        showBalance: true,
        showPnL: true,
        showNotifications: true,
        compactView: false
      },
      security: {
        twoFactorEnabled: false,
        sessionTimeout: 30 // minutes
      }
    };
  }

  async updatePreferences(newPreferences: Partial<UserPreferences>) {
    try {
      this.loading = true;
      const updatedPreferences = {
        ...this.preferences,
        ...newPreferences
      };
      
      await api.put('/user/preferences', updatedPreferences);
      
      runInAction(() => {
        this.preferences = updatedPreferences;
        this.loading = false;
        this.error = null;
      });

      // Apply theme change immediately
      if (newPreferences.theme) {
        document.documentElement.setAttribute('data-theme', newPreferences.theme);
      }

      return true;
    } catch (error) {
      runInAction(() => {
        this.error = 'Failed to update preferences';
        this.loading = false;
      });
      return false;
    }
  }

  async resetPreferences() {
    try {
      this.loading = true;
      await api.post('/user/preferences/reset');
      
      runInAction(() => {
        this.preferences = DEFAULT_PREFERENCES;
        this.loading = false;
        this.error = null;
      });

      document.documentElement.setAttribute('data-theme', DEFAULT_PREFERENCES.theme);
      return true;
    } catch (error) {
      runInAction(() => {
        this.error = 'Failed to reset preferences';
        this.loading = false;
      });
      return false;
    }
  }

  async savePreferences(preferences: UserPreferences) {
    try {
      await api.put('/user/preferences', preferences);
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  }

  clearError() {
    this.error = null;
  }
}

export const useUserPreferencesStore = () => {
  const rootStore = useRootStore();
  return rootStore.userPreferencesStore;
};
