#!/bin/bash

# Ensure we're in the server directory
cd "$(dirname "$0")/.."

# Install dependencies
npm install

# Create prisma directory and copy schema
mkdir -p dist/prisma
echo '
// This is your Prisma schema file

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(uuid())
  email         String    @unique
  password      String
  username      String    @unique
  firstName     String?
  lastName      String?
  emailVerified Boolean   @default(false)
  tokenVersion  Int       @default(0)
  role          Role      @default(USER)
  preferences   Json?     @default("{\"theme\": \"light\"}")
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  trades        Trade[]
  signals       Signal[]
  portfolios    Portfolio[]
}

enum Role {
  USER
  ADMIN
}

model Trade {
  id          String   @id @default(uuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  symbol      String
  type        String
  volume      Float
  openPrice   Float
  closePrice  Float?
  openTime    DateTime
  closeTime   DateTime?
  profit      Float?
  status      String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Signal {
  id          String   @id @default(uuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  symbol      String
  type        String
  openPrice   Float
  closePrice  Float?
  openTime    DateTime
  closeTime   DateTime?
  status      String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Portfolio {
  id          String   @id @default(uuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  name        String
  balance     Float    @default(0)
  currency    String   @default("USD")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Strategy {
  id          String   @id @default(uuid())
  name        String   @unique
  description String?
  config      Json
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Position {
  id          String   @id @default(uuid())
  symbol      String
  type        String
  volume      Float
  openPrice   Float
  closePrice  Float?
  openTime    DateTime
  closeTime   DateTime?
  profit      Float?
  status      String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}' > dist/prisma/schema.prisma

# Generate Prisma client
npx prisma generate

# Build TypeScript
npm run build

# Install production dependencies in dist
cd dist
npm install --production
