import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional, IsEnum } from 'class-validator';
import { OrderType } from './order-enums';

export class CreateOrderDto {
  @ApiProperty({ description: 'Order type', enum: OrderType, example: 'MARKET' })
  @IsEnum(OrderType)
  @IsNotEmpty()
  type: OrderType;

  @ApiProperty({ description: 'Trading symbol (e.g., EUR/USD, BTC/USD)', example: 'EUR/USD' })
  @IsString()
  @IsNotEmpty()
  symbol: string;

  @ApiProperty({ description: 'Quantity/size of the order', example: 10000 })
  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @ApiProperty({ description: 'Price for the order (required for LIMIT orders)', example: 1.1850, required: false })
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiProperty({ description: 'Stop price (required for STOP and STOP_LIMIT orders)', example: 1.1750, required: false })
  @IsNumber()
  @IsOptional()
  stopPrice?: number;

  @ApiProperty({ description: 'Limit price (required for LIMIT and STOP_LIMIT orders)', example: 1.1750, required: false })
  @IsNumber()
  @IsOptional()
  limitPrice?: number;

  @ApiProperty({ description: 'ID of the related position (if applicable)', example: 'clg3a5cde00001mv5f9h2i9qz', required: false })
  @IsString()
  @IsOptional()
  positionId?: string;
}
