import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreatePositionDto {
  @ApiProperty({ description: 'Trading symbol (e.g., EUR/USD, BTC/USD)', example: 'EUR/USD' })
  @IsString()
  @IsNotEmpty()
  symbol: string;

  @ApiProperty({ description: 'Quantity/size of the position', example: 10000 })
  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @ApiProperty({ description: 'Entry price of the position', example: 1.1850 })
  @IsNumber()
  @IsNotEmpty()
  entryPrice: number;

  @ApiProperty({ description: 'Current price of the asset', example: 1.1920, required: false })
  @IsNumber()
  @IsOptional()
  currentPrice?: number;
}
