import { PrismaClient, User, Role } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export class UserService {
  private static readonly SALT_ROUNDS = 10;

  static async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, this.SALT_ROUNDS);
    }
    return prisma.user.create({ data: userData });
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  static async getUserByUsername(username: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { username } });
  }

  static async getUserById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  static async updateUser(id: string, updates: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>): Promise<User | null> {
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, this.SALT_ROUNDS);
    }
    return prisma.user.update({ where: { id }, data: updates });
  }

  static async updatePreferences(id: string, preferences: Record<string, any>): Promise<User | null> {
    return prisma.user.update({
      where: { id },
      data: { preferences }
    });
  }

  static async deleteUser(id: string): Promise<boolean> {
    try {
      await prisma.user.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }

  static async verifyEmail(id: string): Promise<User | null> {
    return prisma.user.update({
      where: { id },
      data: { emailVerified: true }
    });
  }

  static async updatePassword(id: string, currentPassword: string, newPassword: string): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new Error('User not found');
    }

    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      throw new Error('Current password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(newPassword, this.SALT_ROUNDS);
    return prisma.user.update({
      where: { id },
      data: { password: hashedPassword }
    });
  }

  static async listUsers(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit
      }),
      prisma.user.count()
    ]);
    
    return {
      users,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  static async updateProfile(userId: string, updates: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'password' | 'email' | 'role'>>) {
    return prisma.user.update({
      where: { id: userId },
      data: updates
    });
  }
}
