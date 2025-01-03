import prisma from '../config/database';
import { Portfolio as PrismaPortfolio } from '@prisma/client';

export interface IPortfolio {
  id: string;
  userId: string;
  name: string;
  balance: number;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}

// Export type-safe database operations
export const Portfolio = {
  create: (data: Omit<IPortfolio, 'id' | 'createdAt' | 'updatedAt'>) => {
    return prisma.portfolio.create({
      data
    });
  },

  findById: (id: string) => {
    return prisma.portfolio.findUnique({
      where: { id }
    });
  },

  findByUserId: (userId: string) => {
    return prisma.portfolio.findMany({
      where: { userId }
    });
  },

  update: (id: string, data: Partial<Omit<IPortfolio, 'id' | 'createdAt' | 'updatedAt'>>) => {
    return prisma.portfolio.update({
      where: { id },
      data
    });
  },

  delete: (id: string) => {
    return prisma.portfolio.delete({
      where: { id }
    });
  }
};
