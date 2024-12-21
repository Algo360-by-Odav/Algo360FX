import { makeAutoObservable, runInAction } from 'mobx';
import { RootStore } from './RootStore';

interface Position {
  symbol: string;
  volume: number;
  averagePrice: number;
  unrealizedPnL: number;
  realizedPnL: number;
  margin: number;
}

interface PortfolioMetrics {
  balance: number;
  equity: number;
  margin: number;
  freeMargin: number;
  marginLevel: number;
  totalPnL: number;
  dailyPnL: number;
  weeklyPnL: number;
  monthlyPnL: number;
}

interface PortfolioPerformance {
  returns: number;
  sharpeRatio: number;
  maxDrawdown: number;
  winRate: number;
  profitFactor: number;
  averageWin: number;
  averageLoss: number;
  bestTrade: number;
  worstTrade: number;
  totalTrades: number;
}

export class PortfolioStore {
  rootStore: RootStore;
  positions: Map<string, Position> = new Map();
  metrics: PortfolioMetrics | null = null;
  performance: PortfolioPerformance | null = null;
  historicalEquity: { timestamp: number; equity: number }[] = [];
  loading: boolean = false;
  error: string | null = null;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  async fetchPositions() {
    try {
      this.loading = true;
      this.error = null;

      // Simulate API call
      const response = await fetch('/api/positions');
      const data = await response.json();

      runInAction(() => {
        this.positions.clear();
        data.forEach((position: Position) => this.positions.set(position.symbol, position));
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : 'Failed to fetch positions';
        this.loading = false;
      });
    }
  }

  async fetchMetrics() {
    try {
      this.loading = true;
      this.error = null;

      // Simulate API call
      const response = await fetch('/api/portfolio/metrics');
      const data = await response.json();

      runInAction(() => {
        this.metrics = data;
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : 'Failed to fetch metrics';
        this.loading = false;
      });
    }
  }

  async fetchPerformance() {
    try {
      this.loading = true;
      this.error = null;

      // Simulate API call
      const response = await fetch('/api/portfolio/performance');
      const data = await response.json();

      runInAction(() => {
        this.performance = data;
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : 'Failed to fetch performance';
        this.loading = false;
      });
    }
  }

  async fetchHistoricalEquity(timeframe: string) {
    try {
      this.loading = true;
      this.error = null;

      // Simulate API call
      const response = await fetch(`/api/portfolio/equity-history?timeframe=${timeframe}`);
      const data = await response.json();

      runInAction(() => {
        this.historicalEquity = data;
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : 'Failed to fetch historical equity';
        this.loading = false;
      });
    }
  }

  get totalEquity(): number {
    return this.metrics?.equity || 0;
  }

  get totalMargin(): number {
    return this.metrics?.margin || 0;
  }

  get marginLevel(): number {
    return this.metrics?.marginLevel || 0;
  }

  get openPositions(): Position[] {
    return Array.from(this.positions.values());
  }

  get portfolioAllocation(): { symbol: string; percentage: number }[] {
    const total = this.openPositions.reduce((sum, pos) => sum + Math.abs(pos.volume), 0);
    return this.openPositions.map(pos => ({
      symbol: pos.symbol,
      percentage: (Math.abs(pos.volume) / total) * 100,
    }));
  }

  get totalUnrealizedPnL(): number {
    return this.openPositions.reduce((sum, pos) => sum + pos.unrealizedPnL, 0);
  }

  get totalRealizedPnL(): number {
    return this.openPositions.reduce((sum, pos) => sum + pos.realizedPnL, 0);
  }
}
