import express, { Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth';
import { asyncHandler } from '../middleware/asyncHandler';

const router = express.Router();

// Get all strategies
router.get('/', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  try {
    // For now, return mock strategies data
    res.json({
      strategies: [
        {
          id: '1',
          name: 'Trend Following EMA',
          description: 'Uses exponential moving averages to identify and follow trends',
          status: 'active',
          performance: {
            winRate: 65,
            profitFactor: 1.8,
            totalTrades: 150
          }
        }
      ]
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ error: errorMessage });
  }
}));

// Get strategy by ID
router.get('/:id', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    res.json({
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
    res.status(500).json({ error: errorMessage });
  }
}));

// Get strategy performance
router.get('/:id/performance', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    res.json({
      performance: {
        winRate: 65,
        profitFactor: 1.8,
        totalTrades: 150,
        averageProfit: 25.5,
        maxDrawdown: 10,
        sharpeRatio: 1.5,
        monthlyReturns: [
          { month: '2024-01', return: 5.2 },
          { month: '2024-02', return: 3.8 }
        ]
      }
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ error: errorMessage });
  }
}));

// Update strategy
router.put('/:id', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    res.json({ message: `Strategy ${id} updated successfully` });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ error: errorMessage });
  }
}));

// Delete strategy
router.delete('/:id', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    res.json({ message: `Strategy ${id} deleted successfully` });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ error: errorMessage });
  }
}));

export default router;