import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { connectDB, disconnectDB } from './config/database';
import { Config } from './config/config';
import app from './app';
import logger from './utils/logger';
import { TradingWebSocketServer } from './websocket/trading';

const PORT = process.env.PORT || 3000;
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: [process.env.CLIENT_URL || 'http://localhost:5173'],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Initialize WebSocket server
const tradingWs = new TradingWebSocketServer(io);

async function startServer() {
  try {
    // Connect to database with retry logic
    await connectDB();
    logger.info('Connected to database successfully');

    // Initialize WebSocket server
    await tradingWs.initialize();
    logger.info('WebSocket server initialized');

    // Start HTTP server
    httpServer.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
      logger.info(`Health check: http://localhost:${PORT}/api/health`);
    });

    // Handle graceful shutdown
    const shutdown = async (signal: string) => {
      logger.info(`Received ${signal}. Starting graceful shutdown...`);

      // Close HTTP server first (stop accepting new connections)
      httpServer.close(async () => {
        try {
          // Close WebSocket connections
          await tradingWs.close();
          logger.info('Closed WebSocket connections');

          // Disconnect from database
          await disconnectDB();
          logger.info('Disconnected from database');

          // Exit process
          process.exit(0);
        } catch (error) {
          logger.error('Error during shutdown:', error);
          process.exit(1);
        }
      });

      // Set a timeout for force shutdown
      setTimeout(() => {
        logger.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 10000);
    };

    // Listen for shutdown signals
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

startServer();
