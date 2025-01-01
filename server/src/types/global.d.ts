import { TradingWebSocketServer } from '../websocket/trading';
import { OptimizationWebSocketServer } from '../websocket/optimization';
import { Connection } from 'mongoose';

declare global {
  var tradingWsServer: TradingWebSocketServer | undefined;
  var optimizationWsServer: OptimizationWebSocketServer | undefined;
  var mongooseConnection: Connection | undefined;

  namespace NodeJS {
    interface Global {
      io: any;
      sockets: any;
      marketDataService: any;
    }
  }
}

export {};
