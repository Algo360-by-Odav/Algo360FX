import prisma from '../config/database';
import { User as PrismaUser, Role } from '@prisma/client';

export interface IUser {
  id: string;
  email: string;
  password: string;
  username: string;
  firstName?: string;
  lastName?: string;
  emailVerified: boolean;
  tokenVersion: number;
  role: Role;
  preferences?: any;
  createdAt: Date;
  updatedAt: Date;
}

// Export type-safe database operations
export const User = {
  create: async (data: Omit<IUser, 'id' | 'createdAt' | 'updatedAt'>) => {
    return prisma.user.create({
      data
    });
  },

  findById: (id: string) => {
    return prisma.user.findUnique({
      where: { id }
    });
  },

  findByEmail: (email: string) => {
    return prisma.user.findUnique({
      where: { email }
    });
  },

  findByUsername: (username: string) => {
    return prisma.user.findUnique({
      where: { username }
    });
  },

  update: (id: string, data: Partial<Omit<IUser, 'id' | 'createdAt' | 'updatedAt'>>) => {
    return prisma.user.update({
      where: { id },
      data
    });
  },

  updateTokenVersion: (id: string) => {
    return prisma.user.update({
      where: { id },
      data: {
        tokenVersion: {
          increment: 1
        }
      }
    });
  },

  delete: (id: string) => {
    return prisma.user.delete({
      where: { id }
    });
  }
};
