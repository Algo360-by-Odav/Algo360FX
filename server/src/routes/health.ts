import { Router } from 'express';
import { checkMetaApiHealth } from '../services/metaapi';

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
      const metaapiHealth = await checkMetaApiHealth();
      status.metaapi = metaapiHealth.status;
      if (metaapiHealth.error) {
        console.error('MetaAPI health check error:', metaapiHealth.error);
      }
    } catch (error) {
      status.metaapi = 'disconnected';
      console.error('MetaAPI health check error:', error);
    }

    res.json(status);
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({ error: 'Health check failed' });
  }
});

export default router;
