import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { config } from './config';

let mongoServer: MongoMemoryServer;

export const connectDatabase = async () => {
  try {
    if (config.env === 'development') {
      mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      await mongoose.connect(mongoUri);
    } else {
      await mongoose.connect(config.mongoUri);
    }
    
    console.log('Connected to MongoDB Memory Server');
    
    // Create indexes for all models
    await Promise.all([
      mongoose.model('Strategy').createIndexes(),
      mongoose.model('Portfolio').createIndexes(),
      mongoose.model('Documentation').createIndexes(),
      mongoose.model('Analytics').createIndexes(),
    ]);
    console.log('Database indexes created successfully');
  } catch (error) {
    console.error('Error connecting to database:', error);
    process.exit(1);
  }
};

export const disconnectDatabase = async () => {
  try {
    await mongoose.disconnect();
    if (mongoServer) {
      await mongoServer.stop();
    }
  } catch (error) {
    console.error('Error disconnecting from database:', error);
    process.exit(1);
  }
};

// Handle database connection events
mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB error:', err);
});

// Gracefully close the connection when the app is shutting down
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    if (mongoServer) {
      await mongoServer.stop();
    }
    console.log('MongoDB connection closed through app termination');
    process.exit(0);
  } catch (err) {
    console.error('Error closing MongoDB connection:', err);
    process.exit(1);
  }
});
