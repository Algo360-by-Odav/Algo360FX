import { makeAutoObservable, runInAction } from 'mobx';
import { RootStore } from './RootStore';
import {
  Trade,
  TradeAnalytics,
  PerformanceMetrics,
  TimeFrame,
  JournalEntry,
  EquityCurve,
} from '../types/trading';

export class AnalyticsStore {
  private tradeHistory: Trade[] = [];
  private journalEntries: Map<string, JournalEntry> = new Map();
  private equityCurve: EquityCurve[] = [];
  private performanceCache: Map<string, PerformanceMetrics> = new Map();
  private tradeAnalyticsCache: Map<string, TradeAnalytics> = new Map();
  private marketConditionsCache: Map<string, { condition: string; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache duration
  loading: boolean = false;
  error: string | null = null;

  constructor(private rootStore: RootStore) {
    makeAutoObservable(this, {
      tradeHistory: true,
      journalEntries: true,
      equityCurve: true,
      performanceCache: false,
      tradeAnalyticsCache: false,
      marketConditionsCache: false,
    });

    // Set up periodic cache cleanup
    setInterval(() => this.cleanupCaches(), this.CACHE_DURATION);
  }

  private cleanupCaches() {
    const now = Date.now();

    // Cleanup market conditions cache
    for (const [key, value] of this.marketConditionsCache.entries()) {
      if (now - value.timestamp > this.CACHE_DURATION) {
        this.marketConditionsCache.delete(key);
      }
    }

    // Clear analytics cache if it's too old
    if (this.performanceCache.size > 1000) {
      this.performanceCache.clear();
    }
  }

  // Trade Analytics
  analyzeTrade(trade: Trade): TradeAnalytics {
    const cacheKey = `${trade.id}_${trade.exitTime || 'open'}`;

    // Return cached analysis if available
    if (this.tradeAnalyticsCache.has(cacheKey)) {
      return this.tradeAnalyticsCache.get(cacheKey)!;
    }

    const analysis = {
      holdingPeriod: this.calculateHoldingPeriod(trade),
      riskRewardRatio: this.calculateRiskRewardRatio(trade),
      pnlPercentage: this.calculatePnLPercentage(trade),
      marketConditions: this.analyzeMarketConditions(trade),
      entryQuality: this.analyzeEntryQuality(trade),
      exitQuality: this.analyzeExitQuality(trade),
      executionSpeed: this.analyzeExecutionSpeed(trade),
      slippage: this.calculateSlippage(trade),
    };

    // Cache the analysis
    this.tradeAnalyticsCache.set(cacheKey, analysis);
    return analysis;
  }

  private analyzeMarketConditions(trade: Trade): string {
    const cacheKey = `${trade.symbol}_${trade.entryTime}`;

    // Check cache first
    const cached = this.marketConditionsCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.condition;
    }

    // Perform market analysis
    const volatility = this.rootStore.marketStore.calculateVolatility(trade.symbol);
    const trend = this.rootStore.marketStore.calculateTrend(trade.symbol);
    const volume = this.rootStore.marketStore.calculateVolume(trade.symbol);

    let condition = 'neutral';

    if (volatility > 0.2) {
      condition = volume > 1.5 ? 'trending' : 'choppy';
    } else {
      condition = trend > 0.7 ? 'trending' : 'ranging';
    }

    // Cache the result
    this.marketConditionsCache.set(cacheKey, {
      condition,
      timestamp: Date.now(),
    });

    return condition;
  }

  // Performance Metrics with batch processing
  calculatePerformanceMetrics(timeframe: TimeFrame = 'ALL'): PerformanceMetrics {
    const cacheKey = `metrics_${timeframe}`;
    if (this.performanceCache.has(cacheKey)) {
      return this.performanceCache.get(cacheKey)!;
    }

    const trades = this.filterTradesByTimeframe(timeframe);

    // Batch process trades for all metrics at once
    const { winningTrades, losingTrades, totalPnL } = trades.reduce((acc, trade) => {
      if (trade.pnl > 0) {
        acc.winningTrades.push(trade);
        acc.totalPnL += trade.pnl;
      } else if (trade.pnl < 0) {
        acc.losingTrades.push(trade);
        acc.totalPnL += trade.pnl;
      }
      return acc;
    }, {
      winningTrades: [] as Trade[],
      losingTrades: [] as Trade[],
      totalPnL: 0
    });

    const metrics = {
      totalPnL,
      winRate: this.calculateWinRate(trades),
      profitFactor: this.calculateProfitFactor(winningTrades, losingTrades),
      sharpeRatio: this.calculateSharpeRatioOptimized(trades.map(t => t.pnl)),
      maxDrawdown: this.calculateMaxDrawdownOptimized(trades)
    };

    this.performanceCache.set(cacheKey, metrics);
    return metrics;
  }

  private calculateProfitFactor(winningTrades: Trade[], losingTrades: Trade[]): number {
    const grossProfit = winningTrades.reduce((sum, trade) => sum + trade.pnl, 0);
    const grossLoss = Math.abs(losingTrades.reduce((sum, trade) => sum + trade.pnl, 0));
    return grossLoss === 0 ? grossProfit : grossProfit / grossLoss;
  }

  private calculateWinRate(trades: Trade[]): number {
    if (trades.length === 0) return 0;
    const winningTrades = trades.filter((trade) => trade.pnl > 0);
    return (winningTrades.length / trades.length) * 100;
  }

  private calculateSharpeRatioOptimized(returns: number[]): number {
    if (returns.length < 2) return 0;

    const avgReturn = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
    const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - avgReturn, 2), 0) / (returns.length - 1);
    const stdDev = Math.sqrt(variance);

    return stdDev === 0 ? 0 : (avgReturn / stdDev) * Math.sqrt(252);
  }

  private calculateMaxDrawdownOptimized(trades: Trade[]): number {
    let peak = 0;
    let maxDrawdown = 0;
    let runningPnL = 0;

    for (const trade of trades) {
      runningPnL += trade.pnl;
      peak = Math.max(peak, runningPnL);
      maxDrawdown = Math.max(maxDrawdown, peak - runningPnL);
    }

    return maxDrawdown;
  }

  // Journal Management
  addJournalEntry(tradeId: string, entry: JournalEntry) {
    this.journalEntries.set(tradeId, entry);
  }

  getJournalEntry(tradeId: string): JournalEntry | undefined {
    return this.journalEntries.get(tradeId);
  }

  updateJournalEntry(tradeId: string, updates: Partial<JournalEntry>) {
    const currentEntry = this.journalEntries.get(tradeId);
    if (currentEntry) {
      this.journalEntries.set(tradeId, { ...currentEntry, ...updates });
    }
  }

  // Equity Curve Management
  updateEquityCurve(point: EquityCurve) {
    this.equityCurve.push(point);
  }

  getEquityCurve(timeframe: TimeFrame = 'ALL'): EquityCurve[] {
    return this.filterEquityCurveByTimeframe(timeframe);
  }

  private filterEquityCurveByTimeframe(timeframe: TimeFrame): EquityCurve[] {
    if (timeframe === 'ALL') return this.equityCurve;

    const now = new Date();
    const startDate = new Date();

    switch (timeframe) {
      case 'DAY':
        startDate.setDate(now.getDate() - 1);
        break;
      case 'WEEK':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'MONTH':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'YEAR':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    return this.equityCurve.filter((point) => new Date(point.timestamp) >= startDate);
  }

  // Data Management
  addTrade(trade: Trade) {
    this.tradeHistory.push(trade);
    this.performanceCache.clear(); // Clear cache when new trade is added
    this.updateEquityCurve({
      timestamp: new Date().toISOString(),
      equity: this.rootStore.tradeStore.balance,
      drawdown: this.rootStore.riskManagementStore.currentRiskMetrics.currentDrawdown,
    });
  }

  clearCache() {
    this.performanceCache.clear();
  }

  private calculateHoldingPeriod(trade: Trade): number {
    if (!trade.exitTime) return 0;
    return (new Date(trade.exitTime).getTime() - new Date(trade.entryTime).getTime()) / (1000 * 60); // in minutes
  }

  private calculateRiskRewardRatio(trade: Trade): number {
    const risk = Math.abs(trade.entryPrice - trade.stopLoss);
    const reward = Math.abs(trade.entryPrice - trade.takeProfit);
    return risk === 0 ? 0 : reward / risk;
  }

  private calculatePnLPercentage(trade: Trade): number {
    if (!trade.exitPrice) return 0;
    const direction = trade.side === 'buy' ? 1 : -1;
    return direction * ((trade.exitPrice - trade.entryPrice) / trade.entryPrice) * 100;
  }

  private analyzeEntryQuality(trade: Trade): number {
    // Score entry quality based on various factors (0-100)
    let score = 100;

    // Check if entry was in the direction of the trend
    const trend = this.analyzeMarketConditions(trade);
    if ((trend === 'trending' && trade.side === 'buy') || (trend === 'ranging' && trade.side === 'sell')) {
      score -= 20;
    }

    // Check entry volatility
    const volatility = this.rootStore.marketStore.calculateVolatility(trade.symbol);
    if (volatility > 0.2) score -= 10; // High volatility entry

    // Check spread at entry
    const spread = this.rootStore.marketStore.calculateSpread(trade.symbol);
    if (spread > 0.0003) score -= 10; // High spread entry

    return Math.max(0, score);
  }

  private analyzeExitQuality(trade: Trade): number {
    if (!trade.exitPrice) return 0;

    // Score exit quality based on various factors (0-100)
    let score = 100;

    // Check if exit captured majority of the move
    const potentialMove = trade.side === 'buy'
      ? Math.max(trade.exitPrice, trade.takeProfit) - trade.entryPrice
      : trade.entryPrice - Math.min(trade.exitPrice, trade.takeProfit);

    const capturedMove = trade.side === 'buy'
      ? trade.exitPrice - trade.entryPrice
      : trade.entryPrice - trade.exitPrice;

    const moveCapture = capturedMove / potentialMove;
    score *= moveCapture;

    return Math.max(0, score);
  }

  private analyzeExecutionSpeed(trade: Trade): number {
    // Calculate execution speed and slippage (0-100 score)
    const targetSpeed = 100; // milliseconds
    const actualSpeed = trade.executionTime || targetSpeed;
    return Math.min(100, (targetSpeed / actualSpeed) * 100);
  }

  private calculateSlippage(trade: Trade): number {
    return Math.abs(trade.requestedPrice - trade.entryPrice) / trade.requestedPrice * 100;
  }

  private filterTradesByTimeframe(timeframe: TimeFrame): Trade[] {
    if (timeframe === 'ALL') return this.tradeHistory;

    const now = new Date();
    const startDate = new Date();

    switch (timeframe) {
      case 'DAY':
        startDate.setDate(now.getDate() - 1);
        break;
      case 'WEEK':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'MONTH':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'YEAR':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    return this.tradeHistory.filter((trade) => new Date(trade.entryTime) >= startDate);
  }
}
