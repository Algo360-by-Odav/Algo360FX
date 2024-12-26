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

console.log('MetaApi SDK loaded');

const app = express();
console.log('Express app created');

const httpServer = createServer(app);
console.log('HTTP server created');

// CORS configuration
app.use(cors({
  origin: config.CORS_ORIGIN,
  credentials: true
}));

// Initialize Socket.IO server
console.log('Initializing Socket.IO server...');
const io = new Server(httpServer, {
  path: config.WS_PATH,
  cors: {
    origin: config.CORS_ORIGIN,
    methods: ['GET', 'POST'],
    credentials: true
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

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/market', marketRouter);
app.use('/api/search', searchRouter);
app.use('/api/user', userRouter);

// Health check endpoint
app.get('/api/health', (_req: express.Request, res: express.Response) => {
  res.json({ status: 'ok' });
});

// Error handling middleware
app.use((err: Error, _req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
  next(err);
});

// Connect to MongoDB and start server
connectDatabase()
  .then(() => {
    const PORT = config.PORT;
    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log('WebSocket server endpoints:');
      console.log(`- Trading: ws://localhost:${PORT}${config.WS_PATH}`);
      console.log(`- Optimization: ws://localhost:${PORT}${config.WS_PATH}`);
    });
  })
  .catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });
