import { prisma } from '../config/database';
import {
  Position,
  PositionCreateInput,
  PositionUpdateInput,
  PositionWhereInput,
  PositionWhereUniqueInput,
  PositionWithRelations
} from '../types/Position';

export class PositionService {
  static async create(data: PositionCreateInput): Promise<PositionWithRelations> {
    return prisma.position.create({
      data,
      include: {
        portfolio: true,
        strategy: true
      }
    }) as Promise<PositionWithRelations>;
  }

  static async findById(id: string): Promise<PositionWithRelations | null> {
    return prisma.position.findUnique({
      where: { id },
      include: {
        portfolio: true,
        strategy: true
      }
    }) as Promise<PositionWithRelations | null>;
  }

  static async findMany(where: PositionWhereInput = {}): Promise<PositionWithRelations[]> {
    return prisma.position.findMany({
      where,
      include: {
        portfolio: true,
        strategy: true
      }
    }) as Promise<PositionWithRelations[]>;
  }

  static async update(id: string, data: PositionUpdateInput): Promise<PositionWithRelations> {
    return prisma.position.update({
      where: { id },
      data,
      include: {
        portfolio: true,
        strategy: true
      }
    }) as Promise<PositionWithRelations>;
  }

  static async delete(id: string): Promise<PositionWithRelations> {
    return prisma.position.delete({
      where: { id },
      include: {
        portfolio: true,
        strategy: true
      }
    }) as Promise<PositionWithRelations>;
  }

  static async findByPortfolio(portfolioId: string): Promise<PositionWithRelations[]> {
    return prisma.position.findMany({
      where: { portfolioId },
      include: {
        portfolio: true,
        strategy: true
      }
    }) as Promise<PositionWithRelations[]>;
  }

  static async findByStrategy(strategyId: string): Promise<PositionWithRelations[]> {
    return prisma.position.findMany({
      where: { strategyId },
      include: {
        portfolio: true,
        strategy: true
      }
    }) as Promise<PositionWithRelations[]>;
  }

  static async findOpenPositions(): Promise<PositionWithRelations[]> {
    return prisma.position.findMany({
      where: { status: 'OPEN' },
      include: {
        portfolio: true,
        strategy: true
      }
    }) as Promise<PositionWithRelations[]>;
  }

  static async closePosition(
    id: string,
    exitPrice: number,
    closeTime: Date = new Date()
  ): Promise<PositionWithRelations> {
    const position = await prisma.position.findUnique({ where: { id } });
    if (!position) {
      throw new Error('Position not found');
    }

    const profit = position.type === 'LONG'
      ? (exitPrice - position.entryPrice) * position.size
      : (position.entryPrice - exitPrice) * position.size;

    return prisma.position.update({
      where: { id },
      data: {
        status: 'CLOSED',
        exitPrice,
        closeTime,
        profit
      },
      include: {
        portfolio: true,
        strategy: true
      }
    }) as Promise<PositionWithRelations>;
  }

  static async updateStopLoss(id: string, stopLoss: number): Promise<PositionWithRelations> {
    return prisma.position.update({
      where: { id },
      data: { stopLoss },
      include: {
        portfolio: true,
        strategy: true
      }
    }) as Promise<PositionWithRelations>;
  }

  static async updateTakeProfit(id: string, takeProfit: number): Promise<PositionWithRelations> {
    return prisma.position.update({
      where: { id },
      data: { takeProfit },
      include: {
        portfolio: true,
        strategy: true
      }
    }) as Promise<PositionWithRelations>;
  }

  static async getPositionMetrics(id: string): Promise<{
    unrealizedProfit: number;
    realizedProfit: number;
    totalProfit: number;
    winRate: number;
    averageWin: number;
    averageLoss: number;
  }> {
    const position = await prisma.position.findUnique({
      where: { id },
      include: {
        portfolio: true,
        strategy: true
      }
    }) as PositionWithRelations | null;

    if (!position) {
      throw new Error('Position not found');
    }

    const closedPositions = await prisma.position.findMany({
      where: {
        portfolioId: position.portfolioId,
        status: 'CLOSED'
      }
    });

    const wins = closedPositions.filter(p => (p.profit || 0) > 0);
    const losses = closedPositions.filter(p => (p.profit || 0) <= 0);

    const winRate = wins.length / closedPositions.length;
    const averageWin = wins.reduce((sum, p) => sum + (p.profit || 0), 0) / wins.length;
    const averageLoss = Math.abs(losses.reduce((sum, p) => sum + (p.profit || 0), 0)) / losses.length;

    const unrealizedProfit = position.status === 'OPEN' ? (position.profit || 0) : 0;
    const realizedProfit = position.status === 'CLOSED' ? (position.profit || 0) : 0;
    const totalProfit = unrealizedProfit + realizedProfit;

    return {
      unrealizedProfit,
      realizedProfit,
      totalProfit,
      winRate,
      averageWin,
      averageLoss
    };
  }
}