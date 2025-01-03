import { prisma } from '../config/database';

async function testConnection() {
  try {
    // Test the connection
    const result = await prisma.$queryRaw`SELECT 1`;
    console.log('Database connection successful:', result);

    // Try to get all users
    const users = await prisma.user.findMany();
    console.log('Users in database:', users.length);

    // Try to get all portfolios
    const portfolios = await prisma.portfolio.findMany();
    console.log('Portfolios in database:', portfolios.length);

  } catch (error) {
    console.error('Database connection failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
