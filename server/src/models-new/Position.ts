import { PrismaClient, Position as PrismaPosition, Prisma } from '@prisma/client';
import { Position as PositionInterface, PositionCreateInput, PositionUpdateInput, PositionWhereInput, PositionType, PositionStatus } from '../types-new/Position';

const prisma = new PrismaClient();

export type { PositionInterface as Position };

export class PositionModel {
  static async create(data: PositionCreateInput): Promise<PositionInterface> {
    return await prisma.position.create({
      data: {
        portfolioId: data.portfolioId,
        strategyId: data.strategyId,
        symbol: data.symbol,
        type: data.type,
        status: data.status,
        openTime: data.openTime,
        entryPrice: data.entryPrice,
        size: data.size,
        stopLoss: data.stopLoss ?? null,
        takeProfit: data.takeProfit ?? null,
        metadata: data.metadata ?? null,
      },
    }) as unknown as PositionInterface;
  }

  static async findById(id: string): Promise<PositionInterface | null> {
    return await prisma.position.findUnique({
      where: { id },
    }) as unknown as PositionInterface | null;
  }

  static async findByPortfolio(portfolioId: string): Promise<PositionInterface[]> {
    return await prisma.position.findMany({
      where: { portfolioId },
    }) as unknown as PositionInterface[];
  }

  static async findByStrategy(strategyId: string): Promise<PositionInterface[]> {
    return await prisma.position.findMany({
      where: { strategyId },
    }) as unknown as PositionInterface[];
  }

  static async update(id: string, data: PositionUpdateInput): Promise<PositionInterface> {
    return await prisma.position.update({
      where: { id },
      data,
    }) as unknown as PositionInterface;
  }

  static async delete(id: string): Promise<PositionInterface> {
    return await prisma.position.delete({
      where: { id },
    }) as unknown as PositionInterface;
  }

  static async findAll(where: PositionWhereInput = {}): Promise<PositionInterface[]> {
    return await prisma.position.findMany({
      where,
    }) as unknown as PositionInterface[];
  }
}
