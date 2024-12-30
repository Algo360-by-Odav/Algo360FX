import { makeAutoObservable, runInAction } from 'mobx';
import { AlgoTradingService, StrategyConfig, TradeSignal } from '@/services/AlgoTradingService';
import { RootStore } from './RootStore';

export interface Strategy {
  id: string;
  config: StrategyConfig;
  status: 'running' | 'stopped' | 'error';
  lastSignal?: TradeSignal;
  performance: {
    totalTrades: number;
    winningTrades: number;
    losingTrades: number;
    profitLoss: number;
  };
}

export interface BacktestResult {
  strategyName: string;
  metrics: {
    totalReturn: number;
    sharpeRatio: number;
    maxDrawdown: number;
    winRate: number;
    profitFactor: number;
    recoveryFactor: number;
    sortinoRatio: number;
    calmarRatio: number;
  };
  equityCurve: { timestamp: number; value: number }[];
}

export interface Trade {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  side: 'LONG' | 'SHORT';
  openTime: Date;
  openPrice: number;
  closeTime: Date;
  closePrice: number;
  size: number;
  commission: number;
  slippage: number;
  profit: number;
  entryPrice: number;
  exitPrice: number;
}

export class AlgoTradingStore {
  strategies: Map<string, Strategy> = new Map();
  activeSymbols: Set<string> = new Set();
  private algoTradingService: AlgoTradingService;

  constructor(private rootStore: RootStore) {
    makeAutoObservable(this);
    this.algoTradingService = AlgoTradingService.getInstance();
  }

  startStrategy(config: StrategyConfig) {
    try {
      const strategyId = this.algoTradingService.startStrategy(config, 
        (signal) => this.handleTradeSignal(signal));

      runInAction(() => {
        this.strategies.set(strategyId, {
          id: strategyId,
          config,
          status: 'running',
          performance: {
            totalTrades: 0,
            winningTrades: 0,
            losingTrades: 0,
            profitLoss: 0
          }
        });
        this.activeSymbols.add(config.symbol);
      });

      this.rootStore.notificationStore.addNotification({
        type: 'success',
        title: 'Strategy Started',
        message: `Successfully started strategy for ${config.symbol}`
      });

      return strategyId;
    } catch (error) {
      this.rootStore.notificationStore.addNotification({
        type: 'error',
        title: 'Strategy Error',
        message: `Failed to start strategy: ${error.message}`
      });
      throw error;
    }
  }

  stopStrategy(strategyId: string) {
    try {
      const strategy = this.strategies.get(strategyId);
      if (!strategy) return;

      this.algoTradingService.stopStrategy(strategyId);

      runInAction(() => {
        strategy.status = 'stopped';
        this.strategies.set(strategyId, strategy);
        
        // Remove symbol from active symbols if no other strategy is using it
        if (![...this.strategies.values()].some(
          s => s.status === 'running' && s.config.symbol === strategy.config.symbol
        )) {
          this.activeSymbols.delete(strategy.config.symbol);
        }
      });

      this.rootStore.notificationStore.addNotification({
        type: 'info',
        title: 'Strategy Stopped',
        message: `Successfully stopped strategy for ${strategy.config.symbol}`
      });
    } catch (error) {
      this.rootStore.notificationStore.addNotification({
        type: 'error',
        title: 'Strategy Error',
        message: `Failed to stop strategy: ${error.message}`
      });
      throw error;
    }
  }

  private handleTradeSignal(signal: TradeSignal) {
    // Find the strategy that generated this signal
    const strategy = [...this.strategies.values()].find(
      s => s.config.symbol === signal.symbol && s.status === 'running'
    );

    if (!strategy) return;

    runInAction(() => {
      strategy.lastSignal = signal;
      
      // Update strategy performance
      if (strategy.lastSignal) {
        const pnl = this.calculatePnL(signal, strategy.lastSignal);
        strategy.performance.totalTrades++;
        if (pnl > 0) {
          strategy.performance.winningTrades++;
        } else if (pnl < 0) {
          strategy.performance.losingTrades++;
        }
        strategy.performance.profitLoss += pnl;
      }

      this.strategies.set(strategy.id, strategy);
    });

    // Notify user of trade signal
    this.rootStore.notificationStore.addNotification({
      type: 'info',
      title: 'Trade Signal',
      message: `${signal.type} signal for ${signal.symbol} at ${signal.price}`
    });
  }

  private calculatePnL(currentSignal: TradeSignal, previousSignal: TradeSignal): number {
    if (currentSignal.type === 'SELL' && previousSignal.type === 'BUY') {
      return (currentSignal.price - previousSignal.price) * currentSignal.quantity;
    } else if (currentSignal.type === 'BUY' && previousSignal.type === 'SELL') {
      return (previousSignal.price - currentSignal.price) * currentSignal.quantity;
    }
    return 0;
  }

  stopAllStrategies() {
    this.algoTradingService.stopAllStrategies();
    runInAction(() => {
      this.strategies.forEach(strategy => {
        strategy.status = 'stopped';
      });
      this.activeSymbols.clear();
    });
  }

  get runningStrategies(): Strategy[] {
    return [...this.strategies.values()].filter(s => s.status === 'running');
  }

  get totalProfitLoss(): number {
    return [...this.strategies.values()].reduce(
      (total, strategy) => total + strategy.performance.profitLoss, 
      0
    );
  }

  getBacktestResults(): BacktestResult[] {
    // Convert strategies to backtest results
    return Array.from(this.strategies.values()).map(strategy => ({
      strategyName: strategy.id,
      metrics: {
        totalReturn: strategy.performance.profitLoss / this.rootStore.portfolioStore.initialBalance,
        sharpeRatio: this.calculateSharpeRatio(strategy),
        maxDrawdown: this.calculateMaxDrawdown(strategy),
        winRate: strategy.performance.winningTrades / strategy.performance.totalTrades,
        profitFactor: this.calculateProfitFactor(strategy),
        recoveryFactor: this.calculateRecoveryFactor(strategy),
        sortinoRatio: this.calculateSortinoRatio(strategy),
        calmarRatio: this.calculateCalmarRatio(strategy),
      },
      equityCurve: this.getEquityCurve(strategy),
    }));
  }

  private calculateSharpeRatio(strategy: Strategy): number {
    const returns = this.getDailyReturns(strategy);
    if (returns.length === 0) return 0;

    const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const riskFreeRate = 0.02 / 252; // Assuming 2% annual risk-free rate
    const excessReturns = returns.map(r => r - riskFreeRate);
    const stdDev = Math.sqrt(
      excessReturns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / (returns.length - 1)
    );

    return stdDev === 0 ? 0 : (avgReturn - riskFreeRate) / stdDev * Math.sqrt(252);
  }

  private calculateMaxDrawdown(strategy: Strategy): number {
    const equityCurve = this.getEquityCurve(strategy);
    if (equityCurve.length === 0) return 0;

    let maxDrawdown = 0;
    let peak = equityCurve[0].value;

    for (const point of equityCurve) {
      if (point.value > peak) {
        peak = point.value;
      }
      const drawdown = (peak - point.value) / peak;
      maxDrawdown = Math.max(maxDrawdown, drawdown);
    }

    return maxDrawdown;
  }

  private calculateProfitFactor(strategy: Strategy): number {
    const trades = this.getTrades(strategy);
    const grossProfit = trades
      .filter(t => t.profit > 0)
      .reduce((sum, t) => sum + t.profit, 0);
    const grossLoss = Math.abs(
      trades
        .filter(t => t.profit < 0)
        .reduce((sum, t) => sum + t.profit, 0)
    );

    return grossLoss === 0 ? grossProfit : grossProfit / grossLoss;
  }

  private calculateRecoveryFactor(strategy: Strategy): number {
    const maxDrawdown = this.calculateMaxDrawdown(strategy);
    if (maxDrawdown === 0) return 0;

    const totalReturn = strategy.performance.profitLoss / this.rootStore.portfolioStore.initialBalance;
    return totalReturn / maxDrawdown;
  }

  private calculateSortinoRatio(strategy: Strategy): number {
    const returns = this.getDailyReturns(strategy);
    if (returns.length === 0) return 0;

    const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const riskFreeRate = 0.02 / 252; // Assuming 2% annual risk-free rate
    const negativeReturns = returns.filter(r => r < riskFreeRate);
    
    if (negativeReturns.length === 0) return 0;

    const downside = Math.sqrt(
      negativeReturns.reduce((sum, r) => sum + Math.pow(r - riskFreeRate, 2), 0) / negativeReturns.length
    );

    return downside === 0 ? 0 : (avgReturn - riskFreeRate) / downside * Math.sqrt(252);
  }

  private calculateCalmarRatio(strategy: Strategy): number {
    const maxDrawdown = this.calculateMaxDrawdown(strategy);
    if (maxDrawdown === 0) return 0;

    const returns = this.getDailyReturns(strategy);
    if (returns.length === 0) return 0;

    const annualReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length * 252;
    return annualReturn / maxDrawdown;
  }

  private getEquityCurve(strategy: Strategy): { timestamp: number; value: number }[] {
    const trades = this.getTrades(strategy);
    if (trades.length === 0) return [];

    const equity = this.rootStore.portfolioStore.initialBalance;
    const curve: { timestamp: number; value: number }[] = [
      { timestamp: trades[0].openTime.getTime(), value: equity }
    ];

    let currentEquity = equity;
    for (const trade of trades) {
      currentEquity += trade.profit - trade.commission - trade.slippage;
      curve.push({
        timestamp: trade.closeTime.getTime(),
        value: currentEquity
      });
    }

    return curve;
  }

  private getDailyReturns(strategy: Strategy): number[] {
    const equityCurve = this.getEquityCurve(strategy);
    if (equityCurve.length < 2) return [];

    const returns: number[] = [];
    for (let i = 1; i < equityCurve.length; i++) {
      const dailyReturn = (equityCurve[i].value - equityCurve[i-1].value) / equityCurve[i-1].value;
      returns.push(dailyReturn);
    }

    return returns;
  }

  private getTrades(strategy: Strategy): Trade[] {
    // Convert trade signals to Trade objects
    const trades: Trade[] = [];
    let openTrade: Partial<Trade> | null = null;
    let tradeId = 1;

    for (const signal of strategy.lastSignal ? [strategy.lastSignal] : []) {
      if (signal.type === 'ENTRY' && !openTrade) {
        openTrade = {
          id: `${strategy.id}-${tradeId++}`,
          symbol: strategy.config.symbol,
          type: signal.direction === 'LONG' ? 'BUY' : 'SELL',
          side: signal.direction,
          openTime: new Date(signal.timestamp),
          openPrice: signal.price,
          size: strategy.config.positionSize || 1,
          commission: 0,
          slippage: 0
        };
      } else if (signal.type === 'EXIT' && openTrade) {
        trades.push({
          ...openTrade,
          closeTime: new Date(signal.timestamp),
          closePrice: signal.price,
          profit: openTrade.type === 'BUY' 
            ? (signal.price - openTrade.openPrice) * openTrade.size
            : (openTrade.openPrice - signal.price) * openTrade.size,
          entryPrice: openTrade.openPrice,
          exitPrice: signal.price
        } as Trade);
        openTrade = null;
      }
    }

    return trades;
  }
}
