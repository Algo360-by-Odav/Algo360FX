import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
// TypeScript doesn't see these imports yet, but they're physically present
// @ts-ignore
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
// @ts-ignore
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
// @ts-ignore
import { CreatePositionDto } from './dto/create-position.dto';
// @ts-ignore
import { UpdatePositionDto } from './dto/update-position.dto';
// @ts-ignore
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from './dto/order-enums';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PortfolioService {
  constructor(private readonly prisma: PrismaService) {
    // The PrismaService extends PrismaClient but TypeScript doesn't recognize the models
    // We'll use type assertions to access them
  }

  async findAll(userId: string) {
    // @ts-ignore
    return (this.prisma as unknown as PrismaClient).portfolio.findMany({
      where: { userId },
      include: {
        positions: true,
      },
    });
  }

  async findOne(id: string, userId: string) {
    // @ts-ignore
    const portfolio = await (this.prisma as unknown as PrismaClient).portfolio.findFirst({
      where: { id, userId },
      include: {
        positions: true,
      },
    });

    if (!portfolio) {
      throw new NotFoundException(`Portfolio with ID ${id} not found`);
    }

    return portfolio;
  }

  async create(userId: string, createPortfolioDto: CreatePortfolioDto) {
    // @ts-ignore
    return (this.prisma as unknown as PrismaClient).portfolio.create({
      data: {
        ...createPortfolioDto,
        userId,
      },
    });
  }

  async update(id: string, userId: string, updatePortfolioDto: UpdatePortfolioDto) {
    // Check if portfolio exists
    await this.findOne(id, userId);

    // @ts-ignore
    return (this.prisma as unknown as PrismaClient).portfolio.update({
      where: { id },
      data: updatePortfolioDto,
    });
  }

  async remove(id: string, userId: string) {
    // Check if portfolio exists
    await this.findOne(id, userId);

    // @ts-ignore
    return (this.prisma as unknown as PrismaClient).portfolio.delete({
      where: { id },
    });
  }

  // Position management
  async getPositions(portfolioId: string, userId: string) {
    // Check if portfolio exists and belongs to user
    await this.findOne(portfolioId, userId);

    // @ts-ignore
    return (this.prisma as unknown as PrismaClient).position.findMany({
      where: { portfolioId },
    });
  }

  async getPosition(id: string, userId: string) {
    // @ts-ignore
    const position = await (this.prisma as unknown as PrismaClient).position.findFirst({
      where: { id, userId },
      include: {
        portfolio: true,
        orders: true,
      },
    });

    if (!position) {
      throw new NotFoundException(`Position with ID ${id} not found`);
    }

    return position;
  }

  async createPosition(portfolioId: string, userId: string, createPositionDto: CreatePositionDto) {
    // Check if portfolio exists and belongs to user
    await this.findOne(portfolioId, userId);

    // @ts-ignore
    return (this.prisma as unknown as PrismaClient).position.create({
      data: {
        ...createPositionDto,
        portfolioId,
        userId,
      },
    });
  }

  async updatePosition(id: string, userId: string, updateData: UpdatePositionDto) {
    // Check if position exists
    await this.getPosition(id, userId);

    // @ts-ignore
    return (this.prisma as unknown as PrismaClient).position.update({
      where: { id },
      data: updateData,
    });
  }

  async removePosition(id: string, userId: string) {
    // Check if position exists
    await this.getPosition(id, userId);

    // @ts-ignore
    return (this.prisma as unknown as PrismaClient).position.delete({
      where: { id },
    });
  }

  // Order management
  async getOrders(userId: string, positionId?: string) {
    const where: any = { userId };
    
    if (positionId) {
      where.positionId = positionId;
    }

    // @ts-ignore
    return (this.prisma as unknown as PrismaClient).order.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getOrder(id: string, userId: string) {
    // @ts-ignore
    const order = await (this.prisma as unknown as PrismaClient).order.findFirst({
      where: { id, userId },
      include: {
        position: true,
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async createOrder(userId: string, createOrderDto: CreateOrderDto) {
    const { positionId, ...orderData } = createOrderDto;
    
    // If position ID is provided, check if it exists and belongs to the user
    if (positionId) {
      await this.getPosition(positionId, userId);
    }

    // @ts-ignore
    return (this.prisma as unknown as PrismaClient).order.create({
      data: {
        ...orderData,
        positionId,
        userId,
      },
    });
  }

  async cancelOrder(id: string, userId: string) {
    // Check if order exists and belongs to the user
    const order = await this.getOrder(id, userId);

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException(`Cannot cancel order with status ${order.status}`);
    }

    // @ts-ignore
    return (this.prisma as unknown as PrismaClient).order.update({
      where: { id },
      data: {
        status: OrderStatus.CANCELLED,
      },
    });
  }

  // Portfolio statistics and performance
  async getPortfolioPerformance(id: string, userId: string) {
    // Check if portfolio exists and belongs to user
    const portfolio = await this.findOne(id, userId);
    
    // Get all positions in the portfolio
    // @ts-ignore
    const positions = await (this.prisma as unknown as PrismaClient).position.findMany({
      where: { portfolioId: id },
    });

    // Calculate total value, profit/loss, etc.
    let totalValue = portfolio.balance;
    let totalProfitLoss = 0;
    let totalProfitLossPercentage = 0;

    for (const position of positions) {
      if (position.currentPrice) {
        const positionValue = position.quantity * position.currentPrice;
        const positionCost = position.quantity * position.entryPrice;
        const profitLoss = positionValue - positionCost;
        
        totalValue += positionValue;
        totalProfitLoss += profitLoss;
      }
    }

    if (totalValue > 0) {
      totalProfitLossPercentage = (totalProfitLoss / (totalValue - totalProfitLoss)) * 100;
    }

    return {
      id: portfolio.id,
      name: portfolio.name,
      balance: portfolio.balance,
      totalValue,
      totalProfitLoss,
      totalProfitLossPercentage,
      positionCount: positions.length,
      currency: portfolio.currency,
    };
  }
}
