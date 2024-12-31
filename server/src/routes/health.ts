import { Router } from 'express';
import mongoose from 'mongoose';
import os from 'os';
import { asyncHandler } from '../middleware/asyncHandler';

const router = Router();

// Enhanced health check endpoint
router.get('/', asyncHandler(async (req, res) => {
  const dbState = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  const mongoStatus = dbState[mongoose.connection.readyState];
  
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: {
      status: mongoStatus,
      collections: mongoose.connection.collections ? Object.keys(mongoose.connection.collections).length : 0,
    },
    memory: {
      heapUsed: process.memoryUsage().heapUsed,
      heapTotal: process.memoryUsage().heapTotal,
      external: process.memoryUsage().external
    },
    environment: process.env.NODE_ENV || 'development'
  };

  const isHealthy = mongoStatus === 'connected';
  
  res.status(isHealthy ? 200 : 503).json(health);
}));

// Detailed health check for internal monitoring
router.get('/detailed', async (req, res) => {
  const detailedHealth = {
    status: 'UP',
    timestamp: new Date().toISOString(),
    server: {
      environment: process.env.NODE_ENV,
      nodeVersion: process.version,
      platform: process.platform,
      memory: process.memoryUsage(),
      uptime: process.uptime()
    },
    system: {
      cpus: os.cpus(),
      totalMemory: os.totalmem(),
      freeMemory: os.freemem(),
      loadAvg: os.loadavg(),
      uptime: os.uptime(),
      networkInterfaces: os.networkInterfaces()
    },
    database: {
      status: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
      name: mongoose.connection.name,
      host: mongoose.connection.host,
      port: mongoose.connection.port
    }
  };

  try {
    res.status(200).json(detailedHealth);
  } catch (error) {
    detailedHealth.status = 'DOWN';
    res.status(503).json(detailedHealth);
  }
});

export default router;
