import { Prisma } from '@prisma/client';
import { User } from './User';
import { Strategy } from './Strategy';
import { InputJsonValue, JsonValue } from '@prisma/client/runtime/library';

export enum PositionType {
  LONG = 'LONG',
  SHORT = 'SHORT'
}

export enum PositionStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  PENDING = 'PENDING',
  CANCELLED = 'CANCELLED'
}

export interface PositionMetadata {
  entryReason?: string;
  exitReason?: string;
  notes?: string;
  tags?: string[];
  riskReward?: number;
  stopLoss?: number;
  takeProfit?: number;
  trailingStop?: number;
  indicators?: Record<string, any>;
  [key: string]: any;
}

export interface Position {
  id: string;
  userId: string;
  symbol: string;
  type: string;
  status: string;
  openTime: Date;
  closeTime: Date | null;
  entryPrice: number;
  exitPrice: number | null;
  size: number;
  profit: number | null;
  portfolioId: string;
  strategyId: string | null;
  stopLoss: number | null;
  takeProfit: number | null;
  metadata: InputJsonValue | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PositionWithRelations extends Position {
  user: User;
  strategy?: Strategy | null;
  portfolio: {
    id: string;
    name: string;
    userId: string;
    balance: number;
    currency: string;
    description?: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
}

export interface PositionCreateInput {
  userId: string;
  symbol: string;
  type: string;
  status: string;
  openTime: Date;
  entryPrice: number;
  size: number;
  portfolioId: string;
  strategyId?: string | null;
  stopLoss?: number | null;
  takeProfit?: number | null;
  metadata?: InputJsonValue | null;
}

export interface PositionUpdateInput {
  symbol?: string;
  type?: string;
  status?: string;
  closeTime?: Date | null;
  exitPrice?: number | null;
  profit?: number | null;
  stopLoss?: number | null;
  takeProfit?: number | null;
  metadata?: InputJsonValue | null;
}

export interface PositionWhereInput {
  id?: string;
  userId?: string;
  strategyId?: string;
  portfolioId?: string;
  symbol?: string;
  type?: string;
  status?: string;
}

export interface PositionWhereUniqueInput {
  id: string;
}

export interface CreatePositionInput {
  userId: string;
  strategyId?: string;
  symbol: string;
  type: string;
  status: string;
  openTime: Date;
  entryPrice: number;
  size: number;
  portfolioId: string;
  stopLoss?: number | null;
  takeProfit?: number | null;
  metadata?: InputJsonValue | null;
}

export interface UpdatePositionInput {
  symbol?: string;
  type?: string;
  status?: string;
  closeTime?: Date | null;
  exitPrice?: number | null;
  profit?: number | null;
  stopLoss?: number | null;
  takeProfit?: number | null;
  metadata?: InputJsonValue | null;
}

export interface PositionFilters {
  userId?: string;
  strategyId?: string;
  symbol?: string;
  type?: string;
  status?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface PositionStats {
  totalPositions: number;
  openPositions: number;
  closedPositions: number;
  winRate: number;
  averageProfit: number;
  totalProfit: number;
  largestWin: number;
  largestLoss: number;
  averageDuration: number;
}
