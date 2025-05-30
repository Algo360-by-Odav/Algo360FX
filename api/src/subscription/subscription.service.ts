import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
// @ts-ignore
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
// @ts-ignore
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { SubscriptionStatus } from './dto/subscription-enums';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class SubscriptionService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string) {
    // @ts-ignore - TypeScript doesn't recognize Prisma models
    return (this.prisma as unknown as PrismaClient).subscription.findMany({
      where: { userId },
    });
  }

  async findOne(id: string, userId: string) {
    // @ts-ignore
    const subscription = await (this.prisma as unknown as PrismaClient).subscription.findFirst({
      where: { id, userId },
    });

    if (!subscription) {
      throw new NotFoundException(`Subscription with ID ${id} not found`);
    }

    return subscription;
  }

  async create(userId: string, createSubscriptionDto: CreateSubscriptionDto) {
    const { planId, startDate, autoRenew, paymentMethod } = createSubscriptionDto;

    // Set default values
    const subscriptionData = {
      planId,
      startDate: startDate ? new Date(startDate) : new Date(),
      autoRenew: autoRenew !== undefined ? autoRenew : true,
      paymentMethod,
      status: SubscriptionStatus.ACTIVE,
      userId,
    };

    // Calculate end date (30 days from start by default)
    const endDate = new Date(subscriptionData.startDate);
    endDate.setDate(endDate.getDate() + 30);
    subscriptionData['endDate'] = endDate;

    // @ts-ignore
    return (this.prisma as unknown as PrismaClient).subscription.create({
      data: subscriptionData,
    });
  }

  async update(id: string, userId: string, updateSubscriptionDto: UpdateSubscriptionDto) {
    // Check if subscription exists and belongs to the user
    await this.findOne(id, userId);

    const updateData: any = { ...updateSubscriptionDto };

    // If start date is provided, recalculate end date
    if (updateSubscriptionDto.startDate) {
      const endDate = new Date(updateSubscriptionDto.startDate);
      endDate.setDate(endDate.getDate() + 30);
      updateData.endDate = endDate;
    }

    // @ts-ignore
    return (this.prisma as unknown as PrismaClient).subscription.update({
      where: { id },
      data: updateData,
    });
  }

  async cancel(id: string, userId: string) {
    // Check if subscription exists and belongs to the user
    const subscription = await this.findOne(id, userId);

    if (subscription.status !== SubscriptionStatus.ACTIVE) {
      throw new BadRequestException(`Cannot cancel subscription with status ${subscription.status}`);
    }

    // @ts-ignore
    return (this.prisma as unknown as PrismaClient).subscription.update({
      where: { id },
      data: {
        status: SubscriptionStatus.CANCELLED,
        autoRenew: false,
      },
    });
  }

  async checkSubscriptionStatus(userId: string, planId?: string) {
    const where: any = {
      userId,
      status: SubscriptionStatus.ACTIVE,
    };

    if (planId) {
      where.planId = planId;
    }

    // @ts-ignore
    const activeSubscriptions = await (this.prisma as unknown as PrismaClient).subscription.findMany({
      where,
    });

    return {
      hasActiveSubscription: activeSubscriptions.length > 0,
      subscriptions: activeSubscriptions,
    };
  }

  async renewSubscription(id: string) {
    // @ts-ignore
    const subscription = await (this.prisma as unknown as PrismaClient).subscription.findUnique({
      where: { id },
    });

    if (!subscription) {
      throw new NotFoundException(`Subscription with ID ${id} not found`);
    }

    if (!subscription.autoRenew) {
      throw new BadRequestException(`Subscription auto-renewal is disabled`);
    }

    const newEndDate = new Date(subscription.endDate);
    newEndDate.setDate(newEndDate.getDate() + 30);

    // @ts-ignore
    return (this.prisma as unknown as PrismaClient).subscription.update({
      where: { id },
      data: {
        endDate: newEndDate,
        status: SubscriptionStatus.ACTIVE,
      },
    });
  }

  async getExpiredSubscriptions() {
    const now = new Date();

    // @ts-ignore
    return (this.prisma as unknown as PrismaClient).subscription.findMany({
      where: {
        endDate: {
          lt: now,
        },
        status: SubscriptionStatus.ACTIVE,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            username: true,
          },
        },
      },
    });
  }

  async updateExpiredSubscriptions() {
    const expiredSubscriptions = await this.getExpiredSubscriptions();
    const updatedSubscriptions = [];

    for (const subscription of expiredSubscriptions) {
      let updatedSubscription;

      if (subscription.autoRenew) {
        // Process renewal (in a real app, you'd handle payment here)
        updatedSubscription = await this.renewSubscription(subscription.id);
      } else {
        // Mark as expired
        // @ts-ignore
        updatedSubscription = await (this.prisma as unknown as PrismaClient).subscription.update({
          where: { id: subscription.id },
          data: {
            status: SubscriptionStatus.EXPIRED,
          },
        });
      }

      updatedSubscriptions.push(updatedSubscription);
    }

    return updatedSubscriptions;
  }
}
