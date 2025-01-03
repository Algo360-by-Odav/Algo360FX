FROM node:18-slim

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including devDependencies)
RUN npm install

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Clean up dev dependencies
RUN npm prune --production

# Expose the port
EXPOSE 10000

# Start the application
CMD ["npm", "start"]
