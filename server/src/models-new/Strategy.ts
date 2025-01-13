import { PrismaClient, Prisma } from '@prisma/client';
import { InputJsonValue } from '@prisma/client/runtime/library';
import { Position } from './Position';

export interface Strategy {
  id: string;
  userId: string;
  name: string;
  type: string;
  description: string;
  parameters: InputJsonValue;
  isActive: boolean;
  performance: InputJsonValue | null;
  metadata: InputJsonValue | null;
  createdAt: Date;
  updatedAt: Date;
  positions?: Position[];
}

export interface StrategyCreateInput {
  userId: string;
  name: string;
  type: string;
  description: string;
  parameters: InputJsonValue;
  isActive?: boolean;
  performance?: InputJsonValue | null;
  metadata?: InputJsonValue | null;
}

export interface StrategyUpdateInput {
  name?: string;
  type?: string;
  description?: string;
  parameters?: InputJsonValue;
  isActive?: boolean;
  performance?: InputJsonValue | null;
  metadata?: InputJsonValue | null;
}

export interface StrategyWhereInput {
  id?: string;
  userId?: string;
  type?: string;
  isActive?: boolean;
}

export interface StrategyWhereUniqueInput {
  id: string;
}

const prisma = new PrismaClient();

export class StrategyModel {
  static async create(data: StrategyCreateInput): Promise<Strategy> {
    const strategy = await prisma.strategy.create({
      data: {
        userId: data.userId,
        name: data.name,
        type: data.type,
        description: data.description,
        parameters: data.parameters,
        isActive: data.isActive ?? true,
        performance: data.performance,
        metadata: data.metadata,
      },
      include: {
        positions: true,
      },
    });

    return {
      ...strategy,
      userId: strategy.userId,
      parameters: strategy.parameters as InputJsonValue,
      performance: strategy.performance as InputJsonValue | null,
      metadata: strategy.metadata as InputJsonValue | null,
    } as Strategy;
  }

  static async update(id: string, data: StrategyUpdateInput): Promise<Strategy> {
    const strategy = await prisma.strategy.update({
      where: { id },
      data: {
        name: data.name,
        type: data.type,
        description: data.description,
        parameters: data.parameters,
        isActive: data.isActive,
        performance: data.performance,
        metadata: data.metadata,
      },
      include: {
        positions: true,
      },
    });

    return {
      ...strategy,
      userId: strategy.userId,
      parameters: strategy.parameters as InputJsonValue,
      performance: strategy.performance as InputJsonValue | null,
      metadata: strategy.metadata as InputJsonValue | null,
    } as Strategy;
  }

  static async findById(id: string): Promise<Strategy | null> {
    const strategy = await prisma.strategy.findUnique({
      where: { id },
      include: {
        positions: true,
      },
    });

    if (!strategy) return null;

    return {
      ...strategy,
      userId: strategy.userId,
      parameters: strategy.parameters as InputJsonValue,
      performance: strategy.performance as InputJsonValue | null,
      metadata: strategy.metadata as InputJsonValue | null,
    } as Strategy;
  }

  static async findAll(where: StrategyWhereInput = {}): Promise<Strategy[]> {
    const strategies = await prisma.strategy.findMany({
      where,
      include: {
        positions: true,
      },
    });

    return strategies.map(strategy => ({
      ...strategy,
      userId: strategy.userId,
      parameters: strategy.parameters as InputJsonValue,
      performance: strategy.performance as InputJsonValue | null,
      metadata: strategy.metadata as InputJsonValue | null,
    })) as Strategy[];
  }

  static async delete(id: string): Promise<Strategy> {
    const strategy = await prisma.strategy.delete({
      where: { id },
      include: {
        positions: true,
      },
    });

    return {
      ...strategy,
      userId: strategy.userId,
      parameters: strategy.parameters as InputJsonValue,
      performance: strategy.performance as InputJsonValue | null,
      metadata: strategy.metadata as InputJsonValue | null,
    } as Strategy;
  }

  static async findByUser(userId: string): Promise<Strategy[]> {
    const strategies = await prisma.strategy.findMany({
      where: { userId },
      include: {
        positions: true,
      },
    });

    return strategies.map(strategy => ({
      ...strategy,
      userId: strategy.userId,
      parameters: strategy.parameters as InputJsonValue,
      performance: strategy.performance as InputJsonValue | null,
      metadata: strategy.metadata as InputJsonValue | null,
    })) as Strategy[];
  }

  static async findByType(type: string): Promise<Strategy[]> {
    const strategies = await prisma.strategy.findMany({
      where: { type },
      include: {
        positions: true,
      },
    });

    return strategies.map(strategy => ({
      ...strategy,
      userId: strategy.userId,
      parameters: strategy.parameters as InputJsonValue,
      performance: strategy.performance as InputJsonValue | null,
      metadata: strategy.metadata as InputJsonValue | null,
    })) as Strategy[];
  }

  static async findActive(): Promise<Strategy[]> {
    const strategies = await prisma.strategy.findMany({
      where: { isActive: true },
      include: {
        positions: true,
      },
    });

    return strategies.map(strategy => ({
      ...strategy,
      userId: strategy.userId,
      parameters: strategy.parameters as InputJsonValue,
      performance: strategy.performance as InputJsonValue | null,
      metadata: strategy.metadata as InputJsonValue | null,
    })) as Strategy[];
  }

  static async updatePerformance(id: string, performance: InputJsonValue): Promise<Strategy> {
    const strategy = await prisma.strategy.update({
      where: { id },
      data: { performance },
      include: {
        positions: true,
      },
    });

    return {
      ...strategy,
      userId: strategy.userId,
      parameters: strategy.parameters as InputJsonValue,
      performance: strategy.performance as InputJsonValue | null,
      metadata: strategy.metadata as InputJsonValue | null,
    } as Strategy;
  }

  static async getPerformanceMetrics(id: string): Promise<InputJsonValue | null> {
    const strategy = await prisma.strategy.findUnique({
      where: { id },
      select: {
        performance: true,
      },
    });

    return strategy?.performance as InputJsonValue | null;
  }
}
