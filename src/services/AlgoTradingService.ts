import { MarketDataService, MarketTick } from './MarketDataService';
import { Subscription } from 'rxjs';

export interface TradeSignal {
  type: 'BUY' | 'SELL';
  symbol: string;
  price: number;
  quantity: number;
  timestamp: number;
  strategy: string;
}

export interface StrategyConfig {
  symbol: string;
  entryConditions: Condition[];
  exitConditions: Condition[];
  riskManagement: RiskParameters;
}

interface Condition {
  indicator: string;
  operator: 'GREATER_THAN' | 'LESS_THAN' | 'EQUALS' | 'CROSSES_ABOVE' | 'CROSSES_BELOW';
  value: number;
}

interface RiskParameters {
  maxPositionSize: number;
  stopLoss: number;
  takeProfit: number;
  trailingStop?: number;
}

export class AlgoTradingService {
  private static instance: AlgoTradingService;
  private marketDataService: MarketDataService;
  private activeStrategies: Map<string, StrategyInstance> = new Map();

  private constructor() {
    this.marketDataService = MarketDataService.getInstance();
  }

  static getInstance(): AlgoTradingService {
    if (!AlgoTradingService.instance) {
      AlgoTradingService.instance = new AlgoTradingService();
    }
    return AlgoTradingService.instance;
  }

  startStrategy(config: StrategyConfig, onSignal: (signal: TradeSignal) => void): string {
    const strategyId = `${config.symbol}-${Date.now()}`;
    const strategy = new StrategyInstance(config, onSignal);
    this.activeStrategies.set(strategyId, strategy);
    return strategyId;
  }

  stopStrategy(strategyId: string) {
    const strategy = this.activeStrategies.get(strategyId);
    if (strategy) {
      strategy.stop();
      this.activeStrategies.delete(strategyId);
    }
  }

  stopAllStrategies() {
    this.activeStrategies.forEach(strategy => strategy.stop());
    this.activeStrategies.clear();
  }
}

class StrategyInstance {
  private subscription: Subscription | null = null;
  private lastTick: MarketTick | null = null;
  private position: { type: 'BUY' | 'SELL'; entryPrice: number } | null = null;

  constructor(
    private config: StrategyConfig,
    private onSignal: (signal: TradeSignal) => void
  ) {
    this.start();
  }

  private start() {
    const marketDataService = MarketDataService.getInstance();
    this.subscription = marketDataService.subscribeToTicks(this.config.symbol)
      .subscribe(tick => this.processTick(tick));
  }

  private processTick(tick: MarketTick) {
    if (!this.lastTick) {
      this.lastTick = tick;
      return;
    }

    // Check entry conditions if not in position
    if (!this.position) {
      if (this.checkEntryConditions(tick)) {
        this.enterPosition(tick);
      }
    }
    // Check exit conditions if in position
    else {
      if (this.checkExitConditions(tick) || this.checkRiskManagement(tick)) {
        this.exitPosition(tick);
      }
    }

    this.lastTick = tick;
  }

  private checkEntryConditions(tick: MarketTick): boolean {
    // Implement your entry condition logic here
    return this.config.entryConditions.every(condition => {
      // Add your indicator calculations and condition checks
      return true; // Placeholder
    });
  }

  private checkExitConditions(tick: MarketTick): boolean {
    // Implement your exit condition logic here
    return this.config.exitConditions.every(condition => {
      // Add your indicator calculations and condition checks
      return false; // Placeholder
    });
  }

  private checkRiskManagement(tick: MarketTick): boolean {
    if (!this.position) return false;

    const { stopLoss, takeProfit } = this.config.riskManagement;
    const priceDiff = tick.price - this.position.entryPrice;
    const percentChange = (priceDiff / this.position.entryPrice) * 100;

    if (this.position.type === 'BUY') {
      return percentChange <= -stopLoss || percentChange >= takeProfit;
    } else {
      return percentChange >= stopLoss || percentChange <= -takeProfit;
    }
  }

  private enterPosition(tick: MarketTick) {
    const signal: TradeSignal = {
      type: 'BUY', // You might want to make this dynamic based on your strategy
      symbol: this.config.symbol,
      price: tick.price,
      quantity: this.calculatePositionSize(tick),
      timestamp: tick.timestamp,
      strategy: 'HFT_SCALPING' // Replace with actual strategy name
    };

    this.position = { type: signal.type, entryPrice: tick.price };
    this.onSignal(signal);
  }

  private exitPosition(tick: MarketTick) {
    if (!this.position) return;

    const signal: TradeSignal = {
      type: this.position.type === 'BUY' ? 'SELL' : 'BUY',
      symbol: this.config.symbol,
      price: tick.price,
      quantity: this.calculatePositionSize(tick),
      timestamp: tick.timestamp,
      strategy: 'HFT_SCALPING' // Replace with actual strategy name
    };

    this.position = null;
    this.onSignal(signal);
  }

  private calculatePositionSize(tick: MarketTick): number {
    // Implement position sizing logic based on risk parameters
    return this.config.riskManagement.maxPositionSize;
  }

  stop() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  }
}
