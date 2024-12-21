"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TradingWebSocketServer = void 0;
const ws_1 = require("ws");
const uuid_1 = require("uuid");
class TradingWebSocketServer {
    constructor(server) {
        this.clients = new Map();
        this.marketData = new Map();
        this.wss = new ws_1.WebSocketServer({
            server,
            path: '/',
            clientTracking: true
        });
        this.setupWebSocketServer();
        this.initializeMarketData();
        this.startHeartbeat();
    }
    setupWebSocketServer() {
        this.wss.on('connection', (ws) => {
            const clientId = (0, uuid_1.v4)();
            const client = {
                id: clientId,
                ws,
                subscriptions: new Set()
            };
            this.clients.set(clientId, client);
            console.log(`Client connected: ${clientId}`);
            this.sendMessage(ws, 'connect', { status: 'connected', clientId });
            ws.on('message', (message) => {
                try {
                    const data = JSON.parse(message.toString());
                    this.handleMessage(client, data);
                }
                catch (error) {
                    console.error('Error parsing message:', error);
                    this.sendError(ws, 'Invalid message format');
                }
            });
            ws.on('close', () => {
                console.log(`Client disconnected: ${clientId}`);
                this.clients.delete(clientId);
            });
            ws.on('error', (error) => {
                console.error(`WebSocket error for client ${clientId}:`, error);
                this.clients.delete(clientId);
            });
        });
    }
    initializeMarketData() {
        const symbols = ['EURUSD', 'GBPUSD', 'USDJPY', 'BTCUSD'];
        symbols.forEach(symbol => {
            this.marketData.set(symbol, {
                symbol,
                bid: this.randomPrice(1.0, 1.2),
                ask: this.randomPrice(1.0, 1.2),
                timestamp: new Date().toISOString()
            });
        });
        setInterval(() => {
            this.updateMarketData();
        }, 1000);
    }
    updateMarketData() {
        this.marketData.forEach((data, symbol) => {
            const change = (Math.random() - 0.5) * 0.0010;
            const bid = Number((data.bid + change).toFixed(5));
            const ask = Number((bid + 0.0002).toFixed(5));
            const updatedData = {
                symbol,
                bid,
                ask,
                timestamp: new Date().toISOString()
            };
            this.marketData.set(symbol, updatedData);
            this.clients.forEach(client => {
                if (client.subscriptions.has(symbol)) {
                    this.sendMessage(client.ws, 'market_data', updatedData);
                }
            });
        });
    }
    startHeartbeat() {
        this.heartbeatInterval = setInterval(() => {
            this.clients.forEach((client, clientId) => {
                if (client.ws.readyState === ws_1.WebSocket.OPEN) {
                    this.sendMessage(client.ws, 'heartbeat', { timestamp: Date.now() });
                }
                else {
                    console.log(`Removing inactive client: ${clientId}`);
                    this.clients.delete(clientId);
                }
            });
        }, 30000);
    }
    handleMessage(client, message) {
        const { type, data } = message;
        switch (type) {
            case 'subscribe':
                if (data.symbol) {
                    client.subscriptions.add(data.symbol);
                    const marketData = this.marketData.get(data.symbol);
                    if (marketData) {
                        this.sendMessage(client.ws, 'market_data', marketData);
                    }
                }
                break;
            case 'unsubscribe':
                if (data.symbol) {
                    client.subscriptions.delete(data.symbol);
                }
                break;
            case 'place_order':
                this.sendMessage(client.ws, 'order_placed', {
                    orderId: (0, uuid_1.v4)(),
                    ...data
                });
                break;
            default:
                this.sendError(client.ws, `Unknown message type: ${type}`);
        }
    }
    sendMessage(ws, type, data) {
        if (ws.readyState === ws_1.WebSocket.OPEN) {
            ws.send(JSON.stringify({ type, data }));
        }
    }
    sendError(ws, message) {
        this.sendMessage(ws, 'error', { message });
    }
    randomPrice(min, max) {
        return Number((Math.random() * (max - min) + min).toFixed(5));
    }
    close() {
        clearInterval(this.heartbeatInterval);
        this.wss.close();
    }
}
exports.TradingWebSocketServer = TradingWebSocketServer;
exports.default = TradingWebSocketServer;
//# sourceMappingURL=trading.js.map