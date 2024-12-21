import { Trade } from '../types/trading';

export interface PerformanceMetrics {
  totalTrades: number;
  winRate: number;
  profitFactor: number;
  sharpeRatio: number;
  maxDrawdown: number;
  maxDrawdownDuration: number;
  averageTrade: number;
  averageWin: number;
  averageLoss: number;
  largestWin: number;
  largestLoss: number;
  recoveryFactor: number;
  calmarRatio: number;
  sortinoRatio: number;
  ulcerIndex: number;
  payoffRatio: number;
  profitability: number;
  kellyCriterion: number;
  rSquared: number;
  annualizedReturn: number;
  annualizedVolatility: number;
  informationRatio: number;
  treynorRatio: number;
  omega: number;
}

export class PerformanceMetricsService {
  private static readonly RISK_FREE_RATE = 0.02; // 2% annual risk-free rate
  private static readonly TRADING_DAYS_PER_YEAR = 252;

  calculateMetrics(trades: Trade[], equityCurve: number[]): PerformanceMetrics {
    const returns = this.calculateReturns(equityCurve);
    const winningTrades = trades.filter(t => t.profit > 0);
    const losingTrades = trades.filter(t => t.profit < 0);

    const maxDrawdown = this.calculateMaxDrawdown(equityCurve);
    const sharpeRatio = this.calculateSharpeRatio(returns);
    const sortinoRatio = this.calculateSortinoRatio(returns);
    const profitFactor = this.calculateProfitFactor(trades);

    return {
      totalTrades: trades.length,
      winRate: (winningTrades.length / trades.length) * 100,
      profitFactor,
      sharpeRatio,
      maxDrawdown: maxDrawdown.percentage,
      maxDrawdownDuration: maxDrawdown.duration,
      averageTrade: trades.reduce((sum, t) => sum + t.profit, 0) / trades.length,
      averageWin: winningTrades.reduce((sum, t) => sum + t.profit, 0) / winningTrades.length,
      averageLoss: losingTrades.reduce((sum, t) => sum + t.profit, 0) / losingTrades.length,
      largestWin: Math.max(...trades.map(t => t.profit)),
      largestLoss: Math.min(...trades.map(t => t.profit)),
      recoveryFactor: this.calculateRecoveryFactor(equityCurve, maxDrawdown.percentage),
      calmarRatio: this.calculateCalmarRatio(returns, maxDrawdown.percentage),
      sortinoRatio,
      ulcerIndex: this.calculateUlcerIndex(equityCurve),
      payoffRatio: Math.abs(this.calculatePayoffRatio(winningTrades, losingTrades)),
      profitability: this.calculateProfitability(trades),
      kellyCriterion: this.calculateKellyCriterion(winningTrades, losingTrades),
      rSquared: this.calculateRSquared(returns),
      annualizedReturn: this.calculateAnnualizedReturn(returns),
      annualizedVolatility: this.calculateAnnualizedVolatility(returns),
      informationRatio: this.calculateInformationRatio(returns),
      treynorRatio: this.calculateTreynorRatio(returns),
      omega: this.calculateOmega(returns),
    };
  }

  private calculateReturns(equityCurve: number[]): number[] {
    const returns: number[] = [];
    for (let i = 1; i < equityCurve.length; i++) {
      returns.push((equityCurve[i] - equityCurve[i - 1]) / equityCurve[i - 1]);
    }
    return returns;
  }

  private calculateMaxDrawdown(equityCurve: number[]): { percentage: number; duration: number } {
    let maxDrawdown = 0;
    let maxDrawdownDuration = 0;
    let peak = equityCurve[0];
    let drawdownStart = 0;

    for (let i = 1; i < equityCurve.length; i++) {
      if (equityCurve[i] > peak) {
        peak = equityCurve[i];
        drawdownStart = i;
      }

      const drawdown = (peak - equityCurve[i]) / peak;
      if (drawdown > maxDrawdown) {
        maxDrawdown = drawdown;
        maxDrawdownDuration = i - drawdownStart;
      }
    }

    return { percentage: maxDrawdown * 100, duration: maxDrawdownDuration };
  }

  private calculateSharpeRatio(returns: number[]): number {
    const annualizedReturn = this.calculateAnnualizedReturn(returns);
    const annualizedVolatility = this.calculateAnnualizedVolatility(returns);
    return (annualizedReturn - PerformanceMetricsService.RISK_FREE_RATE) / annualizedVolatility;
  }

  private calculateSortinoRatio(returns: number[]): number {
    const annualizedReturn = this.calculateAnnualizedReturn(returns);
    const downside = returns.filter(r => r < 0);
    const downsideDeviation = Math.sqrt(
      (downside.reduce((sum, r) => sum + r * r, 0) / downside.length) *
        PerformanceMetricsService.TRADING_DAYS_PER_YEAR
    );
    return (annualizedReturn - PerformanceMetricsService.RISK_FREE_RATE) / downsideDeviation;
  }

  private calculateProfitFactor(trades: Trade[]): number {
    const grossProfit = trades.filter(t => t.profit > 0).reduce((sum, t) => sum + t.profit, 0);
    const grossLoss = Math.abs(trades.filter(t => t.profit < 0).reduce((sum, t) => sum + t.profit, 0));
    return grossProfit / grossLoss;
  }

  private calculateRecoveryFactor(equityCurve: number[], maxDrawdown: number): number {
    const totalReturn = (equityCurve[equityCurve.length - 1] - equityCurve[0]) / equityCurve[0];
    return totalReturn / (maxDrawdown / 100);
  }

  private calculateCalmarRatio(returns: number[], maxDrawdown: number): number {
    const annualizedReturn = this.calculateAnnualizedReturn(returns);
    return annualizedReturn / (maxDrawdown / 100);
  }

  private calculateUlcerIndex(equityCurve: number[]): number {
    let sumSquaredDrawdown = 0;
    let peak = equityCurve[0];

    for (let i = 1; i < equityCurve.length; i++) {
      if (equityCurve[i] > peak) {
        peak = equityCurve[i];
      }
      const drawdown = (peak - equityCurve[i]) / peak;
      sumSquaredDrawdown += drawdown * drawdown;
    }

    return Math.sqrt(sumSquaredDrawdown / equityCurve.length) * 100;
  }

  private calculatePayoffRatio(winningTrades: Trade[], losingTrades: Trade[]): number {
    const avgWin = winningTrades.reduce((sum, t) => sum + t.profit, 0) / winningTrades.length;
    const avgLoss = losingTrades.reduce((sum, t) => sum + t.profit, 0) / losingTrades.length;
    return avgWin / Math.abs(avgLoss);
  }

  private calculateProfitability(trades: Trade[]): number {
    const profitableTrades = trades.filter(t => t.profit > 0).length;
    return (profitableTrades / trades.length) * 100;
  }

  private calculateKellyCriterion(winningTrades: Trade[], losingTrades: Trade[]): number {
    const winRate = winningTrades.length / (winningTrades.length + losingTrades.length);
    const avgWin = winningTrades.reduce((sum, t) => sum + t.profit, 0) / winningTrades.length;
    const avgLoss = Math.abs(losingTrades.reduce((sum, t) => sum + t.profit, 0) / losingTrades.length);
    return (winRate * avgWin - (1 - winRate) * avgLoss) / avgWin;
  }

  private calculateRSquared(returns: number[]): number {
    const n = returns.length;
    const x = Array.from({ length: n }, (_, i) => i);
    const y = returns;

    const xMean = x.reduce((a, b) => a + b) / n;
    const yMean = y.reduce((a, b) => a + b) / n;

    const ssxx = x.reduce((a, b) => a + Math.pow(b - xMean, 2), 0);
    const ssyy = y.reduce((a, b) => a + Math.pow(b - yMean, 2), 0);
    const ssxy = x.reduce((a, b, i) => a + (b - xMean) * (y[i] - yMean), 0);

    const r = ssxy / Math.sqrt(ssxx * ssyy);
    return r * r;
  }

  private calculateAnnualizedReturn(returns: number[]): number {
    const totalReturn = returns.reduce((a, b) => (1 + a) * (1 + b) - 1, 0);
    return Math.pow(1 + totalReturn, PerformanceMetricsService.TRADING_DAYS_PER_YEAR / returns.length) - 1;
  }

  private calculateAnnualizedVolatility(returns: number[]): number {
    const variance =
      returns.reduce((sum, r) => sum + Math.pow(r - returns.reduce((a, b) => a + b) / returns.length, 2), 0) /
      (returns.length - 1);
    return Math.sqrt(variance * PerformanceMetricsService.TRADING_DAYS_PER_YEAR);
  }

  private calculateInformationRatio(returns: number[]): number {
    const excessReturns = returns.map(r => r - PerformanceMetricsService.RISK_FREE_RATE / PerformanceMetricsService.TRADING_DAYS_PER_YEAR);
    const trackingError = Math.sqrt(
      excessReturns.reduce((sum, r) => sum + Math.pow(r, 2), 0) / (excessReturns.length - 1) *
        PerformanceMetricsService.TRADING_DAYS_PER_YEAR
    );
    return this.calculateAnnualizedReturn(returns) / trackingError;
  }

  private calculateTreynorRatio(returns: number[]): number {
    const beta = this.calculateBeta(returns);
    return (this.calculateAnnualizedReturn(returns) - PerformanceMetricsService.RISK_FREE_RATE) / beta;
  }

  private calculateBeta(returns: number[]): number {
    // Simplified beta calculation using SPY as market proxy
    // In a real implementation, you would need market data
    return 1.0; // Placeholder
  }

  private calculateOmega(returns: number[], threshold = 0): number {
    const gains = returns.filter(r => r > threshold).reduce((sum, r) => sum + (r - threshold), 0);
    const losses = returns.filter(r => r <= threshold).reduce((sum, r) => sum + (threshold - r), 0);
    return gains / losses;
  }
}
