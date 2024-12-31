import express from 'express';
import { auth } from '../middleware/auth';
import { Strategy } from '../models/Strategy';
import { AsyncRequestHandler } from '../types/express';
import { validateRequest } from '../middleware/validateRequest';
import { createStrategySchema, updateStrategySchema } from '../schemas/strategy.schema';

const router = express.Router();

// Get all strategies
const getStrategies: AsyncRequestHandler = async (req, res) => {
  try {
    const strategies = await Strategy.find({ user: req.user?._id });
    res.json(strategies);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching strategies' });
  }
};

// Get strategy by ID
const getStrategyById: AsyncRequestHandler = async (req, res) => {
  try {
    const strategy = await Strategy.findOne({
      _id: req.params.id,
      user: req.user?._id
    });

    if (!strategy) {
      return res.status(404).json({ message: 'Strategy not found' });
    }

    res.json(strategy);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching strategy' });
  }
};

// Create strategy
const createStrategy: AsyncRequestHandler = async (req, res) => {
  try {
    const strategy = new Strategy({
      ...req.body,
      user: req.user?._id
    });

    await strategy.save();
    res.status(201).json(strategy);
  } catch (error) {
    res.status(500).json({ message: 'Error creating strategy' });
  }
};

// Update strategy
const updateStrategy: AsyncRequestHandler = async (req, res) => {
  try {
    const strategy = await Strategy.findOneAndUpdate(
      { _id: req.params.id, user: req.user?._id },
      req.body,
      { new: true }
    );

    if (!strategy) {
      return res.status(404).json({ message: 'Strategy not found' });
    }

    res.json(strategy);
  } catch (error) {
    res.status(500).json({ message: 'Error updating strategy' });
  }
};

// Delete strategy
const deleteStrategy: AsyncRequestHandler = async (req, res) => {
  try {
    const strategy = await Strategy.findOneAndDelete({
      _id: req.params.id,
      user: req.user?._id
    });

    if (!strategy) {
      return res.status(404).json({ message: 'Strategy not found' });
    }

    res.json({ message: 'Strategy deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting strategy' });
  }
};

// Backtest strategy
const backtestStrategy: AsyncRequestHandler = async (req, res) => {
  try {
    const strategy = await Strategy.findOne({
      _id: req.params.id,
      user: req.user?._id
    });

    if (!strategy) {
      return res.status(404).json({ message: 'Strategy not found' });
    }

    // TODO: Implement backtesting logic
    const backtestResults = {
      strategyId: strategy._id,
      profitLoss: 0,
      winRate: 0,
      trades: [],
      startDate: new Date(),
      endDate: new Date()
    };

    res.json(backtestResults);
  } catch (error) {
    res.status(500).json({ message: 'Error backtesting strategy' });
  }
};

// Register routes
router.use(auth);

router.get('/', getStrategies);
router.get('/:id', getStrategyById);
router.post('/', validateRequest(createStrategySchema), createStrategy);
router.put('/:id', validateRequest(updateStrategySchema), updateStrategy);
router.delete('/:id', deleteStrategy);
router.post('/:id/backtest', backtestStrategy);

export { router as strategyRouter };