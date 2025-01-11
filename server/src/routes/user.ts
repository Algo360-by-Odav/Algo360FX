import { Router } from 'express';
import { UserModel } from '../models-new/User';
import { authenticateToken, validateRequest } from '../middleware';

const router = Router();

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user!.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, validateRequest, async (req, res) => {
  try {
    const user = await UserModel.update(req.user!.id, req.body);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user profile' });
  }
});

// Get user preferences
router.get('/preferences', authenticateToken, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user!.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user.preferences || {});
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user preferences' });
  }
});

// Update user preferences
router.put('/preferences', authenticateToken, validateRequest, async (req, res) => {
  try {
    const user = await UserModel.update(req.user!.id, { preferences: req.body });
    res.json(user.preferences || {});
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user preferences' });
  }
});

// Get user notifications
router.get('/notifications', authenticateToken, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user!.id);
    res.json(user.notifications || []);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user notifications' });
  }
});

// Mark notification as read
router.put('/notifications/:id/read', authenticateToken, async (req, res) => {
  try {
    await UserModel.update(req.params.id, { read: true });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
});

// Delete notification
router.delete('/notifications/:id', authenticateToken, async (req, res) => {
  try {
    await UserModel.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete notification' });
  }
});

// Get user activity log
router.get('/activity', authenticateToken, async (req, res) => {
  try {
    const { limit = 10, offset = 0 } = req.query;
    const user = await UserModel.findById(req.user!.id);
    res.json(user.activity || []);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user activity log' });
  }
});

// Get user statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user!.id);
    res.json(user.stats || {});
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user statistics' });
  }
});

// Delete user account
router.delete('/account', authenticateToken, async (req, res) => {
  try {
    await UserModel.delete(req.user!.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user account' });
  }
});

export default router;
