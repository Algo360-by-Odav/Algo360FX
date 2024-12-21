"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OptimizationWebSocketServer = void 0;
const ws_1 = require("ws");
class OptimizationWebSocketServer {
    constructor(server, path = '/optimization') {
        this.optimizations = new Map();
        this.wss = new ws_1.WebSocketServer({
            server,
            path,
            clientTracking: true
        });
        this.setupWebSocketServer();
    }
    setupWebSocketServer() {
        this.wss.on('connection', (ws) => {
            console.log('New optimization client connected');
            ws.on('message', async (message) => {
                try {
                    const data = JSON.parse(message.toString());
                    await this.handleMessage(ws, data);
                }
                catch (error) {
                    console.error('Error handling optimization message:', error);
                    this.sendError(ws, 'Failed to process message');
                }
            });
            ws.on('close', () => {
                console.log('Optimization client disconnected');
            });
            ws.on('error', (error) => {
                console.error('Optimization WebSocket error:', error);
                this.sendError(ws, 'WebSocket error occurred');
            });
            this.send(ws, 'connect', { status: 'connected' });
        });
    }
    async handleMessage(ws, message) {
        const { type, data } = message;
        switch (type) {
            case 'start_optimization':
                await this.handleStartOptimization(ws, data);
                break;
            case 'stop_optimization':
                await this.handleStopOptimization(ws, data);
                break;
            case 'get_status':
                await this.handleGetStatus(ws, data);
                break;
            default:
                this.sendError(ws, `Unknown message type: ${type}`);
        }
    }
    async handleStartOptimization(ws, data) {
        const { optimizationId, strategyId, config } = data;
        this.optimizations.set(optimizationId, {
            config,
            progress: 0,
            status: 'running'
        });
        await this.runOptimization(ws, optimizationId, strategyId, config);
    }
    async handleStopOptimization(ws, data) {
        const { optimizationId } = data;
        const optimization = this.optimizations.get(optimizationId);
        if (!optimization) {
            this.sendError(ws, `Optimization not found: ${optimizationId}`);
            return;
        }
        optimization.status = 'completed';
        this.optimizations.set(optimizationId, optimization);
        this.send(ws, 'optimization_stopped', { optimizationId });
    }
    async handleGetStatus(ws, data) {
        const { optimizationId } = data;
        const optimization = this.optimizations.get(optimizationId);
        if (!optimization) {
            this.sendError(ws, `Optimization not found: ${optimizationId}`);
            return;
        }
        this.send(ws, 'optimization_status', {
            optimizationId,
            ...optimization
        });
    }
    async runOptimization(ws, optimizationId, strategyId, config) {
        try {
            const { parameters, timeframe, startDate, endDate, symbol, optimizationMetric } = config;
            console.log(`Starting optimization for ${symbol} on ${timeframe} from ${startDate} to ${endDate}`);
            console.log(`Optimization metric: ${optimizationMetric}`);
            console.log('Parameters:', parameters);
            let progress = 0;
            const interval = setInterval(() => {
                progress += 10;
                if (progress <= 100) {
                    this.send(ws, 'optimization_progress', {
                        optimizationId,
                        progress
                    });
                }
            }, 1000);
            setTimeout(() => {
                var _a, _b, _c;
                clearInterval(interval);
                const result = {
                    optimizationId,
                    strategyId,
                    parameters: {
                        stopLoss: ((_a = parameters.stopLoss) === null || _a === void 0 ? void 0 : _a.min) || 50,
                        takeProfit: ((_b = parameters.takeProfit) === null || _b === void 0 ? void 0 : _b.min) || 100,
                        entryThreshold: ((_c = parameters.entryThreshold) === null || _c === void 0 ? void 0 : _c.min) || 0.5
                    },
                    performance: this.generateRandomResults(),
                    timestamp: new Date().toISOString()
                };
                this.send(ws, 'optimization_complete', result);
                const optimization = this.optimizations.get(optimizationId);
                if (optimization) {
                    optimization.status = 'completed';
                    optimization.progress = 100;
                }
            }, 10000);
        }
        catch (error) {
            console.error('Optimization error:', error);
            this.send(ws, 'optimization_error', {
                optimizationId,
                error: error.message
            });
            const optimization = this.optimizations.get(optimizationId);
            if (optimization) {
                optimization.status = 'error';
            }
        }
    }
    generateRandomResults() {
        return {
            profit: Math.random() * 10000 - 5000,
            sharpeRatio: Math.random() * 3,
            maxDrawdown: Math.random() * 30,
            winRate: Math.random() * 100,
            tradeCount: Math.floor(Math.random() * 1000)
        };
    }
    send(ws, type, data) {
        if (ws.readyState === ws_1.WebSocket.OPEN) {
            ws.send(JSON.stringify({ type, data }));
        }
    }
    sendError(ws, message) {
        this.send(ws, 'error', { message });
    }
    getConnectedClients() {
        return this.wss.clients.size;
    }
    close() {
        this.wss.close();
    }
}
exports.OptimizationWebSocketServer = OptimizationWebSocketServer;
exports.default = OptimizationWebSocketServer;
//# sourceMappingURL=optimization.js.map