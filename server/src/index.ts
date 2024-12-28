import express, { Application } from 'express';
import { createServer } from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import portfolioRoutes from './routes/portfolioRoutes.js';
import strategyRoutes from './routes/strategyRoutes.js';
import positionRoutes from './routes/positionRoutes.js';

dotenv.config();

const app: Application = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/user', userRoutes);
app.use('/portfolio', portfolioRoutes);
app.use('/strategies', strategyRoutes);
app.use('/positions', positionRoutes);

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
