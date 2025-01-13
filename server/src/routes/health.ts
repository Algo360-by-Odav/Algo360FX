import express from 'express';
import { prisma } from '../lib/prisma';

const router = express.Router();

// Enhanced health check endpoint
router.get('/', async (req, res) => {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    const dbStatus = 'Connected';

    // Get system info
    const systemInfo = {
      nodeVersion: process.version,
      platform: process.platform,
      memory: process.memoryUsage(),
      uptime: process.uptime(),
      env: process.env.NODE_ENV
    };

    // Get database info
    const [userCount, portfolioCount] = await Promise.all([
      prisma.user.count(),
      prisma.portfolio.count()
    ]);

    const databaseInfo = {
      status: dbStatus,
      collections: {
        users: userCount,
        portfolios: portfolioCount
      }
    };

    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      system: systemInfo,
      database: databaseInfo
    });
  } catch (error: any) {
    console.error('Health check failed:', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });

    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

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
      cpus: require('os').cpus(),
      totalMemory: require('os').totalmem(),
      freeMemory: require('os').freemem(),
      loadAvg: require('os').loadavg(),
      uptime: require('os').uptime(),
      networkInterfaces: require('os').networkInterfaces()
    },
    database: {
      status: 'Connected',
      name: 'Prisma',
      host: 'localhost',
      port: 5432
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
