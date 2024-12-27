import express from 'express';
import { User } from '../entities/User';
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

    const preferences = await UserPreferences.findOne({ userId: user.id });
    return res.json(preferences || {});
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

    const preferences = await UserPreferences.findOneAndUpdate(
      { userId: user.id },
      { $set: req.body },
      { new: true, upsert: true }
    );
    return res.json(preferences);
  } catch (error) {
    console.error('Error updating user preferences:', error);
    return res.status(500).json({ error: 'Failed to update user preferences' });
  }
});

export default router;
