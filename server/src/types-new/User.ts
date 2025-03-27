import { Prisma, Role } from '@prisma/client';
import { Position, PositionType, PositionStatus } from './Position';
import { Strategy } from './Strategy';

export type UserRole = 'USER' | 'ADMIN';

export interface UserPreferences {
  theme?: 'light' | 'dark';
  notifications?: {
    email?: boolean;
    push?: boolean;
    sms?: boolean;
  };
  defaultCurrency?: string;
  riskManagement?: {
    maxPositions?: number;
    maxLeverage?: number;
    maxDrawdown?: number;
  };
  tradingPreferences?: {
    defaultSize?: number;
    defaultStopLoss?: number;
    defaultTakeProfit?: number;
    preferredPairs?: string[];
  };
}

export interface Portfolio {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  balance: number;
  currency: string;
  metadata: Prisma.JsonValue | null;
  positions: {
    id: string;
    portfolioId: string;
    strategyId: string;
    symbol: string;
    type: PositionType;
    status: PositionStatus;
    openTime: Date;
    closeTime: Date | null;
    entryPrice: number;
    exitPrice: number | null;
    size: number;
    profit: number | null;
    stopLoss: number | null;
    takeProfit: number | null;
    metadata: Prisma.JsonValue | null;
    createdAt: Date;
    updatedAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  email: string;
  username: string;
  password: string;
  firstName: string | null;
  lastName: string | null;
  emailVerified: boolean;
  tokenVersion: number;
  role: Role;
  preferences: Prisma.JsonValue | null;
  createdAt: Date;
  updatedAt: Date;
  strategies?: Strategy[];
  portfolios?: Portfolio[];
}

export interface UserWithRelations extends User {
  positions?: Position[];
  strategies?: Strategy[];
}

export interface CreateUserInput {
  email: string;
  password: string;
  username?: string;
  firstName?: string | null;
  lastName?: string | null;
  role?: Role;
  preferences?: Prisma.JsonValue;
}

export interface UpdateUserInput {
  email?: string;
  password?: string;
  username?: string;
  firstName?: string | null;
  lastName?: string | null;
  role?: Role;
  preferences?: Prisma.JsonValue;
  emailVerified?: boolean;
  tokenVersion?: number;
}

export interface UserFilters {
  email?: string;
  role?: UserRole;
  startDate?: Date;
  endDate?: Date;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  averagePositionsPerUser: number;
  averageStrategiesPerUser: number;
}

export interface UserWhereInput {
  id?: string;
  email?: string;
  username?: string;
  role?: Role;
}

export interface UserWhereUniqueInput {
  id?: string;
  email?: string;
  username?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface TokenPayload {
  userId: string;
  email: string;
  role: Role;
  tokenVersion?: number;
}