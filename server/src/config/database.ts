import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

export async function connectDB() {
  try {
    await prisma.$connect();
    console.log('Database connected successfully');

    // Handle process termination
    process.on('beforeExit', async () => {
      await prisma.$disconnect();
    });

  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
}

export { prisma };
