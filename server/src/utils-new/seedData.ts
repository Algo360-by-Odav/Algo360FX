import { PrismaClient, Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { TimeFrame, DataSource } from '../types-new/MarketData';
import { PositionType, PositionStatus } from '../types-new/Position';
import { UserPreferences } from '../types-new/User';

const prisma = new PrismaClient();

async function seedUsers() {
  const defaultPreferences: UserPreferences = {
    theme: 'light',
    notifications: {
      email: true,
      push: true,
      sms: false
    },
    defaultCurrency: 'USD',
    riskManagement: {
      maxPositions: 5,
      maxLeverage: 10,
      maxDrawdown: 20
    },
    tradingPreferences: {
      defaultSize: 1000,
      defaultStopLoss: 1,
      defaultTakeProfit: 2,
      preferredPairs: ['EUR/USD', 'GBP/USD', 'USD/JPY']
    }
  };

  const hashedPassword = await bcrypt.hash('password123', 10);

  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'admin@algo360fx.com',
        password: hashedPassword,
        name: 'Admin User',
        role: 'ADMIN',
        preferences: defaultPreferences as unknown as Prisma.InputJsonValue,
        tokenVersion: 0
      }
    }),
    prisma.user.create({
      data: {
        email: 'trader@algo360fx.com',
        password: hashedPassword,
        name: 'Test Trader',
        role: 'USER',
        preferences: defaultPreferences as unknown as Prisma.InputJsonValue,
        tokenVersion: 0
      }
    })
  ]);

  return users;
}

async function seedStrategies(users: any[]) {
  const strategies = await Promise.all([
    prisma.strategy.create({
      data: {
        name: 'MACD Crossover',
        description: 'Trading strategy based on MACD crossovers',
        type: 'TECHNICAL',
        parameters: {
          fastPeriod: 12,
          slowPeriod: 26,
          signalPeriod: 9,
          timeframe: '1h'
        } as unknown as Prisma.InputJsonValue,
        userId: users[1].id,
        isActive: true
      }
    }),
    prisma.strategy.create({
      data: {
        name: 'RSI Divergence',
        description: 'Trading strategy based on RSI divergence patterns',
        type: 'TECHNICAL',
        parameters: {
          rsiPeriod: 14,
          oversold: 30,
          overbought: 70,
          timeframe: '4h'
        } as unknown as Prisma.InputJsonValue,
        userId: users[1].id,
        isActive: true
      }
    })
  ]);

  return strategies;
}

async function seedMarketData() {
  const marketData = await Promise.all([
    prisma.marketData.create({
      data: {
        symbol: 'EUR/USD',
        timeframe: '1h' as TimeFrame,
        source: 'OANDA' as DataSource,
        data: [
          {
            timestamp: new Date('2025-01-05T00:00:00Z'),
            open: 1.0950,
            high: 1.0965,
            low: 1.0945,
            close: 1.0960,
            volume: 10000
          }
        ] as unknown as Prisma.InputJsonValue,
        startTime: new Date('2025-01-05T00:00:00Z'),
        endTime: new Date('2025-01-05T01:00:00Z'),
        metadata: {
          provider: 'OANDA',
          quality: 'HIGH'
        } as unknown as Prisma.InputJsonValue
      }
    })
  ]);

  return marketData;
}

async function seedPositions(users: any[], strategies: any[]) {
  const positions = await Promise.all([
    prisma.position.create({
      data: {
        symbol: 'EUR/USD',
        type: 'LONG' as PositionType,
        status: 'OPEN' as PositionStatus,
        entryPrice: 1.0950,
        size: 10000,
        metadata: {
          leverage: 10,
          tags: ['trend-following'],
          notes: 'Strong uptrend on H4'
        } as unknown as Prisma.InputJsonValue,
        userId: users[1].id,
        strategyId: strategies[0].id,
        openTime: new Date(),
        portfolioId: '1' // You'll need to create a portfolio first or remove this if not required
      }
    })
  ]);

  return positions;
}

export async function seedDatabase() {
  try {
    // Clear existing data
    await prisma.position.deleteMany();
    await prisma.strategy.deleteMany();
    await prisma.marketData.deleteMany();
    await prisma.user.deleteMany();

    // Seed data
    const users = await seedUsers();
    const strategies = await seedStrategies(users);
    const marketData = await seedMarketData();
    const positions = await seedPositions(users, strategies);

    console.log('Database seeded successfully');
    return { users, strategies, marketData, positions };
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase();
