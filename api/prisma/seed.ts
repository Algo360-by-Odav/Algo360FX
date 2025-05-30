import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('Admin123!', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@algo360fx.com' },
    update: {},
    create: {
      email: 'admin@algo360fx.com',
      username: 'admin',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      isVerified: true,
      role: 'ADMIN',
      preferences: {
        theme: 'dark',
        language: 'en',
        notifications: {
          email: true,
          push: true,
          sms: false
        },
        trading: {
          defaultLeverage: 10,
          defaultStopLoss: 50,
          defaultTakeProfit: 100,
          confirmTrades: true,
          showPnL: true
        }
      }
    },
  });
  console.log('Admin user created:', admin.email);

  // Create demo user
  const demoPassword = await bcrypt.hash('Demo123!', 10);
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@algo360fx.com' },
    update: {},
    create: {
      email: 'demo@algo360fx.com',
      username: 'demouser',
      password: demoPassword,
      firstName: 'Demo',
      lastName: 'User',
      isVerified: true,
      role: 'USER',
      preferences: {
        theme: 'light',
        language: 'en',
        notifications: {
          email: true,
          push: false,
          sms: false
        },
        trading: {
          defaultLeverage: 5,
          defaultStopLoss: 25,
          defaultTakeProfit: 75,
          confirmTrades: true,
          showPnL: true
        }
      }
    },
  });
  console.log('Demo user created:', demoUser.email);

  // Create some market data - using string enum values instead of enum constants
  await prisma.marketData.create({
    data: {
      symbol: 'EUR/USD',
      name: 'Euro / US Dollar',
      type: 'forex',
      price: 1.1850,
      bid: 1.1848,
      ask: 1.1852,
      high: 1.1900,
      low: 1.1800,
      volume: 5000,
      change: 0.0025,
      changePercent: 0.21,
      lastUpdated: new Date(),
    },
  });

  await prisma.marketData.create({
    data: {
      symbol: 'BTC/USD',
      name: 'Bitcoin / US Dollar',
      type: 'crypto',
      price: 45000,
      bid: 44950,
      ask: 45050,
      high: 46000,
      low: 44000,
      volume: 1200,
      change: 500,
      changePercent: 1.12,
      lastUpdated: new Date(),
    },
  });

  // Create a portfolio for the demo user
  const portfolio = await prisma.portfolio.create({
    data: {
      name: 'Demo Portfolio',
      description: 'A demo portfolio for testing purposes',
      balance: 10000.0,
      currency: 'USD',
      userId: demoUser.id,
    },
  });

  // Create a position
  const position = await prisma.position.create({
    data: {
      symbol: 'EUR/USD',
      quantity: 10000,
      entryPrice: 1.1850,
      currentPrice: 1.1920,
      portfolioId: portfolio.id,
      userId: demoUser.id,
    },
  });

  // Create an order - using string literals instead of enums
  await prisma.order.create({
    data: {
      type: 'MARKET',
      status: 'FILLED',
      symbol: 'EUR/USD',
      quantity: 5000,
      price: 1.1900,
      executedAt: new Date(Date.now() - 86400000), // 1 day ago
      userId: demoUser.id,
      positionId: position.id,
    },
  });

  // Create some products - using string literals for enum types
  const ebook = await prisma.product.create({
    data: {
      name: 'Algorithmic Trading Fundamentals',
      description: 'Learn the basics of algorithmic trading and how to build your first trading bot.',
      type: 'EBOOK',
      price: 29.99,
      currency: 'USD',
      metadata: {
        author: 'Dr. Sarah Johnson',
        pages: 250,
        format: 'PDF, EPUB, MOBI',
        preview: 'https://example.com/preview/algo-trading-fundamentals',
        bestseller: true,
        featured: true,
      },
    },
  });

  const course = await prisma.product.create({
    data: {
      name: 'Machine Learning for Traders',
      description: 'Comprehensive course on applying machine learning algorithms to trading strategies.',
      type: 'COURSE',
      price: 199.99,
      currency: 'USD',
      metadata: {
        instructor: 'Prof. Alan Williams',
        duration: '12 weeks',
        modules: 10,
        level: 'Intermediate',
        includes: ['45+ video lessons', '5 practical projects', 'Certificate of completion'],
        featured: true,
      },
    },
  });

  const strategy = await prisma.product.create({
    data: {
      name: 'Momentum Trading Strategy',
      description: 'A proven momentum trading strategy for forex markets.',
      type: 'STRATEGY',
      price: 99.99,
      currency: 'USD',
      metadata: {
        markets: ['forex', 'crypto'],
        timeframes: ['1h', '4h', 'daily'],
        backtested: true,
        winRate: 68.5,
        featured: true,
      },
    },
  });

  // Create a purchase record
  await prisma.purchase.create({
    data: {
      productId: ebook.id,
      userId: demoUser.id,
      amount: ebook.price,
      currency: 'USD',
      status: 'COMPLETED',
    },
  });

  // Create a subscription
  await prisma.subscription.create({
    data: {
      planId: 'premium_monthly',
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      autoRenew: true,
      status: 'ACTIVE',
      userId: demoUser.id,
    }
  });

  console.log('Database seeded successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
