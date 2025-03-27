import { makeAutoObservable } from 'mobx';
import { RootStore } from './rootStore';

export interface MT5AccountInfo {
  balance: number;
  equity: number;
  margin: number;
  freeMargin: number;
  marginLevel: number;
  positions: MT5Position[];
  orders: MT5Order[];
  trades: MT5Trade[];
}

export interface MT5Position {
  symbol: string;
  type: 'buy' | 'sell';
  volume: number;
  openPrice: number;
  currentPrice: number;
  stopLoss: number | null;
  takeProfit: number | null;
  profit: number;
  swap: number;
  commission: number;
}

export interface MT5Order {
  ticket: number;
  symbol: string;
  type: 'buy' | 'sell';
  volume: number;
  openPrice: number;
  stopLoss: number | null;
  takeProfit: number | null;
  comment: string;
}

export interface MT5Trade {
  ticket: number;
  symbol: string;
  type: 'buy' | 'sell';
  volume: number;
  openPrice: number;
  closePrice: number;
  profit: number;
  swap: number;
  commission: number;
  openTime: Date;
  closeTime: Date;
}

export interface MT5ChartData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface MT5AnalysisData {
  performance: {
    date: string;
    pnl: number;
    balance: number;
    equity: number;
    drawdown: number;
  }[];
  tradingPairs: {
    symbol: string;
    trades: number;
    volume: number;
    pnl: number;
    winRate: number;
  }[];
  riskMetrics: {
    sharpeRatio: number;
    maxDrawdown: number;
    profitFactor: number;
    expectancy: number;
    recoveryFactor: number;
    kellyRatio: number;
  };
  tradingStats: {
    totalTrades: number;
    winningTrades: number;
    losingTrades: number;
    winRate: number;
    avgWin: number;
    avgLoss: number;
    largestWin: number;
    largestLoss: number;
    avgHoldingTime: number;
    bestPair: string;
    worstPair: string;
  };
  timeAnalysis: {
    hourlyPerformance: { hour: number; pnl: number; trades: number }[];
    dailyPerformance: { day: string; pnl: number; trades: number }[];
    monthlyPerformance: { month: string; pnl: number; trades: number }[];
  };
  correlations: {
    pairA: string;
    pairB: string;
    correlation: number;
  }[];
}

export class MT5Store {
  rootStore: RootStore;
  isConnected: boolean = false;
  accountInfo: MT5AccountInfo | null = null;
  error: string | null = null;
  chartData: { [key: string]: MT5ChartData[] } = {};
  accounts: { login: string; name: string }[] = [
    { login: '12345', name: 'Demo Account 1' },
    { login: '67890', name: 'Demo Account 2' },
  ];

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  connect = async (accountId: string, password: string): Promise<boolean> => {
    try {
      // Mock connection logic
      this.isConnected = true;
      return true;
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Failed to connect';
      return false;
    }
  };

  disconnect = async (): Promise<void> => {
    this.isConnected = false;
    this.accountInfo = null;
  };

  getAccountInfo = async (): Promise<MT5AccountInfo | null> => {
    if (!this.isConnected) {
      throw new Error('Not connected to MT5');
    }
    // Mock account info
    this.accountInfo = {
      balance: 10000,
      equity: 10500,
      margin: 1000,
      freeMargin: 9500,
      marginLevel: 950,
      positions: [],
      orders: [],
      trades: [],
    };
    return this.accountInfo;
  };

  getAnalysisData = async (accountNumber: number, timeRange: string): Promise<MT5AnalysisData> => {
    // Mock analysis data
    return this.generateMockAnalysisData(timeRange);
  };

  private generateMockAnalysisData = (timeRange: string): MT5AnalysisData => {
    const dataPoints = this.getDataPointsForTimeRange(timeRange);
    const baseDate = new Date();
    const performance = Array.from({ length: dataPoints }, (_, i) => {
      const date = new Date(baseDate);
      date.setDate(date.getDate() - (dataPoints - i));
      return {
        date: date.toISOString().split('T')[0],
        pnl: Math.random() * 1000 - 500,
        balance: 10000 + Math.random() * 5000,
        equity: 10000 + Math.random() * 5000,
        drawdown: Math.random() * 10,
      };
    });

    return {
      performance,
      tradingPairs: [
        {
          symbol: 'EURUSD',
          trades: 50,
          volume: 5.0,
          pnl: 1200,
          winRate: 0.65,
        },
        // Add more pairs as needed
      ],
      riskMetrics: {
        sharpeRatio: 1.5,
        maxDrawdown: 15,
        profitFactor: 1.8,
        expectancy: 25,
        recoveryFactor: 2.1,
        kellyRatio: 0.4,
      },
      tradingStats: {
        totalTrades: 100,
        winningTrades: 65,
        losingTrades: 35,
        winRate: 0.65,
        avgWin: 150,
        avgLoss: -100,
        largestWin: 500,
        largestLoss: -300,
        avgHoldingTime: 120,
        bestPair: 'EURUSD',
        worstPair: 'GBPJPY',
      },
      timeAnalysis: {
        hourlyPerformance: Array.from({ length: 24 }, (_, i) => ({
          hour: i,
          pnl: Math.random() * 1000 - 500,
          trades: Math.floor(Math.random() * 20),
        })),
        dailyPerformance: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(day => ({
          day,
          pnl: Math.random() * 1000 - 500,
          trades: Math.floor(Math.random() * 50),
        })),
        monthlyPerformance: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map(month => ({
          month,
          pnl: Math.random() * 5000 - 2500,
          trades: Math.floor(Math.random() * 200),
        })),
      },
      correlations: [
        { pairA: 'EURUSD', pairB: 'GBPUSD', correlation: 0.85 },
        { pairA: 'EURUSD', pairB: 'USDJPY', correlation: -0.45 },
        // Add more correlations as needed
      ],
    };
  };

  private getDataPointsForTimeRange = (timeRange: string): number => {
    switch (timeRange) {
      case '1W':
        return 7;
      case '1M':
        return 30;
      case '3M':
        return 90;
      case '6M':
        return 180;
      case '1Y':
        return 365;
      default:
        return 30;
    }
  };
}
