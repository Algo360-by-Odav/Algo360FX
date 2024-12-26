import { Module } from '@nestjs/common';
import { WebSocketGateway } from './websocket.gateway';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [WebSocketGateway],
})
export class WebSocketModule {}
