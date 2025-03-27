import { Router } from 'express';
import { UserModel } from '../models-new/User';
import { authenticateToken, validateRequest } from '../middleware';
import { User, UserPreferences } from '../types-new/User';

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
    res.json(user.preferences || { theme: 'light' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user preferences' });
  }
});

// Update user preferences
router.put('/preferences', authenticateToken, validateRequest, async (req, res) => {
  try {
    const preferences = req.body as UserPreferences;
    const user = await UserModel.update(req.user!.id, { preferences });
    res.json(user.preferences || { theme: 'light' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user preferences' });
  }
});

// Get user portfolio summary
router.get('/portfolio/summary', authenticateToken, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user!.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const portfolioSummary = user.portfolios?.map(portfolio => ({
      id: portfolio.id,
      name: portfolio.name,
      balance: portfolio.balance,
      currency: portfolio.currency,
      positionCount: portfolio.positions.length,
      totalProfit: portfolio.positions.reduce((sum, pos) => sum + (pos.profit || 0), 0)
    })) || [];

    res.json(portfolioSummary);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch portfolio summary' });
  }
});

// Get user strategy summary
router.get('/strategy/summary', authenticateToken, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user!.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const strategySummary = user.strategies?.map(strategy => ({
      id: strategy.id,
      name: strategy.name,
      type: strategy.type,
      isActive: strategy.isActive,
      performance: strategy.performance
    })) || [];

    res.json(strategySummary);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch strategy summary' });
  }
});

// Get user statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user!.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const stats = {
      totalPortfolios: user.portfolios?.length || 0,
      totalStrategies: user.strategies?.length || 0,
      totalPositions: user.portfolios?.reduce((sum, p) => sum + p.positions.length, 0) || 0,
      activePositions: user.portfolios?.reduce((sum, p) => sum + p.positions.filter(pos => !pos.closeTime).length, 0) || 0,
      totalProfit: user.portfolios?.reduce((sum, p) => 
        sum + p.positions.reduce((pSum, pos) => pSum + (pos.profit || 0), 0), 0) || 0
    };

    res.json(stats);
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
