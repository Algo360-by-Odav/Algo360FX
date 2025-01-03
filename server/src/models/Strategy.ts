import prisma from '../config/database';
import { Strategy as PrismaStrategy } from '@prisma/client';

export interface IStrategy {
  id: string;
  name: string;
  description?: string;
  config: any;
  createdAt: Date;
  updatedAt: Date;
}

// Export type-safe database operations
export const Strategy = {
  create: (data: Omit<IStrategy, 'id' | 'createdAt' | 'updatedAt'>) => {
    return prisma.strategy.create({
      data
    });
  },

  findById: (id: string) => {
    return prisma.strategy.findUnique({
      where: { id }
    });
  },

  findByName: (name: string) => {
    return prisma.strategy.findUnique({
      where: { name }
    });
  },

  findMany: (where = {}) => {
    return prisma.strategy.findMany({
      where
    });
  },

  update: (id: string, data: Partial<Omit<IStrategy, 'id' | 'createdAt' | 'updatedAt'>>) => {
    return prisma.strategy.update({
      where: { id },
      data
    });
  },

  delete: (id: string) => {
    return prisma.strategy.delete({
      where: { id }
    });
  }
};
