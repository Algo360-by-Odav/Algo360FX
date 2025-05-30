import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { MarketDataService } from './market-data.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('market-data')
@Controller('market-data')
export class MarketDataController {
  constructor(private readonly marketDataService: MarketDataService) {}

  @Get()
  @ApiOperation({ summary: 'Get all market data' })
  @ApiResponse({ status: 200, description: 'Returns all market data' })
  async findAll(
    @Query('type') type?: string,
    @Query('limit') limit?: number,
  ) {
    return this.marketDataService.findAll(type, limit);
  }

  @Get(':symbol')
  @ApiOperation({ summary: 'Get market data by symbol' })
  @ApiResponse({ status: 200, description: 'Returns market data for the symbol' })
  @ApiResponse({ status: 404, description: 'Symbol not found' })
  async findBySymbol(@Param('symbol') symbol: string) {
    return this.marketDataService.findBySymbol(symbol);
  }

  @Get('type/:type')
  @ApiOperation({ summary: 'Get market data by type' })
  @ApiResponse({ status: 200, description: 'Returns market data for the type' })
  async findByType(
    @Param('type') type: string,
    @Query('limit') limit?: number,
  ) {
    return this.marketDataService.findByType(type, limit);
  }

  // This endpoint requires authentication
  @Get('watchlist')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get market data for user watchlist' })
  @ApiResponse({ status: 200, description: 'Returns market data for user watchlist' })
  async getWatchlist(@Query('symbols') symbols: string) {
    const symbolList = symbols.split(',');
    return this.marketDataService.findBySymbols(symbolList);
  }
}
