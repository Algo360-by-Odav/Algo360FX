import { makeAutoObservable, runInAction } from 'mobx';

export interface HFTStrategy {
  id: string;
  name: string;
  description: string;
  type: 'market_making' | 'statistical_arbitrage' | 'momentum' | 'mean_reversion' | 'adaptive';
  status: 'active' | 'inactive' | 'error' | 'warming_up';
  trades: number;
  winRate: number;
  pnl: number;
  latency: number;
  cpuUsage: number;
  memoryUsage: number;
  config: {
    // Market Configuration
    symbol: string;
    timeframe: '1s' | '5s' | '10s' | '30s' | '1m';
    tradingHours: {
      start: string; // HH:mm in UTC
      end: string;   // HH:mm in UTC
      timezone: string;
    };
    
    // Position Management
    maxPositions: number;
    maxPositionSize: number;
    positionSizing: 'fixed' | 'volatility_adjusted' | 'kelly_criterion';
    
    // Risk Management
    maxDrawdown: number;
    riskPerTrade: number;
    dailyLossLimit: number;
    weeklyLossLimit: number;
    
    // Order Execution
    orderTypes: ('MARKET' | 'LIMIT' | 'STOP' | 'IOC' | 'FOK')[];
    targetProfit: number;
    stopLoss: number;
    trailingStop: boolean;
    trailingStopDistance: number;
    
    // Strategy-Specific Parameters
    marketMaking?: {
      spreadMultiplier: number;
      inventoryLimit: number;
      quoteSize: number;
      layering: boolean;
      layers: number;
      skewFactor: number;
    };
    
    statisticalArbitrage?: {
      correlationThreshold: number;
      lookbackPeriod: number;
      zScoreThreshold: number;
      cointegrationConfidence: number;
      hedgeRatio: number;
      rebalanceThreshold: number;
    };
    
    momentum?: {
      momentumPeriod: number;
      signalThreshold: number;
      meanReversionRatio: number;
      volumeFilter: boolean;
      volatilityAdjustment: boolean;
      momentumType: 'price' | 'volume' | 'combined';
    };
    
    meanReversion?: {
      lookbackWindow: number;
      entryZScore: number;
      exitZScore: number;
      halfLife: number;
      bollingerBands: {
        enabled: boolean;
        period: number;
        standardDeviations: number;
      };
    };
    
    adaptive?: {
      regimeDetection: boolean;
      adaptiveTimeframe: boolean;
      machineLeaning: {
        enabled: boolean;
        model: 'random_forest' | 'gradient_boost' | 'neural_network';
        retrainInterval: number;
        featureSet: string[];
      };
      riskParity: boolean;
      dynamicSizing: boolean;
    };
    
    // Advanced Features
    eventFilters: {
      newsEvents: boolean;
      economicCalendar: boolean;
      volatilityFilter: boolean;
      liquidityFilter: boolean;
    };
    
    customParams: Record<string, any>;
  };
  performance: {
    sharpeRatio: number;
    sortinoRatio: number;
    calmarRatio: number;
    maxDrawdown: number;
    recoveryFactor: number;
    profitFactor: number;
    expectancy: number;
  };
}

export interface SystemMetrics {
  averageLatency: number;
  systemLoad: number;
  activeStrategies: number;
  totalStrategies: number;
  memoryUsage: number;
  cpuUsage: number;
  networkLatency: number;
  orderExecutionTime: number;
  marketDataLatency: number;
  messageQueueSize: number;
  orderBookDepth: number;
  systemUptime: number;
}

export interface PerformanceMetrics {
  timestamp: string;
  pnl: number;
  trades: number;
  winRate: number;
  sharpeRatio: number;
  maxDrawdown: number;
  volatility: number;
  beta: number;
  alpha: number;
  informationRatio: number;
  treynorRatio: number;
}

export class HFTStore {
  strategies: HFTStrategy[] = [];
  systemMetrics: SystemMetrics = {
    averageLatency: 0,
    systemLoad: 0,
    activeStrategies: 0,
    totalStrategies: 0,
    memoryUsage: 0,
    cpuUsage: 0,
    networkLatency: 0,
    orderExecutionTime: 0,
    marketDataLatency: 0,
    messageQueueSize: 0,
    orderBookDepth: 0,
    systemUptime: 0
  };
  performanceHistory: PerformanceMetrics[] = [];
  
  constructor() {
    makeAutoObservable(this);
    this.initializeDefaultStrategies();
  }

  private initializeDefaultStrategies() {
    const defaultStrategies: HFTStrategy[] = [
      {
        id: '1',
        name: 'Advanced Market Making',
        description: 'Multi-level market making with inventory management and adaptive spreads',
        type: 'market_making',
        status: 'inactive',
        trades: 0,
        winRate: 0,
        pnl: 0,
        latency: 0,
        cpuUsage: 0,
        memoryUsage: 0,
        config: {
          symbol: 'EUR/USD',
          timeframe: '1s',
          tradingHours: {
            start: '00:00',
            end: '23:59',
            timezone: 'UTC'
          },
          maxPositions: 50,
          maxPositionSize: 1000000,
          positionSizing: 'volatility_adjusted',
          maxDrawdown: 0.02,
          riskPerTrade: 0.001,
          dailyLossLimit: 0.05,
          weeklyLossLimit: 0.1,
          orderTypes: ['LIMIT', 'IOC'],
          targetProfit: 0.0001,
          stopLoss: 0.0002,
          trailingStop: true,
          trailingStopDistance: 0.0001,
          marketMaking: {
            spreadMultiplier: 1.2,
            inventoryLimit: 1000000,
            quoteSize: 100000,
            layering: true,
            layers: 5,
            skewFactor: 0.2
          },
          eventFilters: {
            newsEvents: true,
            economicCalendar: true,
            volatilityFilter: true,
            liquidityFilter: true
          },
          customParams: {}
        },
        performance: {
          sharpeRatio: 0,
          sortinoRatio: 0,
          calmarRatio: 0,
          maxDrawdown: 0,
          recoveryFactor: 0,
          profitFactor: 0,
          expectancy: 0
        }
      },
      {
        id: '2',
        name: 'ML-Enhanced Statistical Arbitrage',
        description: 'Machine learning-powered statistical arbitrage with dynamic hedge ratios',
        type: 'statistical_arbitrage',
        status: 'inactive',
        trades: 0,
        winRate: 0,
        pnl: 0,
        latency: 0,
        cpuUsage: 0,
        memoryUsage: 0,
        config: {
          symbol: 'BTC/USD',
          timeframe: '1s',
          tradingHours: {
            start: '00:00',
            end: '23:59',
            timezone: 'UTC'
          },
          maxPositions: 10,
          maxPositionSize: 500000,
          positionSizing: 'kelly_criterion',
          maxDrawdown: 0.03,
          riskPerTrade: 0.002,
          dailyLossLimit: 0.06,
          weeklyLossLimit: 0.12,
          orderTypes: ['MARKET', 'LIMIT'],
          targetProfit: 0.002,
          stopLoss: 0.003,
          trailingStop: true,
          trailingStopDistance: 0.001,
          statisticalArbitrage: {
            correlationThreshold: 0.8,
            lookbackPeriod: 100,
            zScoreThreshold: 2.0,
            cointegrationConfidence: 0.95,
            hedgeRatio: 1.0,
            rebalanceThreshold: 0.1
          },
          eventFilters: {
            newsEvents: true,
            economicCalendar: true,
            volatilityFilter: true,
            liquidityFilter: true
          },
          customParams: {}
        },
        performance: {
          sharpeRatio: 0,
          sortinoRatio: 0,
          calmarRatio: 0,
          maxDrawdown: 0,
          recoveryFactor: 0,
          profitFactor: 0,
          expectancy: 0
        }
      },
      {
        id: '3',
        name: 'Adaptive Multi-Strategy',
        description: 'Self-adapting strategy that combines multiple approaches based on market regime',
        type: 'adaptive',
        status: 'inactive',
        trades: 0,
        winRate: 0,
        pnl: 0,
        latency: 0,
        cpuUsage: 0,
        memoryUsage: 0,
        config: {
          symbol: 'GBP/USD',
          timeframe: '1s',
          tradingHours: {
            start: '00:00',
            end: '23:59',
            timezone: 'UTC'
          },
          maxPositions: 20,
          maxPositionSize: 750000,
          positionSizing: 'volatility_adjusted',
          maxDrawdown: 0.025,
          riskPerTrade: 0.0015,
          dailyLossLimit: 0.05,
          weeklyLossLimit: 0.1,
          orderTypes: ['MARKET', 'LIMIT', 'IOC'],
          targetProfit: 0.001,
          stopLoss: 0.002,
          trailingStop: true,
          trailingStopDistance: 0.0005,
          adaptive: {
            regimeDetection: true,
            adaptiveTimeframe: true,
            machineLeaning: {
              enabled: true,
              model: 'gradient_boost',
              retrainInterval: 1000,
              featureSet: ['price', 'volume', 'volatility', 'orderbook_imbalance']
            },
            riskParity: true,
            dynamicSizing: true
          },
          eventFilters: {
            newsEvents: true,
            economicCalendar: true,
            volatilityFilter: true,
            liquidityFilter: true
          },
          customParams: {}
        },
        performance: {
          sharpeRatio: 0,
          sortinoRatio: 0,
          calmarRatio: 0,
          maxDrawdown: 0,
          recoveryFactor: 0,
          profitFactor: 0,
          expectancy: 0
        }
      }
    ];

    runInAction(() => {
      this.strategies = defaultStrategies;
    });
  }

  startStrategy = async (strategyId: string) => {
    const strategy = this.strategies.find(s => s.id === strategyId);
    if (!strategy) return;

    try {
      // Implement strategy start logic here
      runInAction(() => {
        strategy.status = 'warming_up';
      });
      
      // Simulate warmup period
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      runInAction(() => {
        strategy.status = 'active';
      });
    } catch (error) {
      runInAction(() => {
        strategy.status = 'error';
      });
      console.error(`Failed to start strategy ${strategyId}:`, error);
    }
  };

  stopStrategy = (strategyId: string) => {
    const strategy = this.strategies.find(s => s.id === strategyId);
    if (!strategy) return;

    runInAction(() => {
      strategy.status = 'inactive';
    });
  };

  updateStrategyConfig = (strategyId: string, config: Partial<HFTStrategy['config']>) => {
    const strategy = this.strategies.find(s => s.id === strategyId);
    if (!strategy) return;

    runInAction(() => {
      strategy.config = {
        ...strategy.config,
        ...config
      };
    });
  };

  updateSystemMetrics = (metrics: Partial<SystemMetrics>) => {
    runInAction(() => {
      this.systemMetrics = {
        ...this.systemMetrics,
        ...metrics
      };
    });
  };

  addPerformanceMetric = (metric: PerformanceMetrics) => {
    runInAction(() => {
      this.performanceHistory.push(metric);
      // Keep only last 1000 metrics
      if (this.performanceHistory.length > 1000) {
        this.performanceHistory.shift();
      }
    });
  };
}

export const hftStore = new HFTStore();
