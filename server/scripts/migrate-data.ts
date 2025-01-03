import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function migrateData() {
  try {
    // Since we don't have MongoDB connection anymore, we'll just set up the PostgreSQL database
    await prisma.$connect();

    console.log('Connected to PostgreSQL database successfully!');
    console.log('The database is ready to use with your application.');
    console.log('You can now update your application code to use Prisma Client instead of Mongoose.');

  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

migrateData();
