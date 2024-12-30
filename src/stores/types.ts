import { Strategy, BacktestResult, Trade, Portfolio } from '@/types/trading';
import { Notification } from '@/types/notification';
import { Theme } from '@/types/theme';

export interface AuthStore {
  isAuthenticated: boolean;
  user: {
    id: string;
    email: string;
    username: string;
    role: string;
  } | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
}

export interface TradeStore {
  trades: Trade[];
  activeTrades: Trade[];
  historicalTrades: Trade[];
  portfolio: Portfolio;
  loading: boolean;
  error: string | null;
  loadTrades: () => Promise<void>;
  placeTrade: (trade: Partial<Trade>) => Promise<void>;
  closeTrade: (tradeId: string) => Promise<void>;
  updateTrade: (tradeId: string, data: Partial<Trade>) => Promise<void>;
}

export interface StrategyStore {
  strategies: Strategy[];
  activeStrategy: Strategy | null;
  backtestResults: BacktestResult[];
  loading: boolean;
  error: string | null;
  loadStrategies: () => Promise<void>;
  createStrategy: (strategy: Partial<Strategy>) => Promise<void>;
  updateStrategy: (strategyId: string, data: Partial<Strategy>) => Promise<void>;
  deleteStrategy: (strategyId: string) => Promise<void>;
  backtest: (strategyId: string, config: any) => Promise<void>;
}

export interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  isOpen: boolean;
  addNotification: (notification: Partial<Notification>) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

export interface SettingsStore {
  theme: Theme;
  language: string;
  timezone: string;
  notifications: {
    email: boolean;
    push: boolean;
    sound: boolean;
  };
  updateSettings: (settings: any) => Promise<void>;
  toggleTheme: () => void;
  setLanguage: (language: string) => void;
}

export interface WebSocketStore {
  connected: boolean;
  reconnecting: boolean;
  error: string | null;
  connect: () => void;
  disconnect: () => void;
  subscribe: (channel: string) => void;
  unsubscribe: (channel: string) => void;
}

export interface RootStore {
  authStore: AuthStore;
  tradeStore: TradeStore;
  strategyStore: StrategyStore;
  notificationStore: NotificationStore;
  settingsStore: SettingsStore;
  webSocketStore: WebSocketStore;
}
