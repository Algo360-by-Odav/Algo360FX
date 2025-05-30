// simple-server.cjs
const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Enable CORS for all routes
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Sample data if db.json doesn't exist or can't be read
const defaultData = {
  users: [
    { id: 1, name: "John Doe", email: "john@example.com", role: "trader" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "admin" }
  ],
  marketData: {
    forex: [
      { symbol: "EUR/USD", bid: 1.0921, ask: 1.0923, spread: 0.0002 },
      { symbol: "GBP/USD", bid: 1.2654, ask: 1.2657, spread: 0.0003 }
    ]
  },
  tradingStrategies: [
    { id: 1, name: "Trend Following", winRate: 65, riskLevel: "medium" },
    { id: 2, name: "Mean Reversion", winRate: 72, riskLevel: "high" }
  ],
  subscriptionPlans: [
    { id: 1, name: "Basic", price: 29.99, features: ["Market Data", "Basic Analysis"] },
    { id: 2, name: "Pro", price: 99.99, features: ["Market Data", "Advanced Analysis", "AI Signals"] }
  ]
};

// Load data from db.json or use default data
let mockData;
try {
  const data = fs.readFileSync('./db.json', 'utf8');
  mockData = JSON.parse(data);
  console.log('Successfully loaded data from db.json');
} catch (error) {
  console.log('Using default mock data');
  mockData = defaultData;
}

// Define routes for mock data
app.get('/users', (req, res) => {
  console.log('GET /users request received');
  res.json(mockData.users || []);
});

app.get('/marketData', (req, res) => {
  console.log('GET /marketData request received');
  res.json(mockData.marketData || {});
});

app.get('/tradingStrategies', (req, res) => {
  console.log('GET /tradingStrategies request received');
  res.json(mockData.tradingStrategies || []);
});

app.get('/subscriptionPlans', (req, res) => {
  console.log('GET /subscriptionPlans request received');
  res.json(mockData.subscriptionPlans || []);
});

app.get('/marketplace', (req, res) => {
  console.log('GET /marketplace request received');
  res.json(mockData.marketplace || {});
});

// Server status endpoint
app.get('/api/status', (req, res) => {
  console.log('GET /api/status request received');
  res.json({
    status: 'ok',
    message: 'Simple API server is running',
    timestamp: new Date().toISOString()
  });
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Simple API server is running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('- GET /users');
  console.log('- GET /marketData');
  console.log('- GET /tradingStrategies');
  console.log('- GET /subscriptionPlans');
  console.log('- GET /marketplace');
  console.log('- GET /api/status');
});
