import { format } from 'date-fns';

export interface ChartDataPoint {
  x: Date | string;
  y: number;
}

export interface ProfitDistribution {
  bins: number[];
  frequencies: number[];
}

export interface TradeTimingData {
  hour: number;
  winRate: number;
  volume: number;
  averageProfit: number;
}

export interface RiskMetrics {
  date: string;
  sharpeRatio: number;
  sortinoRatio: number;
  maxDrawdown: number;
  volatility: number;
  beta: number;
  alpha: number;
  calmarRatio: number;
}

export interface Trade {
  date: string;
  pair: string;
  type: 'BUY' | 'SELL';
  profit: string;
  duration: string;
}

export interface PerformancePoint {
  date: string;
  balance: number;
  equity: number;
  drawdown: number;
}

export interface PerformanceData {
  trades: Trade[];
  performance: PerformancePoint[];
}

export interface SignificantEvent {
  date: string;
  description: string;
  type: 'EQUITY_HIGH' | 'EQUITY_LOW' | 'MAX_DRAWDOWN' | 'WIN_STREAK' | 'LOSS_STREAK';
}

export const calculateMonthlyReturns = (data: PerformanceData): ChartDataPoint[] => {
  const monthlyReturns = new Map<string, number>();
  
  data.performance.forEach((p: PerformancePoint, i: number) => {
    const month = format(new Date(p.date), 'yyyy-MM');
    if (i === 0) return;
    
    const monthlyReturn = (p.equity - data.performance[i - 1].equity) / data.performance[i - 1].equity * 100;
    monthlyReturns.set(month, (monthlyReturns.get(month) || 0) + monthlyReturn);
  });

  return Array.from(monthlyReturns.entries()).map(([month, value]) => ({
    x: month,
    y: value,
  }));
};

export const calculateProfitDistribution = (data: PerformanceData): ProfitDistribution => {
  const profits = data.trades.map(trade => parseFloat(trade.profit.replace(/[^0-9.-]/g, '')));
  const min = Math.min(...profits);
  const max = Math.max(...profits);
  const binCount = 20;
  const binSize = (max - min) / binCount;

  const bins = Array.from({ length: binCount }, (_, i) => min + i * binSize);
  const frequencies = new Array(binCount).fill(0);

  profits.forEach((profit: number) => {
    const binIndex = Math.min(Math.floor((profit - min) / binSize), binCount - 1);
    frequencies[binIndex]++;
  });

  return { bins, frequencies };
};

export const calculateCorrelation = (data: PerformanceData): ChartDataPoint[] => {
  const pairPerformance = new Map<string, { wins: number; total: number }>();
  
  data.trades.forEach((trade: Trade) => {
    const stats = pairPerformance.get(trade.pair) || { wins: 0, total: 0 };
    stats.total++;
    if (parseFloat(trade.profit) > 0) {
      stats.wins++;
    }
    pairPerformance.set(trade.pair, stats);
  });

  return Array.from(pairPerformance.entries())
    .filter(([_, stats]) => stats.total >= 10) // Only include pairs with enough trades
    .map(([pair, stats]) => ({
      x: pair,
      y: (stats.wins / stats.total) * 100,
    }));
};

export const calculateComparison = (
  currentData: PerformanceData
): { current: ChartDataPoint[]; previous: ChartDataPoint[] } => {
  const currentPoints = currentData.performance.map(p => ({
    x: p.date,
    y: p.equity,
  }));

  const previousPoints = currentData.performance.map(p => ({
    x: p.date,
    y: p.equity * 0.8, // Mock previous period data
  }));

  return {
    current: currentPoints,
    previous: previousPoints,
  };
};

export const calculateRiskMetrics = (data: PerformanceData): RiskMetrics[] => {
  const riskFreeRate = 0.02; // 2% annual risk-free rate
  const metrics: RiskMetrics[] = [];
  const windowSize = 30; // 30-day rolling window

  data.performance.forEach((p: PerformancePoint, i: number) => {
    if (i < windowSize) return;

    const window = data.performance.slice(i - windowSize, i);
    const returns = window.map((p, j) => j === 0 ? 0 : (p.equity - window[j - 1].equity) / window[j - 1].equity);
    const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
    const volatility = Math.sqrt(returns.reduce((a, b) => a + Math.pow(b - avgReturn, 2), 0) / returns.length);
    
    const negativeReturns = returns.filter(r => r < 0);
    const downsideVolatility = Math.sqrt(negativeReturns.reduce((a, b) => a + Math.pow(b, 2), 0) / negativeReturns.length);
    
    const maxDrawdown = Math.min(...window.map(p => p.drawdown));
    
    metrics.push({
      date: p.date,
      sharpeRatio: (avgReturn - riskFreeRate) / volatility,
      sortinoRatio: (avgReturn - riskFreeRate) / downsideVolatility,
      maxDrawdown,
      volatility,
      beta: 1, // Mock value
      alpha: avgReturn - riskFreeRate, // Simplified alpha
      calmarRatio: Math.abs(avgReturn / maxDrawdown),
    });
  });

  return metrics;
};

export const analyzeTradeTimingByHour = (data: PerformanceData): TradeTimingData[] => {
  const hourlyStats = new Array(24).fill(null).map(() => ({
    wins: 0,
    total: 0,
    profit: 0,
  }));

  data.trades.forEach((trade: Trade) => {
    const hour = new Date(trade.date).getHours();
    hourlyStats[hour].total++;
    const profit = parseFloat(trade.profit);
    if (profit > 0) hourlyStats[hour].wins++;
    hourlyStats[hour].profit += profit;
  });

  return hourlyStats.map((stats, hour) => ({
    hour,
    winRate: stats.total > 0 ? (stats.wins / stats.total) * 100 : 0,
    volume: stats.total,
    averageProfit: stats.total > 0 ? stats.profit / stats.total : 0,
  }));
};

export const findSignificantEvents = (data: PerformanceData): SignificantEvent[] => {
  const events: SignificantEvent[] = [];
  let maxBalance = -Infinity;
  let minBalance = Infinity;
  let currentDrawdown = 0;
  let maxDrawdown = 0;
  let consecutiveWins = 0;
  let consecutiveLosses = 0;
  let maxConsecutiveWins = 0;
  let maxConsecutiveLosses = 0;

  data.trades.forEach((trade: Trade) => {
    const profit = parseFloat(trade.profit);
    const balance = data.performance.find(p => p.date === trade.date)?.balance || 0;

    // Track max balance
    if (balance > maxBalance) {
      maxBalance = balance;
      events.push({
        date: trade.date,
        description: `New equity high: ${balance.toFixed(2)}`,
        type: 'EQUITY_HIGH',
      });
    }

    // Track min balance
    if (balance < minBalance) {
      minBalance = balance;
      events.push({
        date: trade.date,
        description: `New equity low: ${balance.toFixed(2)}`,
        type: 'EQUITY_LOW',
      });
    }

    // Track drawdown
    currentDrawdown = (maxBalance - balance) / maxBalance * 100;
    if (currentDrawdown > maxDrawdown) {
      maxDrawdown = currentDrawdown;
      events.push({
        date: trade.date,
        description: `New max drawdown: ${maxDrawdown.toFixed(2)}%`,
        type: 'MAX_DRAWDOWN',
      });
    }

    // Track consecutive wins/losses
    if (profit > 0) {
      consecutiveWins++;
      consecutiveLosses = 0;
      if (consecutiveWins > maxConsecutiveWins) {
        maxConsecutiveWins = consecutiveWins;
        events.push({
          date: trade.date,
          description: `New streak: ${maxConsecutiveWins} consecutive winning trades`,
          type: 'WIN_STREAK',
        });
      }
    } else {
      consecutiveLosses++;
      consecutiveWins = 0;
      if (consecutiveLosses > maxConsecutiveLosses) {
        maxConsecutiveLosses = consecutiveLosses;
        events.push({
          date: trade.date,
          description: `New streak: ${maxConsecutiveLosses} consecutive losing trades`,
          type: 'LOSS_STREAK',
        });
      }
    }
  });

  // Sort events by date
  return events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

export const calculateSMA = (data: number[], period: number): (number | null)[] => {
  const sma: (number | null)[] = [];
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      sma.push(null);
      continue;
    }
    const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
    sma.push(sum / period);
  }
  return sma;
};
