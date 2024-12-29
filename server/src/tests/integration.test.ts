import axios from 'axios';
import WebSocket from 'ws';
import { logger } from '../utils/logger';

const BASE_URL = process.env.RENDER_API_URL || 'https://algo360fx.onrender.com';
const WS_URL = process.env.RENDER_WS_URL || 'wss://algo360fx.onrender.com';

interface TestResult {
  feature: string;
  status: 'success' | 'failed';
  error?: any;
  response?: any;
}

async function testFeatures() {
  const results: TestResult[] = [];
  let authToken: string;

  try {
    // Test 1: Authentication
    logger.info('Testing Authentication...');
    const authResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: process.env.TEST_USER_EMAIL,
      password: process.env.TEST_USER_PASSWORD
    });
    
    authToken = authResponse.data.token;
    results.push({
      feature: 'Authentication',
      status: 'success',
      response: { authenticated: true }
    });

    // Test 2: AI Chat
    logger.info('Testing AI Chat...');
    const chatResponse = await axios.post(
      `${BASE_URL}/api/ai/chat`,
      {
        message: 'Analyze EURUSD market conditions',
        selectedMarkets: ['EURUSD'],
        timeframe: '1h'
      },
      {
        headers: { Authorization: `Bearer ${authToken}` }
      }
    );
    results.push({
      feature: 'AI Chat',
      status: 'success',
      response: chatResponse.data
    });

    // Test 3: Market Analysis
    logger.info('Testing Market Analysis...');
    const analysisResponse = await axios.get(
      `${BASE_URL}/api/ai/analysis?symbols=EURUSD&timeframe=1h`,
      {
        headers: { Authorization: `Bearer ${authToken}` }
      }
    );
    results.push({
      feature: 'Market Analysis',
      status: 'success',
      response: analysisResponse.data
    });

    // Test 4: Price Prediction
    logger.info('Testing Price Prediction...');
    const predictionResponse = await axios.get(
      `${BASE_URL}/api/ai/prediction?symbol=EURUSD&timeframe=1h`,
      {
        headers: { Authorization: `Bearer ${authToken}` }
      }
    );
    results.push({
      feature: 'Price Prediction',
      status: 'success',
      response: predictionResponse.data
    });

    // Test 5: Trading Signals
    logger.info('Testing Trading Signals...');
    const signalsResponse = await axios.get(
      `${BASE_URL}/api/ai/signals?symbol=EURUSD&timeframe=1h`,
      {
        headers: { Authorization: `Bearer ${authToken}` }
      }
    );
    results.push({
      feature: 'Trading Signals',
      status: 'success',
      response: signalsResponse.data
    });

    // Test 6: Risk Assessment
    logger.info('Testing Risk Assessment...');
    const riskResponse = await axios.get(
      `${BASE_URL}/api/ai/risk?symbol=EURUSD`,
      {
        headers: { Authorization: `Bearer ${authToken}` }
      }
    );
    results.push({
      feature: 'Risk Assessment',
      status: 'success',
      response: riskResponse.data
    });

    // Test 7: WebSocket Connection
    logger.info('Testing WebSocket Connection...');
    await new Promise((resolve, reject) => {
      const ws = new WebSocket(WS_URL);
      
      ws.on('open', () => {
        // Subscribe to market data
        ws.send(JSON.stringify({
          type: 'subscribe',
          data: {
            symbols: ['EURUSD'],
            timeframe: '1m'
          }
        }));

        // Wait for initial data
        const timeout = setTimeout(() => {
          ws.close();
          reject(new Error('WebSocket timeout'));
        }, 10000);

        ws.on('message', (data) => {
          const message = JSON.parse(data.toString());
          if (message.type === 'market_data' || message.type === 'ai_update') {
            clearTimeout(timeout);
            ws.close();
            resolve(message);
          }
        });
      });

      ws.on('error', (error) => {
        reject(error);
      });
    });

    results.push({
      feature: 'WebSocket',
      status: 'success',
      response: { connected: true }
    });

  } catch (error) {
    logger.error('Test failed:', error);
    results.push({
      feature: 'Current Test',
      status: 'failed',
      error: error
    });
  }

  return results;
}

// Run tests and display results
async function runTests() {
  logger.info('Starting integration tests...');
  const results = await testFeatures();
  
  logger.info('\nTest Results:');
  results.forEach(result => {
    const status = result.status === 'success' ? '✓' : '✗';
    logger.info(`${status} ${result.feature}`);
    if (result.error) {
      logger.error(`  Error: ${result.error.message}`);
    }
    if (result.response) {
      logger.info(`  Response: ${JSON.stringify(result.response, null, 2)}`);
    }
  });
}

// Run if called directly
if (require.main === module) {
  runTests().catch(error => {
    logger.error('Test runner failed:', error);
    process.exit(1);
  });
}
