import { makeAutoObservable, runInAction } from 'mobx';
import { RootStore } from './RootStore';
import { api } from '@/services/api';

export class StrategyStore {
  loading: boolean = false;
  error: string | null = null;
  strategies: Strategy[] = [];
  activeStrategy: Strategy | null = null;
  backtestResults: BacktestResult[] = [];

  constructor(private rootStore: RootStore) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  async loadStrategies() {
    try {
      this.loading = true;
      this.error = null;
      const response = await api.get('/strategies');
      runInAction(() => {
        this.strategies = response.data.strategies;
      });
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : 'Failed to load strategies';
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async createStrategy(strategy: Partial<Strategy>) {
    try {
      this.loading = true;
      this.error = null;
      const response = await api.post('/strategies', strategy);
      runInAction(() => {
        this.strategies.push(response.data.strategy);
      });
      this.rootStore.notificationStore.addNotification({
        type: 'success',
        title: 'Strategy Created',
        message: `Successfully created strategy: ${strategy.name}`,
      });
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : 'Failed to create strategy';
      });
      this.rootStore.notificationStore.addNotification({
        type: 'error',
        title: 'Strategy Creation Failed',
        message: this.error,
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async updateStrategy(strategyId: string, data: Partial<Strategy>) {
    try {
      this.loading = true;
      this.error = null;
      const response = await api.put(`/strategies/${strategyId}`, data);
      runInAction(() => {
        const index = this.strategies.findIndex(s => s.id === strategyId);
        if (index !== -1) {
          this.strategies[index] = response.data.strategy;
          if (this.activeStrategy?.id === strategyId) {
            this.activeStrategy = response.data.strategy;
          }
        }
      });
      this.rootStore.notificationStore.addNotification({
        type: 'success',
        title: 'Strategy Updated',
        message: `Successfully updated strategy: ${data.name}`,
      });
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : 'Failed to update strategy';
      });
      this.rootStore.notificationStore.addNotification({
        type: 'error',
        title: 'Strategy Update Failed',
        message: this.error,
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async deleteStrategy(strategyId: string) {
    try {
      this.loading = true;
      this.error = null;
      await api.delete(`/strategies/${strategyId}`);
      runInAction(() => {
        this.strategies = this.strategies.filter(s => s.id !== strategyId);
        if (this.activeStrategy?.id === strategyId) {
          this.activeStrategy = null;
        }
      });
      this.rootStore.notificationStore.addNotification({
        type: 'success',
        title: 'Strategy Deleted',
        message: 'Strategy successfully deleted',
      });
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : 'Failed to delete strategy';
      });
      this.rootStore.notificationStore.addNotification({
        type: 'error',
        title: 'Strategy Deletion Failed',
        message: this.error,
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async runBacktest(
    strategyId: string,
    params: {
      startDate: Date;
      endDate: Date;
      symbol: string;
      timeframe: TimeFrame;
      initialBalance: number;
    }
  ) {
    try {
      this.loading = true;
      this.error = null;
      const response = await api.post(`/strategies/${strategyId}/backtest`, params);
      runInAction(() => {
        this.backtestResults.push(response.data.result);
      });
      this.rootStore.notificationStore.addNotification({
        type: 'success',
        title: 'Backtest Complete',
        message: `Backtest completed successfully for ${params.symbol}`,
      });
      return response.data.result;
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : 'Failed to run backtest';
      });
      this.rootStore.notificationStore.addNotification({
        type: 'error',
        title: 'Backtest Failed',
        message: this.error,
      });
      throw error;
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  setActiveStrategy(strategy: Strategy | null) {
    this.activeStrategy = strategy;
  }

  get sortedStrategies(): Strategy[] {
    return [...this.strategies].sort((a, b) => {
      if (a.performance && b.performance) {
        return b.performance - a.performance;
      }
      return 0;
    });
  }

  get bestPerformingStrategy(): Strategy | null {
    return this.sortedStrategies[0] || null;
  }
}
