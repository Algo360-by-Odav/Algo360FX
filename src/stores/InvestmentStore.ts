import { makeAutoObservable } from 'mobx';
import { RootStore } from './RootStore';

export interface Portfolio {
  id: string;
  name: string;
  allocation: number;
  currentValue: number;
  initialValue: number;
  return: number;
  risk: 'Low' | 'Medium' | 'High';
  strategy: 'Forex' | 'Algo' | 'Signal' | 'Managed';
  lastUpdated: Date;
}

export interface Trade {
  id: string;
  portfolioId: string;
  pair: string;
  type: 'BUY' | 'SELL';
  entryPrice: number;
  exitPrice?: number;
  volume: number;
  profit?: number;
  status: 'OPEN' | 'CLOSED';
  openTime: Date;
  closeTime?: Date;
}

export interface SignalSubscription {
  id: string;
  providerId: string;
  providerName: string;
  status: 'ACTIVE' | 'INACTIVE';
  startDate: Date;
  endDate?: Date;
  cost: number;
  performance: number;
}

export interface InvestmentStats {
  totalInvestment: number;
  currentValue: number;
  totalReturn: number;
  activeStrategies: number;
  monthlyProfit: number;
  yearlyReturn: number;
}

export class InvestmentStore {
  portfolios: Portfolio[] = [];
  trades: Trade[] = [];
  signalSubscriptions: SignalSubscription[] = [];
  stats: InvestmentStats = {
    totalInvestment: 0,
    currentValue: 0,
    totalReturn: 0,
    activeStrategies: 0,
    monthlyProfit: 0,
    yearlyReturn: 0,
  };

  constructor(private rootStore: RootStore) {
    makeAutoObservable(this);
    this.loadMockData(); // For demonstration
  }

  addPortfolio(portfolio: Omit<Portfolio, 'id' | 'return' | 'lastUpdated'>) {
    const newPortfolio: Portfolio = {
      ...portfolio,
      id: Math.random().toString(36).substr(2, 9),
      return: 0,
      lastUpdated: new Date(),
    };
    this.portfolios.push(newPortfolio);
    this.updateStats();
  }

  updatePortfolio(portfolioId: string, updates: Partial<Portfolio>) {
    const portfolio = this.portfolios.find(p => p.id === portfolioId);
    if (portfolio) {
      Object.assign(portfolio, updates);
      portfolio.lastUpdated = new Date();
      this.updateStats();
    }
  }

  addTrade(trade: Omit<Trade, 'id' | 'status' | 'openTime' | 'profit'>) {
    const newTrade: Trade = {
      ...trade,
      id: Math.random().toString(36).substr(2, 9),
      status: 'OPEN',
      openTime: new Date(),
    };
    this.trades.push(newTrade);
  }

  closeTrade(tradeId: string, exitPrice: number) {
    const trade = this.trades.find(t => t.id === tradeId);
    if (trade) {
      trade.status = 'CLOSED';
      trade.exitPrice = exitPrice;
      trade.closeTime = new Date();
      trade.profit = (exitPrice - trade.entryPrice) * trade.volume * 
        (trade.type === 'BUY' ? 1 : -1);
      this.updateStats();
    }
  }

  addSignalSubscription(subscription: Omit<SignalSubscription, 'id' | 'status' | 'startDate' | 'performance'>) {
    const newSubscription: SignalSubscription = {
      ...subscription,
      id: Math.random().toString(36).substr(2, 9),
      status: 'ACTIVE',
      startDate: new Date(),
      performance: 0,
    };
    this.signalSubscriptions.push(newSubscription);
  }

  updateSubscriptionStatus(subscriptionId: string, status: 'ACTIVE' | 'INACTIVE') {
    const subscription = this.signalSubscriptions.find(s => s.id === subscriptionId);
    if (subscription) {
      subscription.status = status;
      if (status === 'INACTIVE') {
        subscription.endDate = new Date();
      }
    }
  }

  private updateStats() {
    const totalInvestment = this.portfolios.reduce((acc, p) => acc + p.initialValue, 0);
    const currentValue = this.portfolios.reduce((acc, p) => acc + p.currentValue, 0);

    this.stats = {
      totalInvestment,
      currentValue,
      totalReturn: ((currentValue - totalInvestment) / totalInvestment) * 100,
      activeStrategies: this.portfolios.length,
      monthlyProfit: this.calculateMonthlyProfit(),
      yearlyReturn: this.calculateYearlyReturn(),
    };
  }

  private calculateMonthlyProfit(): number {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    
    return this.trades
      .filter(t => t.status === 'CLOSED' && t.closeTime && t.closeTime >= monthStart)
      .reduce((acc, t) => acc + (t.profit || 0), 0);
  }

  private calculateYearlyReturn(): number {
    const now = new Date();
    const yearStart = new Date(now.getFullYear(), 0, 1);
    
    const yearTrades = this.trades
      .filter(t => t.status === 'CLOSED' && t.closeTime && t.closeTime >= yearStart);
    
    if (yearTrades.length === 0) return 0;
    
    const totalProfit = yearTrades.reduce((acc, t) => acc + (t.profit || 0), 0);
    const averageInvestment = this.stats.totalInvestment;
    
    return averageInvestment ? (totalProfit / averageInvestment) * 100 : 0;
  }

  private loadMockData() {
    // Add mock portfolios
    this.addPortfolio({
      name: 'Forex Growth Fund',
      allocation: 40,
      currentValue: 100000,
      initialValue: 85000,
      risk: 'Medium',
      strategy: 'Forex',
    });

    this.addPortfolio({
      name: 'Algo Trading Strategy',
      allocation: 25,
      currentValue: 62500,
      initialValue: 57500,
      risk: 'Low',
      strategy: 'Algo',
    });

    // Add mock trades
    this.addTrade({
      portfolioId: this.portfolios[0].id,
      pair: 'EUR/USD',
      type: 'BUY',
      entryPrice: 1.1850,
      volume: 1,
    });
    this.closeTrade(this.trades[0].id, 1.1950);

    // Add mock signal subscription
    this.addSignalSubscription({
      providerId: 'provider1',
      providerName: 'Top Forex Signals',
      cost: 29.99,
    });
  }
}
