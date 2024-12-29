"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupWebSocket = setupWebSocket;
const marketDataGenerator_1 = require("./utils/marketDataGenerator");
// Store connected clients and their subscriptions
const marketDataClients = new Map();
const orderBookClients = new Map();
function setupWebSocket(io) {
    io.on('connection', (socket) => {
        console.log('Client connected:', socket.id);
        // Handle market data subscriptions
        socket.on('subscribe_market_data', (symbol) => {
            if (!marketDataClients.has(symbol)) {
                marketDataClients.set(symbol, new Set());
            }
            marketDataClients.get(symbol)?.add(socket.id);
            // Start sending market data updates
            const marketDataInterval = setInterval(() => {
                const marketData = (0, marketDataGenerator_1.generateMarketData)(symbol);
                socket.emit('market_data_update', { symbol, data: marketData });
            }, 1000);
            socket.on('disconnect', () => {
                clearInterval(marketDataInterval);
                marketDataClients.get(symbol)?.delete(socket.id);
            });
        });
        // Handle order book subscriptions
        socket.on('subscribe_order_book', (symbol) => {
            if (!orderBookClients.has(symbol)) {
                orderBookClients.set(symbol, new Set());
            }
            orderBookClients.get(symbol)?.add(socket.id);
            // Start sending order book updates
            const orderBookInterval = setInterval(() => {
                const orderBook = (0, marketDataGenerator_1.generateOrderBook)(symbol);
                socket.emit('order_book_update', { symbol, data: orderBook });
            }, 1000);
            socket.on('disconnect', () => {
                clearInterval(orderBookInterval);
                orderBookClients.get(symbol)?.delete(socket.id);
            });
        });
        // Handle unsubscribe events
        socket.on('unsubscribe_market_data', (symbol) => {
            marketDataClients.get(symbol)?.delete(socket.id);
        });
        socket.on('unsubscribe_order_book', (symbol) => {
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
