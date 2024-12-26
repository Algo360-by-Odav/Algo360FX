import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { config } from './config';

let mongoServer: MongoMemoryServer | null = null;

export const connectDatabase = async () => {
  try {
    if (config.env === 'development' && !config.DATABASE_URL?.includes('mongodb+srv')) {
      mongoServer = await MongoMemoryServer.create();
      const uri = mongoServer.getUri();
      await mongoose.connect(uri);
      console.log('Connected to MongoDB Memory Server');
    } else {
      await mongoose.connect(config.DATABASE_URL || '');
      console.log('Connected to MongoDB Atlas');
    }
    
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

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
      mongoServer = null;
    }
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error disconnecting from database:', error);
    process.exit(1);
  }
};
