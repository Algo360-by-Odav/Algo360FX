import express, { Request, Response } from 'express';
import auth from '../middleware/auth';
import { UserPreferences } from '../models/UserPreferences';
import { postgresConnection } from '../config/database';
import { DeepPartial } from 'typeorm';

const router = express.Router();

// Get user preferences
router.get('/preferences', auth, async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const userPreferencesRepository = postgresConnection.getRepository(UserPreferences);
    const preferences = await userPreferencesRepository.findOne({ 
      where: { userId: req.user.id }
    });

    if (!preferences) {
      // Create default preferences if none exist
      const defaultPreferences: DeepPartial<UserPreferences> = {
        userId: req.user.id,
        theme: 'light',
        notifications: true,
        language: 'en',
        timezone: 'UTC',
        chartPreferences: {
          defaultTimeframe: '1H',
          indicators: [],
          layout: 'default'
        },
        tradingPreferences: {
          defaultLotSize: 0.01,
          riskPercentage: 1,
          defaultStopLoss: 50,
          defaultTakeProfit: 100
        }
      };

      const newPreferences = userPreferencesRepository.create(defaultPreferences);
      const savedPreferences = await userPreferencesRepository.save(newPreferences);
      return res.json(savedPreferences);
    }

    return res.json(preferences);
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    return res.status(500).json({ error: 'Failed to fetch user preferences' });
  }
});

// Update user preferences
router.put('/preferences', auth, async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const userPreferencesRepository = postgresConnection.getRepository(UserPreferences);
    let preferences = await userPreferencesRepository.findOne({ 
      where: { userId: req.user.id }
    });

    if (!preferences) {
      // Create new preferences if none exist
      const newPreferences: DeepPartial<UserPreferences> = {
        userId: req.user.id,
        ...req.body
      };
      preferences = userPreferencesRepository.create(newPreferences);
    } else {
      // Update existing preferences
      userPreferencesRepository.merge(preferences, req.body as DeepPartial<UserPreferences>);
    }

    const savedPreferences = await userPreferencesRepository.save(preferences);
    return res.json(savedPreferences);
  } catch (error) {
    console.error('Error updating user preferences:', error);
    return res.status(500).json({ error: 'Failed to update user preferences' });
  }
});

export default router;
