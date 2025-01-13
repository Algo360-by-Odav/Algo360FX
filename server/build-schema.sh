#!/bin/bash

# Set strict error handling
set -euo pipefail
IFS=$'\n\t'

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored messages
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if a command exists
check_command() {
    if ! command -v "$1" &> /dev/null; then
        log_error "$1 is required but not installed."
        exit 1
    fi
}

# Check required commands
check_command "npx"
check_command "node"

# Function to clean up on error
cleanup() {
    if [ $? -ne 0 ]; then
        log_error "An error occurred during schema build!"
        # Cleanup any temporary files if needed
        if [ -d "dist/prisma" ]; then
            rm -rf "dist/prisma"
        fi
    fi
}

# Register cleanup function
trap cleanup EXIT

# Create dist directory if it doesn't exist
log_info "Creating dist directory..."
mkdir -p dist/prisma

# Function to validate environment
validate_env() {
    if [ ! -f ".env" ]; then
        log_warn "No .env file found. Using default environment variables."
    fi

    # Check DATABASE_URL
    if [ -f ".env" ] && ! grep -q "DATABASE_URL=" .env; then
        log_error "DATABASE_URL is not set in .env file"
        exit 1
    fi
}

# Validate environment
validate_env

# Generate Prisma schema
log_info "Generating Prisma schema..."
cat > dist/prisma/schema.prisma << 'EOL'
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
  // Enable Edge runtime compatibility
  previewFeatures = ["referentialIntegrity"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  // Enable referential integrity on the database level
  referentialIntegrity = "prisma"
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
  
  @@index([email])
  @@index([username])
}

enum Role {
  USER
  ADMIN
}

model Trade {
  id          String   @id @default(uuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
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
  
  @@index([userId])
  @@index([symbol])
  @@index([status])
}

model Signal {
  id          String   @id @default(uuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  symbol      String
  type        String
  openPrice   Float
  closePrice  Float?
  openTime    DateTime
  closeTime   DateTime?
  status      String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([userId])
  @@index([symbol])
  @@index([status])
}

model Portfolio {
  id          String   @id @default(uuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  name        String
  balance     Float    @default(0)
  currency    String   @default("USD")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([userId])
}

model Strategy {
  id          String   @id @default(uuid())
  name        String   @unique
  description String?
  config      Json
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([name])
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
  
  @@index([symbol])
  @@index([status])
}
EOL

log_info "Schema file created successfully"

# Validate the schema
log_info "Validating schema..."
if ! npx prisma format --schema=dist/prisma/schema.prisma; then
    log_error "Schema validation failed!"
    exit 1
fi

# Generate Prisma Client
log_info "Generating Prisma Client..."
if ! npx prisma generate --schema=dist/prisma/schema.prisma; then
    log_error "Failed to generate Prisma Client!"
    exit 1
fi

# Check if we need to run migrations
if [ "${1:-}" = "--migrate" ]; then
    log_info "Running database migrations..."
    if ! npx prisma migrate dev --schema=dist/prisma/schema.prisma --name init; then
        log_error "Migration failed!"
        exit 1
    fi
fi

log_info "Schema build completed successfully!"

# Optional: Display next steps
cat << EOF

${GREEN}Next steps:${NC}
1. Review the generated schema in dist/prisma/schema.prisma
2. Run 'npx prisma studio' to view and edit your data
3. Run 'npx prisma migrate dev' to create a new migration
4. Run 'npx prisma db push' to push schema changes without migrations

For more information, visit: https://pris.ly/d/getting-started
EOF
