import { Server, Socket } from 'socket.io';
import { generateMarketData, generateOrderBook } from './utils/marketDataGenerator';

// Store connected clients and their subscriptions
const marketDataClients = new Map<string, Set<string>>();
const orderBookClients = new Map<string, Set<string>>();

export function setupWebSocket(io: Server): void {
  io.on('connection', (socket: Socket) => {
    console.log('Client connected:', socket.id);

    // Handle market data subscriptions
    socket.on('subscribe_market_data', (symbol: string) => {
      if (!marketDataClients.has(symbol)) {
        marketDataClients.set(symbol, new Set());
      }
      marketDataClients.get(symbol)?.add(socket.id);

      // Start sending market data updates
      const marketDataInterval = setInterval(() => {
        const marketData = generateMarketData(symbol);
        socket.emit('market_data_update', { symbol, data: marketData });
      }, 1000);

      socket.on('disconnect', () => {
        clearInterval(marketDataInterval);
        marketDataClients.get(symbol)?.delete(socket.id);
      });
    });

    // Handle order book subscriptions
    socket.on('subscribe_order_book', (symbol: string) => {
      if (!orderBookClients.has(symbol)) {
        orderBookClients.set(symbol, new Set());
      }
      orderBookClients.get(symbol)?.add(socket.id);

      // Start sending order book updates
      const orderBookInterval = setInterval(() => {
        const orderBook = generateOrderBook(symbol);
        socket.emit('order_book_update', { symbol, data: orderBook });
      }, 1000);

      socket.on('disconnect', () => {
        clearInterval(orderBookInterval);
        orderBookClients.get(symbol)?.delete(socket.id);
      });
    });

    // Handle unsubscribe events
    socket.on('unsubscribe_market_data', (symbol: string) => {
      marketDataClients.get(symbol)?.delete(socket.id);
    });

    socket.on('unsubscribe_order_book', (symbol: string) => {
      orderBookClients.get(symbol)?.delete(socket.id);
    });

    // Clean up on disconnect
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
      // Clean up all subscriptions
      for (const [symbol, clients] of marketDataClients.entries()) {
        clients.delete(socket.id);
        if (clients.size === 0) {
          marketDataClients.delete(symbol);
        }
      }
      for (const [symbol, clients] of orderBookClients.entries()) {
        clients.delete(socket.id);
        if (clients.size === 0) {
          orderBookClients.delete(symbol);
        }
      }
    });
  });
}
