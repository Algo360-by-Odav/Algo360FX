import { PrismaClient, Prisma } from '@prisma/client';
import { Position } from './Position';

export interface Portfolio {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  balance: number;
  currency: string;
  metadata: Prisma.JsonValue | null;
  createdAt: Date;
  updatedAt: Date;
  positions?: Position[];
}

export interface PortfolioCreateInput {
  userId: string;
  name: string;
  description?: string | null;
  balance: number;
  currency: string;
  metadata?: Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput;
}

export interface PortfolioUpdateInput {
  name?: string;
  description?: string | null;
  balance?: number;
  currency?: string;
  metadata?: Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput;
}

export interface PortfolioWhereInput {
  id?: string;
  userId?: string;
  name?: string;
  currency?: string;
}

export interface PortfolioWhereUniqueInput {
  id: string;
}

const prisma = new PrismaClient();

export class PortfolioModel {
  static async create(data: PortfolioCreateInput): Promise<Portfolio> {
    const portfolio = await prisma.portfolio.create({
      data: {
        userId: data.userId,
        name: data.name,
        description: data.description,
        balance: data.balance,
        currency: data.currency,
        metadata: data.metadata,
      },
      include: {
        positions: true,
      },
    });

    return {
      ...portfolio,
      metadata: portfolio.metadata,
    } as Portfolio;
  }

  static async update(id: string, data: PortfolioUpdateInput): Promise<Portfolio> {
    const portfolio = await prisma.portfolio.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        balance: data.balance,
        currency: data.currency,
        metadata: data.metadata,
      },
      include: {
        positions: true,
      },
    });

    return {
      ...portfolio,
      metadata: portfolio.metadata,
    } as Portfolio;
  }

  static async findById(id: string): Promise<Portfolio | null> {
    const portfolio = await prisma.portfolio.findUnique({
      where: { id },
      include: {
        positions: true,
      },
    });

    if (!portfolio) return null;

    return {
      ...portfolio,
      metadata: portfolio.metadata,
    } as Portfolio;
  }

  static async findAll(where: PortfolioWhereInput = {}): Promise<Portfolio[]> {
    const portfolios = await prisma.portfolio.findMany({
      where,
      include: {
        positions: true,
      },
    });

    return portfolios.map(portfolio => ({
      ...portfolio,
      metadata: portfolio.metadata,
    })) as Portfolio[];
  }

  static async delete(id: string): Promise<Portfolio> {
    const portfolio = await prisma.portfolio.delete({
      where: { id },
      include: {
        positions: true,
      },
    });

    return {
      ...portfolio,
      metadata: portfolio.metadata,
    } as Portfolio;
  }

  static async findByUser(userId: string): Promise<Portfolio[]> {
    const portfolios = await prisma.portfolio.findMany({
      where: { userId },
      include: {
        positions: true,
      },
    });

    return portfolios.map(portfolio => ({
      ...portfolio,
      metadata: portfolio.metadata,
    })) as Portfolio[];
  }

  static async updateBalance(id: string, balance: number): Promise<Portfolio> {
    const portfolio = await prisma.portfolio.update({
      where: { id },
      data: { balance },
      include: {
        positions: true,
      },
    });

    return {
      ...portfolio,
      metadata: portfolio.metadata,
    } as Portfolio;
  }
}
