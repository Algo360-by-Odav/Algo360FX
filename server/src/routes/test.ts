import { Router } from 'express';
import { getMetaApiConnection } from '../services/metaapi';
import { asyncHandler } from '../middleware/asyncHandler';

const router = Router();

// Test endpoint for MetaApi connection
router.get('/metaapi', asyncHandler(async (req, res) => {
  try {
    console.log('Testing MetaApi connection...');
    const connection = await getMetaApiConnection();
    
    // Test basic account information
    console.log('Fetching account information...');
    const accountInfo = await connection.getAccountInformation();
    console.log('Account information fetched successfully');
    
    // Test terminal state
    console.log('Fetching terminal state...');
    const terminalState = await connection.getTerminalState();
    console.log('Terminal state fetched successfully');
    
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
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}));

export default router;
