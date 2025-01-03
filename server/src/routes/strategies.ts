import express, { Response, RequestHandler } from 'express';
import { auth } from '../middleware/auth';
import { AuthRequest } from '../types/express';
import prisma from '../lib/prisma';
import Joi from 'joi';

const router = express.Router();

// Validation schemas
const strategySchema = Joi.object({
  name: Joi.string().required().min(1).max(100),
  description: Joi.string().allow('').max(500),
  config: Joi.object().required(),
  isPublic: Joi.boolean().default(false)
});

const updateStrategySchema = Joi.object({
  name: Joi.string().min(1).max(100),
  description: Joi.string().allow('').max(500),
  config: Joi.object(),
  isPublic: Joi.boolean()
}).min(1);

// Get all strategies
const getStrategies: RequestHandler = async (req, res) => {
  const authReq = req as AuthRequest;
  try {
    const strategies = await prisma.strategy.findMany({
      where: {
        userId: authReq.user.id
      },
      include: {
        positions: true
      }
    });

    return res.json(strategies);
  } catch (error) {
    console.error('Get strategies error:', error);
    return res.status(500).json({ error: 'Failed to retrieve strategies' });
  }
};

// Get strategy by ID
const getStrategyById: RequestHandler = async (req, res) => {
  const authReq = req as AuthRequest;
  try {
    const strategy = await prisma.strategy.findUnique({
      where: {
        id: req.params.id,
        userId: authReq.user.id
      },
      include: {
        positions: true
      }
    });

    if (!strategy) {
      return res.status(404).json({ error: 'Strategy not found' });
    }

    return res.json(strategy);
  } catch (error) {
    console.error('Get strategy error:', error);
    return res.status(500).json({ error: 'Failed to retrieve strategy' });
  }
};

// Create strategy
const createStrategy: RequestHandler = async (req, res) => {
  const authReq = req as AuthRequest;
  try {
    const { error, value } = strategySchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const strategy = await prisma.strategy.create({
      data: {
        ...value,
        userId: authReq.user.id
      }
    });

    return res.status(201).json(strategy);
  } catch (error) {
    console.error('Create strategy error:', error);
    return res.status(500).json({ error: 'Failed to create strategy' });
  }
};

// Update strategy
const updateStrategy: RequestHandler = async (req, res) => {
  const authReq = req as AuthRequest;
  try {
    const { error, value } = updateStrategySchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const strategy = await prisma.strategy.findUnique({
      where: {
        id: req.params.id,
        userId: authReq.user.id
      }
    });

    if (!strategy) {
      return res.status(404).json({ error: 'Strategy not found' });
    }

    const updatedStrategy = await prisma.strategy.update({
      where: {
        id: req.params.id
      },
      data: value
    });

    return res.json(updatedStrategy);
  } catch (error) {
    console.error('Update strategy error:', error);
    return res.status(500).json({ error: 'Failed to update strategy' });
  }
};

// Delete strategy
const deleteStrategy: RequestHandler = async (req, res) => {
  const authReq = req as AuthRequest;
  try {
    const strategy = await prisma.strategy.findUnique({
      where: {
        id: req.params.id,
        userId: authReq.user.id
      }
    });

    if (!strategy) {
      return res.status(404).json({ error: 'Strategy not found' });
    }

    await prisma.strategy.delete({
      where: {
        id: req.params.id
      }
    });

    return res.status(204).send();
  } catch (error) {
    console.error('Delete strategy error:', error);
    return res.status(500).json({ error: 'Failed to delete strategy' });
  }
};

// Duplicate strategy
const duplicateStrategy: RequestHandler = async (req, res) => {
  const authReq = req as AuthRequest;
  try {
    const strategy = await prisma.strategy.findUnique({
      where: {
        id: req.params.id,
        userId: authReq.user.id
      }
    });

    if (!strategy) {
      return res.status(404).json({ error: 'Strategy not found' });
    }

    const { id, createdAt, updatedAt, ...strategyData } = strategy;
    const duplicatedStrategy = await prisma.strategy.create({
      data: {
        ...strategyData,
        name: `${strategyData.name} (Copy)`,
        userId: authReq.user.id
      }
    });

    return res.status(201).json(duplicatedStrategy);
  } catch (error) {
    console.error('Duplicate strategy error:', error);
    return res.status(500).json({ error: 'Failed to duplicate strategy' });
  }
};

// Get strategy performance metrics
const getStrategyPerformance: RequestHandler = async (req, res) => {
  const authReq = req as AuthRequest;
  try {
    const strategy = await prisma.strategy.findUnique({
      where: {
        id: req.params.id,
        userId: authReq.user.id
      },
      include: {
        positions: true
      }
    });

    if (!strategy) {
      return res.status(404).json({ error: 'Strategy not found' });
    }

    // Calculate performance metrics
    const metrics = {
      totalTrades: strategy.positions.length,
      winningTrades: strategy.positions.filter(p => p.profit > 0).length,
      losingTrades: strategy.positions.filter(p => p.profit < 0).length,
      totalProfit: strategy.positions.reduce((sum, p) => sum + (p.profit || 0), 0),
      averageProfit: strategy.positions.length > 0 
        ? strategy.positions.reduce((sum, p) => sum + (p.profit || 0), 0) / strategy.positions.length 
        : 0
    };

    return res.json(metrics);
  } catch (error) {
    console.error('Get strategy performance error:', error);
    return res.status(500).json({ error: 'Failed to retrieve strategy performance' });
  }
};

// Routes
router.get('/', auth, getStrategies);
router.get('/:id', auth, getStrategyById);
router.post('/', auth, createStrategy);
router.put('/:id', auth, updateStrategy);
router.delete('/:id', auth, deleteStrategy);
router.post('/:id/duplicate', auth, duplicateStrategy);
router.get('/:id/performance', auth, getStrategyPerformance);

export { router as strategyRouter };