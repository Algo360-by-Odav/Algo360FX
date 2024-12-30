import express from 'express';
import { authenticateToken } from '../middleware/auth';
import asyncHandler from 'express-async-handler';
import { User } from '../models/User';

const router = express.Router();

// Get user preferences
router.get('/preferences', authenticateToken, asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Return user preferences or default values
    res.json({
      preferences: user.preferences || {
        theme: 'light',
        notifications: true,
        language: 'en',
        riskLevel: 'medium',
        defaultLotSize: 0.01,
        tradingPairs: ['EUR/USD', 'GBP/USD', 'USD/JPY']
      }
    });
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    res.status(500).json({ error: 'Failed to fetch user preferences' });
  }
}));

// Update user preferences
router.put('/preferences', authenticateToken, asyncHandler(async (req, res) => {
  try {
    const { theme, notifications, language, riskLevel, defaultLotSize, tradingPairs } = req.body;

    // Validate preferences
    if (theme && !['light', 'dark'].includes(theme)) {
      return res.status(400).json({ error: 'Invalid theme value' });
    }

    if (language && !['en', 'es', 'fr', 'de', 'zh'].includes(language)) {
      return res.status(400).json({ error: 'Invalid language value' });
    }

    if (riskLevel && !['low', 'medium', 'high'].includes(riskLevel)) {
      return res.status(400).json({ error: 'Invalid risk level' });
    }

    if (defaultLotSize && (defaultLotSize < 0.01 || defaultLotSize > 100)) {
      return res.status(400).json({ error: 'Invalid lot size' });
    }

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { 
        $set: { 
          preferences: {
            theme: theme || user.preferences.theme,
            notifications: notifications !== undefined ? notifications : user.preferences.notifications,
            language: language || user.preferences.language,
            riskLevel: riskLevel || user.preferences.riskLevel,
            defaultLotSize: defaultLotSize || user.preferences.defaultLotSize,
            tradingPairs: tradingPairs || user.preferences.tradingPairs
          }
        } 
      },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ preferences: user.preferences });
  } catch (error) {
    console.error('Error updating user preferences:', error);
    res.status(500).json({ error: 'Failed to update user preferences' });
  }
}));

export default router;
