"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const uuid_1 = require("uuid");
class TradingWebSocketServer {
    constructor(server) {
        this.clients = new Map();
        this.marketData = new Map();
        this.wss = new ws_1.WebSocketServer({ server });
        this.heartbeatInterval = setInterval(() => {
            this.clients.forEach((client, id) => {
                if (client.ws.readyState === ws_1.WebSocket.OPEN) {
                    this.sendMessage(client.ws, 'heartbeat', { timestamp: new Date().toISOString() });
                }
                else {
                    this.clients.delete(id);
                }
            });
        }, 30000); // Send heartbeat every 30 seconds
        this.setupWebSocket();
        this.initializeMarketData();
    }
    setupWebSocket() {
        this.wss.on('connection', (ws) => {
            const clientId = (0, uuid_1.v4)();
            const client = {
                id: clientId,
                ws,
                subscriptions: new Set()
            };
            this.clients.set(clientId, client);
            console.log(`Client connected: ${clientId}`);
            // Send initial market data
            this.sendMessage(ws, 'connect', { status: 'connected', clientId });
            ws.on('message', (message) => {
                try {
                    const data = JSON.parse(message.toString());
                    this.handleMessage(client, data);
                }
                catch (error) {
                    this.handleError(error);
                }
            });
            ws.on('close', () => {
                console.log(`Client disconnected: ${clientId}`);
                this.clients.delete(clientId);
            });
            ws.on('error', (error) => {
                this.handleError(error);
                this.clients.delete(clientId);
            });
        });
    }
    initializeMarketData() {
        // Initialize with some default market data
        const symbols = ['EURUSD', 'GBPUSD', 'USDJPY', 'BTCUSD'];
        symbols.forEach(symbol => {
            this.marketData.set(symbol, {
                symbol,
                bid: this.randomPrice(1.0, 1.2),
                ask: this.randomPrice(1.0, 1.2),
                timestamp: new Date().toISOString()
            });
        });
        // Start updating market data periodically
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
            // Send updates to subscribed clients
            this.clients.forEach(client => {
                if (client.subscriptions.has(symbol)) {
                    this.sendMessage(client.ws, 'market_data', updatedData);
                }
            });
        });
    }
    handleMessage(client, data) {
        const { type, payload } = data;
        switch (type) {
            case 'subscribe_market_data':
                this.handleSubscription(client, payload.symbol);
                break;
            case 'unsubscribe_market_data':
                this.handleUnsubscription(client, payload.symbol);
                break;
            case 'place_order':
                this.handlePlaceOrder(client, payload);
                break;
            case 'cancel_order':
                this.handleCancelOrder(client, payload);
                break;
            default:
                this.sendError(client.ws, `Unknown message type: ${type}`);
        }
    }
    handleSubscription(client, symbol) {
        if (!this.marketData.has(symbol)) {
            this.sendError(client.ws, `Invalid symbol: ${symbol}`);
            return;
        }
        client.subscriptions.add(symbol);
        const data = this.marketData.get(symbol);
        this.sendMessage(client.ws, 'market_data', data);
    }
    handleUnsubscription(client, symbol) {
        client.subscriptions.delete(symbol);
    }
    handlePlaceOrder(client, order) {
        // Simulate order processing
        const orderId = (0, uuid_1.v4)();
        const processedOrder = {
            ...order,
            id: orderId,
            status: 'PENDING',
            timestamp: new Date().toISOString()
        };
        // Send order confirmation
        this.sendMessage(client.ws, 'order_update', processedOrder);
        // Simulate order execution after a short delay
        setTimeout(() => {
            const executedOrder = {
                ...processedOrder,
                status: 'FILLED',
                filledPrice: this.marketData.get(order.symbol)?.bid || 0,
            };
            this.sendMessage(client.ws, 'order_update', executedOrder);
        }, 500);
    }
    handleCancelOrder(client, { orderId }) {
        // Simulate order cancellation
        this.sendMessage(client.ws, 'order_update', {
            id: orderId,
            status: 'CANCELLED',
            timestamp: new Date().toISOString()
        });
    }
    sendMessage(ws, type, payload) {
        if (ws.readyState === ws_1.WebSocket.OPEN) {
            ws.send(JSON.stringify({ type, payload }));
        }
    }
    sendError(ws, message) {
        this.sendMessage(ws, 'error', { message });
    }
    randomPrice(min, max) {
        return Number((Math.random() * (max - min) + min).toFixed(5));
    }
    handleError(error) {
        console.error('WebSocket error:', error);
        this.clients.forEach((client) => {
            if (client.ws.readyState === ws_1.WebSocket.OPEN) {
                this.sendMessage(client.ws, 'error', { message: error.message });
            }
        });
    }
    close() {
        clearInterval(this.heartbeatInterval);
        this.wss.close();
    }
}
exports.default = TradingWebSocketServer;
