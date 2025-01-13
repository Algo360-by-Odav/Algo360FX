import { Portfolio, Trade } from '@prisma/client';
import { prisma } from '../config/database';
import { openAIService } from './ai/openai.service';

interface PortfolioStats {
  totalBalance: number;
  totalPnL: number;
  winRate: number;
  averageWin: number;
  averageLoss: number;
  sharpeRatio: number;
  maxDrawdown: number;
  profitFactor: number;
  bestTrade: Trade | null;
  worstTrade: Trade | null;
}

interface PortfolioAnalysis {
  stats: PortfolioStats;
  analysis: string;
  recommendations: string[];
}

export class PortfolioService {
  private calculateStats(trades: Trade[]): PortfolioStats {
    const winningTrades = trades.filter(trade => (trade.profit || 0) > 0);
    const losingTrades = trades.filter(trade => (trade.profit || 0) < 0);

    const totalPnL = trades.reduce((sum, trade) => sum + (trade.profit || 0), 0);
    const winRate = trades.length > 0 ? winningTrades.length / trades.length : 0;

    const averageWin = winningTrades.length > 0
      ? winningTrades.reduce((sum, trade) => sum + (trade.profit || 0), 0) / winningTrades.length
      : 0;

    const averageLoss = losingTrades.length > 0
      ? Math.abs(losingTrades.reduce((sum, trade) => sum + (trade.profit || 0), 0) / losingTrades.length)
      : 0;

    // Calculate Sharpe Ratio
    const returns = trades.map(trade => trade.profit || 0);
    const averageReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
    const stdDev = Math.sqrt(
      returns.reduce((sum, ret) => sum + Math.pow(ret - averageReturn, 2), 0) / returns.length
    );
    const sharpeRatio = stdDev !== 0 ? averageReturn / stdDev : 0;

    // Calculate Maximum Drawdown
    let peak = 0;
    let maxDrawdown = 0;
    let runningTotal = 0;

    trades.forEach(trade => {
      runningTotal += (trade.profit || 0);
      if (runningTotal > peak) {
        peak = runningTotal;
      }
      const drawdown = peak - runningTotal;
      if (drawdown > maxDrawdown) {
        maxDrawdown = drawdown;
      }
    });

    // Calculate Profit Factor
    const grossProfit = winningTrades.reduce((sum, trade) => sum + (trade.profit || 0), 0);
    const grossLoss = Math.abs(losingTrades.reduce((sum, trade) => sum + (trade.profit || 0), 0));
    const profitFactor = grossLoss !== 0 ? grossProfit / grossLoss : grossProfit > 0 ? Infinity : 0;

    // Find best and worst trades
    const bestTrade = trades.reduce((best, trade) => 
      (!best || (trade.profit || 0) > (best.profit || 0)) ? trade : best, null as Trade | null);
    
    const worstTrade = trades.reduce((worst, trade) => 
      (!worst || (trade.profit || 0) < (worst.profit || 0)) ? trade : worst, null as Trade | null);

    return {
      totalBalance: totalPnL,
      totalPnL,
      winRate,
      averageWin,
      averageLoss,
      sharpeRatio,
      maxDrawdown,
      profitFactor,
      bestTrade,
      worstTrade
    };
  }

  public async createPortfolio(userId: string, name: string, description?: string): Promise<Portfolio> {
    return prisma.portfolio.create({
      data: {
        userId,
        name,
        description,
        balance: 0,
        currency: 'USD'
      }
    });
  }

  public async getPortfolio(portfolioId: string): Promise<Portfolio | null> {
    return prisma.portfolio.findUnique({
      where: { id: portfolioId }
    });
  }

  public async getUserPortfolios(userId: string): Promise<Portfolio[]> {
    return prisma.portfolio.findMany({
      where: { userId }
    });
  }

  public async updatePortfolio(
    portfolioId: string,
    data: Partial<Portfolio>
  ): Promise<Portfolio> {
    return prisma.portfolio.update({
      where: { id: portfolioId },
      data
    });
  }

  public async deletePortfolio(portfolioId: string): Promise<void> {
    await prisma.portfolio.delete({
      where: { id: portfolioId }
    });
  }

  public async getPortfolioTrades(portfolioId: string): Promise<Trade[]> {
    const portfolio = await this.getPortfolio(portfolioId);
    if (!portfolio) throw new Error('Portfolio not found');

    return prisma.trade.findMany({
      where: {
        userId: portfolio.userId
      },
      orderBy: {
        openTime: 'desc'
      }
    });
  }

  public async analyzePortfolio(portfolioId: string): Promise<PortfolioAnalysis> {
    const portfolio = await this.getPortfolio(portfolioId);
    if (!portfolio) throw new Error('Portfolio not found');

    const trades = await this.getPortfolioTrades(portfolioId);
    const stats = this.calculateStats(trades);

    // Get AI analysis
    const analysisResponse = await openAIService.generateAnalysis(
      {
        portfolioName: portfolio.name,
        stats,
        trades: trades.slice(0, 50) // Limit to last 50 trades for analysis
      },
      portfolio.userId,
      {
        temperature: 0.7,
        maxTokens: 2000,
        useCache: true
      }
    );

    // Parse AI response for recommendations
    const recommendations = analysisResponse
      .split('\n')
      .filter(line => line.trim().startsWith('-') || line.trim().startsWith('*'))
      .map(line => line.trim().replace(/^[-*]\s*/, ''));

    return {
      stats,
      analysis: analysisResponse,
      recommendations
    };
  }

  public async updatePortfolioBalance(portfolioId: string): Promise<Portfolio> {
    const portfolio = await this.getPortfolio(portfolioId);
    if (!portfolio) throw new Error('Portfolio not found');

    const trades = await this.getPortfolioTrades(portfolioId);
    const totalPnL = trades.reduce((sum, trade) => sum + (trade.profit || 0), 0);

    return this.updatePortfolio(portfolioId, {
      balance: totalPnL
    });
  }

  public async getPortfolioPerformance(
    portfolioId: string,
    startDate: Date,
    endDate: Date
  ): Promise<any> {
    const portfolio = await this.getPortfolio(portfolioId);
    if (!portfolio) throw new Error('Portfolio not found');

    const trades = await prisma.trade.findMany({
      where: {
        userId: portfolio.userId,
        openTime: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: {
        openTime: 'asc'
      }
    });

    // Calculate daily performance
    const dailyPerformance = new Map<string, number>();
    let runningBalance = 0;

    trades.forEach(trade => {
      const date = trade.openTime.toISOString().split('T')[0];
      runningBalance += (trade.profit || 0);
      dailyPerformance.set(date, runningBalance);
    });

    // Convert to array of data points
    const performanceData = Array.from(dailyPerformance.entries()).map(([date, balance]) => ({
      date,
      balance
    }));

    return {
      portfolio,
      performance: performanceData,
      stats: this.calculateStats(trades)
    };
  }
}

export const portfolioService = new PortfolioService();
export default PortfolioService;
