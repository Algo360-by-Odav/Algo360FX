import { WebSocket, WebSocketServer } from 'ws';
import { Server } from 'http';
import { OptimizationConfig, OptimizationResultNew } from '../types/optimization';

export class OptimizationWebSocketServer {
  private wss: WebSocketServer;
  private optimizations: Map<string, {
    config: OptimizationConfig;
    progress: number;
    status: 'running' | 'completed' | 'error';
  }> = new Map();

  constructor(server: Server, path: string = '/optimization') {
    this.wss = new WebSocketServer({ 
      server,
      path,
      clientTracking: true
    });

    this.setupWebSocketServer();
  }

  private setupWebSocketServer() {
    this.wss.on('connection', (ws: WebSocket) => {
      console.log('New optimization client connected');

      ws.on('message', async (message: string) => {
        try {
          const data = JSON.parse(message.toString());
          await this.handleMessage(ws, data);
        } catch (error) {
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

      // Send initial connection success message
      this.send(ws, 'connect', { status: 'connected' });
    });
  }

  private async handleMessage(ws: WebSocket, message: any) {
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

  private async handleStartOptimization(ws: WebSocket, data: {
    optimizationId: string;
    strategyId: string;
    config: OptimizationConfig;
  }) {
    const { optimizationId, strategyId, config } = data;

    // Store optimization details
    this.optimizations.set(optimizationId, {
      config,
      progress: 0,
      status: 'running'
    });

    // Start the optimization process
    await this.runOptimization(ws, optimizationId, strategyId, config);
  }

  private async handleStopOptimization(ws: WebSocket, data: {
    optimizationId: string;
  }) {
    const { optimizationId } = data;
    const optimization = this.optimizations.get(optimizationId);

    if (!optimization) {
      this.sendError(ws, `Optimization not found: ${optimizationId}`);
      return;
    }

    // Stop the optimization
    optimization.status = 'completed';
    this.optimizations.set(optimizationId, optimization);
    
    this.send(ws, 'optimization_stopped', { optimizationId });
  }

  private async handleGetStatus(ws: WebSocket, data: {
    optimizationId: string;
  }) {
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

  private async runOptimization(
    ws: WebSocket,
    optimizationId: string,
    strategyId: string,
    config: OptimizationConfig
  ) {
    try {
      // Use config parameters for optimization
      const { parameters, timeframe, startDate, endDate, symbol, optimizationMetric } = config;
      console.log(`Starting optimization for ${symbol} on ${timeframe} from ${startDate} to ${endDate}`);
      console.log(`Optimization metric: ${optimizationMetric}`);
      console.log('Parameters:', parameters);

      // Simulate optimization progress
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

      // Simulate optimization results after 10 seconds
      setTimeout(() => {
        clearInterval(interval);
        
        const result: OptimizationResultNew = {
          optimizationId,
          strategyId,
          parameters: {
            stopLoss: parameters.stopLoss?.min || 50,
            takeProfit: parameters.takeProfit?.min || 100,
            entryThreshold: parameters.entryThreshold?.min || 0.5
          },
          performance: this.generateRandomResults(),
          timestamp: new Date().toISOString()
        };

        this.send(ws, 'optimization_complete', result);
        
        // Update optimization status
        const optimization = this.optimizations.get(optimizationId);
        if (optimization) {
          optimization.status = 'completed';
          optimization.progress = 100;
        }
      }, 10000);

    } catch (error: any) {
      console.error('Optimization error:', error);
      this.send(ws, 'optimization_error', {
        optimizationId,
        error: error.message
      });
      
      // Update optimization status
      const optimization = this.optimizations.get(optimizationId);
      if (optimization) {
        optimization.status = 'error';
      }
    }
  }

  private generateRandomResults(): OptimizationResultNew['performance'] {
    return {
      profit: Math.random() * 10000 - 5000,
      sharpeRatio: Math.random() * 3,
      maxDrawdown: Math.random() * 30,
      winRate: Math.random() * 100,
      tradeCount: Math.floor(Math.random() * 1000)
    };
  }

  private send(ws: WebSocket, type: string, data: any) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type, data }));
    }
  }

  private sendError(ws: WebSocket, message: string) {
    this.send(ws, 'error', { message });
  }

  public getConnectedClients(): number {
    return this.wss.clients.size;
  }

  public close() {
    this.wss.close();
  }
}

export default OptimizationWebSocketServer;
