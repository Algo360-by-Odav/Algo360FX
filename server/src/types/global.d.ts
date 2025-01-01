import { TradingWebSocketServer } from '../websocket/trading';
import { OptimizationWebSocketServer } from '../websocket/optimization';
import { Connection } from 'mongoose';

declare global {
  namespace NodeJS {
    interface Global {
      io: any;
      sockets: any;
      marketDataService: any;
    }
  }

  var tradingWsServer: TradingWebSocketServer | undefined;
  var optimizationWsServer: OptimizationWebSocketServer | undefined;
  var mongoose: { connection: Connection } | undefined;
}

export {};
