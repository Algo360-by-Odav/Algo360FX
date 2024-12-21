export enum UserRole {
  ADMIN = 'admin',
  BROKER = 'broker',
  MONEY_MANAGER = 'money_manager',
  SIGNAL_PROVIDER = 'signal_provider',
  INVESTOR = 'investor',
  USER = 'user'
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  tradingPreferences: {
    defaultLeverage: number;
    riskLevel: 'low' | 'medium' | 'high';
    autoTrade: boolean;
  };
  displayPreferences: {
    chartType: 'candlestick' | 'line' | 'bar';
    timeframe: '1m' | '5m' | '15m' | '1h' | '4h' | '1d';
    indicators: string[];
  };
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  preferences: UserPreferences;
  permissions: string[];
  createdAt?: Date;
  updatedAt?: Date;
  lastLogin?: Date;
  isVerified: boolean;
  status: 'active' | 'suspended' | 'inactive';
}

export interface SignupData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: UserRole;
  verificationCode?: string;
}
