import { IStrategy } from '../models/Strategy';
import { Document, Types, model, Schema } from 'mongoose';
import { SearchResult } from '../types/search';

// Enums for better type safety
export enum TimeFrame {
  M1 = 'M1',
  M5 = 'M5',
  M15 = 'M15',
  M30 = 'M30',
  H1 = 'H1',
  H4 = 'H4',
  D1 = 'D1',
  W1 = 'W1',
  MN = 'MN'
}

export enum IndicatorType {
  SMA = 'SMA',
  EMA = 'EMA',
  RSI = 'RSI',
  MACD = 'MACD',
  BB = 'BB'
}

export enum ConditionType {
  Above = 'above',
  Below = 'below',
  Crosses = 'crosses'
}

export enum OrderType {
  Buy = 'buy',
  Sell = 'sell'
}

// Interfaces with readonly properties for better immutability
export interface IndicatorCondition {
  readonly indicator: IndicatorType;
  readonly condition: ConditionType;
  readonly value: number;
}

export interface RiskManagement {
  readonly stopLoss: number;
  readonly takeProfit: number;
  readonly maxDrawdown: number;
  readonly positionSize: number;
}

export interface StrategyParameters {
  readonly timeframe: TimeFrame;
  readonly entryConditions: ReadonlyArray<IndicatorCondition>;
  readonly exitConditions: ReadonlyArray<IndicatorCondition>;
  readonly riskManagement: RiskManagement;
}

export interface Trade {
  readonly entryTime: Date;
  readonly exitTime: Date;
  readonly entryPrice: number;
  readonly exitPrice: number;
  readonly type: OrderType;
  readonly profit: number;
  readonly volume: number;
}

export interface BacktestResults {
  readonly totalTrades: number;
  readonly winningTrades: number;
  readonly losingTrades: number;
  readonly winRate: number;
  readonly profitFactor: number;
  readonly netProfit: number;
  readonly maxDrawdown: number;
  readonly sharpeRatio: number;
  readonly trades: ReadonlyArray<Trade>;
}

export interface StrategyBacktest {
  readonly startDate: Date;
  readonly endDate: Date;
  readonly results: BacktestResults;
}

export interface StrategyDocument extends Document, IStrategy {
  readonly _id: Types.ObjectId;
  readonly __textScore?: number;
  readonly name: string;
  readonly description: string;
  readonly parameters: StrategyParameters;
  readonly backtest?: StrategyBacktest;
}

const strategySchema = new Schema<StrategyDocument>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  parameters: {
    type: {
      timeframe: { type: String, enum: Object.values(TimeFrame), required: true },
      entryConditions: [{
        indicator: { type: String, enum: Object.values(IndicatorType), required: true },
        condition: { type: String, enum: Object.values(ConditionType), required: true },
        value: { type: Number, required: true }
      }],
      exitConditions: [{
        indicator: { type: String, enum: Object.values(IndicatorType), required: true },
        condition: { type: String, enum: Object.values(ConditionType), required: true },
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
        type: { type: String, enum: Object.values(OrderType), required: true },
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

export async function searchStrategies(query: string): Promise<ReadonlyArray<SearchResult>> {
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
