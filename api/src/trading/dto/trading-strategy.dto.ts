import { IsString, IsNotEmpty, IsObject, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateStrategyDto {
  @ApiProperty({ description: 'Name of the trading strategy' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: 'Description of the trading strategy' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ 
    description: 'Configuration for the trading strategy',
    example: {
      timeframe: '1h',
      indicators: {
        rsi: { period: 14, overbought: 70, oversold: 30 },
        macd: { fastPeriod: 12, slowPeriod: 26, signalPeriod: 9 }
      },
      entryConditions: ['rsi_oversold', 'macd_bullish_crossover'],
      exitConditions: ['rsi_overbought', 'take_profit_reached'],
      riskManagement: {
        stopLoss: 2.0,
        takeProfit: 4.0,
        maxRiskPerTrade: 1.0
      }
    }
  })
  @IsObject()
  @IsNotEmpty()
  config: Record<string, any>;

  @ApiPropertyOptional({ description: 'Whether the strategy is active' })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateStrategyDto {
  @ApiPropertyOptional({ description: 'Name of the trading strategy' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: 'Description of the trading strategy' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ 
    description: 'Configuration for the trading strategy',
    example: {
      timeframe: '1h',
      indicators: {
        rsi: { period: 14, overbought: 70, oversold: 30 },
        macd: { fastPeriod: 12, slowPeriod: 26, signalPeriod: 9 }
      },
      entryConditions: ['rsi_oversold', 'macd_bullish_crossover'],
      exitConditions: ['rsi_overbought', 'take_profit_reached'],
      riskManagement: {
        stopLoss: 2.0,
        takeProfit: 4.0,
        maxRiskPerTrade: 1.0
      }
    }
  })
  @IsObject()
  @IsOptional()
  config?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Whether the strategy is active' })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
