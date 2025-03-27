import { makeAutoObservable } from 'mobx';
import { RootStore } from './rootStore';

export interface StrategyPerformance {
  name: string;
  performance: number;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Medium-High';
}

export interface PerformanceMetrics {
  totalReturn: number;
  ytdReturn: number;
  sharpeRatio: number;
  sharpeRatio3M: number;
  maxDrawdown: number;
  maxDrawdown1Y: number;
  winRate: number;
  winRateMTD: number;
}

export interface RiskAnalysis {
  valueAtRisk: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  beta: number;
  betaLevel: 'Low' | 'Medium' | 'High';
  volatility: number;
  volatilityLevel: 'Low' | 'Medium' | 'High';
  correlation: number;
  correlationLevel: 'Low' | 'Medium' | 'High';
}

export interface AssetAllocation {
  assetClass: string;
  current: number;
  target: number;
  difference: number;
  actionRequired: 'Buy' | 'Sell' | 'Hold';
  amount?: number;
}

export interface TradingStatistics {
  totalTrades: number;
  tradesChange: number;
  winRate: number;
  winRateChange: number;
  averageProfit: number;
  averageProfitChange: number;
  averageLoss: number;
  averageLossChange: number;
}

export interface Trade {
  date: string;
  pair: string;
  type: 'BUY' | 'SELL';
  entry: number;
  exit: number;
  profitLoss: number;
}

export interface MoneyManagerMetrics {
  accountBalance: number;
  equity: number;
  marginLevel: number;
  marginUtilization: number;
  dailyPnL: number;
  weeklyPnL: number;
  monthlyPnL: number;
  maxDrawdown: number;
  floatingPnL: number;
  riskPerTrade: number;
}

export interface RiskParameters {
  maxRiskPerTrade: number;
  maxDailyLoss: number;
  maxDrawdown: number;
  targetRiskRewardRatio: number;
  maxMarginUtilization: number;
  maxPositionsPerCurrency: number;
  maxCorrelatedPositions: number;
  stopLossRequired: boolean;
  takeProfitRequired: boolean;
}

export interface PositionSizeCalculation {
  recommendedPositionSize: number;
  recommendedLotSize: number;
  maxLotSize: number;
  marginRequired: number;
  potentialLoss: number;
  riskRewardRatio: number;
}

export interface TradeReport {
  id: string;
  date: string;
  pair: string;
  type: 'BUY' | 'SELL';
  entry: number;
  exit: number;
  profitLoss: number;
  pips: number;
  volume: number;
  commission: number;
  swap: number;
  duration: string;
  strategy: string;
}

export interface PerformanceReport {
  period: string;
  totalTrades: number;
  winRate: number;
  profitFactor: number;
  sharpeRatio: number;
  maxDrawdown: number;
  netProfit: number;
  grossProfit: number;
  grossLoss: number;
  averageWin: number;
  averageLoss: number;
  largestWin: number;
  largestLoss: number;
  averageDuration: string;
  profitablePairs: { pair: string; profit: number }[];
}

export interface RiskReport {
  date: string;
  valueAtRisk: number;
  marginUtilization: number;
  exposureByPair: { pair: string; exposure: number }[];
  correlations: { pair1: string; pair2: string; correlation: number }[];
  volatility: number;
  beta: number;
  sharpeRatio: number;
  sortinoRatio: number;
}

export class MoneyManagerStore {
  metrics: MoneyManagerMetrics = {
    accountBalance: 0,
    equity: 0,
    marginLevel: 0,
    marginUtilization: 0,
    dailyPnL: 0,
    weeklyPnL: 0,
    monthlyPnL: 0,
    maxDrawdown: 0,
    floatingPnL: 0,
    riskPerTrade: 0,
  };

  strategies: StrategyPerformance[] = [
    { name: 'Conservative', performance: 5.2, riskLevel: 'Low' },
    { name: 'Balanced', performance: 7.8, riskLevel: 'Medium' },
    { name: 'Aggressive', performance: 12.4, riskLevel: 'High' },
    { name: 'Forex Focus', performance: 9.6, riskLevel: 'Medium-High' },
  ];

  performanceMetrics: PerformanceMetrics = {
    totalReturn: 15.8,
    ytdReturn: 2.3,
    sharpeRatio: 1.85,
    sharpeRatio3M: 0.12,
    maxDrawdown: -5.2,
    maxDrawdown1Y: -1.1,
    winRate: 68,
    winRateMTD: 3,
  };

  riskAnalysis: RiskAnalysis = {
    valueAtRisk: 125000,
    riskLevel: 'Medium',
    beta: 0.85,
    betaLevel: 'Low',
    volatility: 12.5,
    volatilityLevel: 'Medium',
    correlation: 0.65,
    correlationLevel: 'Low',
  };

  assetAllocation: AssetAllocation[] = [
    { assetClass: 'Forex', current: 40, target: 45, difference: -5, actionRequired: 'Buy', amount: 35000 },
    { assetClass: 'Stocks', current: 30, target: 25, difference: 5, actionRequired: 'Sell', amount: 25000 },
    { assetClass: 'Crypto', current: 15, target: 15, difference: 0, actionRequired: 'Hold' },
    { assetClass: 'Commodities', current: 15, target: 15, difference: 0, actionRequired: 'Hold' },
  ];

  tradingStats: TradingStatistics = {
    totalTrades: 156,
    tradesChange: 12,
    winRate: 68,
    winRateChange: 3,
    averageProfit: 850,
    averageProfitChange: 5,
    averageLoss: 320,
    averageLossChange: -2,
  };

  recentTrades: Trade[] = [
    { date: '2024-12-23', pair: 'EUR/USD', type: 'BUY', entry: 1.0950, exit: 1.0980, profitLoss: 300 },
    { date: '2024-12-23', pair: 'GBP/JPY', type: 'SELL', entry: 186.50, exit: 186.20, profitLoss: 3450 },
    { date: '2024-12-22', pair: 'USD/JPY', type: 'BUY', entry: 142.30, exit: 142.10, profitLoss: -200 },
    { date: '2024-12-22', pair: 'AUD/USD', type: 'SELL', entry: 0.6750, exit: 0.6720, profitLoss: 600 },
  ];

  riskParameters: RiskParameters = {
    maxRiskPerTrade: 2,
    maxDailyLoss: 5,
    maxDrawdown: 20,
    targetRiskRewardRatio: 2,
    maxMarginUtilization: 50,
    maxPositionsPerCurrency: 2,
    maxCorrelatedPositions: 3,
    stopLossRequired: true,
    takeProfitRequired: true,
  };

  tradeReports: TradeReport[] = [
    {
      id: '1',
      date: '2024-12-23',
      pair: 'EUR/USD',
      type: 'BUY',
      entry: 1.0950,
      exit: 1.0980,
      profitLoss: 300,
      pips: 30,
      volume: 1,
      commission: 7,
      swap: -2,
      duration: '4h 30m',
      strategy: 'Trend Following',
    },
    {
      id: '2',
      date: '2024-12-23',
      pair: 'GBP/JPY',
      type: 'SELL',
      entry: 186.50,
      exit: 186.20,
      profitLoss: 3450,
      pips: 30,
      volume: 5,
      commission: 15,
      swap: 3,
      duration: '2h 15m',
      strategy: 'Breakout',
    },
  ];

  performanceReports: PerformanceReport[] = [
    {
      period: 'December 2024',
      totalTrades: 156,
      winRate: 68,
      profitFactor: 2.3,
      sharpeRatio: 1.85,
      maxDrawdown: -5.2,
      netProfit: 12500,
      grossProfit: 18900,
      grossLoss: -6400,
      averageWin: 850,
      averageLoss: 320,
      largestWin: 3450,
      largestLoss: -1200,
      averageDuration: '3h 45m',
      profitablePairs: [
        { pair: 'EUR/USD', profit: 5200 },
        { pair: 'GBP/JPY', profit: 4100 },
        { pair: 'USD/JPY', profit: 3200 },
      ],
    },
  ];

  riskReports: RiskReport[] = [
    {
      date: '2024-12-23',
      valueAtRisk: 125000,
      marginUtilization: 15.5,
      exposureByPair: [
        { pair: 'EUR/USD', exposure: 250000 },
        { pair: 'GBP/JPY', exposure: 180000 },
        { pair: 'USD/JPY', exposure: 150000 },
      ],
      correlations: [
        { pair1: 'EUR/USD', pair2: 'GBP/USD', correlation: 0.85 },
        { pair1: 'USD/JPY', pair2: 'EUR/JPY', correlation: 0.72 },
      ],
      volatility: 12.5,
      beta: 0.85,
      sharpeRatio: 1.85,
      sortinoRatio: 2.1,
    },
  ];

  error: string | null = null;

  constructor(private rootStore: RootStore) {
    makeAutoObservable(this);
  }

  updateMetrics = async () => {
    try {
      const { brokerStore } = this.rootStore;
      // Get the first broker's account info
      const accountInfo = Array.from(brokerStore.accountInfo.values())[0];
      
      if (!accountInfo) {
        throw new Error('No broker account information available');
      }

      const positions = Array.from(brokerStore.positions.values())[0] || [];
      const floatingPnL = positions.reduce((sum, pos) => sum + (pos.unrealizedPnL || 0), 0);

      // Update metrics based on account info
      this.metrics = {
        accountBalance: accountInfo.balance || 0,
        equity: (accountInfo.balance || 0) + floatingPnL,
        marginLevel: accountInfo.margin?.level || 0,
        marginUtilization: accountInfo.margin ? (accountInfo.margin.used / accountInfo.margin.available) * 100 : 0,
        dailyPnL: this.calculateDailyPnL(),
        weeklyPnL: this.calculateWeeklyPnL(),
        monthlyPnL: this.calculateMonthlyPnL(),
        maxDrawdown: this.calculateMaxDrawdown(),
        floatingPnL,
        riskPerTrade: this.calculateRiskPerTrade(),
      };
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Failed to update metrics';
    }
  };

  calculatePositionSize = (
    symbol: string,
    entryPrice: number,
    stopLoss: number,
    takeProfit: number
  ): PositionSizeCalculation => {
    const { accountBalance } = this.metrics;
    const maxRiskAmount = (accountBalance * this.riskParameters.maxRiskPerTrade) / 100;
    const pipValue = this.calculatePipValue(symbol);
    const pipsAtRisk = Math.abs(entryPrice - stopLoss) / pipValue;
    const positionSize = maxRiskAmount / pipsAtRisk;
    const lotSize = positionSize / 100000; // Standard lot = 100,000 units
    const marginRequired = this.calculateMarginRequired(symbol, positionSize);
    const potentialLoss = pipsAtRisk * pipValue * positionSize;
    const riskRewardRatio = Math.abs(takeProfit - entryPrice) / Math.abs(stopLoss - entryPrice);

    return {
      recommendedPositionSize: positionSize,
      recommendedLotSize: lotSize,
      maxLotSize: this.calculateMaxLotSize(symbol),
      marginRequired,
      potentialLoss,
      riskRewardRatio,
    };
  };

  validateTrade = (
    symbol: string,
    orderType: 'buy' | 'sell',
    size: number,
    entryPrice: number,
    stopLoss: number | null,
    takeProfit: number | null
  ): { isValid: boolean; reasons: string[] } => {
    const reasons: string[] = [];

    // Check stop loss and take profit requirements
    if (this.riskParameters.stopLossRequired && !stopLoss) {
      reasons.push('Stop Loss is required');
    }

    if (this.riskParameters.takeProfitRequired && !takeProfit) {
      reasons.push('Take Profit is required');
    }

    // Check risk/reward ratio
    if (stopLoss && takeProfit) {
      const rr = Math.abs(takeProfit - entryPrice) / Math.abs(stopLoss - entryPrice);
      if (rr < this.riskParameters.targetRiskRewardRatio) {
        reasons.push(`Risk/Reward ratio (${rr.toFixed(2)}) is below target (${this.riskParameters.targetRiskRewardRatio})`);
      }
    }

    // Check margin utilization
    const marginRequired = this.calculateMarginRequired(symbol, size);
    const newMarginUtilization = ((this.metrics.marginUtilization * this.metrics.accountBalance / 100) + marginRequired) / this.metrics.accountBalance * 100;
    if (newMarginUtilization > this.riskParameters.maxMarginUtilization) {
      reasons.push(`Margin utilization (${newMarginUtilization.toFixed(2)}%) exceeds maximum (${this.riskParameters.maxMarginUtilization}%)`);
    }

    // Check daily loss limit
    if (this.metrics.dailyPnL < -(this.metrics.accountBalance * this.riskParameters.maxDailyLoss / 100)) {
      reasons.push('Daily loss limit reached');
    }

    // Check drawdown limit
    if (this.metrics.maxDrawdown > this.riskParameters.maxDrawdown) {
      reasons.push(`Maximum drawdown limit (${this.riskParameters.maxDrawdown}%) exceeded`);
    }

    // Check position limits
    const positions = Array.from(this.rootStore.brokerStore.positions.values())[0] || [];
    const symbolPositions = positions.filter(p => p.symbol === symbol);
    if (symbolPositions.length >= this.riskParameters.maxPositionsPerCurrency) {
      reasons.push(`Maximum positions per currency (${this.riskParameters.maxPositionsPerCurrency}) reached`);
    }

    return {
      isValid: reasons.length === 0,
      reasons,
    };
  };

  private calculateDailyPnL(): number {
    const positions = Array.from(this.rootStore.brokerStore.positions.values())[0] || [];
    return positions.reduce((sum, pos) => sum + (pos.dailyPnL || 0), 0);
  }

  private calculateWeeklyPnL(): number {
    const positions = Array.from(this.rootStore.brokerStore.positions.values())[0] || [];
    return positions.reduce((sum, pos) => sum + (pos.weeklyPnL || 0), 0);
  }

  private calculateMonthlyPnL(): number {
    const positions = Array.from(this.rootStore.brokerStore.positions.values())[0] || [];
    return positions.reduce((sum, pos) => sum + (pos.monthlyPnL || 0), 0);
  }

  private calculateMaxDrawdown(): number {
    // This would need historical equity data from the broker
    // For now, return current drawdown from peak
    const { equity, accountBalance } = this.metrics;
    const drawdown = ((accountBalance - equity) / accountBalance) * 100;
    return Math.max(0, drawdown);
  }

  private calculateRiskPerTrade(): number {
    return (this.metrics.accountBalance * this.riskParameters.maxRiskPerTrade) / 100;
  }

  private calculatePipValue(symbol: string): number {
    // Get pip value from broker's market data
    const marketData = Array.from(this.rootStore.brokerStore.marketData.values())[0]?.get(symbol);
    return marketData?.pipValue || 0.0001; // Default for most forex pairs
  }

  private calculateMarginRequired(symbol: string, positionSize: number): number {
    // Get margin requirement from broker's market data
    const marketData = Array.from(this.rootStore.brokerStore.marketData.values())[0]?.get(symbol);
    return positionSize * (marketData?.marginRequirement || 0.01); // Default 1% margin requirement
  }

  private calculateMaxLotSize(symbol: string): number {
    // Get max lot size from broker's market data
    const marketData = Array.from(this.rootStore.brokerStore.marketData.values())[0]?.get(symbol);
    return marketData?.maxLotSize || 100; // Default max lot size
  }

  getStrategyPerformance = () => {
    return this.strategies;
  };

  getPerformanceMetrics = () => {
    return this.performanceMetrics;
  };

  getRiskAnalysis = () => {
    return this.riskAnalysis;
  };

  getAssetAllocation = () => {
    return this.assetAllocation;
  };

  getTradingStatistics = () => {
    return this.tradingStats;
  };

  getRecentTrades = () => {
    return this.recentTrades;
  };

  getDailyTradingActivity = () => {
    // Simulated daily trading activity data
    return {
      trades: [35, 28, 42, 30, 38],
      profit: [2000, 500, 3500, 1500, 2500],
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    };
  };

  getPortfolioPerformance = () => {
    // Simulated portfolio performance data
    return {
      portfolio: [100, 102, 105, 108, 110, 115],
      benchmark: [100, 101, 103, 105, 106, 108],
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    };
  };

  getTradeReports = () => {
    return this.tradeReports;
  };

  getPerformanceReports = () => {
    return this.performanceReports;
  };

  getRiskReports = () => {
    return this.riskReports;
  };

  clearError = () => {
    this.error = null;
  };
}
