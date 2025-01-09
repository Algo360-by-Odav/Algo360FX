import { Router } from 'express';
import { PositionModel } from '../models-new/Position';
import { authenticateToken } from '../middleware';
import { validateRequest } from '../middleware';

const router = Router();

// Get all positions for the authenticated user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const positions = await PositionModel.findByUser(req.user!.id);
    res.json(positions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch positions' });
  }
});

// Get a specific position
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const position = await PositionModel.findUnique({ id: req.params.id });
    if (!position) {
      return res.status(404).json({ error: 'Position not found' });
    }
    if (position.userId !== req.user!.id) {
      return res.status(403).json({ error: 'Unauthorized access to position' });
    }
    res.json(position);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch position' });
  }
});

// Create a new position
router.post('/', authenticateToken, validateRequest, async (req, res) => {
  try {
    const positionData = {
      ...req.body,
      userId: req.user!.id,
      openTime: new Date(),
      status: 'OPEN',
    };

    const position = await PositionModel.create(positionData);
    res.status(201).json(position);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create position' });
  }
});

// Update a position
router.put('/:id', authenticateToken, validateRequest, async (req, res) => {
  try {
    const position = await PositionModel.findUnique({ id: req.params.id });
    if (!position) {
      return res.status(404).json({ error: 'Position not found' });
    }
    if (position.userId !== req.user!.id) {
      return res.status(403).json({ error: 'Unauthorized access to position' });
    }

    const updatedPosition = await PositionModel.update(req.params.id, req.body);
    res.json(updatedPosition);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update position' });
  }
});

// Delete a position
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const position = await PositionModel.findUnique({ id: req.params.id });
    if (!position) {
      return res.status(404).json({ error: 'Position not found' });
    }
    if (position.userId !== req.user!.id) {
      return res.status(403).json({ error: 'Unauthorized access to position' });
    }

    await PositionModel.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete position' });
  }
});

// Get positions by portfolio
router.get('/portfolio/:portfolioId', authenticateToken, async (req, res) => {
  try {
    const positions = await PositionModel.findByPortfolio(req.params.portfolioId);
    if (positions.some(p => p.userId !== req.user!.id)) {
      return res.status(403).json({ error: 'Unauthorized access to portfolio positions' });
    }
    res.json(positions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch portfolio positions' });
  }
});

// Get positions by strategy
router.get('/strategy/:strategyId', authenticateToken, async (req, res) => {
  try {
    const positions = await PositionModel.findByStrategy(req.params.strategyId);
    if (positions.some(p => p.userId !== req.user!.id)) {
      return res.status(403).json({ error: 'Unauthorized access to strategy positions' });
    }
    res.json(positions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch strategy positions' });
  }
});

// Close position
router.post('/:id/close', authenticateToken, async (req, res) => {
  try {
    const { exitPrice } = req.body;

    if (!exitPrice || typeof exitPrice !== 'number') {
      return res.status(400).json({ error: 'Exit price is required' });
    }

    const position = await PositionModel.findUnique({ id: req.params.id });
    if (!position) {
      return res.status(404).json({ error: 'Position not found' });
    }
    if (position.userId !== req.user!.id) {
      return res.status(403).json({ error: 'Unauthorized access to position' });
    }

    const profit = position.type === 'BUY'
      ? (exitPrice - position.entryPrice) * position.size
      : (position.entryPrice - exitPrice) * position.size;

    const closedPosition = await PositionModel.update(req.params.id, {
      exitPrice,
      profit,
      status: 'CLOSED',
      closedAt: new Date()
    });

    res.json(closedPosition);
  } catch (error) {
    res.status(500).json({ error: 'Failed to close position' });
  }
});

export default router;
