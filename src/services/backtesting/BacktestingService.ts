import { makeAutoObservable } from 'mobx';
import { MarketDataService } from '../marketData/MarketDataService';
import { Strategy, StrategyParameters } from '../../types/strategy';
import { Trade, Position, OrderType, OrderSide } from '../../types/trading';
import { PerformanceMetrics } from '../analytics/PerformanceAnalyticsService';

export interface BacktestConfig {
  strategy: Strategy;
  parameters: StrategyParameters;
  symbol: string;
  timeframe: string;
  startDate: Date;
  endDate: Date;
  initialBalance: number;
  commission: number;
  slippage: number;
  useSpread: boolean;
}

export interface BacktestResult {
  trades: Trade[];
  positions: Position[];
  metrics: PerformanceMetrics;
  equityCurve: EquityPoint[];
  drawdownCurve: DrawdownPoint[];
  monthlyReturns: MonthlyReturn[];
}

interface EquityPoint {
  timestamp: Date;
  equity: number;
  balance: number;
  drawdown: number;
}

interface DrawdownPoint {
  timestamp: Date;
  drawdown: number;
  duration: number;
}

interface MonthlyReturn {
  year: number;
  month: number;
  return: number;
}

class BacktestingService {
  private marketDataService: MarketDataService;
  private currentTest: BacktestConfig | null = null;
  private testResults: Map<string, BacktestResult> = new Map();
  private isRunning: boolean = false;
  private progress: number = 0;

  constructor(marketDataService: MarketDataService) {
    this.marketDataService = marketDataService;
    makeAutoObservable(this);
  }

  async runBacktest(config: BacktestConfig): Promise<BacktestResult> {
    if (this.isRunning) {
      throw new Error('A backtest is already running');
    }

    this.isRunning = true;
    this.progress = 0;
    this.currentTest = config;

    try {
      // Fetch historical data
      const historicalData = await this.marketDataService.getHistoricalData(
        config.symbol,
        config.timeframe,
        config.startDate,
        config.endDate
      );

      // Initialize backtest state
      let balance = config.initialBalance;
      let equity = config.initialBalance;
      let maxEquity = config.initialBalance;
      const trades: Trade[] = [];
      const positions: Position[] = [];
      const equityCurve: EquityPoint[] = [];
      const drawdownCurve: DrawdownPoint[] = [];
      let currentPosition: Position | null = null;

      // Process each candle
      for (let i = 0; i < historicalData.length; i++) {
        const candle = historicalData[i];
        const timestamp = new Date(candle.timestamp);

        // Update progress
        this.progress = (i / historicalData.length) * 100;

        // Create strategy context
        const context = {
          timestamp,
          price: candle.close,
          balance,
          equity,
          position: currentPosition,
          historicalData: historicalData.slice(0, i + 1)
        };

        // Execute strategy
        const signals = await config.strategy.execute(context, config.parameters);

        // Process signals
        for (const signal of signals) {
          if (!currentPosition && signal.type === 'ENTRY') {
            // Open new position
            const position: Position = {
              id: Math.random().toString(36).substr(2, 9),
              symbol: config.symbol,
              side: signal.side,
              entryPrice: this.calculateEntryPrice(candle, signal.side, config),
              entryTime: timestamp,
              size: this.calculatePositionSize(signal, balance, config),
              stopLoss: signal.stopLoss,
              takeProfit: signal.takeProfit
            };

            currentPosition = position;
            positions.push(position);

          } else if (currentPosition && signal.type === 'EXIT') {
            // Close current position
            const exitPrice = this.calculateExitPrice(candle, currentPosition.side, config);
            const pnl = this.calculatePnL(currentPosition, exitPrice, config);

            const trade: Trade = {
              id: Math.random().toString(36).substr(2, 9),
              positionId: currentPosition.id,
              symbol: config.symbol,
              side: currentPosition.side,
              entryPrice: currentPosition.entryPrice,
              exitPrice: exitPrice,
              size: currentPosition.size,
              profit: pnl,
              commission: this.calculateCommission(currentPosition, config),
              openTime: currentPosition.entryTime,
              closeTime: timestamp
            };

            trades.push(trade);
            balance += pnl;
            currentPosition = null;
          }
        }

        // Update equity and drawdown
        equity = this.calculateEquity(balance, currentPosition, candle.close);
        maxEquity = Math.max(maxEquity, equity);
        const drawdown = ((maxEquity - equity) / maxEquity) * 100;

        equityCurve.push({
          timestamp,
          equity,
          balance,
          drawdown
        });

        drawdownCurve.push({
          timestamp,
          drawdown,
          duration: this.calculateDrawdownDuration(drawdownCurve, drawdown)
        });
      }

      // Calculate final metrics
      const metrics = this.calculateMetrics(trades, config.initialBalance);
      const monthlyReturns = this.calculateMonthlyReturns(equityCurve);

      const result: BacktestResult = {
        trades,
        positions,
        metrics,
        equityCurve,
        drawdownCurve,
        monthlyReturns
      };

      this.testResults.set(this.generateTestId(config), result);
      return result;

    } finally {
      this.isRunning = false;
      this.progress = 100;
      this.currentTest = null;
    }
  }

  private calculateEntryPrice(candle: any, side: OrderSide, config: BacktestConfig): number {
    const spread = config.useSpread ? this.marketDataService.getSpread(config.symbol) : 0;
    const slippage = config.slippage / 100;
    
    if (side === OrderSide.BUY) {
      return candle.close * (1 + spread + slippage);
    } else {
      return candle.close * (1 - slippage);
    }
  }

  private calculateExitPrice(candle: any, side: OrderSide, config: BacktestConfig): number {
    const spread = config.useSpread ? this.marketDataService.getSpread(config.symbol) : 0;
    const slippage = config.slippage / 100;
    
    if (side === OrderSide.BUY) {
      return candle.close * (1 - slippage);
    } else {
      return candle.close * (1 + spread + slippage);
    }
  }

  private calculatePositionSize(signal: any, balance: number, config: BacktestConfig): number {
    // Implement position sizing logic based on signal.risk or signal.size
    return (balance * (signal.risk || 0.01)) / Math.abs(signal.stopLoss - signal.entryPrice);
  }

  private calculatePnL(position: Position, exitPrice: number, config: BacktestConfig): number {
    const pnl = position.side === OrderSide.BUY
      ? (exitPrice - position.entryPrice) * position.size
      : (position.entryPrice - exitPrice) * position.size;
    
    return pnl - this.calculateCommission(position, config);
  }

  private calculateCommission(position: Position, config: BacktestConfig): number {
    return position.size * position.entryPrice * config.commission;
  }

  private calculateEquity(balance: number, position: Position | null, currentPrice: number): number {
    if (!position) return balance;

    const unrealizedPnL = position.side === OrderSide.BUY
      ? (currentPrice - position.entryPrice) * position.size
      : (position.entryPrice - currentPrice) * position.size;

    return balance + unrealizedPnL;
  }

  private calculateDrawdownDuration(drawdownCurve: DrawdownPoint[], currentDrawdown: number): number {
    if (currentDrawdown === 0) return 0;
    
    let duration = 0;
    for (let i = drawdownCurve.length - 1; i >= 0; i--) {
      if (drawdownCurve[i].drawdown === 0) break;
      duration++;
    }
    return duration;
  }

  private calculateMonthlyReturns(equityCurve: EquityPoint[]): MonthlyReturn[] {
    const monthlyReturns: MonthlyReturn[] = [];
    let lastMonthEquity = equityCurve[0].equity;
    let currentMonth = equityCurve[0].timestamp.getMonth();
    let currentYear = equityCurve[0].timestamp.getFullYear();

    equityCurve.forEach(point => {
      const month = point.timestamp.getMonth();
      const year = point.timestamp.getFullYear();

      if (month !== currentMonth || year !== currentYear) {
        monthlyReturns.push({
          year: currentYear,
          month: currentMonth,
          return: (point.equity - lastMonthEquity) / lastMonthEquity * 100
        });

        lastMonthEquity = point.equity;
        currentMonth = month;
        currentYear = year;
      }
    });

    return monthlyReturns;
  }

  private calculateMetrics(trades: Trade[], initialBalance: number): PerformanceMetrics {
    // This should be implemented in the PerformanceAnalyticsService
    // For now, return a basic metrics object
    return {
      totalPnL: trades.reduce((sum, trade) => sum + trade.profit, 0),
      winRate: trades.filter(t => t.profit > 0).length / trades.length,
      averageWin: trades.filter(t => t.profit > 0).reduce((sum, t) => sum + t.profit, 0) / trades.filter(t => t.profit > 0).length,
      averageLoss: Math.abs(trades.filter(t => t.profit < 0).reduce((sum, t) => sum + t.profit, 0)) / trades.filter(t => t.profit < 0).length,
      profitFactor: Math.abs(trades.filter(t => t.profit > 0).reduce((sum, t) => sum + t.profit, 0) / trades.filter(t => t.profit < 0).reduce((sum, t) => sum + t.profit, 0)),
      sharpeRatio: 0, // Implement proper Sharpe ratio calculation
      maxDrawdown: 0, // Implement proper max drawdown calculation
      riskRewardRatio: 0, // Implement proper risk/reward calculation
      tradesPerDay: trades.length / ((trades[trades.length - 1].closeTime.getTime() - trades[0].openTime.getTime()) / (1000 * 60 * 60 * 24))
    };
  }

  private generateTestId(config: BacktestConfig): string {
    return `${config.symbol}_${config.timeframe}_${config.startDate.toISOString()}_${config.endDate.toISOString()}`;
  }

  getTestResults(testId: string): BacktestResult | undefined {
    return this.testResults.get(testId);
  }

  getAllTestResults(): BacktestResult[] {
    return Array.from(this.testResults.values());
  }

  getCurrentProgress(): number {
    return this.progress;
  }

  isBacktestRunning(): boolean {
    return this.isRunning;
  }
}

export const backtestingService = new BacktestingService(MarketDataService.getInstance());
