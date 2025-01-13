const fs = require('fs');
const path = require('path');

const schema = `generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
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
  trades        Trade[]
  signals       Signal[]
  portfolios    Portfolio[]
}

enum Role {
  USER
  ADMIN
}

model Trade {
  id          String    @id @default(uuid())
  userId      String
  user        User      @relation(fields: [userId], references: [id])
  symbol      String
  type        String
  volume      Float
  openPrice   Float
  closePrice  Float?
  openTime    DateTime
  closeTime   DateTime?
  profit      Float?
  status      String
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model Signal {
  id          String    @id @default(uuid())
  userId      String
  user        User      @relation(fields: [userId], references: [id])
  symbol      String
  type        String
  openPrice   Float
  closePrice  Float?
  openTime    DateTime
  closeTime   DateTime?
  status      String
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model Portfolio {
  id          String    @id @default(uuid())
  userId      String
  user        User      @relation(fields: [userId], references: [id])
  name        String
  balance     Float     @default(0)
  currency    String    @default("USD")
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model Strategy {
  id          String    @id @default(uuid())
  name        String    @unique
  description String?
  config      Json
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
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
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}`;

['prisma', 'dist/prisma'].forEach(dir => {
  const dirPath = path.join(__dirname, '..', dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  fs.writeFileSync(path.join(dirPath, 'schema.prisma'), schema);
});
