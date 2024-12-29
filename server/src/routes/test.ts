import { Router } from 'express';
import { getMetaApiConnection } from '../services/metaapi';
import { asyncHandler } from '../middleware/asyncHandler';
import { auth } from '../middleware/auth';

const router = Router();

router.get('/metaapi', auth, asyncHandler(async (req, res) => {
  try {
    console.log('Testing MetaApi connection...');
    const connection = await getMetaApiConnection();
    
    // Test basic account information
    const accountInfo = await connection.getAccountInformation();
    
    // Test terminal state
    const terminalState = await connection.getTerminalState();
    
    res.json({
      status: 'connected',
      accountInfo: {
        broker: accountInfo.broker,
        currency: accountInfo.currency,
        leverage: accountInfo.leverage,
        balance: accountInfo.balance,
        equity: accountInfo.equity,
        margin: accountInfo.margin,
        freeMargin: accountInfo.freeMargin,
        marginLevel: accountInfo.marginLevel,
      },
      terminalState: {
        connected: terminalState.connected,
        connectedToBroker: terminalState.connectedToBroker,
        platform: terminalState.platform,
      }
    });
  } catch (error) {
    console.error('MetaApi connection test failed:', error);
    res.status(500).json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
      error: error
    });
  }
}));

export default router;
