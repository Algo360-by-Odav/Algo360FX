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
    { level: 'error', emit: 'stdout' },
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

// Handle process termination
const handleShutdown = async () => {
  try {
    await prisma.$disconnect();
    logger.info('Database connection closed gracefully');
  } catch (error) {
    logger.error('Error disconnecting from database:', error);
    process.exit(1);
  }
};

process.on('SIGINT', handleShutdown);
process.on('SIGTERM', handleShutdown);
process.on('beforeExit', handleShutdown);

export async function connectDB(): Promise<void> {
  const MAX_RETRIES = 5;
  const RETRY_DELAY = 5000; // 5 seconds

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      // Test the connection with a simple query
      await prisma.$queryRaw`SELECT 1`;
      logger.info('Successfully connected to database');
      return;
    } catch (error) {
      logger.error(`Database connection attempt ${attempt} failed:`, error);
      
      if (attempt === MAX_RETRIES) {
        throw new Error('Failed to connect to database after maximum retries');
      }

      // Wait before retrying
      logger.info(`Retrying in ${RETRY_DELAY}ms...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
    }
  }
}

export type { PrismaClient };
export default prisma;
