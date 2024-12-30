import { makeAutoObservable, runInAction } from 'mobx';
import { RootStore } from './RootStore';
import {
  HFTSignal,
  HFTMetrics,
  OrderFlowMetrics,
  MarketMakingMetrics,
  StatArbSignal,
  HFTStrategyConfig,
  HFTPerformanceSnapshot,
  MarketMicrostructure,
  TimeFrame,
} from '../hft/types';
import {
  calculateVolatility,
  calculateCorrelation,
  calculateBeta,
  calculateDrawdownMetrics,
} from '@/utils/statistics';

export class HFTStore {
  private signalBuffer: Map<string, HFTSignal[]> = new Map();
  private performanceHistory: HFTPerformanceSnapshot[] = [];
  private activeStrategies: Map<string, HFTStrategyConfig> = new Map();
  private marketData: Map<string, MarketMicrostructure> = new Map();
  private orderFlowMetrics: Map<string, OrderFlowMetrics> = new Map();
  private executionLatencies: number[] = [];
  private lastUpdate: number = Date.now();
  private monitoringInterval: NodeJS.Timer | null = null;

  constructor(private rootStore: RootStore) {
    makeAutoObservable(this);
  }

  startMonitoring = () => {
    if (!this.monitoringInterval) {
      this.updateMetrics();
      this.monitoringInterval = setInterval(this.updateMetrics, 1000); // Update every second
    }
  };

  stopMonitoring = () => {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
  };

  private updateMetrics = async () => {
    try {
      const now = Date.now();
      const mockData = {
        metrics: {
          sharpeRatio: 1.5 + Math.random() * 0.5,
          winRate: 0.65 + Math.random() * 0.1,
          profitFactor: 1.8 + Math.random() * 0.4,
          maxDrawdown: 0.05 + Math.random() * 0.02,
          latency: {
            mean: 0.5 + Math.random() * 0.2,
            p95: 1.2 + Math.random() * 0.3,
            p99: 2.0 + Math.random() * 0.5
          }
        },
        orderFlow: {
          volumeWeightedPrice: 1.2345 + Math.random() * 0.01,
          buyVolume: 1000000 + Math.random() * 500000,
          sellVolume: 950000 + Math.random() * 500000,
          volumeImbalance: 0.02 + Math.random() * 0.04
        },
        marketMaking: {
          inventoryLevel: 50000 + Math.random() * 20000,
          spreadCapture: 0.7 + Math.random() * 0.1,
          fillRatio: 0.8 + Math.random() * 0.1
        },
        positions: [
          {
            symbol: 'EUR/USD',
            size: 100000 + Math.random() * 50000,
            entryPrice: 1.0789 + Math.random() * 0.0010,
            unrealizedPnL: 500 + Math.random() * 200,
            holdingTime: 300000 + Math.random() * 60000
          },
          {
            symbol: 'GBP/USD',
            size: -75000 + Math.random() * 25000,
            entryPrice: 1.2654 + Math.random() * 0.0010,
            unrealizedPnL: -300 + Math.random() * 150,
            holdingTime: 180000 + Math.random() * 60000
          }
        ]
      };

      runInAction(() => {
        this.performanceHistory.push({
          timestamp: now,
          ...mockData
        });

        // Keep only the last 100 snapshots
        if (this.performanceHistory.length > 100) {
          this.performanceHistory.shift();
        }
      });

      this.lastUpdate = now;
    } catch (error) {
      console.error('Error updating HFT metrics:', error);
    }
  };

  private updateMarketMicrostructure = async () => {
    const symbols = Array.from(this.activeStrategies.keys());
    
    for (const symbol of symbols) {
      const orderBook = await this.rootStore.marketStore.getOrderBook(symbol);
      const trades = await this.rootStore.marketStore.getRecentTrades(symbol);
      
      const microstructure: MarketMicrostructure = {
        orderBookImbalance: this.calculateOrderBookImbalance(orderBook),
        bidAskSpread: this.calculateBidAskSpread(orderBook),
        marketDepth: this.calculateMarketDepth(orderBook),
        volumeProfile: this.calculateVolumeProfile(trades),
        tickDirection: this.calculateTickDirection(trades),
        lastTradeSize: trades[trades.length - 1]?.size || 0,
      };

      this.marketData.set(symbol, microstructure);
    }
  };

  private generateSignals = async () => {
    for (const [symbol, strategy] of this.activeStrategies) {
      const microstructure = this.marketData.get(symbol);
      if (!microstructure) continue;

      const signals: HFTSignal[] = [];

      switch (strategy.type) {
        case 'orderflow_imbalance':
          signals.push(this.generateOrderFlowSignal(symbol, microstructure, strategy));
          break;
        case 'price_reversion':
          signals.push(this.generatePriceReversionSignal(symbol, microstructure, strategy));
          break;
        case 'market_making':
          signals.push(this.generateMarketMakingSignal(symbol, microstructure, strategy));
          break;
        case 'statistical_arbitrage':
          signals.push(...this.generateStatArbSignals(symbol, strategy));
          break;
      }

      // Store signals in buffer
      const existingSignals = this.signalBuffer.get(symbol) || [];
      this.signalBuffer.set(symbol, [...existingSignals, ...signals]);
    }
  };

  private calculatePerformanceSnapshot = async (): Promise<HFTPerformanceSnapshot> => {
    const positions = this.rootStore.tradeStore.positions;
    const metrics = this.calculateHFTMetrics();
    const orderFlow = this.calculateAggregateOrderFlowMetrics();
    const marketMaking = this.calculateMarketMakingMetrics();
    const signals = Array.from(this.signalBuffer.values()).flat();

    return {
      timestamp: Date.now(),
      metrics,
      orderFlow,
      marketMaking,
      signals,
      positions: positions.map(p => ({
        symbol: p.symbol,
        size: p.size,
        entryPrice: p.entryPrice,
        unrealizedPnL: p.unrealizedPnL,
        holdingTime: Date.now() - p.openTime,
      })),
      riskMetrics: {
        currentDrawdown: this.rootStore.riskStore.metrics.drawdown.current,
        leverageUtilization: this.calculateLeverageUtilization(),
        exposureByStrategy: this.calculateExposureByStrategy(),
        valueAtRisk: this.rootStore.riskStore.metrics.valueAtRisk,
      },
    };
  };

  // Market microstructure calculations
  private calculateOrderBookImbalance(orderBook: any): number {
    const bidVolume = orderBook.bids.reduce((sum: number, [_, size]: number[]) => sum + size, 0);
    const askVolume = orderBook.asks.reduce((sum: number, [_, size]: number[]) => sum + size, 0);
    return (bidVolume - askVolume) / (bidVolume + askVolume);
  }

  private calculateBidAskSpread(orderBook: any): number {
    const bestBid = orderBook.bids[0]?.[0] || 0;
    const bestAsk = orderBook.asks[0]?.[0] || 0;
    return (bestAsk - bestBid) / ((bestAsk + bestBid) / 2);
  }

  private calculateMarketDepth(orderBook: any): number {
    const depth = 10; // Look at top 10 levels
    const bidDepth = orderBook.bids.slice(0, depth).reduce((sum: number, [_, size]: number[]) => sum + size, 0);
    const askDepth = orderBook.asks.slice(0, depth).reduce((sum: number, [_, size]: number[]) => sum + size, 0);
    return (bidDepth + askDepth) / 2;
  }

  private calculateVolumeProfile(trades: any[]): number[] {
    const volumeBuckets = Array(10).fill(0);
    const prices = trades.map(t => t.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const range = max - min;
    
    trades.forEach(trade => {
      const bucket = Math.floor(((trade.price - min) / range) * 9);
      volumeBuckets[bucket] += trade.size;
    });
    
    return volumeBuckets;
  }

  private calculateTickDirection(trades: any[]): 1 | -1 | 0 {
    if (trades.length < 2) return 0;
    const lastPrice = trades[trades.length - 1].price;
    const prevPrice = trades[trades.length - 2].price;
    return lastPrice > prevPrice ? 1 : lastPrice < prevPrice ? -1 : 0;
  }

  // Signal generation
  private generateOrderFlowSignal(
    symbol: string,
    microstructure: MarketMicrostructure,
    strategy: HFTStrategyConfig
  ): HFTSignal {
    const { orderBookImbalance, volumeProfile } = microstructure;
    const strength = Math.abs(orderBookImbalance);
    const direction = orderBookImbalance > strategy.parameters.minImbalance ? 1 : 
                     orderBookImbalance < -strategy.parameters.minImbalance ? -1 : 0;

    return {
      timestamp: Date.now(),
      symbol,
      strength,
      direction,
      confidence: strength > 0.7 ? 'high' : strength > 0.4 ? 'medium' : 'low',
      timeframe: strategy.timeframe,
      type: 'orderflow_imbalance',
      metadata: {
        imbalance: orderBookImbalance,
        volumeProfile,
      },
    };
  }

  private generatePriceReversionSignal(
    symbol: string,
    microstructure: MarketMicrostructure,
    strategy: HFTStrategyConfig
  ): HFTSignal {
    // Implementation of mean reversion signal generation
    // This would include analysis of price deviations from moving averages,
    // Bollinger Bands, or other mean reversion indicators
    // For brevity, returning a simplified signal
    return {
      timestamp: Date.now(),
      symbol,
      strength: 0.5,
      direction: 0,
      confidence: 'medium',
      timeframe: strategy.timeframe,
      type: 'price_reversion',
      metadata: {},
    };
  }

  private generateMarketMakingSignal(
    symbol: string,
    microstructure: MarketMicrostructure,
    strategy: HFTStrategyConfig
  ): HFTSignal {
    const { bidAskSpread, marketDepth } = microstructure;
    const spreadOpportunity = bidAskSpread > strategy.parameters.maxSpread;
    const sufficientDepth = marketDepth > strategy.parameters.minVolume;

    return {
      timestamp: Date.now(),
      symbol,
      strength: spreadOpportunity && sufficientDepth ? 0.8 : 0.2,
      direction: 0, // Market making is typically direction-neutral
      confidence: spreadOpportunity && sufficientDepth ? 'high' : 'low',
      timeframe: strategy.timeframe,
      type: 'market_making',
      metadata: {
        spread: bidAskSpread,
        depth: marketDepth,
      },
    };
  }

  private generateStatArbSignals(
    symbol: string,
    strategy: HFTStrategyConfig
  ): HFTSignal[] {
    // Implementation of statistical arbitrage signal generation
    // This would include pair trading, triangular arbitrage,
    // or other statistical relationships
    return [];
  }

  // Performance metrics calculations
  private calculateHFTMetrics(): HFTMetrics {
    const sortedLatencies = [...this.executionLatencies].sort((a, b) => a - b);
    const len = sortedLatencies.length;

    return {
      sharpeRatio: 0, // Calculate from return series
      sortinoRatio: 0, // Calculate from return series
      calmarRatio: 0, // Calculate from return series
      maxDrawdown: 0, // Get from risk store
      profitFactor: 0, // Calculate from trade history
      winRate: 0, // Calculate from trade history
      averageWin: 0, // Calculate from trade history
      averageLoss: 0, // Calculate from trade history
      expectancy: 0, // Calculate from trade history
      latency: {
        mean: sortedLatencies.reduce((a, b) => a + b, 0) / len,
        median: sortedLatencies[Math.floor(len / 2)],
        p95: sortedLatencies[Math.floor(len * 0.95)],
        p99: sortedLatencies[Math.floor(len * 0.99)],
      },
    };
  }

  private calculateAggregateOrderFlowMetrics(): OrderFlowMetrics {
    // Aggregate order flow metrics across all symbols
    return {
      volumeWeightedPrice: 0,
      buyVolume: 0,
      sellVolume: 0,
      volumeImbalance: 0,
      largeOrdersCount: 0,
      orderBookPressure: 0,
    };
  }

  private calculateMarketMakingMetrics(): MarketMakingMetrics {
    // Calculate market making performance metrics
    return {
      inventoryLevel: 0,
      inventoryRisk: 0,
      spreadCapture: 0,
      positionTurnover: 0,
      quoteLifetime: 0,
      fillRatio: 0,
    };
  }

  private calculateLeverageUtilization(): number {
    const positions = this.rootStore.tradeStore.positions;
    const totalExposure = positions.reduce((sum, pos) => sum + Math.abs(pos.notionalValue), 0);
    const equity = this.rootStore.tradeStore.equity;
    return totalExposure / equity;
  }

  private calculateExposureByStrategy(): Record<string, number> {
    const positions = this.rootStore.tradeStore.positions;
    const exposureByStrategy: Record<string, number> = {};
    
    for (const [strategyName, strategy] of this.activeStrategies) {
      const strategyPositions = positions.filter(p => p.metadata?.strategy === strategyName);
      const exposure = strategyPositions.reduce((sum, pos) => sum + Math.abs(pos.notionalValue), 0);
      exposureByStrategy[strategyName] = exposure;
    }
    
    return exposureByStrategy;
  }

  // Public methods
  getPerformanceHistory = (): HFTPerformanceSnapshot[] => {
    return this.performanceHistory;
  };

  getActiveStrategies = () => {
    return [
      { name: 'Order Flow Imbalance', status: 'active' },
      { name: 'Price Reversion', status: 'active' },
      { name: 'Market Making', status: 'paused' },
      { name: 'Statistical Arbitrage', status: 'active' },
    ];
  };

  getLatestSignals = (strategyName: string) => {
    // Mock signals for testing
    return [
      {
        timestamp: Date.now() - 5000,
        symbol: strategyName.split(' ')[0],
        type: 'entry',
        direction: 'long',
        strength: 0.8,
        confidence: 'high'
      },
      {
        timestamp: Date.now() - 15000,
        symbol: strategyName.split(' ')[0],
        type: 'exit',
        direction: 'short',
        strength: 0.6,
        confidence: 'medium'
      }
    ];
  };

  addStrategy = (config: HFTStrategyConfig) => {
    this.activeStrategies.set(config.name, config);
  };

  removeStrategy = (name: string) => {
    this.activeStrategies.delete(name);
  };

  updateStrategy = (name: string, updates: Partial<HFTStrategyConfig>) => {
    const strategy = this.activeStrategies.get(name);
    if (strategy) {
      this.activeStrategies.set(name, { ...strategy, ...updates });
    }
  };
}
