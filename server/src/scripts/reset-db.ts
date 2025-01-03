import { prisma } from '../config/database';

async function resetDatabase() {
  try {
    // Drop all tables
    await prisma.$executeRaw`DROP SCHEMA public CASCADE;`;
    await prisma.$executeRaw`CREATE SCHEMA public;`;
    
    console.log('Database reset successful');
  } catch (error) {
    console.error('Failed to reset database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetDatabase();
