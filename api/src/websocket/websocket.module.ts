import { Module } from '@nestjs/common';
import { WebSocketGateway } from './websocket.gateway';
import { TradingDataGateway } from './trading-data.gateway';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [WebSocketGateway, TradingDataGateway],
})
export class WebSocketModule {}
