import { prisma } from '../config/database';
import { Position as PrismaPosition } from '@prisma/client';

export interface IPosition {
  id: string;
  symbol: string;
  type: string;
  volume: number;
  openPrice: number;
  closePrice?: number;
  openTime: Date;
  closeTime?: Date;
  profit?: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

// Export type-safe database operations
export const Position = {
  create: (data: Omit<IPosition, 'id' | 'createdAt' | 'updatedAt'>) => {
    return prisma.position.create({
      data
    });
  },

  findById: (id: string) => {
    return prisma.position.findUnique({
      where: { id }
    });
  },

  findMany: (where = {}) => {
    return prisma.position.findMany({
      where
    });
  },

  update: (id: string, data: Partial<Omit<IPosition, 'id' | 'createdAt' | 'updatedAt'>>) => {
    return prisma.position.update({
      where: { id },
      data
    });
  },

  delete: (id: string) => {
    return prisma.position.delete({
      where: { id }
    });
  }
};
