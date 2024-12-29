import { createServer } from 'http';
import { app } from './app';
import { WebSocketServer } from './services/websocket/wsServer.service';
import { logger } from './utils/logger';

const port = process.env.PORT || 5000;
const wsPort = process.env.WS_PORT || 3002;

// Create HTTP server
const server = createServer(app);

// Initialize WebSocket server
const wss = new WebSocketServer(server);

// Start the server
server.listen(port, () => {
  logger.info(`HTTP Server running on port ${port}`);
  logger.info(`WebSocket Server running on port ${wsPort}`);
});
