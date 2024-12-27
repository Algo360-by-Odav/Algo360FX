import { makeAutoObservable } from 'mobx';
import { RootStore } from './RootStore';
import WebSocketService from '../services/websocketService';

interface WebSocketSubscription {
  channel: string;
  callback?: (data: any) => void;
}

export class WebSocketStore {
  private subscriptions: WebSocketSubscription[] = [];
  public isConnected = false;
  public lastError: string | null = null;

  constructor(private rootStore: RootStore) {
    makeAutoObservable(this);
    this.setupWebSocket();
  }

  private setupWebSocket = () => {
    WebSocketService.subscribeToConnectionStatus((status) => {
      this.isConnected = status === 'connected';
      if (status === 'connected') {
        this.lastError = null;
        // Resubscribe to all channels
        this.subscriptions.forEach(sub => this.subscribe(sub.channel, sub.callback));
      }
    });
  };

  connect = () => {
    WebSocketService.connect();
  };

  subscribe = (channel: string, callback?: (data: any) => void) => {
    if (!this.subscriptions.find(sub => sub.channel === channel)) {
      this.subscriptions.push({ channel, callback });
    }

    if (this.isConnected) {
      WebSocketService.subscribe(channel, callback || (() => {}));
    }
  };

  unsubscribe = (channel: string) => {
    const index = this.subscriptions.findIndex(sub => sub.channel === channel);
    if (index !== -1) {
      this.subscriptions.splice(index, 1);
      if (this.isConnected) {
        WebSocketService.unsubscribe(channel, () => {});
      }
    }
  };

  disconnect = () => {
    WebSocketService.disconnect();
  };
}
