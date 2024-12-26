#!/bin/bash

# Exit on error
set -e

echo "Starting deployment process..."

# Install dependencies
echo "Installing dependencies..."
npm ci --production=false

# Run database migrations
echo "Running database migrations..."
npx prisma generate
npx prisma migrate deploy

# Build the application
echo "Building the application..."
npm run build

# Start the application
echo "Starting the application..."
npm run start:prod
