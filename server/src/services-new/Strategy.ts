import { PrismaClient, Prisma } from '@prisma/client';
import { TechnicalAnalysis } from '../services/TechnicalAnalysis';
import {
  Strategy,
  StrategyParameters,
  CreateStrategyInput,
  UpdateStrategyInput,
  StrategySignal,
  StrategyStats,
  StrategyBacktest,
  SignalType
} from '../types-new/Strategy';
import { MarketDataPoint, MarketData } from '../types-new/MarketData';
import { Position, CreatePositionInput } from '../types-new/Position';

export class StrategyService {
  private prisma: PrismaClient;
  private technicalAnalysis: TechnicalAnalysis;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.technicalAnalysis = new TechnicalAnalysis();
  }

  async create(userId: string, input: CreateStrategyInput): Promise<Strategy> {
    return this.prisma.strategy.create({
      data: {
        name: input.name,
        description: input.description,
        type: input.type,
        parameters: input.parameters as Prisma.JsonValue,
        metadata: input.metadata as Prisma.JsonValue,
        user: {
          connect: { id: userId }
        }
      }
    });
  }

  async update(id: string, input: UpdateStrategyInput): Promise<Strategy> {
    const strategy = await this.prisma.strategy.findUnique({
      where: { id }
    });

    if (!strategy) {
      throw new Error('Strategy not found');
    }

    return this.prisma.strategy.update({
      where: { id },
      data: {
        name: input.name,
        description: input.description,
        type: input.type,
        parameters: input.parameters as Prisma.JsonValue,
        isActive: input.isActive,
        metadata: input.metadata as Prisma.JsonValue
      }
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.strategy.delete({
      where: { id }
    });
  }

  async getById(id: string): Promise<Strategy | null> {
    return this.prisma.strategy.findUnique({
      where: { id },
      include: {
        user: true,
        positions: true
      }
    });
  }

  async getByUserId(userId: string): Promise<Strategy[]> {
    return this.prisma.strategy.findMany({
      where: { userId },
      include: {
        positions: true
      }
    });
  }

  private async analyzeMarketData(
    marketData: MarketDataPoint[],
    parameters: StrategyParameters
  ): Promise<StrategySignal[]> {
    const signals: StrategySignal[] = [];
    const indicators = parameters.indicators;

    if (!indicators) {
      return signals;
    }

    // Analyze MACD
    if (indicators.macd) {
      const macdResults = await this.technicalAnalysis.calculateMACD(
        marketData,
        indicators.macd.fastPeriod,
        indicators.macd.slowPeriod,
        indicators.macd.signalPeriod
      );

      // Generate signals based on MACD crossovers
      for (let i = 1; i < macdResults.length; i++) {
        const prev = macdResults[i - 1];
        const curr = macdResults[i];

        if (prev.histogram < 0 && curr.histogram > 0) {
          signals.push({
            timestamp: new Date(marketData[i].timestamp),
            symbol: parameters.symbols[0], // Assuming single symbol for now
            type: 'LONG',
            price: marketData[i].close,
            confidence: Math.abs(curr.histogram),
            metadata: { indicator: 'MACD', value: curr }
          });
        } else if (prev.histogram > 0 && curr.histogram < 0) {
          signals.push({
            timestamp: new Date(marketData[i].timestamp),
            symbol: parameters.symbols[0],
            type: 'SHORT',
            price: marketData[i].close,
            confidence: Math.abs(curr.histogram),
            metadata: { indicator: 'MACD', value: curr }
          });
        }
      }
    }

    // Analyze RSI
    if (indicators.rsi) {
      const rsiResults = await this.technicalAnalysis.calculateRSI(
        marketData,
        indicators.rsi.period
      );

      for (let i = 0; i < rsiResults.length; i++) {
        const rsi = rsiResults[i];

        if (rsi < indicators.rsi.oversold) {
          signals.push({
            timestamp: new Date(marketData[i].timestamp),
            symbol: parameters.symbols[0],
            type: 'LONG',
            price: marketData[i].close,
            confidence: (indicators.rsi.oversold - rsi) / indicators.rsi.oversold,
            metadata: { indicator: 'RSI', value: rsi }
          });
        } else if (rsi > indicators.rsi.overbought) {
          signals.push({
            timestamp: new Date(marketData[i].timestamp),
            symbol: parameters.symbols[0],
            type: 'SHORT',
            price: marketData[i].close,
            confidence: (rsi - indicators.rsi.overbought) / (100 - indicators.rsi.overbought),
            metadata: { indicator: 'RSI', value: rsi }
          });
        }
      }
    }

    return signals;
  }

  async executeStrategy(id: string, marketData: MarketData): Promise<StrategySignal[]> {
    const strategy = await this.getById(id);
    if (!strategy || !strategy.isActive) {
      throw new Error('Strategy not found or inactive');
    }

    const parameters = strategy.parameters as unknown as StrategyParameters;
    const signals = await this.analyzeMarketData(marketData.data as unknown as MarketDataPoint[], parameters);

    // Update last executed timestamp
    await this.prisma.strategy.update({
      where: { id },
      data: { lastExecuted: new Date() }
    });

    return signals;
  }

  async backtest(
    id: string,
    startDate: Date,
    endDate: Date,
    initialBalance: number
  ): Promise<StrategyBacktest> {
    const strategy = await this.getById(id);
    if (!strategy) {
      throw new Error('Strategy not found');
    }

    const parameters = strategy.parameters as unknown as StrategyParameters;
    const marketData = await this.prisma.marketData.findMany({
      where: {
        symbol: { in: parameters.symbols },
        startTime: { gte: startDate },
        endTime: { lte: endDate }
      }
    });

    let balance = initialBalance;
    const trades: StrategyBacktest['trades'] = [];
    let currentPosition: Position | null = null;

    for (const data of marketData) {
      const signals = await this.analyzeMarketData(
        data.data as unknown as MarketDataPoint[],
        parameters
      );

      for (const signal of signals) {
        if (!currentPosition && (signal.type === 'LONG' || signal.type === 'SHORT')) {
          // Open position
          const size = this.calculatePositionSize(balance, parameters.riskPerTrade || 0.02);
          currentPosition = {
            symbol: signal.symbol,
            type: signal.type,
            entryPrice: signal.price,
            size,
            status: 'OPEN',
            userId: strategy.userId,
            id: '',
            createdAt: signal.timestamp,
            updatedAt: signal.timestamp
          };
        } else if (currentPosition && signal.type === 'CLOSE') {
          // Close position
          const profit = this.calculateProfit(currentPosition, signal.price);
          balance += profit;

          trades.push({
            timestamp: signal.timestamp,
            type: currentPosition.type,
            symbol: currentPosition.symbol,
            price: signal.price,
            size: currentPosition.size,
            profit
          });

          currentPosition = null;
        }
      }
    }

    const performance = this.calculatePerformance(trades, initialBalance);

    return {
      startDate,
      endDate,
      initialBalance,
      finalBalance: balance,
      trades,
      performance
    };
  }

  private calculatePositionSize(balance: number, riskPerTrade: number): number {
    return balance * riskPerTrade;
  }

  private calculateProfit(position: Position, closePrice: number): number {
    const multiplier = position.type === 'LONG' ? 1 : -1;
    return ((closePrice - position.entryPrice) * position.size * multiplier);
  }

  private calculatePerformance(trades: StrategyBacktest['trades'], initialBalance: number): StrategyStats {
    const winningTrades = trades.filter(t => t.profit > 0);
    const losingTrades = trades.filter(t => t.profit <= 0);

    const totalProfit = trades.reduce((sum, t) => sum + (t.profit > 0 ? t.profit : 0), 0);
    const totalLoss = Math.abs(trades.reduce((sum, t) => sum + (t.profit < 0 ? t.profit : 0), 0));

    const returns = trades.map(t => t.profit / initialBalance);
    const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const stdDev = Math.sqrt(
      returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length
    );

    return {
      totalTrades: trades.length,
      winningTrades: winningTrades.length,
      losingTrades: losingTrades.length,
      winRate: winningTrades.length / trades.length,
      profitFactor: totalLoss === 0 ? Infinity : totalProfit / totalLoss,
      sharpeRatio: stdDev === 0 ? 0 : (avgReturn * Math.sqrt(252)) / stdDev,
      maxDrawdown: this.calculateMaxDrawdown(trades),
      averageProfit: winningTrades.length > 0 ? totalProfit / winningTrades.length : 0,
      averageLoss: losingTrades.length > 0 ? totalLoss / losingTrades.length : 0,
      expectancy: (winningTrades.length / trades.length) * (totalProfit / winningTrades.length) -
        (losingTrades.length / trades.length) * (totalLoss / losingTrades.length)
    };
  }

  private calculateMaxDrawdown(trades: StrategyBacktest['trades']): number {
    let peak = 0;
    let maxDrawdown = 0;
    let runningPnL = 0;

    for (const trade of trades) {
      runningPnL += trade.profit;
      
      if (runningPnL > peak) {
        peak = runningPnL;
      }

      const drawdown = (peak - runningPnL) / peak;
      if (drawdown > maxDrawdown) {
        maxDrawdown = drawdown;
      }
    }

    return maxDrawdown;
  }
}
