import { makeAutoObservable, runInAction } from 'mobx';
import { strategyService, Strategy, CreateStrategyInput, UpdateStrategyInput } from '../services/strategyService';

interface StrategyState {
  strategies: Strategy[];
  selectedStrategy: Strategy | null;
  isLoading: boolean;
  error: string | null;
}

class StrategyStore {
  strategies: Strategy[] = [];
  selectedStrategy: Strategy | null = null;
  isLoading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  *fetchStrategies(): Generator<Promise<Strategy[]>, void, Strategy[]> {
    try {
      this.isLoading = true;
      const strategies = yield strategyService.getStrategies();
      runInAction(() => {
        this.strategies = strategies;
        this.error = null;
      });
    } catch (error) {
      runInAction(() => {
        this.error = 'Failed to fetch strategies';
        console.error('Error fetching strategies:', error);
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  *fetchStrategy(id: string): Generator<Promise<Strategy>, void, Strategy> {
    try {
      this.isLoading = true;
      const strategy = yield strategyService.getStrategy(id);
      runInAction(() => {
        this.selectedStrategy = strategy;
        this.error = null;
      });
    } catch (error) {
      runInAction(() => {
        this.error = 'Failed to fetch strategy';
        console.error('Error fetching strategy:', error);
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  *createStrategy(input: CreateStrategyInput): Generator<Promise<Strategy>, Strategy, Strategy> {
    try {
      this.isLoading = true;
      const strategy = yield strategyService.createStrategy(input);
      runInAction(() => {
        this.strategies.push(strategy);
        this.selectedStrategy = strategy;
        this.error = null;
      });
      return strategy;
    } catch (error) {
      runInAction(() => {
        this.error = 'Failed to create strategy';
        console.error('Error creating strategy:', error);
      });
      throw error;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  *updateStrategy(id: string, input: UpdateStrategyInput): Generator<Promise<Strategy>, Strategy, Strategy> {
    try {
      this.isLoading = true;
      const strategy = yield strategyService.updateStrategy(id, input);
      runInAction(() => {
        this.strategies = this.strategies.map(s => s.id === id ? strategy : s);
        if (this.selectedStrategy?.id === id) {
          this.selectedStrategy = strategy;
        }
        this.error = null;
      });
      return strategy;
    } catch (error) {
      runInAction(() => {
        this.error = 'Failed to update strategy';
        console.error('Error updating strategy:', error);
      });
      throw error;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  *deleteStrategy(id: string): Generator<Promise<void>, void, void> {
    try {
      this.isLoading = true;
      yield strategyService.deleteStrategy(id);
      runInAction(() => {
        this.strategies = this.strategies.filter(s => s.id !== id);
        if (this.selectedStrategy?.id === id) {
          this.selectedStrategy = null;
        }
        this.error = null;
      });
    } catch (error) {
      runInAction(() => {
        this.error = 'Failed to delete strategy';
        console.error('Error deleting strategy:', error);
      });
      throw error;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  *activateStrategy(id: string): Generator<Promise<Strategy>, void, Strategy> {
    try {
      this.isLoading = true;
      const strategy = yield strategyService.activateStrategy(id);
      runInAction(() => {
        this.strategies = this.strategies.map(s => s.id === id ? strategy : s);
        if (this.selectedStrategy?.id === id) {
          this.selectedStrategy = strategy;
        }
        this.error = null;
      });
    } catch (error) {
      runInAction(() => {
        this.error = 'Failed to activate strategy';
        console.error('Error activating strategy:', error);
      });
      throw error;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  *deactivateStrategy(id: string): Generator<Promise<Strategy>, void, Strategy> {
    try {
      this.isLoading = true;
      const strategy = yield strategyService.deactivateStrategy(id);
      runInAction(() => {
        this.strategies = this.strategies.map(s => s.id === id ? strategy : s);
        if (this.selectedStrategy?.id === id) {
          this.selectedStrategy = strategy;
        }
        this.error = null;
      });
    } catch (error) {
      runInAction(() => {
        this.error = 'Failed to deactivate strategy';
        console.error('Error deactivating strategy:', error);
      });
      throw error;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  setSelectedStrategy(strategy: Strategy | null) {
    this.selectedStrategy = strategy;
  }

  clearError() {
    this.error = null;
  }
}

export type { StrategyState };
export { StrategyStore };
export const strategyStore = new StrategyStore();
