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
const corsOptions = {
  origin: [config.CORS_ORIGIN, 'https://algo360fx-client.onrender.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 600 // Increase preflight cache time to 10 minutes
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
app.use('/auth', authRouter);
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

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Global error handler:', err);
  res.status(500).json({ error: 'Internal server error', details: err.message });
});

// 404 handler
app.use((req: express.Request, res: express.Response) => {
  console.log('404 Not Found:', req.method, req.path);
  res.status(404).json({ error: 'Not Found', path: req.path, method: req.method });
});

// Initialize Socket.IO server
console.log('Initializing Socket.IO server...');
const io = new Server(httpServer, {
  cors: corsOptions,
  path: '/socket.io/',
  transports: ['websocket', 'polling'],
  allowEIO3: true,
  pingTimeout: 60000,
  pingInterval: 25000
});
console.log('Socket.IO server initialized');

// Initialize and start WebSocket servers
const wsServers = {
  trading: null as TradingWebSocketServer | null,
  optimization: null as OptimizationWebSocketServer | null
};

console.log('Initializing Trading WebSocket server...');
wsServers.trading = new TradingWebSocketServer(httpServer);
console.log('Trading WebSocket server initialized');

console.log('Initializing Optimization WebSocket server...');
wsServers.optimization = new OptimizationWebSocketServer(io);
wsServers.optimization.initialize();
console.log('Optimization WebSocket server initialized');

// Connect to MongoDB and start server
connectDatabase()
  .then(() => {
    const PORT = config.PORT;
    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log('WebSocket server endpoints:');
      console.log(`- Trading: ws://localhost:${PORT}/socket.io/`);
      console.log(`- Optimization: ws://localhost:${PORT}/socket.io/`);
    });
  })
  .catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });
