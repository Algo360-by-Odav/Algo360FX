import { makeAutoObservable, runInAction } from 'mobx';
import { RootStore } from './rootStore';
import dayjs from 'dayjs';

export interface RiskMetrics {
  currentDrawdown: number;
  maxDrawdown: number;
  sharpeRatio: number;
  sortinoRatio: number;
  valueAtRisk: number;
  expectedShortfall: number;
  marginUtilization: number;
  leverageUtilization: number;
  correlationScore: number;
  volatilityScore: number;
}

export interface PositionSizing {
  accountBalance: number;
  availableMargin: number;
  usedMargin: number;
  openPositions: number;
  maxAllowedPositions: number;
  averagePositionSize: number;
  largestPosition: number;
  riskPerTrade: number;
  dailyLossLimit: number;
  remainingDailyLimit: number;
}

export class RiskManagementStore {
  rootStore: RootStore;
  riskMetrics: RiskMetrics = {
    currentDrawdown: 0,
    maxDrawdown: 0,
    sharpeRatio: 0,
    sortinoRatio: 0,
    valueAtRisk: 0,
    expectedShortfall: 0,
    marginUtilization: 0,
    leverageUtilization: 0,
    correlationScore: 0,
    volatilityScore: 0,
  };

  positionSizing: PositionSizing = {
    accountBalance: 100000, // Initial balance
    availableMargin: 100000,
    usedMargin: 0,
    openPositions: 0,
    maxAllowedPositions: 5,
    averagePositionSize: 0,
    largestPosition: 0,
    riskPerTrade: 1000,
    dailyLossLimit: 2000,
    remainingDailyLimit: 2000,
  };

  equityCurveData: Array<{ date: string; equity: number; drawdown: number }> = [];
  isLoading: boolean = false;
  error: string | null = null;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
    this.initializeData();
  }

  private async initializeData() {
    await this.updateRiskMetrics();
    await this.updatePositionSizing();
    await this.updateEquityCurve();
  }

  async updateRiskMetrics() {
    try {
      const { positions, tradeHistory } = this.rootStore.tradingStore;
      
      // Calculate current drawdown
      const currentEquity = this.calculateCurrentEquity();
      const peakEquity = Math.max(...this.equityCurveData.map(d => d.equity));
      const currentDrawdown = ((currentEquity - peakEquity) / peakEquity) * 100;
      
      // Calculate max drawdown from trade history
      const maxDrawdown = this.calculateMaxDrawdown(tradeHistory);
      
      // Calculate Sharpe and Sortino ratios
      const returns = this.calculateReturns(tradeHistory);
      const { sharpeRatio, sortinoRatio } = this.calculateRiskAdjustedReturns(returns);
      
      // Calculate margin utilization
      const marginUtilization = (this.positionSizing.usedMargin / this.positionSizing.accountBalance) * 100;
      
      // Calculate position correlation
      const correlationScore = this.calculatePositionCorrelation(positions);
      
      // Calculate volatility score
      const volatilityScore = this.calculateVolatilityScore(tradeHistory);
      
      runInAction(() => {
        this.riskMetrics = {
          currentDrawdown,
          maxDrawdown,
          sharpeRatio,
          sortinoRatio,
          valueAtRisk: this.calculateValueAtRisk(),
          expectedShortfall: this.calculateExpectedShortfall(),
          marginUtilization,
          leverageUtilization: marginUtilization / 100,
          correlationScore,
          volatilityScore,
        };
      });
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : 'Failed to update risk metrics';
      });
    }
  }

  async updatePositionSizing() {
    try {
      const { positions } = this.rootStore.tradingStore;
      
      const openPositions = positions.length;
      const usedMargin = positions.reduce((sum, pos) => sum + (pos.quantity * pos.currentPrice), 0);
      const availableMargin = this.positionSizing.accountBalance - usedMargin;
      const averagePositionSize = openPositions > 0 ? usedMargin / openPositions : 0;
      const largestPosition = Math.max(...positions.map(pos => pos.quantity * pos.currentPrice), 0);
      
      // Calculate remaining daily limit
      const todayLosses = this.calculateTodayLosses();
      const remainingDailyLimit = Math.max(0, this.positionSizing.dailyLossLimit - todayLosses);
      
      runInAction(() => {
        this.positionSizing = {
          ...this.positionSizing,
          availableMargin,
          usedMargin,
          openPositions,
          averagePositionSize,
          largestPosition,
          remainingDailyLimit,
        };
      });
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : 'Failed to update position sizing';
      });
    }
  }

  async updateEquityCurve() {
    try {
      const { tradeHistory } = this.rootStore.tradingStore;
      
      // Group trades by day and calculate cumulative equity
      const equityCurve = this.calculateEquityCurve(tradeHistory);
      
      runInAction(() => {
        this.equityCurveData = equityCurve;
      });
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : 'Failed to update equity curve';
      });
    }
  }

  async emergencyCloseAllPositions() {
    try {
      const { positions } = this.rootStore.tradingStore;
      
      // Close all positions
      for (const position of positions) {
        await this.rootStore.tradingStore.closePosition(position.symbol);
      }
      
      // Update risk metrics and position sizing
      await this.updateRiskMetrics();
      await this.updatePositionSizing();
      
      return true;
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : 'Failed to close positions';
      });
      throw error;
    }
  }

  // Helper methods for calculations
  private calculateCurrentEquity(): number {
    const { positions } = this.rootStore.tradingStore;
    const unrealizedPnL = positions.reduce((sum, pos) => sum + pos.pnl, 0);
    return this.positionSizing.accountBalance + unrealizedPnL;
  }

  private calculateMaxDrawdown(trades: Array<any>): number {
    let peak = 0;
    let maxDrawdown = 0;
    let runningPnL = 0;

    trades.forEach(trade => {
      runningPnL += trade.pnl || 0;
      peak = Math.max(peak, runningPnL);
      const drawdown = ((peak - runningPnL) / peak) * 100;
      maxDrawdown = Math.max(maxDrawdown, drawdown);
    });

    return -maxDrawdown;
  }

  private calculateReturns(trades: Array<any>): number[] {
    const dailyReturns: number[] = [];
    let currentDay = '';
    let dailyPnL = 0;

    trades.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
      .forEach(trade => {
        const tradeDay = dayjs(trade.timestamp).format('YYYY-MM-DD');
        
        if (currentDay && currentDay !== tradeDay) {
          dailyReturns.push(dailyPnL / this.positionSizing.accountBalance);
          dailyPnL = 0;
        }
        
        dailyPnL += trade.pnl || 0;
        currentDay = tradeDay;
      });

    return dailyReturns;
  }

  private calculateRiskAdjustedReturns(returns: number[]) {
    const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const stdDev = Math.sqrt(returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length);
    const negativeReturns = returns.filter(r => r < 0);
    const downDev = Math.sqrt(negativeReturns.reduce((sum, r) => sum + Math.pow(r, 2), 0) / negativeReturns.length);

    return {
      sharpeRatio: stdDev !== 0 ? (avgReturn / stdDev) * Math.sqrt(252) : 0,
      sortinoRatio: downDev !== 0 ? (avgReturn / downDev) * Math.sqrt(252) : 0,
    };
  }

  private calculatePositionCorrelation(positions: Array<any>): number {
    if (positions.length < 2) return 0;

    // Simplified correlation calculation based on position sides
    const longs = positions.filter(p => p.side === 'long').length;
    const shorts = positions.filter(p => p.side === 'short').length;
    
    return Math.abs(longs - shorts) / positions.length;
  }

  private calculateVolatilityScore(trades: Array<any>): number {
    const returns = this.calculateReturns(trades);
    const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length;
    
    return Math.sqrt(variance * 252); // Annualized volatility
  }

  private calculateTodayLosses(): number {
    const { tradeHistory } = this.rootStore.tradingStore;
    const today = dayjs().format('YYYY-MM-DD');
    
    return tradeHistory
      .filter(trade => dayjs(trade.timestamp).format('YYYY-MM-DD') === today && (trade.pnl || 0) < 0)
      .reduce((sum, trade) => sum + Math.abs(trade.pnl || 0), 0);
  }

  private calculateEquityCurve(trades: Array<any>) {
    const equityCurve: Array<{ date: string; equity: number; drawdown: number }> = [];
    let runningEquity = this.positionSizing.accountBalance;
    let peak = runningEquity;

    // Group trades by day
    const tradesByDay = trades.reduce((acc: { [key: string]: number }, trade) => {
      const day = dayjs(trade.timestamp).format('YYYY-MM-DD');
      acc[day] = (acc[day] || 0) + (trade.pnl || 0);
      return acc;
    }, {});

    // Create equity curve with drawdown
    Object.entries(tradesByDay).sort().forEach(([date, pnl]) => {
      runningEquity += pnl;
      peak = Math.max(peak, runningEquity);
      const drawdown = ((peak - runningEquity) / peak) * 100;

      equityCurve.push({
        date,
        equity: runningEquity,
        drawdown: -drawdown,
      });
    });

    return equityCurve;
  }

  private calculateValueAtRisk(): number {
    const { positions } = this.rootStore.tradingStore;
    const portfolioValue = positions.reduce((sum, pos) => sum + Math.abs(pos.quantity * pos.currentPrice), 0);
    const holdingPeriod = 1; // 1 day
    
    // Calculate historical volatility
    const volatility = this.calculateVolatilityScore(this.rootStore.tradingStore.tradeHistory);
    
    // VaR = Portfolio Value * Volatility * Square root of time horizon * Z-score
    const zScore = 1.645; // Z-score for 95% confidence level
    return portfolioValue * volatility * Math.sqrt(holdingPeriod) * zScore;
  }

  private calculateExpectedShortfall(): number {
    const var95 = this.calculateValueAtRisk();
    // Expected Shortfall (CVaR) is typically 20-30% higher than VaR
    return var95 * 1.25;
  }
}
