import { PrismaClient, Prisma, Role } from '@prisma/client';
import { Strategy } from './Strategy';
import { Portfolio } from './Portfolio';

export interface User {
  id: string;
  email: string;
  password: string;
  username: string;
  firstName: string | null;
  lastName: string | null;
  emailVerified: boolean;
  tokenVersion: number;
  role: Role;
  preferences: Prisma.JsonValue;
  createdAt: Date;
  updatedAt: Date;
  strategies?: Strategy[];
  portfolios?: Portfolio[];
}

export interface UserCreateInput {
  email: string;
  password: string;
  username?: string;
  firstName?: string | null;
  lastName?: string | null;
  role?: Role;
  preferences?: Prisma.JsonValue;
}

export interface UserUpdateInput {
  email?: string;
  password?: string;
  username?: string;
  firstName?: string | null;
  lastName?: string | null;
  role?: Role;
  preferences?: Prisma.JsonValue;
  emailVerified?: boolean;
  tokenVersion?: number;
}

export interface UserWhereInput {
  id?: string;
  email?: string;
  username?: string;
  role?: Role;
}

export interface UserWhereUniqueInput {
  id?: string;
  email?: string;
  username?: string;
}

const prisma = new PrismaClient();

export class UserModel {
  static async create(data: UserCreateInput): Promise<User> {
    return prisma.user.create({
      data: {
        ...data,
        username: data.username || data.email.split('@')[0],
        preferences: data.preferences || { theme: 'light' }
      }
    });
  }

  static async update(id: string, data: UserUpdateInput): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: {
        ...data,
        preferences: data.preferences as Prisma.JsonValue
      }
    });
  }

  static async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
      include: {
        strategies: true,
        portfolios: true
      }
    });
  }

  static async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
      include: {
        strategies: true,
        portfolios: true
      }
    });
  }

  static async findByUsername(username: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { username },
      include: {
        strategies: true,
        portfolios: true
      }
    });
  }

  static async findAll(where: UserWhereInput = {}): Promise<User[]> {
    return prisma.user.findMany({
      where,
      include: {
        strategies: true,
        portfolios: true
      }
    });
  }

  static async delete(id: string): Promise<User> {
    return prisma.user.delete({
      where: { id }
    });
  }

  static async updateTokenVersion(id: string): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: {
        tokenVersion: {
          increment: 1
        }
      }
    });
  }

  static async findUnique(where: UserWhereUniqueInput): Promise<User | null> {
    return prisma.user.findUnique({
      where,
      include: {
        strategies: true,
        portfolios: true
      }
    });
  }
}
