import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';

config();

let mongoServer: MongoMemoryServer | null = null;
let postgresConnection: DataSource | null = null;

export const postgresConnection = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: ['src/entities/**/*.ts'],
  migrations: ['src/migrations/**/*.ts'],
  subscribers: ['src/subscribers/**/*.ts'],
  synchronize: process.env.NODE_ENV !== 'production',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  logging: process.env.NODE_ENV !== 'production',
});

export const connectDatabase = async () => {
  const maxRetries = 3;
  let retryCount = 0;

  while (retryCount < maxRetries) {
    try {
      console.log(`Connecting to database (attempt ${retryCount + 1}/${maxRetries})...`);
      console.log('Database URL:', process.env.DATABASE_URL.replace(/:[^:@]+@/, ':****@')); // Hide password in logs
      
      // Check if using PostgreSQL
      if (process.env.DATABASE_URL?.includes('postgresql')) {
        // PostgreSQL connection
        const isRender = process.env.RENDER === 'true';
        
        if (!postgresConnection?.isInitialized) {
          await postgresConnection.initialize();
        }
        console.log('Connected to PostgreSQL database');
        
        // Run migrations in production
        if (process.env.NODE_ENV === 'production') {
          try {
            await postgresConnection.runMigrations();
            console.log('Database migrations completed');
          } catch (error) {
            console.error('Error running migrations:', error);
            throw error;
          }
        }
        
        return;
      }

      // MongoDB connections
      if (!process.env.DATABASE_URL) {
        throw new Error('DATABASE_URL is not defined in environment variables');
      }

      if (process.env.NODE_ENV === 'development' && !process.env.DATABASE_URL.includes('mongodb+srv')) {
        // MongoDB Memory Server for development
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        await mongoose.connect(uri);
        console.log('Connected to MongoDB Memory Server');
      } else {
        // MongoDB Atlas connection with retries
        await mongoose.connect(process.env.DATABASE_URL, {
          serverSelectionTimeoutMS: 10000, // Increased timeout
          socketTimeoutMS: 45000,
          connectTimeoutMS: 10000,
          retryWrites: true,
          retryReads: true
        });
        console.log('Connected to MongoDB Atlas');
      }

      // MongoDB connection event handlers
      mongoose.connection.on('error', (err) => {
        console.error('Database connection error:', err);
      });

      mongoose.connection.on('disconnected', () => {
        console.log('Database disconnected');
      });

      // If we reach here, connection was successful
      return;

    } catch (error) {
      console.error(`Error connecting to database (attempt ${retryCount + 1}/${maxRetries}):`, error);
      retryCount++;
      
      if (retryCount === maxRetries) {
        console.error('Max retries reached. Unable to connect to database.');
        throw error;
      }
      
      // Wait before retrying (exponential backoff)
      const delay = Math.min(1000 * Math.pow(2, retryCount), 10000);
      console.log(`Retrying in ${delay/1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

export const disconnectDatabase = async () => {
  try {
    if (postgresConnection?.isInitialized) {
      await postgresConnection.destroy();
      console.log('Disconnected from PostgreSQL');
    }
    
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      if (mongoServer) {
        await mongoServer.stop();
        mongoServer = null;
      }
      console.log('Disconnected from MongoDB');
    }
  } catch (error) {
    console.error('Error disconnecting from database:', error);
    throw error;
  }
};
