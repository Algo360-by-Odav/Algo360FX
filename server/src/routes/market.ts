import express from 'express';
import { getMarketData, placeMarketOrder } from '../services/metaapi';
import auth from '../middleware/auth';
import { Position } from '../models/Position';
import { Portfolio } from '../models/Portfolio';
import { Strategy } from '../models/Strategy';
import { UserPayload } from '../types/auth';
import { postgresConnection } from '../config/database';

const router = express.Router();

// Get all positions
router.get('/positions', auth, async (req: express.Request, res: express.Response) => {
  try {
    const userPayload = req.user as UserPayload | undefined;
    if (!userPayload?.id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const positionsRepository = postgresConnection.getRepository(Position);
    const positions = await positionsRepository.find({
      where: { userId: userPayload.id }
    });

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

    const portfolioRepository = postgresConnection.getRepository(Portfolio);
    const portfolio = await portfolioRepository.findOne({
      where: { userId: userPayload.id }
    });

    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
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

    const strategyRepository = postgresConnection.getRepository(Strategy);
    const strategies = await strategyRepository.find({
      where: { userId: userPayload.id }
    });

    return res.json(strategies);
  } catch (error) {
    console.error('Error fetching strategies:', error);
    return res.status(500).json({ error: 'Failed to fetch strategies' });
  }
});

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

export default router;
