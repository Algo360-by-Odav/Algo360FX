import { Server as SocketIOServer, Socket } from 'socket.io';
import { OptimizationConfig, OptimizationResultNew } from '../types/optimization';

export class OptimizationWebSocketServer {
  private io: SocketIOServer;
  private optimizations: Map<string, {
    config: OptimizationConfig;
    progress: number;
    status: 'running' | 'completed' | 'error';
  }> = new Map();

  constructor(io: SocketIOServer) {
    this.io = io;
  }

  public initialize() {
    this.setupSocketServer();
    console.log('Optimization WebSocket Server initialized');
  }

  private setupSocketServer() {
    this.io.on('connection', (socket: Socket) => {
      console.log('New optimization client connected');

      socket.on('message', async (data: any) => {
        try {
          await this.handleMessage(socket, data);
        } catch (error) {
          console.error('Error handling optimization message:', error);
          this.sendError(socket, 'Failed to process message');
        }
      });

      socket.on('disconnect', () => {
        console.log('Optimization client disconnected');
      });
    });
  }

  private async handleMessage(socket: Socket, data: any) {
    switch (data.type) {
      case 'start_optimization':
        await this.handleStartOptimization(socket, data.config);
        break;
      case 'stop_optimization':
        await this.handleStopOptimization(socket, data.optimizationId);
        break;
      case 'get_status':
        this.handleGetStatus(socket, data.optimizationId);
        break;
      default:
        this.sendError(socket, 'Unknown message type');
    }
  }

  private async handleStartOptimization(socket: Socket, config: OptimizationConfig) {
    try {
      const optimizationId = Math.random().toString(36).substring(7);
      
      this.optimizations.set(optimizationId, {
        config,
        progress: 0,
        status: 'running'
      });

      // Start the optimization process
      this.runOptimization(optimizationId, socket);

      socket.emit('optimization_started', { optimizationId });
    } catch (error) {
      console.error('Error starting optimization:', error);
      this.sendError(socket, 'Failed to start optimization');
    }
  }

  private async handleStopOptimization(socket: Socket, optimizationId: string) {
    const optimization = this.optimizations.get(optimizationId);
    if (!optimization) {
      this.sendError(socket, 'Optimization not found');
      return;
    }

    optimization.status = 'completed';
    socket.emit('optimization_stopped', { optimizationId });
  }

  private handleGetStatus(socket: Socket, optimizationId: string) {
    const optimization = this.optimizations.get(optimizationId);
    if (!optimization) {
      this.sendError(socket, 'Optimization not found');
      return;
    }

    socket.emit('optimization_status', {
      optimizationId,
      progress: optimization.progress,
      status: optimization.status
    });
  }

  private async runOptimization(optimizationId: string, socket: Socket) {
    const optimization = this.optimizations.get(optimizationId);
    if (!optimization) return;

    try {
      // Simulate optimization process
      for (let i = 0; i <= 100; i += 10) {
        if (optimization.status !== 'running') break;

        optimization.progress = i;
        socket.emit('optimization_progress', {
          optimizationId,
          progress: i,
          status: 'running'
        });

        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      if (optimization.status === 'running') {
        optimization.status = 'completed';
        optimization.progress = 100;

        const result: OptimizationResultNew = {
          optimizationId,
          strategyId: optimization.config.strategyId,
          parameters: {
            stopLoss: 50,
            takeProfit: 100,
            riskPerTrade: 0.02
          },
          performance: {
            profit: 5000,
            sharpeRatio: 1.5,
            maxDrawdown: -15,
            winRate: 0.65,
            tradeCount: 100
          },
          timestamp: new Date().toISOString()
        };

        socket.emit('optimization_completed', {
          optimizationId,
          result
        });
      }
    } catch (error) {
      console.error('Error running optimization:', error);
      optimization.status = 'error';
      this.sendError(socket, 'Optimization process failed');
    }
  }

  private sendError(socket: Socket, message: string) {
    socket.emit('error', { message });
  }
}

export default OptimizationWebSocketServer;
