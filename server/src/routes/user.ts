import express from 'express';
import { UserPreferences } from '../entities/UserPreferences';
import auth from '../middleware/auth';
import { UserPayload } from '../types/auth';

const router = express.Router();

// Get user preferences
router.get('/preferences', auth, async (req: express.Request, res: express.Response) => {
  try {
    const user = req.user as UserPayload;
    if (!user?.id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const preferences = await UserPreferences.createQueryBuilder('userPreferences')
      .where('userPreferences.userId = :userId', { userId: user.id })
      .getOne();

    if (!preferences) {
      const defaultPreferences = new UserPreferences();
      defaultPreferences.userId = user.id;
      await defaultPreferences.save();
      return res.json(defaultPreferences);
    }

    return res.json(preferences);
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    return res.status(500).json({ error: 'Failed to fetch user preferences' });
  }
});

// Update user preferences
router.put('/preferences', auth, async (req: express.Request, res: express.Response) => {
  try {
    const user = req.user as UserPayload;
    if (!user?.id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const preferences = await UserPreferences.createQueryBuilder('userPreferences')
      .where('userPreferences.userId = :userId', { userId: user.id })
      .getOne();

    if (!preferences) {
      const newPreferences = new UserPreferences();
      newPreferences.userId = user.id;
      Object.assign(newPreferences, req.body);
      await newPreferences.save();
      return res.json(newPreferences);
    }

    Object.assign(preferences, req.body);
    await preferences.save();
    return res.json(preferences);
  } catch (error) {
    console.error('Error updating user preferences:', error);
    return res.status(500).json({ error: 'Failed to update user preferences' });
  }
});

export default router;
