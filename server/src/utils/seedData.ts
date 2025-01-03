import { User } from '../models/User';
import { Strategy } from '../models/Strategy';
import { Portfolio } from '../models/Portfolio';
import { Documentation } from '../models/Documentation';
import { connectDB, closeDB } from '../config/database';
import mongoose from 'mongoose';

async function seed() {
  try {
    // Connect to database
    await connectDB();
    console.log('Connected to database');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Strategy.deleteMany({}),
      Portfolio.deleteMany({}),
      Documentation.deleteMany({})
    ]);
    console.log('Cleared existing data');

    // Seed users
    const users = await User.create([
      {
        email: 'admin@algo360fx.com',
        password: 'admin123',
        username: 'admin',
        role: 'admin'
      },
      {
        email: 'user@algo360fx.com',
        password: 'user123',
        username: 'user',
        role: 'user'
      }
    ]);
    console.log('Users seeded');

    // Seed strategies
    const strategies = await Strategy.create([
      {
        name: 'Moving Average Crossover',
        description: 'A trend-following strategy based on moving average crossovers',
        type: 'trend',
        timeframe: '1h',
        risk: 'medium'
      },
      {
        name: 'RSI Divergence',
        description: 'A reversal strategy based on RSI divergence',
        type: 'reversal',
        timeframe: '4h',
        risk: 'high'
      }
    ]);
    console.log('Strategies seeded');

    // Seed portfolios
    await Portfolio.create([
      {
        user: users[0]._id,
        name: 'Conservative Portfolio',
        description: 'Low risk portfolio focused on stable returns',
        strategies: [strategies[0]._id],
        balance: 10000,
        risk: 'low'
      },
      {
        user: users[1]._id,
        name: 'Aggressive Portfolio',
        description: 'High risk portfolio focused on maximum returns',
        strategies: [strategies[1]._id],
        balance: 20000,
        risk: 'high'
      }
    ]);
    console.log('Portfolios seeded');

    // Seed documentation
    await Documentation.create([
      {
        title: 'Getting Started',
        content: 'Welcome to Algo360FX. This guide will help you get started...',
        category: 'guide',
        tags: ['beginner', 'setup']
      },
      {
        title: 'Strategy Development',
        content: 'Learn how to develop and backtest trading strategies...',
        category: 'tutorial',
        tags: ['strategy', 'development']
      }
    ]);
    console.log('Documentation seeded');

    console.log('Seeding completed successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    // Close database connection
    await closeDB();
    console.log('Database connection closed');
  }
}

// Run seeder
seed();
