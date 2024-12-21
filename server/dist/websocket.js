"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupWebSocket = setupWebSocket;
const marketDataGenerator_1 = require("./utils/marketDataGenerator");
const marketDataClients = new Map();
const orderBookClients = new Map();
function setupWebSocket(io) {
    io.on('connection', (socket) => {
        console.log('Client connected:', socket.id);
        socket.on('subscribe_market_data', (symbol) => {
            var _a;
            if (!marketDataClients.has(symbol)) {
                marketDataClients.set(symbol, new Set());
            }
            (_a = marketDataClients.get(symbol)) === null || _a === void 0 ? void 0 : _a.add(socket.id);
            const marketDataInterval = setInterval(() => {
                const marketData = (0, marketDataGenerator_1.generateMarketData)(symbol);
                socket.emit('market_data_update', { symbol, data: marketData });
            }, 1000);
            socket.on('disconnect', () => {
                var _a;
                clearInterval(marketDataInterval);
                (_a = marketDataClients.get(symbol)) === null || _a === void 0 ? void 0 : _a.delete(socket.id);
            });
        });
        socket.on('subscribe_order_book', (symbol) => {
            var _a;
            if (!orderBookClients.has(symbol)) {
                orderBookClients.set(symbol, new Set());
            }
            (_a = orderBookClients.get(symbol)) === null || _a === void 0 ? void 0 : _a.add(socket.id);
            const orderBookInterval = setInterval(() => {
                const orderBook = (0, marketDataGenerator_1.generateOrderBook)(symbol);
                socket.emit('order_book_update', { symbol, data: orderBook });
            }, 1000);
            socket.on('disconnect', () => {
                var _a;
                clearInterval(orderBookInterval);
                (_a = orderBookClients.get(symbol)) === null || _a === void 0 ? void 0 : _a.delete(socket.id);
            });
        });
        socket.on('unsubscribe_market_data', (symbol) => {
            var _a;
            (_a = marketDataClients.get(symbol)) === null || _a === void 0 ? void 0 : _a.delete(socket.id);
        });
        socket.on('unsubscribe_order_book', (symbol) => {
            var _a;
            (_a = orderBookClients.get(symbol)) === null || _a === void 0 ? void 0 : _a.delete(socket.id);
        });
        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
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
//# sourceMappingURL=websocket.js.map