import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import { connectToDatabase } from './config/database';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import portfolioRoutes from './routes/portfolio';
import healthRoutes from './routes/health';

// Import routes
import { strategyRouter } from './routes/strategies';
import { positionRouter } from './routes/positions';
import { searchRouter } from './routes/search';
import { aiRouter } from './routes/ai.routes';

// Import middleware
import { sanitizer } from './middleware/sanitizer';
import { generalLimiter, authLimiter, apiLimiter } from './middleware/rateLimit';

// Import WebSocket servers
import { TradingWebSocketServer } from './websocket/trading';
import { OptimizationWebSocketServer } from './websocket/optimization';

const app = express();

// Configure Socket.IO
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(helmet());
app.use(morgan('dev'));
app.use(cookieParser());
app.use(compression());
app.use(sanitizer);

// Rate limiting
app.use('/', generalLimiter);
app.use('/api/auth', authLimiter);
app.use('/api', apiLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/strategies', strategyRouter);
app.use('/api/positions', positionRouter);
app.use('/api/search', searchRouter);
app.use('/api/ai', aiRouter);

// WebSocket setup
const tradingWss = new TradingWebSocketServer(io);
const optimizationWss = new OptimizationWebSocketServer(io);

// Error handling
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Connect to database
    await connectToDatabase();

    // Start listening
    httpServer.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error: any) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();
