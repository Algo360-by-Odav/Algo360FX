import { makeAutoObservable } from 'mobx';
import { Trade, Position, Account } from '../../types';

export interface PerformanceMetrics {
  totalPnL: number;
  winRate: number;
  averageWin: number;
  averageLoss: number;
  profitFactor: number;
  sharpeRatio: number;
  maxDrawdown: number;
  riskRewardRatio: number;
  tradesPerDay: number;
}

export interface EquityCurvePoint {
  timestamp: number;
  balance: number;
  equity: number;
  drawdown: number;
}

class PerformanceAnalyticsService {
  private trades: Trade[] = [];
  private positions: Position[] = [];
  private account: Account | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setTrades(trades: Trade[]) {
    this.trades = trades;
  }

  setPositions(positions: Position[]) {
    this.positions = positions;
  }

  setAccount(account: Account) {
    this.account = account;
  }

  calculateMetrics(startDate: Date, endDate: Date): PerformanceMetrics {
    const filteredTrades = this.trades.filter(
      trade => trade.closeTime >= startDate && trade.closeTime <= endDate
    );

    const winningTrades = filteredTrades.filter(trade => trade.profit > 0);
    const losingTrades = filteredTrades.filter(trade => trade.profit <= 0);

    const totalPnL = filteredTrades.reduce((sum, trade) => sum + trade.profit, 0);
    const winRate = winningTrades.length / filteredTrades.length;
    const averageWin = winningTrades.length > 0 
      ? winningTrades.reduce((sum, trade) => sum + trade.profit, 0) / winningTrades.length 
      : 0;
    const averageLoss = losingTrades.length > 0
      ? Math.abs(losingTrades.reduce((sum, trade) => sum + trade.profit, 0)) / losingTrades.length
      : 0;

    const profitFactor = averageLoss !== 0 ? (averageWin * winningTrades.length) / (averageLoss * losingTrades.length) : 0;
    
    // Calculate Sharpe Ratio
    const returns = this.calculateDailyReturns(startDate, endDate);
    const averageReturn = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
    const stdDev = Math.sqrt(returns.reduce((sum, ret) => sum + Math.pow(ret - averageReturn, 2), 0) / returns.length);
    const sharpeRatio = stdDev !== 0 ? (averageReturn / stdDev) * Math.sqrt(252) : 0;

    // Calculate Max Drawdown
    const equityCurve = this.calculateEquityCurve(startDate, endDate);
    const maxDrawdown = Math.min(...equityCurve.map(point => point.drawdown));

    // Calculate Risk-Reward Ratio
    const riskRewardRatio = averageLoss !== 0 ? averageWin / averageLoss : 0;

    // Calculate Trades per Day
    const daysDiff = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
    const tradesPerDay = filteredTrades.length / daysDiff;

    return {
      totalPnL,
      winRate,
      averageWin,
      averageLoss,
      profitFactor,
      sharpeRatio,
      maxDrawdown,
      riskRewardRatio,
      tradesPerDay
    };
  }

  private calculateDailyReturns(startDate: Date, endDate: Date): number[] {
    const dailyBalances = new Map<string, number>();
    const returns: number[] = [];

    // Group trades by day and calculate daily balances
    this.trades.forEach(trade => {
      if (trade.closeTime >= startDate && trade.closeTime <= endDate) {
        const dateKey = trade.closeTime.toISOString().split('T')[0];
        const currentBalance = dailyBalances.get(dateKey) || 0;
        dailyBalances.set(dateKey, currentBalance + trade.profit);
      }
    });

    // Convert daily balances to returns
    let previousBalance = this.account?.initialBalance || 0;
    Array.from(dailyBalances.entries())
      .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
      .forEach(([_, balance]) => {
        if (previousBalance !== 0) {
          returns.push((balance - previousBalance) / previousBalance);
        }
        previousBalance = balance;
      });

    return returns;
  }

  calculateEquityCurve(startDate: Date, endDate: Date): EquityCurvePoint[] {
    const curve: EquityCurvePoint[] = [];
    let maxEquity = this.account?.initialBalance || 0;
    let currentEquity = this.account?.initialBalance || 0;
    let currentBalance = this.account?.initialBalance || 0;

    // Sort trades by close time
    const sortedTrades = [...this.trades]
      .filter(trade => trade.closeTime >= startDate && trade.closeTime <= endDate)
      .sort((a, b) => a.closeTime.getTime() - b.closeTime.getTime());

    sortedTrades.forEach(trade => {
      currentBalance += trade.profit;
      currentEquity = currentBalance + this.calculateFloatingPnL(trade.closeTime);
      maxEquity = Math.max(maxEquity, currentEquity);

      curve.push({
        timestamp: trade.closeTime.getTime(),
        balance: currentBalance,
        equity: currentEquity,
        drawdown: ((maxEquity - currentEquity) / maxEquity) * 100
      });
    });

    return curve;
  }

  private calculateFloatingPnL(timestamp: Date): number {
    return this.positions
      .filter(position => position.openTime <= timestamp && (!position.closeTime || position.closeTime > timestamp))
      .reduce((sum, position) => sum + position.unrealizedPnL, 0);
  }
}

export const performanceAnalytics = new PerformanceAnalyticsService();
