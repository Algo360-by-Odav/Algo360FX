import express, { Request, Response, NextFunction, RequestHandler } from 'express';
import mongoose from 'mongoose';
import { auth } from '../middleware/auth';
import { Portfolio } from '../models/Portfolio';
import { Position } from '../models/Position';
import { AuthRequest } from '../types/express';
import { validateRequest } from '../middleware/validateRequest';
import { createPortfolioSchema } from '../schemas/portfolio.schema';
import { RouteBuilder } from '../utils/routeBuilder';
import { handleError } from '../utils/routeHandler';

// Get portfolio overview
const getPortfolioOverview: RequestHandler = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user._id;
    
    // Get all portfolios for the user
    const portfolios = await Portfolio.find({ user: userId })
      .populate('positions')
      .lean();

    // Get positions
    const positions = await Position.find({ user: userId }).lean();
    const openPositions = positions.filter(pos => !pos.closedAt);
    const closedPositions = positions.filter(pos => pos.closedAt);

    // Calculate metrics
    const totalPnL = closedPositions.reduce((sum, pos) => sum + (pos.profitLoss || 0), 0);
    const winningTrades = closedPositions.filter(pos => (pos.profitLoss || 0) > 0).length;
    const totalTrades = closedPositions.length;
    const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;

    res.json({
      overview: {
        totalPnL,
        openPositions: openPositions.length,
        closedPositions: closedPositions.length,
        winRate,
        winningTrades,
        totalTrades
      },
      lastUpdated: new Date()
    });
  } catch (err: unknown) {
    const error = err instanceof Error ? err : new Error('An unknown error occurred');
    console.error('Portfolio overview error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get portfolio overview',
      error: error.message 
    });
  }
};

// Get portfolio history
const getPortfolioHistory: RequestHandler = async (req: AuthRequest, res: Response, next: NextFunction) => {
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
    interface DailyHistory {
      [key: string]: {
        date: string;
        pnl: number;
        trades: number;
      };
    }

    const history = positions.reduce<DailyHistory>((acc, pos) => {
      if (!pos.closedAt) return acc;
      
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
  } catch (err: unknown) {
    const error = err instanceof Error ? err : new Error('An unknown error occurred');
    console.error('Error getting portfolio history:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get portfolio history',
      error: error.message 
    });
  }
};

// Create portfolio
const createPortfolio: RequestHandler = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user._id;
    const portfolio = new Portfolio({
      ...req.body,
      user: userId
    });
    await portfolio.save();
    res.status(201).json(portfolio);
  } catch (err: unknown) {
    const error = err instanceof Error ? err : new Error('An unknown error occurred');
    console.error('Create portfolio error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create portfolio',
      error: error.message 
    });
  }
};

// Create router with RouteBuilder
const router = new RouteBuilder()
  .get('/', auth, getPortfolioOverview)
  .get('/history', auth, getPortfolioHistory)
  .post('/', auth, validateRequest(createPortfolioSchema), createPortfolio)
  .build();

export { router as portfolioRouter };
