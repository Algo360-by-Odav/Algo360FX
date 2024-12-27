import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';

// Load environment variables
config();

// Initialize database connections
let mongoServer: MongoMemoryServer | null = null;
const postgresConnection = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL || '',
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
      
      // Log database URL with hidden credentials
      if (process.env.DATABASE_URL) {
        console.log('Database URL:', process.env.DATABASE_URL.replace(/:[^:@]+@/, ':****@'));
      }
      
      // PostgreSQL connection
      if (process.env.DATABASE_URL?.includes('postgresql')) {
        if (!postgresConnection.isInitialized) {
          await postgresConnection.initialize();
          console.log('Connected to PostgreSQL database');
          
          // Run migrations in production
          if (process.env.NODE_ENV === 'production') {
            try {
              await postgresConnection.runMigrations();
              console.log('Database migrations completed');
            } catch (migrationError) {
              console.error('Error running migrations:', migrationError);
            }
          }
        }
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
        // MongoDB Atlas connection
        await mongoose.connect(process.env.DATABASE_URL, {
          serverSelectionTimeoutMS: 10000,
          socketTimeoutMS: 45000,
          connectTimeoutMS: 10000,
        });
        console.log('Connected to MongoDB Atlas');
      }

      // All connections successful
      return true;
    } catch (error) {
      console.error('Database connection error:', error);
      retryCount++;
      
      if (retryCount === maxRetries) {
        throw new Error(`Failed to connect to database after ${maxRetries} attempts`);
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
};

export const disconnectDatabase = async () => {
  try {
    if (postgresConnection.isInitialized) {
      await postgresConnection.destroy();
      console.log('PostgreSQL connection closed');
    }

    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      console.log('MongoDB connection closed');
    }

    if (mongoServer) {
      await mongoServer.stop();
      console.log('MongoDB Memory Server stopped');
    }
  } catch (error) {
    console.error('Error disconnecting from databases:', error);
    throw error;
  }
};

export { postgresConnection };
