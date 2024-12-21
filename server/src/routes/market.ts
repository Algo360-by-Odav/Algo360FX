import { Router } from 'express';
import { getMetaApiConnection } from '../services/metaapi';
import { config } from '../config';

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

  if (!config.metaApiToken || !config.mt5AccountId) {
    return res.status(500).json({ 
      error: 'MetaAPI configuration missing',
      details: 'MetaAPI token or account ID not configured'
    });
  }

  try {
    // Get MetaAPI connection
    const connection = await getMetaApiConnection();
    
    // Get account
    const account = await connection.metatraderAccountApi.getAccount(config.mt5AccountId);
    if (!account) {
      return res.status(404).json({
        error: 'Account not found',
        details: `Account ${config.mt5AccountId} not found`
      });
    }

    // Deploy account and wait for it to be ready
    await account.deploy();
    await account.waitDeployed();

    // Get market data using streaming API
    const stream = account.getStreamingConnection();
    await stream.connect();
    await stream.waitSynchronized();

    const price = await stream.getSymbolPrice(symbol);
    if (!price) {
      return res.status(404).json({
        error: 'Market data not found',
        details: `No data available for symbol ${symbol}`
      });
    }

    return res.json({
      symbol,
      ask: price.ask,
      bid: price.bid,
      time: price.time,
      brokerTime: price.brokerTime,
      spread: price.ask - price.bid
    });

  } catch (error: any) {
    console.error('Error fetching market data:', {
      error: error.message,
      stack: error.stack,
      config: {
        metaApiToken: config.metaApiToken ? 'present' : 'missing',
        mt5AccountId: config.mt5AccountId
      }
    });

    return res.status(500).json({
      error: 'Failed to fetch market data',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

export default router;
