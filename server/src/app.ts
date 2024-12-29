import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import authRoutes from './routes/auth.routes';
import marketDataRoutes from './routes/marketData.routes';
import technicalAnalysisRoutes from './routes/technicalAnalysis.routes';
import aiAssistantRoutes from './routes/aiAssistant.routes';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/market-data', marketDataRoutes);
app.use('/api/technical-analysis', technicalAnalysisRoutes);
app.use('/api/ai', aiAssistantRoutes);

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

export default app;
