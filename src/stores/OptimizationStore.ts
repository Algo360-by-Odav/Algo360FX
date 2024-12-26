import { makeAutoObservable, runInAction } from 'mobx';
import { RootStore } from './RootStore';
import {
  OptimizationConfig,
  OptimizationResultNew,
  TradingStrategyNew,
} from '@/types/optimization';
import { OptimizationService } from '@/services/optimization';

export class OptimizationStore {
  strategies: TradingStrategyNew[] = [];
  isOptimizing: boolean = false;
  currentOptimization: string | null = null;
  error: string | null = null;
  optimizationProgress: number = 0;
  private optimizationService: OptimizationService;

  constructor(private rootStore: RootStore) {
    makeAutoObservable(this);
    this.optimizationService = new OptimizationService();
    this.initializeOptimizationService();
  }

  private initializeOptimizationService() {
    this.optimizationService.onProgress((progress: number) => {
      runInAction(() => {
        this.optimizationProgress = progress;
      });
    });

    this.optimizationService.onResult((result: OptimizationResultNew) => {
      this.handleOptimizationResult(result);
    });

    this.optimizationService.onError((error: string) => {
      this.handleOptimizationError(error);
    });
  }

  startOptimization = async (strategyId: string, config: OptimizationConfig) => {
    try {
      this.isOptimizing = true;
      this.error = null;
      this.optimizationProgress = 0;
      this.currentOptimization = strategyId;
      
      await this.optimizationService.startOptimization(strategyId, config);
    } catch (error) {
      this.handleOptimizationError(error instanceof Error ? error.message : 'Unknown error');
    }
  };

  stopOptimization = () => {
    if (this.isOptimizing) {
      this.optimizationService.stopOptimization();
      this.isOptimizing = false;
      this.currentOptimization = null;
      this.optimizationProgress = 0;
    }
  };

  private handleOptimizationResult = (result: OptimizationResultNew) => {
    runInAction(() => {
      this.isOptimizing = false;
      this.currentOptimization = null;
      this.optimizationProgress = 100;

      const strategy = this.strategies.find(s => s.id === result.strategyId);
      if (strategy) {
        strategy.results = result;
      }
    });
  };

  private handleOptimizationError = (error: string) => {
    runInAction(() => {
      this.isOptimizing = false;
      this.currentOptimization = null;
      this.error = error;
      this.optimizationProgress = 0;
    });
  };

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

  cleanup = () => {
    this.optimizationService.disconnect();
  };
}
