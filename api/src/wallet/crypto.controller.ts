import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Query, 
  UseGuards,
  Request,
  Param
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CryptoService } from './crypto.service';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

@ApiTags('crypto')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('wallet/crypto')
export class CryptoController {
  constructor(private readonly cryptoService: CryptoService) {}

  @Get('wallets')
  @ApiOperation({ summary: 'Get all crypto wallets for user' })
  @ApiResponse({ status: 200, description: 'Returns list of crypto wallets' })
  async getCryptoWallets(@Request() req) {
    return this.cryptoService.getCryptoWallets(req.user.id);
  }

  @Get('wallets/:cryptoType')
  @ApiOperation({ summary: 'Get specific crypto wallet' })
  @ApiResponse({ status: 200, description: 'Returns crypto wallet details' })
  async getCryptoWallet(
    @Request() req,
    @Param('cryptoType') cryptoType: string
  ) {
    return this.cryptoService.getCryptoWallet(req.user.id, cryptoType);
  }

  @Post('wallets')
  @ApiOperation({ summary: 'Create a new crypto wallet' })
  @ApiResponse({ status: 201, description: 'Returns the created wallet' })
  async createCryptoWallet(
    @Request() req,
    @Body() data: { cryptoType: string }
  ) {
    return this.cryptoService.createCryptoWallet(req.user.id, data.cryptoType);
  }

  @Post('deposit')
  @ApiOperation({ summary: 'Deposit cryptocurrency' })
  @ApiResponse({ status: 201, description: 'Returns the deposit transaction' })
  async depositCrypto(
    @Request() req,
    @Body() data: { cryptoType: string, amount: number, fromAddress?: string }
  ) {
    return this.cryptoService.depositCrypto(req.user.id, data);
  }

  @Post('withdraw')
  @ApiOperation({ summary: 'Withdraw cryptocurrency' })
  @ApiResponse({ status: 201, description: 'Returns the withdrawal transaction' })
  async withdrawCrypto(
    @Request() req,
    @Body() data: { cryptoType: string, amount: number, toAddress: string }
  ) {
    return this.cryptoService.withdrawCrypto(req.user.id, data);
  }

  @Post('transfer')
  @ApiOperation({ summary: 'Transfer between crypto wallets' })
  @ApiResponse({ status: 201, description: 'Returns the transfer transaction' })
  async transferCrypto(
    @Request() req,
    @Body() data: { fromCryptoType: string, toCryptoType: string, amount: number }
  ) {
    return this.cryptoService.transferCrypto(req.user.id, data);
  }

  @Get('transactions')
  @ApiOperation({ summary: 'Get crypto transaction history' })
  @ApiResponse({ status: 200, description: 'Returns transaction history' })
  async getCryptoTransactions(
    @Request() req,
    @Query('cryptoType') cryptoType?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Query('type') type?: string,
    @Query('status') status?: string
  ) {
    return this.cryptoService.getCryptoTransactions(req.user.id, {
      cryptoType,
      limit: limit ? parseInt(limit) : 10,
      offset: offset ? parseInt(offset) : 0,
      type,
      status
    });
  }
}
