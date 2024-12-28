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
  readonly id: string;
  readonly symbol: string;
  readonly type: OrderType;
  readonly openTime: Date;
  readonly closeTime: Date;
  readonly openPrice: number;
  readonly closePrice: number;
  readonly volume: number;
  readonly profit: number;
  readonly stopLoss: number;
  readonly takeProfit: number;
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
        id: { type: String, required: true },
        symbol: { type: String, required: true },
        type: { type: String, enum: Object.values(OrderType), required: true },
        openTime: { type: Date, required: true },
        closeTime: { type: Date, required: true },
        openPrice: { type: Number, required: true },
        closePrice: { type: Number, required: true },
        volume: { type: Number, required: true },
        profit: { type: Number, required: true },
        stopLoss: { type: Number, required: true },
        takeProfit: { type: Number, required: true }
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

    if (!strategies || !strategies.length) {
      return [];
    }

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

export class StrategyService {
  private async simulateBacktest(strategy: StrategyDocument): Promise<BacktestResults> {
    const results: Partial<BacktestResults> = {
      totalTrades: Math.floor(Math.random() * 100) + 50,
      trades: []
    };

    // Calculate simulated results
    if (!results || !results.totalTrades) {
      return {
        totalTrades: 0,
        winningTrades: 0,
        losingTrades: 0,
        winRate: 0,
        profitFactor: 0,
        netProfit: 0,
        maxDrawdown: 0,
        sharpeRatio: 0,
        trades: []
      };
    }

    const winningTrades = Math.floor(results.totalTrades * 0.6);
    const losingTrades = results.totalTrades - winningTrades;
    const winRate = winningTrades / results.totalTrades;
    const profitFactor = 1.5;
    const netProfit = 10000;
    const maxDrawdown = 2000;
    const sharpeRatio = 1.8;

    // Generate simulated trades
    const trades: Trade[] = [];
    let currentTime = new Date();
    for (let i = 0; i < results.totalTrades; i++) {
      const isWinningTrade = i < winningTrades;
      const trade: Trade = {
        id: `trade-${i}`,
        symbol: strategy.name,
        type: Math.random() > 0.5 ? OrderType.Buy : OrderType.Sell,
        openTime: currentTime,
        closeTime: new Date(currentTime.getTime() + 3600000), // 1 hour later
        openPrice: 1.1000 + Math.random() * 0.0100,
        closePrice: 1.1000 + Math.random() * 0.0100,
        volume: 0.1,
        profit: isWinningTrade ? Math.random() * 100 : -Math.random() * 50,
        stopLoss: 1.0950,
        takeProfit: 1.1050
      };
      trades.push(trade);
      currentTime = new Date(currentTime.getTime() + 3600000);
    }

    Object.assign(results, {
      winningTrades,
      losingTrades,
      winRate,
      profitFactor,
      netProfit,
      maxDrawdown,
      sharpeRatio,
      trades
    });

    return results as BacktestResults;
  }

  public async runBacktest(strategy: StrategyDocument): Promise<StrategyDocument> {
    try {
      const results = await this.simulateBacktest(strategy);
      Object.assign(strategy, { backtest: { startDate: new Date(), endDate: new Date(), results } });
      return strategy.save();
    } catch (error) {
      console.error('Error running backtest:', error);
      throw new Error('Failed to run backtest');
    }
  }
}
