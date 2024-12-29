import mongoose from 'mongoose';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import path from 'path';
import { logger } from '../utils/logger';

// Load environment variables
config();

const rootDir = path.resolve(__dirname, '..');

const postgresConnection = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL || '',
  entities: [path.join(rootDir, 'models', '**', '*.{ts,js}')],
  migrations: [path.join(rootDir, 'migrations', '**', '*.{ts,js}')],
  subscribers: [path.join(rootDir, 'subscribers', '**', '*.{ts,js}')],
  synchronize: process.env.NODE_ENV !== 'production',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  logging: process.env.NODE_ENV !== 'production',
});

// MongoDB connection options (temporarily disabled)
const mongoOptions: mongoose.ConnectOptions = {
  serverSelectionTimeoutMS: 15000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 15000,
  maxPoolSize: 50,
  minPoolSize: 10,
  retryWrites: true,
  retryReads: true,
  w: 'majority',
};

export const connectDatabase = async (): Promise<boolean> => {
  const maxRetries = 3;
  let retryCount = 0;

  while (retryCount < maxRetries) {
    try {
      logger.info(`Connecting to database (attempt ${retryCount + 1}/${maxRetries})...`);
      
      // MongoDB connection (temporarily disabled)
      // if (process.env.MONGODB_URI) {
      //   await mongoose.connect(process.env.MONGODB_URI, mongoOptions);
        
      //   // Set up connection event handlers
      //   mongoose.connection.on('error', (error) => {
      //     logger.error('MongoDB connection error:', error);
      //   });

      //   mongoose.connection.on('disconnected', () => {
      //     logger.warn('MongoDB disconnected. Attempting to reconnect...');
      //   });

      //   mongoose.connection.on('reconnected', () => {
      //     logger.info('MongoDB reconnected');
      //   });

      //   logger.info('Connected to MongoDB database');
      // }
      
      // PostgreSQL connection
      if (process.env.DATABASE_URL?.includes('postgresql')) {
        if (!postgresConnection.isInitialized) {
          await postgresConnection.initialize();
          logger.info('Connected to PostgreSQL database');
          
          // Run migrations in production
          if (process.env.NODE_ENV === 'production') {
            try {
              await postgresConnection.runMigrations();
              logger.info('Database migrations completed');
            } catch (migrationError) {
              logger.error('Error running migrations:', migrationError);
              throw migrationError;
            }
          }
        }
      }
      
      return true;
    } catch (error) {
      logger.error(`Database connection attempt ${retryCount + 1} failed:`, error);
      retryCount++;
      
      if (retryCount === maxRetries) {
        logger.error('All database connection attempts failed');
        throw error;
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
  
  return false;
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    // Disconnect MongoDB (temporarily disabled)
    // if (mongoose.connection.readyState !== 0) {
    //   await mongoose.disconnect();
    //   logger.info('Disconnected from MongoDB');
    // }
    
    // Disconnect PostgreSQL
    if (postgresConnection.isInitialized) {
      await postgresConnection.destroy();
      logger.info('Disconnected from PostgreSQL');
    }
  } catch (error) {
    logger.error('Error during database disconnection:', error);
    throw error;
  }
};

export { postgresConnection };
