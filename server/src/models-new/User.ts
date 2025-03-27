import { PrismaClient, Prisma, Role } from '@prisma/client';
import { Position, PositionType, PositionStatus } from '../types-new/Position';
import { User, Portfolio } from '../types-new/User';

const prisma = new PrismaClient();

export class UserModel {
  static async create(data: {
    email: string;
    password: string;
    username?: string;
    firstName?: string | null;
    lastName?: string | null;
    role?: Role;
    preferences?: Prisma.JsonValue;
  }): Promise<User> {
    const user = await prisma.user.create({
      data: {
        ...data,
        username: data.username || data.email.split('@')[0],
        preferences: data.preferences || { theme: 'light' }
      },
      include: {
        strategies: true,
        portfolios: {
          include: {
            positions: true
          }
        }
      }
    });

    return this.transformUser(user);
  }

  private static transformUser(prismaUser: any): User {
    if (!prismaUser) throw new Error('Cannot transform null user');

    const transformedUser: User = {
      id: prismaUser.id,
      email: prismaUser.email,
      username: prismaUser.username,
      password: prismaUser.password,
      firstName: prismaUser.firstName,
      lastName: prismaUser.lastName,
      emailVerified: prismaUser.emailVerified,
      tokenVersion: prismaUser.tokenVersion,
      role: prismaUser.role,
      preferences: prismaUser.preferences || { theme: 'light' },
      createdAt: prismaUser.createdAt,
      updatedAt: prismaUser.updatedAt,
      strategies: prismaUser.strategies || [],
      portfolios: prismaUser.portfolios?.map((p: any) => ({
        ...p,
        positions: p.positions?.map((pos: any) => ({
          ...pos,
          type: pos.type as PositionType,
          status: pos.status as PositionStatus
        })) || []
      })) || []
    };

    return transformedUser;
  }

  static async findById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        strategies: true,
        portfolios: {
          include: {
            positions: true
          }
        }
      }
    });
    return user ? this.transformUser(user) : null;
  }

  static async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        strategies: true,
        portfolios: {
          include: {
            positions: true
          }
        }
      }
    });
    return user ? this.transformUser(user) : null;
  }

  static async findByUsername(username: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        strategies: true,
        portfolios: {
          include: {
            positions: true
          }
        }
      }
    });
    return user ? this.transformUser(user) : null;
  }

  static async findAll(where: Prisma.UserWhereInput = {}): Promise<User[]> {
    const users = await prisma.user.findMany({
      where,
      include: {
        strategies: true,
        portfolios: {
          include: {
            positions: true
          }
        }
      }
    });
    return users.map(user => this.transformUser(user));
  }

  static async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    const user = await prisma.user.update({
      where: { id },
      data: {
        ...data,
        preferences: data.preferences || { theme: 'light' }
      },
      include: {
        strategies: true,
        portfolios: {
          include: {
            positions: true
          }
        }
      }
    });

    return this.transformUser(user);
  }

  static async delete(id: string): Promise<User> {
    const user = await prisma.user.delete({
      where: { id },
      include: {
        strategies: true,
        portfolios: {
          include: {
            positions: true
          }
        }
      }
    });

    return this.transformUser(user);
  }

  static async updateTokenVersion(id: string): Promise<User> {
    const user = await prisma.user.update({
      where: { id },
      data: {
        tokenVersion: {
          increment: 1
        }
      },
      include: {
        strategies: true,
        portfolios: {
          include: {
            positions: true
          }
        }
      }
    });

    return this.transformUser(user);
  }

  static async findUnique(where: Prisma.UserWhereUniqueInput): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where,
      include: {
        strategies: true,
        portfolios: {
          include: {
            positions: true
          }
        }
      }
    });
    return user ? this.transformUser(user) : null;
  }
}
