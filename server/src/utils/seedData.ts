import { PrismaClient, Role, Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seedUsers() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  const users = [
    {
      email: 'admin@algo360fx.com',
      password: hashedPassword,
      username: 'admin',
      firstName: 'Admin',
      lastName: 'User',
      role: Role.ADMIN,
      emailVerified: true,
      settings: {
        preferences: {
          theme: 'dark',
          notifications: {
            email: true,
            push: true,
            trade: true,
            signal: true,
            news: true,
          },
          trading: {
            defaultLeverage: 100,
            defaultRiskPerTrade: 1,
            defaultTimeframe: 'H1',
            favoriteSymbols: ['EURUSD', 'GBPUSD', 'USDJPY'],
            defaultStopLoss: 50,
            defaultTakeProfit: 100,
          },
          display: {
            defaultChartType: 'candlestick',
            showVolume: true,
            showIndicators: true,
            indicatorSettings: {},
          },
          analysis: {
            defaultPeriod: 'D1',
            favoriteIndicators: ['RSI', 'MACD', 'MA'],
            customIndicators: [],
          },
        },
      },
    },
    {
      email: 'demo@algo360fx.com',
      password: hashedPassword,
      username: 'demo',
      firstName: 'Demo',
      lastName: 'User',
      role: Role.USER,
      emailVerified: true,
      settings: {
        preferences: {
          theme: 'light',
          notifications: {
            email: true,
            push: false,
            trade: true,
            signal: false,
            news: true,
          },
          trading: {
            defaultLeverage: 50,
            defaultRiskPerTrade: 2,
            defaultTimeframe: 'H4',
            favoriteSymbols: ['EURUSD', 'XAUUSD'],
            defaultStopLoss: 30,
            defaultTakeProfit: 60,
          },
          display: {
            defaultChartType: 'candlestick',
            showVolume: true,
            showIndicators: true,
            indicatorSettings: {},
          },
          analysis: {
            defaultPeriod: 'H4',
            favoriteIndicators: ['RSI', 'BB'],
            customIndicators: [],
          },
        },
      },
    },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        ...user,
        role: user.role === Role.ADMIN ? Role.ADMIN : Role.USER,
      },
    });
  }
}

async function seedPortfolios() {
  const users = await prisma.user.findMany();

  for (const user of users) {
    await prisma.portfolio.upsert({
      where: {
        id: `default-${user.id}`, // Using a deterministic ID
      },
      update: {},
      create: {
        id: `default-${user.id}`,
        name: 'Default Portfolio',
        description: 'Default trading portfolio',
        balance: 10000,
        currency: 'USD',
        userId: user.id,
      },
    });
  }
}

async function seedStrategies() {
  const users = await prisma.user.findMany();

  const strategyTemplates = [
    {
      name: 'Moving Average Crossover',
      description: 'Simple moving average crossover strategy',
      type: 'TREND_FOLLOWING',
      parameters: {
        fastPeriod: 12,
        slowPeriod: 26,
        symbol: 'EURUSD',
        timeframe: '1H'
      } as Prisma.JsonValue,
    },
    {
      name: 'RSI Strategy',
      description: 'Relative Strength Index based strategy',
      type: 'MEAN_REVERSION',
      parameters: {
        rsiPeriod: 14,
        oversold: 30,
        overbought: 70,
        symbol: 'GBPUSD',
        timeframe: '4H'
      } as Prisma.JsonValue,
    }
  ];

  for (const user of users) {
    for (const template of strategyTemplates) {
      await prisma.strategy.create({
        data: {
          ...template,
          user: { connect: { id: user.id } },
          status: 'ACTIVE',
        },
      });
    }
  }
}

async function seedSignals() {
  const users = await prisma.user.findMany();
  const strategies = await prisma.strategy.findMany();

  for (const user of users) {
    for (const strategy of strategies) {
      const params = strategy.parameters as { symbol: string; timeframe: string };
      if (!params || !params.symbol || !params.timeframe) continue;

      await prisma.signal.create({
        data: {
          user: { connect: { id: user.id } },
          strategy: { connect: { id: strategy.id } },
          symbol: params.symbol,
          type: 'ENTRY',
          direction: 'BUY',
          price: 1.1000,
          stopLoss: 1.0950,
          takeProfit: 1.1100,
          timeframe: params.timeframe,
          status: 'PENDING',
          analysis: {
            reason: 'Moving average crossover detected',
            confidence: 0.75,
            marketContext: 'Bullish trend forming',
          },
        },
      });
    }
  }
}

async function seedAnalytics() {
  const users = await prisma.user.findMany();
  const strategies = await prisma.strategy.findMany();

  for (const user of users) {
    for (const strategy of strategies) {
      await prisma.analytics.create({
        data: {
          user: { connect: { id: user.id } },
          strategy: { connect: { id: strategy.id } },
          type: 'PERFORMANCE',
          period: 'MONTHLY',
          metrics: {
            totalTrades: 50,
            winRate: 0.65,
            profitFactor: 1.8,
            sharpeRatio: 1.5,
            maxDrawdown: 0.15,
            averageWin: 100,
            averageLoss: -60,
          },
        },
      });
    }
  }
}

async function seed() {
  try {
    await seedUsers();
    await seedPortfolios();
    await seedStrategies();
    await seedSignals();
    await seedAnalytics();
    console.log('Seed data created successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run seed if called directly
if (require.main === module) {
  seed()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
