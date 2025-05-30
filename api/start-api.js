// Simple script to start the API server directly
const { spawn } = require('child_process');
const path = require('path');

console.log('Starting Algo360FX API server...');

// Run the server directly without nodemon
const apiProcess = spawn('npx', ['ts-node', 'src/main.ts'], {
  cwd: __dirname,
  stdio: 'inherit'
});

apiProcess.on('error', (err) => {
  console.error('Failed to start API server:', err);
});

process.on('SIGINT', () => {
  console.log('Stopping API server...');
  apiProcess.kill();
  process.exit();
});
