import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

export async function connectDB() {
  try {
    const MAX_RETRIES = 5;
    const RETRY_DELAY = 5000; // 5 seconds
    let retries = 0;

    while (retries < MAX_RETRIES) {
      try {
        await prisma.$connect();
        console.log('Database connected successfully');

        // Handle process termination
        process.on('beforeExit', async () => {
          await prisma.$disconnect();
        });

        // Connection successful, exit the retry loop
        return;
      } catch (error) {
        retries++;
        console.error(`Database connection attempt ${retries} failed:`, error);
        
        if (retries === MAX_RETRIES) {
          throw error;
        }

        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      }
    }
  } catch (error) {
    console.error('Database connection error after all retries:', error);
    console.error('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not Set');
    process.exit(1);
  }
}

export { prisma };
