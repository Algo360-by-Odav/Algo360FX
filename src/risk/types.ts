import { Matrix } from '@/utils/matrix';

export interface PortfolioRiskMetrics {
  volatility: number;
  valueAtRisk: number;
  expectedShortfall: number;
  beta: number;
  correlations: Matrix;
  drawdown: {
    current: number;
    maximum: number;
    duration: number;
  };
}

export interface PositionRiskMetrics {
  exposure: number;
  leverage: number;
  marginUsage: number;
  notionalValue: number;
  delta: number;
  gamma?: number;
  vega?: number;
  theta?: number;
}

export interface DynamicRiskParams {
  marketVolatility: number;
  tradingPerformance: number;
  marketCondition: 'normal' | 'volatile' | 'crisis';
  adjustmentFactor: number;
}

export interface RiskAlert {
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: 'exposure' | 'volatility' | 'correlation' | 'drawdown';
  threshold: number;
  currentValue: number;
  timestamp: number;
}

export interface RiskAdjustedMetrics {
  sharpeRatio: number;
  sortinoRatio: number;
  informationRatio: number;
  calmarRatio: number;
  maxDrawdown: number;
  recoveryFactor: number;
}

export interface CurrencyRisk {
  exposureByBase: Record<string, number>;
  hedgeRatios: Record<string, number>;
  correlationMatrix: number[][];
  volatilityImpact: number;
}

export interface RiskLimits {
  maxLeverage: number;
  maxDrawdown: number;
  maxPositions: number;
  maxDailyLoss: number;
  maxExposurePerCurrency: number;
  maxCorrelation: number;
}

export interface RiskMonitorConfig {
  updateInterval: number;
  alertThresholds: {
    leverage: number;
    drawdown: number;
    volatility: number;
    correlation: number;
  };
  riskLimits: RiskLimits;
}
