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
        language: 'en'
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
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $set: { preferences: req.body } },
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
