export enum StrategyCategory {
  TREND_FOLLOWING = 'TREND_FOLLOWING',
  MEAN_REVERSION = 'MEAN_REVERSION',
  BREAKOUT = 'BREAKOUT',
  MOMENTUM = 'MOMENTUM',
  VOLATILITY = 'VOLATILITY',
  VOLUME_BASED = 'VOLUME_BASED',
  PATTERN_RECOGNITION = 'PATTERN_RECOGNITION',
  ML_BASED = 'ML_BASED',
  ARBITRAGE = 'ARBITRAGE',
  GRID_TRADING = 'GRID_TRADING',
  SCALPING = 'SCALPING',
  SWING_TRADING = 'SWING_TRADING',
  POSITION_TRADING = 'POSITION_TRADING',
}

export enum RiskLevel {
  CONSERVATIVE = 'CONSERVATIVE',
  MODERATE = 'MODERATE',
  AGGRESSIVE = 'AGGRESSIVE',
}

export enum TimeHorizon {
  INTRADAY = 'INTRADAY',
  SWING = 'SWING',
  POSITION = 'POSITION',
  LONG_TERM = 'LONG_TERM',
}

export enum ComplexityLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
  EXPERT = 'EXPERT',
}

export enum MarketCondition {
  TRENDING = 'TRENDING',
  RANGING = 'RANGING',
  VOLATILE = 'VOLATILE',
  ALL = 'ALL',
}

export interface StrategyTag {
  id: string;
  name: string;
  description: string;
  category: StrategyCategory;
}

export interface StrategyMetadata {
  category: StrategyCategory;
  riskLevel: RiskLevel;
  timeHorizon: TimeHorizon;
  complexityLevel: ComplexityLevel;
  preferredMarketCondition: MarketCondition;
  tags: StrategyTag[];
  backtestResults?: {
    winRate: number;
    profitFactor: number;
    sharpeRatio: number;
    maxDrawdown: number;
    averageTrade: number;
  };
  popularity: number;
  rating: number;
  reviewCount: number;
}

export interface StrategyFilter {
  categories?: StrategyCategory[];
  riskLevels?: RiskLevel[];
  timeHorizons?: TimeHorizon[];
  complexityLevels?: ComplexityLevel[];
  marketConditions?: MarketCondition[];
  tags?: string[];
  minWinRate?: number;
  minProfitFactor?: number;
  minSharpeRatio?: number;
  maxDrawdown?: number;
  minRating?: number;
  searchText?: string;
  sortBy?: 'popularity' | 'rating' | 'winRate' | 'profitFactor' | 'sharpeRatio';
  sortOrder?: 'asc' | 'desc';
}
