import WebSocket from 'ws';
import { Server } from 'http';
import { logger } from '../../utils/logger';
import { MarketDataService } from '../marketData.service';
import { AIAssistantService } from '../aiAssistant.service';

interface WSMessage {
  type: 'market_data' | 'ai_update' | 'trading_signal' | 'subscribe' | 'unsubscribe';
  data: any;
}

export class WebSocketServer {
  private wss: WebSocket.Server;
  private marketDataService: MarketDataService;
  private aiAssistantService: AIAssistantService;
  private subscribers: Map<string, Set<WebSocket>> = new Map();
  private updateInterval: NodeJS.Timeout | null = null;

  constructor(server: Server) {
    this.wss = new WebSocket.Server({ server });
    this.marketDataService = new MarketDataService();
    this.aiAssistantService = new AIAssistantService();
    this.initialize();
  }

  private initialize() {
    this.wss.on('connection', (ws: WebSocket) => {
      logger.info('New WebSocket connection established');

      ws.on('message', async (message: string) => {
        try {
          const parsedMessage: WSMessage = JSON.parse(message);
          await this.handleMessage(ws, parsedMessage);
        } catch (error) {
          logger.error('Error handling WebSocket message:', error);
          this.sendError(ws, 'Invalid message format');
        }
      });

      ws.on('close', () => {
        this.handleDisconnect(ws);
      });

      // Send initial connection success message
      this.send(ws, {
        type: 'connection_status',
        data: { status: 'connected', timestamp: new Date().toISOString() }
      });
    });

    // Start periodic updates
    this.startPeriodicUpdates();
  }

  private async handleMessage(ws: WebSocket, message: WSMessage) {
    switch (message.type) {
      case 'subscribe':
        await this.handleSubscribe(ws, message.data);
        break;
      case 'unsubscribe':
        await this.handleUnsubscribe(ws, message.data);
        break;
      default:
        this.sendError(ws, 'Unknown message type');
    }
  }

  private async handleSubscribe(ws: WebSocket, data: { symbols: string[], timeframe: string }) {
    const { symbols, timeframe } = data;

    symbols.forEach(symbol => {
      if (!this.subscribers.has(symbol)) {
        this.subscribers.set(symbol, new Set());
      }
      this.subscribers.get(symbol)?.add(ws);
    });

    // Send initial data
    try {
      const marketData = await this.marketDataService.getMarketData(symbols, timeframe);
      this.send(ws, {
        type: 'market_data',
        data: { marketData, timestamp: new Date().toISOString() }
      });

      // Generate initial AI analysis
      const context = {
        previousMessages: [],
        user: null,
        selectedMarkets: symbols,
        timeframe
      };

      const aiResponse = await this.aiAssistantService.processChat(
        'Provide market analysis and trading signals',
        context
      );

      this.send(ws, {
        type: 'ai_update',
        data: { analysis: aiResponse, timestamp: new Date().toISOString() }
      });
    } catch (error) {
      logger.error('Error sending initial data:', error);
      this.sendError(ws, 'Error fetching initial data');
    }
  }

  private handleUnsubscribe(ws: WebSocket, data: { symbols: string[] }) {
    data.symbols.forEach(symbol => {
      this.subscribers.get(symbol)?.delete(ws);
      if (this.subscribers.get(symbol)?.size === 0) {
        this.subscribers.delete(symbol);
      }
    });
  }

  private handleDisconnect(ws: WebSocket) {
    this.subscribers.forEach((subscribers, symbol) => {
      if (subscribers.has(ws)) {
        subscribers.delete(ws);
        if (subscribers.size === 0) {
          this.subscribers.delete(symbol);
        }
      }
    });
  }

  private startPeriodicUpdates() {
    const updateInterval = parseInt(process.env.AI_UPDATE_INTERVAL || '300000', 10);
    
    this.updateInterval = setInterval(async () => {
      for (const [symbol, subscribers] of this.subscribers) {
        if (subscribers.size > 0) {
          try {
            // Get updated market data
            const marketData = await this.marketDataService.getMarketData([symbol], '1m');
            
            // Generate AI analysis
            const context = {
              previousMessages: [],
              user: null,
              selectedMarkets: [symbol],
              timeframe: '1m'
            };

            const aiResponse = await this.aiAssistantService.processChat(
              'Provide updated market analysis and trading signals',
              context
            );

            // Broadcast updates to all subscribers
            subscribers.forEach(ws => {
              if (ws.readyState === WebSocket.OPEN) {
                this.send(ws, {
                  type: 'market_data',
                  data: { marketData, timestamp: new Date().toISOString() }
                });

                this.send(ws, {
                  type: 'ai_update',
                  data: { analysis: aiResponse, timestamp: new Date().toISOString() }
                });
              }
            });
          } catch (error) {
            logger.error(`Error updating data for ${symbol}:`, error);
          }
        }
      }
    }, updateInterval);
  }

  private send(ws: WebSocket, message: any) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  }

  private sendError(ws: WebSocket, error: string) {
    this.send(ws, {
      type: 'error',
      data: { error, timestamp: new Date().toISOString() }
    });
  }

  public stop() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
    this.wss.close();
  }
}
