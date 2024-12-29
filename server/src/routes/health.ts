import { Router } from 'express';
import { getMetaApiConnection } from '../services/metaapi';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const status = {
      server: 'healthy',
      websocket: {
        trading: global.tradingWsServer ? 'connected' : 'disconnected',
        optimization: global.optimizationWsServer ? 'connected' : 'disconnected'
      },
      metaapi: 'checking',
      database: global.mongoose?.connection?.readyState === 1 ? 'connected' : 'disconnected'
    };

    // Check MetaAPI connection
    try {
      await getMetaApiConnection();
      status.metaapi = 'connected';
    } catch (error) {
      status.metaapi = 'disconnected';
      console.error('MetaAPI connection error:', error);
    }

    res.json(status);
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({ error: 'Health check failed' });
  }
});

export default router;
