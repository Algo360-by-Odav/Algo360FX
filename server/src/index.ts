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

// Trust proxy - required for rate limiting behind proxy
app.set('trust proxy', 1);

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
  transports: ['websocket', 'polling'],
  allowEIO3: true,
  maxHttpBufferSize: 1e8, // 100 MB
  perMessageDeflate: {
    threshold: 1024 // Only compress messages larger than 1KB
  }
});

// Socket.IO error handling
io.engine.on("connection_error", (err) => {
  console.error('Socket.IO connection error:', {
    type: err.type,
    message: err.message,
    context: err.context,
    stack: err.stack
  });
});

io.on('connect', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('disconnect', (reason) => {
    console.log('Client disconnected:', socket.id, 'Reason:', reason);
  });

  socket.on('error', (error) => {
    console.error('Socket error:', {
      socketId: socket.id,
      error: error
    });
  });
});

console.log('Socket.IO server initialized with enhanced configuration');

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

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Global error handler:', {
    error: err,
    stack: err.stack,
    path: req.path,
    method: req.method,
    body: req.body,
    query: req.query,
    params: req.params,
    headers: req.headers
  });

  // Handle specific error types
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      details: err.errors
    });
  }

  if (err.name === 'MongoError' || err.name === 'MongoServerError') {
    if (err.code === 11000) {
      return res.status(409).json({
        error: 'Duplicate Key Error',
        details: err.keyValue
      });
    }
    return res.status(500).json({
      error: 'Database Error',
      message: 'An error occurred while accessing the database'
    });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Authentication Error',
      message: 'Invalid or expired token'
    });
  }

  // Default error response
  res.status(err.status || 500).json({
    error: 'Internal Server Error',
    message: config.env === 'development' ? err.message : 'An unexpected error occurred'
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.path}`
  });
});

// MongoDB configuration
mongoose.set('strictQuery', true);
mongoose.set('bufferCommands', false); // Disable buffering

const connectWithRetry = async (retries = 5, interval = 5000) => {
  for (let i = 0; i < retries; i++) {
    try {
      console.log('Attempting to connect to MongoDB...');
      await mongoose.connect(config.mongoUri || config.databaseUrl, {
        serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
        socketTimeoutMS: 45000, // Socket timeout
        maxPoolSize: 50, // Increase pool size
        minPoolSize: 10, // Minimum pool size
        connectTimeoutMS: 30000, // Connection timeout
        heartbeatFrequencyMS: 10000, // More frequent heartbeats
        retryWrites: true,
        w: 'majority'
      });
      console.log('MongoDB connected successfully');
      return;
    } catch (err) {
      console.error(`MongoDB connection attempt ${i + 1} failed:`, err);
      if (i === retries - 1) {
        console.error('All MongoDB connection attempts failed');
        process.exit(1);
      }
      await new Promise(resolve => setTimeout(resolve, interval));
    }
  }
};

// Monitor MongoDB connection
mongoose.connection.on('connected', () => {
  console.log('MongoDB connection established successfully');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected. Attempting to reconnect...');
  connectWithRetry();
});

process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed through app termination');
    process.exit(0);
  } catch (err) {
    console.error('Error during MongoDB connection closure:', err);
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
