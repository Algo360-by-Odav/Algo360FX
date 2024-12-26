import { IObservableArray, ObservableMap } from 'mobx';
import { Trade, Position, Portfolio, Strategy, BacktestResult } from './trading';
import { ModelConfig, ModelMetrics, ModelPrediction } from './ml';
import { Theme } from '@mui/material/styles';

export interface RootStore {
  userStore: UserStore;
  tradingStore: TradingStore;
  marketStore: MarketStore;
  algoTradingStore: AlgoTradingStore;
  backtestingStore: BacktestingStore;
  optimizationStore: OptimizationStore;
  settingsStore: SettingsStore;
  notificationStore: NotificationStore;
  riskStore: RiskStore;
  hftStore: HFTStore;
  mt5Store: MT5Store;
}

export interface UserStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, username: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

export interface User {
  id: string;
  email: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
  preferences: UserPreferences;
  subscription: SubscriptionPlan;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  defaultTimeframe: string;
  defaultSymbol: string;
  chartSettings: {
    indicators: string[];
    overlays: string[];
    style: 'candles' | 'bars' | 'line';
  };
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  features: string[];
  price: number;
  interval: 'month' | 'year';
  status: 'active' | 'cancelled' | 'expired';
  expiresAt: Date;
}

export interface TradingStore {
  trades: IObservableArray<Trade>;
  positions: IObservableArray<Position>;
  portfolio: Portfolio | null;
  isLoading: boolean;
  error: string | null;
  placeOrder: (order: Partial<Trade>) => Promise<void>;
  closePosition: (positionId: string) => Promise<void>;
  getTradeHistory: () => Promise<void>;
  refreshAccountData: () => Promise<void>;
}

export interface MarketStore {
  symbols: string[];
  currentSymbol: string;
  timeframe: string;
  isLoading: boolean;
  error: string | null;
  marketData: ObservableMap<string, any[]>;
  orderBook: ObservableMap<string, any>;
  subscribeToMarketData: (symbol: string) => void;
  unsubscribeFromMarketData: (symbol: string) => void;
  getHistoricalData: (symbol: string, timeframe: string, start: Date, end: Date) => Promise<void>;
}

export interface AlgoTradingStore {
  strategies: IObservableArray<Strategy>;
  activeStrategies: IObservableArray<string>;
  backtestResults: Map<string, BacktestResult>;
  isLoading: boolean;
  error: string | null;
  createStrategy: (strategy: Partial<Strategy>) => Promise<void>;
  updateStrategy: (id: string, updates: Partial<Strategy>) => Promise<void>;
  deleteStrategy: (id: string) => Promise<void>;
  startStrategy: (id: string) => Promise<void>;
  stopStrategy: (id: string) => Promise<void>;
  getBacktestResults: (id: string) => Promise<void>;
}

export interface BacktestingStore {
  results: Map<string, BacktestResult>;
  isRunning: boolean;
  progress: number;
  error: string | null;
  runBacktest: (strategyId: string, config: BacktestConfig) => Promise<void>;
  cancelBacktest: () => void;
  clearResults: () => void;
}

export interface BacktestConfig {
  startDate: Date;
  endDate: Date;
  symbol: string;
  timeframe: string;
  initialBalance: number;
  leverage: number;
  commission: number;
}

export interface OptimizationStore {
  results: Map<string, OptimizationResult>;
  isRunning: boolean;
  progress: number;
  error: string | null;
  runOptimization: (strategyId: string, config: OptimizationConfig) => Promise<void>;
  cancelOptimization: () => void;
  clearResults: () => void;
}

export interface OptimizationConfig {
  method: 'grid' | 'genetic' | 'bayesian';
  parameters: Record<string, [number, number, number]>;
  metric: 'sharpe' | 'sortino' | 'returns' | 'drawdown';
  populationSize?: number;
  generations?: number;
  crossoverRate?: number;
  mutationRate?: number;
}

export interface OptimizationResult {
  strategyId: string;
  method: string;
  bestParameters: Record<string, number>;
  bestMetrics: Record<string, number>;
  allResults: Array<{
    parameters: Record<string, number>;
    metrics: Record<string, number>;
  }>;
}

export interface SettingsStore {
  theme: Theme;
  language: string;
  notifications: boolean;
  riskSettings: RiskSettings;
  updateTheme: (theme: Theme) => void;
  updateLanguage: (language: string) => void;
  updateNotifications: (enabled: boolean) => void;
  updateRiskSettings: (settings: Partial<RiskSettings>) => void;
}

export interface RiskSettings {
  maxDrawdown: number;
  maxPositions: number;
  maxLeverage: number;
  stopLoss: number;
  takeProfit: number;
}

export interface NotificationStore {
  notifications: IObservableArray<Notification>;
  isLoading: boolean;
  error: string | null;
  addNotification: (notification: Notification) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  markAsRead: (id: string) => void;
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export interface RiskStore {
  metrics: RiskMetrics;
  limits: RiskLimits;
  isLoading: boolean;
  error: string | null;
  updateMetrics: () => void;
  updateLimits: (limits: Partial<RiskLimits>) => void;
  checkRiskLimits: (trade: Partial<Trade>) => boolean;
}

export interface RiskMetrics {
  currentDrawdown: number;
  maxDrawdown: number;
  sharpeRatio: number;
  valueAtRisk: number;
  leverage: number;
  exposure: number;
}

export interface RiskLimits {
  maxDrawdown: number;
  maxLeverage: number;
  maxExposure: number;
  maxPositions: number;
  maxLoss: number;
}

export interface HFTStore {
  isRunning: boolean;
  metrics: HFTMetrics;
  positions: IObservableArray<Position>;
  error: string | null;
  startTrading: () => Promise<void>;
  stopTrading: () => void;
  updateMetrics: () => void;
}

export interface HFTMetrics {
  latency: {
    mean: number;
    p95: number;
    p99: number;
  };
  throughput: {
    orders: number;
    trades: number;
    messages: number;
  };
  performance: {
    pnl: number;
    sharpe: number;
    sortino: number;
  };
}

export interface MT5Store {
  isConnected: boolean;
  account: MT5Account | null;
  positions: IObservableArray<Position>;
  orders: IObservableArray<Trade>;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  placeOrder: (order: Partial<Trade>) => Promise<void>;
  closePosition: (ticket: number) => Promise<void>;
}

export interface MT5Account {
  login: number;
  name: string;
  server: string;
  balance: number;
  equity: number;
  margin: number;
  freeMargin: number;
  leverage: number;
  currency: string;
}
