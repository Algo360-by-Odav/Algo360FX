import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from '../auth/dto/register.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: RegisterDto & { password: string }) {
    return this.prisma.user.create({
      data: {
        ...data,
        preferences: {
          theme: 'light',
          notifications: {
            email: true,
            push: true,
            sms: false,
          },
          tradingPreferences: {
            defaultLeverage: 100,
            riskLevel: 'medium',
            autoTrade: false,
          },
          displayPreferences: {
            chartType: 'candlestick',
            timeframe: '1h',
            indicators: [],
          },
        },
      },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        isVerified: true,
        role: true,
        preferences: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        isVerified: true,
        role: true,
        preferences: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findByUsername(username: string) {
    return this.prisma.user.findUnique({
      where: { username },
    });
  }
}
