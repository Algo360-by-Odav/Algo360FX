#!/bin/bash

# Build the application
npm run build

# Create a temporary directory for deployment
mkdir -p .deploy

# Copy necessary files
cp -r dist/ .deploy/
cp package.json .deploy/
cp package-lock.json .deploy/
cp Procfile .deploy/
cp prisma/schema.prisma .deploy/

# Create deployment package
cd .deploy
zip -r ../dist.zip ./*
cd ..

# Clean up
rm -rf .deploy

# Deploy to Elastic Beanstalk
eb deploy
