import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  Query, 
  UseGuards,
  Request 
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WalletService } from './wallet.service';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

@ApiTags('wallet')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get('balance')
  @ApiOperation({ summary: 'Get wallet balance' })
  @ApiResponse({ status: 200, description: 'Returns wallet balance information' })
  async getWalletBalance(@Request() req) {
    return this.walletService.getWalletBalance(req.user.id);
  }

  @Get('transactions')
  @ApiOperation({ summary: 'Get transaction history' })
  @ApiResponse({ status: 200, description: 'Returns transaction history' })
  async getTransactions(
    @Request() req,
    @Query('limit') limit = '10',
    @Query('offset') offset = '0',
    @Query('type') type?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('status') status?: string,
  ) {
    return this.walletService.getTransactions(req.user.id, {
      limit: parseInt(limit),
      offset: parseInt(offset),
      type,
      startDate,
      endDate,
      status,
    });
  }

  @Get('payment-methods')
  @ApiOperation({ summary: 'Get payment methods' })
  @ApiResponse({ status: 200, description: 'Returns payment methods' })
  async getPaymentMethods(@Request() req) {
    return this.walletService.getPaymentMethods(req.user.id);
  }

  @Post('payment-methods')
  @ApiOperation({ summary: 'Add payment method' })
  @ApiResponse({ status: 201, description: 'Returns the new payment method' })
  async addPaymentMethod(@Request() req, @Body() paymentMethod: any) {
    return this.walletService.addPaymentMethod(req.user.id, paymentMethod);
  }

  @Delete('payment-methods/:id')
  @ApiOperation({ summary: 'Remove payment method' })
  @ApiResponse({ status: 200, description: 'Returns success message' })
  async removePaymentMethod(@Request() req, @Param('id') id: string) {
    return this.walletService.removePaymentMethod(req.user.id, id);
  }

  @Put('payment-methods/:id/default')
  @ApiOperation({ summary: 'Set default payment method' })
  @ApiResponse({ status: 200, description: 'Returns updated payment method' })
  async setDefaultPaymentMethod(@Request() req, @Param('id') id: string) {
    return this.walletService.setDefaultPaymentMethod(req.user.id, id);
  }

  @Post('deposit')
  @ApiOperation({ summary: 'Process a deposit' })
  @ApiResponse({ status: 201, description: 'Returns deposit transaction' })
  async deposit(@Request() req, @Body() depositData: any) {
    return this.walletService.deposit(req.user.id, depositData);
  }

  @Post('withdraw')
  @ApiOperation({ summary: 'Process a withdrawal' })
  @ApiResponse({ status: 201, description: 'Returns withdrawal transaction' })
  async withdraw(@Request() req, @Body() withdrawData: any) {
    return this.walletService.withdraw(req.user.id, withdrawData);
  }

  @Post('transfer')
  @ApiOperation({ summary: 'Transfer funds' })
  @ApiResponse({ status: 201, description: 'Returns transfer transaction' })
  async transfer(@Request() req, @Body() transferData: any) {
    return this.walletService.transfer(req.user.id, transferData);
  }

  @Get('statements')
  @ApiOperation({ summary: 'Get wallet statements' })
  @ApiResponse({ status: 200, description: 'Returns wallet statement' })
  async getStatements(
    @Request() req,
    @Query('month') month: string,
    @Query('year') year: string,
  ) {
    return this.walletService.getStatements(req.user.id, {
      month: parseInt(month),
      year: parseInt(year),
    });
  }
}
