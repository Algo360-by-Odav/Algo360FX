import { Trade, Position } from './trading';

export interface RiskMetrics {
  currentDrawdown: number;
  maxDrawdown: number;
  valueAtRisk: number;
  expectedShortfall: number;
  sharpeRatio: number;
  sortinoRatio: number;
  beta: number;
  alpha: number;
  informationRatio: number;
  treynorRatio: number;
  volatility: number;
  downsideDeviation: number;
}

export interface RiskLimits {
  maxDrawdown: number;
  maxLeverage: number;
  maxPositionSize: number;
  maxPositions: number;
  maxConcentration: number;
  stopLoss: number;
  takeProfit: number;
}

export interface PositionSizing {
  method: 'fixed' | 'risk_percent' | 'kelly' | 'optimal_f';
  params: {
    size?: number;
    riskPercent?: number;
    kellyFraction?: number;
    optimalF?: number;
  };
}

export interface RiskAdjustment {
  type: 'stop_loss' | 'trailing_stop' | 'take_profit' | 'break_even';
  value: number;
  unit: 'price' | 'percent' | 'atr';
}

export interface RiskProfile {
  id: string;
  name: string;
  description: string;
  limits: RiskLimits;
  positionSizing: PositionSizing;
  adjustments: RiskAdjustment[];
  active: boolean;
}

export interface RiskCheck {
  passed: boolean;
  message: string;
  type: 'warning' | 'error';
  limits: {
    metric: string;
    current: number;
    limit: number;
    exceeded: boolean;
  }[];
}

export interface RiskReport {
  timestamp: Date;
  metrics: RiskMetrics;
  positions: {
    position: Position;
    risk: {
      exposure: number;
      var: number;
      es: number;
      beta: number;
    };
  }[];
  violations: {
    type: string;
    message: string;
    severity: 'low' | 'medium' | 'high';
  }[];
  recommendations: {
    action: string;
    reason: string;
    priority: 'low' | 'medium' | 'high';
  }[];
}

export interface StressTest {
  id: string;
  name: string;
  description: string;
  scenarios: {
    name: string;
    changes: {
      metric: string;
      value: number;
      unit: 'absolute' | 'percent';
    }[];
  }[];
  results: {
    scenario: string;
    impact: {
      pnl: number;
      drawdown: number;
      var: number;
    };
  }[];
}

export interface RiskAlert {
  id: string;
  type: 'limit_breach' | 'drawdown' | 'exposure' | 'volatility';
  severity: 'low' | 'medium' | 'high';
  message: string;
  metric: string;
  current: number;
  threshold: number;
  timestamp: Date;
  acknowledged: boolean;
}

export interface RiskSettings {
  autoHedging: boolean;
  hedgingRules: {
    trigger: 'exposure' | 'correlation' | 'var';
    threshold: number;
    action: 'reduce' | 'hedge' | 'close';
  }[];
  marginCallLevel: number;
  stopOutLevel: number;
  riskReportSchedule: 'daily' | 'weekly' | 'monthly';
  alertThresholds: {
    drawdown: number;
    var: number;
    exposure: number;
    volatility: number;
  };
}
