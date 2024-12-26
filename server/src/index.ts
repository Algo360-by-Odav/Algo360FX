import express from 'express';
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
import { config } from './config/config';

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

// Connect to MongoDB
console.log('Connecting to MongoDB...');
mongoose.connect(config.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    
    // Start the server
    const PORT = config.PORT;
    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log('WebSocket server endpoints:');
      console.log('- Trading: ws://localhost:5000/ws');
      console.log('- Optimization: ws://localhost:5000/ws');
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });
