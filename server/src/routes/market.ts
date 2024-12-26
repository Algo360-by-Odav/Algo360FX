import express from 'express';
import { getMarketData, placeMarketOrder } from '../services/metaapi';
import auth from '../middleware/auth';

const router = express.Router();

// Get market data for a symbol
router.get('/:symbol', auth, async (req, res) => {
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
router.post('/order', auth, async (req, res) => {
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
