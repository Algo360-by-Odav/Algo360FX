import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Request } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
// @ts-ignore
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
// @ts-ignore
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
// @ts-ignore
import { CreatePositionDto } from './dto/create-position.dto';
// @ts-ignore
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('portfolio')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Get()
  @ApiOperation({ summary: 'Get all portfolios for the current user' })
  @ApiResponse({ status: 200, description: 'Returns all portfolios for the current user' })
  async findAll(@Request() req) {
    return this.portfolioService.findAll(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific portfolio' })
  @ApiResponse({ status: 200, description: 'Returns the portfolio' })
  @ApiResponse({ status: 404, description: 'Portfolio not found' })
  async findOne(@Param('id') id: string, @Request() req) {
    return this.portfolioService.findOne(id, req.user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new portfolio' })
  @ApiResponse({ status: 201, description: 'Portfolio created successfully' })
  async create(@Body() createPortfolioDto: CreatePortfolioDto, @Request() req) {
    return this.portfolioService.create(req.user.id, createPortfolioDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a portfolio' })
  @ApiResponse({ status: 200, description: 'Portfolio updated successfully' })
  @ApiResponse({ status: 404, description: 'Portfolio not found' })
  async update(
    @Param('id') id: string,
    @Body() updatePortfolioDto: UpdatePortfolioDto,
    @Request() req: any,
  ) {
    return this.portfolioService.update(id, req.user.id, updatePortfolioDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a portfolio' })
  @ApiResponse({ status: 200, description: 'Portfolio deleted successfully' })
  @ApiResponse({ status: 404, description: 'Portfolio not found' })
  async remove(@Param('id') id: string, @Request() req) {
    return this.portfolioService.remove(id, req.user.id);
  }

  // Positions endpoints
  @Get(':id/positions')
  @ApiOperation({ summary: 'Get all positions in a portfolio' })
  @ApiResponse({ status: 200, description: 'Returns all positions in the portfolio' })
  @ApiResponse({ status: 404, description: 'Portfolio not found' })
  async getPositions(@Param('id') portfolioId: string, @Request() req) {
    return this.portfolioService.getPositions(portfolioId, req.user.id);
  }

  @Post(':id/positions')
  @ApiOperation({ summary: 'Create a new position in a portfolio' })
  @ApiResponse({ status: 201, description: 'Position created successfully' })
  @ApiResponse({ status: 404, description: 'Portfolio not found' })
  async createPosition(
    @Param('id') portfolioId: string,
    @Body() createPositionDto: CreatePositionDto,
    @Request() req,
  ) {
    return this.portfolioService.createPosition(portfolioId, req.user.id, createPositionDto);
  }

  @Get('positions/:id')
  @ApiOperation({ summary: 'Get a specific position' })
  @ApiResponse({ status: 200, description: 'Returns the position' })
  @ApiResponse({ status: 404, description: 'Position not found' })
  async getPosition(@Param('id') id: string, @Request() req) {
    return this.portfolioService.getPosition(id, req.user.id);
  }

  @Put('positions/:id')
  @ApiOperation({ summary: 'Update a position' })
  @ApiResponse({ status: 200, description: 'Position updated successfully' })
  @ApiResponse({ status: 404, description: 'Position not found' })
  async updatePosition(
    @Param('id') id: string,
    @Body() updateData: any,
    @Request() req,
  ) {
    return this.portfolioService.updatePosition(id, req.user.id, updateData);
  }

  @Delete('positions/:id')
  @ApiOperation({ summary: 'Delete a position' })
  @ApiResponse({ status: 200, description: 'Position deleted successfully' })
  @ApiResponse({ status: 404, description: 'Position not found' })
  async removePosition(@Param('id') id: string, @Request() req) {
    return this.portfolioService.removePosition(id, req.user.id);
  }

  // Orders endpoints
  @Get('orders')
  @ApiOperation({ summary: 'Get all orders for the current user' })
  @ApiResponse({ status: 200, description: 'Returns all orders for the current user' })
  async getOrders(@Request() req) {
    return this.portfolioService.getOrders(req.user.id);
  }

  @Get('positions/:id/orders')
  @ApiOperation({ summary: 'Get all orders for a specific position' })
  @ApiResponse({ status: 200, description: 'Returns all orders for the position' })
  async getPositionOrders(@Param('id') positionId: string, @Request() req) {
    return this.portfolioService.getOrders(req.user.id, positionId);
  }

  @Post('orders')
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({ status: 201, description: 'Order created successfully' })
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @Request() req,
  ) {
    return this.portfolioService.createOrder(req.user.id, createOrderDto);
  }

  @Get('orders/:id')
  @ApiOperation({ summary: 'Get a specific order' })
  @ApiResponse({ status: 200, description: 'Returns the order' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async getOrder(@Param('id') id: string, @Request() req) {
    return this.portfolioService.getOrder(id, req.user.id);
  }

  @Put('orders/:id/cancel')
  @ApiOperation({ summary: 'Cancel an order' })
  @ApiResponse({ status: 200, description: 'Order cancelled successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async cancelOrder(@Param('id') id: string, @Request() req) {
    return this.portfolioService.cancelOrder(id, req.user.id);
  }

  // Portfolio performance
  @Get(':id/performance')
  @ApiOperation({ summary: 'Get portfolio performance statistics' })
  @ApiResponse({ status: 200, description: 'Returns the portfolio performance data' })
  @ApiResponse({ status: 404, description: 'Portfolio not found' })
  async getPortfolioPerformance(@Param('id') id: string, @Request() req) {
    return this.portfolioService.getPortfolioPerformance(id, req.user.id);
  }
}
