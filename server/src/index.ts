import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { Connection } from 'mongoose';
import { TradingWebSocketServer } from './websocket/trading';
import { OptimizationWebSocketServer } from './websocket/optimization';
import mongoose from 'mongoose';
import helmet from 'helmet';
import compression from 'compression';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import authRouter from './routes/auth';
import { userRouter } from './routes/user';
import { portfolioRouter } from './routes/portfolio';
import { strategyRouter } from './routes/strategies';
import { positionRouter } from './routes/positions';
import searchRouter from './routes/search';
import notificationsRouter from './routes/notifications';
import marketRouter from './routes/market';
import healthRouter from './routes/health';
import testRouter from './routes/test';
import { aiRouter } from './routes/ai.routes';
import { config } from './config';
import { generalLimiter, authLimiter, apiLimiter } from './middleware/rateLimit';
import { errorHandler } from './middleware/errorHandler';
import { sanitizer } from './middleware/sanitizer';

// Define interfaces for custom Express types
interface CustomRequest extends Request {
  user?: any;
  token?: any;
  io?: any;
}

interface CustomResponse extends Response {
  user?: any;
  token?: any;
}

// Initialize global variables
declare global {
  var tradingWsServer: any;
  var optimizationWsServer: any;
  var mongooseConnection: any;
}

globalThis.tradingWsServer = null;
globalThis.optimizationWsServer = null;
globalThis.mongooseConnection = null;

const app = express();
console.log('Express app created');

// Trust proxy settings - required for rate limiting and security behind proxy
app.set('trust proxy', true);
app.enable('trust proxy'); // Enable reverse proxy support

// Configure proxy trust based on environment
if (process.env.NODE_ENV === 'production') {
  // Trust first proxy in production
  app.set('trust proxy', 1);
} else {
  // Trust all proxies in development
  app.set('trust proxy', true);
}

const httpServer = createServer(app);
console.log('HTTP server created');

// Initialize Socket.IO with enhanced configuration
const io = new Server(httpServer, {
  path: '/ws',
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? [config.corsOrigin, 'https://algo360fx-client.onrender.com']
      : ['http://localhost:5173', config.corsOrigin],
    credentials: true,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"]
  },
  transports: ['websocket', 'polling'],
  pingTimeout: 120000,
  pingInterval: 30000,
  connectTimeout: 30000,
  allowUpgrades: true,
  perMessageDeflate: {
    threshold: 1024
  },
  maxHttpBufferSize: 1e8
});

// Socket.IO connection handling with enhanced error handling and logging
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  // Send initial connection acknowledgment
  socket.emit('connection_ack', { status: 'connected', socketId: socket.id });
  
  socket.on('disconnect', (reason) => {
    console.log('Client disconnected:', socket.id, 'Reason:', reason);
  });

  socket.on('error', (error) => {
    console.error('Socket error:', {
      socketId: socket.id,
      error: error.message || error,
      timestamp: new Date().toISOString()
    });
  });

  socket.on('connect_error', (error) => {
    console.error('Connection error:', {
      socketId: socket.id,
      error: error.message || error,
      timestamp: new Date().toISOString()
    });
  });
});

// Socket.IO server error handling
io.engine.on("connection_error", (err) => {
  console.error('Socket.IO connection error:', {
    type: err.type,
    message: err.message,
    context: err.context
  });
});

// Apply security middleware
app.use(helmet());
app.use(compression());
app.use(mongoSanitize());
app.use(hpp());

// Apply rate limiting
app.use(generalLimiter); // Apply to all routes
app.use('/api/auth', authLimiter); // Stricter limits for auth routes
app.use('/api', apiLimiter); // Apply to all API routes

// Apply CORS
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? config.corsOrigin 
    : ['http://localhost:5173', config.corsOrigin],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  methods: ["GET", "POST"]
}));

// Apply other middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(morgan('dev'));

// Initialize WebSocket servers if MetaAPI is configured
if (config.metaApiToken && config.mt5AccountId) {
  try {
    const tradingWsServer = new TradingWebSocketServer(io);
    const optimizationWsServer = new OptimizationWebSocketServer(io);

    // Store WebSocket servers globally for health checks
    globalThis.tradingWsServer = tradingWsServer;
    globalThis.optimizationWsServer = optimizationWsServer;
    globalThis.mongooseConnection = mongoose.connection;

    tradingWsServer.initialize();
    console.log('Trading WebSocket server initialized');

    optimizationWsServer.initialize();
    console.log('Optimization WebSocket server initialized');
  } catch (error) {
    console.error('Failed to initialize trading servers:', error);
    console.warn('Trading features will be disabled');
  }
} else {
  console.warn('MetaAPI credentials not found. Trading features will be disabled.');
}

// Basic request logging middleware
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Apply routes
app.use('/api/auth', authRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/market', marketRouter);
app.use('/api/search', searchRouter);
app.use('/api/user', userRouter);
app.use('/api/portfolio', portfolioRouter);
app.use('/api/positions', positionRouter);
app.use('/api/strategies', strategyRouter);
app.use('/api/ai', aiRouter);
app.use('/api/test', testRouter);
app.use('/api/health', healthRouter);

// Error Monitoring
app.use(errorHandler);

// 404 handler
app.use((req: Request, res: Response) => {
  console.log('404 Not Found:', {
    method: req.method,
    path: req.path,
    query: req.query,
    body: req.body
  });
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.path}`,
    availableRoutes: [
      '/api/auth',
      '/api/notifications',
      '/api/market',
      '/api/search',
      '/api/user',
      '/api/portfolio',
      '/api/positions',
      '/api/strategies',
      '/api/health'
    ]
  });
});

// MongoDB configuration
mongoose.set('strictQuery', true);
mongoose.set('bufferCommands', true);
mongoose.set('bufferTimeoutMS', 60000); // Increase buffer timeout to 60 seconds
mongoose.set('autoIndex', true);
mongoose.set('autoCreate', true);

async function connectDB() {
  const retryAttempts = 5;
  const retryDelay = 5000; // 5 seconds

  for (let attempt = 1; attempt <= retryAttempts; attempt++) {
    try {
      console.log(`MongoDB connection attempt ${attempt}/${retryAttempts}`);
      
      await mongoose.connect(config.mongoUri, {
        serverSelectionTimeoutMS: 30000, // Increase from 5000 to 30000
        socketTimeoutMS: 75000, // Increase from 45000 to 75000
        connectTimeoutMS: 30000, // Increase from 10000 to 30000
        maxPoolSize: 50, // Increase from 10 to 50
        minPoolSize: 5, // Increase from 1 to 5
        retryWrites: true,
        retryReads: true,
        w: 'majority',
        waitQueueTimeoutMS: 30000,
        heartbeatFrequencyMS: 10000,
        keepAlive: true,
        keepAliveInitialDelay: 300000
      } as mongoose.ConnectOptions);

      console.log('MongoDB connected successfully');
      return; // Connection successful, exit the retry loop
    } catch (err) {
      console.error(`MongoDB connection attempt ${attempt} failed:`, err);
      
      if (attempt === retryAttempts) {
        console.error('All MongoDB connection attempts failed');
        process.exit(1);
      }
      
      console.log(`Waiting ${retryDelay}ms before next attempt...`);
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }
}

// Monitor MongoDB connection
mongoose.connection.on('connected', () => {
  console.log('MongoDB connection established successfully');
  
  // Reset connection backoff on successful connection
  const db = mongoose.connection.db;
  if (db) {
    db.admin().ping()
      .then(() => console.log('MongoDB ping successful'))
      .catch(err => console.error('MongoDB ping failed:', err));
  } else {
    console.error('MongoDB connection not fully established');
  }
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected. Attempting to reconnect...');
  setTimeout(connectDB, 5000);
});

// Handle process termination
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
connectDB().then(() => {
  // Start server only after successful DB connection
  const port = config.port || 5000;
  httpServer.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}).catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
