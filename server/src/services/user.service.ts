import bcrypt from 'bcryptjs';
import prisma from '../config/database';
import { ApiError } from '../types/express';

export class UserService {
  private static readonly SALT_ROUNDS = 10;

  static async createUser(userData: {
    email: string;
    password: string;
    username: string;
    firstName?: string;
    lastName?: string;
  }) {
    const hashedPassword = await bcrypt.hash(userData.password, this.SALT_ROUNDS);

    return prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
      },
    });
  }

  static async getUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  static async getUserByUsername(username: string) {
    return prisma.user.findUnique({
      where: { username },
    });
  }

  static async getUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  static async updateUser(id: string, updates: {
    email?: string;
    password?: string;
    username?: string;
    firstName?: string;
    lastName?: string;
    preferences?: any;
  }) {
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, this.SALT_ROUNDS);
    }

    return prisma.user.update({
      where: { id },
      data: updates,
    });
  }

  static async updatePreferences(id: string, preferences: any) {
    return prisma.user.update({
      where: { id },
      data: { preferences },
    });
  }

  static async deleteUser(id: string) {
    try {
      await prisma.user.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  static async verifyEmail(id: string) {
    return prisma.user.update({
      where: { id },
      data: { emailVerified: true },
    });
  }

  static async validatePassword(user: { password: string }, inputPassword: string) {
    return bcrypt.compare(inputPassword, user.password);
  }

  static async incrementTokenVersion(id: string) {
    return prisma.user.update({
      where: { id },
      data: {
        tokenVersion: {
          increment: 1,
        },
      },
    });
  }
}
