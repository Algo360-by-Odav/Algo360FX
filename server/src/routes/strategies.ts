import { Router } from 'express';
import { StrategyModel } from '../models-new/Strategy';
import { StrategyCreateInput, StrategyUpdateInput } from '../types-new/Strategy';
import { authenticateToken, validateRequest } from '../middleware';

const router = Router();

// Get all strategies for the authenticated user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const strategies = await StrategyModel.findByUser(req.user!.id);
    res.json(strategies);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch strategies' });
  }
});

// Get a specific strategy
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const strategy = await StrategyModel.findUnique({ id: req.params.id });
    if (!strategy) {
      return res.status(404).json({ error: 'Strategy not found' });
    }
    if (strategy.userId !== req.user!.id) {
      return res.status(403).json({ error: 'Unauthorized access to strategy' });
    }
    res.json(strategy);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch strategy' });
  }
});

// Create a new strategy
router.post('/', authenticateToken, validateRequest, async (req, res) => {
  try {
    const strategyData: StrategyCreateInput = {
      ...req.body,
      userId: req.user!.id,
    };
    const strategy = await StrategyModel.create(strategyData);
    res.status(201).json(strategy);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create strategy' });
  }
});

// Update a strategy
router.put('/:id', authenticateToken, validateRequest, async (req, res) => {
  try {
    const strategy = await StrategyModel.findUnique({ id: req.params.id });
    if (!strategy) {
      return res.status(404).json({ error: 'Strategy not found' });
    }
    if (strategy.userId !== req.user!.id) {
      return res.status(403).json({ error: 'Unauthorized access to strategy' });
    }
    const strategyData: StrategyUpdateInput = req.body;
    const updatedStrategy = await StrategyModel.update(req.params.id, strategyData);
    res.json(updatedStrategy);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update strategy' });
  }
});

// Delete a strategy
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const strategy = await StrategyModel.findUnique({ id: req.params.id });
    if (!strategy) {
      return res.status(404).json({ error: 'Strategy not found' });
    }
    if (strategy.userId !== req.user!.id) {
      return res.status(403).json({ error: 'Unauthorized access to strategy' });
    }
    await StrategyModel.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete strategy' });
  }
});

// Backtest a strategy
router.post('/:id/backtest', authenticateToken, validateRequest, async (req, res) => {
  try {
    const strategy = await StrategyModel.findUnique({ id: req.params.id });
    if (!strategy) {
      return res.status(404).json({ error: 'Strategy not found' });
    }
    if (strategy.userId !== req.user!.id) {
      return res.status(403).json({ error: 'Unauthorized access to strategy' });
    }
    const backtestResults = await StrategyModel.backtest(req.params.id, req.body);
    res.json(backtestResults);
  } catch (error) {
    res.status(500).json({ error: 'Failed to run backtest' });
  }
});

// Get strategy performance
router.get('/:id/performance', authenticateToken, async (req, res) => {
  try {
    const strategy = await StrategyModel.findUnique({ id: req.params.id });
    if (!strategy) {
      return res.status(404).json({ error: 'Strategy not found' });
    }
    if (strategy.userId !== req.user!.id) {
      return res.status(403).json({ error: 'Unauthorized access to strategy' });
    }
    const performance = await StrategyModel.getPerformance(req.params.id);
    res.json(performance);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch strategy performance' });
  }
});

// Get strategy risk metrics
router.get('/:id/risk', authenticateToken, async (req, res) => {
  try {
    const strategy = await StrategyModel.findUnique({ id: req.params.id });
    if (!strategy) {
      return res.status(404).json({ error: 'Strategy not found' });
    }
    if (strategy.userId !== req.user!.id) {
      return res.status(403).json({ error: 'Unauthorized access to strategy' });
    }
    const riskMetrics = await StrategyModel.getRiskMetrics(req.params.id);
    res.json(riskMetrics);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch strategy risk metrics' });
  }
});

// Duplicate strategy
router.post('/:id/duplicate', authenticateToken, async (req, res) => {
  try {
    const strategy = await StrategyModel.findUnique({ id: req.params.id });
    if (!strategy) {
      return res.status(404).json({ error: 'Strategy not found' });
    }
    if (strategy.userId !== req.user!.id) {
      return res.status(403).json({ error: 'Unauthorized access to strategy' });
    }
    const duplicatedStrategy = await StrategyModel.duplicate(req.params.id, req.user!.id);
    res.json(duplicatedStrategy);
  } catch (error) {
    res.status(500).json({ error: 'Failed to duplicate strategy' });
  }
});

// Get active strategies
router.get('/status/active', authenticateToken, async (req, res) => {
  try {
    const strategies = await StrategyModel.findActive(req.user!.id);
    res.json(strategies);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch active strategies' });
  }
});

// Get strategy performance metrics
router.get('/:id/performance', authenticateToken, async (req, res) => {
  try {
    const strategy = await StrategyModel.findUnique({ id: req.params.id });
    if (!strategy) {
      return res.status(404).json({ error: 'Strategy not found' });
    }
    if (strategy.userId !== req.user!.id) {
      return res.status(403).json({ error: 'Unauthorized access to strategy' });
    }
    const metrics = await StrategyModel.getPerformanceMetrics(req.params.id);
    res.json(metrics);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch strategy performance metrics' });
  }
});

// Update strategy performance metrics
router.put('/:id/performance', authenticateToken, validateRequest, async (req, res) => {
  try {
    const strategy = await StrategyModel.findUnique({ id: req.params.id });
    if (!strategy) {
      return res.status(404).json({ error: 'Strategy not found' });
    }
    if (strategy.userId !== req.user!.id) {
      return res.status(403).json({ error: 'Unauthorized access to strategy' });
    }
    const updatedStrategy = await StrategyModel.updatePerformance(req.params.id, req.body);
    res.json(updatedStrategy);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update strategy performance metrics' });
  }
});

export default router;