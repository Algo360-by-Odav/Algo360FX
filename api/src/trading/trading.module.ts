import { Module } from '@nestjs/common';
import { TradingStrategyController } from './trading-strategy.controller';
import { TradingStrategyService } from './trading-strategy.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TradingStrategyController],
  providers: [TradingStrategyService],
  exports: [TradingStrategyService],
})
export class TradingModule {}
