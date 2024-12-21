import { makeAutoObservable, runInAction } from 'mobx';
import {
  PortfolioRiskMetrics,
  RiskAlert,
  RiskMonitorConfig,
  RiskLimits,
  DynamicRiskParams
} from './types';
import { Portfolio } from '../types/trading';
import { calculateVolatility, calculateCorrelation } from '../utils/statistics';

export class RiskMonitor {
  private config: RiskMonitorConfig;
  private riskLimits: RiskLimits;
  private alerts: RiskAlert[] = [];
  private updateTimer: NodeJS.Timer | null = null;
  
  public currentRiskMetrics: PortfolioRiskMetrics | null = null;
  public dynamicParams: DynamicRiskParams | null = null;
  public isMonitoring: boolean = false;
  public lastUpdate: number = 0;

  constructor(config: RiskMonitorConfig) {
    this.config = config;
    this.riskLimits = config.riskLimits;
    makeAutoObservable(this);
  }

  startMonitoring(portfolio: Portfolio) {
    if (this.isMonitoring) return;
    
    this.updateRiskMetrics(portfolio);
    this.updateTimer = setInterval(() => {
      this.updateRiskMetrics(portfolio);
    }, this.config.updateInterval);
    
    runInAction(() => {
      this.isMonitoring = true;
    });
  }

  stopMonitoring() {
    if (this.updateTimer) {
      clearInterval(this.updateTimer);
      this.updateTimer = null;
    }
    runInAction(() => {
      this.isMonitoring = false;
    });
  }

  private updateRiskMetrics(portfolio: Portfolio) {
    try {
      const metrics = this.calculatePortfolioRiskMetrics(portfolio);
      const dynamicParams = this.updateDynamicRiskParams(portfolio, metrics);
      
      runInAction(() => {
        this.currentRiskMetrics = metrics;
        this.dynamicParams = dynamicParams;
        this.lastUpdate = Date.now();
      });

      this.checkRiskLimits(metrics);
    } catch (error) {
      console.error('Error updating risk metrics:', error);
      this.addAlert({
        severity: 'critical',
        type: 'exposure',
        threshold: 0,
        currentValue: 0,
        timestamp: Date.now(),
      });
    }
  }

  private calculatePortfolioRiskMetrics(portfolio: Portfolio): PortfolioRiskMetrics {
    const returns = this.calculatePortfolioReturns(portfolio);
    const volatility = calculateVolatility(returns);
    const correlations = this.calculateCorrelationMatrix(portfolio);
    
    return {
      volatility,
      valueAtRisk: this.calculateVaR(returns, 0.95),
      expectedShortfall: this.calculateExpectedShortfall(returns, 0.95),
      beta: this.calculatePortfolioBeta(portfolio),
      correlations,
      drawdown: this.calculateDrawdown(portfolio),
    };
  }

  private updateDynamicRiskParams(
    portfolio: Portfolio,
    metrics: PortfolioRiskMetrics
  ): DynamicRiskParams {
    const marketCondition = this.determineMarketCondition(metrics);
    const adjustmentFactor = this.calculateAdjustmentFactor(marketCondition);

    return {
      marketVolatility: metrics.volatility,
      tradingPerformance: this.calculateTradingPerformance(portfolio),
      marketCondition,
      adjustmentFactor,
    };
  }

  private checkRiskLimits(metrics: PortfolioRiskMetrics) {
    if (metrics.drawdown.current > this.riskLimits.maxDrawdown) {
      this.addAlert({
        severity: 'high',
        type: 'drawdown',
        threshold: this.riskLimits.maxDrawdown,
        currentValue: metrics.drawdown.current,
        timestamp: Date.now(),
      });
    }

    // Add more risk limit checks as needed
  }

  private addAlert(alert: RiskAlert) {
    runInAction(() => {
      this.alerts.push(alert);
      // Keep only the latest 100 alerts
      if (this.alerts.length > 100) {
        this.alerts.shift();
      }
    });
  }

  // Helper methods for risk calculations
  private calculatePortfolioReturns(portfolio: Portfolio): number[] {
    // Implementation needed
    return [];
  }

  private calculateVaR(returns: number[], confidence: number): number {
    // Implementation needed
    return 0;
  }

  private calculateExpectedShortfall(returns: number[], confidence: number): number {
    // Implementation needed
    return 0;
  }

  private calculatePortfolioBeta(portfolio: Portfolio): number {
    // Implementation needed
    return 0;
  }

  private calculateCorrelationMatrix(portfolio: Portfolio): Matrix {
    // Implementation needed
    return [];
  }

  private calculateDrawdown(portfolio: Portfolio) {
    // Implementation needed
    return {
      current: 0,
      maximum: 0,
      duration: 0,
    };
  }

  private determineMarketCondition(metrics: PortfolioRiskMetrics): 'normal' | 'volatile' | 'crisis' {
    // Implementation needed
    return 'normal';
  }

  private calculateAdjustmentFactor(marketCondition: 'normal' | 'volatile' | 'crisis'): number {
    // Implementation needed
    return 1;
  }

  private calculateTradingPerformance(portfolio: Portfolio): number {
    // Implementation needed
    return 0;
  }

  // Public methods for external access
  getAlerts(): RiskAlert[] {
    return this.alerts;
  }

  getRiskMetrics(): PortfolioRiskMetrics | null {
    return this.currentRiskMetrics;
  }

  getDynamicParams(): DynamicRiskParams | null {
    return this.dynamicParams;
  }
}
