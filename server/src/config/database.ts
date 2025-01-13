import logger from '../utils/logger';
import { config } from './config';
import { PrismaClient, Prisma } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prismaOptions: Prisma.PrismaClientOptions = {
  log: [
    { level: 'query', emit: 'event' },
    { level: 'error', emit: 'event' },
    { level: 'warn', emit: 'stdout' },
    { level: 'info', emit: 'stdout' }
  ],
  datasources: {
    db: {
      url: config.database.url
    }
  }
};

// Create a new PrismaClient instance with connection pooling
export const prisma = global.prisma || new PrismaClient(prismaOptions);

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

// @ts-ignore
prisma.$on('query', (event: any) => {
  logger.debug('Query:', event);
});

// @ts-ignore
prisma.$on('error', (event: any) => {
  logger.error('Prisma Error:', event);
});

export async function connectDB(): Promise<void> {
  const MAX_RETRIES = 5;
  const RETRY_DELAY = 5000; // 5 seconds
  const CONNECT_TIMEOUT = 30000; // 30 seconds

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      // Set a timeout for the connection attempt
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Connection timeout')), CONNECT_TIMEOUT);
      });

      // Attempt to connect
      await Promise.race([
        prisma.$connect(),
        timeoutPromise
      ]);

      logger.info('Successfully connected to database');
      return;
    } catch (error) {
      logger.error(`Failed to connect to database (attempt ${attempt}/${MAX_RETRIES}):`, error);
      
      if (attempt === MAX_RETRIES) {
        throw new Error('Failed to connect to database after maximum retries');
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
    }
  }
}

export async function disconnectDB(): Promise<void> {
  try {
    await prisma.$disconnect();
    logger.info('Successfully disconnected from database');
  } catch (error) {
    logger.error('Error disconnecting from database:', error);
    throw error;
  }
}

// Handle process termination
async function handleShutdown(): Promise<void> {
  try {
    logger.info('Shutting down gracefully...');
    await disconnectDB();
    process.exit(0);
  } catch (error) {
    logger.error('Error during shutdown:', error);
    process.exit(1);
  }
}

process.on('SIGINT', handleShutdown);
process.on('SIGTERM', handleShutdown);
process.on('beforeExit', handleShutdown);

export default prisma;
