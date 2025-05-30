import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MockService } from './mock.service';

@ApiTags('mock')
@Controller('mock')
export class MockController {
  constructor(private readonly mockService: MockService) {}

  @Get('market-data')
  @ApiOperation({ summary: 'Get mock market data' })
  @ApiResponse({ status: 200, description: 'Returns mock market data for development' })
  getMarketData() {
    return this.mockService.getMarketData();
  }

  @Get('trading-strategies')
  @ApiOperation({ summary: 'Get mock trading strategies' })
  @ApiResponse({ status: 200, description: 'Returns mock trading strategies for development' })
  getTradingStrategies() {
    return this.mockService.getTradingStrategies();
  }

  @Get('subscription-plans')
  @ApiOperation({ summary: 'Get mock subscription plans' })
  @ApiResponse({ status: 200, description: 'Returns mock subscription plans for development' })
  getSubscriptionPlans() {
    return this.mockService.getSubscriptionPlans();
  }

  @Get('marketplace')
  @ApiOperation({ summary: 'Get mock marketplace items' })
  @ApiResponse({ status: 200, description: 'Returns mock marketplace items for development' })
  getMarketplaceItems() {
    return this.mockService.getMarketplaceItems();
  }
}
