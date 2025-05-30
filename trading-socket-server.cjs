// trading-socket-server.cjs
const { WebSocketServer } = require('ws');
const http = require('http');
const fs = require('fs');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
};

// Create HTTP server
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('WebSocket Server for Trading Data\n');
});

// Create WebSocket server
const wss = new WebSocketServer({ server });

// Store connected clients
const clients = new Map();

// Store subscribed symbols for each client
const subscriptions = new Map();

// Base values for different asset classes
const baseValues = {
  'EUR/USD': 1.09,
  'GBP/USD': 1.26,
  'USD/JPY': 109.2,
  'AUD/USD': 0.71,
  'USD/CAD': 1.32,
  'AAPL': 172.5,
  'MSFT': 342.9,
  'GOOGL': 131.8,
  'AMZN': 178.3,
  'TSLA': 245.7,
  'BTC/USD': 43250,
  'ETH/USD': 2345,
  'XRP/USD': 0.54,
  'SOL/USD': 123.4,
  'ADA/USD': 0.43,
  'SPX': 4567,
  'DJI': 34567,
  'IXIC': 14567,
  'RUT': 2345,
  'VIX': 18.7,
};

// List of common trading symbols
const availableSymbols = [
  'EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'USD/CAD', // Forex
  'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', // Stocks
  'BTC/USD', 'ETH/USD', 'XRP/USD', 'SOL/USD', 'ADA/USD', // Crypto
  'SPX', 'DJI', 'IXIC', 'RUT', 'VIX' // Indices
];

// Generate market data for a symbol
function generateMarketData(symbol) {
  // Get the base value for the symbol or use a default
  const baseValue = baseValues[symbol] || 100;
  
  // Generate a random price change (more volatile for crypto, less for forex)
  let volatilityFactor = 0.0005; // Default for forex
  
  if (symbol.includes('/USD') && !symbol.startsWith('USD')) {
    volatilityFactor = 0.005; // Crypto
  } else if (['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA'].includes(symbol)) {
    volatilityFactor = 0.002; // Stocks
  } else if (['SPX', 'DJI', 'IXIC', 'RUT', 'VIX'].includes(symbol)) {
    volatilityFactor = 0.001; // Indices
  }
  
  const randomChange = (Math.random() - 0.5) * 2 * baseValue * volatilityFactor;
  const price = baseValue + randomChange;
  
  // Calculate bid and ask with a small spread
  const spread = baseValue * 0.0002;
  const bid = price - spread / 2;
  const ask = price + spread / 2;
  
  // Generate random volume
  const volume = Math.floor(Math.random() * 1000000) + 100000;
  
  // Generate timestamp
  const timestamp = new Date().toISOString();
  
  return {
    symbol,
    data: {
      bid: parseFloat(bid.toFixed(4)),
      ask: parseFloat(ask.toFixed(4)),
      price: parseFloat(price.toFixed(4)),
      change: parseFloat(randomChange.toFixed(4)),
      changePercent: parseFloat((randomChange / baseValue * 100).toFixed(2)),
      volume,
      timestamp,
    }
  };
}

// Handle WebSocket connections
wss.on('connection', (ws, req) => {
  const clientId = req.headers['sec-websocket-key'];
  clients.set(clientId, ws);
  subscriptions.set(clientId, new Set());
  
  console.log(`${colors.green}Client connected: ${clientId}${colors.reset}`);
  console.log(`${colors.blue}Total clients: ${clients.size}${colors.reset}`);
  
  // Handle messages from clients
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      
      // Handle subscribe message
      if (data.type === 'subscribe' && Array.isArray(data.symbols)) {
        const clientSubscriptions = subscriptions.get(clientId);
        
        // Add symbols to client subscriptions
        data.symbols.forEach(symbol => {
          if (availableSymbols.includes(symbol)) {
            clientSubscriptions.add(symbol);
          }
        });
        
        console.log(`${colors.blue}Client ${clientId} subscribed to: ${Array.from(clientSubscriptions).join(', ')}${colors.reset}`);
        
        // Send initial data for subscribed symbols
        Array.from(clientSubscriptions).forEach(symbol => {
          const marketData = generateMarketData(symbol);
          ws.send(JSON.stringify({
            type: 'marketData',
            data: marketData
          }));
        });
        
        // Send confirmation
        ws.send(JSON.stringify({
          type: 'subscribeConfirm',
          symbols: Array.from(clientSubscriptions)
        }));
      }
      
      // Handle unsubscribe message
      if (data.type === 'unsubscribe' && Array.isArray(data.symbols)) {
        const clientSubscriptions = subscriptions.get(clientId);
        
        // Remove symbols from client subscriptions
        data.symbols.forEach(symbol => {
          clientSubscriptions.delete(symbol);
        });
        
        console.log(`${colors.blue}Client ${clientId} unsubscribed from: ${data.symbols.join(', ')}${colors.reset}`);
        console.log(`${colors.blue}Remaining subscriptions: ${Array.from(clientSubscriptions).join(', ')}${colors.reset}`);
        
        // Send confirmation
        ws.send(JSON.stringify({
          type: 'unsubscribeConfirm',
          symbols: data.symbols
        }));
      }
    } catch (error) {
      console.error(`${colors.red}Error processing message: ${error.message}${colors.reset}`);
    }
  });
  
  // Handle client disconnection
  ws.on('close', () => {
    clients.delete(clientId);
    subscriptions.delete(clientId);
    console.log(`${colors.yellow}Client disconnected: ${clientId}${colors.reset}`);
    console.log(`${colors.blue}Total clients: ${clients.size}${colors.reset}`);
  });
});

// Send market data updates to subscribed clients
function sendMarketDataUpdates() {
  // For each client
  for (const [clientId, ws] of clients.entries()) {
    if (ws.readyState === ws.OPEN) {
      const clientSubscriptions = subscriptions.get(clientId);
      
      // For each subscribed symbol
      for (const symbol of clientSubscriptions) {
        const marketData = generateMarketData(symbol);
        
        // Send market data
        ws.send(JSON.stringify({
          type: 'marketData',
          data: marketData
        }));
      }
    }
  }
}

// Start sending market data updates every second
const updateInterval = setInterval(sendMarketDataUpdates, 1000);

// Start the server
const PORT = 8081;
server.listen(PORT, () => {
  console.log(`${colors.green}WebSocket server started on port ${PORT}${colors.reset}`);
  console.log(`${colors.blue}WebSocket URL: ws://localhost:${PORT}${colors.reset}`);
  console.log(`${colors.blue}Available symbols: ${availableSymbols.join(', ')}${colors.reset}`);
});

// Handle server shutdown
process.on('SIGINT', () => {
  clearInterval(updateInterval);
  server.close(() => {
    console.log(`${colors.yellow}WebSocket server stopped${colors.reset}`);
    process.exit(0);
  });
});
