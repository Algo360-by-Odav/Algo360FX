# syntax=docker/dockerfile:1.4

# ---- Base Node ----
FROM node:18-slim AS base
LABEL maintainer="Algo360FX Team"
LABEL description="Algo360FX Trading Server"

# Set working directory
WORKDIR /app

# Add non-root user for security
RUN groupadd -r algo360fx && \
    useradd -r -g algo360fx -s /bin/false algo360fx && \
    chown -R algo360fx:algo360fx /app

# Install system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    openssl=* \
    ca-certificates=* \
    tini=* && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# ---- Dependencies ----
FROM base AS dependencies

# Install node-gyp dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    python3=* \
    make=* \
    g++=* && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copy package files
COPY --chown=algo360fx:algo360fx package*.json ./

# Install ALL dependencies (including devDependencies)
RUN npm ci

# ---- Build ----
FROM dependencies AS builder

# Copy source code
COPY --chown=algo360fx:algo360fx . .

# Generate Prisma Client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# ---- Production ----
FROM base AS production

# Copy package files
COPY --chown=algo360fx:algo360fx package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy built files from builder
COPY --chown=algo360fx:algo360fx --from=builder /app/dist ./dist
COPY --chown=algo360fx:algo360fx --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --chown=algo360fx:algo360fx --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Set environment variables
ENV NODE_ENV=production \
    PORT=10000 \
    TZ=UTC

# Create volume for logs and data
VOLUME ["/app/logs", "/app/data"]

# Expose the port
EXPOSE $PORT

# Switch to non-root user
USER algo360fx

# Use tini as init system
ENTRYPOINT ["/usr/bin/tini", "--"]

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD node dist/healthcheck.js || exit 1

# Start the application
CMD ["node", "dist/index.js"]

# Build-time metadata
ARG BUILD_DATE
ARG VCS_REF
ARG VERSION

# Labels
LABEL org.label-schema.build-date=$BUILD_DATE \
    org.label-schema.name="Algo360FX Trading Server" \
    org.label-schema.description="Advanced trading server for algorithmic trading" \
    org.label-schema.url="https://algo360fx.com" \
    org.label-schema.vcs-ref=$VCS_REF \
    org.label-schema.vcs-url="https://github.com/yourusername/algo360fx" \
    org.label-schema.vendor="Algo360FX" \
    org.label-schema.version=$VERSION \
    org.label-schema.schema-version="1.0" \
    org.opencontainers.image.source="https://github.com/yourusername/algo360fx"
