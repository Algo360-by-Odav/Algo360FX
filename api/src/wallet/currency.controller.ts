import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Query, 
  UseGuards,
  Request,
  Param,
  Put
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrencyService } from './currency.service';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

@ApiTags('wallet-currency')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('wallet/currency')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Get('wallets')
  @ApiOperation({ summary: 'Get all currency wallets for user' })
  @ApiResponse({ status: 200, description: 'Returns list of currency wallets' })
  async getCurrencyWallets(@Request() req) {
    return this.currencyService.getCurrencyWallets(req.user.id);
  }

  @Get('wallets/:currency')
  @ApiOperation({ summary: 'Get specific currency wallet' })
  @ApiResponse({ status: 200, description: 'Returns currency wallet details' })
  async getCurrencyWallet(
    @Request() req,
    @Param('currency') currency: string
  ) {
    return this.currencyService.getCurrencyWallet(req.user.id, currency);
  }

  @Post('wallets')
  @ApiOperation({ summary: 'Create a new currency wallet' })
  @ApiResponse({ status: 201, description: 'Returns the created wallet' })
  async createCurrencyWallet(
    @Request() req,
    @Body() data: { currency: string }
  ) {
    return this.currencyService.createCurrencyWallet(req.user.id, data.currency);
  }

  @Put('wallets/:currency/default')
  @ApiOperation({ summary: 'Set currency wallet as default' })
  @ApiResponse({ status: 200, description: 'Returns the updated wallet' })
  async setDefaultCurrencyWallet(
    @Request() req,
    @Param('currency') currency: string
  ) {
    return this.currencyService.setDefaultCurrencyWallet(req.user.id, currency);
  }

  @Post('deposit')
  @ApiOperation({ summary: 'Deposit to currency wallet' })
  @ApiResponse({ status: 201, description: 'Returns the deposit transaction' })
  async deposit(
    @Request() req,
    @Body() data: { currency: string, amount: number, paymentMethodId?: string }
  ) {
    return this.currencyService.deposit(req.user.id, data);
  }

  @Post('withdraw')
  @ApiOperation({ summary: 'Withdraw from currency wallet' })
  @ApiResponse({ status: 201, description: 'Returns the withdrawal transaction' })
  async withdraw(
    @Request() req,
    @Body() data: { currency: string, amount: number, paymentMethodId: string }
  ) {
    return this.currencyService.withdraw(req.user.id, data);
  }

  @Post('convert')
  @ApiOperation({ summary: 'Convert between currencies' })
  @ApiResponse({ status: 201, description: 'Returns the conversion details' })
  async convertCurrency(
    @Request() req,
    @Body() data: { fromCurrency: string, toCurrency: string, amount: number }
  ) {
    return this.currencyService.convertCurrency(req.user.id, data);
  }

  @Get('transactions')
  @ApiOperation({ summary: 'Get currency transaction history' })
  @ApiResponse({ status: 200, description: 'Returns transaction history' })
  async getTransactions(
    @Request() req,
    @Query('currency') currency?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Query('type') type?: string,
    @Query('status') status?: string
  ) {
    return this.currencyService.getTransactions(req.user.id, {
      currency,
      limit: limit ? parseInt(limit) : 10,
      offset: offset ? parseInt(offset) : 0,
      type,
      status
    });
  }
}
