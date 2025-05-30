import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { WebSocketModule } from './websocket/websocket.module';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';
import { HealthModule } from './health/health.module';
import { MockModule } from './mock/mock.module';
import { TradingModule } from './trading/trading.module';
import { MarketDataModule } from './market-data/market-data.module';
import { PortfolioModule } from './portfolio/portfolio.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { ProductModule } from './product/product.module';
import { WalletModule } from './wallet/wallet.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.production'],
    }),
    AuthModule,
    UsersModule,
    WebSocketModule,
    PrismaModule,
    RedisModule,
    HealthModule,
    MockModule,
    TradingModule,
    MarketDataModule,
    PortfolioModule,
    SubscriptionModule,
    ProductModule,
    WalletModule,
  ],
})
export class AppModule {}
