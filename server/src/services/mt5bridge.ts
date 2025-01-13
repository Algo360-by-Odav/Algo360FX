import WebSocket, { WebSocketServer } from 'ws';
import MetaApi from 'metaapi.cloud-sdk';
import dotenv from 'dotenv';
import { config } from '../config/config';
import { prisma } from '../config/database';
import { Trade, Signal } from '@prisma/client';
import { openAIService } from './ai/openai.service';

dotenv.config();

const WS_PORT = parseInt(process.env.MT5_WS_PORT || '6780');

interface MT5Connection {
  ws: WebSocket;
  account?: any;
  terminal?: any;
  userId: string;
}

interface OrderRequest {
  symbol: string;
  volume: number;
  price: number;
  type: 'MARKET' | 'LIMIT' | 'STOP';
  stopLoss?: number;
  takeProfit?: number;
  comment?: string;
}

export class MT5Bridge {
  private wss: WebSocketServer;
  private metaApi: MetaApi;
  private connections: Map<string, MT5Connection> = new Map();

  constructor(metaApi: MetaApi) {
    this.metaApi = metaApi;
    this.wss = new WebSocketServer({ port: WS_PORT });
  }

  public async start(): Promise<void> {
    try {
      console.log(`MT5 Bridge starting on port ${WS_PORT}`);

      this.wss.on('connection', (ws: WebSocket) => {
        const connectionId = Math.random().toString(36).substring(7);
        this.connections.set(connectionId, { ws, userId: '' });
        console.log(`New connection established: ${connectionId}`);

        ws.on('message', async (message: WebSocket.RawData) => {
          try {
            const data = JSON.parse(message.toString());
            await this.handleMessage(connectionId, data);
          } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to process message';
            console.error('Error handling message:', error);
            ws.send(JSON.stringify({
              type: 'error',
              data: errorMessage
            }));
          }
        });

        ws.on('close', () => {
          const connection = this.connections.get(connectionId);
          if (connection?.terminal) {
            connection.terminal.disconnect();
          }
          this.connections.delete(connectionId);
          console.log(`Connection closed: ${connectionId}`);
        });
      });

      console.log(`MT5 Bridge Server running on port ${WS_PORT}`);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to start MT5 Bridge';
      console.error('Error starting MT5 Bridge:', error);
      throw new Error(errorMessage);
    }
  }

  private async handleMessage(connectionId: string, message: any): Promise<void> {
    const connection = this.connections.get(connectionId);
    if (!connection) return;

    const { ws } = connection;

    switch (message.type) {
      case 'connect':
        try {
          const terminal = await this.metaApi.metatraderAccountApi.getAccount(message.data.accountId);
          if (!terminal) throw new Error('Account not found');

          connection.terminal = terminal;
          connection.userId = message.data.userId;
          await this.startUpdates(connectionId);

          ws.send(JSON.stringify({
            type: 'connected',
            data: { accountId: message.data.accountId }
          }));
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to connect to MT5';
          ws.send(JSON.stringify({
            type: 'error',
            data: errorMessage
          }));
        }
        break;

      case 'place_order':
        try {
          await this.placeOrder(connectionId, message.data);
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to place order';
          ws.send(JSON.stringify({
            type: 'error',
            data: errorMessage
          }));
        }
        break;

      case 'close_position':
        try {
          await this.closePosition(connectionId, message.data.positionId);
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to close position';
          ws.send(JSON.stringify({
            type: 'error',
            data: errorMessage
          }));
        }
        break;

      case 'modify_position':
        try {
          await this.modifyPosition(connectionId, message.data);
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to modify position';
          ws.send(JSON.stringify({
            type: 'error',
            data: errorMessage
          }));
        }
        break;

      case 'get_positions':
        try {
          await this.getPositions(connectionId);
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to get positions';
          ws.send(JSON.stringify({
            type: 'error',
            data: errorMessage
          }));
        }
        break;

      default:
        ws.send(JSON.stringify({
          type: 'error',
          data: 'Unknown message type'
        }));
    }
  }

  private async placeOrder(connectionId: string, orderRequest: OrderRequest): Promise<void> {
    const connection = this.connections.get(connectionId);
    if (!connection || !connection.terminal) throw new Error('Not connected to MT5');

    const { ws, terminal, userId } = connection;
    const { symbol, volume, price, type, stopLoss, takeProfit, comment } = orderRequest;

    let result;
    if (type === 'MARKET') {
      result = await terminal.createMarketBuyOrder(
        symbol,
        volume,
        stopLoss,
        takeProfit,
        { comment: comment || 'Order from Algo360FX' }
      );
    } else if (type === 'LIMIT') {
      result = await terminal.createLimitBuyOrder(
        symbol,
        volume,
        price,
        stopLoss,
        takeProfit,
        { comment: comment || 'Order from Algo360FX' }
      );
    } else {
      result = await terminal.createStopBuyOrder(
        symbol,
        volume,
        price,
        stopLoss,
        takeProfit,
        { comment: comment || 'Order from Algo360FX' }
      );
    }

    // Save trade to database
    const trade = await prisma.trade.create({
      data: {
        userId,
        symbol,
        type,
        volume,
        openPrice: price,
        openTime: new Date(),
        status: 'OPEN',
      }
    });

    // Generate AI analysis for the trade
    const analysis = await openAIService.generateAnalysis(
      {
        trade,
        orderType: type,
        symbol,
        volume,
        price,
        stopLoss,
        takeProfit
      },
      userId,
      {
        temperature: 0.7,
        maxTokens: 1000,
        useCache: true
      }
    );

    ws.send(JSON.stringify({
      type: 'order_placed',
      data: {
        result,
        trade,
        analysis
      }
    }));
  }

  private async closePosition(connectionId: string, positionId: string): Promise<void> {
    const connection = this.connections.get(connectionId);
    if (!connection || !connection.terminal) throw new Error('Not connected to MT5');

    const { ws, terminal, userId } = connection;

    const result = await terminal.closePosition(positionId);

    // Update trade in database
    const trade = await prisma.trade.update({
      where: { id: positionId },
      data: {
        closePrice: result.closePrice,
        closeTime: new Date(),
        profit: result.profit,
        status: 'CLOSED',
      }
    });

    ws.send(JSON.stringify({
      type: 'position_closed',
      data: {
        result,
        trade
      }
    }));
  }

  private async modifyPosition(connectionId: string, data: any): Promise<void> {
    const connection = this.connections.get(connectionId);
    if (!connection || !connection.terminal) throw new Error('Not connected to MT5');

    const { ws, terminal } = connection;
    const { positionId, stopLoss, takeProfit } = data;

    const result = await terminal.modifyPosition(positionId, stopLoss, takeProfit);

    ws.send(JSON.stringify({
      type: 'position_modified',
      data: result
    }));
  }

  private async getPositions(connectionId: string): Promise<void> {
    const connection = this.connections.get(connectionId);
    if (!connection || !connection.terminal) throw new Error('Not connected to MT5');

    const { ws, terminal, userId } = connection;

    const positions = await terminal.getPositions();
    const trades = await prisma.trade.findMany({
      where: {
        userId,
        status: 'OPEN'
      }
    });

    ws.send(JSON.stringify({
      type: 'positions',
      data: {
        mt5Positions: positions,
        trades
      }
    }));
  }

  private async startUpdates(connectionId: string): Promise<void> {
    const connection = this.connections.get(connectionId);
    if (!connection || !connection.terminal) return;

    const { ws, terminal, userId } = connection;

    try {
      // Subscribe to price updates for common pairs
      const commonPairs = ['EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD', 'USDCAD'];
      for (const pair of commonPairs) {
        await terminal.subscribeToMarketData(pair);
      }

      // Listen for updates
      terminal.on('onSymbolPriceUpdated', (price: any) => {
        ws.send(JSON.stringify({
          type: 'price_update',
          data: price
        }));
      });

      // Listen for position updates
      terminal.on('onPositionUpdated', async (position: any) => {
        // Update trade in database
        const trade = await prisma.trade.update({
          where: {
            id: position.id
          },
          data: {
            closePrice: position.currentPrice,
            profit: position.unrealizedProfit,
          }
        });

        ws.send(JSON.stringify({
          type: 'position_update',
          data: {
            position,
            trade
          }
        }));
      });

      // Listen for order updates
      terminal.on('onOrderUpdated', async (order: any) => {
        // Create signal in database
        const signal = await prisma.signal.create({
          data: {
            userId,
            symbol: order.symbol,
            type: order.type,
            openPrice: order.openPrice,
            openTime: new Date(order.openTime),
            status: 'NEW'
          }
        });

        ws.send(JSON.stringify({
          type: 'order_update',
          data: {
            order,
            signal
          }
        }));
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to start updates';
      console.error('Failed to start updates:', error);
      ws.send(JSON.stringify({
        type: 'error',
        data: errorMessage
      }));
    }
  }

  public stop(): void {
    try {
      // Close all connections
      this.connections.forEach(connection => {
        if (connection.terminal) {
          connection.terminal.disconnect();
        }
        if (connection.ws.readyState === WebSocket.OPEN) {
          connection.ws.close();
        }
      });

      // Clear connections
      this.connections.clear();

      // Close WebSocket server
      this.wss.close();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to stop MT5 Bridge';
      console.error('Error stopping MT5 Bridge:', error);
      throw new Error(errorMessage);
    }
  }
}

export default MT5Bridge;
