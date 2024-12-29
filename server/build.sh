#!/bin/bash

# Exit on error
set -e

# Install dependencies
echo "Installing dependencies..."
npm ci --production=false

# Clean dist directory
echo "Cleaning dist directory..."
rm -rf dist

# Run TypeScript build
echo "Building TypeScript..."
npm run build

# Copy necessary files
echo "Copying configuration files..."
cp package.json dist/
cp package-lock.json dist/

echo "Build completed successfully!"
