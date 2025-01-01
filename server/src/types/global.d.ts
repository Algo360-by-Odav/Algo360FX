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

  let tradingWsServer: TradingWebSocketServer | undefined;
  let optimizationWsServer: OptimizationWebSocketServer | undefined;
  let mongoose: { connection: Connection } | undefined;
}

export {};
