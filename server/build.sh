#!/bin/bash
set -e
echo "Installing dependencies..."
npm ci --production=false
echo "Cleaning dist directory..."
rm -rf dist
echo "Building TypeScript..."
npm run build
echo "Copying configuration files..."
cp package.json dist/
cp package-lock.json dist/
echo "Build completed successfully!"
