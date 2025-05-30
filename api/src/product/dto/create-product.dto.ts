import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsEnum, IsBoolean, IsOptional, IsObject } from 'class-validator';
import { ProductType } from './product-enums';

export class CreateProductDto {
  @ApiProperty({ description: 'Product name', example: 'Algorithmic Trading Fundamentals' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Product description', example: 'Learn the basics of algorithmic trading and how to build your first trading bot.' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Product type', enum: ProductType, example: 'EBOOK' })
  @IsEnum(ProductType)
  @IsNotEmpty()
  type: ProductType;

  @ApiProperty({ description: 'Product price', example: 29.99 })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({ description: 'Product currency', example: 'USD', default: 'USD' })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiProperty({ description: 'Product metadata (varies by product type)', example: '{ "author": "Dr. Sarah Johnson", "pages": 250 }' })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;

  @ApiProperty({ description: 'Whether the product is active', example: true, default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
