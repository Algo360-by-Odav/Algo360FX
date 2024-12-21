import { makeAutoObservable, runInAction } from 'mobx';
import { RootStore } from './RootStore';
import { Trade, Portfolio } from '../types/trading';
import { api } from '../services/api';

export class TradeStore {
  trades: Trade[] = [];
  activeTrades: Trade[] = [];
  historicalTrades: Trade[] = [];
  portfolio: Portfolio = {
    balance: 0,
    equity: 0,
    margin: 0,
    freeMargin: 0,
    marginLevel: 0,
    positions: [],
  };
  loading: boolean = false;
  error: string | null = null;

  constructor(private rootStore: RootStore) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  async loadTrades() {
    try {
      this.loading = true;
      this.error = null;
      const response = await api.get('/trades');
      runInAction(() => {
        this.trades = response.data.trades;
        this.activeTrades = this.trades.filter(trade => !trade.closeTime);
        this.historicalTrades = this.trades.filter(trade => trade.closeTime);
      });
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : 'Failed to load trades';
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async placeTrade(trade: Partial<Trade>) {
    try {
      this.loading = true;
      this.error = null;
      const response = await api.post('/trades', trade);
      runInAction(() => {
        this.trades.push(response.data.trade);
        this.activeTrades.push(response.data.trade);
        this.updatePortfolio(response.data.portfolio);
      });
      this.rootStore.notificationStore.addNotification({
        type: 'success',
        title: 'Trade Placed',
        message: `Successfully placed ${trade.side} trade for ${trade.symbol}`,
      });
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : 'Failed to place trade';
      });
      this.rootStore.notificationStore.addNotification({
        type: 'error',
        title: 'Trade Failed',
        message: this.error,
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async closeTrade(tradeId: string) {
    try {
      this.loading = true;
      this.error = null;
      const response = await api.put(`/trades/${tradeId}/close`);
      runInAction(() => {
        const index = this.trades.findIndex(t => t.id === tradeId);
        if (index !== -1) {
          this.trades[index] = response.data.trade;
          this.activeTrades = this.activeTrades.filter(t => t.id !== tradeId);
          this.historicalTrades.push(response.data.trade);
          this.updatePortfolio(response.data.portfolio);
        }
      });
      this.rootStore.notificationStore.addNotification({
        type: 'success',
        title: 'Trade Closed',
        message: `Successfully closed trade ${tradeId}`,
      });
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : 'Failed to close trade';
      });
      this.rootStore.notificationStore.addNotification({
        type: 'error',
        title: 'Close Trade Failed',
        message: this.error,
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async updatePortfolio(portfolio: Portfolio) {
    try {
      this.loading = true;
      this.error = null;
      runInAction(() => {
        this.portfolio = portfolio;
      });
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : 'Failed to update portfolio';
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  get totalPnL(): number {
    return this.trades.reduce((total, trade) => {
      if (trade.pnl) {
        return total + trade.pnl;
      }
      return total;
    }, 0);
  }

  get winRate(): number {
    const closedTrades = this.historicalTrades;
    if (closedTrades.length === 0) return 0;
    const winningTrades = closedTrades.filter(trade => (trade.pnl || 0) > 0);
    return (winningTrades.length / closedTrades.length) * 100;
  }
}
