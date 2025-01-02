import express, { Request, Response, NextFunction, RequestHandler } from 'express';
import { auth } from '../middleware/auth';
import { Strategy } from '../models/Strategy';
import { AuthRequest } from '../types/express';
import { validateRequest } from '../middleware/validateRequest';
import { strategySchema } from '../schemas/strategy.schema';
import { AsyncHandler } from '../types/express';
import { RouteBuilder } from '../utils/routeBuilder';
import { handleError } from '../utils/routeHandler';

// Get all strategies for a user
const getStrategies: AsyncHandler = async (req, res) => {
  try {
    const strategies = await Strategy.find({ user: (req as AuthRequest).user?._id });
    res.json(strategies);
  } catch (error) {
    handleError(error);
  }
};

// Get a specific strategy
const getStrategy: AsyncHandler = async (req, res) => {
  try {
    const strategy = await Strategy.findOne({
      _id: req.params.id,
      user: (req as AuthRequest).user?._id
    });

    if (!strategy) {
      res.status(404).json({ error: 'Strategy not found' });
      return;
    }

    res.json(strategy);
  } catch (error) {
    handleError(error);
  }
};

// Create a new strategy
const createStrategy: AsyncHandler = async (req, res) => {
  try {
    const strategy = new Strategy({
      ...req.body,
      user: (req as AuthRequest).user?._id
    });

    await strategy.save();
    res.status(201).json(strategy);
  } catch (error) {
    handleError(error);
  }
};

// Update a strategy
const updateStrategy: AsyncHandler = async (req, res) => {
  try {
    const strategy = await Strategy.findOneAndUpdate(
      { _id: req.params.id, user: (req as AuthRequest).user?._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!strategy) {
      res.status(404).json({ error: 'Strategy not found' });
      return;
    }

    res.json(strategy);
  } catch (error) {
    handleError(error);
  }
};

// Delete a strategy
const deleteStrategy: AsyncHandler = async (req, res) => {
  try {
    const strategy = await Strategy.findOneAndDelete({
      _id: req.params.id,
      user: (req as AuthRequest).user?._id
    });

    if (!strategy) {
      res.status(404).json({ error: 'Strategy not found' });
      return;
    }

    res.status(204).send();
  } catch (error) {
    handleError(error);
  }
};

// Get strategy performance metrics
const getPerformance: AsyncHandler = async (req, res) => {
  try {
    const strategy = await Strategy.findOne({
      _id: req.params.id,
      user: (req as AuthRequest).user?._id
    });

    if (!strategy) {
      res.status(404).json({ error: 'Strategy not found' });
      return;
    }

    const performance = await strategy.calculatePerformance();
    res.json(performance);
  } catch (error) {
    handleError(error);
  }
};

// Backtest a strategy
const backtestStrategy: AsyncHandler = async (req, res) => {
  try {
    const strategy = await Strategy.findOne({
      _id: req.params.id,
      user: (req as AuthRequest).user?._id
    });

    if (!strategy) {
      res.status(404).json({ error: 'Strategy not found' });
      return;
    }

    const { startDate, endDate, symbol } = req.body;
    const results = await strategy.runBacktest(startDate, endDate, symbol);
    res.json(results);
  } catch (error) {
    handleError(error);
  }
};

// Create router with RouteBuilder
const router = new RouteBuilder()
  .use(auth)
  .get('/', getStrategies)
  .get('/:id', getStrategy)
  .post('/', validateRequest(strategySchema), createStrategy)
  .put('/:id', validateRequest(strategySchema), updateStrategy)
  .delete('/:id', deleteStrategy)
  .get('/:id/performance', getPerformance)
  .post('/:id/backtest', backtestStrategy)
  .build();

export { router as strategyRouter };