import { Server as SocketIOServer } from 'socket.io';
export declare class OptimizationWebSocketServer {
    private io;
    private optimizations;
    constructor(io: SocketIOServer);
    initialize(): void;
    private setupSocketServer;
    private handleMessage;
    private handleStartOptimization;
    private handleStopOptimization;
    private handleGetStatus;
    private runOptimization;
    private sendError;
}
export default OptimizationWebSocketServer;
