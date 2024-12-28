import express = require('express');
import { createServer } from 'http';
import cors = require('cors');
import { Server } from 'socket.io';
import dotenv = require('dotenv');
import userRoutes from './routes/userRoutes';
import portfolioRoutes from './routes/portfolioRoutes';
import strategyRoutes from './routes/strategyRoutes';
import positionRoutes from './routes/positionRoutes';

dotenv.config();

const app = express();
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
