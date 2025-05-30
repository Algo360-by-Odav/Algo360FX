import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
// @ts-ignore
import { CreateProductDto } from './dto/create-product.dto';
// @ts-ignore
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductType } from './dto/product-enums';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(type?: ProductType) {
    const where: any = {};
    
    if (type) {
      where.type = type;
    }

    where.isActive = true;

    // @ts-ignore
    return (this.prisma as unknown as PrismaClient).product.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    // @ts-ignore
    const product = await (this.prisma as unknown as PrismaClient).product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async create(createProductDto: CreateProductDto) {
    // @ts-ignore
    return (this.prisma as unknown as PrismaClient).product.create({
      data: createProductDto,
    });
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    // Check if product exists
    await this.findOne(id);

    // @ts-ignore
    return (this.prisma as unknown as PrismaClient).product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  async remove(id: string) {
    // Check if product exists
    await this.findOne(id);

    // @ts-ignore
    return (this.prisma as unknown as PrismaClient).product.update({
      where: { id },
      data: { isActive: false },
    });
  }

  // Purchase related methods
  async purchase(productId: string, userId: string) {
    // Check if product exists
    const product = await this.findOne(productId);

    // Create purchase record
    // @ts-ignore
    const purchase = await (this.prisma as unknown as PrismaClient).purchase.create({
      data: {
        productId,
        userId,
        amount: product.price,
        currency: product.currency || 'USD',
      },
    });

    return {
      ...purchase,
      product,
    };
  }

  async getUserPurchases(userId: string) {
    // @ts-ignore
    return (this.prisma as unknown as PrismaClient).purchase.findMany({
      where: { userId },
      include: {
        product: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async checkUserOwnership(productId: string, userId: string) {
    // @ts-ignore
    const purchase = await (this.prisma as unknown as PrismaClient).purchase.findFirst({
      where: {
        productId,
        userId,
      },
    });

    return {
      owned: !!purchase,
      purchase,
    };
  }

  // Category and filtering methods
  async getProductsByType(type: ProductType) {
    return this.findAll(type);
  }

  async getFeaturedProducts() {
    // @ts-ignore
    return (this.prisma as unknown as PrismaClient).product.findMany({
      where: {
        isActive: true,
        metadata: {
          path: ['featured'],
          equals: true,
        },
      },
      take: 10,
    });
  }

  async searchProducts(query: string) {
    // @ts-ignore
    return (this.prisma as unknown as PrismaClient).product.findMany({
      where: {
        isActive: true,
        OR: [
          {
            name: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      },
    });
  }
}
