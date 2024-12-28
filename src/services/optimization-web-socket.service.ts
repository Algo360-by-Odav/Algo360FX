import { io, Socket } from 'socket.io-client';

interface OptimizationParams {
  strategyId: string;
  parameters: {
    name: string;
    type: 'number' | 'boolean' | 'string';
    range?: [number, number];
    step?: number;
    values?: Array<string | number | boolean>;
  }[];
  timeframe: string;
  startDate: string;
  endDate: string;
  maxGenerations: number;
  populationSize: number;
  crossoverRate: number;
  mutationRate: number;
  optimizationTarget: 'profit' | 'sharpeRatio' | 'drawdown' | 'winRate';
}

interface OptimizationProgress {
  generation: number;
  bestFitness: number;
  averageFitness: number;
  progress: number;
  timeElapsed: number;
  timeRemaining: number;
  currentBest: {
    parameters: Record<string, number | string | boolean>;
    fitness: number;
    metrics: {
      profit: number;
      sharpeRatio: number;
      drawdown: number;
      winRate: number;
    };
  };
}

interface OptimizationResult {
  bestParameters: Record<string, number | string | boolean>;
  metrics: {
    profit: number;
    sharpeRatio: number;
    drawdown: number;
    winRate: number;
    totalTrades: number;
    profitFactor: number;
    maxDrawdown: number;
  };
  convergenceHistory: Array<{
    generation: number;
    bestFitness: number;
    averageFitness: number;
  }>;
  executionTime: number;
  generationsCompleted: number;
}

interface WebSocketConfig {
  path: string;
  transports: string[];
  reconnection: boolean;
  reconnectionAttempts: number;
  reconnectionDelay: number;
  secure: boolean;
}

export class OptimizationWebSocketService {
  private socket: Socket | null = null;
  private readonly wsUrl: string;
  private readonly config: WebSocketConfig;

  constructor() {
    this.wsUrl = import.meta.env.VITE_WS_URL || 'wss://algo360fx-frontend.onrender.com';
    this.config = {
      path: '/ws',
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      secure: true
    };
    this.connect();
  }

  private connect(): void {
    if (!this.socket) {
      this.socket = io(this.wsUrl, this.config);
      this.setupEventHandlers();
    }
  }

  private setupEventHandlers(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Connected to optimization WebSocket');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from optimization WebSocket');
    });

    this.socket.on('error', (error: Error) => {
      console.error('WebSocket error:', error);
    });

    this.socket.on('optimization_progress', (data: OptimizationProgress) => {
      console.log('Optimization progress:', data);
    });

    this.socket.on('optimization_complete', (data: OptimizationResult) => {
      console.log('Optimization complete:', data);
    });

    this.socket.on('optimization_error', (error: string) => {
      console.error('Optimization error:', error);
    });
  }

  public startOptimization(params: OptimizationParams): void {
    if (!this.socket?.connected) {
      this.connect();
    }
    this.socket?.emit('start_optimization', params);
  }

  public stopOptimization(): void {
    this.socket?.emit('stop_optimization');
  }

  public onProgress(callback: (progress: OptimizationProgress) => void): void {
    this.socket?.on('optimization_progress', callback);
  }

  public onResult(callback: (result: OptimizationResult) => void): void {
    this.socket?.on('optimization_complete', callback);
  }

  public onError(callback: (error: string) => void): void {
    this.socket?.on('optimization_error', callback);
  }

  public disconnect(): void {
    if (this.socket?.connected) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  public isConnected(): boolean {
    return this.socket?.connected || false;
  }
}
