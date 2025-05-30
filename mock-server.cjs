// mock-server.cjs
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Enable CORS for all routes
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Load mock data from db.json
const loadData = () => {
  try {
    const data = fs.readFileSync(path.join(__dirname, 'db.json'), 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading mock data:', error);
    return {};
  }
};

let mockData = loadData();

// Define routes for mock data
app.get('/users', (req, res) => {
  res.json(mockData.users || []);
});

app.get('/marketData', (req, res) => {
  res.json(mockData.marketData || {});
});

app.get('/tradingStrategies', (req, res) => {
  res.json(mockData.tradingStrategies || []);
});

app.get('/subscriptionPlans', (req, res) => {
  res.json(mockData.subscriptionPlans || []);
});

app.get('/marketplace', (req, res) => {
  res.json(mockData.marketplace || {});
});

// Mock API endpoint
app.get('/api/status', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Mock API server is running',
    timestamp: new Date().toISOString()
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Mock API server is running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('- GET /users');
  console.log('- GET /marketData');
  console.log('- GET /tradingStrategies');
  console.log('- GET /subscriptionPlans');
  console.log('- GET /marketplace');
  console.log('- GET /api/status');
});
