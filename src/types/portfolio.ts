import { TradingStrategy } from './algo-trading';

export interface PortfolioStrategy extends TradingStrategy {
  allocation: number;
  riskContribution?: number;
  correlations?: Record<string, number>;
}

export interface PortfolioMetrics {
  expectedReturn: number;
  volatility: number;
  sharpeRatio: number;
  maxDrawdown: number;
  correlationMatrix: number[][];
  valueAtRisk: number;
  conditionalVaR: number;
  diversificationRatio: number;
  trackingError: number;
  informationRatio: number;
  calmarRatio: number;
  betaToMarket: number;
  treynorRatio: number;
}

export interface Portfolio {
  id: string;
  name: string;
  description: string;
  strategies: PortfolioStrategy[];
  metrics: PortfolioMetrics;
  initialCapital: number;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  isActive: boolean;
  tags: string[];
}

export enum OptimizationObjective {
  MAX_SHARPE = 'MAX_SHARPE',
  MIN_RISK = 'MIN_RISK',
  MAX_RETURN = 'MAX_RETURN',
  RISK_PARITY = 'RISK_PARITY',
}

export enum RiskMeasure {
  VOLATILITY = 'VOLATILITY',
  VAR = 'VAR',
  CVAR = 'CVAR',
  DOWNSIDE_RISK = 'DOWNSIDE_RISK',
  TRACKING_ERROR = 'TRACKING_ERROR',
}

export interface PortfolioConstraints {
  minWeight: number;
  maxWeight: number;
  targetReturn?: number;
  maxVolatility?: number;
  maxDrawdown?: number;
  minDiversification?: number;
  sectorConstraints?: Record<string, { min: number; max: number }>;
  assetClassConstraints?: Record<string, { min: number; max: number }>;
  turnoverConstraint?: number;
  customConstraints?: {
    type: string;
    value: number;
    operator: '>' | '<' | '>=' | '<=' | '=';
  }[];
}

export interface OptimizationDetails {
  objective: OptimizationObjective;
  constraints: PortfolioConstraints;
  riskMeasure: RiskMeasure;
  convergence: boolean;
  iterations: number;
  optimizationTime: number;
}

export interface PortfolioOptimizationResult {
  strategies: PortfolioStrategy[];
  metrics: PortfolioMetrics;
  efficientFrontier: { risk: number; return: number }[];
  riskContribution: number[];
  optimizationDetails: OptimizationDetails;
}

export interface PortfolioRebalanceConfig {
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  threshold: number;
  optimizationObjective: OptimizationObjective;
  constraints: PortfolioConstraints;
  riskMeasure: RiskMeasure;
}

export interface PortfolioAlert {
  id: string;
  portfolioId: string;
  type: 'REBALANCE' | 'RISK' | 'PERFORMANCE' | 'CUSTOM';
  message: string;
  severity: 'low' | 'medium' | 'high';
  createdAt: Date;
  isRead: boolean;
}

export interface PortfolioReport {
  id: string;
  portfolioId: string;
  startDate: Date;
  endDate: Date;
  metrics: PortfolioMetrics;
  trades: {
    strategyId: string;
    count: number;
    volume: number;
    pnl: number;
  }[];
  rebalances: {
    date: Date;
    oldWeights: number[];
    newWeights: number[];
    reason: string;
  }[];
  riskAnalysis: {
    var: number;
    cvar: number;
    stressTests: {
      scenario: string;
      impact: number;
    }[];
  };
  createdAt: Date;
}

export interface PortfolioAnalysis {
  historicalPerformance: {
    date: Date;
    value: number;
    drawdown: number;
  }[];
  riskDecomposition: {
    strategyId: string;
    contribution: number;
  }[];
  factorExposure: {
    factor: string;
    exposure: number;
  }[];
  scenarioAnalysis: {
    scenario: string;
    impact: number;
  }[];
  styleAnalysis: {
    style: string;
    exposure: number;
  }[];
}
