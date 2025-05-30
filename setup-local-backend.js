// setup-local-backend.js
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
};

console.log(`${colors.blue}Setting up Algo360FX local backend...${colors.reset}`);

// Step 1: Check if Docker is installed
try {
  console.log(`${colors.yellow}Checking if Docker is installed...${colors.reset}`);
  execSync('docker --version', { stdio: 'inherit' });
  console.log(`${colors.green}Docker is installed.${colors.reset}`);
} catch (error) {
  console.error(`${colors.red}Docker is not installed or not in PATH. Please install Docker Desktop: https://www.docker.com/products/docker-desktop${colors.reset}`);
  process.exit(1);
}

// Step 2: Start Docker containers
try {
  console.log(`${colors.yellow}Starting Docker containers...${colors.reset}`);
  execSync('docker-compose up -d', { stdio: 'inherit' });
  console.log(`${colors.green}Docker containers started successfully.${colors.reset}`);
} catch (error) {
  console.error(`${colors.red}Failed to start Docker containers: ${error.message}${colors.reset}`);
  process.exit(1);
}

// Step 3: Install API dependencies
try {
  console.log(`${colors.yellow}Installing API dependencies...${colors.reset}`);
  process.chdir('./api');
  execSync('npm install', { stdio: 'inherit' });
  console.log(`${colors.green}API dependencies installed successfully.${colors.reset}`);
} catch (error) {
  console.error(`${colors.red}Failed to install API dependencies: ${error.message}${colors.reset}`);
  process.exit(1);
}

// Step 4: Copy local.env to .env if .env doesn't exist
try {
  console.log(`${colors.yellow}Setting up environment variables...${colors.reset}`);
  if (!fs.existsSync('.env')) {
    fs.copyFileSync('local.env', '.env');
    console.log(`${colors.green}Created .env file from local.env${colors.reset}`);
  } else {
    console.log(`${colors.yellow}.env file already exists, skipping...${colors.reset}`);
  }
} catch (error) {
  console.error(`${colors.red}Failed to set up environment variables: ${error.message}${colors.reset}`);
  process.exit(1);
}

// Step 5: Generate Prisma client
try {
  console.log(`${colors.yellow}Generating Prisma client...${colors.reset}`);
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log(`${colors.green}Prisma client generated successfully.${colors.reset}`);
} catch (error) {
  console.error(`${colors.red}Failed to generate Prisma client: ${error.message}${colors.reset}`);
  process.exit(1);
}

// Step 6: Run Prisma migrations
try {
  console.log(`${colors.yellow}Running Prisma migrations...${colors.reset}`);
  execSync('npx prisma migrate dev --name init', { stdio: 'inherit' });
  console.log(`${colors.green}Prisma migrations completed successfully.${colors.reset}`);
} catch (error) {
  console.error(`${colors.red}Failed to run Prisma migrations: ${error.message}${colors.reset}`);
  process.exit(1);
}

// Step 7: Seed the database
try {
  console.log(`${colors.yellow}Seeding the database...${colors.reset}`);
  execSync('npm run prisma:seed', { stdio: 'inherit' });
  console.log(`${colors.green}Database seeded successfully.${colors.reset}`);
} catch (error) {
  console.error(`${colors.red}Failed to seed the database: ${error.message}${colors.reset}`);
  process.exit(1);
}

// Step 8: Build the API
try {
  console.log(`${colors.yellow}Building the API...${colors.reset}`);
  execSync('npm run build', { stdio: 'inherit' });
  console.log(`${colors.green}API built successfully.${colors.reset}`);
} catch (error) {
  console.error(`${colors.red}Failed to build the API: ${error.message}${colors.reset}`);
  process.exit(1);
}

console.log(`${colors.blue}Setup completed successfully!${colors.reset}`);
console.log(`${colors.green}You can now start the API with: cd api && npm run start:dev${colors.reset}`);
