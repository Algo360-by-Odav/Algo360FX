import { PrismaClient, Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils-new/jwt';
import { User, CreateUserInput, UpdateUserInput, AuthResponse } from '../types-new/User';
import { AuthError } from '../utils-new/errors';

export class AuthService {
  private prisma: PrismaClient;

  constructor(prisma?: PrismaClient) {
    this.prisma = prisma || new PrismaClient();
  }

  async register(input: CreateUserInput): Promise<AuthResponse> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: input.email }
    });

    if (existingUser) {
      throw new AuthError('User already exists');
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);

    // Generate a username if not provided
    const suggestedUsername = input.username || input.email.split('@')[0];
    let username = suggestedUsername;
    let counter = 1;

    // Check if username exists and generate a unique one if needed
    while (true) {
      const existingUsername = await this.prisma.user.findUnique({
        where: { username }
      });
      if (!existingUsername) break;
      username = `${suggestedUsername}${counter}`;
      counter++;
    }

    const userData: Prisma.UserCreateInput = {
      email: input.email,
      password: hashedPassword,
      username,
      firstName: input.firstName,
      lastName: input.lastName,
      role: input.role || 'USER',
      preferences: input.preferences ? (input.preferences as Prisma.InputJsonValue) : undefined,
      tokenVersion: 0,
      emailVerified: false
    };

    const user = await this.prisma.user.create({
      data: userData
    });

    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      accessToken: generateAccessToken(user),
      refreshToken: generateRefreshToken(user)
    };
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const user = await this.prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new AuthError('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new AuthError('Invalid credentials');
    }

    const updateData: Prisma.UserUpdateInput = {
      updatedAt: new Date() // Use updatedAt instead of lastLoginAt
    };

    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: updateData
    });

    const { password: _, ...userWithoutPassword } = updatedUser;

    return {
      user: userWithoutPassword,
      accessToken: generateAccessToken(updatedUser),
      refreshToken: generateRefreshToken(updatedUser)
    };
  }

  async getCurrentUser(userId: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new AuthError('User not found');
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async updateUser(userId: string, input: UpdateUserInput): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new AuthError('User not found');
    }

    const updateData: Prisma.UserUpdateInput = {};
    
    if (input.email) updateData.email = input.email;
    if (input.password) updateData.password = await bcrypt.hash(input.password, 10);
    if (input.role) updateData.role = input.role;
    if (input.preferences) updateData.preferences = input.preferences as Prisma.InputJsonValue;

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: updateData
    });

    const { password: _, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  async requestPasswordReset(email: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new AuthError('User not found');
    }

    // Generate reset token using the refresh token mechanism
    const resetToken = generateRefreshToken(user);

    // In a real application, you would send this token via email
    // For now, we'll just return silently
    console.log('Reset token generated:', resetToken);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      const decoded = verifyRefreshToken(token) as { userId: string };
      const user = await this.prisma.user.findUnique({
        where: { id: decoded.userId }
      });

      if (!user) {
        throw new AuthError('User not found');
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await this.prisma.user.update({
        where: { id: user.id },
        data: { 
          password: hashedPassword,
          tokenVersion: {
            increment: 1
          }
        }
      });
    } catch (error) {
      throw new AuthError('Invalid or expired token');
    }
  }

  async logout(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        tokenVersion: {
          increment: 1
        }
      }
    });
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new AuthError('User not found');
    }

    const isValidPassword = await bcrypt.compare(oldPassword, user.password);
    if (!isValidPassword) {
      throw new AuthError('Current password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { 
        password: hashedPassword,
        tokenVersion: {
          increment: 1 // Invalidate all existing tokens
        }
      }
    });
  }
}

export default AuthService;
