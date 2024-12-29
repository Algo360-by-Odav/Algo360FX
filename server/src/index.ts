import express, { Request, Response, NextFunction } from 'express';
import { createServer } from 'http';
import cors from 'cors';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import TradingWebSocketServer from './websocket/trading';
import OptimizationWebSocketServer from './websocket/optimization';
import searchRouter from './routes/search';
import authRouter from './routes/auth';
import notificationsRouter from './routes/notifications';
import marketRouter from './routes/market';
import userRouter from './routes/user';
import portfolioRouter from './routes/portfolio';
import positionsRouter from './routes/positions';
import strategiesRouter from './routes/strategies';
import { config } from './config/config';
import { standardLimiter, authLimiter, aiLimiter } from './middleware/rateLimiter';

const app = express();
console.log('Express app created');

const httpServer = createServer(app);
console.log('HTTP server created');

// CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://algo360fx-client.onrender.com',
  'https://algo360fx-frontend.onrender.com',
  'https://algo360fx.onrender.com'
];

app.use(cors({
  origin: '*',  // Allow all origins for now
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware for parsing JSON and handling large payloads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Initialize Socket.IO server
console.log('Initializing Socket.IO server...');
const io = new Server(httpServer, {
  path: '/ws',
  cors: {
    origin: '*',  // Allow all origins for WebSocket
    methods: ['GET', 'POST'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
  },
  transports: ['websocket', 'polling']
});
console.log('Socket.IO server initialized');

// Initialize and start WebSocket servers
console.log('Initializing Trading WebSocket server...');
const tradingWS = new TradingWebSocketServer(io);
tradingWS.initialize();
console.log('Trading WebSocket server initialized');

console.log('Initializing Optimization WebSocket server...');
const optimizationWS = new OptimizationWebSocketServer(io);
optimizationWS.initialize();
console.log('Optimization WebSocket server initialized');

// Basic request logging middleware
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Apply rate limiters
app.use('/api/auth', authLimiter);
app.use(['/api/market', '/api/search', '/api/user', '/api/portfolio', '/api/positions', '/api/strategies'], standardLimiter);

// Routes
app.use('/api/auth', authRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/market', marketRouter);
app.use('/api/search', searchRouter);
app.use('/api/user', userRouter);
app.use('/api/portfolio', portfolioRouter);
app.use('/api/positions', positionsRouter);
app.use('/api/strategies', strategiesRouter);

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: dbStatus
  });
});

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Not Found' });
});

// Error handling middleware
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Connect to MongoDB with improved configuration and error handling
console.log('Connecting to MongoDB...');
mongoose.set('strictQuery', true);
mongoose.set('bufferCommands', false); // Disable buffering

const connectWithRetry = async (retries = 5, interval = 5000) => {
  try {
    await mongoose.connect(config.databaseUrl, {
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 15000,
      maxPoolSize: 50,
      minPoolSize: 10,
      retryWrites: true,
      retryReads: true,
      w: 'majority',
      wtimeoutMS: 10000,
    });
    console.log('Connected to MongoDB successfully');
    
    // Start server only after successful DB connection
    const port = config.port || 5000;
    httpServer.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('MongoDB connection error:', error);
    if (retries > 0) {
      console.log(`Retrying connection in ${interval/1000} seconds... (${retries} attempts remaining)`);
      setTimeout(() => connectWithRetry(retries - 1, interval), interval);
    } else {
      console.error('Failed to connect to MongoDB after multiple attempts');
      process.exit(1);
    }
  }
};

// Monitor MongoDB connection
mongoose.connection.on('connected', () => {
  console.log('MongoDB connection established');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB connection disconnected');
});

process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed through app termination');
    process.exit(0);
  } catch (err) {
    console.error('Error closing MongoDB connection:', err);
    process.exit(1);
  }
});

// Start connection process
connectWithRetry();
