import express, { Response, RequestHandler } from 'express';
import { auth } from '../middleware/auth';
import { AuthRequest } from '../types/express';
import { prisma } from '../lib/prisma';
import { Prisma } from '@prisma/client';
import Joi from 'joi';

// Validation schemas
const strategySchema = Joi.object({
  name: Joi.string().required().min(1).max(100),
  description: Joi.string().allow('').max(500),
  type: Joi.string().required(),
  parameters: Joi.object({
    symbol: Joi.string().required(),
    timeframe: Joi.string().required(),
    // Add other parameter validations as needed
  }).required(),
  config: Joi.object(),
  isPublic: Joi.boolean()
}).min(1);

const updateStrategySchema = Joi.object({
  name: Joi.string().min(1).max(100),
  description: Joi.string().allow('').max(500),
  type: Joi.string(),
  parameters: Joi.object({
    symbol: Joi.string(),
    timeframe: Joi.string(),
    // Add other parameter validations as needed
  }),
  config: Joi.object(),
  isPublic: Joi.boolean()
}).min(1);

// Get all strategies
const getStrategies: RequestHandler = async (req, res) => {
  const authReq = req as AuthRequest;
  try {
    if (!authReq.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const strategies = await prisma.strategy.findMany({
      where: {
        positions: {
          some: {
            portfolio: {
              userId: authReq.user.id
            }
          }
        }
      },
      include: {
        positions: {
          include: {
            portfolio: true
          }
        }
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
    if (!authReq.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const strategy = await prisma.strategy.findFirst({
      where: {
        id: req.params.id,
        positions: {
          some: {
            portfolio: {
              userId: authReq.user.id
            }
          }
        }
      },
      include: {
        positions: {
          include: {
            portfolio: true
          }
        }
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
    if (!authReq.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { error, value } = strategySchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Get user's default portfolio
    const defaultPortfolio = await prisma.portfolio.findFirst({
      where: {
        userId: authReq.user.id,
        name: 'Default Portfolio'
      }
    });

    if (!defaultPortfolio) {
      return res.status(404).json({ error: 'Default portfolio not found' });
    }

    const strategy = await prisma.strategy.create({
      data: {
        name: value.name,
        description: value.description,
        type: value.type,
        parameters: value.parameters as Prisma.InputJsonValue,
      }
    });

    // Create a position to link the strategy to the user's portfolio
    await prisma.position.create({
      data: {
        strategy: {
          connect: {
            id: strategy.id
          }
        },
        portfolio: {
          connect: {
            id: defaultPortfolio.id
          }
        },
        symbol: (value.parameters as { symbol: string }).symbol || 'EURUSD',
        type: 'PENDING',
        status: 'PENDING',
        size: 0,
        entryPrice: 0,
        openTime: new Date(),
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
    if (!authReq.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { error, value } = updateStrategySchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const strategy = await prisma.strategy.findFirst({
      where: {
        id: req.params.id,
        positions: {
          some: {
            portfolio: {
              userId: authReq.user.id
            }
          }
        }
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
    if (!authReq.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const strategy = await prisma.strategy.findFirst({
      where: {
        id: req.params.id,
        positions: {
          some: {
            portfolio: {
              userId: authReq.user.id
            }
          }
        }
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
    if (!authReq.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const strategy = await prisma.strategy.findFirst({
      where: {
        id: req.params.id,
        positions: {
          some: {
            portfolio: {
              userId: authReq.user.id
            }
          }
        }
      }
    });

    if (!strategy) {
      return res.status(404).json({ error: 'Strategy not found' });
    }

    // Get user's default portfolio
    const defaultPortfolio = await prisma.portfolio.findFirst({
      where: {
        userId: authReq.user.id,
        name: 'Default Portfolio'
      }
    });

    if (!defaultPortfolio) {
      return res.status(404).json({ error: 'Default portfolio not found' });
    }

    const { id, createdAt, updatedAt, ...strategyData } = strategy;
    const duplicatedStrategy = await prisma.strategy.create({
      data: {
        name: `${strategyData.name} (Copy)`,
        description: strategyData.description,
        type: strategyData.type,
        parameters: strategyData.parameters as Prisma.InputJsonValue,
      }
    });

    // Create a position to link the strategy to the user's portfolio
    await prisma.position.create({
      data: {
        strategy: {
          connect: {
            id: duplicatedStrategy.id
          }
        },
        portfolio: {
          connect: {
            id: defaultPortfolio.id
          }
        },
        symbol: strategyData.parameters && typeof strategyData.parameters === 'object' && 'symbol' in strategyData.parameters 
          ? (strategyData.parameters as { symbol: string }).symbol 
          : 'EURUSD',
        type: 'PENDING',
        status: 'PENDING',
        size: 0,
        entryPrice: 0,
        openTime: new Date(),
      }
    });

    return res.status(201).json(duplicatedStrategy);
  } catch (error) {
    console.error('Duplicate strategy error:', error);
    return res.status(500).json({ error: 'Failed to duplicate strategy' });
  }
};

// Get strategy performance metrics
const getStrategyPerformance = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const strategy = await prisma.strategy.findFirst({
      where: {
        id: req.params.id,
        positions: {
          some: {
            portfolio: {
              userId: req.user.id
            }
          }
        }
      },
      include: {
        positions: {
          include: {
            portfolio: true
          }
        }
      }
    });

    if (!strategy) {
      return res.status(404).json({ error: 'Strategy not found' });
    }

    const positions = strategy.positions;

    // Calculate performance metrics
    const totalTrades = positions.length;
    const winningTrades = positions.filter((p: any) => (p.profit || 0) > 0).length;
    const losingTrades = positions.filter((p: any) => (p.profit || 0) < 0).length;
    const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;
    const totalProfit = positions.reduce((sum: number, p: any) => sum + (p.profit || 0), 0);
    const avgProfit = totalTrades > 0 ? totalProfit / totalTrades : 0;

    return res.json({
      totalTrades,
      winningTrades,
      losingTrades,
      winRate,
      totalProfit,
      avgProfit
    });
  } catch (error) {
    console.error('Get strategy performance error:', error);
    return res.status(500).json({ error: 'Failed to get strategy performance' });
  }
};

// Routes
const router = express.Router();
router.get('/', auth, getStrategies);
router.get('/:id', auth, getStrategyById);
router.post('/', auth, createStrategy);
router.put('/:id', auth, updateStrategy);
router.delete('/:id', auth, deleteStrategy);
router.post('/:id/duplicate', auth, duplicateStrategy);
router.get('/:id/performance', auth, getStrategyPerformance);

export default router;