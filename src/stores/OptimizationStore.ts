import { makeAutoObservable, runInAction } from 'mobx';
import { RootStore } from './RootStore';
import {
  OptimizationConfig,
  OptimizationResultNew,
  TradingStrategyNew,
} from '@/types/optimization';
import { OptimizationWebSocketService } from '@/services/optimizationWebSocket';

export class OptimizationStore {
  strategies: TradingStrategyNew[] = [];
  isOptimizing: boolean = false;
  currentOptimization: string | null = null;
  error: string | null = null;
  optimizationProgress: number = 0;
  private webSocket: OptimizationWebSocketService;

  constructor(private rootStore: RootStore) {
    makeAutoObservable(this);
    this.webSocket = new OptimizationWebSocketService();
    this.initializeWebSocket();
  }

  private async initializeWebSocket() {
    try {
      await this.webSocket.connect();
      runInAction(() => {
        this.error = null;
      });
    } catch (error) {
      console.error('Failed to connect to optimization WebSocket:', error);
      runInAction(() => {
        this.error = 'Failed to connect to optimization service. Please check your connection and try again.';
      });
    }
  }

  setStrategies(strategies: TradingStrategyNew[]) {
    this.strategies = strategies;
  }

  async startOptimization(strategyId: string, config: OptimizationConfig) {
    try {
      this.isOptimizing = true;
      this.currentOptimization = strategyId;
      this.error = null;
      this.optimizationProgress = 0;

      const optimizationId = await this.webSocket.startOptimization(strategyId, config);

      // Set up progress handler
      this.webSocket.onProgress(optimizationId, (progress) => {
        runInAction(() => {
          this.optimizationProgress = progress;
        });
      });

      // Set up result handler
      this.webSocket.onResult(optimizationId, (result) => {
        runInAction(() => {
          const strategy = this.strategies.find(s => s.id === strategyId);
          if (strategy) {
            strategy.results = result;
          }
          this.isOptimizing = false;
          this.currentOptimization = null;
          this.optimizationProgress = 100;
        });
        this.webSocket.removeHandlers(optimizationId);
      });

      // Set up error handler
      this.webSocket.onError(optimizationId, (error) => {
        runInAction(() => {
          this.error = error;
          this.isOptimizing = false;
          this.currentOptimization = null;
        });
        this.webSocket.removeHandlers(optimizationId);
      });

    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : 'An error occurred during optimization';
        this.isOptimizing = false;
        this.currentOptimization = null;
      });
    }
  }

  getStrategy(id: string): TradingStrategyNew | undefined {
    return this.strategies.find(s => s.id === id);
  }

  addStrategy(strategy: TradingStrategyNew) {
    this.strategies.push(strategy);
  }

  updateStrategy(id: string, updates: Partial<TradingStrategyNew>) {
    const strategy = this.strategies.find(s => s.id === id);
    if (strategy) {
      Object.assign(strategy, updates);
    }
  }

  deleteStrategy(id: string) {
    this.strategies = this.strategies.filter(s => s.id !== id);
  }

  // Clean up WebSocket connection when store is destroyed
  dispose() {
    this.webSocket.disconnect();
  }
}
