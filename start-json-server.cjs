// start-json-server.js
const { execSync } = require('child_process');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
};

console.log(`${colors.blue}Starting Algo360FX local backend (JSON Server)...${colors.reset}`);

try {
  console.log(`${colors.yellow}Starting JSON Server on port 8080...${colors.reset}`);
  console.log(`${colors.green}API will be available at: http://localhost:8080${colors.reset}`);
  console.log(`${colors.blue}Available endpoints:${colors.reset}`);
  console.log(`${colors.blue}- GET /users${colors.reset}`);
  console.log(`${colors.blue}- GET /marketData${colors.reset}`);
  console.log(`${colors.blue}- GET /tradingStrategies${colors.reset}`);
  console.log(`${colors.blue}- GET /subscriptionPlans${colors.reset}`);
  console.log(`${colors.blue}- GET /marketplace${colors.reset}`);
  
  // Start JSON Server
  execSync('json-server --watch db.json --port 8080', { stdio: 'inherit' });
} catch (error) {
  console.error(`${colors.red}Failed to start JSON Server: ${error.message}${colors.reset}`);
  process.exit(1);
}
