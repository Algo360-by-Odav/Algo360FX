"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MT5Bridge = void 0;
const ws_1 = __importStar(require("ws"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const WS_PORT = parseInt(process.env.MT5_WS_PORT || '6780');
class MT5Bridge {
    constructor(metaApi) {
        this.connections = new Map();
        this.metaApi = metaApi;
        this.wss = new ws_1.WebSocketServer({ port: WS_PORT });
    }
    async start() {
        try {
            console.log(`MT5 Bridge starting on port ${WS_PORT}`);
            this.wss.on('connection', (ws) => {
                const connectionId = Math.random().toString(36).substring(7);
                this.connections.set(connectionId, { ws });
                console.log(`New connection established: ${connectionId}`);
                ws.on('message', async (message) => {
                    try {
                        const data = JSON.parse(message.toString());
                        await this.handleMessage(connectionId, data);
                    }
                    catch (error) {
                        const errorMessage = error instanceof Error ? error.message : 'Failed to process message';
                        console.error('Error handling message:', error);
                        ws.send(JSON.stringify({
                            type: 'error',
                            data: errorMessage
                        }));
                    }
                });
                ws.on('close', () => {
                    const connection = this.connections.get(connectionId);
                    if (connection?.terminal) {
                        connection.terminal.disconnect();
                    }
                    this.connections.delete(connectionId);
                    console.log(`Connection closed: ${connectionId}`);
                });
            });
            console.log(`MT5 Bridge Server running on port ${WS_PORT}`);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to start MT5 Bridge';
            console.error('Error starting MT5 Bridge:', error);
            throw new Error(errorMessage);
        }
    }
    async handleMessage(connectionId, message) {
        const connection = this.connections.get(connectionId);
        if (!connection)
            return;
        const { ws } = connection;
        switch (message.type) {
            case 'connect':
                try {
                    const terminal = await this.metaApi.metatraderAccountApi.getAccount(message.data.accountId);
                    if (!terminal)
                        throw new Error('Account not found');
                    connection.terminal = terminal;
                    await this.startUpdates(connectionId);
                    ws.send(JSON.stringify({
                        type: 'connected',
                        data: { accountId: message.data.accountId }
                    }));
                }
                catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Failed to connect to MT5';
                    ws.send(JSON.stringify({
                        type: 'error',
                        data: errorMessage
                    }));
                }
                break;
            case 'place_order':
                try {
                    const { symbol, volume, price } = message.data;
                    const terminal = connection.terminal;
                    if (!terminal)
                        throw new Error('Not connected to MT5');
                    const result = await terminal.createMarketBuyOrder(symbol, volume, price, 0.1, 0.1, { comment: 'Order from Algo360FX' });
                    ws.send(JSON.stringify({
                        type: 'order_placed',
                        data: result
                    }));
                }
                catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Failed to place order';
                    ws.send(JSON.stringify({
                        type: 'error',
                        data: errorMessage
                    }));
                }
                break;
            default:
                ws.send(JSON.stringify({
                    type: 'error',
                    data: 'Unknown message type'
                }));
        }
    }
    async startUpdates(connectionId) {
        const connection = this.connections.get(connectionId);
        if (!connection || !connection.terminal)
            return;
        const { ws, terminal } = connection;
        try {
            // Subscribe to price updates
            terminal.subscribeToMarketData('EURUSD');
            // Listen for updates
            terminal.on('onSymbolPriceUpdated', (price) => {
                ws.send(JSON.stringify({
                    type: 'price_update',
                    data: price
                }));
            });
            // Listen for position updates
            terminal.on('onPositionUpdated', (position) => {
                ws.send(JSON.stringify({
                    type: 'position_update',
                    data: position
                }));
            });
            // Listen for order updates
            terminal.on('onOrderUpdated', (order) => {
                ws.send(JSON.stringify({
                    type: 'order_update',
                    data: order
                }));
            });
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to start updates';
            console.error('Failed to start updates:', error);
            ws.send(JSON.stringify({
                type: 'error',
                data: errorMessage
            }));
        }
    }
    stop() {
        try {
            // Close all connections
            this.connections.forEach(connection => {
                if (connection.terminal) {
                    connection.terminal.disconnect();
                }
                if (connection.ws.readyState === ws_1.default.OPEN) {
                    connection.ws.close();
                }
            });
            // Clear connections
            this.connections.clear();
            // Close WebSocket server
            this.wss.close();
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to stop MT5 Bridge';
            console.error('Error stopping MT5 Bridge:', error);
            throw new Error(errorMessage);
        }
    }
}
exports.MT5Bridge = MT5Bridge;
exports.default = MT5Bridge;