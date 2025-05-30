// start-local-backend.js
import { execSync } from 'child_process';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
};

console.log(`${colors.blue}Starting Algo360FX local backend...${colors.reset}`);

// Step 1: Check if Docker containers are running
try {
  console.log(`${colors.yellow}Checking Docker containers...${colors.reset}`);
  const output = execSync('docker ps').toString();
  
  if (!output.includes('algo360fx-postgres') || !output.includes('algo360fx-redis')) {
    console.log(`${colors.yellow}Starting Docker containers...${colors.reset}`);
    execSync('docker-compose up -d', { stdio: 'inherit' });
  } else {
    console.log(`${colors.green}Docker containers are already running.${colors.reset}`);
  }
} catch (error) {
  console.error(`${colors.red}Error with Docker containers: ${error.message}${colors.reset}`);
  console.log(`${colors.yellow}Starting Docker containers...${colors.reset}`);
  execSync('docker-compose up -d', { stdio: 'inherit' });
}

// Step 2: Start the API server
try {
  console.log(`${colors.yellow}Starting API server...${colors.reset}`);
  process.chdir('./api');
  console.log(`${colors.green}API server starting in development mode...${colors.reset}`);
  console.log(`${colors.blue}API will be available at: http://localhost:8080${colors.reset}`);
  console.log(`${colors.blue}API documentation will be available at: http://localhost:8080/docs${colors.reset}`);
  execSync('npm run start:dev', { stdio: 'inherit' });
} catch (error) {
  console.error(`${colors.red}Failed to start API server: ${error.message}${colors.reset}`);
  process.exit(1);
}
