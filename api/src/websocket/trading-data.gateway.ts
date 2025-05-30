import { 
  WebSocketGateway, 
  WebSocketServer, 
  OnGatewayInit, 
  OnGatewayConnection, 
  OnGatewayDisconnect,
  SubscribeMessage
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { ConfigService } from '@nestjs/config';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'trading',
})
export class TradingDataGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger = new Logger('TradingDataGateway');
  private marketDataInterval: NodeJS.Timeout;
  private connectedClients = 0;

  constructor(private configService: ConfigService) {}

  afterInit() {
    this.logger.log('Trading Data WebSocket Gateway initialized');
    // Start sending market data updates when the gateway initializes
    this.startMarketDataUpdates();
  }

  handleConnection(client: Socket) {
    this.connectedClients++;
    this.logger.log(`Client connected: ${client.id}, Total clients: ${this.connectedClients}`);
  }

  handleDisconnect(client: Socket) {
    this.connectedClients--;
    this.logger.log(`Client disconnected: ${client.id}, Total clients: ${this.connectedClients}`);
    
    // If no clients are connected, clear the interval to save resources
    if (this.connectedClients === 0 && this.marketDataInterval) {
      clearInterval(this.marketDataInterval);
      this.marketDataInterval = null;
      this.logger.log('Market data updates paused due to no connected clients');
    }
  }

  @SubscribeMessage('subscribe')
  handleSubscribe(client: Socket, payload: { symbols: string[] }) {
    const { symbols } = payload;
    this.logger.log(`Client ${client.id} subscribed to symbols: ${symbols.join(', ')}`);
    
    // Join rooms for each symbol
    symbols.forEach(symbol => {
      client.join(symbol);
    });
    
    // Send initial data for subscribed symbols
    symbols.forEach(symbol => {
      const initialData = this.generateMarketData(symbol);
      client.emit('marketData', { symbol, data: initialData });
    });
    
    return { event: 'subscribe', data: { success: true, symbols } };
  }

  @SubscribeMessage('unsubscribe')
  handleUnsubscribe(client: Socket, payload: { symbols: string[] }) {
    const { symbols } = payload;
    this.logger.log(`Client ${client.id} unsubscribed from symbols: ${symbols.join(', ')}`);
    
    // Leave rooms for each symbol
    symbols.forEach(symbol => {
      client.leave(symbol);
    });
    
    return { event: 'unsubscribe', data: { success: true, symbols } };
  }

  private startMarketDataUpdates() {
    if (this.marketDataInterval) {
      clearInterval(this.marketDataInterval);
    }
    
    // Update market data every second
    this.marketDataInterval = setInterval(() => {
      if (this.connectedClients > 0) {
        this.sendMarketDataUpdates();
      }
    }, 1000);
    
    this.logger.log('Started sending market data updates');
  }

  private sendMarketDataUpdates() {
    // List of common trading symbols
    const symbols = [
      'EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'USD/CAD', // Forex
      'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', // Stocks
      'BTC/USD', 'ETH/USD', 'XRP/USD', 'SOL/USD', 'ADA/USD', // Crypto
      'SPX', 'DJI', 'IXIC', 'RUT', 'VIX' // Indices
    ];
    
    // Generate and send updates for each symbol
    symbols.forEach(symbol => {
      const marketData = this.generateMarketData(symbol);
      this.server.to(symbol).emit('marketData', { symbol, data: marketData });
    });
  }

  private generateMarketData(symbol: string) {
    // Base values for different asset classes
    const baseValues = {
      'EUR/USD': 1.09,
      'GBP/USD': 1.26,
      'USD/JPY': 109.2,
      'AUD/USD': 0.71,
      'USD/CAD': 1.32,
      'AAPL': 172.5,
      'MSFT': 342.9,
      'GOOGL': 131.8,
      'AMZN': 178.3,
      'TSLA': 245.7,
      'BTC/USD': 43250,
      'ETH/USD': 2345,
      'XRP/USD': 0.54,
      'SOL/USD': 123.4,
      'ADA/USD': 0.43,
      'SPX': 4567,
      'DJI': 34567,
      'IXIC': 14567,
      'RUT': 2345,
      'VIX': 18.7,
    };
    
    // Get the base value for the symbol or use a default
    const baseValue = baseValues[symbol] || 100;
    
    // Generate a random price change (more volatile for crypto, less for forex)
    let volatilityFactor = 0.0005; // Default for forex
    
    if (symbol.includes('/USD') && !symbol.startsWith('USD')) {
      volatilityFactor = 0.005; // Crypto
    } else if (['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA'].includes(symbol)) {
      volatilityFactor = 0.002; // Stocks
    } else if (['SPX', 'DJI', 'IXIC', 'RUT', 'VIX'].includes(symbol)) {
      volatilityFactor = 0.001; // Indices
    }
    
    const randomChange = (Math.random() - 0.5) * 2 * baseValue * volatilityFactor;
    const price = baseValue + randomChange;
    
    // Calculate bid and ask with a small spread
    const spread = baseValue * 0.0002;
    const bid = price - spread / 2;
    const ask = price + spread / 2;
    
    // Generate random volume
    const volume = Math.floor(Math.random() * 1000000) + 100000;
    
    // Generate timestamp
    const timestamp = new Date().toISOString();
    
    return {
      bid: parseFloat(bid.toFixed(4)),
      ask: parseFloat(ask.toFixed(4)),
      price: parseFloat(price.toFixed(4)),
      change: parseFloat(randomChange.toFixed(4)),
      changePercent: parseFloat((randomChange / baseValue * 100).toFixed(2)),
      volume,
      timestamp,
    };
  }
}
