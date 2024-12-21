import { Notification } from './notification';
import { Strategy, Trade } from './trading';

export interface RootStore {
  authStore: AuthStore;
  tradeStore: TradeStore;
  strategyStore: StrategyStore;
  notificationStore: NotificationStore;
  settingsStore: SettingsStore;
  webSocketStore: WebSocketStore;
}

export interface AuthStore {
  isAuthenticated: boolean;
  user: any;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
}

export interface TradeStore {
  trades: Trade[];
  activeTrades: Trade[];
  pendingTrades: Trade[];
  loadTrades: () => Promise<void>;
  placeTrade: (trade: Partial<Trade>) => Promise<void>;
  closeTrade: (tradeId: string) => Promise<void>;
  updateTrade: (tradeId: string, data: Partial<Trade>) => Promise<void>;
}

export interface StrategyStore {
  strategies: Strategy[];
  activeStrategy: Strategy | null;
  loadStrategies: () => Promise<void>;
  createStrategy: (strategy: Partial<Strategy>) => Promise<void>;
  updateStrategy: (strategyId: string, data: Partial<Strategy>) => Promise<void>;
  deleteStrategy: (strategyId: string) => Promise<void>;
  backtest: (strategyId: string, config: any) => Promise<void>;
}

export interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Partial<Notification>) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

export interface SettingsStore {
  theme: 'light' | 'dark';
  language: string;
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
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
  subscribe: (channel: string) => void;
  unsubscribe: (channel: string) => void;
}
