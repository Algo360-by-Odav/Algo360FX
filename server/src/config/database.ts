import mongoose from 'mongoose';
import { config } from './config';

export const connectToDatabase = async () => {
  try {
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 15000,
      maxPoolSize: 50,
      retryWrites: true,
      retryReads: true,
    };

    await mongoose.connect(config.mongoUri || config.databaseUrl, options);
    console.log('Connected to MongoDB');
    
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
    console.log('MongoDB connection closed through app termination');
    process.exit(0);
  } catch (err) {
    console.error('Error closing MongoDB connection:', err);
    process.exit(1);
  }
});
