import express from 'express';
import authenticateToken from '../middleware/auth';

const router = express.Router();

// Get user preferences
router.get('/preferences', authenticateToken, async (_req, res) => {
  try {
    // For now, return default preferences
    // In a real app, you would fetch this from the database
    res.json({
      theme: 'light',
      language: 'en',
      notifications: {
        email: true,
        push: true,
        sms: false
      },
      reportSettings: {
        defaultFormat: 'pdf',
        language: 'en',
        autoGenerate: false
      }
    });
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    res.status(500).json({ message: 'Error fetching user preferences' });
  }
});

// Update user preferences
router.put('/preferences', authenticateToken, async (req, res) => {
  try {
    const preferences = req.body;
    // In a real app, you would save this to the database
    res.json(preferences);
  } catch (error) {
    console.error('Error updating user preferences:', error);
    res.status(500).json({ message: 'Error updating user preferences' });
  }
});

export default router;
