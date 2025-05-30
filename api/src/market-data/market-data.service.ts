import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MarketDataService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(type?: string, limit = 100) {
    const where = type ? { type } : {};
    
    return this.prisma.marketData.findMany({
      where,
      take: limit,
      orderBy: { symbol: 'asc' },
    });
  }

  async findBySymbol(symbol: string) {
    const marketData = await this.prisma.marketData.findUnique({
      where: { symbol: symbol.toUpperCase() },
    });

    if (!marketData) {
      throw new NotFoundException(`Market data for symbol ${symbol} not found`);
    }

    return marketData;
  }

  async findByType(type: string, limit = 100) {
    return this.prisma.marketData.findMany({
      where: { type },
      take: limit,
      orderBy: { symbol: 'asc' },
    });
  }

  async findBySymbols(symbols: string[]) {
    return this.prisma.marketData.findMany({
      where: {
        symbol: {
          in: symbols.map(s => s.toUpperCase()),
        },
      },
    });
  }

  async updateMarketData(symbol: string, data: any) {
    const existingData = await this.prisma.marketData.findUnique({
      where: { symbol: symbol.toUpperCase() },
    });

    if (existingData) {
      return this.prisma.marketData.update({
        where: { symbol: symbol.toUpperCase() },
        data: {
          ...data,
          lastUpdated: new Date(),
        },
      });
    } else {
      return this.prisma.marketData.create({
        data: {
          symbol: symbol.toUpperCase(),
          ...data,
          lastUpdated: new Date(),
        },
      });
    }
  }

  async seedMarketData() {
    // Seed forex data
    const forexSymbols = ['EUR/USD', 'GBP/USD', 'USD/JPY', 'USD/CHF', 'AUD/USD'];
    
    for (const symbol of forexSymbols) {
      await this.updateMarketData(symbol, {
        name: symbol,
        type: 'forex',
        price: this.randomPrice(1, 2),
        bid: this.randomPrice(1, 2),
        ask: this.randomPrice(1, 2),
        high: this.randomPrice(1, 2),
        low: this.randomPrice(1, 2),
        volume: Math.floor(Math.random() * 10000),
        change: (Math.random() - 0.5) * 0.01,
        changePercent: (Math.random() - 0.5) * 1,
      });
    }

    // Seed crypto data
    const cryptoSymbols = ['BTC/USD', 'ETH/USD', 'XRP/USD', 'LTC/USD', 'ADA/USD'];
    
    for (const symbol of cryptoSymbols) {
      await this.updateMarketData(symbol, {
        name: symbol,
        type: 'crypto',
        price: this.randomPrice(1000, 60000),
        bid: this.randomPrice(1000, 60000),
        ask: this.randomPrice(1000, 60000),
        high: this.randomPrice(1000, 60000),
        low: this.randomPrice(1000, 60000),
        volume: Math.floor(Math.random() * 1000000),
        change: (Math.random() - 0.5) * 100,
        changePercent: (Math.random() - 0.5) * 5,
      });
    }

    // Seed stock data
    const stockSymbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'FB'];
    
    for (const symbol of stockSymbols) {
      await this.updateMarketData(symbol, {
        name: symbol,
        type: 'stock',
        price: this.randomPrice(100, 3000),
        bid: this.randomPrice(100, 3000),
        ask: this.randomPrice(100, 3000),
        high: this.randomPrice(100, 3000),
        low: this.randomPrice(100, 3000),
        volume: Math.floor(Math.random() * 10000000),
        change: (Math.random() - 0.5) * 10,
        changePercent: (Math.random() - 0.5) * 3,
      });
    }

    return { message: 'Market data seeded successfully' };
  }

  private randomPrice(min: number, max: number): number {
    return +(Math.random() * (max - min) + min).toFixed(4);
  }
}
