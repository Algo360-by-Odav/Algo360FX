import { makeAutoObservable } from 'mobx';
import { Position, Strategy } from './types';

export interface PortfolioStats {
  totalValue: number;
  totalPnL: number;
  dailyPnL: number;
  weeklyPnL: number;
  monthlyPnL: number;
}

export interface OptimizationParams {
  timeframe: string;
  startDate: Date;
  endDate: Date;
  initialBalance: number;
}

export interface OptimizationResult {
  parameters: Record<string, any>;
  performance: {
    totalReturn: number;
    sharpeRatio: number;
    maxDrawdown: number;
  };
}

export class PortfolioStore {
  positions: Position[] = [];
  strategies: Strategy[] = [];
  loading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setLoading(loading: boolean) {
    this.loading = loading;
  }

  setError(error: string | null) {
    this.error = error;
  }

  addPosition(position: Position) {
    this.positions.push(position);
  }

  addStrategy(strategy: Strategy) {
    this.strategies.push(strategy);
  }

  *fetchPortfolios() {
    try {
      this.loading = true;
      // TODO: Replace with actual API call
      // Simulating API delay
      yield new Promise(resolve => setTimeout(resolve, 1000));
      
      // Sample data
      const portfolios: any[] = [
        {
          id: 1,
          name: 'Conservative',
          balance: 50000,
          currency: 'USD',
          profit: 3100,
          profitPercentage: '+6.2%',
          risk: 'Low',
          trades: 12,
          stopLoss: 2,
          takeProfit: 4,
          description: 'Low-risk portfolio focused on stable gains',
          createdAt: '2025-01-01',
          updatedAt: '2025-01-22',
        },
        {
          id: 2,
          name: 'Balanced',
          balance: 35000,
          currency: 'USD',
          profit: 2730,
          profitPercentage: '+7.8%',
          risk: 'Medium',
          trades: 18,
          stopLoss: 3,
          takeProfit: 6,
          description: 'Balanced portfolio with moderate risk',
          createdAt: '2025-01-05',
          updatedAt: '2025-01-22',
        },
        {
          id: 3,
          name: 'Aggressive',
          balance: 25000,
          currency: 'USD',
          profit: 3100,
          profitPercentage: '+12.4%',
          risk: 'High',
          trades: 25,
          stopLoss: 4,
          takeProfit: 8,
          description: 'High-risk portfolio for maximum returns',
          createdAt: '2025-01-10',
          updatedAt: '2025-01-22',
        },
      ];

      runInAction(() => {
        // this.portfolios = portfolios;
        this.updateStats();
      });
    } catch (error) {
      runInAction(() => {
        this.error = 'Failed to fetch portfolios';
        console.error('Error fetching portfolios:', error);
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  *fetchTrades() {
    try {
      this.loading = true;
      // TODO: Replace with actual API call
      yield new Promise(resolve => setTimeout(resolve, 1000));

      // Sample data
      const trades: any[] = [
        {
          id: 1,
          portfolioId: 1,
          symbol: 'EUR/USD',
          type: 'Buy',
          entry: 1.0950,
          exit: 1.1020,
          profit: 350,
          profitDisplay: '+$350',
          date: '2025-01-22',
          status: 'Closed',
          size: 1,
        },
        {
          id: 2,
          portfolioId: 2,
          symbol: 'GBP/USD',
          type: 'Sell',
          entry: 1.2680,
          exit: 1.2620,
          profit: 300,
          profitDisplay: '+$300',
          date: '2025-01-21',
          status: 'Closed',
          size: 0.5,
        },
        {
          id: 3,
          portfolioId: 3,
          symbol: 'USD/JPY',
          type: 'Buy',
          entry: 148.50,
          exit: 148.20,
          profit: -150,
          profitDisplay: '-$150',
          date: '2025-01-21',
          status: 'Closed',
          size: 0.3,
        },
      ];

      runInAction(() => {
        // this.trades = trades;
      });
    } catch (error) {
      runInAction(() => {
        this.error = 'Failed to fetch trades';
        console.error('Error fetching trades:', error);
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  *createPortfolio(portfolio: any) {
    try {
      this.loading = true;
      // TODO: Replace with actual API call
      yield new Promise(resolve => setTimeout(resolve, 1000));

      const newPortfolio: any = {
        id: 1,
        name: portfolio.name,
        balance: portfolio.initialBalance,
        currency: portfolio.currency,
        profit: 0,
        profitPercentage: '0%',
        risk: portfolio.riskLevel,
        trades: 0,
        stopLoss: portfolio.stopLoss,
        takeProfit: portfolio.takeProfit,
        description: portfolio.description,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      runInAction(() => {
        // this.portfolios.push(newPortfolio);
        this.updateStats();
      });

      return newPortfolio;
    } catch (error) {
      runInAction(() => {
        this.error = 'Failed to create portfolio';
        console.error('Error creating portfolio:', error);
      });
      throw error;
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  *deletePortfolio(id: number) {
    try {
      this.loading = true;
      // TODO: Replace with actual API call
      yield new Promise(resolve => setTimeout(resolve, 1000));

      runInAction(() => {
        // this.portfolios = this.portfolios.filter(p => p.id !== id);
        this.updateStats();
      });
    } catch (error) {
      runInAction(() => {
        this.error = 'Failed to delete portfolio';
        console.error('Error deleting portfolio:', error);
      });
      throw error;
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  *fetchStrategies() {
    try {
      this.loading = true;
      // TODO: Replace with actual API call
      yield new Promise(resolve => setTimeout(resolve, 1000));

      // Sample strategies
      const strategies: any[] = [
        {
          id: 'trend_following',
          name: 'Trend Following',
          performance: {
            return: 0.15,
            volatility: 0.12,
            sharpeRatio: 1.25,
            maxDrawdown: 0.18,
            correlations: { trend_following: 1, mean_reversion: 0.3, stat_arb: -0.1 }
          }
        },
        {
          id: 'mean_reversion',
          name: 'Mean Reversion',
          performance: {
            return: 0.12,
            volatility: 0.09,
            sharpeRatio: 1.33,
            maxDrawdown: 0.15,
            correlations: { trend_following: 0.3, mean_reversion: 1, stat_arb: 0.2 }
          }
        },
        {
          id: 'stat_arb',
          name: 'Statistical Arbitrage',
          performance: {
            return: 0.18,
            volatility: 0.14,
            sharpeRatio: 1.29,
            maxDrawdown: 0.22,
            correlations: { trend_following: -0.1, mean_reversion: 0.2, stat_arb: 1 }
          }
        }
      ];

      runInAction(() => {
        // this.strategies = strategies;
      });
    } catch (error) {
      runInAction(() => {
        this.error = 'Failed to fetch strategies';
        console.error('Error fetching strategies:', error);
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  *optimizePortfolio(params: OptimizationParams) {
    try {
      // this.isOptimizing = true;
      // this.optimizationError = null;
      
      // TODO: Replace with actual API call
      yield new Promise(resolve => setTimeout(resolve, 1500));

      // Sample optimization result
      const result: OptimizationResult = {
        parameters: {
          trend_following: 0.4,
          mean_reversion: 0.35,
          stat_arb: 0.25
        },
        performance: {
          totalReturn: 0.147,
          sharpeRatio: 1.55,
          maxDrawdown: 0.16
        }
      };

      runInAction(() => {
        // this.optimizationResults = [result];
      });

      return result;
    } catch (error) {
      runInAction(() => {
        // this.optimizationError = 'Failed to optimize portfolio';
        console.error('Error optimizing portfolio:', error);
      });
      throw error;
    } finally {
      runInAction(() => {
        // this.isOptimizing = false;
      });
    }
  }

  private updateStats() {
    // const totalBalance = this.portfolios.reduce((sum, p) => sum + p.balance, 0);
    // const totalProfit = this.portfolios.reduce((sum, p) => sum + p.profit, 0);
    // const profitPercentage = (totalProfit / (totalBalance - totalProfit)) * 100;
    // const openTrades = this.trades.filter(t => t.status === 'Open').length;
    // const closedTrades = this.trades.filter(t => t.status === 'Closed');
    // const winningTrades = closedTrades.filter(t => t.profit > 0).length;
    // const winRate = closedTrades.length > 0 ? (winningTrades / closedTrades.length) * 100 : 0;

    // this.stats = {
    //   totalBalance,
    //   totalProfit,
    //   profitPercentage,
    //   openTrades,
    //   winRate,
    // };
  }

  // get hasOptimizationResults() {
  //   return this.optimizationResults.length > 0;
  // }

  // get latestOptimizationResult() {
  //   return this.optimizationResults[0];
  // }
}

// Create a singleton instance
const portfolioStore = new PortfolioStore();

export { portfolioStore };
