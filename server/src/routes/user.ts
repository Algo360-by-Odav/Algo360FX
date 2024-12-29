import { Router, Response } from 'express';
import { validateRequest } from '../middleware/validateRequest';
import { updateProfileSchema } from '../schemas/user.schema';
import { User } from '../models/User';
import { asyncHandler } from '../middleware/asyncHandler';
import { auth } from '../middleware/auth';
import { AuthRequest } from '../types/express';

const router = Router();

// Get user preferences
router.get('/preferences', auth, asyncHandler(async (req: AuthRequest, res: Response) => {
  try {
    // For now, return default preferences
    // In a real app, you would fetch this from the database
    return res.json({
      preferences: {
        theme: 'light',
        notifications: true,
        riskLevel: 'moderate',
        tradingPairs: ['EUR/USD', 'GBP/USD', 'USD/JPY'],
        timeframes: ['1h', '4h', '1d'],
        indicators: ['RSI', 'MACD', 'Moving Average']
      }
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return res.status(500).json({ error: errorMessage });
  }
}));

// Update user preferences
router.put('/preferences', auth, asyncHandler(async (req: AuthRequest, res: Response) => {
  try {
    const preferences = req.body;
    // In a real app, you would save this to the database
    return res.json({ preferences });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return res.status(500).json({ error: errorMessage });
  }
}));

export default router;
