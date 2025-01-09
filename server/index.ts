import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import config, { prisma, redis } from './src/config';
import app from './src/app';
import { setupWebSocketServer } from './src/websocket/server';
import { setupMarketDataService } from './src/services/MarketData';
import { logger } from './src/utils/logger';

async function startServer() {
  try {
    // Create HTTP server
    const server = createServer(app);

    // Create WebSocket server
    const wss = new WebSocketServer({ 
      server,
      path: '/ws',
      clientTracking: true,
    });

    // Setup WebSocket handlers
    setupWebSocketServer(wss);

    // Initialize market data service
    await setupMarketDataService();

    // Start HTTP server
    server.listen(config.server.port, () => {
      logger.info(`Server running in ${config.env} mode on port ${config.server.port}`);
      logger.info(`WebSocket server running on ws://localhost:${config.server.port}/ws`);
      logger.info(`CORS enabled for origin: ${config.server.corsOrigin}`);
    });

    // Handle server shutdown
    const gracefulShutdown = async (signal: string) => {
      logger.info(`Received ${signal}. Starting graceful shutdown...`);

      // Close WebSocket server
      wss.close(() => {
        logger.info('WebSocket server closed');
      });

      // Close HTTP server
      server.close(() => {
        logger.info('HTTP server closed');
      });

      // Disconnect from databases
      try {
        await Promise.all([
          prisma.$disconnect(),
          redis.quit()
        ]);
        logger.info('Database connections closed');
      } catch (error) {
        logger.error('Error during database disconnection:', error);
      }

      // Exit process
      process.exit(0);
    };

    // Setup signal handlers
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Handle uncaught errors
    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception:', error);
      gracefulShutdown('uncaughtException');
    });

    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
      gracefulShutdown('unhandledRejection');
    });

  } catch (error) {
    logger.error('Error starting server:', error);
    process.exit(1);
  }
}

// Start the server
startServer().catch((error) => {
  logger.error('Failed to start server:', error);
  process.exit(1);
});
