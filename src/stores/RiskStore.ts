import { makeAutoObservable, runInAction } from 'mobx';
import { RootStore } from './RootStore';
import {
  PortfolioRiskMetrics,
  RiskAlert,
  CurrencyRisk,
  RiskLimits,
  RiskMonitorConfig,
} from '../risk/types';
import {
  calculateVolatility,
  calculateHistoricalVaR,
  calculateExpectedShortfall,
  calculateBeta,
  calculateDrawdownMetrics,
  calculateCorrelationMatrix,
  calculateEWMA,
} from '../utils/statistics';
import { Matrix, createMatrix } from '../utils/matrix';

export class RiskStore {
  private monitoringInterval: NodeJS.Timer | null = null;
  metrics: PortfolioRiskMetrics = {
    volatility: 0,
    valueAtRisk: 0,
    expectedShortfall: 0,
    beta: 0,
    correlations: [],
    drawdown: {
      current: 0,
      maximum: 0,
      duration: 0,
    },
  };

  currencyRisk: CurrencyRisk = {
    exposureByBase: {},
    hedgeRatios: {},
    correlationMatrix: [],
    volatilityImpact: 0,
  };

  private returns: number[] = [];
  private alerts: RiskAlert[] = [];
  private historicalMetrics: PortfolioRiskMetrics[] = [];

  constructor(private rootStore: RootStore) {
    makeAutoObservable(this);
  }

  startMonitoring = () => {
    if (!this.monitoringInterval) {
      this.refreshMetrics();
      this.monitoringInterval = setInterval(this.refreshMetrics, 5000); // Update every 5 seconds
    }
  };

  stopMonitoring = () => {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
  };

  refreshMetrics = async () => {
    try {
      // Get latest portfolio data
      const positions = this.rootStore.tradeStore.positions;
      const balance = this.rootStore.tradeStore.balance;
      const equity = this.rootStore.tradeStore.equity;

      // Calculate returns
      const newReturn = (equity - balance) / balance;
      this.returns.push(newReturn);
      if (this.returns.length > 252) { // Keep 1 year of daily returns
        this.returns.shift();
      }

      // Calculate portfolio metrics
      const portfolioMetrics = await this.calculatePortfolioMetrics();
      const currencyRiskData = await this.calculateCurrencyRisk();

      runInAction(() => {
        this.metrics = portfolioMetrics;
        this.currencyRisk = currencyRiskData;
        this.historicalMetrics.push(portfolioMetrics);
        
        // Keep last 24 hours of data (assuming 5-second updates)
        if (this.historicalMetrics.length > 17280) {
          this.historicalMetrics.shift();
        }

        this.checkAlerts();
      });
    } catch (error) {
      console.error('Error refreshing risk metrics:', error);
    }
  };

  private calculatePortfolioMetrics = async (): Promise<PortfolioRiskMetrics> => {
    const positions = this.rootStore.tradeStore.positions;
    const balance = this.rootStore.tradeStore.balance;
    const marketReturns = this.rootStore.marketStore.getMarketReturns();

    // Calculate volatility using EWMA for more responsive estimates
    const volatility = calculateVolatility(calculateEWMA(this.returns, 0.94));
    
    // Calculate Value at Risk and Expected Shortfall
    const valueAtRisk = calculateHistoricalVaR(this.returns, 0.95, balance);
    const expectedShortfall = calculateExpectedShortfall(this.returns, 0.95, balance);
    
    // Calculate beta against market returns
    const beta = calculateBeta(this.returns, marketReturns);
    
    // Calculate drawdown metrics
    const drawdownMetrics = calculateDrawdownMetrics(this.returns);
    
    // Calculate position correlations
    const positionReturns = positions.map(p => p.returns);
    const correlations = calculateCorrelationMatrix(positionReturns);

    return {
      volatility,
      valueAtRisk,
      expectedShortfall,
      beta,
      correlations,
      drawdown: {
        current: drawdownMetrics.currentDrawdown,
        maximum: drawdownMetrics.maxDrawdown,
        duration: drawdownMetrics.duration,
      },
    };
  };

  private calculateCurrencyRisk = async (): Promise<CurrencyRisk> => {
    const positions = this.rootStore.tradeStore.positions;
    const currencies = [...new Set(positions.map(p => p.symbol.split('/')[0]))];
    
    // Calculate exposure by base currency
    const exposureByBase = currencies.reduce((acc, curr) => {
      const exposure = positions
        .filter(p => p.symbol.startsWith(curr + '/'))
        .reduce((sum, p) => sum + Math.abs(p.notionalValue), 0);
      return { ...acc, [curr]: exposure };
    }, {});

    // Calculate currency correlations
    const currencyReturns = currencies.map(curr =>
      positions
        .filter(p => p.symbol.startsWith(curr + '/'))
        .map(p => p.returns)
        .flat()
    );
    const correlationMatrix = calculateCorrelationMatrix(currencyReturns);

    // Calculate hedge ratios based on exposures and correlations
    const hedgeRatios = currencies.reduce((acc, curr) => {
      const exposure = exposureByBase[curr] || 0;
      const totalExposure = Object.values(exposureByBase).reduce((sum: number, val: number) => sum + val, 0);
      const hedgeRatio = totalExposure > 0 ? exposure / totalExposure : 0;
      return { ...acc, [curr]: hedgeRatio };
    }, {});

    // Calculate volatility impact
    const volatilityImpact = calculateVolatility(
      Object.values(exposureByBase).map(exp => exp / this.rootStore.tradeStore.balance)
    );

    return {
      exposureByBase,
      hedgeRatios,
      correlationMatrix: correlationMatrix,
      volatilityImpact,
    };
  };

  private checkAlerts = () => {
    const newAlerts: RiskAlert[] = [];

    // Check drawdown
    if (this.metrics.drawdown.current > 0.05) {
      newAlerts.push({
        severity: this.metrics.drawdown.current > 0.1 ? 'critical' : 'high',
        type: 'drawdown',
        threshold: 0.05,
        currentValue: this.metrics.drawdown.current,
        timestamp: Date.now(),
      });
    }

    // Check volatility
    if (this.metrics.volatility > 0.02) {
      newAlerts.push({
        severity: this.metrics.volatility > 0.03 ? 'critical' : 'high',
        type: 'volatility',
        threshold: 0.02,
        currentValue: this.metrics.volatility,
        timestamp: Date.now(),
      });
    }

    // Check correlation risk
    const highCorrelationPairs = this.findHighCorrelationPairs();
    if (highCorrelationPairs.length > 0) {
      newAlerts.push({
        severity: 'medium',
        type: 'correlation',
        threshold: 0.7,
        currentValue: Math.max(...highCorrelationPairs.map(p => p.correlation)),
        timestamp: Date.now(),
      });
    }

    // Update alerts
    runInAction(() => {
      this.alerts = [...newAlerts];
    });
  };

  private findHighCorrelationPairs = () => {
    const positions = this.rootStore.tradeStore.positions;
    const pairs: Array<{ pair1: string; pair2: string; correlation: number }> = [];
    
    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        const correlation = this.metrics.correlations[i][j];
        if (Math.abs(correlation) > 0.7) {
          pairs.push({
            pair1: positions[i].symbol,
            pair2: positions[j].symbol,
            correlation,
          });
        }
      }
    }
    
    return pairs;
  };

  getRiskMetricsHistory = () => {
    return this.historicalMetrics;
  };

  getAlerts = () => {
    return this.alerts;
  };

  dismissAlert = (index: number) => {
    runInAction(() => {
      this.alerts = this.alerts.filter((_, i) => i !== index);
    });
  };
}
