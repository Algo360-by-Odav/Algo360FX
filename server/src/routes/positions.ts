import express from 'express';
import { PrismaClient } from '@prisma/client';
import { auth } from '../middleware/auth';
import { AuthRequest } from '../types/express';
import Joi from 'joi';

const router = express.Router();
const prisma = new PrismaClient();

// Position validation schema
const positionSchema = Joi.object({
  symbol: Joi.string().required(),
  type: Joi.string().valid('BUY', 'SELL').required(),
  entryPrice: Joi.number().required(),
  stopLoss: Joi.number(),
  takeProfit: Joi.number(),
  size: Joi.number().required(),
  strategyId: Joi.string().required()
});

// Get all positions
router.get('/', auth, async (req: AuthRequest, res) => {
  try {
    const positions = await prisma.position.findMany({
      where: { userId: req.user.id },
      include: {
        strategy: true
      }
    });
    res.json(positions);
  } catch (error) {
    console.error('Get positions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get position by id
router.get('/:id', auth, async (req: AuthRequest, res) => {
  try {
    const position = await prisma.position.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id
      },
      include: {
        strategy: true
      }
    });

    if (!position) {
      return res.status(404).json({ error: 'Position not found' });
    }

    res.json(position);
  } catch (error) {
    console.error('Get position error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create position
router.post('/', auth, async (req: AuthRequest, res) => {
  try {
    const { error, value } = positionSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Verify strategy belongs to user
    const strategy = await prisma.strategy.findFirst({
      where: {
        id: value.strategyId,
        userId: req.user.id
      }
    });

    if (!strategy) {
      return res.status(404).json({ error: 'Strategy not found' });
    }

    const position = await prisma.position.create({
      data: {
        ...value,
        userId: req.user.id,
        status: 'OPEN'
      }
    });

    res.status(201).json(position);
  } catch (error) {
    console.error('Create position error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update position
router.put('/:id', auth, async (req: AuthRequest, res) => {
  try {
    const { error, value } = positionSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const position = await prisma.position.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!position) {
      return res.status(404).json({ error: 'Position not found' });
    }

    // Verify strategy belongs to user
    const strategy = await prisma.strategy.findFirst({
      where: {
        id: value.strategyId,
        userId: req.user.id
      }
    });

    if (!strategy) {
      return res.status(404).json({ error: 'Strategy not found' });
    }

    const updatedPosition = await prisma.position.update({
      where: { id: req.params.id },
      data: value
    });

    res.json(updatedPosition);
  } catch (error) {
    console.error('Update position error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Close position
router.post('/:id/close', auth, async (req: AuthRequest, res) => {
  try {
    const { exitPrice } = req.body;

    if (!exitPrice || typeof exitPrice !== 'number') {
      return res.status(400).json({ error: 'Exit price is required' });
    }

    const position = await prisma.position.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id,
        status: 'OPEN'
      }
    });

    if (!position) {
      return res.status(404).json({ error: 'Open position not found' });
    }

    const profit = position.type === 'BUY'
      ? (exitPrice - position.entryPrice) * position.size
      : (position.entryPrice - exitPrice) * position.size;

    const closedPosition = await prisma.position.update({
      where: { id: req.params.id },
      data: {
        exitPrice,
        profit,
        status: 'CLOSED',
        closedAt: new Date()
      }
    });

    res.json(closedPosition);
  } catch (error) {
    console.error('Close position error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { router as positionRouter };
