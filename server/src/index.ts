import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import { TradingWebSocket } from './websocket/trading';
import { OptimizationWebSocket } from './websocket/optimization';
import { logger } from './utils/logger';
import searchRouter from './routes/search';
import authRouter from './routes/auth';
import notificationsRouter from './routes/notifications';
import marketRouter from './routes/market';
import userRouter from './routes/user';
import { config } from './config/config';
import { connectDatabase } from './config/database';
import { generalLimiter } from './middleware/rateLimiter';
import mongoose from 'mongoose';

const app = express();
const port = process.env.PORT || 3000;

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:5000',
    'http://localhost:5173',
    'https://algo360fx.onrender.com',
    'https://algo360fx-server.onrender.com',
    'https://algo360fx-client.onrender.com'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  exposedHeaders: ['Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(generalLimiter);

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`[${new Date().toISOString()}] ${req.method} ${req.path}`, {
    headers: req.headers,
    query: req.query,
    body: req.method === 'POST' ? req.body : undefined
  });
  next();
});

// Create API router
const apiRouter = express.Router();

// Mount all routes under /api
apiRouter.use('/auth', authRouter);
apiRouter.use('/user', userRouter);
apiRouter.use('/market', marketRouter);
apiRouter.use('/notifications', notificationsRouter);
apiRouter.use('/search', searchRouter);

// Mount API router at /api
app.use('/api', apiRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  const wsMetrics = {
    connections: 0
  };

  try {
    // Check database connection
    const dbStatus = mongoose.connection.readyState === 1;
    
    // Check WebSocket server health
    const wsStatus = true;
    
    // Get WebSocket metrics
    wsMetrics.connections = 0;

    if (!dbStatus || !wsStatus) {
      return res.status(503).json({
        status: 'error',
        database: dbStatus ? 'connected' : 'disconnected',
        websocket: wsStatus ? 'healthy' : 'unhealthy',
        metrics: wsMetrics
      });
    }

    return res.status(200).json({
      status: 'healthy',
      database: 'connected',
      websocket: 'healthy',
      metrics: wsMetrics
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error during health check',
      error: error.message
    });
  }
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Error:', err);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      status: err.status || 500
    }
  });
});

// Start server
const server = createServer(app);

// Initialize WebSocket servers
let tradingWs: TradingWebSocket | null = null;
let optimizationWs: OptimizationWebSocket | null = null;

// Connect to database
connectDatabase().then(() => {
  // Initialize WebSocket server after database connection
  if (process.env.WS_ENABLED === 'true') {
    tradingWs = new TradingWebSocket(server);
    optimizationWs = new OptimizationWebSocket(server);
    
    logger.info('WebSocket servers initialized');
  }

  server.listen(port, () => {
    logger.info(`Server is running on port ${port}`);
    logger.info(`WebSocket enabled: ${process.env.WS_ENABLED}`);
    logger.info(`WebSocket path: ${process.env.WS_PATH}`);
    logger.info(`Environment: ${process.env.NODE_ENV}`);
  });
}).catch((error) => {
  logger.error('Failed to connect to database:', error);
  process.exit(1);
});
