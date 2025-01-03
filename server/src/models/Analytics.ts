import { Analytics, AnalyticsType } from '@prisma/client';
import { prisma } from '../config/database';

export type { Analytics };
export { AnalyticsType };

export const createAnalytics = async (data: Omit<Analytics, 'id' | 'createdAt' | 'updatedAt'>) => {
  return prisma.analytics.create({
    data,
    include: {
      user: true,
      relatedStrategies: true,
    },
  });
};

export const getAnalytics = async (id: string) => {
  return prisma.analytics.findUnique({
    where: { id },
    include: {
      user: true,
      relatedStrategies: true,
    },
  });
};

export const updateAnalytics = async (id: string, data: Partial<Analytics>) => {
  return prisma.analytics.update({
    where: { id },
    data,
    include: {
      user: true,
      relatedStrategies: true,
    },
  });
};

export const deleteAnalytics = async (id: string) => {
  return prisma.analytics.delete({
    where: { id },
  });
};

export const searchAnalytics = async (query: string) => {
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
      relatedStrategies: true,
    },
  });
};

export const getAnalyticsByUser = async (userId: string) => {
  return prisma.analytics.findMany({
    where: {
      createdBy: userId,
    },
    include: {
      user: true,
      relatedStrategies: true,
    },
  });
};
