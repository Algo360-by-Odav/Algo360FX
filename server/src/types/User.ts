import { User as PrismaUser, Portfolio, Trade, Signal, Analytics, Prisma, Role } from '@prisma/client';

export type { Role };

export interface UserPreferences {
  theme: 'light' | 'dark';
  notifications: {
    email: boolean;
    push: boolean;
    trade: boolean;
    signal: boolean;
    news: boolean;
  };
  trading: {
    defaultLeverage: number;
    defaultRiskPerTrade: number;
    defaultTimeframe: string;
    favoriteSymbols: string[];
    defaultStopLoss: number;
    defaultTakeProfit: number;
  };
  display: {
    defaultChartType: 'candlestick' | 'line' | 'bar';
    showVolume: boolean;
    showIndicators: boolean;
    indicatorSettings: {
      [key: string]: any;
    };
  };
  analysis: {
    defaultPeriod: string;
    favoriteIndicators: string[];
    customIndicators: {
      name: string;
      parameters: any;
    }[];
  };
}

export interface UserSettings {
  preferences: UserPreferences;
  apiKeys?: {
    mt5?: {
      accountId: string;
      token: string;
    };
    tradingView?: string;
    otherPlatforms?: {
      [key: string]: string;
    };
  };
  security?: {
    twoFactorEnabled: boolean;
    lastPasswordChange: Date;
    loginAttempts: number;
    lockedUntil?: Date;
    trustedDevices: {
      id: string;
      name: string;
      lastUsed: Date;
    }[];
  };
}

export interface UserStats {
  totalTrades: number;
  winRate: number;
  profitFactor: number;
  sharpeRatio: number;
  maxDrawdown: number;
  averageWin: number;
  averageLoss: number;
  bestTrade: Trade | null;
  worstTrade: Trade | null;
  monthlyPerformance: {
    month: string;
    pnl: number;
    trades: number;
  }[];
}

export type UserCreateInput = Prisma.UserCreateInput;
export type UserUpdateInput = Prisma.UserUpdateInput;
export type UserWhereInput = Prisma.UserWhereInput;
export type UserWhereUniqueInput = Prisma.UserWhereUniqueInput;

export interface UserRegistrationData {
  email: string;
  password: string;
  username: string;
  firstName?: string;
  lastName?: string;
}

export interface UserLoginData {
  email: string;
  password: string;
  deviceInfo?: {
    name: string;
    type: string;
    os: string;
  };
}

export interface UserUpdateData extends Omit<Partial<UserUpdateInput>, 'id' | 'createdAt' | 'updatedAt'> {
  email?: string;
  password?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  preferences?: Prisma.JsonValue;
}

export interface UserPasswordChange {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UserVerification {
  userId: string;
  token: string;
  type: 'email' | 'password-reset' | '2fa';
  expiresAt: Date;
}

export interface UserSession {
  id: string;
  userId: string;
  token: string;
  refreshToken: string;
  deviceInfo?: {
    name: string;
    type: string;
    os: string;
  };
  createdAt: Date;
  expiresAt: Date;
  lastActivity: Date;
}

export interface UserNotification {
  id: string;
  userId: string;
  type: 'trade' | 'signal' | 'news' | 'system';
  title: string;
  message: string;
  read: boolean;
  data?: Prisma.JsonValue;
  createdAt: Date;
}

export interface UserWithStats extends PrismaUser {
  stats: UserStats;
  portfolios?: Portfolio[];
  trades?: Trade[];
  signals?: Signal[];
  analytics?: Analytics[];
  settings: UserSettings;
}

export interface UserActivityLog {
  id: string;
  userId: string;
  type: 'login' | 'logout' | 'trade' | 'setting_change' | 'password_change' | 'api_access';
  details: Prisma.JsonValue;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
}

export interface UserApiKey {
  id: string;
  userId: string;
  name: string;
  key: string;
  permissions: string[];
  lastUsed?: Date;
  expiresAt?: Date;
  createdAt: Date;
}

export interface UserSubscription {
  id: string;
  userId: string;
  plan: 'free' | 'basic' | 'pro' | 'enterprise';
  status: 'active' | 'cancelled' | 'expired';
  features: string[];
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
  paymentMethod?: string;
}

export interface UserReport {
  id: string;
  userId: string;
  type: 'performance' | 'tax' | 'audit';
  period: {
    start: Date;
    end: Date;
  };
  data: Prisma.JsonValue;
  format: 'pdf' | 'csv' | 'json';
  createdAt: Date;
}
