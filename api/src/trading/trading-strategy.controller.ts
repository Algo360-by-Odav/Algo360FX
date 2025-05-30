import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TradingStrategyService } from './trading-strategy.service';
import { CreateStrategyDto, UpdateStrategyDto } from './dto/trading-strategy.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('trading-strategies')
@Controller('trading/strategies')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TradingStrategyController {
  constructor(private readonly tradingStrategyService: TradingStrategyService) {}

  @Get()
  @ApiOperation({ summary: 'Get all trading strategies for current user' })
  @ApiResponse({ status: 200, description: 'Returns all trading strategies' })
  async findAll(@Request() req) {
    return this.tradingStrategyService.findAll(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a trading strategy by ID' })
  @ApiResponse({ status: 200, description: 'Returns the trading strategy' })
  @ApiResponse({ status: 404, description: 'Trading strategy not found' })
  async findOne(@Param('id') id: string, @Request() req) {
    return this.tradingStrategyService.findOne(id, req.user.userId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new trading strategy' })
  @ApiResponse({ status: 201, description: 'Trading strategy created' })
  async create(@Body() createStrategyDto: CreateStrategyDto, @Request() req) {
    return this.tradingStrategyService.create(createStrategyDto, req.user.userId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a trading strategy' })
  @ApiResponse({ status: 200, description: 'Trading strategy updated' })
  @ApiResponse({ status: 404, description: 'Trading strategy not found' })
  async update(@Param('id') id: string, @Body() updateStrategyDto: UpdateStrategyDto, @Request() req) {
    return this.tradingStrategyService.update(id, updateStrategyDto, req.user.userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a trading strategy' })
  @ApiResponse({ status: 200, description: 'Trading strategy deleted' })
  @ApiResponse({ status: 404, description: 'Trading strategy not found' })
  async remove(@Param('id') id: string, @Request() req) {
    return this.tradingStrategyService.remove(id, req.user.userId);
  }

  @Post(':id/activate')
  @ApiOperation({ summary: 'Activate a trading strategy' })
  @ApiResponse({ status: 200, description: 'Trading strategy activated' })
  @ApiResponse({ status: 404, description: 'Trading strategy not found' })
  async activate(@Param('id') id: string, @Request() req) {
    return this.tradingStrategyService.setActiveStatus(id, req.user.userId, true);
  }

  @Post(':id/deactivate')
  @ApiOperation({ summary: 'Deactivate a trading strategy' })
  @ApiResponse({ status: 200, description: 'Trading strategy deactivated' })
  @ApiResponse({ status: 404, description: 'Trading strategy not found' })
  async deactivate(@Param('id') id: string, @Request() req) {
    return this.tradingStrategyService.setActiveStatus(id, req.user.userId, false);
  }
}
