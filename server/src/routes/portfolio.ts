import express from 'express';
import mongoose from 'mongoose';
import { auth } from '../middleware/auth';
import { Portfolio } from '../models/Portfolio';
import { Position } from '../models/Position';
import { AsyncRequestHandler } from '../types/express';
import { validateRequest } from '../middleware/validateRequest';
import { createPortfolioSchema, updatePortfolioSchema } from '../schemas/portfolio.schema';

const router = express.Router();

// Get portfolio overview
const getPortfolioOverview: AsyncRequestHandler = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Get all portfolios for the user
    const portfolios = await Portfolio.find({ user: userId })
      .populate('strategies')
      .lean();

    // Get all open positions
    const positions = await Position.find({
      user: userId,
      status: 'open'
    }).lean();

    // Calculate totals
    const totalBalance = portfolios.reduce((sum, p) => sum + (p.balance || 0), 0);
    const totalEquity = portfolios.reduce((sum, p) => sum + (p.equity || 0), 0);
    const totalPnL = positions.reduce((sum, p) => sum + (p.profitLoss || 0), 0);

    // Calculate metrics
    const closedPositions = await Position.find({
      user: userId,
      status: 'closed'
    }).lean();

    const winningTrades = closedPositions.filter(p => (p.profitLoss || 0) > 0).length;
    const totalTrades = closedPositions.length;
    const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;

    const profits = closedPositions.filter(p => (p.profitLoss || 0) > 0)
      .reduce((sum, p) => sum + (p.profitLoss || 0), 0);
    const losses = Math.abs(closedPositions.filter(p => (p.profitLoss || 0) < 0)
      .reduce((sum, p) => sum + (p.profitLoss || 0), 0));
    const profitFactor = losses > 0 ? profits / losses : profits > 0 ? Infinity : 0;

    res.json({
      portfolios,
      totalBalance,
      totalEquity,
      openPositions: positions,
      metrics: {
        winRate,
        profitFactor,
        totalTrades,
        openTrades: positions.length,
        totalPnL
      },
      lastUpdated: new Date()
    });
  } catch (error) {
    console.error('Portfolio overview error:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Error fetching portfolio overview',
      error: error.message
    });
  }
};

// Get portfolio history
const getPortfolioHistory: AsyncRequestHandler = async (req, res) => {
  try {
    const userId = req.user._id;
    const { days = 30 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - Number(days));

    const positions = await Position.find({
      user: userId,
      closedAt: { $gte: startDate }
    }).sort({ closedAt: 1 }).lean();

    // Group by day
    const history = positions.reduce((acc, pos) => {
      const date = pos.closedAt.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = {
          date,
          pnl: 0,
          trades: 0
        };
      }
      acc[date].pnl += pos.profitLoss || 0;
      acc[date].trades += 1;
      return acc;
    }, {});

    res.json(Object.values(history));
  } catch (error) {
    console.error('Portfolio history error:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Error fetching portfolio history',
      error: error.message
    });
  }
};

// Create portfolio
const createPortfolio: AsyncRequestHandler = async (req, res) => {
  try {
    const portfolio = new Portfolio({
      ...req.body,
      user: req.user._id
    });
    await portfolio.save();
    res.status(201).json(portfolio);
  } catch (error) {
    console.error('Create portfolio error:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Error creating portfolio',
      error: error.message
    });
  }
};

// Register routes
router.use(auth);

router.get('/', getPortfolioOverview);
router.get('/history', getPortfolioHistory);
router.post('/', validateRequest(createPortfolioSchema), createPortfolio);

export { router as portfolioRouter };
