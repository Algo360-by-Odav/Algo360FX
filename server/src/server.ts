import { createServer } from 'http';
import { app } from './app';
import { WebSocketServer } from './services/websocket/wsServer.service';
import { logger } from './utils/logger';
import { connectDatabase } from './config/database';

const port = process.env.PORT || 5000;
const wsPort = process.env.WS_PORT || 3002;

// Create HTTP server
const server = createServer(app);

// Initialize WebSocket server
const wss = new WebSocketServer(server);

// Start the server
const startServer = async () => {
  try {
    // Connect to database
    await connectDatabase();
    logger.info('Database connected successfully');

    // Start HTTP server
    server.listen(port, () => {
      logger.info(`Server is running in ${process.env.NODE_ENV || 'development'} mode`);
      logger.info(`HTTP Server: http://localhost:${port}`);
      logger.info(`WebSocket Server: ws://localhost:${wsPort}`);
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle server shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

startServer();
