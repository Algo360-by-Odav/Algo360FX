# API Documentation

## Overview

The Algo360FX API provides programmatic access to trading functionality, market data, and account management features.

## Authentication

All API requests require authentication using JWT (JSON Web Tokens).

### Obtaining a Token

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "your-password"
}
```

### Using the Token

Include the token in the Authorization header:

```http
Authorization: Bearer your-jwt-token
```

## Endpoints

### Market Data

#### Get Market Prices
```http
GET /api/market/prices
Query Parameters:
  - symbol (required): Trading pair (e.g., "EURUSD")
  - timeframe: Candle timeframe (default: "1m")
  - limit: Number of candles (default: 1000)
```

#### Subscribe to Real-time Updates
```websocket
WS /ws/market
Message Format:
{
  "type": "subscribe",
  "symbols": ["EURUSD", "GBPUSD"],
  "channels": ["price", "depth"]
}
```

### Trading

#### Place Order
```http
POST /api/trading/order
Content-Type: application/json

{
  "symbol": "EURUSD",
  "type": "MARKET",
  "side": "BUY",
  "volume": 0.1,
  "stopLoss": 1.0500,
  "takeProfit": 1.0600
}
```

#### Get Orders
```http
GET /api/trading/orders
Query Parameters:
  - status: Order status (OPEN, CLOSED, CANCELLED)
  - from: Start timestamp
  - to: End timestamp
```

### Account Management

#### Get Account Info
```http
GET /api/account
```

#### Get Trading History
```http
GET /api/account/history
Query Parameters:
  - from: Start timestamp
  - to: End timestamp
  - type: Transaction type (TRADE, DEPOSIT, WITHDRAWAL)
```

## Rate Limits

- Authentication: 5 requests per minute
- Market Data: 60 requests per minute
- Trading: 120 requests per minute
- Account: 30 requests per minute

## Error Handling

All errors follow this format:
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": {}
  }
}
```

Common error codes:
- `AUTH_REQUIRED`: Authentication required
- `INVALID_CREDENTIALS`: Invalid login credentials
- `INSUFFICIENT_FUNDS`: Insufficient funds for operation
- `INVALID_ORDER`: Invalid order parameters
- `RATE_LIMIT`: Rate limit exceeded

## WebSocket API

### Connection

```javascript
const ws = new WebSocket('wss://api.algo360fx.com/ws');
```

### Message Format

```javascript
// Subscribe to market data
{
  "type": "subscribe",
  "channel": "market",
  "symbols": ["EURUSD"]
}

// Market data update
{
  "type": "update",
  "channel": "market",
  "symbol": "EURUSD",
  "data": {
    "bid": 1.0550,
    "ask": 1.0551,
    "timestamp": 1625097600000
  }
}
```

## SDK Examples

### JavaScript/TypeScript
```typescript
import { Algo360FX } from '@algo360fx/sdk';

const client = new Algo360FX({
  apiKey: 'your-api-key',
  environment: 'production'
});

// Place market order
await client.trading.placeOrder({
  symbol: 'EURUSD',
  type: 'MARKET',
  side: 'BUY',
  volume: 0.1
});

// Subscribe to price updates
client.market.onPriceUpdate('EURUSD', (price) => {
  console.log('New price:', price);
});
```
