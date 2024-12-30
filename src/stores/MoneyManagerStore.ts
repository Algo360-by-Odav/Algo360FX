import { makeAutoObservable, runInAction } from 'mobx';
import { RootStore } from './RootStore';

export interface PortfolioSummary {
  aum: number;
  activePortfolios: number;
  monthlyReturn: number;
  totalClients: number;
}

export interface PerformanceMetrics {
  monthlyReturns: { month: string; value: number }[];
  sharpeRatio: number;
  maxDrawdown: number;
  winRate: number;
}

export interface AssetAllocation {
  asset: string;
  allocation: number;
  currentValue: number;
  targetAllocation: number;
}

export interface TradingActivity {
  date: string;
  type: string;
  symbol: string;
  amount: number;
  status: string;
}

export class MoneyManagerStore {
  private rootStore: RootStore;

  portfolioSummary: PortfolioSummary = {
    aum: 125000000, // $125M
    activePortfolios: 85,
    monthlyReturn: 8.5,
    totalClients: 320,
  };

  performanceMetrics: PerformanceMetrics = {
    monthlyReturns: [
      { month: 'Jan', value: 2.5 },
      { month: 'Feb', value: 3.1 },
      { month: 'Mar', value: 2.8 },
      { month: 'Apr', value: 3.4 },
      { month: 'May', value: 3.9 },
    ],
    sharpeRatio: 1.8,
    maxDrawdown: -12.5,
    winRate: 68.5,
  };

  assetAllocation: AssetAllocation[] = [
    { asset: 'Major Pairs', allocation: 45, currentValue: 56250000, targetAllocation: 40 },
    { asset: 'Cross Pairs', allocation: 30, currentValue: 37500000, targetAllocation: 35 },
    { asset: 'Exotic Pairs', allocation: 15, currentValue: 18750000, targetAllocation: 15 },
    { asset: 'Cash', allocation: 10, currentValue: 12500000, targetAllocation: 10 },
  ];

  recentTrades: TradingActivity[] = [
    { date: '2023-12-23', type: 'BUY', symbol: 'EUR/USD', amount: 100000, status: 'Completed' },
    { date: '2023-12-23', type: 'SELL', symbol: 'GBP/JPY', amount: 75000, status: 'Completed' },
    { date: '2023-12-22', type: 'BUY', symbol: 'USD/JPY', amount: 50000, status: 'Completed' },
    { date: '2023-12-22', type: 'SELL', symbol: 'EUR/GBP', amount: 25000, status: 'Completed' },
  ];

  loading: boolean = false;
  error: string | null = null;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this, {
      rootStore: false
    });
  }

  private resetError() {
    this.error = null;
  }

  private setLoading(value: boolean) {
    this.loading = value;
  }

  private setError(message: string) {
    this.error = message;
    this.loading = false;
  }

  async fetchPortfolioSummary() {
    try {
      this.setLoading(true);
      this.resetError();

      // In development, we'll use mock data
      if (process.env.NODE_ENV === 'development') {
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
        return;
      }

      // In production, we would fetch from API
      const response = await fetch('/api/money-manager/portfolio-summary');
      const data = await response.json();
      
      runInAction(() => {
        this.portfolioSummary = data;
      });
    } catch (error) {
      this.setError('Failed to fetch portfolio summary');
      console.error('Error fetching portfolio summary:', error);
    } finally {
      runInAction(() => {
        this.setLoading(false);
      });
    }
  }

  async fetchPerformanceMetrics() {
    try {
      this.setLoading(true);
      this.resetError();

      if (process.env.NODE_ENV === 'development') {
        await new Promise(resolve => setTimeout(resolve, 500));
        return;
      }

      const response = await fetch('/api/money-manager/performance-metrics');
      const data = await response.json();
      
      runInAction(() => {
        this.performanceMetrics = data;
      });
    } catch (error) {
      this.setError('Failed to fetch performance metrics');
      console.error('Error fetching performance metrics:', error);
    } finally {
      runInAction(() => {
        this.setLoading(false);
      });
    }
  }

  async fetchAssetAllocation() {
    try {
      this.setLoading(true);
      this.resetError();

      if (process.env.NODE_ENV === 'development') {
        await new Promise(resolve => setTimeout(resolve, 500));
        return;
      }

      const response = await fetch('/api/money-manager/asset-allocation');
      const data = await response.json();
      
      runInAction(() => {
        this.assetAllocation = data;
      });
    } catch (error) {
      this.setError('Failed to fetch asset allocation');
      console.error('Error fetching asset allocation:', error);
    } finally {
      runInAction(() => {
        this.setLoading(false);
      });
    }
  }

  async fetchRecentTrades() {
    try {
      this.setLoading(true);
      this.resetError();

      if (process.env.NODE_ENV === 'development') {
        await new Promise(resolve => setTimeout(resolve, 500));
        return;
      }

      const response = await fetch('/api/money-manager/recent-trades');
      const data = await response.json();
      
      runInAction(() => {
        this.recentTrades = data;
      });
    } catch (error) {
      this.setError('Failed to fetch recent trades');
      console.error('Error fetching recent trades:', error);
    } finally {
      runInAction(() => {
        this.setLoading(false);
      });
    }
  }
}

export default MoneyManagerStore;
