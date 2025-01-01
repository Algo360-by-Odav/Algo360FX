import { TradingWebSocketServer } from '../websocket/trading';
import { OptimizationWebSocketServer } from '../websocket/optimization';
import { Connection } from 'mongoose';

declare global {
  let globalThis: {
    tradingWsServer: TradingWebSocketServer | undefined;
    optimizationWsServer: OptimizationWebSocketServer | undefined;
    mongooseConnection: Connection | undefined;
  } & typeof globalThis;

  namespace NodeJS {
    interface Global {
      io: any;
      sockets: any;
      marketDataService: any;
    }
  }
}

export {};
