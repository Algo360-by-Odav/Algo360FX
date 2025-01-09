import { Analytics, AnalyticsType, Prisma } from '@prisma/client';
import { prisma } from '../config/database';

export type { Analytics };
export { AnalyticsType };

type AnalyticsCreateInput = Prisma.AnalyticsUncheckedCreateInput;
type AnalyticsUpdateInput = Prisma.AnalyticsUncheckedUpdateInput;

export const createAnalytics = async (data: AnalyticsCreateInput): Promise<Analytics> => {
  return prisma.analytics.create({
    data,
    include: {
      user: true,
      strategies: true,
    },
  });
};

export const getAnalytics = async (id: string): Promise<Analytics | null> => {
  return prisma.analytics.findUnique({
    where: { id },
    include: {
      user: true,
      strategies: true,
    },
  });
};

export const updateAnalytics = async (id: string, data: AnalyticsUpdateInput): Promise<Analytics> => {
  return prisma.analytics.update({
    where: { id },
    data,
    include: {
      user: true,
      strategies: true,
    },
  });
};

export const deleteAnalytics = async (id: string): Promise<Analytics> => {
  return prisma.analytics.delete({
    where: { id },
  });
};

export const searchAnalytics = async (query: string): Promise<Analytics[]> => {
  return prisma.analytics.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { category: { contains: query, mode: 'insensitive' } },
      ],
    },
    include: {
      user: true,
      strategies: true,
    },
  });
};

export const getAnalyticsByUser = async (userId: string): Promise<Analytics[]> => {
  return prisma.analytics.findMany({
    where: {
      createdBy: userId,
    },
    include: {
      user: true,
      strategies: true,
    },
  });
};
