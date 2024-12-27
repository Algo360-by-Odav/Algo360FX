import express from 'express';
import { getMarketData, placeMarketOrder } from '../services/metaapi';
import auth from '../middleware/auth';
import { Position } from '../models/Position';
import { Portfolio } from '../models/Portfolio';
import { Strategy } from '../models/Strategy';
import { UserPayload } from '../types/auth';

const router = express.Router();

// Get market data for a symbol
router.get('/:symbol', auth, async (req: express.Request, res: express.Response) => {
  try {
    const { symbol } = req.params;
    const data = await getMarketData(symbol);
    return res.json(data);
  } catch (error) {
    console.error('Error fetching market data:', error);
    return res.status(500).json({ error: 'Failed to fetch market data' });
  }
});

// Place a market order
router.post('/order', auth, async (req: express.Request, res: express.Response) => {
  try {
    const { symbol, type, volume } = req.body;

    if (!symbol || !type || !volume) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    if (type !== 'buy' && type !== 'sell') {
      return res.status(400).json({ error: 'Invalid order type' });
    }

    const order = await placeMarketOrder(symbol, type, volume);
    return res.json(order);
  } catch (error) {
    console.error('Error placing market order:', error);
    return res.status(500).json({ error: 'Failed to place market order' });
  }
});

// Get all positions
router.get('/positions', auth, async (req: express.Request, res: express.Response) => {
  try {
    const userPayload = req.user as UserPayload | undefined;
    if (!userPayload?.id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const positions = await Position.find({ userId: userPayload.id });
    return res.json(positions);
  } catch (error) {
    console.error('Error fetching positions:', error);
    return res.status(500).json({ error: 'Failed to fetch positions' });
  }
});

// Get portfolio
router.get('/portfolio', auth, async (req: express.Request, res: express.Response) => {
  try {
    const userPayload = req.user as UserPayload | undefined;
    if (!userPayload?.id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const portfolio = await Portfolio.findOne({ userId: userPayload.id });
    if (!portfolio) {
      // Create default portfolio if none exists
      const newPortfolio = await Portfolio.create({
        userId: userPayload.id,
        balance: 10000,
        equity: 10000,
        margin: 0,
        freeMargin: 10000,
        marginLevel: 0,
        positions: []
      });
      return res.json(newPortfolio);
    }

    return res.json(portfolio);
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    return res.status(500).json({ error: 'Failed to fetch portfolio' });
  }
});

// Get all strategies
router.get('/strategies', auth, async (req: express.Request, res: express.Response) => {
  try {
    const userPayload = req.user as UserPayload | undefined;
    if (!userPayload?.id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const strategies = await Strategy.find({ userId: userPayload.id });
    return res.json(strategies);
  } catch (error) {
    console.error('Error fetching strategies:', error);
    return res.status(500).json({ error: 'Failed to fetch strategies' });
  }
});

// Create a new strategy
router.post('/strategies', auth, async (req: express.Request, res: express.Response) => {
  try {
    const userPayload = req.user as UserPayload | undefined;
    if (!userPayload?.id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const strategy = await Strategy.create({
      ...req.body,
      userId: userPayload.id
    });
    return res.json(strategy);
  } catch (error) {
    console.error('Error creating strategy:', error);
    return res.status(500).json({ error: 'Failed to create strategy' });
  }
});

export default router;
