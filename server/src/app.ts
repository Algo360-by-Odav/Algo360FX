import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import authRoutes from './routes/auth.routes';
import marketDataRoutes from './routes/marketData.routes';
import technicalAnalysisRoutes from './routes/technicalAnalysis.routes';
import aiAssistantRoutes from './routes/aiAssistant.routes';
import { errorHandler } from './middleware/error.middleware';
import { authenticate } from './middleware/auth.middleware';
import { logger } from './utils/logger';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/market-data', marketDataRoutes);
app.use('/api/technical-analysis', technicalAnalysisRoutes);
app.use('/api/ai', authenticate, aiAssistantRoutes);

// Error handling
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found'
  });
});

export { app };
