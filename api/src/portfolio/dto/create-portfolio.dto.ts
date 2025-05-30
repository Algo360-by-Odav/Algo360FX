import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsNumber, IsObject } from 'class-validator';

export class CreatePortfolioDto {
  @ApiProperty({ description: 'Portfolio name', example: 'My Trading Portfolio' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Portfolio description', example: 'My primary trading portfolio for forex and crypto', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Initial balance', example: 10000, default: 0 })
  @IsNumber()
  @IsOptional()
  balance?: number;

  @ApiProperty({ description: 'Portfolio currency', example: 'USD', default: 'USD' })
  @IsString()
  @IsOptional()
  currency?: string;
}
