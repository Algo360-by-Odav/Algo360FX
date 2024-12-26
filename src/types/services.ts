import { Trade, Position, Strategy, BacktestResult } from './trading';
import { OptimizationConfig, OptimizationResult } from './optimization';
import { ModelConfig, ModelMetrics } from './ml';
import { RiskProfile, RiskReport } from './risk';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface AuthService {
  login: (email: string, password: string) => Promise<ApiResponse>;
  logout: () => Promise<ApiResponse>;
  register: (email: string, password: string, username: string) => Promise<ApiResponse>;
  resetPassword: (email: string) => Promise<ApiResponse>;
  verifyToken: (token: string) => Promise<ApiResponse>;
}

export interface TradingService {
  getPositions: () => Promise<ApiResponse<Position[]>>;
  getTrades: () => Promise<ApiResponse<Trade[]>>;
  placeOrder: (order: Partial<Trade>) => Promise<ApiResponse<Trade>>;
  closePosition: (positionId: string) => Promise<ApiResponse>;
  modifyOrder: (orderId: string, updates: Partial<Trade>) => Promise<ApiResponse<Trade>>;
  cancelOrder: (orderId: string) => Promise<ApiResponse>;
}

export interface MarketDataService {
  getHistoricalData: (symbol: string, timeframe: string, start: Date, end: Date) => Promise<ApiResponse<any[]>>;
  getQuote: (symbol: string) => Promise<ApiResponse<any>>;
  getOrderBook: (symbol: string) => Promise<ApiResponse<any>>;
  subscribeToMarketData: (symbol: string, callback: (data: any) => void) => void;
  unsubscribeFromMarketData: (symbol: string) => void;
}

export interface StrategyService {
  getStrategies: () => Promise<ApiResponse<Strategy[]>>;
  getStrategy: (id: string) => Promise<ApiResponse<Strategy>>;
  createStrategy: (strategy: Partial<Strategy>) => Promise<ApiResponse<Strategy>>;
  updateStrategy: (id: string, updates: Partial<Strategy>) => Promise<ApiResponse<Strategy>>;
  deleteStrategy: (id: string) => Promise<ApiResponse>;
  startStrategy: (id: string) => Promise<ApiResponse>;
  stopStrategy: (id: string) => Promise<ApiResponse>;
}

export interface BacktestService {
  runBacktest: (strategyId: string, config: any) => Promise<ApiResponse<BacktestResult>>;
  getBacktestResults: (id: string) => Promise<ApiResponse<BacktestResult>>;
  cancelBacktest: (id: string) => Promise<ApiResponse>;
}

export interface OptimizationService {
  runOptimization: (strategyId: string, config: OptimizationConfig) => Promise<ApiResponse<OptimizationResult>>;
  getOptimizationResults: (id: string) => Promise<ApiResponse<OptimizationResult>>;
  cancelOptimization: (id: string) => Promise<ApiResponse>;
}

export interface MLService {
  trainModel: (config: ModelConfig) => Promise<ApiResponse>;
  getModelMetrics: (modelId: string) => Promise<ApiResponse<ModelMetrics>>;
  getPredictions: (modelId: string) => Promise<ApiResponse<any[]>>;
  updateModel: (modelId: string, config: Partial<ModelConfig>) => Promise<ApiResponse>;
}

export interface RiskService {
  getRiskProfile: () => Promise<ApiResponse<RiskProfile>>;
  updateRiskProfile: (profile: Partial<RiskProfile>) => Promise<ApiResponse<RiskProfile>>;
  getRiskReport: () => Promise<ApiResponse<RiskReport>>;
  checkRiskLimits: (trade: Partial<Trade>) => Promise<ApiResponse<boolean>>;
}

export interface WebSocketService {
  connect: () => Promise<void>;
  disconnect: () => void;
  subscribe: (channel: string, callback: (data: any) => void) => void;
  unsubscribe: (channel: string) => void;
  send: (channel: string, data: any) => void;
}

export interface NotificationService {
  getNotifications: () => Promise<ApiResponse<any[]>>;
  markAsRead: (id: string) => Promise<ApiResponse>;
  markAllAsRead: () => Promise<ApiResponse>;
  clearNotifications: () => Promise<ApiResponse>;
}

export interface SettingsService {
  getSettings: () => Promise<ApiResponse<any>>;
  updateSettings: (settings: any) => Promise<ApiResponse>;
  resetSettings: () => Promise<ApiResponse>;
}

export interface LoggingService {
  log: (level: string, message: string, meta?: any) => void;
  error: (error: Error, meta?: any) => void;
  warn: (message: string, meta?: any) => void;
  info: (message: string, meta?: any) => void;
  debug: (message: string, meta?: any) => void;
}

export interface CacheService {
  get: <T>(key: string) => Promise<T | null>;
  set: <T>(key: string, value: T, ttl?: number) => Promise<void>;
  delete: (key: string) => Promise<void>;
  clear: () => Promise<void>;
}

export interface StorageService {
  get: <T>(key: string) => Promise<T | null>;
  set: <T>(key: string, value: T) => Promise<void>;
  delete: (key: string) => Promise<void>;
  clear: () => Promise<void>;
}
