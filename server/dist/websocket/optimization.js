"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OptimizationWebSocketServer = void 0;
class OptimizationWebSocketServer {
    constructor(io) {
        this.optimizations = new Map();
        this.io = io;
        this.setupSocketServer();
    }
    setupSocketServer() {
        this.io.on('connection', (socket) => {
            console.log('New optimization client connected');
            socket.on('message', async (data) => {
                try {
                    await this.handleMessage(socket, data);
                }
                catch (error) {
                    console.error('Error handling optimization message:', error);
                    this.sendError(socket, 'Failed to process message');
                }
            });
            socket.on('disconnect', () => {
                console.log('Optimization client disconnected');
            });
            socket.on('error', (error) => {
                console.error('Optimization Socket error:', error);
                this.sendError(socket, 'Socket error occurred');
            });
            this.send(socket, 'connect', { status: 'connected' });
        });
    }
    async handleMessage(socket, message) {
        const { type, data } = message;
        switch (type) {
            case 'start_optimization':
                await this.handleStartOptimization(socket, data);
                break;
            case 'stop_optimization':
                await this.handleStopOptimization(socket, data);
                break;
            case 'get_status':
                await this.handleGetStatus(socket, data);
                break;
            default:
                this.sendError(socket, `Unknown message type: ${type}`);
        }
    }
    async handleStartOptimization(socket, data) {
        const { optimizationId, strategyId, config } = data;
        this.optimizations.set(optimizationId, {
            config,
            progress: 0,
            status: 'running'
        });
        await this.runOptimization(socket, optimizationId, strategyId, config);
    }
    async handleStopOptimization(socket, data) {
        const { optimizationId } = data;
        const optimization = this.optimizations.get(optimizationId);
        if (!optimization) {
            this.sendError(socket, `Optimization not found: ${optimizationId}`);
            return;
        }
        optimization.status = 'completed';
        this.optimizations.set(optimizationId, optimization);
        this.send(socket, 'optimization_stopped', { optimizationId });
    }
    async handleGetStatus(socket, data) {
        const { optimizationId } = data;
        const optimization = this.optimizations.get(optimizationId);
        if (!optimization) {
            this.sendError(socket, `Optimization not found: ${optimizationId}`);
            return;
        }
        this.send(socket, 'optimization_status', {
            optimizationId,
            ...optimization
        });
    }
    async runOptimization(socket, optimizationId, strategyId, config) {
        try {
            const { parameters, timeframe, startDate, endDate, symbol, optimizationMetric } = config;
            console.log(`Starting optimization for ${symbol} on ${timeframe} from ${startDate} to ${endDate}`);
            console.log(`Optimization metric: ${optimizationMetric}`);
            console.log('Parameters:', parameters);
            let progress = 0;
            const interval = setInterval(() => {
                progress += 10;
                if (progress <= 100) {
                    this.send(socket, 'optimization_progress', {
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
                this.send(socket, 'optimization_complete', result);
                const optimization = this.optimizations.get(optimizationId);
                if (optimization) {
                    optimization.status = 'completed';
                    optimization.progress = 100;
                }
            }, 10000);
        }
        catch (error) {
            console.error('Optimization error:', error);
            this.send(socket, 'optimization_error', {
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
    send(socket, type, data) {
        socket.emit(type, data);
    }
    sendError(socket, message) {
        this.send(socket, 'error', { message });
    }
    getConnectedClients() {
        return this.io.engine.clientsCount;
    }
    close() {
    }
}
exports.OptimizationWebSocketServer = OptimizationWebSocketServer;
exports.default = OptimizationWebSocketServer;
//# sourceMappingURL=optimization.js.map