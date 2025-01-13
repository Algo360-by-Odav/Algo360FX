import { prisma } from '../config/database';
import { Strategy as PrismaStrategy, Prisma } from '@prisma/client';

export type Strategy = PrismaStrategy;
type StrategyCreateInput = Prisma.StrategyUncheckedCreateInput;
type StrategyUpdateInput = Prisma.StrategyUncheckedUpdateInput;
type StrategyWhereInput = Prisma.StrategyWhereInput;

// Export type-safe database operations
export const Strategy = {
  create: async (data: StrategyCreateInput): Promise<Strategy> => {
    return prisma.strategy.create({
      data,
      include: {
        analytics: true
      }
    });
  },

  findById: async (id: string): Promise<Strategy | null> => {
    return prisma.strategy.findUnique({
      where: { id },
      include: {
        analytics: true
      }
    });
  },

  findByName: async (name: string): Promise<Strategy | null> => {
    return prisma.strategy.findFirst({
      where: { name },
      include: {
        analytics: true
      }
    });
  },

  findMany: async (where: StrategyWhereInput = {}): Promise<Strategy[]> => {
    return prisma.strategy.findMany({
      where,
      include: {
        analytics: true
      }
    });
  },

  update: async (id: string, data: StrategyUpdateInput): Promise<Strategy> => {
    return prisma.strategy.update({
      where: { id },
      data,
      include: {
        analytics: true
      }
    });
  },

  delete: async (id: string): Promise<Strategy> => {
    return prisma.strategy.delete({
      where: { id },
      include: {
        analytics: true
      }
    });
  }
};
