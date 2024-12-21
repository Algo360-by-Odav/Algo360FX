import { makeAutoObservable, runInAction } from 'mobx';
import { RootStore } from './RootStore';
import { Theme, ThemeMode, ThemeSettings } from '../types/theme';
import { apiService } from '../services/api';

const DEFAULT_SETTINGS = {
  theme: {
    mode: 'light' as ThemeMode,
    primaryColor: '#1976d2',
    secondaryColor: '#dc004e',
    fontSize: 'medium' as const,
    spacing: 'normal' as const,
    borderRadius: 4,
  },
  language: 'en',
  timezone: 'UTC',
  notifications: {
    email: true,
    push: true,
    sound: true,
  },
  trading: {
    defaultLeverage: 1,
    riskPerTrade: 1,
    defaultStopLoss: 1,
    defaultTakeProfit: 2,
    confirmOrders: true,
    showPnLInPips: false,
  },
  chart: {
    defaultTimeframe: '1H',
    showVolume: true,
    showGrid: true,
    showLegend: true,
    theme: 'light' as const,
  },
};

export class SettingsStore {
  theme: ThemeSettings = DEFAULT_SETTINGS.theme;
  language: string = DEFAULT_SETTINGS.language;
  timezone: string = DEFAULT_SETTINGS.timezone;
  notifications = DEFAULT_SETTINGS.notifications;
  trading = DEFAULT_SETTINGS.trading;
  chart = DEFAULT_SETTINGS.chart;
  loading: boolean = false;
  error: string | null = null;

  constructor(private rootStore: RootStore) {
    makeAutoObservable(this, {}, { autoBind: true });
    this.loadSettings();
  }

  private async loadSettings() {
    try {
      this.loading = true;
      // First try to load from localStorage
      const savedSettings = localStorage.getItem('settings');
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        runInAction(() => {
          this.updateSettings(settings);
        });
      }

      // Then fetch from server if user is authenticated
      if (this.rootStore.authStore.isAuthenticated) {
        const { data } = await apiService.getSettings();
        runInAction(() => {
          this.updateSettings(data);
          this.saveToLocalStorage();
        });
      }
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : 'Failed to load settings';
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  private updateSettings(settings: Partial<typeof DEFAULT_SETTINGS>) {
    if (settings.theme) this.theme = { ...this.theme, ...settings.theme };
    if (settings.language) this.language = settings.language;
    if (settings.timezone) this.timezone = settings.timezone;
    if (settings.notifications) this.notifications = { ...this.notifications, ...settings.notifications };
    if (settings.trading) this.trading = { ...this.trading, ...settings.trading };
    if (settings.chart) this.chart = { ...this.chart, ...settings.chart };
  }

  private saveToLocalStorage() {
    const settings = {
      theme: this.theme,
      language: this.language,
      timezone: this.timezone,
      notifications: this.notifications,
      trading: this.trading,
      chart: this.chart,
    };
    localStorage.setItem('settings', JSON.stringify(settings));
  }

  async updateTheme(themeSettings: Partial<ThemeSettings>) {
    try {
      this.loading = true;
      this.theme = { ...this.theme, ...themeSettings };
      
      if (this.rootStore.authStore.isAuthenticated) {
        await apiService.updateSettings({ theme: themeSettings });
      }
      this.saveToLocalStorage();
      this.rootStore.notificationStore.addNotification({
        type: 'success',
        title: 'Theme Updated',
        message: 'Theme settings have been updated successfully',
      });
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : 'Failed to update theme';
      });
      this.rootStore.notificationStore.addNotification({
        type: 'error',
        title: 'Theme Update Failed',
        message: this.error,
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async updateLanguage(language: string) {
    try {
      this.loading = true;
      this.language = language;
      
      if (this.rootStore.authStore.isAuthenticated) {
        await apiService.updateSettings({ language });
      }
      this.saveToLocalStorage();
      this.rootStore.notificationStore.addNotification({
        type: 'success',
        title: 'Language Updated',
        message: 'Language setting has been updated successfully',
      });
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : 'Failed to update language';
      });
      this.rootStore.notificationStore.addNotification({
        type: 'error',
        title: 'Language Update Failed',
        message: this.error,
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async updateTimezone(timezone: string) {
    try {
      this.loading = true;
      this.timezone = timezone;
      
      if (this.rootStore.authStore.isAuthenticated) {
        await apiService.updateSettings({ timezone });
      }
      this.saveToLocalStorage();
      this.rootStore.notificationStore.addNotification({
        type: 'success',
        title: 'Timezone Updated',
        message: 'Timezone setting has been updated successfully',
      });
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : 'Failed to update timezone';
      });
      this.rootStore.notificationStore.addNotification({
        type: 'error',
        title: 'Timezone Update Failed',
        message: this.error,
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async updateNotificationSettings(settings: Partial<typeof DEFAULT_SETTINGS.notifications>) {
    try {
      this.loading = true;
      this.notifications = { ...this.notifications, ...settings };
      
      if (this.rootStore.authStore.isAuthenticated) {
        await apiService.updateSettings({ notifications: settings });
      }
      this.saveToLocalStorage();
      this.rootStore.notificationStore.addNotification({
        type: 'success',
        title: 'Notifications Updated',
        message: 'Notification settings have been updated successfully',
      });
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : 'Failed to update notification settings';
      });
      this.rootStore.notificationStore.addNotification({
        type: 'error',
        title: 'Notification Settings Update Failed',
        message: this.error,
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async updateTradingSettings(settings: Partial<typeof DEFAULT_SETTINGS.trading>) {
    try {
      this.loading = true;
      this.trading = { ...this.trading, ...settings };
      
      if (this.rootStore.authStore.isAuthenticated) {
        await apiService.updateSettings({ trading: settings });
      }
      this.saveToLocalStorage();
      this.rootStore.notificationStore.addNotification({
        type: 'success',
        title: 'Trading Settings Updated',
        message: 'Trading settings have been updated successfully',
      });
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : 'Failed to update trading settings';
      });
      this.rootStore.notificationStore.addNotification({
        type: 'error',
        title: 'Trading Settings Update Failed',
        message: this.error,
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async updateChartSettings(settings: Partial<typeof DEFAULT_SETTINGS.chart>) {
    try {
      this.loading = true;
      this.chart = { ...this.chart, ...settings };
      
      if (this.rootStore.authStore.isAuthenticated) {
        await apiService.updateSettings({ chart: settings });
      }
      this.saveToLocalStorage();
      this.rootStore.notificationStore.addNotification({
        type: 'success',
        title: 'Chart Settings Updated',
        message: 'Chart settings have been updated successfully',
      });
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : 'Failed to update chart settings';
      });
      this.rootStore.notificationStore.addNotification({
        type: 'error',
        title: 'Chart Settings Update Failed',
        message: this.error,
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  resetToDefaults() {
    runInAction(() => {
      this.theme = DEFAULT_SETTINGS.theme;
      this.language = DEFAULT_SETTINGS.language;
      this.timezone = DEFAULT_SETTINGS.timezone;
      this.notifications = DEFAULT_SETTINGS.notifications;
      this.trading = DEFAULT_SETTINGS.trading;
      this.chart = DEFAULT_SETTINGS.chart;
      this.saveToLocalStorage();
      this.rootStore.notificationStore.addNotification({
        type: 'success',
        title: 'Settings Reset',
        message: 'All settings have been reset to default values',
      });
    });
  }

  get isDarkMode(): boolean {
    return this.theme.mode === 'dark';
  }

  get currentTheme(): Theme {
    return {
      mode: this.theme.mode,
      palette: {
        primary: {
          main: this.theme.primaryColor,
        },
        secondary: {
          main: this.theme.secondaryColor,
        },
      },
      typography: {
        fontSize: this.getFontSize(),
      },
      spacing: this.getSpacing(),
      shape: {
        borderRadius: this.theme.borderRadius,
      },
    };
  }

  private getFontSize(): number {
    switch (this.theme.fontSize) {
      case 'small': return 12;
      case 'large': return 16;
      default: return 14;
    }
  }

  private getSpacing(): number {
    switch (this.theme.spacing) {
      case 'compact': return 4;
      case 'comfortable': return 12;
      default: return 8;
    }
  }
}
