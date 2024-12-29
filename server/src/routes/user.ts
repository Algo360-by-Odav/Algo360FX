import express from 'express';
import { UserPreferences } from '../models/UserPreferences';
import { logger } from '../utils/logger';

const router = express.Router();

// Get user preferences
router.get('/:userId/preferences', async (req, res) => {
  try {
    const userPreferences = await UserPreferences.findOne({ userId: req.params.userId });
    if (!userPreferences) {
      return res.status(404).json({ error: 'User preferences not found' });
    }
    res.json(userPreferences);
  } catch (error) {
    logger.error('Error fetching user preferences:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user preferences
router.put('/:userId/preferences', async (req, res) => {
  try {
    const userPreferences = await UserPreferences.findOneAndUpdate(
      { userId: req.params.userId },
      req.body,
      { new: true, upsert: true }
    );
    res.json(userPreferences);
  } catch (error) {
    logger.error('Error updating user preferences:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
