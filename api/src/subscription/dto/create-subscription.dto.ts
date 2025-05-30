import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsBoolean, IsOptional, IsDateString } from 'class-validator';

export class CreateSubscriptionDto {
  @ApiProperty({ description: 'ID of the subscription plan', example: 'plan_basic' })
  @IsString()
  @IsNotEmpty()
  planId: string;

  @ApiProperty({ description: 'Start date of the subscription', example: '2025-05-27T00:00:00.000Z' })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiProperty({ description: 'Whether the subscription should auto-renew', example: true, default: true })
  @IsBoolean()
  @IsOptional()
  autoRenew?: boolean;

  @ApiProperty({ description: 'Payment method for the subscription', example: 'card_1234', required: false })
  @IsString()
  @IsOptional()
  paymentMethod?: string;
}
