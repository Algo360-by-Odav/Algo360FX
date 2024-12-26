"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TradingWebSocketServer = void 0;
const uuid_1 = require("uuid");
class TradingWebSocketServer {
    constructor(io) {
        this.clients = new Map();
        this.marketData = new Map();
        this.io = io;
        this.setupSocketServer();
        this.initializeMarketData();
        this.startHeartbeat();
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
            socket.emit('connect_ack', { status: 'connected', clientId });
            socket.on('subscribe', (channel) => {
                this.handleSubscribe(client, channel);
            });
            socket.on('unsubscribe', (channel) => {
                this.handleUnsubscribe(client, channel);
            });
            socket.on('message', (data) => {
                this.handleMessage(client, data);
            });
            socket.on('disconnect', () => {
                this.handleDisconnect(client);
            });
        });
    }
    handleSubscribe(client, channel) {
        client.subscriptions.add(channel);
        client.socket.join(channel);
        console.log(`Client ${client.id} subscribed to ${channel}`);
        const data = this.marketData.get(channel);
        if (data) {
            client.socket.emit('market_data', { channel, data });
        }
    }
    handleUnsubscribe(client, channel) {
        client.subscriptions.delete(channel);
        client.socket.leave(channel);
        console.log(`Client ${client.id} unsubscribed from ${channel}`);
    }
    handleMessage(client, message) {
        try {
            if (message.type === 'market_data_request') {
                const data = this.marketData.get(message.symbol);
                if (data) {
                    client.socket.emit('market_data', { symbol: message.symbol, data });
                }
            }
        }
        catch (error) {
            console.error('Error handling message:', error);
            client.socket.emit('error', { message: 'Error processing message' });
        }
    }
    handleDisconnect(client) {
        this.clients.delete(client.id);
        console.log(`Client disconnected: ${client.id}`);
    }
    initializeMarketData() {
        this.marketData.set('EURUSD', {
            bid: 1.0850,
            ask: 1.0852,
            timestamp: Date.now()
        });
        setInterval(() => {
            this.updateMarketData();
        }, 1000);
    }
    updateMarketData() {
        for (const [symbol, data] of this.marketData) {
            const variation = (Math.random() - 0.5) * 0.0010;
            const newBid = parseFloat((data.bid + variation).toFixed(4));
            const newAsk = parseFloat((newBid + 0.0002).toFixed(4));
            const updatedData = {
                bid: newBid,
                ask: newAsk,
                timestamp: Date.now()
            };
            this.marketData.set(symbol, updatedData);
            this.io.to(symbol).emit('market_data', { symbol, data: updatedData });
        }
    }
    startHeartbeat() {
        this.heartbeatInterval = setInterval(() => {
            this.io.emit('heartbeat', { timestamp: Date.now() });
        }, 30000);
    }
    close() {
        clearInterval(this.heartbeatInterval);
        this.io.close();
    }
}
exports.TradingWebSocketServer = TradingWebSocketServer;
exports.default = TradingWebSocketServer;
//# sourceMappingURL=trading.js.map