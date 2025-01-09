import { PrismaClient, Prisma } from '@prisma/client';
import { Strategy } from './Strategy';
import { Portfolio } from './Portfolio';

export interface Position {
  id: string;
  portfolioId: string;
  strategyId: string;
  symbol: string;
  type: string;
  status: string;
  size: number;
  entryPrice: number;
  exitPrice: number | null;
  stopLoss: number | null;
  takeProfit: number | null;
  openTime: Date;
  closeTime: Date | null;
  profit: number | null;
  metadata: Prisma.JsonValue | null;
  createdAt: Date;
  updatedAt: Date;
  portfolio?: Portfolio;
  strategy?: Strategy;
}

export interface PositionCreateInput {
  portfolioId: string;
  strategyId: string;
  symbol: string;
  type: string;
  status: string;
  size: number;
  entryPrice: number;
  exitPrice?: number | null;
  stopLoss?: number | null;
  takeProfit?: number | null;
  openTime: Date;
  closeTime?: Date | null;
  profit?: number | null;
  metadata?: Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput;
}

export interface PositionUpdateInput {
  portfolioId?: string;
  strategyId?: string;
  symbol?: string;
  type?: string;
  status?: string;
  size?: number;
  entryPrice?: number;
  exitPrice?: number | null;
  stopLoss?: number | null;
  takeProfit?: number | null;
  openTime?: Date;
  closeTime?: Date | null;
  profit?: number | null;
  metadata?: Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput;
}

export interface PositionWhereInput {
  id?: string;
  portfolioId?: string;
  strategyId?: string;
  symbol?: string;
  type?: string;
  status?: string;
}

export interface PositionWhereUniqueInput {
  id: string;
}

const prisma = new PrismaClient();

export class PositionModel {
  static async create(data: PositionCreateInput): Promise<Position> {
    const position = await prisma.position.create({
      data: {
        portfolioId: data.portfolioId,
        strategyId: data.strategyId,
        symbol: data.symbol,
        type: data.type,
        status: data.status,
        size: data.size,
        entryPrice: data.entryPrice,
        exitPrice: data.exitPrice,
        stopLoss: data.stopLoss,
        takeProfit: data.takeProfit,
        openTime: data.openTime,
        closeTime: data.closeTime,
        profit: data.profit,
        metadata: data.metadata,
      },
      include: {
        portfolio: true,
        strategy: true,
      },
    });

    return {
      ...position,
      metadata: position.metadata,
      portfolio: position.portfolio,
      strategy: position.strategy,
    } as Position;
  }

  static async update(id: string, data: PositionUpdateInput): Promise<Position> {
    const position = await prisma.position.update({
      where: { id },
      data: {
        portfolioId: data.portfolioId,
        strategyId: data.strategyId,
        symbol: data.symbol,
        type: data.type,
        status: data.status,
        size: data.size,
        entryPrice: data.entryPrice,
        exitPrice: data.exitPrice,
        stopLoss: data.stopLoss,
        takeProfit: data.takeProfit,
        openTime: data.openTime,
        closeTime: data.closeTime,
        profit: data.profit,
        metadata: data.metadata,
      },
      include: {
        portfolio: true,
        strategy: true,
      },
    });

    return {
      ...position,
      metadata: position.metadata,
      portfolio: position.portfolio,
      strategy: position.strategy,
    } as Position;
  }

  static async findById(id: string): Promise<Position | null> {
    const position = await prisma.position.findUnique({
      where: { id },
      include: {
        portfolio: true,
        strategy: true,
      },
    });

    if (!position) return null;

    return {
      ...position,
      metadata: position.metadata,
      portfolio: position.portfolio,
      strategy: position.strategy,
    } as Position;
  }

  static async findAll(where: PositionWhereInput = {}): Promise<Position[]> {
    const positions = await prisma.position.findMany({
      where,
      include: {
        portfolio: true,
        strategy: true,
      },
    });

    return positions.map(position => ({
      ...position,
      metadata: position.metadata,
      portfolio: position.portfolio,
      strategy: position.strategy,
    })) as Position[];
  }

  static async delete(id: string): Promise<Position> {
    const position = await prisma.position.delete({
      where: { id },
      include: {
        portfolio: true,
        strategy: true,
      },
    });

    return {
      ...position,
      metadata: position.metadata,
      portfolio: position.portfolio,
      strategy: position.strategy,
    } as Position;
  }

  static async findByPortfolio(portfolioId: string): Promise<Position[]> {
    const positions = await prisma.position.findMany({
      where: { portfolioId },
      include: {
        portfolio: true,
        strategy: true,
      },
    });

    return positions.map(position => ({
      ...position,
      metadata: position.metadata,
      portfolio: position.portfolio,
      strategy: position.strategy,
    })) as Position[];
  }

  static async findByStrategy(strategyId: string): Promise<Position[]> {
    const positions = await prisma.position.findMany({
      where: { strategyId },
      include: {
        portfolio: true,
        strategy: true,
      },
    });

    return positions.map(position => ({
      ...position,
      metadata: position.metadata,
      portfolio: position.portfolio,
      strategy: position.strategy,
    })) as Position[];
  }

  static async findByUser(userId: string): Promise<Position[]> {
    const positions = await prisma.position.findMany({
      where: {
        portfolio: {
          userId: userId
        }
      },
      include: {
        portfolio: true,
        strategy: true,
      },
    });

    return positions.map(position => ({
      ...position,
      metadata: position.metadata,
      portfolio: position.portfolio,
      strategy: position.strategy,
    })) as Position[];
  }

  static async updateStatus(id: string, status: string): Promise<Position> {
    const position = await prisma.position.update({
      where: { id },
      data: { status },
      include: {
        portfolio: true,
        strategy: true,
      },
    });

    return {
      ...position,
      metadata: position.metadata,
      portfolio: position.portfolio,
      strategy: position.strategy,
    } as Position;
  }

  static async updateProfit(id: string, profit: number): Promise<Position> {
    const position = await prisma.position.update({
      where: { id },
      data: { profit },
      include: {
        portfolio: true,
        strategy: true,
      },
    });

    return {
      ...position,
      metadata: position.metadata,
      portfolio: position.portfolio,
      strategy: position.strategy,
    } as Position;
  }

  static async closePosition(id: string, exitPrice: number, profit: number): Promise<Position> {
    const position = await prisma.position.update({
      where: { id },
      data: {
        status: 'CLOSED',
        exitPrice,
        closeTime: new Date(),
        profit,
      },
      include: {
        portfolio: true,
        strategy: true,
      },
    });

    return {
      ...position,
      metadata: position.metadata,
      portfolio: position.portfolio,
      strategy: position.strategy,
    } as Position;
  }
}
