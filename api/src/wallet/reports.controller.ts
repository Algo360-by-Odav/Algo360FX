import { 
  Controller, 
  Get, 
  Query, 
  UseGuards,
  Request,
  ParseIntPipe,
  BadRequestException
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ReportsService } from './reports.service';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

@ApiTags('wallet-reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('wallet/reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('monthly')
  @ApiOperation({ summary: 'Generate monthly financial report' })
  @ApiResponse({ status: 200, description: 'Returns monthly financial report' })
  async getMonthlyReport(
    @Request() req,
    @Query('year', ParseIntPipe) year: number,
    @Query('month', ParseIntPipe) month: number
  ) {
    if (month < 1 || month > 12) {
      throw new BadRequestException('Month must be between 1 and 12');
    }
    
    return this.reportsService.generateMonthlyReport(req.user.id, year, month);
  }

  @Get('yearly')
  @ApiOperation({ summary: 'Generate yearly financial report' })
  @ApiResponse({ status: 200, description: 'Returns yearly financial report' })
  async getYearlyReport(
    @Request() req,
    @Query('year', ParseIntPipe) year: number
  ) {
    return this.reportsService.generateYearlyReport(req.user.id, year);
  }

  @Get('analytics')
  @ApiOperation({ summary: 'Get wallet analytics' })
  @ApiResponse({ status: 200, description: 'Returns wallet analytics' })
  async getWalletAnalytics(
    @Request() req,
    @Query('startDate') startDateStr?: string,
    @Query('endDate') endDateStr?: string
  ) {
    let startDate: Date | undefined;
    let endDate: Date | undefined;
    
    if (startDateStr) {
      startDate = new Date(startDateStr);
      if (isNaN(startDate.getTime())) {
        throw new BadRequestException('Invalid startDate format');
      }
    }
    
    if (endDateStr) {
      endDate = new Date(endDateStr);
      if (isNaN(endDate.getTime())) {
        throw new BadRequestException('Invalid endDate format');
      }
    }
    
    return this.reportsService.getWalletAnalytics(req.user.id, startDate, endDate);
  }
}
