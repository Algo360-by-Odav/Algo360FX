# Build stage
FROM node:18-alpine as builder

WORKDIR /app

# Copy package files from server directory
COPY server/package*.json ./

# Install dependencies
RUN npm ci

# Copy source code from server directory
COPY server/ .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY server/package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/.env ./.env

# Expose the port your app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
