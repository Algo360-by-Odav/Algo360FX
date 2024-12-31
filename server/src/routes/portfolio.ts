import express from 'express';
import { auth } from '../middleware/auth';
import { Portfolio } from '../models/Portfolio';
import { AsyncRequestHandler } from '../types/express';
import { validateRequest } from '../middleware/validateRequest';
import { createPortfolioSchema, updatePortfolioSchema } from '../schemas/portfolio.schema';

const router = express.Router();

// Get portfolio overview
const getPortfolioOverview: AsyncRequestHandler = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('Portfolio request received:', {
      userId,
      headers: req.headers,
      timestamp: new Date().toISOString()
    });
    
    // Log MongoDB connection state
    const dbState = ['disconnected', 'connected', 'connecting', 'disconnecting'];
    console.log('MongoDB connection state:', dbState[mongoose.connection.readyState]);
    
    // Placeholder data - replace with actual portfolio data from your database
    console.log('Fetching portfolio for user:', userId);
    
    res.json({
      userId,
      totalBalance: 10000,
      equity: 12000,
      margin: 2000,
      freeMargin: 8000,
      marginLevel: 600,
      currency: 'USD',
      positions: [],
      lastUpdated: new Date(),
      pnl: {
        daily: 0,
        weekly: 0,
        monthly: 0,
        total: 0
      },
      metrics: {
        winRate: 0,
        profitFactor: 0,
        sharpeRatio: 0,
        maxDrawdown: 0,
        averageWin: 0,
        averageLoss: 0,
        totalTrades: 0
      }
    });
  } catch (error: any) {
    console.error('Portfolio fetch error:', {
      error: error.message,
      stack: error.stack,
      userId: req.user?.id,
      timestamp: new Date().toISOString()
    });
    res.status(500).json({
      error: 'Failed to fetch portfolio',
      message: error.message
    });
  }
};

// Get portfolio history
const getPortfolioHistory: AsyncRequestHandler = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('Fetching portfolio history for user:', userId);
    
    // Generate 30 days of mock data
    const history = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return {
        date: date.toISOString(),
        balance: 10000 + Math.random() * 2000 - 1000,
        equity: 12000 + Math.random() * 2000 - 1000,
        profit: Math.random() * 200 - 100
      };
    });

    res.json(history);
  } catch (error: any) {
    console.error('Portfolio history fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch portfolio history',
      message: error.message
    });
  }
};

// Register routes
router.use(auth);

router.get('/', getPortfolioOverview);
router.get('/history', getPortfolioHistory);

export { router as portfolioRouter };
