#!/usr/bin/env bash
# exit on error
set -o errexit

# Install ALL dependencies (including devDependencies)
npm install

# Ensure TypeScript is available
npm install typescript@5.3.3

# Build the project
npm run build

# Clean up dev dependencies
npm prune --production
