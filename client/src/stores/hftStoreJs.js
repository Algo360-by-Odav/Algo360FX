// hftStoreJs.js - JavaScript version without TypeScript
// This avoids the Vite React plugin preamble detection error

import { makeAutoObservable, runInAction } from 'mobx';

class HFTStoreJs {
  constructor() {
    this.strategies = [];
    this.systemMetrics = {
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
    this.performanceHistory = [];
    
    makeAutoObservable(this);
    this.initializeDefaultStrategies();
    this.startMetricsSimulation();
  }

  // Start a strategy by ID
  startStrategy = async (strategyId) => {
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
        this.systemMetrics.activeStrategies += 1;
      });
    } catch (error) {
      runInAction(() => {
        strategy.status = 'error';
      });
      console.error(`Failed to start strategy ${strategyId}:`, error);
    }
  };

  // Stop a strategy by ID
  stopStrategy = (strategyId) => {
    const strategy = this.strategies.find(s => s.id === strategyId);
    if (!strategy) return;

    runInAction(() => {
      strategy.status = 'inactive';
      if (this.systemMetrics.activeStrategies > 0) {
        this.systemMetrics.activeStrategies -= 1;
      }
    });
  };

  // Update strategy configuration
  updateStrategyConfig = (strategyId, config) => {
    const strategy = this.strategies.find(s => s.id === strategyId);
    if (!strategy) return;

    runInAction(() => {
      strategy.config = {
        ...strategy.config,
        ...config
      };
    });
  };

  // Update system metrics
  updateSystemMetrics = (metrics) => {
    runInAction(() => {
      this.systemMetrics = {
        ...this.systemMetrics,
        ...metrics
      };
    });
  };

  // Add performance metric
  addPerformanceMetric = (metric) => {
    runInAction(() => {
      this.performanceHistory.push(metric);
      // Keep only last 1000 metrics
      if (this.performanceHistory.length > 1000) {
        this.performanceHistory.shift();
      }
    });
  };

  // Initialize default strategies
  initializeDefaultStrategies() {
    const defaultStrategies = [
      {
        id: 'strat-1',
        name: 'Market Making Alpha',
        description: 'High-frequency market making strategy for major currency pairs',
        type: 'market_making',
        status: 'inactive',
        trades: 1243,
        winRate: 58.7,
        pnl: 4325.87,
        latency: 0.8,
        cpuUsage: 12,
        memoryUsage: 256,
        config: {
          // Market Configuration
          symbol: 'EURUSD',
          timeframe: '1s',
          tradingHours: {
            start: '08:00',
            end: '16:00',
            timezone: 'UTC',
          },
          
          // Position Management
          maxPositions: 10,
          maxPositionSize: 1.0,
          positionSizing: 'volatility_adjusted',
          
          // Risk Management
          maxDrawdown: 5,
          riskPerTrade: 0.5,
          dailyLossLimit: 3,
          weeklyLossLimit: 7,
          
          // Order Execution
          orderTypes: ['LIMIT', 'IOC'],
          targetProfit: 0.05,
          stopLoss: 0.1,
          trailingStop: true,
          trailingStopDistance: 0.02,
          
          // Strategy-Specific Parameters
          marketMaking: {
            spreadMultiplier: 1.2,
            inventoryLimit: 5,
            quoteSize: 0.1,
            layering: true,
            layers: 3,
            skewFactor: 0.3,
          },
        },
      },
      {
        id: 'strat-2',
        name: 'Statistical Arbitrage',
        description: 'Pairs trading across correlated instruments',
        type: 'statistical_arbitrage',
        status: 'inactive',
        trades: 856,
        winRate: 62.3,
        pnl: 3187.45,
        latency: 1.2,
        cpuUsage: 18,
        memoryUsage: 320,
        config: {
          // Market Configuration
          symbol: 'EURUSD,GBPUSD',
          timeframe: '5s',
          tradingHours: {
            start: '09:00',
            end: '17:00',
            timezone: 'UTC',
          },
          
          // Position Management
          maxPositions: 5,
          maxPositionSize: 0.5,
          positionSizing: 'kelly_criterion',
          
          // Risk Management
          maxDrawdown: 4,
          riskPerTrade: 0.3,
          dailyLossLimit: 2,
          weeklyLossLimit: 5,
          
          // Order Execution
          orderTypes: ['MARKET', 'LIMIT'],
          targetProfit: 0.1,
          stopLoss: 0.15,
          trailingStop: false,
          trailingStopDistance: 0,
          
          // Strategy-Specific Parameters
          statisticalArbitrage: {
            correlationThreshold: 0.8,
            zScoreEntry: 2.0,
            zScoreExit: 0.5,
            lookbackPeriod: 100,
            halfLife: 30,
            pairRatio: 'dynamic',
          },
        },
      },
      {
        id: 'strat-3',
        name: 'Momentum Alpha',
        description: 'Trend-following strategy with adaptive parameters',
        type: 'momentum',
        status: 'inactive',
        trades: 542,
        winRate: 51.2,
        pnl: 1875.32,
        latency: 0.9,
        cpuUsage: 15,
        memoryUsage: 280,
        config: {
          // Market Configuration
          symbol: 'BTCUSD',
          timeframe: '10s',
          tradingHours: {
            start: '00:00',
            end: '23:59',
            timezone: 'UTC',
          },
          
          // Position Management
          maxPositions: 3,
          maxPositionSize: 0.2,
          positionSizing: 'fixed',
          
          // Risk Management
          maxDrawdown: 7,
          riskPerTrade: 0.7,
          dailyLossLimit: 5,
          weeklyLossLimit: 10,
          
          // Order Execution
          orderTypes: ['MARKET'],
          targetProfit: 0.3,
          stopLoss: 0.2,
          trailingStop: true,
          trailingStopDistance: 0.05,
          
          // Strategy-Specific Parameters
          momentum: {
            lookbackPeriod: 20,
            threshold: 0.01,
            smoothingFactor: 0.2,
            volumeFilter: true,
            volumeThreshold: 1.5,
          },
        },
      },
    ];

    this.strategies = defaultStrategies;
    this.systemMetrics.totalStrategies = defaultStrategies.length;
  }

  // Start simulation of metrics for demo purposes
  startMetricsSimulation() {
    // Update system metrics every 2 seconds
    setInterval(() => {
      this.updateSystemMetrics({
        averageLatency: 0.5 + Math.random() * 2,
        systemLoad: 20 + Math.random() * 30,
        cpuUsage: 10 + Math.random() * 40,
        memoryUsage: 30 + Math.random() * 20,
        networkLatency: 0.2 + Math.random() * 1,
        orderExecutionTime: 0.3 + Math.random() * 1.5,
        marketDataLatency: 0.1 + Math.random() * 0.5,
        messageQueueSize: Math.floor(Math.random() * 100),
        orderBookDepth: 50 + Math.floor(Math.random() * 100),
        systemUptime: this.systemMetrics.systemUptime + 2,
      });

      // Update active strategies metrics
      const activeStrategies = this.strategies.filter(s => s.status === 'active');
      activeStrategies.forEach(strategy => {
        if (Math.random() > 0.7) { // 30% chance to update strategy metrics
          const pnlChange = (Math.random() * 20) - 10; // -10 to +10
          const newTrades = Math.random() > 0.5 ? 1 : 0;
          const winTrade = Math.random() > 0.4;
          
          runInAction(() => {
            strategy.pnl += pnlChange;
            strategy.trades += newTrades;
            if (newTrades > 0) {
              const totalWins = strategy.trades * (strategy.winRate / 100);
              const newTotalWins = winTrade ? totalWins + 1 : totalWins;
              strategy.winRate = (newTotalWins / strategy.trades) * 100;
            }
            strategy.latency = 0.5 + Math.random() * 1.5;
            strategy.cpuUsage = 5 + Math.random() * 20;
            strategy.memoryUsage = 200 + Math.random() * 100;
          });
        }
      });

      // Add performance metric
      const now = new Date();
      this.addPerformanceMetric({
        timestamp: now.toISOString(),
        pnl: this.strategies.reduce((sum, s) => sum + s.pnl, 0),
        trades: this.strategies.reduce((sum, s) => sum + s.trades, 0),
        winRate: this.strategies.reduce((sum, s) => sum + s.winRate, 0) / Math.max(1, this.strategies.length),
        sharpeRatio: 1 + Math.random() * 2,
        maxDrawdown: 5 + Math.random() * 10,
        volatility: 0.5 + Math.random() * 1.5,
        beta: 0.8 + Math.random() * 0.4,
        alpha: 0.1 + Math.random() * 0.3,
        informationRatio: 0.5 + Math.random() * 1,
        treynorRatio: 0.3 + Math.random() * 0.7,
      });
    }, 2000);
  }
}

// Create and export the store
const hftStore = new HFTStoreJs();
export default hftStore;
