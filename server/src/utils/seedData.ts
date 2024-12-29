import Strategy from '../models/Strategy';
import Portfolio from '../models/Portfolio';
import Documentation from '../models/Documentation';
import Analytics from '../models/Analytics';
import { connectToDatabase, disconnectDatabase } from '../config/database';

const seedStrategies = async () => {
  const strategies = [
    {
      name: 'Moving Average Crossover',
      description: 'A trend-following strategy that uses two moving averages to generate trading signals.',
      type: 'TREND_FOLLOWING',
      category: 'TECHNICAL',
    },
    {
      name: 'RSI Mean Reversion',
      description: 'A mean reversion strategy that uses RSI to identify overbought and oversold conditions.',
      type: 'MEAN_REVERSION',
      category: 'TECHNICAL',
    },
    {
      name: 'Momentum Strategy',
      description: 'A momentum-based strategy that identifies and trades with strong market trends.',
      type: 'MOMENTUM',
      category: 'TECHNICAL',
    }
  ];

  await Strategy.insertMany(strategies);
  console.log('Inserted strategies');
};

const seedPortfolios = async () => {
  const portfolios = [
    {
      name: 'Conservative Portfolio',
      description: 'A low-risk portfolio focusing on stable returns',
      category: 'CONSERVATIVE',
      strategies: [],
    },
    {
      name: 'Aggressive Growth',
      description: 'High-risk portfolio aiming for maximum returns',
      category: 'AGGRESSIVE',
      strategies: [],
    }
  ];

  await Portfolio.insertMany(portfolios);
  console.log('Inserted portfolios');
};

const seedDocumentation = async () => {
  const docs = [
    {
      title: 'Getting Started Guide',
      content: 'Complete guide to getting started with Algo360FX trading platform',
      category: 'GUIDE',
      tags: ['beginner', 'tutorial'],
    },
    {
      title: 'Strategy Development',
      content: 'Learn how to develop and backtest trading strategies',
      category: 'DEVELOPMENT',
      tags: ['strategy', 'development'],
    }
  ];

  await Documentation.insertMany(docs);
  console.log('Inserted documentation');
};

const seedAnalytics = async () => {
  const analytics = [
    {
      name: 'Performance Analysis',
      description: 'Detailed analysis of strategy performance metrics',
      category: 'PERFORMANCE',
      type: 'REPORT',
    },
    {
      name: 'Risk Metrics',
      description: 'Comprehensive risk analysis and metrics',
      category: 'RISK',
      type: 'DASHBOARD',
    }
  ];

  await Analytics.insertMany(analytics);
  console.log('Inserted analytics');
};

const clearExistingData = async () => {
  await Promise.all([
    Strategy.deleteMany({}),
    Portfolio.deleteMany({}),
    Documentation.deleteMany({}),
    Analytics.deleteMany({}),
  ]);
  console.log('Cleared existing data');
};

const seedDatabase = async () => {
  try {
    await connectToDatabase();
    await clearExistingData();
    await seedStrategies();
    await seedPortfolios();
    await seedDocumentation();
    await seedAnalytics();
    console.log('Database seeded successfully!');
    await disconnectDatabase();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
