import { Router } from 'express';
import { PositionModel } from '../models-new/Position';
import { PositionCreateInput, PositionUpdateInput } from '../types-new/Position';
import { authenticateToken, validateRequest } from '../middleware';

const router = Router();

// Create position
router.post('/', authenticateToken, validateRequest, async (req, res) => {
  try {
    const positionData: PositionCreateInput = {
      ...req.body,
      userId: req.user!.id
    };
    const position = await PositionModel.create(positionData);
    res.json(position);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create position' });
  }
});

// Get all positions for user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const positions = await PositionModel.findByUser(req.user!.id);
    res.json(positions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch positions' });
  }
});

// Get position by ID
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

// Update position
router.put('/:id', authenticateToken, validateRequest, async (req, res) => {
  try {
    const position = await PositionModel.findUnique({ id: req.params.id });
    if (!position) {
      return res.status(404).json({ error: 'Position not found' });
    }
    if (position.userId !== req.user!.id) {
      return res.status(403).json({ error: 'Unauthorized access to position' });
    }
    
    const positionData: PositionUpdateInput = req.body;
    const updatedPosition = await PositionModel.update(req.params.id, positionData);
    res.json(updatedPosition);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update position' });
  }
});

// Delete position
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

// Close position
router.post('/:id/close', authenticateToken, validateRequest, async (req, res) => {
  try {
    const position = await PositionModel.findUnique({ id: req.params.id });
    if (!position) {
      return res.status(404).json({ error: 'Position not found' });
    }
    if (position.userId !== req.user!.id) {
      return res.status(403).json({ error: 'Unauthorized access to position' });
    }
    
    const { exitPrice, profit } = req.body;
    const closedPosition = await PositionModel.closePosition(req.params.id, exitPrice, profit);
    res.json(closedPosition);
  } catch (error) {
    res.status(500).json({ error: 'Failed to close position' });
  }
});

// Get positions by portfolio
router.get('/portfolio/:portfolioId', authenticateToken, async (req, res) => {
  try {
    const positions = await PositionModel.findByPortfolio(req.params.portfolioId);
    // Filter positions to only show those belonging to the user
    const userPositions = positions.filter(p => p.userId === req.user!.id);
    res.json(userPositions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch portfolio positions' });
  }
});

// Get positions by strategy
router.get('/strategy/:strategyId', authenticateToken, async (req, res) => {
  try {
    const positions = await PositionModel.findByStrategy(req.params.strategyId);
    // Filter positions to only show those belonging to the user
    const userPositions = positions.filter(p => p.userId === req.user!.id);
    res.json(userPositions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch strategy positions' });
  }
});

// Get open positions
router.get('/status/open', authenticateToken, async (req, res) => {
  try {
    const positions = await PositionModel.findOpenPositions(req.user!.id);
    res.json(positions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch open positions' });
  }
});

// Get closed positions
router.get('/status/closed', authenticateToken, async (req, res) => {
  try {
    const positions = await PositionModel.findClosedPositions(req.user!.id);
    res.json(positions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch closed positions' });
  }
});

// Update position metadata
router.put('/:id/metadata', authenticateToken, validateRequest, async (req, res) => {
  try {
    const position = await PositionModel.findUnique({ id: req.params.id });
    if (!position) {
      return res.status(404).json({ error: 'Position not found' });
    }
    if (position.userId !== req.user!.id) {
      return res.status(403).json({ error: 'Unauthorized access to position' });
    }
    
    const updatedPosition = await PositionModel.updateMetadata(req.params.id, req.body);
    res.json(updatedPosition);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update position metadata' });
  }
});

export default router;
