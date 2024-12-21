import { StrategyConfig, TradeSignal } from './AlgoTradingService';
import { MarketTick } from './MarketDataService';

export interface BacktestResult {
  id: string;
  strategyConfig: StrategyConfig;
  performance: {
    totalTrades: number;
    winningTrades: number;
    losingTrades: number;
    winRate: number;
    profitLoss: number;
    sharpeRatio: number;
    maxDrawdown: number;
    maxDrawdownDuration: number;
    averageWin: number;
    averageLoss: number;
    profitFactor: number;
    recoveryFactor: number;
    expectancy: number;
  };
  trades: BacktestTrade[];
  equity: EquityPoint[];
  startDate: number;
  endDate: number;
  symbol: string;
  timeframe: string;
}

export interface BacktestTrade {
  id: string;
  type: 'BUY' | 'SELL';
  entryPrice: number;
  exitPrice: number;
  entryTime: number;
  exitTime: number;
  quantity: number;
  profitLoss: number;
  pips: number;
  stopLoss: number;
  takeProfit: number;
}

export interface EquityPoint {
  timestamp: number;
  equity: number;
  drawdown: number;
}

export interface BacktestOptions {
  startDate: number;
  endDate: number;
  initialCapital: number;
  symbol: string;
  timeframe: string;
}

class BacktestService {
  private static instance: BacktestService;
  private results: Map<string, BacktestResult> = new Map();

  private constructor() {}

  static getInstance(): BacktestService {
    if (!BacktestService.instance) {
      BacktestService.instance = new BacktestService();
    }
    return BacktestService.instance;
  }

  async runBacktest(
    config: StrategyConfig,
    options: BacktestOptions,
    onProgress?: (progress: number) => void
  ): Promise<BacktestResult> {
    try {
      // Simulate fetching historical data
      const historicalData = await this.fetchHistoricalData(
        options.symbol,
        options.startDate,
        options.endDate,
        options.timeframe
      );

      let equity = options.initialCapital;
      const trades: BacktestTrade[] = [];
      const equityPoints: EquityPoint[] = [
        { timestamp: options.startDate, equity, drawdown: 0 },
      ];
      let maxEquity = equity;
      let maxDrawdown = 0;
      let maxDrawdownDuration = 0;
      let currentDrawdownStart = 0;

      let position: {
        type: 'BUY' | 'SELL';
        entryPrice: number;
        entryTime: number;
        quantity: number;
        stopLoss: number;
        takeProfit: number;
      } | null = null;

      // Process each historical data point
      for (let i = 0; i < historicalData.length; i++) {
        const tick = historicalData[i];
        
        // Update progress
        if (onProgress) {
          onProgress((i / historicalData.length) * 100);
        }

        // Check for exit conditions if in position
        if (position) {
          const exitSignal = this.checkExitConditions(tick, position, config);
          if (exitSignal) {
            const trade = this.closePosition(position, tick, equity);
            trades.push(trade);
            equity += trade.profitLoss;
            position = null;

            // Update equity curve and drawdown
            if (equity > maxEquity) {
              maxEquity = equity;
              currentDrawdownStart = 0;
            } else {
              const drawdown = ((maxEquity - equity) / maxEquity) * 100;
              if (drawdown > maxDrawdown) {
                maxDrawdown = drawdown;
                maxDrawdownDuration = tick.timestamp - currentDrawdownStart;
              }
            }

            equityPoints.push({
              timestamp: tick.timestamp,
              equity,
              drawdown: ((maxEquity - equity) / maxEquity) * 100,
            });
          }
        }

        // Check for entry conditions if not in position
        if (!position) {
          const entrySignal = this.checkEntryConditions(tick, config);
          if (entrySignal) {
            position = {
              type: entrySignal.type,
              entryPrice: tick.price,
              entryTime: tick.timestamp,
              quantity: this.calculatePositionSize(equity, config),
              stopLoss: this.calculateStopLoss(entrySignal.type, tick.price, config),
              takeProfit: this.calculateTakeProfit(entrySignal.type, tick.price, config),
            };
          }
        }
      }

      // Calculate performance metrics
      const performance = this.calculatePerformance(trades, options.initialCapital);

      const result: BacktestResult = {
        id: `backtest-${Date.now()}`,
        strategyConfig: config,
        performance,
        trades,
        equity: equityPoints,
        startDate: options.startDate,
        endDate: options.endDate,
        symbol: options.symbol,
        timeframe: options.timeframe,
      };

      this.results.set(result.id, result);
      return result;
    } catch (error) {
      console.error('Backtest failed:', error);
      throw error;
    }
  }

  private async fetchHistoricalData(
    symbol: string,
    startDate: number,
    endDate: number,
    timeframe: string
  ): Promise<MarketTick[]> {
    // Simulate historical data
    const data: MarketTick[] = [];
    let currentTime = startDate;
    const interval = this.getTimeframeInterval(timeframe);

    while (currentTime <= endDate) {
      const price = this.generateRandomPrice(1.0500, 1.0600);
      const spread = 0.00020; // 2 pips spread
      data.push({
        symbol,
        price,
        timestamp: currentTime,
        volume: Math.floor(Math.random() * 1000000),
        bid: price - spread / 2,
        ask: price + spread / 2,
        spread,
      });
      currentTime += interval;
    }

    return data;
  }

  private getTimeframeInterval(timeframe: string): number {
    const intervals: Record<string, number> = {
      '1m': 60 * 1000,
      '5m': 5 * 60 * 1000,
      '15m': 15 * 60 * 1000,
      '1h': 60 * 60 * 1000,
      '4h': 4 * 60 * 60 * 1000,
      '1d': 24 * 60 * 60 * 1000,
    };
    return intervals[timeframe] || intervals['1m'];
  }

  private generateRandomPrice(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  private checkEntryConditions(
    tick: MarketTick,
    config: StrategyConfig
  ): TradeSignal | null {
    // Implement entry condition logic based on config
    return null;
  }

  private checkExitConditions(
    tick: MarketTick,
    position: any,
    config: StrategyConfig
  ): boolean {
    // Implement exit condition logic based on config
    return false;
  }

  private closePosition(
    position: any,
    tick: MarketTick,
    currentEquity: number
  ): BacktestTrade {
    const profitLoss =
      position.type === 'BUY'
        ? (tick.price - position.entryPrice) * position.quantity
        : (position.entryPrice - tick.price) * position.quantity;

    return {
      id: `trade-${Date.now()}-${Math.random()}`,
      type: position.type,
      entryPrice: position.entryPrice,
      exitPrice: tick.price,
      entryTime: position.entryTime,
      exitTime: tick.timestamp,
      quantity: position.quantity,
      profitLoss,
      pips: Math.abs(tick.price - position.entryPrice) * 10000,
      stopLoss: position.stopLoss,
      takeProfit: position.takeProfit,
    };
  }

  private calculatePositionSize(
    equity: number,
    config: StrategyConfig
  ): number {
    return Math.min(
      config.riskManagement.maxPositionSize,
      equity * 0.02 // Risk 2% of equity per trade
    );
  }

  private calculateStopLoss(
    type: 'BUY' | 'SELL',
    price: number,
    config: StrategyConfig
  ): number {
    const stopLossPercent = config.riskManagement.stopLoss / 100;
    return type === 'BUY'
      ? price * (1 - stopLossPercent)
      : price * (1 + stopLossPercent);
  }

  private calculateTakeProfit(
    type: 'BUY' | 'SELL',
    price: number,
    config: StrategyConfig
  ): number {
    const takeProfitPercent = config.riskManagement.takeProfit / 100;
    return type === 'BUY'
      ? price * (1 + takeProfitPercent)
      : price * (1 - takeProfitPercent);
  }

  private calculatePerformance(
    trades: BacktestTrade[],
    initialCapital: number
  ): BacktestResult['performance'] {
    const winningTrades = trades.filter((t) => t.profitLoss > 0);
    const losingTrades = trades.filter((t) => t.profitLoss <= 0);

    const totalProfitLoss = trades.reduce((sum, t) => sum + t.profitLoss, 0);
    const winRate = (winningTrades.length / trades.length) * 100;

    const averageWin =
      winningTrades.reduce((sum, t) => sum + t.profitLoss, 0) /
      winningTrades.length;
    const averageLoss =
      losingTrades.reduce((sum, t) => sum + t.profitLoss, 0) /
      losingTrades.length;

    return {
      totalTrades: trades.length,
      winningTrades: winningTrades.length,
      losingTrades: losingTrades.length,
      winRate,
      profitLoss: totalProfitLoss,
      sharpeRatio: this.calculateSharpeRatio(trades),
      maxDrawdown: this.calculateMaxDrawdown(trades, initialCapital),
      maxDrawdownDuration: this.calculateMaxDrawdownDuration(trades),
      averageWin,
      averageLoss,
      profitFactor: Math.abs(averageWin / averageLoss),
      recoveryFactor: totalProfitLoss / this.calculateMaxDrawdown(trades, initialCapital),
      expectancy: (winRate / 100) * averageWin + (1 - winRate / 100) * averageLoss,
    };
  }

  private calculateSharpeRatio(trades: BacktestTrade[]): number {
    const returns = trades.map((t) => t.profitLoss);
    const meanReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const stdDev = Math.sqrt(
      returns.reduce((sum, r) => sum + Math.pow(r - meanReturn, 2), 0) /
        returns.length
    );
    return meanReturn / stdDev;
  }

  private calculateMaxDrawdown(
    trades: BacktestTrade[],
    initialCapital: number
  ): number {
    let equity = initialCapital;
    let maxEquity = equity;
    let maxDrawdown = 0;

    trades.forEach((trade) => {
      equity += trade.profitLoss;
      maxEquity = Math.max(maxEquity, equity);
      const drawdown = ((maxEquity - equity) / maxEquity) * 100;
      maxDrawdown = Math.max(maxDrawdown, drawdown);
    });

    return maxDrawdown;
  }

  private calculateMaxDrawdownDuration(trades: BacktestTrade[]): number {
    let equity = 0;
    let maxEquity = 0;
    let currentDrawdownStart = 0;
    let maxDrawdownDuration = 0;

    trades.forEach((trade) => {
      equity += trade.profitLoss;
      if (equity > maxEquity) {
        maxEquity = equity;
        currentDrawdownStart = trade.entryTime;
      } else {
        const duration = trade.exitTime - currentDrawdownStart;
        maxDrawdownDuration = Math.max(maxDrawdownDuration, duration);
      }
    });

    return maxDrawdownDuration;
  }

  getResult(id: string): BacktestResult | undefined {
    return this.results.get(id);
  }

  getAllResults(): BacktestResult[] {
    return Array.from(this.results.values());
  }

  deleteResult(id: string): boolean {
    return this.results.delete(id);
  }
}

export default BacktestService;
