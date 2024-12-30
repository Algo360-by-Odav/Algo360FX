#!/bin/bash
set -e

echo "Installing dependencies..."
npm install --production=false

echo "Installing TypeScript globally..."
npm install -g typescript

echo "Building TypeScript..."
tsc -p tsconfig.json

echo "Copying package files..."
cp package*.json dist/

echo "Installing production dependencies in dist..."
cd dist && npm install --production

echo "Build completed successfully!"
