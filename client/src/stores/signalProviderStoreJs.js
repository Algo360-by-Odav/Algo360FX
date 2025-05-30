// signalProviderStoreJs.js - JavaScript version without TypeScript
// This avoids the Vite React plugin preamble detection error

import { makeAutoObservable, runInAction } from 'mobx';
import { format, subDays, subMonths } from 'date-fns';

class SignalProviderStore {
  providers = []
  activeSignals = []
  historicalSignals = []
  reviews = []
  subscriptions = []
  userSettings = {}
  notifications = []
  discussions = []
  educationalContent = []
  verifiedProviders = []
  
  // User state
  isLoggedIn = true
  currentUser = {
    id: 'user1',
    name: 'John Trader',
    email: 'john@algo360fx.com',
    accountBalance: 10000,
    subscribedProviders: [1, 2],
    preferences: {
      riskLevel: 'medium',
      defaultLotSize: 0.1,
      notificationSettings: {
        email: true,
        push: true,
        sms: false,
        quietHoursStart: '22:00',
        quietHoursEnd: '08:00'
      }
    }
  }
  
  // Filters and search state
  filters = {
    pair: 'all',
    timeframe: 'all',
    riskLevel: 'all',
    profitability: 'all',
    status: 'active'
  }
  searchQuery = ''
  sortBy = 'newest'
  
  constructor() {
    makeAutoObservable(this);
    this.initializeMockData();
  }
  
  // Initialize all mock data
  initializeMockData() {
    // Mock data for providers
    this.providers = [
      {
        id: 1,
        name: 'Alpha Signals',
        verified: true,
        description: 'Professional forex signals with high accuracy and consistent performance.',
        risk: {
          riskLevel: 'Medium',
          drawdown: 12.5,
          winRate: 68.2
        },
        performance: {
          totalReturn: 76.2,
          monthlyReturn: 8.4,
          winRate: 68.2,
          profitFactor: 2.3,
          totalSignals: 324,
          avgTradesPerMonth: 28
        },
        subscription: {
          subscribers: 1245,
          rating: 4.8,
          reviews: 187,
          price: 99
        },
        strategy: {
          type: 'Trend Following',
          instruments: ['EUR/USD', 'GBP/USD', 'USD/JPY'],
          timeframes: ['1H', '4H', 'Daily']
        },
        activeSince: '2023-01-15'
      },
      {
        id: 2,
        name: 'FX Master',
        verified: true,
        description: 'Specialized in major currency pairs with conservative risk management.',
        risk: {
          riskLevel: 'Low',
          drawdown: 8.2,
          winRate: 72.5
        },
        performance: {
          totalReturn: 48.7,
          monthlyReturn: 5.2,
          winRate: 72.5,
          profitFactor: 2.8,
          totalSignals: 256,
          avgTradesPerMonth: 22
        },
        subscription: {
          subscribers: 876,
          rating: 4.6,
          reviews: 124,
          price: 79
        },
        strategy: {
          type: 'Mean Reversion',
          instruments: ['EUR/USD', 'USD/CHF', 'AUD/USD'],
          timeframes: ['15M', '1H', '4H']
        },
        activeSince: '2023-04-22'
      }
    ];
    
    // Mock data for active signals
    this.activeSignals = [
      {
        id: 101,
        providerId: 1,
        pair: 'EUR/USD',
        type: 'BUY',
        entryPrice: 1.0921,
        stopLoss: 1.0880,
        takeProfit: [1.0980, 1.1020],
        riskReward: 1.5,
        status: 'active',
        openTime: '2025-05-22T10:30:00Z',
        pips: 15,
        profit: 150,
        confidence: 85
      },
      {
        id: 102,
        providerId: 1,
        pair: 'GBP/USD',
        type: 'SELL',
        entryPrice: 1.2654,
        stopLoss: 1.2695,
        takeProfit: [1.2590, 1.2550],
        riskReward: 1.6,
        status: 'active',
        openTime: '2025-05-22T14:15:00Z',
        pips: -8,
        profit: -80,
        confidence: 65
      },
      {
        id: 103,
        providerId: 2,
        pair: 'USD/JPY',
        type: 'BUY',
        entryPrice: 153.42,
        stopLoss: 153.10,
        takeProfit: [153.90, 154.20],
        riskReward: 1.6,
        status: 'active',
        openTime: '2025-05-23T02:45:00Z',
        pips: 22,
        profit: 220,
        confidence: 78
      }
    ];
  }
  
  getProviders() {
    return this.providers;
  }
  
  getActiveSignals() {
    return this.activeSignals;
  }
  
  getProviderById(id) {
    return this.providers.find(provider => provider.id === id);
  }
  
  getSignalsByProviderId(providerId) {
    return this.activeSignals.filter(signal => signal.providerId === providerId);
  }
  
  getSignalsByProvider(providerId) {
    return this.activeSignals.filter(signal => signal.providerId === providerId);
  }
  
  subscribeToProvider(providerId) {
    console.log(`Subscribed to provider with ID: ${providerId}`);
    // In a real implementation, this would handle subscription logic
  }
  
  unsubscribeFromProvider(providerId) {
    console.log(`Unsubscribed from provider with ID: ${providerId}`);
    // In a real implementation, this would handle unsubscription logic
  }
}

export default new SignalProviderStore();
