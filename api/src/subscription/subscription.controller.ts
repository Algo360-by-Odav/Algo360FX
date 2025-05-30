import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Request } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
// @ts-ignore
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
// @ts-ignore
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('subscription')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Get()
  @ApiOperation({ summary: 'Get all subscriptions for the current user' })
  @ApiResponse({ status: 200, description: 'Returns all subscriptions for the current user' })
  async findAll(@Request() req: any) {
    return this.subscriptionService.findAll(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific subscription' })
  @ApiResponse({ status: 200, description: 'Returns the subscription' })
  @ApiResponse({ status: 404, description: 'Subscription not found' })
  async findOne(@Param('id') id: string, @Request() req: any) {
    return this.subscriptionService.findOne(id, req.user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new subscription' })
  @ApiResponse({ status: 201, description: 'Subscription created successfully' })
  async create(@Body() createSubscriptionDto: CreateSubscriptionDto, @Request() req: any) {
    return this.subscriptionService.create(req.user.id, createSubscriptionDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a subscription' })
  @ApiResponse({ status: 200, description: 'Subscription updated successfully' })
  @ApiResponse({ status: 404, description: 'Subscription not found' })
  async update(
    @Param('id') id: string,
    @Body() updateSubscriptionDto: UpdateSubscriptionDto,
    @Request() req: any,
  ) {
    return this.subscriptionService.update(id, req.user.id, updateSubscriptionDto);
  }

  @Put(':id/cancel')
  @ApiOperation({ summary: 'Cancel a subscription' })
  @ApiResponse({ status: 200, description: 'Subscription cancelled successfully' })
  @ApiResponse({ status: 404, description: 'Subscription not found' })
  async cancel(@Param('id') id: string, @Request() req: any) {
    return this.subscriptionService.cancel(id, req.user.id);
  }

  @Get('status/check')
  @ApiOperation({ summary: 'Check if user has active subscriptions' })
  @ApiResponse({ status: 200, description: 'Returns subscription status information' })
  async checkStatus(@Request() req: any, @Body() body: { planId?: string }) {
    return this.subscriptionService.checkSubscriptionStatus(req.user.id, body.planId);
  }
}
