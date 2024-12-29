import { Server } from 'http';
declare class TradingWebSocketServer {
    private wss;
    private clients;
    private marketData;
    private heartbeatInterval;
    constructor(server: Server);
    private setupWebSocket;
    private initializeMarketData;
    private updateMarketData;
    private handleMessage;
    private handleSubscription;
    private handleUnsubscription;
    private handlePlaceOrder;
    private handleCancelOrder;
    private sendMessage;
    private sendError;
    private randomPrice;
    private handleError;
    close(): void;
}
export default TradingWebSocketServer;
