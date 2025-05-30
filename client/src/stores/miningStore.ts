import { makeAutoObservable, runInAction } from 'mobx';
import { miningService, MiningStats, TradingStats, MarketPrediction } from '../services/miningService';

export class MiningStore {
  miningStats: MiningStats | null = null;
  tradingStats: TradingStats | null = null;
  marketPredictions: MarketPrediction | null = null;
  isLoading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  async fetchMiningStats() {
    try {
      this.isLoading = true;
      const stats = await miningService.getMiningStats();
      runInAction(() => {
        this.miningStats = stats;
        this.error = null;
      });
    } catch (error) {
      runInAction(() => {
        this.error = 'Failed to fetch mining stats';
        console.error(error);
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async fetchTradingStats() {
    try {
      this.isLoading = true;
      const stats = await miningService.getTradingStats();
      runInAction(() => {
        this.tradingStats = stats;
        this.error = null;
      });
    } catch (error) {
      runInAction(() => {
        this.error = 'Failed to fetch trading stats';
        console.error(error);
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async fetchMarketPredictions() {
    try {
      this.isLoading = true;
      const predictions = await miningService.getMarketPredictions();
      runInAction(() => {
        this.marketPredictions = predictions;
        this.error = null;
      });
    } catch (error) {
      runInAction(() => {
        this.error = 'Failed to fetch market predictions';
        console.error(error);
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async updateTradingSettings(settings: {
    enabled: boolean;
    strategy: string;
    threshold: number;
  }) {
    try {
      await miningService.updateTradingSettings(settings);
      await this.fetchTradingStats();
    } catch (error) {
      runInAction(() => {
        this.error = 'Failed to update trading settings';
        console.error(error);
      });
    }
  }

  async updateMiningConfig(config: {
    algorithm: string;
    powerLimit: number;
    poolUrl: string;
  }) {
    try {
      await miningService.updateMiningConfig(config);
      await this.fetchMiningStats();
    } catch (error) {
      runInAction(() => {
        this.error = 'Failed to update mining configuration';
        console.error(error);
      });
    }
  }
}

export const miningStore = new MiningStore();
export default miningStore;
