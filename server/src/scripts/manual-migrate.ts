import { prisma } from '../config/database';

async function manualMigrate() {
  try {
    console.log('Testing database connection...');
    await prisma.$queryRaw`SELECT 1`;
    console.log('Database connection successful');

    // Create Role enum
    console.log('Creating Role enum...');
    await prisma.$executeRaw`
      DO $$ BEGIN
        CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `;

    // Create User table
    console.log('Creating User table...');
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "User" (
        "id" TEXT NOT NULL,
        "email" TEXT NOT NULL UNIQUE,
        "password" TEXT NOT NULL,
        "username" TEXT NOT NULL UNIQUE,
        "firstName" TEXT,
        "lastName" TEXT,
        "emailVerified" BOOLEAN NOT NULL DEFAULT false,
        "tokenVersion" INTEGER NOT NULL DEFAULT 0,
        "role" "Role" NOT NULL DEFAULT 'USER',
        "preferences" JSONB DEFAULT '{"theme": "light"}',
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP NOT NULL,
        CONSTRAINT "User_pkey" PRIMARY KEY ("id")
      );
    `;

    // Create Portfolio table
    console.log('Creating Portfolio table...');
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "Portfolio" (
        "id" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "description" TEXT,
        "isPublic" BOOLEAN NOT NULL DEFAULT false,
        "config" JSONB,
        "balance" FLOAT NOT NULL DEFAULT 0,
        "currency" TEXT NOT NULL DEFAULT 'USD',
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP NOT NULL,
        CONSTRAINT "Portfolio_pkey" PRIMARY KEY ("id")
      );
    `;

    // Create Position table
    console.log('Creating Position table...');
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "Position" (
        "id" TEXT NOT NULL,
        "portfolioId" TEXT,
        "symbol" TEXT NOT NULL,
        "type" TEXT NOT NULL,
        "size" FLOAT NOT NULL,
        "entryPrice" FLOAT NOT NULL,
        "exitPrice" FLOAT,
        "status" TEXT NOT NULL DEFAULT 'OPEN',
        "metadata" JSONB,
        "openTime" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "closeTime" TIMESTAMP,
        "profit" FLOAT,
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP NOT NULL,
        CONSTRAINT "Position_pkey" PRIMARY KEY ("id")
      );
    `;

    // Add foreign key constraints
    console.log('Adding foreign key constraints...');
    await prisma.$executeRaw`
      ALTER TABLE "Portfolio" 
      ADD CONSTRAINT "Portfolio_userId_fkey" 
      FOREIGN KEY ("userId") 
      REFERENCES "User"("id") 
      ON DELETE CASCADE ON UPDATE CASCADE;
    `;

    await prisma.$executeRaw`
      ALTER TABLE "Position" 
      ADD CONSTRAINT "Position_portfolioId_fkey" 
      FOREIGN KEY ("portfolioId") 
      REFERENCES "Portfolio"("id") 
      ON DELETE CASCADE ON UPDATE CASCADE;
    `;

    console.log('Migration successful');

    // Verify the changes
    console.log('Verifying changes...');
    const portfolioColumns = await prisma.$queryRaw`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'Portfolio';
    `;
    console.log('Portfolio columns:', portfolioColumns);

    const positionColumns = await prisma.$queryRaw`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'Position';
    `;
    console.log('Position columns:', positionColumns);

  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

manualMigrate();
