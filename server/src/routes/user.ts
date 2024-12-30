import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { User } from '../models/User';
import asyncHandler from 'express-async-handler';
import type { AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get user preferences
router.get('/preferences', authenticateToken, asyncHandler(async (req: AuthRequest, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  res.json({ preferences: user.preferences });
}));

// Update user preferences
router.put('/preferences', authenticateToken, asyncHandler(async (req: AuthRequest, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  // Validate preferences
  const { theme, notifications, language, riskLevel, defaultLotSize, tradingPairs } = req.body;

  const updatedPreferences = {
    theme: theme || user.preferences.theme,
    notifications: notifications !== undefined ? notifications : user.preferences.notifications,
    language: language || user.preferences.language,
    riskLevel: riskLevel || user.preferences.riskLevel,
    defaultLotSize: defaultLotSize || user.preferences.defaultLotSize,
    tradingPairs: tradingPairs || user.preferences.tradingPairs
  };

  // Update user preferences
  user.preferences = updatedPreferences;
  await user.save();

  res.json({ 
    message: 'Preferences updated successfully',
    preferences: user.preferences 
  });
}));

// Get user profile
router.get('/profile', authenticateToken, asyncHandler(async (req: AuthRequest, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  res.json({
    id: user._id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    preferences: user.preferences,
    emailVerified: user.emailVerified
  });
}));

export default router;
