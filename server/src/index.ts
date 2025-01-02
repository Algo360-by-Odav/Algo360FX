import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { config } from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

// Load environment variables
config();

// Import routes
import { authRouter } from './routes/auth';
import { userRouter } from './routes/user';
import { portfolioRouter } from './routes/portfolio';
import { strategyRouter } from './routes/strategies';
import { positionRouter } from './routes/positions';
import { searchRouter } from './routes/search';
import { aiRouter } from './routes/ai.routes';

// Import middleware
import { errorHandler } from './middleware/errorHandler';
import { sanitizer } from './middleware/sanitizer';
import { generalLimiter, authLimiter, apiLimiter } from './middleware/rateLimit';

// Import WebSocket servers
import { TradingWebSocketServer } from './websocket/trading';
import { OptimizationWebSocketServer } from './websocket/optimization';

// Create Express app
const app = express();
const httpServer = createServer(app);

// Configure Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(helmet());
app.use(compression());
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(sanitizer);

// Rate limiting
app.use('/', generalLimiter);
app.use('/api/auth', authLimiter);
app.use('/api', apiLimiter);

// Routes
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/portfolios', portfolioRouter);
app.use('/api/strategies', strategyRouter);
app.use('/api/positions', positionRouter);
app.use('/api/search', searchRouter);
app.use('/api/ai', aiRouter);

// WebSocket setup
const tradingWss = new TradingWebSocketServer(io);
const optimizationWss = new OptimizationWebSocketServer(io);

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
