#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const chalk = require('chalk');

// Utility functions for logging
const log = {
  info: (msg) => console.log(chalk.blue('INFO: ') + msg),
  success: (msg) => console.log(chalk.green('SUCCESS: ') + msg),
  warn: (msg) => console.log(chalk.yellow('WARNING: ') + msg),
  error: (msg) => console.error(chalk.red('ERROR: ') + msg)
};

// Schema configuration
const schemaConfig = {
  generator: {
    name: 'client',
    provider: 'prisma-client-js',
    previewFeatures: ['referentialIntegrity', 'fullTextSearch', 'extendedIndexes'],
    engineType: 'binary'
  },
  datasource: {
    provider: 'postgresql',
    url: 'env("DATABASE_URL")',
    shadowDatabaseUrl: 'env("SHADOW_DATABASE_URL")',
    referentialIntegrity: 'prisma'
  }
};

// Schema models
const schema = `// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider        = "${schemaConfig.generator.provider}"
  previewFeatures = ${JSON.stringify(schemaConfig.generator.previewFeatures)}
  engineType      = "${schemaConfig.generator.engineType}"
}

datasource db {
  provider = "${schemaConfig.datasource.provider}"
  url      = ${schemaConfig.datasource.url}
  shadowDatabaseUrl = ${schemaConfig.datasource.shadowDatabaseUrl}
  referentialIntegrity = "${schemaConfig.datasource.referentialIntegrity}"
}

model User {
  id            String      @id @default(uuid())
  email         String      @unique
  password      String
  username      String      @unique
  firstName     String?
  lastName      String?
  emailVerified Boolean     @default(false)
  tokenVersion  Int         @default(0)
  role          Role        @default(USER)
  preferences   Json?       @default("{\"theme\": \"light\"}")
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  lastLoginAt   DateTime?
  trades        Trade[]
  signals       Signal[]
  portfolios    Portfolio[]
  
  @@index([email])
  @@index([username])
  @@index([role])
  @@map("users")
}

enum Role {
  USER
  ADMIN
}

model Trade {
  id          String    @id @default(uuid())
  userId      String
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  symbol      String
  type        String
  volume      Float
  openPrice   Float
  closePrice  Float?
  openTime    DateTime
  closeTime   DateTime?
  profit      Float?
  status      String
  metadata    Json?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  @@index([userId])
  @@index([symbol])
  @@index([status])
  @@index([openTime])
  @@map("trades")
}

model Signal {
  id          String    @id @default(uuid())
  userId      String
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  symbol      String
  type        String
  openPrice   Float
  closePrice  Float?
  openTime    DateTime
  closeTime   DateTime?
  status      String
  confidence  Float     @default(0)
  metadata    Json?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  @@index([userId])
  @@index([symbol])
  @@index([status])
  @@index([openTime])
  @@map("signals")
}

model Portfolio {
  id          String    @id @default(uuid())
  userId      String
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  name        String
  balance     Float     @default(0)
  currency    String    @default("USD")
  isActive    Boolean   @default(true)
  metadata    Json?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  @@index([userId])
  @@index([currency])
  @@index([isActive])
  @@map("portfolios")
}

model Strategy {
  id          String    @id @default(uuid())
  name        String    @unique
  description String?
  config      Json
  isActive    Boolean   @default(true)
  metadata    Json?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  @@index([name])
  @@index([isActive])
  @@map("strategies")
}

model Position {
  id          String    @id @default(uuid())
  symbol      String
  type        String
  volume      Float
  openPrice   Float
  closePrice  Float?
  openTime    DateTime
  closeTime   DateTime?
  profit      Float?
  status      String
  metadata    Json?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  @@index([symbol])
  @@index([status])
  @@index([openTime])
  @@map("positions")
}`;

// Function to validate schema syntax
async function validateSchema(schemaPath) {
  try {
    execSync('npx prisma format --schema=' + schemaPath, { stdio: 'inherit' });
    return true;
  } catch (error) {
    log.error('Schema validation failed:');
    log.error(error.message);
    return false;
  }
}

// Function to create directory if it doesn't exist
function ensureDirectoryExists(dirPath) {
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      log.success(`Created directory: ${dirPath}`);
    }
  } catch (error) {
    log.error(`Failed to create directory ${dirPath}:`);
    log.error(error.message);
    throw error;
  }
}

// Function to write schema to file
function writeSchemaToFile(location) {
  try {
    fs.writeFileSync(location, schema);
    log.success(`Schema written to ${location}`);
    return true;
  } catch (error) {
    log.error(`Failed to write schema to ${location}:`);
    log.error(error.message);
    return false;
  }
}

// Main execution
async function main() {
  try {
    // Install required dependencies if not present
    if (!fs.existsSync(path.join(__dirname, 'node_modules', 'chalk'))) {
      log.info('Installing required dependencies...');
      execSync('npm install chalk@4.1.2 --no-save', { stdio: 'inherit' });
    }

    // Define schema locations
    const locations = [
      path.join(__dirname, 'prisma', 'schema.prisma'),
      path.join(__dirname, 'dist', 'prisma', 'schema.prisma')
    ];

    // Create directories
    locations.forEach(location => {
      ensureDirectoryExists(path.dirname(location));
    });

    // Write schema to all locations
    const writeResults = locations.map(location => writeSchemaToFile(location));

    if (writeResults.some(result => !result)) {
      throw new Error('Failed to write schema to one or more locations');
    }

    // Validate schema
    log.info('Validating schema...');
    const isValid = await validateSchema(locations[0]);

    if (!isValid) {
      throw new Error('Schema validation failed');
    }

    log.success('Schema creation completed successfully!');
    
    // Display next steps
    console.log(chalk.cyan('\nNext steps:'));
    console.log('1. Review the schema in prisma/schema.prisma');
    console.log('2. Run npx prisma generate to update the Prisma Client');
    console.log('3. Run npx prisma db push to update your database schema');
    console.log('4. Run npx prisma studio to view and edit your data\n');

  } catch (error) {
    log.error('Schema creation failed:');
    log.error(error.message);
    process.exit(1);
  }
}

// Execute main function
main().catch(error => {
  log.error('Unexpected error:');
  log.error(error.message);
  process.exit(1);
});
