import { makeAutoObservable, runInAction } from 'mobx';
import { RootStore } from './RootStore';
import { Trade, Position, Portfolio } from '../types/trading';

export class TradeStore {
  private rootStore: RootStore;
  trades: Trade[] = [];
  positions: Position[] = [];
  portfolio: Portfolio = {
    userId: '',
    balance: 0,
    equity: 0,
    margin: 0,
    freeMargin: 0,
    marginLevel: 0,
    positions: [],
  };

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  async fetchTrades() {
    try {
      // TODO: Implement API call to fetch trades
      const response = await fetch('/api/trades');
      const trades = await response.json();
      
      runInAction(() => {
        this.trades = trades;
      });
    } catch (error) {
      console.error('Error fetching trades:', error);
    }
  }

  async fetchPositions() {
    try {
      // TODO: Implement API call to fetch positions
      const response = await fetch('/api/positions');
      const positions = await response.json();
      
      runInAction(() => {
        this.positions = positions;
      });
    } catch (error) {
      console.error('Error fetching positions:', error);
    }
  }

  async fetchPortfolio() {
    try {
      // TODO: Implement API call to fetch portfolio
      const response = await fetch('/api/portfolio');
      const portfolio = await response.json();
      
      runInAction(() => {
        this.portfolio = portfolio;
      });
    } catch (error) {
      console.error('Error fetching portfolio:', error);
    }
  }

  async placeTrade(trade: Omit<Trade, 'id' | 'status'>) {
    try {
      // TODO: Implement API call to place trade
      const response = await fetch('/api/trades', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(trade),
      });
      
      const newTrade = await response.json();
      
      runInAction(() => {
        this.trades.push(newTrade);
      });

      return newTrade;
    } catch (error) {
      console.error('Error placing trade:', error);
      throw error;
    }
  }

  async closeTrade(tradeId: string) {
    try {
      // TODO: Implement API call to close trade
      await fetch(`/api/trades/${tradeId}/close`, {
        method: 'POST',
      });
      
      runInAction(() => {
        const trade = this.trades.find(t => t.id === tradeId);
        if (trade) {
          trade.status = 'closed';
        }
      });
    } catch (error) {
      console.error('Error closing trade:', error);
      throw error;
    }
  }

  async closePosition(symbol: string) {
    try {
      // TODO: Implement API call to close position
      await fetch(`/api/positions/${symbol}/close`, {
        method: 'POST',
      });
      
      runInAction(() => {
        this.positions = this.positions.filter(p => p.symbol !== symbol);
      });
    } catch (error) {
      console.error('Error closing position:', error);
      throw error;
    }
  }

  get openTrades() {
    return this.trades.filter(trade => trade.status === 'open');
  }

  get closedTrades() {
    return this.trades.filter(trade => trade.status === 'closed');
  }

  get totalPnL() {
    return this.trades.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
  }

  get openPositionsCount() {
    return this.positions.length;
  }

  get totalEquity() {
    return this.portfolio.equity;
  }

  get marginLevel() {
    return this.portfolio.marginLevel;
  }

  dispose() {
    // Clean up any subscriptions or intervals if needed
  }
}
