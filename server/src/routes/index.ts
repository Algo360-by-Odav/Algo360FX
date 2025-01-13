import express from 'express';
import { prisma } from '../config/database';
import authRoutes from './auth';
import userRoutes from './user';
import portfolioRoutes from './portfolio';

const router = express.Router();

// Root endpoint
router.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Algo360FX API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Enhanced health check
router.get('/health', async (req, res) => {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    
    res.json({
      status: 'ok',
      services: {
        api: {
          status: 'ok',
          uptime: process.uptime()
        },
        database: {
          status: 'ok',
          type: 'postgresql'
        }
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      services: {
        api: {
          status: 'ok',
          uptime: process.uptime()
        },
        database: {
          status: 'error',
          message: 'Database connection failed'
        }
      },
      timestamp: new Date().toISOString()
    });
  }
});

// Routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/portfolios', portfolioRoutes);

export default router;
