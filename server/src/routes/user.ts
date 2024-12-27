import express from 'express';
import auth from '../middleware/auth';
import { UserPreferences } from '../models/UserPreferences';
import { postgresConnection } from '../config/database';

const router = express.Router();

// Get user preferences
router.get('/preferences', auth, async (req, res) => {
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
      const defaultPreferences = userPreferencesRepository.create({
        userId: req.user.id,
        theme: 'light',
        notifications: true,
        language: 'en',
        timezone: 'UTC'
      });

      await userPreferencesRepository.save(defaultPreferences);
      return res.json(defaultPreferences);
    }

    return res.json(preferences);
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    return res.status(500).json({ error: 'Failed to fetch user preferences' });
  }
});

// Update user preferences
router.put('/preferences', auth, async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const userPreferencesRepository = postgresConnection.getRepository(UserPreferences);
    let preferences = await userPreferencesRepository.findOne({ 
      where: { userId: req.user.id }
    });

    if (!preferences) {
      preferences = userPreferencesRepository.create({
        userId: req.user.id,
        ...req.body
      });
    } else {
      userPreferencesRepository.merge(preferences, req.body);
    }

    await userPreferencesRepository.save(preferences);
    return res.json(preferences);
  } catch (error) {
    console.error('Error updating user preferences:', error);
    return res.status(500).json({ error: 'Failed to update user preferences' });
  }
});

export default router;
