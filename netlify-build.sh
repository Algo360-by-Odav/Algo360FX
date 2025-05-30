#!/bin/bash

# Fix the TypeScript error in advancedTradingPageJs.js
echo "Fixing TypeScript errors..."
sed -i 's/};/},/g' client/src/pages/advancedTradingPageJs.js

# Run the build command
echo "Running build..."
npm run build
