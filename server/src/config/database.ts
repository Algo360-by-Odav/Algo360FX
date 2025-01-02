import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export async function connectToDatabase() {
  try {
    await prisma.$connect();
    console.log('Connected to database successfully');
    return prisma;
  } catch (error: any) {
    console.error('Database connection error:', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    throw error;
  }
}

export async function disconnectFromDatabase() {
  try {
    await prisma.$disconnect();
    console.log('Disconnected from database successfully');
  } catch (error: any) {
    console.error('Database disconnection error:', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    throw error;
  }
}

process.on('beforeExit', async () => {
  await disconnectFromDatabase();
});

export default prisma;
