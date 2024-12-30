import express from 'express';
import { authenticateToken } from '../middleware/auth';
import asyncHandler from 'express-async-handler';

const router = express.Router();

// Get portfolio overview
router.get('/', authenticateToken, asyncHandler(async (req, res) => {
  try {
    // Placeholder data - replace with actual portfolio data from your database
    res.json({
      totalBalance: 10000,
      equity: 12000,
      margin: 2000,
      freeMargin: 8000,
      marginLevel: 600,
      currency: 'USD',
      positions: [
        {
          id: '1',
          symbol: 'EUR/USD',
          type: 'BUY',
          volume: 0.1,
          openPrice: 1.2000,
          currentPrice: 1.2050,
          takeProfit: 1.2100,
          stopLoss: 1.1950,
          profit: 50,
          swap: -2,
          commission: -1,
          openTime: new Date()
        }
      ],
      lastUpdated: new Date(),
      pnl: {
        daily: 150,
        weekly: 450,
        monthly: 1200,
        total: 2000
      },
      metrics: {
        winRate: 65,
        profitFactor: 1.8,
        sharpeRatio: 1.2,
        maxDrawdown: -15,
        averageWin: 100,
        averageLoss: -60,
        totalTrades: 120
      }
    });
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    res.status(500).json({ error: 'Failed to fetch portfolio data' });
  }
}));

// Get portfolio history
router.get('/history', authenticateToken, asyncHandler(async (req, res) => {
  try {
    const now = new Date();
    const history = Array.from({ length: 30 }, (_, i) => {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      return {
        date,
        balance: 10000 + Math.random() * 2000 - 1000,
        equity: 12000 + Math.random() * 2000 - 1000,
        profit: Math.random() * 400 - 200,
        positions: Math.floor(Math.random() * 5),
        marginLevel: 500 + Math.random() * 200
      };
    }).reverse();

    res.json({ history });
  } catch (error) {
    console.error('Error fetching portfolio history:', error);
    res.status(500).json({ error: 'Failed to fetch portfolio history' });
  }
}));

// Get portfolio performance metrics
router.get('/metrics', authenticateToken, asyncHandler(async (req, res) => {
  try {
    // Placeholder data - replace with actual metrics from your database
    res.json({
      metrics: {
        winRate: 65,
        profitFactor: 1.8,
        sharpeRatio: 1.2,
        maxDrawdown: -15,
        averageWin: 100,
        averageLoss: -60,
        totalTrades: 120,
        profitableTrades: 78,
        losingTrades: 42,
        consecutiveWins: 5,
        consecutiveLosses: 2,
        largestWin: 500,
        largestLoss: -300,
        averageHoldingTime: '2h 15m',
        bestPair: 'EUR/USD',
        worstPair: 'GBP/JPY'
      },
      timeframes: {
        daily: {
          pnl: 150,
          trades: 8,
          winRate: 62.5
        },
        weekly: {
          pnl: 450,
          trades: 35,
          winRate: 65.7
        },
        monthly: {
          pnl: 1200,
          trades: 120,
          winRate: 65
        }
      }
    });
  } catch (error) {
    console.error('Error fetching portfolio metrics:', error);
    res.status(500).json({ error: 'Failed to fetch portfolio metrics' });
  }
}));

export default router;
