import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { DataSource } from 'typeorm';
import { config } from './config';
import { join } from 'path';

let mongoServer: MongoMemoryServer | null = null;
let postgresConnection: DataSource | null = null;

export const connectDatabase = async () => {
  try {
    console.log('Connecting to database...');
    console.log('Database URL:', config.DATABASE_URL.replace(/:[^:@]+@/, ':****@')); // Hide password in logs
    
    // Check if using PostgreSQL
    if (config.DATABASE_URL?.includes('postgresql')) {
      // PostgreSQL connection
      const isRender = process.env.RENDER === 'true';
      
      postgresConnection = new DataSource({
        type: 'postgres',
        url: config.DATABASE_URL,
        synchronize: config.NODE_ENV === 'development',
        logging: config.NODE_ENV === 'development',
        entities: [join(__dirname, '../entities/**/*.{ts,js}')],
        migrations: [join(__dirname, '../migrations/**/*.{ts,js}')],
        ssl: isRender || config.SSL_ENABLED ? {
          rejectUnauthorized: false // Required for Render's SSL
        } : false,
        extra: {
          max: 20, // Connection pool settings
          idleTimeoutMillis: 30000,
          connectionTimeoutMillis: 2000,
        }
      });

      await postgresConnection.initialize();
      console.log('Connected to PostgreSQL database');
      
      // Run migrations in production
      if (config.NODE_ENV === 'production') {
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
    if (!config.DATABASE_URL) {
      throw new Error('DATABASE_URL is not defined in environment variables');
    }

    if (config.NODE_ENV === 'development' && !config.DATABASE_URL.includes('mongodb+srv')) {
      // MongoDB Memory Server for development
      mongoServer = await MongoMemoryServer.create();
      const uri = mongoServer.getUri();
      await mongoose.connect(uri);
      console.log('Connected to MongoDB Memory Server');
    } else {
      // MongoDB Atlas connection
      await mongoose.connect(config.DATABASE_URL, {
        serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
        socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
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

  } catch (error) {
    console.error('Error connecting to database:', error);
    throw error;
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
