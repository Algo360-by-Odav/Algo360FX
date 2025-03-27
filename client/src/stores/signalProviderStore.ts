import { makeAutoObservable } from 'mobx';
import { RootStore } from './rootStore';

export interface SignalProvider {
  id: string;
  name: string;
  description: string;
  performance: {
    totalReturn: number;
    monthlyReturn: number;
    winRate: number;
    profitFactor: number;
    maxDrawdown: number;
    sharpeRatio: number;
    totalSignals: number;
    avgTradesPerMonth: number;
    avgHoldingTime: string;
  };
  risk: {
    riskLevel: 'Low' | 'Medium' | 'High';
    maxDrawdown: number;
    avgRiskPerTrade: number;
    marginRequired: number;
  };
  subscription: {
    price: number;
    period: 'Monthly' | 'Quarterly' | 'Yearly';
    subscribers: number;
    rating: number;
    reviews: number;
  };
  strategy: {
    type: string;
    instruments: string[];
    timeframes: string[];
    avgSignalsPerWeek: number;
    automationSupported: boolean;
  };
  status: 'Active' | 'Inactive' | 'Suspended';
  verified: boolean;
}

export interface Signal {
  id: string;
  providerId: string;
  pair: string;
  type: 'BUY' | 'SELL';
  entryPrice: number;
  stopLoss: number;
  takeProfit: number[];
  timeframe: string;
  timestamp: string;
  status: 'Open' | 'Closed' | 'Cancelled';
  result?: {
    exitPrice: number;
    pips: number;
    profitLoss: number;
    holdingTime: string;
  };
  rationale: string;
  confidence: number;
  risk: number;
}

export interface SignalSubscription {
  providerId: string;
  status: 'Active' | 'Expired' | 'Cancelled';
  autoTrade: boolean;
  riskMultiplier: number;
  startDate: string;
  endDate: string;
}

export class SignalProviderStore {
  providers: SignalProvider[] = [
    {
      id: '1',
      name: 'Alpha FX Signals',
      description: 'Professional forex signals based on institutional order flow and technical analysis.',
      performance: {
        totalReturn: 156.8,
        monthlyReturn: 8.5,
        winRate: 72,
        profitFactor: 2.8,
        maxDrawdown: -12.5,
        sharpeRatio: 2.1,
        totalSignals: 856,
        avgTradesPerMonth: 35,
        avgHoldingTime: '2d 4h',
      },
      risk: {
        riskLevel: 'Medium',
        maxDrawdown: 15,
        avgRiskPerTrade: 1.5,
        marginRequired: 10000,
      },
      subscription: {
        price: 199,
        period: 'Monthly',
        subscribers: 1250,
        rating: 4.8,
        reviews: 450,
      },
      strategy: {
        type: 'Swing Trading',
        instruments: ['EUR/USD', 'GBP/USD', 'USD/JPY', 'GBP/JPY'],
        timeframes: ['H4', 'D1'],
        avgSignalsPerWeek: 15,
        automationSupported: true,
      },
      status: 'Active',
      verified: true,
    },
    {
      id: '2',
      name: 'Precision Scalping',
      description: 'High-frequency scalping signals with institutional grade execution.',
      performance: {
        totalReturn: 98.5,
        monthlyReturn: 6.2,
        winRate: 85,
        profitFactor: 3.2,
        maxDrawdown: -8.5,
        sharpeRatio: 2.5,
        totalSignals: 2450,
        avgTradesPerMonth: 120,
        avgHoldingTime: '45m',
      },
      risk: {
        riskLevel: 'High',
        maxDrawdown: 12,
        avgRiskPerTrade: 0.5,
        marginRequired: 5000,
      },
      subscription: {
        price: 299,
        period: 'Monthly',
        subscribers: 850,
        rating: 4.6,
        reviews: 320,
      },
      strategy: {
        type: 'Scalping',
        instruments: ['EUR/USD', 'GBP/USD', 'EUR/JPY'],
        timeframes: ['M5', 'M15'],
        avgSignalsPerWeek: 60,
        automationSupported: true,
      },
      status: 'Active',
      verified: true,
    },
  ];

  activeSignals: Signal[] = [
    {
      id: '1',
      providerId: '1',
      pair: 'EUR/USD',
      type: 'BUY',
      entryPrice: 1.0950,
      stopLoss: 1.0920,
      takeProfit: [1.0980, 1.1010],
      timeframe: 'H4',
      timestamp: '2024-01-24T10:30:00Z',
      status: 'Open',
      rationale: 'Break of key resistance with institutional buying pressure',
      confidence: 85,
      risk: 2,
    },
    {
      id: '2',
      providerId: '1',
      pair: 'GBP/JPY',
      type: 'SELL',
      entryPrice: 186.50,
      stopLoss: 186.80,
      takeProfit: [186.20, 185.90],
      timeframe: 'H4',
      timestamp: '2024-01-24T08:15:00Z',
      status: 'Closed',
      result: {
        exitPrice: 186.20,
        pips: 30,
        profitLoss: 450,
        holdingTime: '4h 15m',
      },
      rationale: 'Bearish divergence at key resistance level',
      confidence: 78,
      risk: 1.5,
    },
  ];

  subscriptions: SignalSubscription[] = [
    {
      providerId: '1',
      status: 'Active',
      autoTrade: true,
      riskMultiplier: 1,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
    },
  ];

  selectedProvider: string | null = null;
  error: string | null = null;

  constructor(private rootStore: RootStore) {
    makeAutoObservable(this);
  }

  getProviders = () => {
    return this.providers;
  };

  getActiveSignals = () => {
    return this.activeSignals;
  };

  getSubscriptions = () => {
    return this.subscriptions;
  };

  getProviderById = (id: string) => {
    return this.providers.find(provider => provider.id === id);
  };

  getSignalsByProvider = (providerId: string) => {
    return this.activeSignals.filter(signal => signal.providerId === providerId);
  };

  subscribeToProvider = (providerId: string, autoTrade: boolean, riskMultiplier: number) => {
    const subscription: SignalSubscription = {
      providerId,
      status: 'Active',
      autoTrade,
      riskMultiplier,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    };
    this.subscriptions.push(subscription);
  };

  unsubscribeFromProvider = (providerId: string) => {
    const subscription = this.subscriptions.find(s => s.providerId === providerId);
    if (subscription) {
      subscription.status = 'Cancelled';
    }
  };

  updateAutoTradeSettings = (providerId: string, autoTrade: boolean, riskMultiplier: number) => {
    const subscription = this.subscriptions.find(s => s.providerId === providerId);
    if (subscription) {
      subscription.autoTrade = autoTrade;
      subscription.riskMultiplier = riskMultiplier;
    }
  };

  setSelectedProvider = (providerId: string | null) => {
    this.selectedProvider = providerId;
  };

  clearError = () => {
    this.error = null;
  };
}
