import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import mongoose from 'mongoose';
import { json } from 'body-parser';
import TradingWebSocketServer from './websocket/trading';
import OptimizationWebSocketServer from './websocket/optimization';
import searchRouter from './routes/search';
import authRouter from './routes/auth';
import notificationsRouter from './routes/notifications';
import marketRouter from './routes/market';
import MT5Bridge from './services/mt5bridge';
import { config } from './config/config';
import MetaApi from 'metaapi.cloud-sdk';

const app = express();
const httpServer = createServer(app);

// Initialize WebSocket Servers
const wsServer = new TradingWebSocketServer(httpServer);
const optimizationWsServer = new OptimizationWebSocketServer(httpServer, '/optimization');

// Connect to MongoDB
mongoose.connect(config.mongoUri, {
  retryWrites: true,
  w: 'majority',
  directConnection: false,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(json());

// Error handling middleware
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Routes
app.use('/api/auth', authRouter);
app.use('/api/search', searchRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/market', marketRouter);

// Auth routes
app.post('/api/auth/register', async (_req, res) => {
  const { email, firstName, lastName, verificationCode } = _req.body;
  
  // In development, accept any verification code
  if (verificationCode !== '123456') {
    return res.status(400).json({ error: 'Invalid verification code' });
  }

  // Use the provided credentials to create a new user
  return res.json({
    token: 'dev-token',
    user: {
      id: '1',
      email,
      firstName,
      lastName,
      role: 'USER',
      preferences: {
        theme: 'dark',
        notifications: {
          email: true,
          push: true,
          sms: false
        },
        tradingPreferences: {
          defaultLeverage: 1,
          riskLevel: 'medium',
          autoTrade: false
        },
        displayPreferences: {
          chartType: 'candlestick',
          timeframe: '1h',
          indicators: ['MA', 'RSI']
        }
      }
    }
  });
});

app.post('/api/auth/send-verification', (_req, res) => {
  // In development, always succeed
  return res.json({ success: true });
});

app.get('/', (_req, res) => {
  res.send('Algo360FX API Server');
});

// Initialize MT5 connection
(async () => {
  try {
    const api = new MetaApi(config.metaApiToken);
    const accounts = await api.metatraderAccountApi.getAccounts();
    console.log('Available MT5 accounts:', accounts.map(acc => ({
      id: acc.id,
      name: acc.name,
      type: acc.type,
      state: acc.state
    })));

    // Initialize MT5 bridge
    const mt5Bridge = new MT5Bridge(api);
    await mt5Bridge.start();

    // Handle graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received. Closing server...');
      mt5Bridge.stop();
      wsServer.close();
      optimizationWsServer.close();
      httpServer.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('Failed to initialize MT5 connection:', error);
  }
})();

// Start the server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('WebSocket server endpoints:');
  console.log('- Trading: ws://localhost:5000/');
  console.log('- Optimization: ws://localhost:5000/optimization');
});
