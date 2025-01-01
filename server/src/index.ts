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
import { config } from './config/config';
import { limiter, apiLimiter } from './middleware/rateLimiter';
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
  var tradingWsServer: TradingWebSocketServer | undefined;
  var optimizationWsServer: OptimizationWebSocketServer | undefined;
  var mongoose: { connection: Connection } | undefined;
}

// Set initial values
global.tradingWsServer = undefined;
global.optimizationWsServer = undefined;
global.mongoose = undefined;

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

// Basic middleware
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(compression());

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.CLIENT_URL || '', process.env.RENDER_URL || ''].filter(Boolean)
    : '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  credentials: true,
  maxAge: 600
}));
app.use(limiter);
app.use(sanitizer);

// Enhanced CORS configuration
// app.use(cors({
//   origin: process.env.NODE_ENV === 'production' 
//     ? [process.env.CLIENT_URL || '', process.env.RENDER_URL || ''].filter(Boolean)
//     : '*',
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   exposedHeaders: ['Content-Range', 'X-Content-Range'],
//   credentials: true,
//   maxAge: 600
// }));

// Data sanitization middleware
// app.use(sanitizeData);
// app.use(preventParamPollution);
// app.use(sanitizeRequestBody);
// app.use(xssProtection);

// Additional security middleware
app.use(mongoSanitize()); // Prevent NoSQL injection
app.use(hpp()); // Prevent HTTP Parameter Pollution

// Custom security headers
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  next();
});

// Initialize Socket.IO server
console.log('Initializing Socket.IO server...');
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? [process.env.CLIENT_URL || '', process.env.RENDER_URL || ''].filter(Boolean)
      : '*',
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

// Initialize WebSocket servers if MetaAPI is configured
if (config.metaApiToken && config.mt5AccountId) {
  try {
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

// Apply rate limiting to routes
app.use('/api/auth', apiLimiter, authRouter);
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
app.use('/api', limiter); // General API rate limiting

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
mongoose.set('bufferCommands', true); // Enable buffering
mongoose.set('bufferTimeoutMS', 30000); // Set buffer timeout to 30 seconds

async function connectDB() {
  try {
    await mongoose.connect(config.databaseUrl, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      maxPoolSize: 10,
      minPoolSize: 1,
      retryWrites: true,
      retryReads: true,
      w: 'majority'
    } as mongoose.ConnectOptions);
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  }
}

// Monitor MongoDB connection
mongoose.connection.on('connected', () => {
  console.log('MongoDB connection established successfully');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected. Attempting to reconnect...');
  connectDB();
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
