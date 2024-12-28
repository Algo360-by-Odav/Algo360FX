import { IStrategy } from '../models/Strategy';
import { Document, Types, model, Schema } from 'mongoose';
import { SearchResult } from '../types/search';

interface StrategyParameters {
  timeframe: string;
  entryConditions: {
    indicator: string;
    condition: 'above' | 'below' | 'crosses';
    value: number;
  }[];
  exitConditions: {
    indicator: string;
    condition: 'above' | 'below' | 'crosses';
    value: number;
  }[];
  riskManagement: {
    stopLoss: number;
    takeProfit: number;
    maxDrawdown: number;
    positionSize: number;
  };
}

interface BacktestResults {
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  profitFactor: number;
  netProfit: number;
  maxDrawdown: number;
  sharpeRatio: number;
  trades: Array<{
    entryTime: Date;
    exitTime: Date;
    entryPrice: number;
    exitPrice: number;
    type: 'buy' | 'sell';
    profit: number;
    volume: number;
  }>;
}

interface StrategyBacktest {
  startDate: Date;
  endDate: Date;
  results: BacktestResults;
}

export interface StrategyDocument extends Document, IStrategy {
  _id: Types.ObjectId;
  __textScore?: number;
  name: string;
  description: string;
  parameters: StrategyParameters;
  backtest?: StrategyBacktest;
}

const strategySchema = new Schema<StrategyDocument>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  parameters: {
    type: {
      timeframe: { type: String, required: true },
      entryConditions: [{
        indicator: { type: String, required: true },
        condition: { type: String, enum: ['above', 'below', 'crosses'], required: true },
        value: { type: Number, required: true }
      }],
      exitConditions: [{
        indicator: { type: String, required: true },
        condition: { type: String, enum: ['above', 'below', 'crosses'], required: true },
        value: { type: Number, required: true }
      }],
      riskManagement: {
        stopLoss: { type: Number, required: true },
        takeProfit: { type: Number, required: true },
        maxDrawdown: { type: Number, required: true },
        positionSize: { type: Number, required: true }
      }
    },
    required: true
  },
  backtest: {
    startDate: { type: Date },
    endDate: { type: Date },
    results: {
      totalTrades: { type: Number },
      winningTrades: { type: Number },
      losingTrades: { type: Number },
      winRate: { type: Number },
      profitFactor: { type: Number },
      netProfit: { type: Number },
      maxDrawdown: { type: Number },
      sharpeRatio: { type: Number },
      trades: [{
        entryTime: { type: Date, required: true },
        exitTime: { type: Date, required: true },
        entryPrice: { type: Number, required: true },
        exitPrice: { type: Number, required: true },
        type: { type: String, enum: ['buy', 'sell'], required: true },
        profit: { type: Number, required: true },
        volume: { type: Number, required: true }
      }]
    }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Create text index for search
strategySchema.index({ name: 'text', description: 'text' });

const Strategy = model<StrategyDocument>('Strategy', strategySchema);

export async function searchStrategies(query: string): Promise<SearchResult[]> {
  try {
    const strategies = await Strategy.find(
      { $text: { $search: query } },
      { score: { $meta: 'textScore' } }
    ).sort({ score: { $meta: 'textScore' } });

    return strategies.map((strategy: StrategyDocument) => ({
      id: strategy._id.toString(),
      type: 'strategy',
      title: strategy.name,
      description: strategy.description,
      score: strategy.__textScore || 0
    }));
  } catch (error) {
    console.error('Search strategies error:', error);
    return [];
  }
}

export async function createStrategy(data: Partial<IStrategy>): Promise<StrategyDocument> {
  const strategy = new Strategy(data);
  return strategy.save();
}

export async function updateStrategy(id: string, data: Partial<IStrategy>): Promise<StrategyDocument | null> {
  return Strategy.findByIdAndUpdate(id, data, { new: true });
}

export async function deleteStrategy(id: string): Promise<boolean> {
  const result = await Strategy.findByIdAndDelete(id);
  return result !== null;
}

export async function getStrategyById(id: string): Promise<StrategyDocument | null> {
  return Strategy.findById(id);
}

export async function runBacktest(id: string, startDate: Date, endDate: Date): Promise<StrategyDocument | null> {
  const strategy = await Strategy.findById(id);
  if (!strategy) return null;

  try {
    // Simulate backtest results
    const results: BacktestResults = {
      totalTrades: Math.floor(Math.random() * 100) + 50,
      winningTrades: 0,
      losingTrades: 0,
      winRate: 0,
      profitFactor: 0,
      netProfit: 0,
      maxDrawdown: 0,
      sharpeRatio: 0,
      trades: []
    };

    // Calculate derived metrics
    results.winningTrades = Math.floor(results.totalTrades * 0.6);
    results.losingTrades = results.totalTrades - results.winningTrades;
    results.winRate = results.winningTrades / results.totalTrades;
    results.profitFactor = 1.5;
    results.netProfit = 10000;
    results.maxDrawdown = 2000;
    results.sharpeRatio = 1.8;

    // Update strategy with backtest results
    strategy.backtest = {
      startDate,
      endDate,
      results
    };

    return strategy.save();
  } catch (error) {
    console.error('Error running backtest:', error);
    return null;
  }
}
