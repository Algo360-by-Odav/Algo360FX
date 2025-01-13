import { Strategy, Analytics } from '@prisma/client';
import { prisma } from '../config/database';
import { openAIService } from './ai/openai.service';
import { MarketDataService } from './MarketData';

interface StrategyParameters {
  timeframe: string;
  entryConditions: any[];
  exitConditions: any[];
  riskManagement: {
    stopLoss: number;
    takeProfit: number;
    maxDrawdown: number;
    positionSize: number;
  };
  filters: {
    volatility?: number;
    correlation?: number;
    sentiment?: number;
    timeOfDay?: string[];
    newsFilter?: boolean;
  };
}

interface BacktestResult {
  trades: any[];
  metrics: {
    totalTrades: number;
    winRate: number;
    profitFactor: number;
    sharpeRatio: number;
    maxDrawdown: number;
    averageWin: number;
    averageLoss: number;
    expectancy: number;
  };
  equity: { date: string; balance: number }[];
}

interface StrategyAnalysis {
  strategy: Strategy;
  backtestResults: BacktestResult;
  marketAnalysis: any;
  recommendations: string[];
}

export class StrategyService {
  private marketDataService: MarketDataService;

  constructor() {
    this.marketDataService = new MarketDataService();
  }

  private async validateStrategy(parameters: StrategyParameters): Promise<boolean> {
    // Validate timeframe
    const validTimeframes = ['1m', '5m', '15m', '30m', '1h', '4h', '1d'];
    if (!validTimeframes.includes(parameters.timeframe)) {
      throw new Error('Invalid timeframe');
    }

    // Validate entry conditions
    if (!parameters.entryConditions || parameters.entryConditions.length === 0) {
      throw new Error('Entry conditions are required');
    }

    // Validate exit conditions
    if (!parameters.exitConditions || parameters.exitConditions.length === 0) {
      throw new Error('Exit conditions are required');
    }

    // Validate risk management
    const { riskManagement } = parameters;
    if (
      riskManagement.stopLoss <= 0 ||
      riskManagement.takeProfit <= 0 ||
      riskManagement.maxDrawdown <= 0 ||
      riskManagement.positionSize <= 0
    ) {
      throw new Error('Invalid risk management parameters');
    }

    return true;
  }

  public async createStrategy(
    name: string,
    description: string,
    parameters: StrategyParameters
  ): Promise<Strategy> {
    // Validate strategy parameters
    await this.validateStrategy(parameters);

    return prisma.strategy.create({
      data: {
        name,
        description,
        type: 'CUSTOM',
        parameters: parameters as any
      }
    });
  }

  public async getStrategy(strategyId: string): Promise<Strategy | null> {
    return prisma.strategy.findUnique({
      where: { id: strategyId },
      include: {
        analytics: true
      }
    });
  }

  public async updateStrategy(
    strategyId: string,
    data: Partial<Strategy>
  ): Promise<Strategy> {
    return prisma.strategy.update({
      where: { id: strategyId },
      data
    });
  }

  public async deleteStrategy(strategyId: string): Promise<void> {
    await prisma.strategy.delete({
      where: { id: strategyId }
    });
  }

  public async listStrategies(): Promise<Strategy[]> {
    return prisma.strategy.findMany({
      include: {
        analytics: true
      }
    });
  }

  private async runBacktest(
    strategy: Strategy,
    symbol: string,
    startDate: Date,
    endDate: Date
  ): Promise<BacktestResult> {
    const parameters = strategy.parameters as StrategyParameters;
    
    // Get historical market data
    const marketData = await this.marketDataService.getMarketData(
      symbol,
      parameters.timeframe,
      'system'
    );

    // Initialize backtest variables
    const trades: any[] = [];
    let equity = [{ date: startDate.toISOString(), balance: 10000 }]; // Start with 10,000 initial balance
    let position: any = null;
    let balance = 10000;

    // Process each candle
    for (const candle of marketData) {
      const timestamp = new Date(candle.timestamp);
      if (timestamp < startDate || timestamp > endDate) continue;

      // Check entry conditions if not in position
      if (!position) {
        const entrySignal = this.checkEntryConditions(candle, parameters.entryConditions);
        if (entrySignal) {
          position = {
            type: entrySignal.type,
            entryPrice: candle.close,
            entryTime: timestamp,
            stopLoss: this.calculateStopLoss(candle, parameters.riskManagement),
            takeProfit: this.calculateTakeProfit(candle, parameters.riskManagement),
            size: this.calculatePositionSize(balance, parameters.riskManagement)
          };
        }
      }
      // Check exit conditions if in position
      else {
        const shouldExit = this.checkExitConditions(candle, position, parameters.exitConditions);
        if (shouldExit) {
          const profit = this.calculateProfit(position, candle.close);
          balance += profit;
          trades.push({
            ...position,
            exitPrice: candle.close,
            exitTime: timestamp,
            profit
          });
          position = null;
          equity.push({ date: timestamp.toISOString(), balance });
        }
      }
    }

    // Calculate metrics
    const metrics = this.calculateMetrics(trades, equity);

    return {
      trades,
      metrics,
      equity
    };
  }

  private checkEntryConditions(candle: any, conditions: any[]): { type: 'LONG' | 'SHORT' } | null {
    // Implement entry condition logic
    // This is a simplified example
    const lastClose = candle.close;
    const lastHigh = candle.high;
    const lastLow = candle.low;

    for (const condition of conditions) {
      switch (condition.type) {
        case 'PRICE_ABOVE':
          if (lastClose > condition.value) return { type: 'LONG' };
          break;
        case 'PRICE_BELOW':
          if (lastClose < condition.value) return { type: 'SHORT' };
          break;
        // Add more condition types as needed
      }
    }

    return null;
  }

  private checkExitConditions(candle: any, position: any, conditions: any[]): boolean {
    // Implement exit condition logic
    // This is a simplified example
    const lastClose = candle.close;

    // Check stop loss and take profit
    if (position.type === 'LONG') {
      if (lastClose <= position.stopLoss || lastClose >= position.takeProfit) {
        return true;
      }
    } else {
      if (lastClose >= position.stopLoss || lastClose <= position.takeProfit) {
        return true;
      }
    }

    // Check custom exit conditions
    for (const condition of conditions) {
      switch (condition.type) {
        case 'TRAILING_STOP':
          // Implement trailing stop logic
          break;
        case 'TIME_EXIT':
          // Implement time-based exit
          break;
        // Add more exit types as needed
      }
    }

    return false;
  }

  private calculateStopLoss(candle: any, riskManagement: any): number {
    const { stopLoss } = riskManagement;
    return candle.close * (1 - stopLoss);
  }

  private calculateTakeProfit(candle: any, riskManagement: any): number {
    const { takeProfit } = riskManagement;
    return candle.close * (1 + takeProfit);
  }

  private calculatePositionSize(balance: number, riskManagement: any): number {
    const { positionSize } = riskManagement;
    return balance * positionSize;
  }

  private calculateProfit(position: any, exitPrice: number): number {
    const { type, entryPrice, size } = position;
    if (type === 'LONG') {
      return size * (exitPrice - entryPrice) / entryPrice;
    } else {
      return size * (entryPrice - exitPrice) / entryPrice;
    }
  }

  private calculateMetrics(trades: any[], equity: any[]): any {
    const winningTrades = trades.filter(trade => trade.profit > 0);
    const losingTrades = trades.filter(trade => trade.profit < 0);

    const totalTrades = trades.length;
    const winRate = totalTrades > 0 ? winningTrades.length / totalTrades : 0;

    const grossProfit = winningTrades.reduce((sum, trade) => sum + trade.profit, 0);
    const grossLoss = Math.abs(losingTrades.reduce((sum, trade) => sum + trade.profit, 0));
    const profitFactor = grossLoss !== 0 ? grossProfit / grossLoss : grossProfit > 0 ? Infinity : 0;

    const returns = trades.map(trade => trade.profit);
    const averageReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
    const stdDev = Math.sqrt(
      returns.reduce((sum, ret) => sum + Math.pow(ret - averageReturn, 2), 0) / returns.length
    );
    const sharpeRatio = stdDev !== 0 ? averageReturn / stdDev : 0;

    let peak = 0;
    let maxDrawdown = 0;
    for (const point of equity) {
      if (point.balance > peak) {
        peak = point.balance;
      }
      const drawdown = (peak - point.balance) / peak;
      if (drawdown > maxDrawdown) {
        maxDrawdown = drawdown;
      }
    }

    const averageWin = winningTrades.length > 0
      ? winningTrades.reduce((sum, trade) => sum + trade.profit, 0) / winningTrades.length
      : 0;

    const averageLoss = losingTrades.length > 0
      ? Math.abs(losingTrades.reduce((sum, trade) => sum + trade.profit, 0)) / losingTrades.length
      : 0;

    const expectancy = (winRate * averageWin) - ((1 - winRate) * averageLoss);

    return {
      totalTrades,
      winRate,
      profitFactor,
      sharpeRatio,
      maxDrawdown,
      averageWin,
      averageLoss,
      expectancy
    };
  }

  public async analyzeStrategy(
    strategyId: string,
    symbol: string,
    userId: string
  ): Promise<StrategyAnalysis> {
    const strategy = await this.getStrategy(strategyId);
    if (!strategy) throw new Error('Strategy not found');

    // Run backtest
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000); // Last 30 days
    const backtestResults = await this.runBacktest(strategy, symbol, startDate, endDate);

    // Get market analysis
    const marketAnalysis = await this.marketDataService.getMarketAnalysis(symbol, userId);

    // Get AI recommendations
    const analysisData = {
      strategy: strategy.name,
      parameters: strategy.parameters,
      backtestResults,
      marketAnalysis
    };

    const aiAnalysis = await openAIService.generateAnalysis(
      analysisData,
      userId,
      {
        temperature: 0.7,
        maxTokens: 2000,
        useCache: true
      }
    );

    // Parse recommendations from AI analysis
    const recommendations = aiAnalysis
      .split('\n')
      .filter(line => line.trim().startsWith('-') || line.trim().startsWith('*'))
      .map(line => line.trim().replace(/^[-*]\s*/, ''));

    // Save analysis to database
    await prisma.analytics.create({
      data: {
        name: `${strategy.name} Analysis`,
        description: `Analysis for ${strategy.name} on ${symbol}`,
        category: 'STRATEGY',
        type: 'CUSTOM',
        data: analysisData,
        createdBy: userId,
        strategies: {
          connect: { id: strategyId }
        }
      }
    });

    return {
      strategy,
      backtestResults,
      marketAnalysis,
      recommendations
    };
  }
}

export const strategyService = new StrategyService();
export default StrategyService;
