import { Analytics, AnalyticsType } from '@prisma/client';
import { prisma } from '../config/database';
import { SearchResult } from '../types/search';

export type { Analytics };
export { AnalyticsType };

interface CreateAnalyticsInput {
  name: string;
  description: string;
  category: string;
  type: AnalyticsType;
  data: Record<string, any>;
  parameters?: Record<string, any>;
  createdBy: string;
  strategyIds?: string[];
}

interface UpdateAnalyticsInput {
  name?: string;
  description?: string;
  category?: string;
  type?: AnalyticsType;
  data?: Record<string, any>;
  parameters?: Record<string, any>;
  strategyIds?: string[];
}

export async function createAnalytics(input: CreateAnalyticsInput): Promise<Analytics> {
  const { strategyIds, ...data } = input;
  
  return prisma.analytics.create({
    data: {
      ...data,
      strategies: strategyIds ? {
        connect: strategyIds.map(id => ({ id })),
      } : undefined,
    },
    include: {
      user: true,
      strategies: true,
    },
  });
}

export async function getAnalytics(id: string): Promise<Analytics | null> {
  return prisma.analytics.findUnique({
    where: { id },
    include: {
      user: true,
      strategies: true,
    },
  });
}

export async function updateAnalytics(id: string, input: UpdateAnalyticsInput): Promise<Analytics> {
  const { strategyIds, ...data } = input;

  return prisma.analytics.update({
    where: { id },
    data: {
      ...data,
      strategies: strategyIds ? {
        set: strategyIds.map(id => ({ id })),
      } : undefined,
    },
    include: {
      user: true,
      strategies: true,
    },
  });
}

export async function deleteAnalytics(id: string): Promise<Analytics> {
  return prisma.analytics.delete({
    where: { id },
    include: {
      user: true,
      strategies: true,
    },
  });
}

export async function searchAnalytics(query: string): Promise<SearchResult[]> {
  try {
    const analytics = await prisma.analytics.findMany({
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
      orderBy: [
        { name: 'asc' },
      ],
    });

    return analytics.map(analytic => ({
      id: analytic.id,
      type: 'analytics',
      title: analytic.name,
      description: analytic.description,
      score: 1, // PostgreSQL doesn't provide text search scores directly
      metadata: {
        category: analytic.category,
        type: analytic.type,
        createdBy: analytic.user.username,
        strategies: analytic.strategies.map(s => s.name),
      },
    }));
  } catch (error) {
    console.error('Search analytics error:', error);
    return [];
  }
}

export async function getAnalyticsByUser(userId: string): Promise<Analytics[]> {
  return prisma.analytics.findMany({
    where: {
      createdBy: userId,
    },
    include: {
      user: true,
      strategies: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

export async function getAnalyticsByCategory(category: string): Promise<Analytics[]> {
  return prisma.analytics.findMany({
    where: {
      category,
    },
    include: {
      user: true,
      strategies: true,
    },
    orderBy: {
      name: 'asc',
    },
  });
}

export async function getAnalyticsByStrategy(strategyId: string): Promise<Analytics[]> {
  return prisma.analytics.findMany({
    where: {
      strategies: {
        some: {
          id: strategyId,
        },
      },
    },
    include: {
      user: true,
      strategies: true,
    },
    orderBy: {
      name: 'asc',
    },
  });
}
