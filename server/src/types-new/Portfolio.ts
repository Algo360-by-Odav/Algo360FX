import { JsonValue } from '@prisma/client/runtime/library';
import { Position } from './Position';

export interface Portfolio {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  userId: string;
  description: string | null;
  balance: number;
  currency: string;
  positions?: Position[];
}

export interface PortfolioCreateInput {
  name: string;
  userId: string;
  description?: string;
  balance: number;
  currency: string;
}

export interface PortfolioUpdateInput {
  name?: string;
  description?: string;
  balance?: number;
  currency?: string;
}

export interface PortfolioWhereInput {
  id?: string;
  name?: string;
  userId?: string;
  currency?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PortfolioWhereUniqueInput {
  id?: string;
}
