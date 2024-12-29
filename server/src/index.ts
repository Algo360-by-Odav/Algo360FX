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
import healthRouter from './routes/health';
import testRouter from './routes/test';
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
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
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
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  },
  path: '/ws',
  pingTimeout: 60000,
  pingInterval: 25000,
  connectTimeout: 10000,
  transports: ['websocket', 'polling']
});

io.engine.on("connection_error", (err) => {
  console.error('Socket.IO connection error:', err);
});

console.log('Socket.IO server initialized');

// Initialize WebSocket servers
const tradingWsServer = new TradingWebSocketServer(io);
const optimizationWsServer = new OptimizationWebSocketServer(io);

// Store WebSocket servers globally for health checks
global.tradingWsServer = tradingWsServer;
global.optimizationWsServer = optimizationWsServer;
global.mongoose = mongoose;

tradingWsServer.initialize();
console.log('Trading WebSocket server initialized');

optimizationWsServer.initialize();
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
app.use('/api/test', testRouter);
app.use('/api/health', healthRouter);

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

async function connectWithRetry(retries = 5, interval = 5000) {
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`MongoDB connection attempt ${i + 1} of ${retries}`);
      await mongoose.connect(config.mongoUri || config.databaseUrl, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        maxPoolSize: 10,
      });
      console.log('MongoDB connected successfully');
      return;
    } catch (error) {
      console.error(`MongoDB connection attempt ${i + 1} failed:`, error.message);
      if (i === retries - 1) {
        console.error('All MongoDB connection attempts failed');
        process.exit(1);
      }
      await new Promise(resolve => setTimeout(resolve, interval));
    }
  }
}

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
connectWithRetry().then(() => {
  // Start server only after successful DB connection
  const port = config.port || 5000;
  httpServer.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
