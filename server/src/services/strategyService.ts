import { IStrategy } from '../models/Strategy';
import { Document, Types, model, Schema } from 'mongoose';
import { SearchResult } from '../types/search';

export interface StrategyDocument extends Document, IStrategy {
  _id: Types.ObjectId;
  __textScore?: number;
  name: string;
  description: string;
  parameters: Record<string, any>;
  backtest?: {
    startDate: Date;
    endDate: Date;
    results: Record<string, any>;
  };
}

const strategySchema = new Schema<StrategyDocument>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  parameters: { type: Schema.Types.Mixed, required: true },
  backtest: {
    startDate: Date,
    endDate: Date,
    results: Schema.Types.Mixed
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
  return !!result;
}

export async function getStrategyById(id: string): Promise<StrategyDocument | null> {
  return Strategy.findById(id);
}

export async function runBacktest(id: string, startDate: Date, endDate: Date): Promise<StrategyDocument | null> {
  const strategy = await Strategy.findById(id);
  if (!strategy) return null;

  // Implement backtesting logic here
  // This is a placeholder that just updates the backtest dates
  strategy.backtest = {
    startDate,
    endDate,
    results: {
      profitLoss: 0,
      winRate: 0,
      trades: []
    }
  };

  return strategy.save();
}