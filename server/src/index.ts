import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import TradingWebSocketServer from './websocket/trading';
import OptimizationWebSocketServer from './websocket/optimization';
import searchRouter from './routes/search';
import authRouter from './routes/auth';
import notificationsRouter from './routes/notifications';
import marketRouter from './routes/market';
import userRouter from './routes/user';
import { config } from './config/config';
import { connectDatabase } from './config/database';
import { generalLimiter } from './middleware/rateLimiter';
import { postgresConnection } from './config/database';
import mongoose from 'mongoose';

console.log('MetaApi SDK loaded');

const app = express();
console.log('Express app created');

const httpServer = createServer(app);
console.log('HTTP server created');

// CORS configuration
app.use(cors({
  origin: config.CORS_ORIGIN,
  credentials: true
}));

// Apply general rate limiter to all routes
app.use(generalLimiter);

// Parse JSON bodies
app.use(express.json());

// API Documentation route
app.get('/', (_req: express.Request, res: express.Response) => {
  res.json({
    name: 'Algo360FX API',
    version: '1.0.0',
    description: 'Trading and market analysis platform API',
    endpoints: {
      '/api/health': 'Health check endpoint',
      '/auth/*': 'Authentication endpoints',
      '/user/*': 'User management endpoints',
      '/market/*': 'Market data and trading endpoints',
      '/notifications/*': 'Notification endpoints',
      '/search/*': 'Search functionality endpoints'
    }
  });
});

// API Routes with versioning
app.use('/api', (_req: express.Request, _res: express.Response, next: express.NextFunction) => {
  next();
});

app.use('/api/health', async (_req: express.Request, res: express.Response) => {
  try {
    // Check database connection
    const dbStatus = postgresConnection?.isInitialized || mongoose.connection.readyState === 1;

    if (!dbStatus) {
      return res.status(503).json({
        status: 'unhealthy',
        error: 'Database connection failed',
        timestamp: new Date().toISOString()
      });
    }

    // All checks passed
    return res.json({
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Health check failed:', error);
    return res.status(503).json({
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/market', marketRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/search', searchRouter);

// Add market endpoints to root path
app.use('/', marketRouter);

// Initialize Socket.IO server
console.log('Initializing Socket.IO server...');
const io = new Server(httpServer, {
  path: config.WS_PATH,
  cors: {
    origin: config.CORS_ORIGIN,
    methods: ['GET', 'POST'],
    credentials: true
  },
  transports: ['websocket'],
  pingTimeout: 10000,
  pingInterval: 5000,
  maxHttpBufferSize: 1e6, // 1 MB
  connectTimeout: 10000
});
console.log('Socket.IO server initialized');

// Initialize and start WebSocket servers
console.log('Initializing Trading WebSocket server...');
const tradingWS = new TradingWebSocketServer(httpServer);
console.log('Trading WebSocket server initialized');

console.log('Initializing Optimization WebSocket server...');
const optimizationWS = new OptimizationWebSocketServer(io);
optimizationWS.initialize();
console.log('Optimization WebSocket server initialized');

// Error handling middleware
app.use((err: Error, _req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
  next(err);
});

// Connect to MongoDB and start server
connectDatabase()
  .then(() => {
    const PORT = config.PORT;
    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log('WebSocket server endpoints:');
      console.log(`- Trading: ws://localhost:${PORT}${config.WS_PATH}`);
      console.log(`- Optimization: ws://localhost:${PORT}${config.WS_PATH}`);
    });
  })
  .catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });
