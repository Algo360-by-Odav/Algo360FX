import express, { Request, Response } from 'express';
import { User } from '../models/User';
import { UserPreferences } from '../models/UserPreferences';
import { auth } from '../middleware/auth';

const router = express.Router();

// Get user preferences
router.get('/preferences', auth, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    let preferences = await UserPreferences.findOne({ userId });
    
    if (!preferences) {
      // Create default preferences if none exist
      preferences = await UserPreferences.create({
        userId,
        theme: 'light',
        notifications: {
          email: true,
          push: true,
          trading: true
        },
        defaultTimeframe: '1h',
        favoriteSymbols: ['EURUSD', 'GBPUSD', 'USDJPY'],
        chartSettings: {
          showVolume: true,
          showIndicators: true,
          defaultIndicators: ['MA', 'RSI']
        }
      });
    }

    res.json(preferences);
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    res.status(500).json({ error: 'Failed to fetch user preferences' });
  }
});

// Update user preferences
router.put('/preferences', auth, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const preferences = await UserPreferences.findOneAndUpdate(
      { userId },
      { $set: req.body },
      { new: true, upsert: true }
    );

    res.json(preferences);
  } catch (error) {
    console.error('Error updating user preferences:', error);
    res.status(500).json({ error: 'Failed to update user preferences' });
  }
});

export default router;
