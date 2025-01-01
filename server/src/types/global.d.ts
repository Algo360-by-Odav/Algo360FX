import { TradingWebSocketServer } from '../websocket/trading';
import { OptimizationWebSocketServer } from '../websocket/optimization';
import { Connection } from 'mongoose';

declare global {
  let tradingWsServer: TradingWebSocketServer | undefined;
  let optimizationWsServer: OptimizationWebSocketServer | undefined;
  let mongooseConnection: Connection | undefined;

  namespace NodeJS {
    interface Global {
      io: any;
      sockets: any;
      marketDataService: any;
    }
  }
}

export {};
