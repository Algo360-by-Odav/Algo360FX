import { Router, Response } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { auth } from '../middleware/auth';
import { AuthRequest } from '../types/express';

const router = Router();

// Get all strategies
router.get('/', auth, asyncHandler(async (req: AuthRequest, res: Response) => {
  try {
    // For now, return mock strategies data
    // In a real app, you would fetch this from your database
    return res.json({
      strategies: [
        {
          id: '1',
          name: 'Trend Following EMA',
          description: 'Uses exponential moving averages to identify and follow trends',
          status: 'active',
          performance: {
            winRate: 65,
            profitFactor: 1.8,
            totalTrades: 150,
            averageProfit: 25.5,
            sharpeRatio: 1.2
          },
          parameters: {
            fastEMA: 12,
            slowEMA: 26,
            signalEMA: 9,
            timeframe: '1h',
            symbols: ['EUR/USD', 'GBP/USD']
          },
          lastModified: new Date().toISOString()
        },
        {
          id: '2',
          name: 'RSI Mean Reversion',
          description: 'Trades oversold and overbought conditions using RSI',
          status: 'inactive',
          performance: {
            winRate: 58,
            profitFactor: 1.5,
            totalTrades: 200,
            averageProfit: 18.3,
            sharpeRatio: 1.1
          },
          parameters: {
            rsiPeriod: 14,
            oversold: 30,
            overbought: 70,
            timeframe: '4h',
            symbols: ['EUR/USD', 'USD/JPY']
          },
          lastModified: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        }
      ]
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return res.status(500).json({ error: errorMessage });
  }
}));

// Get strategy by ID
router.get('/:id', auth, asyncHandler(async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    // Mock data for a single strategy
    // In a real app, you would fetch this from your database
    return res.json({
      id,
      name: 'Trend Following EMA',
      description: 'Uses exponential moving averages to identify and follow trends',
      status: 'active',
      performance: {
        winRate: 65,
        profitFactor: 1.8,
        totalTrades: 150,
        averageProfit: 25.5,
        sharpeRatio: 1.2
      },
      parameters: {
        fastEMA: 12,
        slowEMA: 26,
        signalEMA: 9,
        timeframe: '1h',
        symbols: ['EUR/USD', 'GBP/USD']
      },
      backtest: {
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date().toISOString(),
        initialBalance: 10000,
        finalBalance: 12500,
        maxDrawdown: 8.5,
        totalTrades: 150,
        profitableTrades: 98,
        unprofitableTrades: 52
      },
      lastModified: new Date().toISOString()
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return res.status(500).json({ error: errorMessage });
  }
}));

// Update strategy
router.put('/:id', auth, asyncHandler(async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updatedStrategy = req.body;
    // In a real app, you would update this in your database
    return res.json({
      id,
      ...updatedStrategy,
      lastModified: new Date().toISOString()
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return res.status(500).json({ error: errorMessage });
  }
}));

// Create new strategy
router.post('/', auth, asyncHandler(async (req: AuthRequest, res: Response) => {
  try {
    const newStrategy = req.body;
    // In a real app, you would save this to your database
    return res.status(201).json({
      id: Math.random().toString(36).substr(2, 9),
      ...newStrategy,
      status: 'inactive',
      performance: {
        winRate: 0,
        profitFactor: 0,
        totalTrades: 0,
        averageProfit: 0,
        sharpeRatio: 0
      },
      lastModified: new Date().toISOString()
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return res.status(500).json({ error: errorMessage });
  }
}));

// Delete strategy
router.delete('/:id', auth, asyncHandler(async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    // In a real app, you would delete this from your database
    return res.json({ message: `Strategy ${id} deleted successfully` });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return res.status(500).json({ error: errorMessage });
  }
}));

export default router;
