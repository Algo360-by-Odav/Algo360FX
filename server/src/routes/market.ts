import { Router } from 'express';
import { getMetaApiConnection } from '../services/metaapi';

const router = Router();

// Get market data for a symbol
router.get('/:symbol', async (req, res) => {
  const { symbol } = req.params;

  if (!symbol) {
    return res.status(400).json({
      error: 'Missing symbol',
      details: 'Symbol parameter is required'
    });
  }

  try {
    // Get MetaAPI connection
    const connection = await getMetaApiConnection();
    
    // Get symbol price
    const price = await connection.getSymbolPrice(symbol);
    if (!price) {
      return res.status(404).json({
        error: 'Market data not found',
        details: `No data available for symbol ${symbol}`
      });
    }

    return res.json(price);
  } catch (error) {
    console.error('Error fetching market data:', error);
    return res.status(500).json({
      error: 'Failed to fetch market data',
      details: error.message
    });
  }
});

// Get historical candles for a symbol
router.get('/:symbol/candles', async (req, res) => {
  const { symbol } = req.params;
  const { timeframe = '1h', limit = 100 } = req.query;

  if (!symbol) {
    return res.status(400).json({
      error: 'Missing symbol',
      details: 'Symbol parameter is required'
    });
  }

  try {
    // Get MetaAPI connection
    const connection = await getMetaApiConnection();
    
    // Get historical candles
    const candles = await connection.getHistoricalCandles(symbol, timeframe.toString(), limit.toString());
    if (!candles || candles.length === 0) {
      return res.status(404).json({
        error: 'Historical data not found',
        details: `No historical data available for symbol ${symbol}`
      });
    }

    return res.json(candles);
  } catch (error) {
    console.error('Error fetching historical data:', error);
    return res.status(500).json({
      error: 'Failed to fetch historical data',
      details: error.message
    });
  }
});

export default router;
