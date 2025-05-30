import { PrismaClient } from '@prisma/client';

// Initialize Prisma Client
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function main() {
  try {
    // Test User creation
    const testUser = await prisma.user.create({
      data: {
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
      },
    });
    console.log('Created test user:', testUser.id);
    
    // Try to create a MarketData entry
    const marketData = await prisma.marketData.create({
      data: {
        symbol: 'TEST/USD',
        name: 'Test Currency',
        type: 'test',
        price: 100.0,
      },
    });
    console.log('Created market data:', marketData.id);
    
    // Clean up
    await prisma.marketData.delete({ where: { id: marketData.id } });
    await prisma.user.delete({ where: { id: testUser.id } });
    
    console.log('Test completed successfully');
  } catch (error) {
    console.error('Error in test:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
