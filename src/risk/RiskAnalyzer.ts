import { makeAutoObservable } from 'mobx';
import {
  PortfolioRiskMetrics,
  RiskAdjustedMetrics,
  CurrencyRisk
} from './types';
import { Portfolio, Position } from '../types/trading';
import { calculateVolatility, calculateCorrelation } from '../utils/statistics';

export class RiskAnalyzer {
  private historicalData: Map<string, number[]> = new Map();
  private riskMetricsHistory: PortfolioRiskMetrics[] = [];
  
  constructor() {
    makeAutoObservable(this);
  }

  calculateRiskAdjustedMetrics(
    portfolio: Portfolio,
    riskFreeRate: number = 0.02
  ): RiskAdjustedMetrics {
    const returns = this.calculatePortfolioReturns(portfolio);
    const volatility = calculateVolatility(returns);
    const excessReturns = returns.map(r => r - riskFreeRate / 252); // Daily risk-free rate

    return {
      sharpeRatio: this.calculateSharpeRatio(excessReturns, volatility),
      sortinoRatio: this.calculateSortinoRatio(excessReturns),
      informationRatio: this.calculateInformationRatio(returns),
      calmarRatio: this.calculateCalmarRatio(returns),
      maxDrawdown: this.calculateMaxDrawdown(returns),
      recoveryFactor: this.calculateRecoveryFactor(returns),
    };
  }

  analyzeCurrencyRisk(portfolio: Portfolio): CurrencyRisk {
    const currencies = this.extractCurrencies(portfolio);
    const exposures = this.calculateCurrencyExposures(portfolio, currencies);
    const correlations = this.calculateCurrencyCorrelations(currencies);

    return {
      exposureByBase: exposures,
      hedgeRatios: this.calculateHedgeRatios(exposures, correlations),
      correlationMatrix: correlations,
      volatilityImpact: this.calculateVolatilityImpact(exposures, correlations),
    };
  }

  private calculatePortfolioReturns(portfolio: Portfolio): number[] {
    // Implementation needed
    return [];
  }

  private calculateSharpeRatio(excessReturns: number[], volatility: number): number {
    if (volatility === 0) return 0;
    const meanExcessReturn = excessReturns.reduce((a, b) => a + b, 0) / excessReturns.length;
    return meanExcessReturn / volatility * Math.sqrt(252); // Annualized
  }

  private calculateSortinoRatio(excessReturns: number[]): number {
    const negativeReturns = excessReturns.filter(r => r < 0);
    const downside = calculateVolatility(negativeReturns);
    if (downside === 0) return 0;
    
    const meanExcessReturn = excessReturns.reduce((a, b) => a + b, 0) / excessReturns.length;
    return meanExcessReturn / downside * Math.sqrt(252); // Annualized
  }

  private calculateInformationRatio(returns: number[]): number {
    // Implementation needed
    return 0;
  }

  private calculateCalmarRatio(returns: number[]): number {
    const maxDrawdown = this.calculateMaxDrawdown(returns);
    if (maxDrawdown === 0) return 0;
    
    const annualizedReturn = this.calculateAnnualizedReturn(returns);
    return annualizedReturn / maxDrawdown;
  }

  private calculateMaxDrawdown(returns: number[]): number {
    let peak = -Infinity;
    let maxDrawdown = 0;
    let cumReturn = 1;

    for (const r of returns) {
      cumReturn *= (1 + r);
      if (cumReturn > peak) {
        peak = cumReturn;
      }
      const drawdown = (peak - cumReturn) / peak;
      maxDrawdown = Math.max(maxDrawdown, drawdown);
    }

    return maxDrawdown;
  }

  private calculateRecoveryFactor(returns: number[]): number {
    const totalReturn = this.calculateTotalReturn(returns);
    const maxDrawdown = this.calculateMaxDrawdown(returns);
    return maxDrawdown === 0 ? 0 : totalReturn / maxDrawdown;
  }

  private calculateAnnualizedReturn(returns: number[]): number {
    const totalReturn = this.calculateTotalReturn(returns);
    const years = returns.length / 252;
    return Math.pow(1 + totalReturn, 1 / years) - 1;
  }

  private calculateTotalReturn(returns: number[]): number {
    return returns.reduce((acc, r) => acc * (1 + r), 1) - 1;
  }

  private extractCurrencies(portfolio: Portfolio): string[] {
    // Implementation needed
    return [];
  }

  private calculateCurrencyExposures(
    portfolio: Portfolio,
    currencies: string[]
  ): Record<string, number> {
    // Implementation needed
    return {};
  }

  private calculateCurrencyCorrelations(currencies: string[]): number[][] {
    // Implementation needed
    return [];
  }

  private calculateHedgeRatios(
    exposures: Record<string, number>,
    correlations: number[][]
  ): Record<string, number> {
    // Implementation needed
    return {};
  }

  private calculateVolatilityImpact(
    exposures: Record<string, number>,
    correlations: number[][]
  ): number {
    // Implementation needed
    return 0;
  }

  // Public methods for historical data management
  addHistoricalData(symbol: string, data: number[]) {
    this.historicalData.set(symbol, data);
  }

  clearHistoricalData() {
    this.historicalData.clear();
  }

  addRiskMetrics(metrics: PortfolioRiskMetrics) {
    this.riskMetricsHistory.push(metrics);
    // Keep only the last 100 metrics
    if (this.riskMetricsHistory.length > 100) {
      this.riskMetricsHistory.shift();
    }
  }

  getRiskMetricsHistory(): PortfolioRiskMetrics[] {
    return this.riskMetricsHistory;
  }
}
