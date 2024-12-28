import express from 'express';
import http from 'http';
import { Server as WebSocketServer } from 'ws';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import TradingWebSocket from './websocket/trading';
import OptimizationWebSocket from './websocket/optimization';
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

const httpServer = http.createServer(app);
console.log('HTTP server created');

// CORS configuration
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400
};

app.use(cors(corsOptions));

// Apply general rate limiter to all routes
app.use(generalLimiter);

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - Headers:`, req.headers);
  next();
});

// Parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Auth routes first
app.use('/api/auth', authRouter);
app.use('/auth', authRouter);

// API Routes with versioning
app.use('/api', (_req: express.Request, _res: express.Response, next: express.NextFunction) => {
  next();
});

app.use('/api/health', async (_req: express.Request, res: express.Response) => {
  try {
    // Check database connection
    const dbStatus = postgresConnection?.isInitialized || mongoose.connection.readyState === 1;
    
    // Check WebSocket server health
    const wsStatus = wsServers.trading.isHealthy() || wsServers.optimization.isHealthy() || false;
    
    // Get WebSocket metrics
    const wsMetrics = {
      connections: wsServers.trading.getConnections() + wsServers.optimization.getConnections()
    };

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

// Other API routes
app.use('/api/user', userRouter);
app.use('/user', userRouter);
app.use('/api/market', marketRouter);
app.use('/market', marketRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/notifications', notificationsRouter);
app.use('/api/search', searchRouter);
app.use('/search', searchRouter);

// Add market endpoints to root path for backward compatibility
app.use('/', marketRouter);

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

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Global error handler:', err);
  res.status(500).json({ error: 'Internal server error', details: err.message });
});

// 404 handler
app.use((req: express.Request, res: express.Response) => {
  console.log('404 Not Found:', req.method, req.path);
  res.status(404).json({ error: 'Not Found', path: req.path, method: req.method });
});

// Create WebSocket servers
const wsServer = new WebSocketServer({ server: httpServer });
const io = new SocketIOServer(httpServer);

const wsServers = {
  trading: new TradingWebSocket(wsServer),
  optimization: new OptimizationWebSocket(wsServer)
};

// Connect to MongoDB and start server
connectDatabase()
  .then(() => {
    const PORT = config.PORT;
    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log('WebSocket server endpoints:');
      console.log(`- Trading: ws://localhost:${PORT}/`);
      console.log(`- Optimization: ws://localhost:${PORT}/`);
    });
  })
  .catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });
