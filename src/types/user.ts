export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  MANAGER = 'manager',
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
    timeframe: '1m' | '5m' | '15m' | '30m' | '1h' | '4h' | '1d' | '1w';
    indicators: string[];
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isVerified: boolean;
  status: 'active' | 'inactive' | 'suspended';
  preferences: UserPreferences;
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SignupData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: UserRole;
  verificationCode: string;
}

export interface LoginData {
  email: string;
  password: string;
}
