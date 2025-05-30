import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStrategyDto, UpdateStrategyDto } from './dto/trading-strategy.dto';

@Injectable()
export class TradingStrategyService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.tradingStrategy.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const strategy = await this.prisma.tradingStrategy.findFirst({
      where: { id, userId },
    });

    if (!strategy) {
      throw new NotFoundException(`Trading strategy with ID ${id} not found`);
    }

    return strategy;
  }

  async create(createStrategyDto: CreateStrategyDto, userId: string) {
    return this.prisma.tradingStrategy.create({
      data: {
        ...createStrategyDto,
        user: { connect: { id: userId } },
      },
    });
  }

  async update(id: string, updateStrategyDto: UpdateStrategyDto, userId: string) {
    // Check if strategy exists and belongs to user
    const strategy = await this.prisma.tradingStrategy.findFirst({
      where: { id, userId },
    });

    if (!strategy) {
      throw new NotFoundException(`Trading strategy with ID ${id} not found`);
    }

    return this.prisma.tradingStrategy.update({
      where: { id },
      data: updateStrategyDto,
    });
  }

  async remove(id: string, userId: string) {
    // Check if strategy exists and belongs to user
    const strategy = await this.prisma.tradingStrategy.findFirst({
      where: { id, userId },
    });

    if (!strategy) {
      throw new NotFoundException(`Trading strategy with ID ${id} not found`);
    }

    return this.prisma.tradingStrategy.delete({
      where: { id },
    });
  }

  async setActiveStatus(id: string, userId: string, isActive: boolean) {
    // Check if strategy exists and belongs to user
    const strategy = await this.prisma.tradingStrategy.findFirst({
      where: { id, userId },
    });

    if (!strategy) {
      throw new NotFoundException(`Trading strategy with ID ${id} not found`);
    }

    return this.prisma.tradingStrategy.update({
      where: { id },
      data: { isActive },
    });
  }
}
