import { Router, Response } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { auth } from '../middleware/auth';
import { AuthRequest } from '../types/express';

const router = Router();

// Get portfolio summary
router.get('/', auth, asyncHandler(async (req: AuthRequest, res: Response) => {
  try {
    // For now, return mock portfolio data
    // In a real app, you would fetch this from your trading platform/database
    return res.json({
      balance: 10000.00,
      equity: 10500.00,
      margin: 1000.00,
      freeMargin: 9500.00,
      marginLevel: 95,
      profitLoss: 500.00,
      currency: 'USD',
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return res.status(500).json({ error: errorMessage });
  }
}));

// Get portfolio history
router.get('/history', auth, asyncHandler(async (req: AuthRequest, res: Response) => {
  try {
    // For now, return mock history data
    const today = new Date();
    const history = Array.from({ length: 30 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      return {
        date: date.toISOString(),
        balance: 10000 + Math.random() * 1000,
        equity: 10500 + Math.random() * 1000,
        profitLoss: Math.random() * 200 - 100
      };
    });

    return res.json({ history });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return res.status(500).json({ error: errorMessage });
  }
}));

export default router;
