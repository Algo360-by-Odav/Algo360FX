import { WebSocket, Server } from 'ws';
import { Server as HttpServer } from 'http';
import { WebSocketClient, OrderMessage } from '../types/websocket';
import { WebSocketBase } from './websocket';
import { logger } from '../utils/logger';

export class TradingWebSocket extends WebSocketBase {
  protected orders: Map<string, any>;

  constructor(server: HttpServer) {
    super(server);
    this.orders = new Map();
  }

  protected async handleMessage(ws: WebSocket, data: OrderMessage): Promise<void> {
    try {
      switch (data.type) {
        case 'placeOrder':
          if (data.symbol && data.orderType && data.side && data.quantity) {
            await this.handlePlaceOrder(ws, data);
          } else {
            this.sendError(ws, 'Invalid place order message: missing required fields');
          }
          break;
        case 'cancelOrder':
          if (data.orderId) {
            await this.handleCancelOrder(ws, data.orderId);
          } else {
            this.sendError(ws, 'Invalid cancel order message: missing orderId');
          }
          break;
        case 'modifyOrder':
          if (data.orderId) {
            await this.handleModifyOrder(ws, data);
          } else {
            this.sendError(ws, 'Invalid modify order message: missing orderId');
          }
          break;
        default:
          this.sendError(ws, `Unknown message type: ${data.type}`);
      }
    } catch (error) {
      const err = error as Error;
      logger.error('Error handling trading message:', err);
      ws.send(JSON.stringify({
        type: 'error',
        data: { message: err.message }
      }));
    }
  }

  private async handlePlaceOrder(ws: WebSocket, order: OrderMessage): Promise<void> {
    // Placeholder for order placement logic
    const orderId = Math.random().toString(36).substring(7);
    this.orders.set(orderId, { ...order, status: 'pending' });
    
    ws.send(JSON.stringify({
      type: 'orderPlaced',
      data: {
        orderId,
        status: 'pending',
        message: 'Order placed successfully'
      }
    }));
  }

  private async handleCancelOrder(ws: WebSocket, orderId: string): Promise<void> {
    if (this.orders.has(orderId)) {
      this.orders.delete(orderId);
      ws.send(JSON.stringify({
        type: 'orderCancelled',
        data: {
          orderId,
          message: 'Order cancelled successfully'
        }
      }));
    } else {
      this.sendError(ws, `Order not found: ${orderId}`);
    }
  }

  private async handleModifyOrder(ws: WebSocket, order: OrderMessage): Promise<void> {
    if (this.orders.has(order.orderId!)) {
      const existingOrder = this.orders.get(order.orderId!);
      this.orders.set(order.orderId!, { ...existingOrder, ...order });
      
      ws.send(JSON.stringify({
        type: 'orderModified',
        data: {
          orderId: order.orderId,
          message: 'Order modified successfully'
        }
      }));
    } else {
      this.sendError(ws, `Order not found: ${order.orderId}`);
    }
  }

  private sendError(ws: WebSocket, message: string): void {
    ws.send(JSON.stringify({
      type: 'error',
      data: { message }
    }));
  }
}
