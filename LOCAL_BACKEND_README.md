# Algo360FX Local Backend Setup

This guide provides instructions for setting up and running the local backend for the Algo360FX application.

## Prerequisites

- Node.js (v18.18.2 or higher)
- Docker and Docker Compose
- npm (v9.8.1 or higher)

## Setup Instructions

### 1. Start Docker Containers

The local backend requires PostgreSQL and Redis services, which are configured in the `docker-compose.yml` file. Start these services with:

```bash
docker-compose up -d
```

This will start the following containers:
- PostgreSQL database on port 5432
- Redis server on port 6379

### 2. Set Up the API Server

Run the setup script to install dependencies, generate the Prisma client, and run migrations:

```bash
npm run setup:backend
```

### 3. Start the Local Backend

Start the local backend server with:

```bash
npm run start:backend
```

The API server will be available at:
- API: http://localhost:8080
- API Documentation: http://localhost:8080/docs

### 4. Run Both Frontend and Backend

To run both the frontend and backend simultaneously:

```bash
npm run dev:all
```

## Available Endpoints

### Mock Data Endpoints

The local backend provides mock data endpoints for development:

- `GET /mock/market-data` - Get mock market data for forex, stocks, crypto, and indices
- `GET /mock/trading-strategies` - Get mock trading strategies
- `GET /mock/subscription-plans` - Get mock subscription plans
- `GET /mock/marketplace` - Get mock marketplace items (ebooks, courses)

### WebSocket Endpoints

Real-time market data is available through WebSocket:

- Namespace: `/trading`
- Events:
  - `subscribe` - Subscribe to market data for specific symbols
  - `unsubscribe` - Unsubscribe from market data
  - `marketData` - Receive real-time market data updates

## Frontend Integration

The frontend has been configured to connect to the local backend:

1. API requests will be sent to `http://localhost:8080`
2. WebSocket connections will be established to `http://localhost:8080/trading`

### Services

The following services have been added to the frontend:

- `mockDataService.ts` - Service for fetching mock data from the backend
- `tradingSocketService.ts` - Service for real-time market data via WebSocket

## Troubleshooting

### Database Connection Issues

If you encounter database connection issues, check that:
- Docker containers are running (`docker ps`)
- Database connection string in `.env` is correct
- Prisma migrations have been applied

### API Server Issues

If the API server fails to start:
- Check the console for error messages
- Verify that all dependencies are installed
- Ensure the required ports (8080) are not in use

### WebSocket Connection Issues

If WebSocket connections fail:
- Verify the API server is running
- Check browser console for connection errors
- Ensure CORS is properly configured
