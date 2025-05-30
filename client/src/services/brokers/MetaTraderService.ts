import { EventEmitter } from 'events';
import { BrokerConnection, ConnectionStatus, OrderType, TimeInForce, Order, Position, MarketData, AccountInfo } from './types';

export class MetaTraderService extends EventEmitter implements BrokerConnection {
  private socket: WebSocket | null = null;
  private apiKey: string;
  private apiSecret: string;
  private serverUrl: string;
  private status: ConnectionStatus = 'disconnected';
  private accountId: string = '';
  private terminalType: 'MT4' | 'MT5' = 'MT5';
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectDelay: number = 1000;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private lastHeartbeat: number = 0;
  private symbolMap: Map<string, { bid: number; ask: number; digits: number }> = new Map();

  constructor(config: { 
    apiKey: string; 
    apiSecret: string; 
    serverUrl: string;
    terminalType?: 'MT4' | 'MT5';
    accountId?: string;
  }) {
    super();
    this.apiKey = config.apiKey;
    this.apiSecret = config.apiSecret;
    this.serverUrl = config.serverUrl;
    this.terminalType = config.terminalType || 'MT5';
    this.accountId = config.accountId || '';
  }

  async connect(): Promise<void> {
    try {
      if (this.socket) {
        this.socket.close();
      }

      this.socket = new WebSocket(this.serverUrl);
      this.setupSocketHandlers();
      
      await this.waitForConnection();
      await this.authenticate();
      
      this.startHeartbeat();
      this.status = 'connected';
      this.emit('connected');

      // Subscribe to market data and account updates
      await this.subscribeToMarketData();
      await this.subscribeToAccountUpdates();
    } catch (error) {
      this.status = 'error';
      this.emit('error', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.socket) {
      this.stopHeartbeat();
      this.socket.close();
      this.socket = null;
      this.status = 'disconnected';
      this.emit('disconnected');
    }
  }

  async getAccountInfo(): Promise<AccountInfo> {
    const response = await this.sendRequest({
      command: 'GET_ACCOUNT_INFO',
      accountId: this.accountId,
    });

    return {
      accountId: response.accountId,
      balance: response.balance,
      equity: response.equity,
      margin: {
        used: response.margin,
        available: response.freeMargin,
        maintenance: response.marginLevel,
      },
      currency: response.currency,
    };
  }

  async getPositions(): Promise<Position[]> {
    const response = await this.sendRequest({
      command: 'GET_POSITIONS',
      accountId: this.accountId,
    });

    return response.positions.map((pos: any) => ({
      symbol: pos.symbol,
      quantity: pos.volume * (pos.type === 'sell' ? -1 : 1),
      averagePrice: pos.openPrice,
      marketPrice: pos.currentPrice,
      unrealizedPnL: pos.profit,
      realizedPnL: pos.swap + pos.commission,
      timestamp: new Date(pos.time * 1000),
    }));
  }

  async placeOrder(order: Omit<Order, 'id' | 'status' | 'timestamp'>): Promise<Order> {
    const mtOrder = {
      command: 'PLACE_ORDER',
      accountId: this.accountId,
      symbol: order.symbol,
      type: this.convertOrderType(order.type),
      volume: Math.abs(order.quantity),
      price: order.price || 0,
      sl: order.stopPrice || 0,
      tp: 0,
      comment: 'Placed via Algo360FX',
      position: 0,
      deviation: 10,
    };

    const response = await this.sendRequest(mtOrder);

    return {
      id: response.orderId.toString(),
      symbol: order.symbol,
      side: order.side,
      type: order.type,
      quantity: order.quantity,
      price: order.price,
      stopPrice: order.stopPrice,
      timeInForce: order.timeInForce,
      status: 'pending',
      timestamp: new Date(),
    };
  }

  async cancelOrder(orderId: string): Promise<void> {
    await this.sendRequest({
      command: 'CANCEL_ORDER',
      accountId: this.accountId,
      orderId: parseInt(orderId),
    });
  }

  async getMarketData(symbol: string): Promise<MarketData> {
    const symbolInfo = this.symbolMap.get(symbol);
    if (!symbolInfo) {
      throw new Error(`No market data available for ${symbol}`);
    }

    return {
      symbol,
      bid: symbolInfo.bid,
      ask: symbolInfo.ask,
      last: (symbolInfo.bid + symbolInfo.ask) / 2,
      volume: 0, // MT doesn't provide real-time volume
      timestamp: new Date(),
    };
  }

  getStatus(): ConnectionStatus {
    return this.status;
  }

  private setupSocketHandlers(): void {
    if (!this.socket) return;

    this.socket.onopen = () => {
      this.reconnectAttempts = 0;
      this.status = 'connected';
      this.emit('connected');
    };

    this.socket.onclose = () => {
      this.status = 'disconnected';
      this.emit('disconnected');
      this.handleReconnect();
    };

    this.socket.onerror = (error) => {
      this.status = 'error';
      this.emit('error', error);
    };

    this.socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        
        switch (message.type) {
          case 'TICK':
            this.handleTick(message.data);
            break;
          case 'EXECUTION':
            this.handleExecution(message.data);
            break;
          case 'POSITION_UPDATE':
            this.handlePositionUpdate(message.data);
            break;
          case 'BALANCE_UPDATE':
            this.handleBalanceUpdate(message.data);
            break;
          case 'HEARTBEAT':
            this.handleHeartbeat();
            break;
          default:
            this.emit('message', message);
        }
      } catch (error) {
        this.emit('error', error);
      }
    };
  }

  private async authenticate(): Promise<void> {
    const authMessage = {
      command: 'AUTHENTICATE',
      accountId: this.accountId,
      apiKey: this.apiKey,
      timestamp: Date.now(),
      signature: this.generateSignature(),
    };

    await this.sendMessage(authMessage);
  }

  private generateSignature(): string {
    // Implement HMAC-SHA256 signature generation
    const timestamp = Date.now().toString();
    const message = `${this.apiKey}${timestamp}`;
    return message;
  }

  private async sendMessage(message: any): Promise<void> {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket is not connected');
    }

    this.socket.send(JSON.stringify(message));
  }

  private async sendRequest(request: any): Promise<any> {
    const requestId = crypto.randomUUID();
    const message = {
      ...request,
      requestId,
    };

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Request timeout'));
      }, 10000);

      const responseHandler = (response: any) => {
        if (response.requestId === requestId) {
          clearTimeout(timeout);
          this.removeListener('message', responseHandler);
          
          if (response.error) {
            reject(new Error(response.error));
          } else {
            resolve(response.data);
          }
        }
      };

      this.on('message', responseHandler);
      this.sendMessage(message).catch(reject);
    });
  }

  private async waitForConnection(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject(new Error('WebSocket not initialized'));
        return;
      }

      const timeout = setTimeout(() => {
        reject(new Error('Connection timeout'));
      }, 10000);

      this.socket.addEventListener('open', () => {
        clearTimeout(timeout);
        resolve();
      }, { once: true });

      this.socket.addEventListener('error', (error) => {
        clearTimeout(timeout);
        reject(error);
      }, { once: true });
    });
  }

  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      if (Date.now() - this.lastHeartbeat > 10000) {
        this.emit('error', new Error('Heartbeat timeout'));
        this.disconnect();
        this.handleReconnect();
      } else {
        this.sendMessage({ command: 'PING' });
      }
    }, 5000);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private handleHeartbeat(): void {
    this.lastHeartbeat = Date.now();
  }

  private async handleReconnect(): Promise<void> {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.emit('error', new Error('Max reconnection attempts reached'));
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

    await new Promise(resolve => setTimeout(resolve, delay));
    
    try {
      await this.connect();
    } catch (error) {
      this.emit('error', error);
    }
  }

  private handleTick(tick: any): void {
    const { symbol, bid, ask, digits } = tick;
    this.symbolMap.set(symbol, { bid, ask, digits });
    
    this.emit('marketData', {
      symbol,
      bid,
      ask,
      last: (bid + ask) / 2,
      volume: 0,
      timestamp: new Date(),
    });
  }

  private handleExecution(execution: any): void {
    this.emit('execution', {
      orderId: execution.orderId,
      symbol: execution.symbol,
      quantity: execution.volume * (execution.type === 'sell' ? -1 : 1),
      price: execution.price,
      commission: execution.commission,
      timestamp: new Date(execution.time * 1000),
    });
  }

  private handlePositionUpdate(position: any): void {
    this.emit('position', {
      symbol: position.symbol,
      quantity: position.volume * (position.type === 'sell' ? -1 : 1),
      averagePrice: position.openPrice,
      marketPrice: position.currentPrice,
      unrealizedPnL: position.profit,
      realizedPnL: position.swap + position.commission,
      timestamp: new Date(position.time * 1000),
    });
  }

  private handleBalanceUpdate(balance: any): void {
    this.emit('accountInfo', {
      accountId: this.accountId,
      balance: balance.balance,
      equity: balance.equity,
      margin: {
        used: balance.margin,
        available: balance.freeMargin,
        maintenance: balance.marginLevel,
      },
      currency: balance.currency,
    });
  }

  private convertOrderType(type: OrderType): number {
    // MT4/MT5 order type mapping
    switch (type) {
      case 'market':
        return 0; // ORDER_TYPE_BUY/SELL
      case 'limit':
        return 2; // ORDER_TYPE_BUY_LIMIT/SELL_LIMIT
      case 'stop':
        return 3; // ORDER_TYPE_BUY_STOP/SELL_STOP
      case 'stopLimit':
        return 4; // ORDER_TYPE_BUY_STOP_LIMIT/SELL_STOP_LIMIT
      default:
        throw new Error(`Unsupported order type: ${type}`);
    }
  }

  private async subscribeToMarketData(): Promise<void> {
    await this.sendRequest({
      command: 'SUBSCRIBE_SYMBOLS',
      symbols: ['EURUSD', 'GBPUSD', 'USDJPY'], // Add default symbols
    });
  }

  private async subscribeToAccountUpdates(): Promise<void> {
    await this.sendRequest({
      command: 'SUBSCRIBE_ACCOUNT',
      accountId: this.accountId,
    });
  }
}
