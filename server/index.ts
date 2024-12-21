import express from 'express';
import cors from 'cors';
import { json } from 'body-parser';
import { config } from '../src/config/config';
import { Server } from 'socket.io';
import http from 'http';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(json());

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Handle market data subscription
  socket.on('subscribe_market_data', (symbols: string[]) => {
    console.log('Client subscribed to market data:', symbols);
    // Simulate market data updates
    const interval = setInterval(() => {
      symbols.forEach(symbol => {
        socket.emit('market_data', {
          symbol,
          bid: Math.random() * 100 + 100,
          ask: Math.random() * 100 + 100,
          timestamp: new Date().toISOString()
        });
      });
    }, 1000);

    socket.on('disconnect', () => {
      clearInterval(interval);
    });
  });

  // Handle trade execution
  socket.on('execute_trade', (trade: any) => {
    console.log('Trade execution request:', trade);
    // Simulate trade execution
    setTimeout(() => {
      socket.emit('trade_executed', {
        ...trade,
        id: Math.random().toString(36).substring(7),
        status: 'EXECUTED',
        executionTime: new Date().toISOString()
      });
    }, 500);
  });

  // Handle position updates
  socket.on('get_positions', () => {
    // Simulate position data
    socket.emit('positions_update', [
      {
        symbol: 'EURUSD',
        type: 'BUY',
        volume: 1.0,
        openPrice: 1.1234,
        currentPrice: 1.1245,
        profit: 110,
        swap: -0.23,
        commission: -7,
      },
      {
        symbol: 'GBPUSD',
        type: 'SELL',
        volume: 0.5,
        openPrice: 1.2567,
        currentPrice: 1.2545,
        profit: 110,
        swap: -0.12,
        commission: -3.5,
      }
    ]);
  });

  // Handle account updates
  socket.on('get_account_info', () => {
    socket.emit('account_update', {
      balance: 10000,
      equity: 10150,
      margin: 1000,
      freeMargin: 9150,
      marginLevel: 1015,
      currency: 'USD'
    });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Auth routes
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (email === 'dev@example.com' && password === 'password') {
    res.json({
      token: 'dev-token',
      user: {
        id: '1',
        email: 'dev@example.com',
        firstName: 'Dev',
        lastName: 'User',
        role: 'ADMIN',
        preferences: {
          theme: 'dark',
          notifications: {
            email: true,
            push: true,
            sms: false
          },
          tradingPreferences: {
            defaultLeverage: 1,
            riskLevel: 'medium',
            autoTrade: false
          },
          displayPreferences: {
            chartType: 'candlestick',
            timeframe: '1h',
            indicators: ['MA', 'RSI']
          }
        }
      }
    });
  } else {
    res.status(400).json({ error: 'Invalid credentials' });
  }
});

// User preferences routes
app.get('/api/user/preferences', (req, res) => {
  res.json({
    theme: 'dark',
    notifications: {
      email: true,
      push: true,
      sms: false
    },
    tradingPreferences: {
      defaultLeverage: 1,
      riskLevel: 'medium',
      autoTrade: false
    },
    displayPreferences: {
      chartType: 'candlestick',
      timeframe: '1h',
      indicators: ['MA', 'RSI']
    }
  });
});

app.post('/api/user/preferences', (req, res) => {
  res.json(req.body);
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
