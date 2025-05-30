import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkClient() {
  console.log('Available Prisma Client Methods:');
  // Get all methods on the prisma client
  console.log(Object.keys(prisma));
  
  console.log('\nDetailed structure:');
  for (const key of Object.keys(prisma)) {
    if (typeof prisma[key] === 'object' && prisma[key] !== null) {
      console.log(`${key}:`, Object.keys(prisma[key]));
    }
  }
  
  await prisma.$disconnect();
}

checkClient().catch(console.error);
