import { makeAutoObservable, runInAction } from 'mobx';
import { RootStore } from './RootStore';

interface MT5Credentials {
  login: string;
  password: string;
  server: string;
}

interface MT5Position {
  ticket: number;
  symbol: string;
  type: 'buy' | 'sell';
  volume: number;
  openPrice: number;
  currentPrice: number;
  profit: number;
  swap: number;
  openTime: Date;
}

export class MT5Store {
  isConnected: boolean = false;
  positions: MT5Position[] = [];
  accountInfo: {
    balance: number;
    equity: number;
    margin: number;
    freeMargin: number;
  } | null = null;
  
  private socket: WebSocket | null = null;
  private credentials: MT5Credentials | null = null;
  
  constructor(private rootStore: RootStore) {
    makeAutoObservable(this);
  }

  connect = async (credentials: MT5Credentials) => {
    try {
      // Initialize WebSocket connection to your MT5 bridge server
      this.socket = new WebSocket('ws://your-mt5-bridge-server:port');
      
      this.socket.onopen = () => {
        this.socket?.send(JSON.stringify({
          type: 'auth',
          data: credentials
        }));
      };

      this.socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        this.handleMessage(data);
      };

      this.socket.onerror = (error) => {
        console.error('MT5 WebSocket error:', error);
        this.rootStore.notificationStore.addNotification({
          type: 'error',
          title: 'MT5 Connection Error',
          message: 'Failed to connect to MT5. Please check your credentials and try again.'
        });
      };

      this.socket.onclose = () => {
        runInAction(() => {
          this.isConnected = false;
        });
      };

      this.credentials = credentials;
    } catch (error) {
      console.error('MT5 connection error:', error);
      throw error;
    }
  };

  disconnect = () => {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
      this.credentials = null;
      runInAction(() => {
        this.isConnected = false;
        this.positions = [];
        this.accountInfo = null;
      });
    }
  };

  private handleMessage = (message: any) => {
    switch (message.type) {
      case 'auth_success':
        runInAction(() => {
          this.isConnected = true;
        });
        this.requestAccountInfo();
        this.requestPositions();
        break;
        
      case 'account_info':
        runInAction(() => {
          this.accountInfo = message.data;
        });
        break;
        
      case 'positions':
        runInAction(() => {
          this.positions = message.data;
        });
        break;
        
      case 'error':
        this.rootStore.notificationStore.addNotification({
          type: 'error',
          title: 'MT5 Error',
          message: message.data
        });
        break;
    }
  };

  requestAccountInfo = () => {
    if (this.socket && this.isConnected) {
      this.socket.send(JSON.stringify({
        type: 'get_account_info'
      }));
    }
  };

  requestPositions = () => {
    if (this.socket && this.isConnected) {
      this.socket.send(JSON.stringify({
        type: 'get_positions'
      }));
    }
  };

  placeOrder = (order: {
    symbol: string;
    type: 'buy' | 'sell';
    volume: number;
    price?: number;
    stopLoss?: number;
    takeProfit?: number;
  }) => {
    if (this.socket && this.isConnected) {
      this.socket.send(JSON.stringify({
        type: 'place_order',
        data: order
      }));
    }
  };

  closePosition = (ticket: number) => {
    if (this.socket && this.isConnected) {
      this.socket.send(JSON.stringify({
        type: 'close_position',
        data: { ticket }
      }));
    }
  };
}
