import { makeAutoObservable } from 'mobx';
import { RootStore } from './RootStore';

export interface Signal {
  id: string;
  pair: string;
  type: 'BUY' | 'SELL';
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  timestamp: Date;
  status: 'ACTIVE' | 'CLOSED' | 'CANCELLED';
  profit?: number;
  pips?: number;
}

export interface SignalPerformance {
  totalSignals: number;
  successfulSignals: number;
  failedSignals: number;
  successRate: number;
  averageProfit: number;
  averagePips: number;
  monthlyRevenue: number;
}

export interface Subscriber {
  id: string;
  name: string;
  email: string;
  subscriptionDate: Date;
  status: 'ACTIVE' | 'INACTIVE';
  lastActive: Date;
}

export class SignalProviderStore {
  signals: Signal[] = [];
  subscribers: Subscriber[] = [];
  performance: SignalPerformance = {
    totalSignals: 0,
    successfulSignals: 0,
    failedSignals: 0,
    successRate: 0,
    averageProfit: 0,
    averagePips: 0,
    monthlyRevenue: 0,
  };

  constructor(private rootStore: RootStore) {
    makeAutoObservable(this);
    this.loadMockData(); // For demonstration
  }

  addSignal(signal: Omit<Signal, 'id' | 'timestamp' | 'status'>) {
    const newSignal: Signal = {
      ...signal,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      status: 'ACTIVE',
    };
    this.signals.push(newSignal);
    this.updatePerformance();
  }

  closeSignal(signalId: string, profit: number, pips: number) {
    const signal = this.signals.find(s => s.id === signalId);
    if (signal) {
      signal.status = 'CLOSED';
      signal.profit = profit;
      signal.pips = pips;
      this.updatePerformance();
    }
  }

  addSubscriber(subscriber: Omit<Subscriber, 'id' | 'subscriptionDate' | 'status' | 'lastActive'>) {
    const newSubscriber: Subscriber = {
      ...subscriber,
      id: Math.random().toString(36).substr(2, 9),
      subscriptionDate: new Date(),
      status: 'ACTIVE',
      lastActive: new Date(),
    };
    this.subscribers.push(newSubscriber);
  }

  updateSubscriberStatus(subscriberId: string, status: 'ACTIVE' | 'INACTIVE') {
    const subscriber = this.subscribers.find(s => s.id === subscriberId);
    if (subscriber) {
      subscriber.status = status;
      if (status === 'ACTIVE') {
        subscriber.lastActive = new Date();
      }
    }
  }

  private updatePerformance() {
    const closedSignals = this.signals.filter(s => s.status === 'CLOSED');
    const successfulSignals = closedSignals.filter(s => (s.profit || 0) > 0);

    this.performance = {
      totalSignals: this.signals.length,
      successfulSignals: successfulSignals.length,
      failedSignals: closedSignals.length - successfulSignals.length,
      successRate: closedSignals.length ? (successfulSignals.length / closedSignals.length) * 100 : 0,
      averageProfit: closedSignals.length
        ? closedSignals.reduce((acc, s) => acc + (s.profit || 0), 0) / closedSignals.length
        : 0,
      averagePips: closedSignals.length
        ? closedSignals.reduce((acc, s) => acc + (s.pips || 0), 0) / closedSignals.length
        : 0,
      monthlyRevenue: this.calculateMonthlyRevenue(),
    };
  }

  private calculateMonthlyRevenue(): number {
    // Mock calculation - replace with actual logic
    return this.subscribers.filter(s => s.status === 'ACTIVE').length * 29.99;
  }

  private loadMockData() {
    // Add mock signals
    this.addSignal({
      pair: 'EUR/USD',
      type: 'BUY',
      entryPrice: 1.1850,
      stopLoss: 1.1800,
      takeProfit: 1.1950,
    });
    this.closeSignal(this.signals[0].id, 100, 100);

    // Add mock subscribers
    this.addSubscriber({
      name: 'John Doe',
      email: 'john@example.com',
    });
  }
}
