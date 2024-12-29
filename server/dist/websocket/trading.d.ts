import { Server } from 'socket.io';
export declare class TradingWebSocketServer {
    private io;
    private clients;
    private marketData;
    private updateInterval;
    private subscribedSymbols;
    constructor(io: Server);
    initialize(): void;
    private setupSocketServer;
    private initializeMarketData;
    private broadcastPrices;
    close(): void;
}
export default TradingWebSocketServer;
