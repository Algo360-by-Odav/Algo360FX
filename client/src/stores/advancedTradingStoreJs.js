// advancedTradingStoreJs.js - JavaScript version without JSX
// This avoids the Vite React plugin preamble detection error

import { makeAutoObservable, runInAction } from 'mobx';

// Sample data
const sampleAlgorithms = [
  {
    id: '1',
    name: 'MA Crossover Strategy',
    description: 'Simple moving average crossover strategy using 20 and 50 period MAs',
    status: 'active',
    type: 'trend',
    performance: {
      totalReturns: 18.5,
      sharpeRatio: 1.8,
      maxDrawdown: 12.3,
      winRate: 68.5,
    },
    settings: {
      timeframe: '1h',
      position: {
        size: 0.15,
        maxLeverage: 3
      },
      stopLoss: 1.5,
      takeProfit: 3,
      indicators: ['RSI', 'Bollinger Bands']
    },
    lastModified: '2025-01-22T15:30:00Z',
    createdAt: '2025-01-19T14:00:00Z'
  },
  {
    id: '2',
    name: 'RSI Mean Reversion',
    description: 'Mean reversion strategy using RSI indicator for overbought/oversold conditions',
    status: 'inactive',
    type: 'mean-reversion',
    performance: {
      totalReturns: 12.7,
      sharpeRatio: 1.5,
      maxDrawdown: 8.9,
      winRate: 72.3,
    },
    settings: {
      timeframe: '4h',
      position: {
        size: 0.1,
        maxLeverage: 2
      },
      stopLoss: 2.0,
      takeProfit: 3.5,
      indicators: ['RSI', 'MA50']
    },
    lastModified: '2025-02-15T10:45:00Z',
    createdAt: '2025-02-10T09:30:00Z'
  },
  {
    id: '3',
    name: 'MACD Momentum',
    description: 'Momentum strategy using MACD for trend direction and strength',
    status: 'inactive',
    type: 'trend',
    performance: {
      totalReturns: 21.3,
      sharpeRatio: 2.1,
      maxDrawdown: 15.2,
      winRate: 65.8,
    },
    settings: {
      timeframe: '1D',
      position: {
        size: 0.2,
        maxLeverage: 4
      },
      stopLoss: 3.0,
      takeProfit: 6.0,
      indicators: ['MACD', 'Volume Profile']
    },
    lastModified: '2025-03-05T14:20:00Z',
    createdAt: '2025-03-01T11:15:00Z'
  }
];

const samplePerformanceData = {
  equity: [10000, 10500, 11200, 10800, 11500, 12000, 11800, 12500, 13000, 12800, 13500, 14000],
  dates: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  trades: {
    wins: 156,
    losses: 56,
    total: 212
  },
  returns: {
    daily: [0.2, 0.5, -0.3, 0.8, 0.1, -0.2, 0.4, 0.3, -0.1, 0.6, 0.2, 0.4],
    weekly: [1.2, 2.1, -0.8, 1.5, 0.9, 1.8],
    monthly: [5.0, 6.7, 4.2, 8.5]
  },
  metrics: {
    sharpeRatio: 1.85,
    sortino: 2.15,
    maxDrawdown: 8.4,
    winRate: 73.6,
    profitFactor: 1.85,
    averageTrade: 127,
  },
  strategyReturns: {
    momentum: 35,
    meanReversion: 25,
    arbitrage: 20,
    marketMaking: 15,
    other: 5,
  },
};

// Backtesting results
const sampleBacktestResults = {
  '1': [
    {
      id: 'bt1',
      algorithmId: '1',
      startDate: '2024-01-01',
      endDate: '2024-04-01',
      symbol: 'EURUSD',
      timeframe: '1h',
      initialCapital: 10000,
      finalCapital: 11850,
      totalReturn: 18.5,
      annualizedReturn: 55.5,
      sharpeRatio: 1.8,
      sortino: 2.1,
      maxDrawdown: 12.3,
      winRate: 68.5,
      profitFactor: 1.9,
      totalTrades: 156,
      winningTrades: 107,
      losingTrades: 49,
      averageWin: 210.5,
      averageLoss: -120.3,
      largestWin: 850,
      largestLoss: -450,
      averageTradeDuration: '4h 12m',
      equityCurve: [10000, 10200, 10500, 10300, 10700, 11000, 10800, 11200, 11500, 11300, 11700, 11850],
      monthlyReturns: [3.5, 5.2, 4.8, 4.1],
      createdAt: '2025-04-02T09:15:00Z'
    }
  ],
  '2': [
    {
      id: 'bt2',
      algorithmId: '2',
      startDate: '2024-02-01',
      endDate: '2024-04-01',
      symbol: 'GBPUSD',
      timeframe: '4h',
      initialCapital: 10000,
      finalCapital: 11270,
      totalReturn: 12.7,
      annualizedReturn: 38.1,
      sharpeRatio: 1.5,
      sortino: 1.8,
      maxDrawdown: 8.9,
      winRate: 72.3,
      profitFactor: 1.7,
      totalTrades: 94,
      winningTrades: 68,
      losingTrades: 26,
      averageWin: 180.2,
      averageLoss: -105.8,
      largestWin: 620,
      largestLoss: -380,
      averageTradeDuration: '12h 45m',
      equityCurve: [10000, 10150, 10300, 10200, 10450, 10700, 10600, 10900, 11100, 11000, 11200, 11270],
      monthlyReturns: [4.2, 3.8, 4.1],
      createdAt: '2025-04-05T14:30:00Z'
    }
  ],
  '3': [
    {
      id: 'bt3',
      algorithmId: '3',
      startDate: '2024-01-01',
      endDate: '2024-04-01',
      symbol: 'USDJPY',
      timeframe: '1D',
      initialCapital: 10000,
      finalCapital: 12130,
      totalReturn: 21.3,
      annualizedReturn: 63.9,
      sharpeRatio: 2.1,
      sortino: 2.4,
      maxDrawdown: 15.2,
      winRate: 65.8,
      profitFactor: 2.2,
      totalTrades: 73,
      winningTrades: 48,
      losingTrades: 25,
      averageWin: 320.5,
      averageLoss: -180.7,
      largestWin: 980,
      largestLoss: -520,
      averageTradeDuration: '3d 5h',
      equityCurve: [10000, 10350, 10700, 10500, 11000, 11400, 11200, 11700, 12000, 11800, 12200, 12130],
      monthlyReturns: [5.8, 6.2, 4.5, 3.2],
      createdAt: '2025-04-10T11:45:00Z'
    }
  ]
};

// Market data for simulating live trading
const sampleMarketData = {
  'EURUSD': {
    bid: 1.0875,
    ask: 1.0877,
    spread: 0.0002,
    high: 1.0895,
    low: 1.0850,
    open: 1.0860,
    close: 1.0875,
    volume: 125000,
    timestamp: new Date().toISOString()
  },
  'GBPUSD': {
    bid: 1.2685,
    ask: 1.2688,
    spread: 0.0003,
    high: 1.2710,
    low: 1.2660,
    open: 1.2675,
    close: 1.2685,
    volume: 98000,
    timestamp: new Date().toISOString()
  },
  'USDJPY': {
    bid: 154.25,
    ask: 154.28,
    spread: 0.03,
    high: 154.50,
    low: 153.90,
    open: 154.10,
    close: 154.25,
    volume: 112000,
    timestamp: new Date().toISOString()
  },
  'AUDUSD': {
    bid: 0.6545,
    ask: 0.6548,
    spread: 0.0003,
    high: 0.6560,
    low: 0.6530,
    open: 0.6540,
    close: 0.6545,
    volume: 78000,
    timestamp: new Date().toISOString()
  },
  'USDCAD': {
    bid: 1.3625,
    ask: 1.3628,
    spread: 0.0003,
    high: 1.3645,
    low: 1.3610,
    open: 1.3615,
    close: 1.3625,
    volume: 85000,
    timestamp: new Date().toISOString()
  }
};

// Sample optimization results
const sampleOptimizationResults = {
  '1': [
    {
      id: 'opt1',
      algorithmId: '1',
      parameters: {
        'fastMA': { start: 10, end: 30, step: 5, best: 20 },
        'slowMA': { start: 40, end: 60, step: 5, best: 50 },
        'rsiPeriod': { start: 7, end: 21, step: 7, best: 14 },
        'stopLoss': { start: 1.0, end: 3.0, step: 0.5, best: 1.5 },
        'takeProfit': { start: 2.0, end: 4.0, step: 0.5, best: 3.0 }
      },
      results: [
        { fastMA: 20, slowMA: 50, rsiPeriod: 14, stopLoss: 1.5, takeProfit: 3.0, return: 18.5, sharpe: 1.8 },
        { fastMA: 15, slowMA: 45, rsiPeriod: 14, stopLoss: 1.5, takeProfit: 3.0, return: 16.2, sharpe: 1.6 },
        { fastMA: 25, slowMA: 55, rsiPeriod: 14, stopLoss: 1.5, takeProfit: 3.0, return: 17.1, sharpe: 1.7 }
      ],
      bestCombination: { fastMA: 20, slowMA: 50, rsiPeriod: 14, stopLoss: 1.5, takeProfit: 3.0 },
      bestPerformance: { return: 18.5, sharpe: 1.8, drawdown: 12.3, winRate: 68.5 },
      createdAt: '2025-04-15T10:30:00Z'
    }
  ]
};

class AdvancedTradingStore {
  algorithms = [];
  performanceData = {};
  backtestResults = {};
  optimizationResults = {};
  marketData = {};
  isLoading = false;
  error = null;
  
  constructor() {
    makeAutoObservable(this);
    this.loadInitialData();
  }
  
  loadInitialData() {
    this.isLoading = true;
    
    // Simulate API call delay
    setTimeout(() => {
      runInAction(() => {
        this.algorithms = sampleAlgorithms;
        this.performanceData = samplePerformanceData;
        this.backtestResults = sampleBacktestResults;
        this.optimizationResults = sampleOptimizationResults;
        this.marketData = sampleMarketData;
        this.isLoading = false;
      });
    }, 500);
  }
  
  // Algorithm management
  getAlgorithm(id) {
    return this.algorithms.find(algo => algo.id === id);
  }
  
  addAlgorithm(algorithm) {
    const newAlgorithm = {
      ...algorithm,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      status: 'inactive',
      performance: {
        totalReturns: 0,
        sharpeRatio: 0,
        maxDrawdown: 0,
        winRate: 0
      }
    };
    
    runInAction(() => {
      this.algorithms.push(newAlgorithm);
    });
    
    return newAlgorithm;
  }
  
  updateAlgorithm(id, updates) {
    const index = this.algorithms.findIndex(algo => algo.id === id);
    if (index !== -1) {
      runInAction(() => {
        this.algorithms[index] = {
          ...this.algorithms[index],
          ...updates,
          lastModified: new Date().toISOString()
        };
      });
      return this.algorithms[index];
    }
    return null;
  }
  
  deleteAlgorithm(id) {
    const index = this.algorithms.findIndex(algo => algo.id === id);
    if (index !== -1) {
      runInAction(() => {
        this.algorithms.splice(index, 1);
      });
      return true;
    }
    return false;
  }
  
  toggleAlgorithmStatus(id) {
    const algorithm = this.getAlgorithm(id);
    if (algorithm) {
      const newStatus = algorithm.status === 'active' ? 'inactive' : 'active';
      this.updateAlgorithm(id, { status: newStatus });
      return newStatus;
    }
    return null;
  }
  
  // Backtesting
  runBacktest(algorithmId, params) {
    this.isLoading = true;
    
    // Simulate API call delay
    setTimeout(() => {
      runInAction(() => {
        // Generate mock backtest results
        const algorithm = this.getAlgorithm(algorithmId);
        if (algorithm) {
          const mockResult = {
            id: `bt-${Date.now()}`,
            algorithmId,
            startDate: params.startDate,
            endDate: params.endDate,
            symbol: params.symbol,
            timeframe: params.timeframe,
            initialCapital: params.initialCapital,
            finalCapital: params.initialCapital * (1 + (Math.random() * 0.3)),
            totalReturn: Math.round(Math.random() * 25 * 10) / 10,
            annualizedReturn: Math.round(Math.random() * 60 * 10) / 10,
            sharpeRatio: Math.round(Math.random() * 2.5 * 10) / 10,
            sortino: Math.round(Math.random() * 3 * 10) / 10,
            maxDrawdown: Math.round(Math.random() * 20 * 10) / 10,
            winRate: Math.round(Math.random() * 30 + 50 * 10) / 10,
            profitFactor: Math.round(Math.random() * 1.5 + 1 * 10) / 10,
            totalTrades: Math.floor(Math.random() * 150 + 50),
            equityCurve: Array(12).fill(0).map((_, i) => 
              params.initialCapital * (1 + (i / 11) * (Math.random() * 0.3))
            ),
            monthlyReturns: Array(4).fill(0).map(() => 
              Math.round(Math.random() * 6 * 10) / 10
            ),
            createdAt: new Date().toISOString()
          };
          
          mockResult.winningTrades = Math.floor(mockResult.totalTrades * (mockResult.winRate / 100));
          mockResult.losingTrades = mockResult.totalTrades - mockResult.winningTrades;
          
          // Add to backtestResults
          if (!this.backtestResults[algorithmId]) {
            this.backtestResults[algorithmId] = [];
          }
          
          this.backtestResults[algorithmId].unshift(mockResult);
          
          // Update algorithm performance based on latest backtest
          this.updateAlgorithm(algorithmId, {
            performance: {
              totalReturns: mockResult.totalReturn,
              sharpeRatio: mockResult.sharpeRatio,
              maxDrawdown: mockResult.maxDrawdown,
              winRate: mockResult.winRate
            }
          });
        }
        
        this.isLoading = false;
      });
    }, 2000);
  }
  
  getBacktestResults(algorithmId) {
    return this.backtestResults[algorithmId] || [];
  }
  
  // Optimization
  runOptimization(algorithmId, params) {
    this.isLoading = true;
    
    // Simulate API call delay
    setTimeout(() => {
      runInAction(() => {
        // Generate mock optimization results
        const algorithm = this.getAlgorithm(algorithmId);
        if (algorithm) {
          const paramResults = {};
          const results = [];
          
          // Create parameter ranges
          Object.keys(params).forEach(param => {
            paramResults[param] = {
              start: params[param].start,
              end: params[param].end,
              step: params[param].step,
              best: params[param].start + 
                Math.floor(Math.random() * ((params[param].end - params[param].start) / params[param].step)) * 
                params[param].step
            };
          });
          
          // Generate sample results
          for (let i = 0; i < 3; i++) {
            const result = {};
            Object.keys(paramResults).forEach(param => {
              if (i === 0) {
                // Best combination
                result[param] = paramResults[param].best;
              } else {
                // Random variations
                const variation = (i === 1 ? -1 : 1) * paramResults[param].step;
                result[param] = Math.max(
                  paramResults[param].start,
                  Math.min(
                    paramResults[param].end,
                    paramResults[param].best + variation
                  )
                );
              }
            });
            
            // Add performance metrics
            result.return = i === 0 ? 
              Math.round(Math.random() * 10 + 15 * 10) / 10 : 
              Math.round(Math.random() * 10 + 10 * 10) / 10;
            result.sharpe = i === 0 ? 
              Math.round(Math.random() * 0.5 + 1.5 * 10) / 10 : 
              Math.round(Math.random() * 0.5 + 1.0 * 10) / 10;
            
            results.push(result);
          }
          
          const mockResult = {
            id: `opt-${Date.now()}`,
            algorithmId,
            parameters: paramResults,
            results: results,
            bestCombination: results[0],
            bestPerformance: {
              return: results[0].return,
              sharpe: results[0].sharpe,
              drawdown: Math.round(Math.random() * 15 * 10) / 10,
              winRate: Math.round(Math.random() * 20 + 60 * 10) / 10
            },
            createdAt: new Date().toISOString()
          };
          
          // Add to optimizationResults
          if (!this.optimizationResults[algorithmId]) {
            this.optimizationResults[algorithmId] = [];
          }
          
          this.optimizationResults[algorithmId].unshift(mockResult);
          
          // Update algorithm settings based on optimization
          const updatedSettings = { ...algorithm.settings };
          Object.keys(mockResult.bestCombination).forEach(param => {
            if (param !== 'return' && param !== 'sharpe') {
              if (param === 'stopLoss' || param === 'takeProfit') {
                updatedSettings[param] = mockResult.bestCombination[param];
              } else if (param === 'fastMA' || param === 'slowMA') {
                // These would typically update indicator settings
              }
            }
          });
          
          this.updateAlgorithm(algorithmId, { settings: updatedSettings });
        }
        
        this.isLoading = false;
      });
    }, 3000);
  }
  
  getOptimizationResults(algorithmId) {
    return this.optimizationResults[algorithmId] || [];
  }
  
  // Market data
  getMarketData(symbol) {
    return this.marketData[symbol];
  }
  
  getAllMarketData() {
    return this.marketData;
  }
  
  updateMarketData() {
    // Simulate market data updates
    runInAction(() => {
      Object.keys(this.marketData).forEach(symbol => {
        const currentPrice = this.marketData[symbol].bid;
        const change = (Math.random() - 0.5) * 0.001 * currentPrice;
        const newBid = Math.round((currentPrice + change) * 10000) / 10000;
        const newAsk = Math.round((newBid + this.marketData[symbol].spread) * 10000) / 10000;
        
        this.marketData[symbol] = {
          ...this.marketData[symbol],
          bid: newBid,
          ask: newAsk,
          close: newBid,
          high: Math.max(this.marketData[symbol].high, newBid),
          low: Math.min(this.marketData[symbol].low, newBid),
          timestamp: new Date().toISOString()
        };
      });
    });
  }
  
  startMarketDataUpdates() {
    // Update market data every 5 seconds
    this.marketDataInterval = setInterval(() => {
      this.updateMarketData();
    }, 5000);
  }
  
  stopMarketDataUpdates() {
    if (this.marketDataInterval) {
      clearInterval(this.marketDataInterval);
    }
  }
}

export default AdvancedTradingStore;
