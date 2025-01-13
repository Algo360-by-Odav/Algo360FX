# Development Guide

## Development Environment Setup

### Prerequisites

1. Install required software:
   - Node.js (v18 or later)
   - npm (v9 or later)
   - Git
   - VS Code (recommended)
   - Docker (optional)

2. VS Code Extensions:
   - ESLint
   - Prettier
   - TypeScript and JavaScript Language Features
   - Docker
   - Jest Runner

### Project Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/algo360fx.git
cd algo360fx
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment:
```bash
cp .env.example .env.development
```

4. Start development server:
```bash
npm run start
```

## Project Structure

```
algo360fx/
├── src/
│   ├── components/       # React components
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Page components
│   ├── services/        # API services
│   ├── store/           # MobX stores
│   ├── types/           # TypeScript types
│   ├── utils/           # Utility functions
│   └── App.tsx          # Root component
├── server/
│   ├── src/
│   │   ├── controllers/ # Route controllers
│   │   ├── models/      # Database models
│   │   ├── services/    # Business logic
│   │   └── utils/       # Utility functions
│   └── index.ts         # Server entry point
├── docs/                # Documentation
└── tests/               # Test files
```

## Coding Standards

### TypeScript

```typescript
// Use interfaces for object shapes
interface Trade {
  id: string;
  symbol: string;
  side: 'BUY' | 'SELL';
  volume: number;
  price: number;
  timestamp: Date;
}

// Use enums for fixed values
enum OrderType {
  MARKET = 'MARKET',
  LIMIT = 'LIMIT',
  STOP = 'STOP'
}

// Use type guards
function isTrade(obj: any): obj is Trade {
  return (
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.symbol === 'string' &&
    (obj.side === 'BUY' || obj.side === 'SELL') &&
    typeof obj.volume === 'number' &&
    typeof obj.price === 'number' &&
    obj.timestamp instanceof Date
  );
}
```

### React Components

```typescript
// Use functional components with TypeScript
interface Props {
  symbol: string;
  onSelect: (symbol: string) => void;
}

const SymbolSelector: React.FC<Props> = ({ symbol, onSelect }) => {
  return (
    <select value={symbol} onChange={(e) => onSelect(e.target.value)}>
      <option value="EURUSD">EUR/USD</option>
      <option value="GBPUSD">GBP/USD</option>
    </select>
  );
};

// Use hooks for state management
const useSymbol = (initialSymbol: string) => {
  const [symbol, setSymbol] = useState(initialSymbol);
  const [data, setData] = useState<MarketData | null>(null);

  useEffect(() => {
    const subscription = marketService.subscribe(symbol);
    return () => subscription.unsubscribe();
  }, [symbol]);

  return { symbol, setSymbol, data };
};
```

### Error Handling

```typescript
// Use custom error classes
class TradingError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'TradingError';
  }
}

// Use try-catch with proper error handling
async function placeTrade(order: Order) {
  try {
    const result = await tradingService.placeOrder(order);
    return result;
  } catch (error) {
    if (error instanceof TradingError) {
      logger.error('Trading error:', {
        code: error.code,
        message: error.message,
        details: error.details
      });
      throw error;
    }
    throw new TradingError(
      'Unknown error occurred',
      'UNKNOWN_ERROR',
      { originalError: error }
    );
  }
}
```

## Testing

### Unit Tests

```typescript
// Component test
describe('SymbolSelector', () => {
  it('should call onSelect when value changes', () => {
    const onSelect = jest.fn();
    const { getByRole } = render(
      <SymbolSelector symbol="EURUSD" onSelect={onSelect} />
    );

    fireEvent.change(getByRole('combobox'), {
      target: { value: 'GBPUSD' }
    });

    expect(onSelect).toHaveBeenCalledWith('GBPUSD');
  });
});

// Service test
describe('TradingService', () => {
  it('should place market order', async () => {
    const service = new TradingService();
    const order = {
      symbol: 'EURUSD',
      type: OrderType.MARKET,
      side: 'BUY',
      volume: 0.1
    };

    const result = await service.placeOrder(order);
    expect(result).toHaveProperty('id');
    expect(result.status).toBe('FILLED');
  });
});
```

### Integration Tests

```typescript
describe('Trading Flow', () => {
  it('should execute complete trading flow', async () => {
    // Setup
    const user = await createTestUser();
    const token = await loginUser(user);

    // Place order
    const order = await request(app)
      .post('/api/trading/order')
      .set('Authorization', `Bearer ${token}`)
      .send({
        symbol: 'EURUSD',
        type: 'MARKET',
        side: 'BUY',
        volume: 0.1
      });

    expect(order.status).toBe(200);
    expect(order.body).toHaveProperty('id');

    // Check position
    const position = await request(app)
      .get(`/api/trading/positions/${order.body.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(position.status).toBe(200);
    expect(position.body.symbol).toBe('EURUSD');
  });
});
```

## Performance Optimization

### React Performance

1. Use React.memo for component memoization:
```typescript
const PriceDisplay = React.memo(({ price }: { price: number }) => (
  <div>{price.toFixed(5)}</div>
));
```

2. Use useMemo for expensive calculations:
```typescript
const indicators = useMemo(() => {
  return calculateIndicators(prices);
}, [prices]);
```

3. Use useCallback for event handlers:
```typescript
const handleOrderSubmit = useCallback((order: Order) => {
  tradingService.placeOrder(order);
}, []);
```

### Data Management

1. Use WebSocket for real-time data:
```typescript
const useMarketData = (symbol: string) => {
  const [data, setData] = useState<MarketData | null>(null);

  useEffect(() => {
    const ws = new WebSocket(`wss://api.algo360fx.com/ws`);
    
    ws.onmessage = (event) => {
      const update = JSON.parse(event.data);
      setData(update);
    };

    return () => ws.close();
  }, [symbol]);

  return data;
};
```

2. Implement data caching:
```typescript
const cache = new Map<string, MarketData>();

function getCachedData(symbol: string): MarketData | null {
  return cache.get(symbol) || null;
}

function updateCache(symbol: string, data: MarketData): void {
  cache.set(symbol, data);
}
```

## Deployment

### Docker

```dockerfile
# Build stage
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### CI/CD Pipeline

```yaml
name: CI/CD

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run test
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: docker/build-push-action@v2
        with:
          push: true
          tags: algo360fx:latest
```

## Security

1. Use security headers:
```typescript
app.use(helmet());
```

2. Implement rate limiting:
```typescript
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
}));
```

3. Validate input:
```typescript
const validateOrder = (order: unknown): order is Order => {
  return (
    typeof order === 'object' &&
    order !== null &&
    'symbol' in order &&
    'type' in order &&
    'side' in order &&
    'volume' in order
  );
};
```

## Monitoring

1. Use Sentry for error tracking:
```typescript
Sentry.init({
  dsn: "your-sentry-dsn",
  tracesSampleRate: 1.0,
});
```

2. Implement custom metrics:
```typescript
const metrics = {
  orderCount: new Counter({
    name: 'trading_orders_total',
    help: 'Total number of orders'
  }),
  orderLatency: new Histogram({
    name: 'trading_order_latency_seconds',
    help: 'Order execution latency'
  })
};
```
