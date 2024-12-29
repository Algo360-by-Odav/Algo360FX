"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TradingWebSocketServer = void 0;
const uuid_1 = require("uuid");
class TradingWebSocketServer {
    constructor(io) {
        this.clients = new Map();
        this.marketData = new Map();
        this.io = io;
        this.subscribedSymbols = new Set();
        this.updateInterval = setInterval(this.broadcastPrices.bind(this), 1000);
        this.setupSocketServer();
    }
    initialize() {
        this.initializeMarketData();
        console.log('Trading WebSocket Server initialized');
    }
    setupSocketServer() {
        this.io.on('connection', (socket) => {
            const clientId = (0, uuid_1.v4)();
            const client = {
                id: clientId,
                socket,
                subscriptions: new Set()
            };
            this.clients.set(clientId, client);
            console.log(`Client connected: ${clientId}`);
            socket.on('subscribe', (symbol) => {
                client.subscriptions.add(symbol);
                this.subscribedSymbols.add(symbol);
                const data = this.marketData.get(symbol);
                if (data) {
                    socket.emit('marketData', { symbol, data });
                }
            });
            socket.on('unsubscribe', (symbol) => {
                client.subscriptions.delete(symbol);
                this.subscribedSymbols.delete(symbol);
            });
            socket.on('disconnect', () => {
                this.clients.delete(clientId);
                console.log(`Client disconnected: ${clientId}`);
            });
        });
    }
    initializeMarketData() {
        const defaultSymbols = ['EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD'];
        defaultSymbols.forEach(symbol => {
            this.marketData.set(symbol, {
                bid: Math.random() * 2,
                ask: Math.random() * 2 + 0.0002,
                timestamp: Date.now()
            });
        });
    }
    async broadcastPrices() {
        for (const symbol of this.subscribedSymbols) {
            try {
                const data = this.marketData.get(symbol);
                if (data) {
                    this.io.emit('marketData', { symbol, data });
                }
            }
            catch (error) {
                console.error(`Error broadcasting price for ${symbol}:`, error);
            }
        }
    }
    close() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
    }
}
exports.TradingWebSocketServer = TradingWebSocketServer;
exports.default = TradingWebSocketServer;
