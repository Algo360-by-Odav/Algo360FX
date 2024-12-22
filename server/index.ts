import express from 'express';
import cors from 'cors';
import { json } from 'body-parser';
import { config } from '../src/config/config';
import { Server } from 'socket.io';
import http from 'http';

const app = express();
const server = http.createServer(app);

// Allow both HTTP and WebSocket upgrades
const io = new Server(server, {
  path: '/ws',
  cors: {
    origin: [
      'http://localhost:5173',
      'https://algo360fx.vercel.app'
    ],
    methods: ['GET', 'POST'],
    credentials: true
  },
  transports: ['websocket'],
  pingTimeout: 60000,
  pingInterval: 25000
});

const PORT = process.env.PORT || 5000;

// Configure CORS for HTTP requests
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://algo360fx.vercel.app'
  ],
  credentials: true
}));

app.use(json());

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  // Send initial account info
  socket.emit('account_update', {
    balance: 10000,
    equity: 10150,
    margin: 1000,
    freeMargin: 9150,
    marginLevel: 1015,
    currency: 'USD'
  });

  // Handle market data subscription
  socket.on('subscribe', (symbol: string) => {
    console.log('Client subscribed to:', symbol);
    
    // Start sending market data for the subscribed symbol
    const interval = setInterval(() => {
      const bid = Math.random() * 0.0010 + 1.1000;
      socket.emit('market_data', {
        symbol,
        bid: bid,
        ask: bid + 0.0002,
        timestamp: new Date().toISOString()
      });
    }, 1000);

    // Clean up interval on unsubscribe or disconnect
    socket.on('unsubscribe', (unsub_symbol: string) => {
      if (unsub_symbol === symbol) {
        clearInterval(interval);
      }
    });

    socket.on('disconnect', () => {
      clearInterval(interval);
      console.log('Client disconnected:', socket.id);
    });
  });

  // Handle errors
  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log('WebSocket server is ready for connections');
});
